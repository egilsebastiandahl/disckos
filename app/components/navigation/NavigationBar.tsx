import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navigationData } from "@/app/data/navigation.data";

const NavigationBar = () => {
  const navigationMenuItems = navigationData.map((e) => {
    return (
      <NavigationMenuItem key={e.name}>
        <NavigationMenuLink
          className={navigationMenuTriggerStyle()}
          href={e.url}
        >
          {e.name}
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  });

  return (
    <NavigationMenu className="font-sans">
      <NavigationMenuList>{navigationMenuItems}</NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationBar;
