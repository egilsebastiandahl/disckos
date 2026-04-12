import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
}

export default function Button({ children, onClick, className, disabled, variant = "default" }: ButtonProps) {
  const variantClasses = {
    default: "bg-foreground text-background hover:bg-background hover:text-foreground",
    outline: "bg-transparent text-foreground border border-foreground hover:bg-foreground hover:text-background",
  };

  const baseClasses = "px-4 py-2 rounded-md hover:cursor-pointer border border-foreground transition";

  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
