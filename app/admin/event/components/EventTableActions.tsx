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

interface EventTableActionsProps {
  event: Event;
}

export default function EventTableActions({ event }: EventTableActionsProps) {
  const onDeleteClick = () => {
    if (confirm("Er du sikker på at du vil slette " + event.title + "?")) {
      eventApi
        .deleteEvent(event.id)
        .then(() => {
          alert("Event slettet, refresh for å oppdatere");
        })
        .catch(() => {
          alert("Noe gikk feil når eventet skulle slettes, sjekk konsoll.");
        });
    }
  };

  const onPublishOrUnpublishClick = () => {
    if (event.published) {
      eventApi.unpublishEvent(event.id).then(() => {
        console.log("Event har blitt upublisert.");
      });
    } else {
      eventApi.publishEvent(event.id).then(() => {
        console.log("Event har blitt publisert.");
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontalIcon />
          <span className="sr-only">Åpne</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Rediger</DropdownMenuItem>
        <DropdownMenuItem onClick={onPublishOrUnpublishClick}>
          {event.published ? "Fjern publisering" : "Publiser"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDeleteClick}>
          Slett
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
