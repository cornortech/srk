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
import { useSRKFileUpload } from "@srk/shared/hooks";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

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
  const [completedUploads, setCompletedUploads] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Map<string, "pending" | "uploading" | "completed" | "error">>(new Map());
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Use SRK file upload hook for Firebase storage
  const {
    uploadFile,
    isUploading,
    deleteMultipleFiles,
  } = useSRKFileUpload("university-kyc");

  // Helper function to convert base64 to File
  const base64ToFile = (base64String: string, filename: string): File | null => {
    try {
      const arr = base64String.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      console.error('Error converting base64 to file:', e);
      return null;
    }
  };

  // Helper to update progress for a specific upload item
  const updateUploadStatus = (itemName: string, status: "pending" | "uploading" | "completed" | "error") => {
    setUploadProgress(prev => new Map(prev).set(itemName, status));
  };

  const { show } = useAlert();

  const { mutate } = useMutation({
    mutationFn: async (data: {
      frontUrl: string;
      backUrl: string;
      verificationImage: string;
      leftThumbUrl?: string;
      rightThumbUrl?: string;
      signatureUrl?: string;
    }) => {
      const userId = userDetails?._id;
      if (!userId) throw new Error("User ID not found");

      const res = await upsertKycDetailsApi(userId, {
        backImage: data.backUrl,
        frontImage: data.frontUrl,
        documentType,
        documentNumber,
        verificationImage: data.verificationImage,
        leftThumbFingerprint: data.leftThumbUrl || leftThumbFingerprint,
        rightThumbFingerprint: data.rightThumbUrl || rightThumbFingerprint,
        signature: data.signatureUrl || signature,
      });
      return res;
    },
    onSuccess: async () => {
      setLoading(false);
      setBackImage(null);
      setFrontImage(null);
      setCompletedUploads(0);
      setTotalUploads(0);
      setUploadProgress(new Map());
      setUploadedUrls([]);
      show("KYC details updated successfully", "success");
      setIsSubmitted(true);
      // Refetch user data to update the status
      await handleRefetch();
    },
    onError: async (error) => {
      console.error("API Error, rolling back uploads:", error);
      
      // Rollback: Delete all uploaded files from Firebase
      if (uploadedUrls.length > 0) {
        try {
          show("Upload completed but API failed. Rolling back files...", "error");
          await deleteMultipleFiles(uploadedUrls);
          console.log("Successfully rolled back uploaded files");
          show("Files removed from storage. Please try again.", "error");
        } catch (deleteError) {
          console.error("Error rolling back files:", deleteError);
          show("Failed to remove files from storage. Please contact support.", "error");
        }
      } else {
        show("Failed to update KYC details", "error");
      }
      
      setLoading(false);
      setCompletedUploads(0);
      setTotalUploads(0);
      setUploadProgress(new Map());
      setUploadedUrls([]);
      handleRefetch();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let frontUrlImage = kycDetails?.frontImage || "";
    let backUrlImage = kycDetails?.backImage || "";
    let verifiationImage = kycDetails?.verificationImage || "";
    let leftThumbUrl = kycDetails?.leftThumbFingerprint || "";
    let rightThumbUrl = kycDetails?.rightThumbFingerprint || "";
    let signatureUrl = kycDetails?.signature || "";

    setLoading(true);
    const uploadedFileUrls: string[] = [];

    // Define all items that need to be uploaded
    const uploadItems = [
      frontImage && { id: "front", file: frontImage, name: "Front Image" },
      backImage && { id: "back", file: backImage, name: "Back Image" },
      newVerificationImageFile && { id: "verification", file: newVerificationImageFile, name: "Verification Image" },
      leftThumbFingerprint && !leftThumbFingerprint.startsWith("http") && { id: "leftThumb", file: base64ToFile(leftThumbFingerprint, "left-thumb.png"), name: "Left Thumb Fingerprint" },
      rightThumbFingerprint && !rightThumbFingerprint.startsWith("http") && { id: "rightThumb", file: base64ToFile(rightThumbFingerprint, "right-thumb.png"), name: "Right Thumb Fingerprint" },
      signature && !signature.startsWith("http") && { id: "signature", file: base64ToFile(signature, "signature.png"), name: "Digital Signature" }
    ].filter((item) => {
      if (!item) return false;
      if (typeof item === 'string') return false;
      return item.file !== null;
    }) as Array<{ id: string; file: File; name: string }>;

    setTotalUploads(uploadItems.length);
    setCompletedUploads(0);
    
    // Initialize progress tracking
    const progressMap = new Map<string, "pending" | "uploading" | "completed" | "error">();
    uploadItems.forEach(item => {
      progressMap.set(item.id, "pending");
    });
    setUploadProgress(progressMap);

    try {
      // Upload all items sequentially with tracking
      for (const item of uploadItems) {
        if (item.file) {
          updateUploadStatus(item.id, "uploading");
          
          try {
            const { url } = await uploadFile(item.file, "image");
            uploadedFileUrls.push(url);
            
            if (item.id === "front") frontUrlImage = url;
            if (item.id === "back") backUrlImage = url;
            if (item.id === "verification") verifiationImage = url;
            if (item.id === "leftThumb") leftThumbUrl = url;
            if (item.id === "rightThumb") rightThumbUrl = url;
            if (item.id === "signature") signatureUrl = url;
            
            updateUploadStatus(item.id, "completed");
            setCompletedUploads(prev => prev + 1);
          } catch (uploadError) {
            console.error(`Error uploading ${item.name}:`, uploadError);
            updateUploadStatus(item.id, "error");
            throw new Error(`Failed to upload ${item.name}`);
          }
        }
      }

      // All uploads successful, now call the API
      if (frontUrlImage && backUrlImage && verifiationImage) {
        setUploadedUrls(uploadedFileUrls);
        
        mutate({
          backUrl: backUrlImage,
          frontUrl: frontUrlImage,
          verificationImage: verifiationImage,
          leftThumbUrl,
          rightThumbUrl,
          signatureUrl,
        });
      } else {
        // Clean up if required files are missing
        if (uploadedFileUrls.length > 0) {
          await deleteMultipleFiles(uploadedFileUrls);
        }
        
        setLoading(false);
        setCompletedUploads(0);
        setTotalUploads(0);
        setUploadProgress(new Map());
        show(
          "Please upload all the images: verification image, document front and document back",
          "error"
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      // Rollback: Delete all uploaded files if anything fails
      if (uploadedFileUrls.length > 0) {
        try {
          show("Upload failed. Rolling back files...", "error");
          await deleteMultipleFiles(uploadedFileUrls);
          console.log("Successfully rolled back uploaded files");
        } catch (deleteError) {
          console.error("Error rolling back files:", deleteError);
          show("Files could not be rolled back. Please contact support.", "error");
        }
      }
      
      setLoading(false);
      setCompletedUploads(0);
      setTotalUploads(0);
      setUploadProgress(new Map());
      setUploadedUrls([]);
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
    isSubmitted ||
    userDetails?.status === "KYC_VERIFICATION_PENDING" ||
    userDetails?.status === "PORTAL_ACTIVATED";

  const isFormDisabled = disableForm || isUploading || loading;


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
                            : kycDetails?.frontImage
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
                            : kycDetails?.backImage
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
          {(isUploading || loading || uploadProgress.size > 0) && (
            <div className="space-y-4 p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
              <h4 className="text-sm font-semibold text-white">Upload Progress</h4>
              
              <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400">
                      {completedUploads} of {totalUploads} uploaded
                    </span>
                    <span className="text-xs font-semibold text-blue-400">
                      {totalUploads > 0 ? Math.round((completedUploads / totalUploads) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                      style={{ width: totalUploads > 0 ? `${(completedUploads / totalUploads) * 100}%` : '0%' }}
                    />
                  </div>
                </div>

                {/* Upload Status Items */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                    { id: "front", label: "Front Image", visible: !!frontImage },
                    { id: "back", label: "Back Image", visible: !!backImage },
                    { id: "verification", label: "Face Verification Image", visible: !!newVerificationImageFile },
                    { id: "leftThumb", label: "Left Thumb Fingerprint", visible: !!leftThumbFingerprint && !leftThumbFingerprint.startsWith("http") },
                    { id: "rightThumb", label: "Right Thumb Fingerprint", visible: !!rightThumbFingerprint && !rightThumbFingerprint.startsWith("http") },
                    { id: "signature", label: "Digital Signature", visible: !!signature && !signature.startsWith("http") }
                  ].map(item => {
                    const status = uploadProgress.get(item.id);
                    
                    if (!item.visible) return null;

                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded border border-zinc-700">
                        {status === "completed" && (
                          <>
                            <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                            <span className="text-xs text-emerald-300 flex-1">{item.label}</span>
                            <span className="text-xs text-emerald-400 font-semibold">Done</span>
                          </>
                        )}
                        {status === "uploading" && (
                          <>
                            <div className="animate-spin">
                              <Clock size={16} className="text-blue-400 flex-shrink-0" />
                            </div>
                            <span className="text-xs text-blue-300 flex-1">{item.label}</span>
                            <span className="text-xs text-blue-400 font-semibold">Uploading...</span>
                          </>
                        )}
                        {status === "pending" && (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-zinc-600 flex-shrink-0" />
                            <span className="text-xs text-zinc-400 flex-1">{item.label}</span>
                            <span className="text-xs text-zinc-500">Pending</span>
                          </>
                        )}
                        {status === "error" && (
                          <>
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                            <span className="text-xs text-red-300 flex-1">{item.label}</span>
                            <span className="text-xs text-red-400 font-semibold">Error</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="pt-2 border-t border-zinc-700 text-xs text-zinc-400">
                <p>Status: {isUploading ? "Uploading files..." : loading ? "Processing..." : completedUploads === totalUploads ? "All files uploaded successfully!" : "Ready to upload"}</p>
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
