import { Event } from "@/app/types/event.model";
import { Round } from "@/app/types/round.model";

interface UpdateRoundProps {
    currentRound: Round;
    selectedEvent: Event | null;
}

export default function UpdateRound({ currentRound, selectedEvent }: UpdateRoundProps) {

    return (
        <div>
            <p>Her kan du oppdatere runden {currentRound.roundId} for eventet {selectedEvent?.title}</p>
            {/* Implementer skjema for å oppdatere runden her */}
        </div>
    )
}