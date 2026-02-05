import Link from "next/link";
import NavigationHeaderMobileDrawer from "./NavigationHeaderMobileDrawer";

export default function NavigationHeaderMobile() {
  return (
    <div className="sticky top-0 bg-background z-50 flex justify-between p-4 m-auto border-b-2 border-foreground items-baseline">
      <Link href={"/"} className="text-foreground text-2xl font-bold">
        Disckos
      </Link>
      <NavigationHeaderMobileDrawer />
    </div>
  );
}
