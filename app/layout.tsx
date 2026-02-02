import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "./components/navigation";
import { ThemeProvider } from "next-themes";
import ThemeSwitch from "./features/theme_switch/ThemeSwitch";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Disckos",
  description: "Discgolf for legender",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex justify-between p-4 m-auto border-b-2 border-foreground items-baseline">
            <Link href={"/"} className="text-foreground text-2xl font-bold">
              Disckos
            </Link>
            <NavigationBar />
            <ThemeSwitch />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
