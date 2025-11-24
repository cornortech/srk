import { useForm, useFieldArray } from "react-hook-form";
import {
  Button,
  Input,
  Checkbox,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { PrimaryButton } from "../../ReusableComponents";
import { PackageFeature } from "../../../Data/Packages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TCreatePackagePayload } from "../../../lib/types";
import { addPackageApi } from "../../../lib/apiClient";
import { AxiosError } from "axios";
import useAlert from "../../../hooks/useAlert";

interface Package {
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
  currency: "NPR" | "USD" | "EUR";
  features: PackageFeature[];
}

export function AddPackageForm({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Omit<Package, "id">>({
    defaultValues: {
      name: "",
      price: 0,
      discountedPrice: 0,
      description: "",
      currency: "NPR",
      features: [],
    },
  });

  const { invalidateQueries } = useQueryClient();

  const { fields, append, update } = useFieldArray({
    control,
    name: "features",
  });

  const { show } = useAlert();
  const { mutate: createPackageMutation } = useMutation({
    mutationFn: async (data: TCreatePackagePayload) => {
      const res = await addPackageApi({
        currency: data.currency,
        description: data.description,
        discountedPrice: data.discountedPrice,
        features: data.features,
        price: data.price,
        title: data.title,
        image: data.image,
      });
      return res;
    },
    onSuccess: () => {
      onClose(); // Call onClose after submission
      show("Package created successfully", "success");
      invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to create package", "error");
    },
  });

  const onSubmit = (data: Omit<Package, "id">) => {
    createPackageMutation({
      currency: data.currency,
      description: data.description,
      discountedPrice: data.discountedPrice,
      features: data.features.map((f) => ({
        included: f.included,
        text: f.name,
      })),
      price: data.price,
      title: data.name,
      image: "",
    });
    onClose(); // Call onClose after submission
  };

  return (
    <div className="w-full p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="space-y-4">
          {/* Package Name */}
          <div>
            <Input
              label="Package Name"
              {...register("name", { required: "Package name is required" })}
              placeholder="e.g. Basic Package"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                label="Price"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
                placeholder="e.g. 9.99"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            {/* Currency Selection */}
            <div>
              <Select
                label="Currency"
                defaultSelectedKeys={["Rs"]}
                onSelectionChange={(keys) => {
                  const selectedCurrency = Array.from(
                    keys
                  )[0] as Package["currency"];
                  setValue("currency", selectedCurrency);
                }}
              >
                <SelectItem key="NPR" value="NPR">
                  NPR
                </SelectItem>
                <SelectItem key="USD" value="USD">
                  USD ($)
                </SelectItem>
                <SelectItem key="EUR" value="EUR">
                  EUR (€)
                </SelectItem>
              </Select>
            </div>
          </div>

          {/* Discounted Price */}
          <div>
            <Input
              type="number"
              label="Discounted Price"
              step="0.01"
              {...register("discountedPrice", {
                required: "Discounted Price is required",
                valueAsNumber: true,
              })}
              placeholder="e.g. 7.99"
            />
            {errors.discountedPrice && (
              <p className="text-red-500 text-sm">
                {errors.discountedPrice.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Textarea
              label="Description"
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Enter package details..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center gap-4">
              <Input
                label="Features"
                placeholder="Add a feature"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    append({
                      name: e.currentTarget.value.trim(),
                      included: false,
                    });
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                type="button"
                onPress={() => {
                  const featureInput = document.querySelector<HTMLInputElement>(
                    'input[placeholder="Add a feature"]'
                  );
                  if (featureInput && featureInput.value.trim()) {
                    append({
                      name: featureInput.value.trim(),
                      included: false,
                    });
                    featureInput.value = "";
                  }
                }}
              >
                Add Feature
              </Button>
            </div>

            <ul className="mt-2 space-y-2">
              {fields.map((feature, index) => (
                <li key={feature.id} className="flex items-center gap-4">
                  <Checkbox
                    isSelected={feature.included}
                    onValueChange={() => {
                      update(index, {
                        ...feature,
                        included: !feature.included,
                      });
                    }}
                  />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Submit Button */}
        <PrimaryButton
          label="Save Package"
          className="w-full"
          type="submit"
          onclick={onClose}
        />
      </form>
    </div>
  );
}
