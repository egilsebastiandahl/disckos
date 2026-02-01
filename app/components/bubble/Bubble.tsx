export default function Bubble({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark:border-accent-foreground p-4 rounded-lg shadow-lg">
      {children}
    </div>
  );
}
