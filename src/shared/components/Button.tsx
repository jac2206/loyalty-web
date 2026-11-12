import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
};

export function Button({
  isLoading = false,
  loadingText = "Cargando...",
  variant = "primary",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variant === "secondary" ? "jac-button-secondary" : "jac-primary bg-blue-600 text-white hover:bg-blue-700"} inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
