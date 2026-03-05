import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({ children, onClick, className, disabled }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 bg-foreground text-background rounded-md hover:bg-background hover:text-foreground hover:cursor-pointer border border-foreground transition",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
