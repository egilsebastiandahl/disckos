/* eslint-disable @typescript-eslint/no-explicit-any */
import useFetch from "@/app/hooks/useFetch";
import { Event } from "@/app/types/event.model";
import { Player, SimplePlayer } from "@/app/types/player.model";
import { useComboboxAnchor } from "@/components/ui/combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlayersInRoundChooserProps {
    selectedEvent: Event | null;
    activePlayers: SimplePlayer[];
    setActivePlayers: (players: SimplePlayer[]) => void;
}

export default function PlayersInRoundChooser({ selectedEvent, activePlayers, setActivePlayers }: PlayersInRoundChooserProps) {

    // Implementer logikk for å vise en liste over spillere i selectedEvent og la admin velge hvilke spillere som skal være med i runden
    // Når en spiller velges eller fjernes, oppdater activePlayers ved å bruke setActivePlayers
    const { data: players } = useFetch<Player[]>("/api/player")
    const simplePlayers: SimplePlayer[] = players ? players.map(p => ({ id: p.id, name: p.name })) : [];

    const anchor = useComboboxAnchor()

    const handleActivePlayersChange = (playerId: any) => {
        console.log("Toggling player with ID:", playerId);
        const player = players?.find(p => p.id === playerId);
        if (!player) return;
        const isActive = activePlayers.some(p => p.id === playerId);
        if (isActive) {
            setActivePlayers(activePlayers.filter(p => p.id !== playerId));
        } else {
            setActivePlayers([...activePlayers, { id: player.id, name: player.name }]);
        }
    }

    const onPlayerSelect = (value: string) => {
        const player = players?.find(p => p.id === value);
        if (!player) return;
        const isActive = activePlayers.some(p => p.id === value);
        if (isActive) {
            setActivePlayers(activePlayers.filter(p => p.id !== value));
        } else {
            setActivePlayers([...activePlayers, { id: player.id, name: player.name }]);
        }
    }



    return (

        <div className="w-full">
            <Select name="Velg spiller" value={undefined} onValueChange={(value) => onPlayerSelect(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Velg spillere" />
                </SelectTrigger>
                <SelectContent>
                    {players?.map((e) => (
                        <SelectItem key={e.id} value={String(e.id)}>
                            {e.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <h3 className="mt-4 font-semibold">Aktive spillere: {activePlayers.length}</h3>
            <ul className="list-disc list-inside">
                {activePlayers.map(player => player.name).join(", ")}
            </ul>
        </div>
    )
    // return (
    //     <Combobox
    //         multiple
    //         autoHighlight
    //         items={simplePlayers}
    //         onValueChange={e => handleActivePlayersChange(e)}
    //     >
    //         <ComboboxChips ref={anchor} className="w-full max-w-xs">
    //             <ComboboxValue>
    //                 {(values) => (
    //                     <React.Fragment>
    //                         {values.map((value: string) => (
    //                             <ComboboxChip key={value}>{value}</ComboboxChip>
    //                         ))}
    //                         <ComboboxChipsInput />
    //                     </React.Fragment>
    //                 )}
    //             </ComboboxValue>
    //         </ComboboxChips>
    //         <ComboboxContent anchor={anchor} className="absolute z-10">
    //             <ComboboxEmpty>Ingen spillere funnet.</ComboboxEmpty>
    //             <ComboboxList>
    //                 {(item: SimplePlayer) => (
    //                     <ComboboxItem key={item.id} value={item.id}>
    //                         {item.name}
    //                     </ComboboxItem>
    //                 )}
    //             </ComboboxList>
    //         </ComboboxContent>
    //     </Combobox>
    // )
}