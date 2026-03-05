'use client'

import TableComponent from "@/app/components/table/TableComponent"
import useFetch from "@/app/hooks/useFetch"
import { Event } from "@/app/types/event.model"
import { Round } from "@/app/types/round.model"
import { Column } from "@/app/types/table/column.data"
import { Row } from "@/app/types/table/row.data"

interface RoundTableProps {
    selectedEvent: Event;
}

export default function RoundTable({ selectedEvent }: RoundTableProps) {

    const { data: rounds } = useFetch<Round[]>(`/api/admin/round?eventId=${selectedEvent.id}`)


    const handleCopy = async (round: Round) => {
        const idStr = String(round.roundId);
        try {
            await navigator.clipboard.writeText(idStr).then(() => {
                console.log(idStr + " copied!")
            })
        } catch (e) {
            console.log("couldnt copy: " + idStr, e)
        }
    };

    const columns: Column<Round>[] = [
        {
            id: "roundId",
            title: "Round ID",
        },
        {
            id: "eventId",
            title: "Event ID"
        },
        {
            id: "eventType",
            title: "Type"
        },
        {
            id: "scoringFormat",
            title: "Scoring Format",
        },
        // {
        //     title: "Valg"
        // }
    ]

    const rowData = rounds ? rounds.map((round) => {
        const idStr = String(round.roundId);
        const row: Row = {
            rowId: idStr,
            cells: [
                <p key={idStr + "- id"} className="cursor-pointer" onClick={() => handleCopy(round)}>{idStr}</p>,
                <p key={round.eventId + "- eventId"}>{round.eventId}</p>,
                <p key={round.eventType + "- eventType"}>{round.eventType}</p>,
                <p key={round.scoringFormat + "- scoringFormat"}>{round.scoringFormat}</p>,
                // <RoundTableActions key={idStr + "- actions"} round={round} />
            ]
        }
        return row
    }) : []

    return (<TableComponent columnData={columns} rowData={rowData} />)
}