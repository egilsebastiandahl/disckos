import Link from "next/link";
import NavigationHeaderMobileDrawer from "./NavigationHeaderMobileDrawer";
import NewLogo from "../logo/NewLogo";
import ThemeSwitch from "@/app/features/theme_switch/ThemeSwitch";

export default function NavigationHeaderMobile() {
  return (
    <div className="sticky top-0 bg-background z-50 flex justify-between p-4 m-auto border-b-2 border-foreground items-center">
      <Link href={"/"} className="text-foreground text-2xl font-bold">
        <NewLogo />
      </Link>
      <div className="flex gap-4 items-center">
        <ThemeSwitch />
        <NavigationHeaderMobileDrawer />
      </div>
    </div>
  );
}
