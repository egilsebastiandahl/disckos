import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NavigationBar = () => {
  return (
    <NavigationMenu className="font-sans">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/pages/results"
          >
            Resultater
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/pages/agenda"
          >
            Agenda
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/pages/favorites"
          >
            Favoritter
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/pages/discfinder"
          >
            DiscFinder
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/pages/teamgenerator"
          >
            Lag-generator
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/pages/videos"
          >
            Videoer
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/pages/lokasjoner"
          >
            Lokasjoner
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    // <div className="flex gap-4 p-4">
    //     <a href="/pages/results">Resultater</a>
    //     <a href="/pages/discfinder">Discfinder</a>
    //     <a href="/pages/lokasjoner">Lokasjoner</a>
    // </div>
  );
};

export default NavigationBar;
