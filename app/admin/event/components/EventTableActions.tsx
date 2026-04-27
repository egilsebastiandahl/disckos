import { useState } from "react";
import { eventApi } from "@/app/api/admin/event/adminEventApi";
import { Event } from "@/app/types/event.model";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import EditEventDrawer from "./EditEventDrawer";

interface EventTableActionsProps {
  event: Event;
  onRefresh?: () => void;
}

export default function EventTableActions({ event, onRefresh }: EventTableActionsProps) {
  const [editOpen, setEditOpen] = useState(false);

  const onDeleteClick = () => {
    if (confirm("Er du sikker på at du vil slette " + event.title + "?")) {
      eventApi
        .deleteEvent(event.id)
        .then(() => {
          onRefresh?.();
        })
        .catch(() => {
          alert("Noe gikk feil når eventet skulle slettes, sjekk konsoll.");
        });
    }
  };

  const onPublishOrUnpublishClick = () => {
    if (event.published) {
      eventApi.unpublishEvent(event.id).then(() => {
        onRefresh?.();
      });
    } else {
      eventApi.publishEvent(event.id).then(() => {
        onRefresh?.();
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon />
            <span className="sr-only">Åpne</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>Rediger</DropdownMenuItem>
          <DropdownMenuItem onClick={onPublishOrUnpublishClick}>
            {event.published ? "Fjern publisering" : "Publiser"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onDeleteClick}>
            Slett
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditEventDrawer isOpen={editOpen} setIsOpen={setEditOpen} event={event} onRefresh={onRefresh} />
    </>
  );
}
