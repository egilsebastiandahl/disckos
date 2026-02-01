import Bubble from "./Bubble";

export default function InvertedBubble({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Bubble
      className={
        className
          ? `${className} bg-background text-foreground`
          : "bg-background text-foreground"
      }
    >
      {children}
    </Bubble>
  );
}
