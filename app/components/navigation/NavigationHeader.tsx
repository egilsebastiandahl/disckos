"use client";
import Link from "next/link";
import NavigationBar from "./NavigationBar";
import ThemeSwitch from "@/app/features/theme_switch/ThemeSwitch";
import { useScreenSize } from "@/app/hooks/useScreenSize";
import { ScreenSize } from "@/app/types/screen-size.enum";
import NavigationHeaderMobile from "./NavigationHeaderMobile";
import NewLogo from "../logo/NewLogo";

export default function NavigationHeader() {
  const screenSize = useScreenSize();

  // Return Mobile header for mobile phone
  if (screenSize == ScreenSize.XS || screenSize == ScreenSize.SM) {
    return <NavigationHeaderMobile />;
  }

  return (
    <div className="sticky top-0 bg-background z-50 flex justify-between p-4 pb-2 m-auto border-b-2 border-foreground items-center">
      <Link href={"/"} className="text-foreground text-2xl font-bold -mt-2">
        <NewLogo />
      </Link>
      <NavigationBar />
      <ThemeSwitch />
    </div>
  );
}
