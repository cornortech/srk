import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { useState, useRef } from "react";
import { PanFormData, panSchema } from "../../../lib/validation";

export const classNameInput = {
  label: "text-white",
  input: "bg-bgSecondary text-white border-gray-600",
  inputWrapper: "bg-[#1b1d23]",
};

export default function PanCardForm() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PanFormData>({
    resolver: zodResolver(panSchema),
  });

  const onSubmit = async (data: PanFormData) => {
    console.log(data);
    // Handle form submission
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-xl mx-auto"
    >
      <Input
        label="Pan Number"
        placeholder="Enter Pan Number..."
        {...register("panNumber")}
        errorMessage={errors.panNumber?.message}
        isInvalid={!!errors.panNumber}
        classNames={classNameInput}
      />

      <div className="space-y-2">
        <div
          className="aspect-video bg-[#1b1d23] text-white rounded-lg overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Pan Card"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
              <p className="mt-2 text-gray-400">Click to upload Pan Card</p>
            </div>
          )}
        </div>

        <input
          type="file"
          id="panImage"
          accept="image/*"
          {...register("panImage", {
            onChange: handleImageChange,
          })}
          ref={(e) => {
            register("panImage").ref(e);
            if (fileInputRef.current) {
              // fileInputRef.current = e;
            }
          }}
          className="hidden"
        />
        {errors.panImage && (
          <p className="text-red-500 text-sm text-center">
            {errors.panImage.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          color="primary"
          className="w-full max-w-md bg-blue-800"
          size="lg"
        >
          Upload Pan Details
        </Button>
      </div>
    </form>
  );
}
