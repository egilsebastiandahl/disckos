import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Event } from "@/app/types/event.model";
import UpdateEvent from "./UpdateEvent";

interface EditEventDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  event: Event;
  onRefresh?: () => void;
}

export default function EditEventDrawer({ isOpen, setIsOpen, event, onRefresh }: EditEventDrawerProps) {
  return (
    <Drawer direction="bottom" onOpenChange={setIsOpen} open={isOpen} modal={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Rediger event</DrawerTitle>
          <DrawerDescription>Endre detaljer for &quot;{event.title}&quot;</DrawerDescription>
        </DrawerHeader>
        <UpdateEvent
          event={event}
          onSuccess={() => {
            setIsOpen(false);
            onRefresh?.();
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}
