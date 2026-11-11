import { Users, MapPin, UsersRound, CalendarDays, IterationCcw, Trophy, FileUp, Inbox } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SideBarNavItem {
    url: string;
    name: string;
    icon: LucideIcon;
}

export const sideBarNavigationData: SideBarNavItem[] = [
    {
        url: "/admin/player",
        name: "Spiller",
        icon: Users,
    },
    {
        url: "/admin/location",
        name: "Lokasjon",
        icon: MapPin,
    },
    {
        url: "/admin/team",
        name: "Lag",
        icon: UsersRound,
    },
    {
        url: "/admin/event",
        name: "Event",
        icon: CalendarDays,
    },
    {
        url: "/admin/round",
        name: "Runde",
        icon: IterationCcw,
    },
    {
        url: "/admin/import",
        name: "UDisc-import",
        icon: FileUp,
    },
    {
        url: "/admin/opplastinger",
        name: "Opplastinger",
        icon: Inbox,
    },
    {
        url: "/admin/result",
        name: "Resultat",
        icon: Trophy,
    },
]