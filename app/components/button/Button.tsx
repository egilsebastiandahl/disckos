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
    default: "bg-primary text-primary-foreground hover:bg-primary/85",
    outline: "bg-transparent text-foreground border border-border hover:bg-card",
  };

  const baseClasses =
    "px-4 py-2 rounded-xl hover:cursor-pointer border border-transparent transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
