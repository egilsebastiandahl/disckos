import Button from "@/app/components/button/Button";
import { ShotType } from "../types/shot-type.enum";
import { HTMLAttributes } from "react";

interface ShotButtonsProps extends HTMLAttributes<HTMLDivElement> {
  onPress: (type: ShotType) => void;
}

export default function ShotButtons({ onPress, ...divProps }: ShotButtonsProps) {
  return (
    <div className="flex gap-4" {...divProps}>
      <Button onClick={() => onPress(ShotType.SINGLE)}>Single</Button>
      <Button onClick={() => onPress(ShotType.TEAM)}>Team</Button>
      <Button onClick={() => onPress(ShotType.WILDCARD)}>Wildcard</Button>
    </div>
  );
}
