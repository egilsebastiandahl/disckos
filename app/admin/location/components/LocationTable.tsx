'use client'

import TableComponent from "@/app/components/table/TableComponent"
import useFetch from "@/app/hooks/useFetch"
import { Event } from "@/app/types/event.model"
import { Location } from "@/app/types/location.model"
import { Column } from "@/app/types/table/column.data"
import { Row } from "@/app/types/table/row.data"
import { dateStringToDateTimeFormatter } from "@/app/utils/dateFormatters"

export default function LocationTable() {

    const { data: locations } = useFetch<Location[]>("/api/admin/location")


    const handleCopy = async (location: Location) => {
        const idStr = String(location.locationId);
        try {
            await navigator.clipboard.writeText(idStr).then(() => {
                console.log(idStr + " copied!")
            })
        } catch (e) {
            console.log("couldnt copy: " + idStr, e)
        }
    };

    const columns: Column<Location>[] = [
        {
            id: "locationId",
            title: "ID",
        },
        {
            id: "name",
            title: "Tittel"
        },
        {
            id: "description",
            title: "Beskrivelse"
        },
        {
            title: "Valg"
        }
    ]

    const rowData = locations ? locations.map((location) => {
        const idStr = String(location.locationId);
        const row: Row = {
            rowId: idStr,
            cells: [
                <p key={idStr + "- id"} className="cursor-pointer" onClick={() => handleCopy(location)}>{idStr}</p>,
                <p key={location.name + "- name"}>{location.name}</p>,
                <p key={location.description + "- description"}>{location.description}</p>,
                // <LocationTableActions key={idStr + "- actions"} location={location} />
            ]
        }
        return row
    }) : []

    return (<TableComponent columnData={columns} rowData={rowData} />)
}