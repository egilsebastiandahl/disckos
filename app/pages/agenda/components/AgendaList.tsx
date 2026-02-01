import eventsData from "@/app/data/events.json";
import { Event } from "@/app/types/event.model";

export default function AgendaList() {
  const agendaItems: Event[] = eventsData;

  return (
    <ul>
      {agendaItems.map((item) => (
        <li key={item.id}>
          <h3>{item.title}</h3>
          <p>{new Date(item.date).toLocaleDateString()}</p>
          <p>{item.description}</p>
          <p>Lokasjon: {item.location}</p>
          <p>Lagspill: {item.teamEvent ? "Ja" : "Nei"}</p>
          <p>Antall runder: {item.rounds}</p>
        </li>
      ))}
    </ul>
  );
}
