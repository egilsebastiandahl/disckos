import { Event } from "@/app/types/event.model"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"

interface EventTableActionsProps {
    event: Event
}

export default function EventTableActions({ event }: EventTableActionsProps) {


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
                <DropdownMenuItem>{event.published ? "Fjern publisering" : "Publiser"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                    Slett
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}