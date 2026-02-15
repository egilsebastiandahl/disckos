import { ScoringFormat } from "@/app/types/round.model";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CreateRoundScoringFormatRadioProps {
    scoringFormat: ScoringFormat;
    setScoringFormat: (format: ScoringFormat) => void;
}

export default function CreateRoundScoringFormatRadio({ scoringFormat, setScoringFormat }: CreateRoundScoringFormatRadioProps) {

    return (
        <section className="flex flex-col gap-2">
            <Label className="font-bold">FORMAT</Label>

            <RadioGroup orientation="horizontal" defaultValue={scoringFormat} onValueChange={(value) => setScoringFormat(value as ScoringFormat)}>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="stroke" id="stroke" />
                    <Label htmlFor="stroke">Stroke</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="best_shot" id="best_shot" />
                    <Label htmlFor="best_shot">Best shot</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="alternate" id="alternate" />
                    <Label htmlFor="alternate">Alternate</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="match_play" id="match_play" />
                    <Label htmlFor="match_play">Match play</Label>
                </div>

            </RadioGroup>
        </section>
    )

}