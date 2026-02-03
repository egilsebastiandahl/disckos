import Link from "next/link";
import NavigationBar from "./NavigationBar";
import ThemeSwitch from "@/app/features/theme_switch/ThemeSwitch";

export default function NavigationHeader() {
  return (
    <div className="sticky top-0 bg-background z-50 flex justify-between p-4 m-auto border-b-2 border-foreground items-baseline">
      <Link href={"/"} className="text-foreground text-2xl font-bold">
        Disckos
      </Link>
      <NavigationBar />
      <ThemeSwitch />
    </div>
  );
}
