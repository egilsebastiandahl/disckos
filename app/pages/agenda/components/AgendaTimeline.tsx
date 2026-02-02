"use client";
import { Event } from "@/app/types/event.model";
import { Timeline, timelineOppositeContentClasses } from "@mui/lab";
import AgendaTimelineItem from "./AgendaTimelineItem";

interface AgendaTimelineProps {
  events: Event[];
}

export default function AgendaTimeline({ events }: AgendaTimelineProps) {
  return (
    <>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        {events.map((event, index) => (
          <AgendaTimelineItem
            key={event.id}
            event={event}
            isLastEvent={index === events.length - 1}
          />
        ))}
      </Timeline>
    </>
  );
}
