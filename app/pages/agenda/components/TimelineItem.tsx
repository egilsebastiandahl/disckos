import { Event } from "@/app/types/event.model";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useMemo } from "react";

interface TimelineItemProps {
  event: Event;
  isNextEvent: boolean;
}

export default function TimelineItem({ event, isNextEvent }: TimelineItemProps) {
  const eventDateFormatted = new Date(event.date).toLocaleDateString("no", {
    month: "short",
    day: "numeric",
  });
  const isPastEvent = new Date(event.date) < new Date();

  // Determine the icon based on event status. Past, next, or upcoming.
  // If major, show crown icon instead.
  const icon = useMemo(() => {
    if (event.major) {
      return <EmojiEventsIcon className="text-amber-300" />;
    }
    if (isPastEvent) {
      return <CheckCircleOutlineIcon className="text-foreground" />;
    } else if (isNextEvent) {
      return <CircleIcon className="text-foreground" />;
    }
    return <PanoramaFishEyeIcon className="text-foreground" />;
  }, [isPastEvent, isNextEvent, event.major]);

  return (
    <div
      className={`hidden md:flex border-r-4 border-foreground mr-4 ml-4 w-24 items-center flex-col ${isPastEvent ? "opacity-50" : ""}`}
    >
      <div className="text-xs md:text-xl">{eventDateFormatted}</div>
      {icon}
    </div>
  );
}
