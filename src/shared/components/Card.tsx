import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
