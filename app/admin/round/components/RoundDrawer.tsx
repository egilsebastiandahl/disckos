import { Event } from "@/app/types/event.model";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { PlusIcon } from "lucide-react";
import { Round } from "@/app/types/round.model";
import RoundDrawerUpdate from "./RoundDrawerUpdate";
import RoundDrawerCreate from "./RoundDrawerCreate";

interface RoundDrawerProps {
    selectedEvent: Event | null;
    selectedRound: Round | null;
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function RoundDrawer({ selectedEvent, selectedRound, isOpen, setIsOpen }: RoundDrawerProps) {

    return (
        <Drawer direction="bottom" onOpenChange={setIsOpen} open={isOpen}>
            <DrawerTrigger className="hover:cursor-pointer">
                <div className="flex justify-center w-full bg-foreground text-background border border-background hover:bg-background hover:text-foreground hover:border-foreground p-4 rounded-lg" >
                    <PlusIcon />
                </div>
            </DrawerTrigger>

            {selectedRound ? (<RoundDrawerUpdate currentRound={selectedRound} selectedEvent={selectedEvent} />) : (<RoundDrawerCreate selectedEvent={selectedEvent} />)}


        </Drawer>
    )
}