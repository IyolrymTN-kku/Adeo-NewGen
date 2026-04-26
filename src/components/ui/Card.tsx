import { cn } from "@/lib/utils";

type CardProps = {
  className?: string;
  hover?: boolean;
  children: React.ReactNode;
};

export function Card({ className, hover = false, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        hover &&
          "transition-all duration-200 hover:-translate-y-1 hover:border-[#0066ff]/40 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
