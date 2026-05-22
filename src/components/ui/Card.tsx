import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function Card({
  className,
  hover = false,
  children,
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-sm",
        hover && "transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
      style={{
        backgroundColor: "var(--site-card-bg, #1e3a5f)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "color-mix(in srgb, var(--admin-primary, #0066ff) 25%, transparent)",
        color: "var(--site-card-text, #ffffff)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}