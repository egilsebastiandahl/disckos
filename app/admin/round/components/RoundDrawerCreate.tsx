import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import CreateRound from "./CreateRound";
import { Event } from "@/app/types/event.model";

interface RoundDrawerCreateProps {
  selectedEvent: Event | null;
}

export default function RoundDrawerCreate({ selectedEvent }: RoundDrawerCreateProps) {


  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Lag ny runde</DrawerTitle>
        <DrawerDescription>Skriv inn detaljer for den nye runden</DrawerDescription>
      </DrawerHeader>
      <CreateRound selectedEvent={selectedEvent} />
    </DrawerContent>
  );

}