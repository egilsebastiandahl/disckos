import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Round } from "@/app/types/round.model";
import { Event } from "@/app/types/event.model";
import UpdateRound from "./UpdateRound";

interface RoundDrawerUpdateProps {
  currentRound: Round
  selectedEvent: Event | null
}

export default function RoundDrawerUpdate({ currentRound, selectedEvent }: RoundDrawerUpdateProps) {



  /**
   * Example data for individual rounds:
   * {
"eventId": "11111111-1111-1111-1111-111111111111",
"scoringFormat": "stroke",
"holes": [
  {
    "holeNumber": 1,
    "par": 3,
    "playerScores": [
      { "playerId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "throws": 3 },
      { "playerId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "throws": 4 }
    ]
  },
  {
    "holeNumber": 2,
    "par": 4,
    "playerScores": [
      { "playerId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "throws": 4 },
      { "playerId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "throws": 5 }
    ]
  }
]
}
   */
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Oppdater runde {currentRound.roundId} for {selectedEvent?.title}</DrawerTitle>
        <DrawerDescription>Skriv inn detaljer for den oppdaterte runden</DrawerDescription>
      </DrawerHeader>
      <UpdateRound currentRound={currentRound} selectedEvent={selectedEvent} />
    </DrawerContent>
  );

}