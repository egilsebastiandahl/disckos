import { Event } from "@/app/types/event.model";

interface CreateRoundProps {
    selectedEvent: Event | null;
}

export default function CreateRound({ selectedEvent }: CreateRoundProps) {

    return (
        <div>
            <p>Her kan du opprette en ny runde for eventet {selectedEvent?.title}</p>
            {/* Implementer skjema for å opprette en ny runde her */}
        </div>
    )
}