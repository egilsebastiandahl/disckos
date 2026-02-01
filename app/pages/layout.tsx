export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="font-sans p-8 md:p-20">{children}</main>;
}
