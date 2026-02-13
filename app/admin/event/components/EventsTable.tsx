'use client'

import TableComponent from "@/app/components/table/TableComponent"
import useFetch from "@/app/hooks/useFetch"
import { Event } from "@/app/types/event.model"
import { Column } from "@/app/types/table/column.data"
import { Row } from "@/app/types/table/row.data"
import EventTableActions from "./EventTableActions"

export default function EventsTable() {

    const { data: events } = useFetch<Event[]>("/api/event")

    const handleCopy = async (event: Event) => {
        try {
            await navigator.clipboard.writeText(event.id).then(() => {
                console.log(event.id + " copied!")
            })
        } catch (e) {
            console.log("couldnt copy: " + event.id, e)
        }
    };

    const columns: Column<Event>[] = [
        {
            id: "id",
            title: "ID",
        },
        {
            id: "title",
            title: "Tittel"
        },
        {
            id: "location",
            title: "Sted"
        },
        {
            id: "date",
            title: "Dato",
            className: "text-right"
        },
        {
            title: "Valg"
        }
    ]

    const rowData = events ? events.map((event) => {
        const row: Row = {
            rowId: event.id,
            cells: [
                <p key={event.id + "- id"} className="cursor-pointer" onClick={() => handleCopy(event)}>{event.id}</p>,
                <p key={event.title + "- title"}>{event.title}</p>,
                <p key={event.location + "- location"}>{event.location}</p>,
                <p key={event.date + "- date"}>{event.date}</p>,
                <EventTableActions key={event.id + "- actions"} event={event} />
            ]
        }
        return row
    }) : []

    return (<TableComponent columnData={columns} rowData={rowData} />)
}