import {
  Bird,
  Crown,
  Eye,
  Link2,
  type LucideIcon,
  Navigation2,
  Sparkles,
  Target,
  TreePine,
} from "lucide-react";
import { type RankGroup } from "@/app/types/course-rank.model";

export interface RankGroupStyle {
  icon: LucideIcon;
  /** Gradient stops for the medallion, light to dark. */
  light: string;
  dark: string;
  /** Rim and pip colour. */
  rim: string;
  /** Icon colour. */
  ink: string;
  /** Soft outer glow, top tiers only. */
  glow?: string;
}

/**
 * Badge look per rank group. The medallion carries its own colours, so it reads the same
 * on the light (sand) and dark (forest) themes.
 */
export const rankGroupStyles: Record<RankGroup, RankGroupStyle> = {
  "tree-hugger": {
    icon: TreePine,
    light: "#A8865F",
    dark: "#5E4632",
    rim: "#C9AC86",
    ink: "#F5ECDD",
  },
  "fairway-finder": {
    icon: Navigation2,
    light: "#D9834A",
    dark: "#8A4420",
    rim: "#EFB283",
    ink: "#FFF4EA",
  },
  "circle-crusher": {
    icon: Target,
    light: "#C9CFD4",
    dark: "#6B747C",
    rim: "#E6EAED",
    ink: "#FFFFFF",
  },
  "chain-master": {
    icon: Link2,
    light: "#EBC566",
    dark: "#A47522",
    rim: "#F7DFA0",
    ink: "#FFFBEF",
  },
  "eagle-eye": {
    icon: Eye,
    light: "#4DB596",
    dark: "#1D6653",
    rim: "#93DCC5",
    ink: "#F0FFF9",
  },
  albatross: {
    icon: Bird,
    light: "#5A8FDE",
    dark: "#23468A",
    rim: "#A4C3F2",
    ink: "#F2F7FF",
    glow: "rgba(90, 143, 222, 0.45)",
  },
  "ace-master": {
    icon: Sparkles,
    light: "#A97BE0",
    dark: "#56348C",
    rim: "#D6BDF5",
    ink: "#FBF7FF",
    glow: "rgba(169, 123, 224, 0.5)",
  },
  "disckos-elite": {
    icon: Crown,
    light: "#DD5246",
    dark: "#7A1C18",
    rim: "#F2C14E",
    ink: "#FFE7A3",
    glow: "rgba(242, 193, 78, 0.6)",
  },
};

/** "+3.4", "E", "-1.2". */
export const formatAverageToPar = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "–";
  const rounded = Math.round(n * 10) / 10;
  if (rounded === 0) return "E";
  return rounded > 0 ? `+${rounded.toFixed(1)}` : rounded.toFixed(1);
};

/** True if the latest rank change happened within the last [days] days. */
export const isRecent = (iso: string | undefined, days = 14): boolean =>
  !!iso && Date.now() - new Date(iso).getTime() < days * 24 * 60 * 60 * 1000;
