import useFetch from "@/app/hooks/useFetch";
import { Event } from "@/app/types/event.model";
import { dateStringToDateTimeFormatter } from "@/app/utils/dateFormatters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface EventSelectorProps {
    selectedEvent: Event | null;
    setSelectedEvent: Dispatch<SetStateAction<Event | null>>
}

export default function EventSelector({ selectedEvent, setSelectedEvent }: EventSelectorProps) {
    const { data: events } = useFetch<Event[]>("/api/admin/event")

    const onSelect = (value: string | null) => {
        if (!value) {
            setSelectedEvent(null);
            return;
        }

        const selected = events?.find((e) => String(e.id) === value);
        if (selected) {
            setSelectedEvent(selected);
        }
    };

    return (
        <Select name="Velg event" value={selectedEvent ? String(selectedEvent.id) : ""} onValueChange={(value) => onSelect(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Velg event" />
            </SelectTrigger>
            <SelectContent>
                {events?.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                        {e.title} - {e.location.name} - {dateStringToDateTimeFormatter(e.date)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
