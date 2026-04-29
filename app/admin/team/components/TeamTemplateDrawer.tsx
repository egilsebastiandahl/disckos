import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import CreateTeamTemplate from "./CreateTeamTemplate";

interface TeamTemplateDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onRefresh?: () => void;
}

export default function TeamTemplateDrawer({ isOpen, setIsOpen, onRefresh }: TeamTemplateDrawerProps) {
  return (
    <Drawer direction="bottom" onOpenChange={setIsOpen} open={isOpen} modal={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Opprett nytt lag</DrawerTitle>
          <DrawerDescription>Gi laget et navn. Du kan legge til spillere etterpå.</DrawerDescription>
        </DrawerHeader>
        <CreateTeamTemplate
          onSuccess={() => {
            setIsOpen(false);
            onRefresh?.();
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}
