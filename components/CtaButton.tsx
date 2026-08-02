import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "filled" | "outline";
type Size = "default" | "sm";

const base =
  "group/cta inline-flex items-center justify-center gap-2 rounded-control font-display font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  filled: "bg-accent text-ink hover:bg-accent-hover",
  outline: "border border-line text-ink hover:border-accent hover:text-accent",
};

const sizes: Record<Size, string> = {
  default: "px-5 py-3 text-sm md:text-base",
  sm: "px-4 py-2 text-sm",
};

interface SharedProps {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
}

interface LinkCtaProps
  extends SharedProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> {
  href: string;
  external?: boolean;
}

interface ButtonCtaProps
  extends SharedProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

function IconNudge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <Icon
      size={18}
      strokeWidth={1.5}
      className="transition-transform duration-200 ease-out group-hover/cta:translate-x-0.5"
      aria-hidden
    />
  );
}

export function CtaLink({
  href,
  external,
  variant = "filled",
  size = "default",
  icon: Icon,
  className,
  children,
  ...props
}: LinkCtaProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {children}
        {Icon && <IconNudge icon={Icon} />}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
      {Icon && <IconNudge icon={Icon} />}
    </Link>
  );
}

export function CtaButton({
  variant = "filled",
  size = "default",
  icon: Icon,
  className,
  children,
  ...props
}: ButtonCtaProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {Icon && <IconNudge icon={Icon} />}
    </button>
  );
}
