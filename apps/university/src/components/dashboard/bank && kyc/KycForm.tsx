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
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getUniversityAssetUrl } from "../../../../src/lib/cdn";

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
  leftThumbFingerprint?: string;
  rightThumbFingerprint?: string;
  signature?: string;
  onGoBack?: () => void;
  isFirstTab?: boolean;
  isLastTab?: boolean;
}

/**
 * Convert File to data URL (base64)
 */
const fileToDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export default function KYCForm({
  handleRefetch,
  newVerificationImageFile,
  kycDetails,
  leftThumbFingerprint = "",
  rightThumbFingerprint = "",
  signature = "",
  onGoBack,
  isFirstTab = false,
  isLastTab = false,
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
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { show } = useAlert();

  const { mutate } = useMutation({
    mutationFn: async (data: {
      frontImageDataURL?: string;
      backImageDataURL?: string;
      verificationImageDataURL?: string;
      leftThumbFingerprintDataURL?: string;
      rightThumbFingerprintDataURL?: string;
      signatureDataURL?: string;
      frontImage?: string;
      backImage?: string;
      verificationImage?: string;
      leftThumbFingerprint?: string;
      rightThumbFingerprint?: string;
      signature?: string;
    }) => {
      const userId = userDetails?._id;
      if (!userId) throw new Error("User ID not found");

      const res = await upsertKycDetailsApi(userId, {
        documentType,
        documentNumber,
        ...data,
      });
      return res;
    },
    onSuccess: async () => {
      setLoading(false);
      setBackImage(null);
      setFrontImage(null);
      show("KYC details updated successfully", "success");
      setIsSubmitted(true);
      // Refetch user data to update the status
      await handleRefetch();
    },
    onError: (error) => {
      console.error("API Error:", error);
      show("Failed to update KYC details", "error");
      setLoading(false);
      handleRefetch();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!frontImage && !kycDetails?.frontImage) {
      show("Please upload front image", "error");
      return;
    }
    
    if (!backImage && !kycDetails?.backImage) {
      show("Please upload back image", "error");
      return;
    }
    
    if (!newVerificationImageFile && !kycDetails?.verificationImage) {
      show("Please upload verification image", "error");
      return;
    }

    setLoading(true);

    try {
      // Convert new images to data URLs
      const frontImageDataURL = frontImage ? await fileToDataURL(frontImage) : undefined;
      const backImageDataURL = backImage ? await fileToDataURL(backImage) : undefined;
      const verificationImageDataURL = newVerificationImageFile ? await fileToDataURL(newVerificationImageFile) : undefined;
      
      // Convert optional biometric data from base64 strings to data URLs if they're new (not URLs)
      const leftThumbFingerprintDataURL = leftThumbFingerprint && !leftThumbFingerprint.startsWith("http") && leftThumbFingerprint.startsWith("data:") 
        ? leftThumbFingerprint 
        : undefined;
      const rightThumbFingerprintDataURL = rightThumbFingerprint && !rightThumbFingerprint.startsWith("http") && rightThumbFingerprint.startsWith("data:")
        ? rightThumbFingerprint
        : undefined;
      const signatureDataURL = signature && !signature.startsWith("http") && signature.startsWith("data:")
        ? signature
        : undefined;

      // Send data to backend
      mutate({
        frontImageDataURL,
        backImageDataURL,
        verificationImageDataURL,
        leftThumbFingerprintDataURL,
        rightThumbFingerprintDataURL,
        signatureDataURL,
        // Keep existing paths if not updating
        frontImage: kycDetails?.frontImage,
        backImage: kycDetails?.backImage,
        verificationImage: kycDetails?.verificationImage,
        leftThumbFingerprint: kycDetails?.leftThumbFingerprint,
        rightThumbFingerprint: kycDetails?.rightThumbFingerprint,
        signature: kycDetails?.signature,
      });
    } catch (error) {
      console.error("Error preparing submission:", error);
      show("Failed to process images", "error");
      setLoading(false);
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
    isSubmitted ||
    userDetails?.status === "KYC_VERIFICATION_PENDING" ||
    userDetails?.status === "PORTAL_ACTIVATED";

  const isFormDisabled = disableForm || loading;


  return (
    <Card className="bg-bgSecondary w-full">
      <CardBody className="w-full">


  return (
    <Card className="bg-bgSecondary w-full">
      <CardBody className="w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <FileText size={24} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">KYC Details</h3>
            <p className="text-sm text-zinc-400">Complete your KYC by uploading identity documents</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-2 mb-6">
          <h4 className="text-sm font-semibold text-emerald-300">Document Upload Requirements:</h4>
          <ul className="text-sm text-emerald-200 space-y-1 ml-4">
            <li className="list-disc">Upload clear, legible photos of both sides of your document</li>
            <li className="list-disc">Ensure the entire document is visible in the frame</li>
            <li className="list-disc">Good lighting and no glare on the document</li>
            <li className="list-disc">Accepted formats: JPG, PNG, PDF</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type & Number Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Document Information</h4>
    
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
          </div>

          {/* Document Images Upload Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Document Images</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Front Side Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Front Side</label>
                <div
                  className={`aspect-video bg-zinc-900/50 border-2 border-dashed rounded-lg overflow-hidden transition-all ${
                    isFormDisabled
                      ? 'cursor-not-allowed opacity-50 border-zinc-700'
                      : 'cursor-pointer border-zinc-600 hover:border-blue-500 hover:bg-zinc-900/80'
                  }`}
                  onClick={() => !isFormDisabled && frontInputRef.current?.click()}
                >
                  {frontImage ||kycDetails?.frontImage ? (
                    <div className="relative w-full h-full group">
                      <Image
                        src={
                          frontImage
                            ? URL.createObjectURL(frontImage)
                            : getUniversityAssetUrl(kycDetails?.frontImage)
                        }
                        alt="Document Front Side"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="flex items-center gap-1 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 px-3 py-1 rounded">
                          <CheckCircle size={14} />
                          <span className="text-xs font-medium">Uploaded</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="text-sm font-medium">Click to upload</p>
                    </div>
                  )}
                </div>
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
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Back Side</label>
                <div
                  className={`aspect-video bg-zinc-900/50 border-2 border-dashed rounded-lg overflow-hidden transition-all ${
                    isFormDisabled
                      ? 'cursor-not-allowed opacity-50 border-zinc-700'
                      : 'cursor-pointer border-zinc-600 hover:border-blue-500 hover:bg-zinc-900/80'
                  }`}
                  onClick={() => !isFormDisabled && backInputRef.current?.click()}
                >
                  {backImage || kycDetails?.backImage ? (
                    <div className="relative w-full h-full group">
                      <Image
                        src={
                          backImage
                            ? URL.createObjectURL(backImage)
                            : getUniversityAssetUrl(kycDetails?.backImage)
                        }
                        alt="Document Back Side"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="flex items-center gap-1 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 px-3 py-1 rounded">
                          <CheckCircle size={14} />
                          <span className="text-xs font-medium">Uploaded</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="text-sm font-medium">Click to upload</p>
                    </div>
                  )}
                </div>
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
          </div>

          {/* Tips */}
          <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-2">
              Tips for document upload:
            </h4>
            <ul className="text-xs text-zinc-500 space-y-1">
              <li>✓ Use high-quality, well-lit photos</li>
              <li>✓ Keep documents straight and fully visible</li>
              <li>✓ Avoid glare and shadows on documents</li>
              <li>✓ Ensure all text is clearly readable</li>
            </ul>
          </div>

          {/* Upload Progress Display */}
          {loading && (
            <div className="space-y-2 p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin">
                  <Clock size={16} className="text-blue-400" />
                </div>
                <span className="text-sm text-blue-300">Processing your KYC details...</span>
              </div>
            </div>
          )}

          {!disableForm && (
            <div className="space-y-4">
              <div className="flex justify-start">
                <Button
                  type="submit"
                  color="primary"
                  className="w-fit"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit Document"}
                </Button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4 border-t border-zinc-700">
                <Button
                  onClick={onGoBack}
                  disabled={isFirstTab}
                  color="primary"
                  variant="bordered"
                  size="lg"
                >
                  ← Go Back
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
