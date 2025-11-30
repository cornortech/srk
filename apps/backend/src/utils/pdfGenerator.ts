import { IBankStatement } from '../model/bankStatement';
import { IPaymentMetadata } from '../model/paymentMetaModel';

export const generateReceiptPdfBuffer = async ({
  bankStatement,
  metadata,
}: {
  bankStatement: Pick<
    IBankStatement,
    'type' | 'amount' | 'description' | 'createdAt'
  >;
  metadata: Pick<IPaymentMetadata, 'referenceNumber' | 'remarks'>;
}): Promise<Buffer> => {
  const pdfContent = `
    SRK Bank - Transaction Receipt
    -------------------------------
    Transaction Type: ${bankStatement.type}
    Amount: NPR ${bankStatement.amount}
    Reference Number: ${metadata.referenceNumber}
    Description: ${bankStatement.description || 'N/A'}
    Remarks: ${metadata.remarks || 'N/A'}
    Date: ${
      bankStatement.createdAt?.toLocaleString() || new Date().toLocaleString()
    }
  `;

  return Buffer.from(pdfContent, 'utf-8'); // Replace with real PDF generation later
};
