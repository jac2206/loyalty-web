import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`jac-card p-6 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
