export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="font-sans px-4 py-8 md:px-8 md:py-20">{children}</main>;
}
