import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import CreateLocation from "./CreateLocation";

interface LocationDrawerProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function LocationDrawer({ isOpen, setIsOpen }: LocationDrawerProps) {

    return (
        <Drawer direction="bottom" onOpenChange={setIsOpen} open={isOpen}>
            {/* <DrawerTrigger>
                <PlusIcon />
            </DrawerTrigger> */}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Lag ny lokasjon</DrawerTitle>
                    <DrawerDescription>Skriv inn detaljer for den nye lokasjonen</DrawerDescription>
                </DrawerHeader>
                <CreateLocation />
            </DrawerContent>
        </Drawer>
    )
}