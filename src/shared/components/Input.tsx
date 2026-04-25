import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={`h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p className="text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
