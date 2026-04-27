import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import CreateEvent from "./CreateEvent";

interface EventDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function EventDrawer({ isOpen, setIsOpen }: EventDrawerProps) {
  return (
    <Drawer direction="bottom" onOpenChange={setIsOpen} open={isOpen} modal={false}>
      {/* <DrawerTrigger>
                <PlusIcon />
            </DrawerTrigger> */}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Lag nytt event</DrawerTitle>
          <DrawerDescription>Skriv inn detaljer for det nye eventet</DrawerDescription>
        </DrawerHeader>
        <CreateEvent />
      </DrawerContent>
    </Drawer>
  );
}
