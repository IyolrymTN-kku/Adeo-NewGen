import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border shadow-sm hover:shadow-md",
  secondary: "border shadow-sm hover:shadow-md",
  outline: "border bg-transparent hover:shadow-sm",
  ghost: "border border-transparent bg-transparent",
};

function getButtonStyle(variant: ButtonVariant): CSSProperties {
  if (variant === "primary") {
    return {
      backgroundColor: "var(--site-button-bg, var(--admin-primary, #0066FF))",
      color: "var(--site-button-text, var(--admin-primary-foreground, #FFFFFF))",
      borderColor:
        "var(--site-button-border, var(--site-button-bg, var(--admin-primary, #0066FF)))",
    };
  }

  if (variant === "secondary") {
    return {
      backgroundColor:
        "color-mix(in srgb, var(--site-button-bg, var(--admin-primary, #0066FF)) 16%, white)",
      color: "var(--site-button-bg, var(--admin-primary, #0066FF))",
      borderColor:
        "color-mix(in srgb, var(--site-button-bg, var(--admin-primary, #0066FF)) 24%, transparent)",
    };
  }

  if (variant === "outline") {
    return {
      backgroundColor: "transparent",
      color: "var(--site-button-bg, var(--admin-primary, #0066FF))",
      borderColor:
        "color-mix(in srgb, var(--site-button-bg, var(--admin-primary, #0066FF)) 38%, transparent)",
    };
  }

  return {
    backgroundColor: "transparent",
    color: "var(--site-button-bg, var(--admin-primary, #0066FF))",
  };
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  style,
  ...props
}: BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    style?: CSSProperties;
  }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{
        ...getButtonStyle(variant),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  style,
  ...props
}: BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    style?: CSSProperties;
  }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-200 hover:-translate-y-0.5",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{
        ...getButtonStyle(variant),
        ...style,
      }}
      {...props}
    >
      {children}
    </Link>
  );
}