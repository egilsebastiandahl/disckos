import { Event } from "@/app/types/event.model";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface TimelineItemProps {
  event: Event;
  isNextEvent: boolean;
}

export default function TimelineItem({
  event,
  isNextEvent,
}: TimelineItemProps) {
  const eventDateFormatted = new Date(event.date).toLocaleDateString("no", {
    month: "short",
    day: "numeric",
  });
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div
      className={`flex border-r-4 border-foreground mr-4 ml-4 w-24 items-center flex-col ${isPastEvent ? "opacity-50" : ""}`}
    >
      <div className="text-xl">{eventDateFormatted}</div>
      {isPastEvent ? (
        <CheckCircleOutlineIcon className="text-foreground" />
      ) : isNextEvent ? (
        <CircleIcon className="text-foreground" />
      ) : (
        <PanoramaFishEyeIcon className="text-foreground" />
      )}
    </div>
  );
}
