import { useState, useRef } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import useAlert from "../../../hooks/useAlert";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../../store/useAuth";
import { upsertKycDetailsApi } from "../../../lib/apiClient";
import { TKyc } from "../../../lib/types/entities";
import useUploadFile from "../../../hooks/useFileUpload";

const documentTypes = [
  { label: "Citizenship", value: "citizenship" },
  { label: "Passport", value: "passport" },
  { label: "Voter Card", value: "voter_card" },
  { label: "PAN Card", value: "pan_card" },
  { label: "Birth Certificate", value: "birth_certificate" },
  { label: "National ID Card", value: "national_id" },
];

interface KYCFormProps {
  newVerificationImageFile?: File;
  kycDetails: TKyc | null;
  handleRefetch: () => void;
}

export default function KYCForm({
  handleRefetch,
  newVerificationImageFile,
  kycDetails,
}: KYCFormProps) {
  const { userDetails } = useAuthStore();
  const [documentType, setDocumentType] = useState(
    kycDetails?.documentType || ""
  );
  const [documentNumber, setDocumentNumber] = useState(
    kycDetails?.documentNumber || ""
  );
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const [completedUploads, setCompletedUploads] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const [loading, setLoading] = useState(false);

  // Enhanced upload hook with progress tracking
  const {
    uploadFile,
    isUploading,
  } = useUploadFile();

  const { show } = useAlert();

  const { mutate } = useMutation({
    mutationFn: async (data: {
      frontUrl: string;
      backUrl: string;
      verificationImage: string;
    }) => {
      const userId = userDetails?._id;
      if (!userId) return;

      const res = await upsertKycDetailsApi(userId, {
        backImage: data.backUrl,
        frontImage: data.frontUrl,
        documentType,
        documentNumber,
        verificationImage: data.verificationImage,
      });
      return res;
    },
    onSuccess: () => {
      setLoading(false);
      setBackImage(null);
      setFrontImage(null);
      setCompletedUploads(0);
      setTotalUploads(0);
      handleRefetch();
      show("KYC details updated successfully", "success");
    },
    onError: () => {
      show("Failed to update KYC details", "error");
      setLoading(false);
      setCompletedUploads(0);
      setTotalUploads(0);
      handleRefetch();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let frontUrlImage = kycDetails?.frontImage;
    let backUrlImage = kycDetails?.backImage;
    let verifiationImage = kycDetails?.verificationImage;

    setLoading(true);

    // Count files that need to be uploaded
    const filesToUpload = [
      frontImage && { file: frontImage, name: "Front Image" },
      backImage && { file: backImage, name: "Back Image" },
      newVerificationImageFile && { file: newVerificationImageFile, name: "Verification Image" }
    ].filter(Boolean);

    setTotalUploads(filesToUpload.length);
    setCompletedUploads(0);

    try {
      // Upload files sequentially with proper tracking
      if (frontImage) {
        const { url: front } = await uploadFile(frontImage, "image");
        frontUrlImage = front;
        setCompletedUploads(prev => prev + 1);
      }

      if (backImage) {
        const { url: back } = await uploadFile(backImage, "image");
        backUrlImage = back;
        setCompletedUploads(prev => prev + 1);
      }

      if (newVerificationImageFile) {
        const { url: vImage } = await uploadFile(newVerificationImageFile, "image");
        verifiationImage = vImage;
        setCompletedUploads(prev => prev + 1);
      }


      if (frontUrlImage && backUrlImage && verifiationImage) {
        mutate({
          backUrl: backUrlImage,
          frontUrl: frontUrlImage,
          verificationImage: verifiationImage,
        });
      } else {
        setLoading(false);
        setCompletedUploads(0);
        setTotalUploads(0);
        show(
          "Please upload all the images verification image, document front and document back",
          "error"
        );
      }
    } catch (error) {
      setLoading(false);
      setCompletedUploads(0);
      setTotalUploads(0);
      show("Upload failed. Please try again.", "error");
    }
  };

  const handleChangeFileInput = (
    type: "front" | "back",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "back") {
        setBackImage(file);
      } else {
        setFrontImage(file);
      }
    }
  };

  const disableForm =
    userDetails?.status === "KYC_VERIFICATION_PENDING" ||
    userDetails?.status === "PORTAL_ACTIVATED";

  const isFormDisabled = disableForm || isUploading || loading;


  return (
    <Card className="bg-bgSecondary w-full">
      <CardBody className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Upload your document for account activation
          </h2>

          {/* Upload Progress Display */}
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Document Type"
              placeholder="Select Document Type"
              defaultSelectedKeys={[documentType]}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full"
              disabled={isFormDisabled}
            >
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Document Number"
              placeholder="Enter document number"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Side Upload */}
            <div className="space-y-2">
              <div
                className={`aspect-video bg-default-100 border border-dashed border-white rounded-lg overflow-hidden transition-colors ${isFormDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:bg-default-200'
                  }`}
                onClick={() => !isFormDisabled && frontInputRef.current?.click()}
              >
                {frontImage || kycDetails?.frontImage ? (
                  <Image
                    src={
                      frontImage
                        ? URL.createObjectURL(frontImage)
                        : kycDetails?.frontImage
                    }
                    alt="Document Front Side"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-default-500 bg-bgSecondary">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="mt-2">Click to upload front side</p>
                  </div>
                )}
              </div>
              <p className="text-center font-medium text-textPrimary">
                Document Front Side
              </p>
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleChangeFileInput("front", e)}
                name="front"
                className="hidden"
                disabled={isFormDisabled}
              />
            </div>

            {/* Back Side Upload */}
            <div className="space-y-2">
              <div
                className={`aspect-video bg-default-100 border border-dashed border-white rounded-lg overflow-hidden transition-colors ${isFormDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:bg-default-200'
                  }`}
                onClick={() => !isFormDisabled && backInputRef.current?.click()}
              >
                {backImage || kycDetails?.backImage ? (
                  <Image
                    src={
                      backImage
                        ? URL.createObjectURL(backImage)
                        : kycDetails?.backImage
                    }
                    alt="Document Back Side"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center bg-bgSecondary justify-center text-default-500">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="mt-2">Click to upload back side</p>
                  </div>
                )}
              </div>
              <p className="text-center text-textPrimary font-medium">
                Document Back Side
              </p>
              <input
                ref={backInputRef}
                type="file"
                name="back"
                accept="image/*"
                onChange={(e) => handleChangeFileInput("back", e)}
                disabled={isFormDisabled}
                className="hidden"
              />
            </div>
          </div>

          {!disableForm && (
            <div className="flex justify-start">
              <Button
                type="submit"
                color="primary"
                className="w-fit"
                size="lg"
                disabled={isUploading || loading}
              >
                {isUploading
                  ? `Uploading... ${completedUploads}/${totalUploads}`
                  : loading
                    ? "Processing..."
                    : "Submit Document"
                }
              </Button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
