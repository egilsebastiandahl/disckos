import PersonIcon from "@mui/icons-material/Person";
import { type SvgIconProps } from "@mui/material/SvgIcon";
import { createSvgIcon } from "@mui/material/utils";
import { Gender } from "@/app/types/gender.enum";

/** MUI's Person icon (same head and shoulders) with shoulder-length hair around the head. */
const HAIR =
  "M12 1.6C8.1 1.6 5.4 4.4 5.4 8C5.4 10.8 5 13.2 4.4 15C5.6 15.1 6.6 14.4 7.2 13.2V8A4.8 4.8 0 0 1 16.8 8V13.2C17.4 14.4 18.4 15.1 19.6 15C19 13.2 18.6 10.8 18.6 8C18.6 4.4 15.9 1.6 12 1.6Z";
const PERSON =
  "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4";

const PersonWithHairIcon = createSvgIcon(<path d={HAIR + PERSON} />, "PersonWithHair");

interface PlayerIconProps extends SvgIconProps {
  gender?: Gender | string | null;
}

/** A player's avatar icon: with hair for women, the plain person icon otherwise. */
export default function PlayerIcon({ gender, ...props }: PlayerIconProps) {
  return gender === Gender.FEMALE ? <PersonWithHairIcon {...props} /> : <PersonIcon {...props} />;
}
