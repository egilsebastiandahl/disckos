import Link from "next/link";
import NavigationHeaderMobileDrawer from "./NavigationHeaderMobileDrawer";
import NewLogo from "../logo/NewLogo";
import ThemeSwitch from "@/app/features/theme_switch/ThemeSwitch";
import ProfileMenu from "./ProfileMenu";

export default function NavigationHeaderMobile() {
  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-50 flex justify-between p-4 m-auto border-b border-border items-center shadow-sm">
      <Link href={"/"} className="text-foreground text-2xl font-bold">
        <NewLogo />
      </Link>
      <div className="flex gap-4 items-center">
        <ThemeSwitch />
        <ProfileMenu />
        <NavigationHeaderMobileDrawer />
      </div>
    </div>
  );
}
