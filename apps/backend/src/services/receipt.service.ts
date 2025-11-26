import { v4 as uuidv4 } from "uuid";
import ReceiptModel from "../model/receiptModel";
import { generateReceiptPdfBuffer } from "../utils/pdfGenerator";
import { uploader } from "../utils/cloudinary";
import PaymentMetaDataModel from "../model/paymentMetaModel";
import { IBankStatement } from "../model/bankStatement";

interface GenerateReceiptProps {
  bankStatement: {
    type: IBankStatement["type"];
    amount: number;
    description?: string;
    createdAt?: Date;
  };
  metadata: {
    referenceNumber: string;
    remarks?: string;
    paymentMetadataId: string;
  };
}

export const generateAndStoreReceipt = async ({
  bankStatement,
  metadata,
}: GenerateReceiptProps) => {
  try {
    // 1. Generate PDF buffer
    const pdfBuffer = await generateReceiptPdfBuffer({
      bankStatement: {
        amount: bankStatement.amount,
        type: bankStatement.type,
        description: bankStatement.description,
        createdAt: bankStatement.createdAt || new Date(),
      },
      metadata: {
        referenceNumber: metadata.referenceNumber,
        remarks: metadata.remarks || "N/A",
      },
    });

    // 2. Upload to Cloudinary
    const publicId = `receipts/${uuidv4()}`;
    const uploadResult = await uploader.uploadStreamToCloudinary({
      buffer: pdfBuffer,
      publicId,
      resourceType: "raw",
    });

    // 3. Create Receipt entry in DB
    const receipt = await ReceiptModel.create({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      createdFor: metadata.paymentMetadataId,
    });

    // 4. Link receipt to PaymentMetadata
    await PaymentMetaDataModel.findByIdAndUpdate(metadata.paymentMetadataId, {
      receiptId: receipt._id,
    });

    return receipt;
  } catch (error) {
    console.error("Error generating/storing receipt:", error);
    throw new Error("Failed to generate and store receipt.");
  }
};
