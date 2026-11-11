import type { MemberCardStatus, MemberPreviewCard, OtherPlayerStatus } from "@/app/types/member-import.model";
import { courseLabel, formatPlayed, formatToPar, toParClass } from "@/app/components/member/memberFormat";
import { cn } from "@/lib/utils";

/** Why a card isn't uploaded, in plain Norwegian. */
export const skipReason: Record<Exclude<MemberCardStatus, "READY">, string> = {
  ALREADY_UPLOADED: "Allerede i Disckos",
  EVENT_DAY: "Spilt på en Disckos-dag – en admin legger den inn i eventet",
  IN_EVENT: "Allerede lagt inn i et event",
  UNKNOWN_COURSE: "Banen finnes ikke i Disckos ennå – en admin må importere den første gang",
  NOT_ON_CARD: "Du er ikke med på kortet",
  DOUBLES: "Double-runde (støttes ikke ennå)",
  UNFINISHED: "Du fullførte ikke runden",
  INCOMPLETE_CARD: "Kortet mangler tidspunkt eller par",
  HOLE_MISMATCH: "Runden finnes i Disckos med et annet antall hull",
};

const otherLabel = (status: OtherPlayerStatus, name: string): string => {
  switch (status) {
    case "ASK":
      return `${name} blir spurt om å bekrefte`;
    case "GUEST":
      return `${name}: ikke i klubben, tas ikke med`;
    case "ALREADY":
      return `${name}: har runden fra før`;
    case "UNFINISHED":
      return `${name}: fullførte ikke`;
    case "DOUBLES":
      return `${name}: double, tas ikke med`;
  }
};

const otherClass: Record<OtherPlayerStatus, string> = {
  // Primary-coloured text is too dark on the dark theme; tint the chip instead.
  ASK: "border border-primary/50 bg-primary/15 text-foreground",
  GUEST: "bg-muted text-muted-foreground",
  ALREADY: "bg-muted text-muted-foreground",
  UNFINISHED: "bg-muted text-muted-foreground",
  DOUBLES: "bg-muted text-muted-foreground",
};

interface PlannedCardProps {
  card: MemberPreviewCard;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

/** A card that can be uploaded: your score, and what happens to everyone else on it. */
export default function PlannedCard({ card, checked, onToggle }: PlannedCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer gap-3 rounded-lg border bg-card p-3 text-sm shadow-sm transition",
        checked ? "border-primary/60" : "border-border opacity-70"
      )}
    >
      <input
        type="checkbox"
        className="mt-1 size-4 shrink-0 accent-[var(--primary)]"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-start justify-between gap-x-3">
          <div className="flex min-w-0 flex-col">
            <span className="break-words font-medium">{courseLabel(card.locationName ?? card.courseName, card.layoutName)}</span>
            <span className="text-xs text-muted-foreground">
              {formatPlayed(card.startedAt)} · {card.holes} hull
            </span>
          </div>
          {card.ownStrokes !== null && card.ownToPar !== null && (
            <span className="tabular-nums">
              <span className="text-base font-bold">{card.ownStrokes}</span>{" "}
              <span className={cn("font-semibold", toParClass(card.ownToPar))}>{formatToPar(card.ownToPar)}</span>
            </span>
          )}
        </div>
        {card.others.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {card.others.map((o, i) => (
              <li key={i} className={cn("rounded-full px-2 py-0.5 text-xs", otherClass[o.status])}>
                {otherLabel(o.status, o.playerName ?? o.udiscName)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </label>
  );
}
