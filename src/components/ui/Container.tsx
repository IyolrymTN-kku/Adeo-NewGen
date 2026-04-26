import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: "div" | "section" | "header" | "footer" | "main" | "article";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children: React.ReactNode;
};

const sizeMap = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export function Container({
  as: Tag = "div",
  size = "xl",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-10",
        sizeMap[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
