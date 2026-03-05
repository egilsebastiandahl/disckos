"use client";
import Link from "next/link";
import NavigationBar from "./NavigationBar";
import ThemeSwitch from "@/app/features/theme_switch/ThemeSwitch";
import NavigationHeaderMobile from "./NavigationHeaderMobile";
import NewLogo from "../logo/NewLogo";

export default function NavigationHeader() {
  return (
    <>
      {/* Hide if screensize is over md */}
      <div className="md:hidden">
        <NavigationHeaderMobile />
      </div>

      {/* Hide if screensize is under md */}
      <div className="hidden md:flex sticky top-0 bg-background z-50 justify-between p-4 pb-2 m-auto border-b-2 border-foreground items-center">
        <Link href={"/"} className="text-foreground text-2xl font-bold -mt-2">
          <NewLogo />
        </Link>
        <NavigationBar />
        <ThemeSwitch />
      </div>
    </>
  );
}
