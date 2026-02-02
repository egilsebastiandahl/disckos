import { Event } from "@/app/types/event.model";
import {
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";

interface AgendaTimelineItemProps {
  event: Event;
  isLastEvent: boolean;
}

export default function AgendaTimelineItem({
  event,
  isLastEvent,
}: AgendaTimelineItemProps) {
  const eventDateFormatted = new Date(event.date).toLocaleDateString("no", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const currentTime = new Date();
  const eventTime = new Date(event.date);
  const isPastEvent = eventTime < currentTime;

  return (
    <TimelineItem>
      {isPastEvent ? (
        <TimelineOppositeContent
          className={isPastEvent ? "opacity-50" : "text-foreground"}
        >
          <s>{eventDateFormatted}</s>
        </TimelineOppositeContent>
      ) : (
        <TimelineOppositeContent>{eventDateFormatted}</TimelineOppositeContent>
      )}

      <TimelineSeparator>
        <TimelineDot variant={isPastEvent ? "filled" : "outlined"} />
        {!isLastEvent && <TimelineConnector />}
      </TimelineSeparator>
      {isPastEvent ? (
        <TimelineContent
          className={isPastEvent ? "opacity-50" : "text-foreground"}
        >
          <s>{event.title}</s>
        </TimelineContent>
      ) : (
        <TimelineContent>{event.title}</TimelineContent>
      )}
    </TimelineItem>
  );
}
