import {
  DrawerTrigger,
  DrawerContent,
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { navigationData } from "@/app/data/navigation.data";
import Link from "next/link";
import { useState } from "react";

export default function NavigationHeaderMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = navigationData.map((e) => {
    return (
      <Link key={e.name} href={e.url} onClick={() => setIsOpen(false)}>
        {e.name}
      </Link>
    );
  });

  return (
    <Drawer direction="right" onOpenChange={setIsOpen} open={isOpen}>
      <DrawerTrigger>
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Disckos</DrawerTitle>
          <DrawerDescription>Velg fane</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col min-h-full items-center gap-8 font-bold p-16">
          {navigationItems}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
