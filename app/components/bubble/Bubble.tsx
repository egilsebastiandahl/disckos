import { cn } from "@/lib/utils";

export default function Bubble({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "dark:border-accent-foreground p-4 rounded-lg shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
