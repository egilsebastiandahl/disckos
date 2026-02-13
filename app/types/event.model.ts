import { Placement } from "./placement.model";

export interface Event {
    id: number;
    date: string; // ISO 8601 format
    title: string;
    description: string;
    location: string;
    teamEvent: boolean;
    rounds: number;
    placements?: Placement[];
    published?: boolean
}

/**
 * 
 * Sample Event Data
 * 
 * [
  {
    "id": 0,
    "date": "2026-01-01T10:15:30Z",
    "title": "Arrangement - Nyttårscup",
    "description": "Ingen vil spille i Januar, så dette blir et rent sosialt arrangement for å starte året. Ta med noe å bite i og drikke, så stiller vi med litt snacks og varme drikker.",
    "location": "Ikke-spesifisert",
    "teamEvent": true,
    "rounds": 1,
    "placements": [
      {
        "position": 1,
        "players": ["Ola Nordmann", "Kari Nordmann"],
        "score": "E",
        "quote": "Vi vant fordi vi er best!"
      },
      {
        "position": 2,
        "players": ["Per Hansen", "Lise Hansen"],
        "score": "+2",
        "quote": "Vi kom på andreplass."
      },
      {
        "position": 3,
        "players": ["Nina Nilsen", "Knut Nilsen"],
        "score": "+3",
        "quote": "Tredjeplass er ikke så verst!"
      }
    ]
  },
  {
    "id": 1,
    "date": "2026-04-01T10:15:30Z",
    "title": "Første arrangement",
    "description": "Vårt aller første discgolf arrangement for 2026! Her skal utdelingen av årets vandrepokal skje.",
    "location": "Holmenkollen Discgolf Park",
    "teamEvent": false,
    "rounds": 1
  },
  {
    "id": 2,
    "date": "2026-05-01T10:15:30Z",
    "title": "Mai-cuppen",
    "description": "Vårt første team event for sesongen. Ta med lagkameratene dine for en morsom dag på banen! Vi spiller to runder, med annenhver tee-off.",
    "location": "Kadettangen Discgolf Park",
    "teamEvent": true,
    "rounds": 2
  },
  {
    "id": 3,
    "date": "2026-05-14T10:15:30Z",
    "title": "Vollen-Open",
    "description": "Denne gangen spiller vi først individuelt, før vi deler inn i lag for runde to. Nærmere tidspunkt kommer.",
    "location": "Vollen Discgolf Park",
    "teamEvent": true,
    "rounds": 2
  },
  {
    "id": 4,
    "date": "2026-05-28T12:00:00Z",
    "title": "Sommerturnering",
    "description": "En spennende sommerturnering med både individuelle og lagbaserte konkurranser.",
    "location": "Holmenkollen Discgolf Park",
    "teamEvent": true,
    "rounds": 2
  },
  {
    "id": 5,
    "date": "2026-10-10T11:00:00Z",
    "title": "Høstcupen",
    "description": "Avslutning av sesongen med Høstcupen. Her blir årets vinner kåret!",
    "location": "Ekeberg Discgolf Park",
    "teamEvent": false,
    "rounds": 1
  }
]

 */