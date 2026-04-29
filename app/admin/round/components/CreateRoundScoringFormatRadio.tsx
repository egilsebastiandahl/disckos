import { ScoringFormat } from "@/app/types/round.model";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";

interface CreateRoundScoringFormatRadioProps {
  scoringFormat: ScoringFormat;
  setScoringFormat: (format: ScoringFormat) => void;
}

const formatDescriptions: Record<ScoringFormat, string> = {
  stroke: "Hver spiller teller alle kast. Lag: sum av alle spilleres kast.",
  best_shot: "Alle kaster, beste kast velges. Laget spiller videre fra den.",
  worst_shot: "Alle kaster, dårligste kast velges. Laget spiller videre fra den.",
  alternate: "Spillerne bytter på å kaste. Én disc, annenhver spiller.",
  match_play: "Hull-for-hull-konkurranse. Vinner hullet, ikke totalt antall kast.",
};

export default function CreateRoundScoringFormatRadio({
  scoringFormat,
  setScoringFormat,
}: CreateRoundScoringFormatRadioProps) {
  return (
    <section className="flex flex-col gap-2">
      <Label className="font-bold">FORMAT</Label>

      <RadioGroup
        orientation="horizontal"
        defaultValue={scoringFormat}
        onValueChange={(value) => setScoringFormat(value as ScoringFormat)}
      >
        <div className="flex items-center gap-3">
          <RadioGroupItem value="stroke" id="stroke" />
          <Label htmlFor="stroke" className="flex items-center gap-1.5">
            Stroke
            <span title={formatDescriptions.stroke}>
              <Info className="size-3.5 text-muted-foreground" />
            </span>
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="best_shot" id="best_shot" />
          <Label htmlFor="best_shot" className="flex items-center gap-1.5">
            Best shot
            <span title={formatDescriptions.best_shot}>
              <Info className="size-3.5 text-muted-foreground" />
            </span>
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="alternate" id="alternate" />
          <Label htmlFor="alternate" className="flex items-center gap-1.5">
            Alternate
            <span title={formatDescriptions.alternate}>
              <Info className="size-3.5 text-muted-foreground" />
            </span>
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="match_play" id="match_play" />
          <Label htmlFor="match_play" className="flex items-center gap-1.5">
            Match play
            <span title={formatDescriptions.match_play}>
              <Info className="size-3.5 text-muted-foreground" />
            </span>
          </Label>
        </div>
      </RadioGroup>

      {/* Active format description */}
      <p className="text-xs text-muted-foreground mt-1 italic">{formatDescriptions[scoringFormat]}</p>
    </section>
  );
}
