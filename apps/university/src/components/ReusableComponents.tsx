import { Button } from "@nextui-org/react";
import clsx from "clsx";

export const PrimaryButton = ({
  label,
  className,
  radius,
  onclick,
  type,
  disabled,
}: {
  disabled?: boolean;
  label: string;
  className?: string;
  onclick?: ((e: unknown) => void) | undefined;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  type?: "button" | "submit" | "reset" | undefined;
}) => {
  return (
    <Button
      type={type}
      isDisabled={!!disabled}
      isLoading={!!disabled}
      disableRipple={!!disabled}
      aria-disabled={!!disabled}
      disableAnimation={!!disabled}
      onPress={onclick}
      disabled={!!disabled}
      className={clsx(
        className,
        "px-10 font-semibold text-black bg-custom-gradient"
      )}
      radius={radius}
    >
      {label}
    </Button>
  );
};
