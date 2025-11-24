import { Image } from "@nextui-org/react";
import React, { useRef } from "react";

interface FileUploadProps {
  label: string;
  onImageUpload: (file: File) => void;
  image?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onImageUpload,
  image,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-2">
      <div
        className="aspect-video bg-default-100 border border-dashed border-white rounded-lg overflow-hidden cursor-pointer hover:bg-default-200 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {image ? (
          <Image
            src={URL.createObjectURL(image)}
            alt="Uploaded File"
            className="w-full h-full object-cover"
            width={500}
            height={300}
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
            <p className="mt-2">Click to upload {label}</p>
          </div>
        )}
      </div>
      <p className="text-center font-medium text-textPrimary">{label}</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onImageUpload(file);
          }
        }}
        className="hidden"
        required
      />
    </div>
  );
};

export default FileUpload;
