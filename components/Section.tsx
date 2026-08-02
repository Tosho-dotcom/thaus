import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({
  id,
  children,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24 lg:py-32", className)}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1200px] px-6 md:px-10",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
