import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
};

export function Button({
  isLoading = false,
  loadingText = "Cargando...",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
