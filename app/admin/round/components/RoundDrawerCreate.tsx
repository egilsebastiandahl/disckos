import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import CreateRound from "./CreateRound";
import { Event } from "@/app/types/event.model";

interface RoundDrawerCreateProps {
  selectedEvent: Event | null;
}

export default function RoundDrawerCreate({ selectedEvent }: RoundDrawerCreateProps) {



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
        <DrawerTitle>Lag ny runde</DrawerTitle>
        <DrawerDescription>Skriv inn detaljer for den nye runden</DrawerDescription>
      </DrawerHeader>
      <CreateRound selectedEvent={selectedEvent} />
    </DrawerContent>
  );

}