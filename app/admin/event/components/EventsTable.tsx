"use client";

import TableComponent from "@/app/components/table/TableComponent";
import { Event } from "@/app/types/event.model";
import { Column } from "@/app/types/table/column.data";
import { Row } from "@/app/types/table/row.data";
import EventTableActions from "./EventTableActions";
import { dateStringToDateTimeFormatter } from "@/app/utils/dateFormatters";

interface EventsTableProps {
  events: Event[] | undefined;
  onRefresh?: () => void;
}

export default function EventsTable({ events, onRefresh }: EventsTableProps) {
  const handleCopy = async (event: Event) => {
    const idStr = String(event.id);
    try {
      await navigator.clipboard.writeText(idStr).then(() => {
        console.log(idStr + " copied!");
      });
    } catch (e) {
      console.log("couldnt copy: " + idStr, e);
    }
  };

  const columns: Column<Event>[] = [
    // {
    //     id: "id",
    //     title: "ID",
    // },
    {
      id: "published",
      title: "Status",
    },
    {
      id: "title",
      title: "Tittel",
    },
    {
      id: "location",
      title: "Sted",
    },
    {
      id: "date",
      title: "Dato",
      className: "text-right",
    },
    {
      title: "Valg",
    },
  ];

  const rowData = events
    ? events.map((event) => {
        const idStr = String(event.id);
        const row: Row = {
          rowId: idStr,
          cells: [
            // <p key={idStr + "- id"} className="cursor-pointer" onClick={() => handleCopy(event)}>{idStr}</p>,
            <p key={idStr + "-status"}>{event.published ? "Publisert" : "Gjemt"}</p>,
            <p key={event.title + "- title"}>{event.title}</p>,
            <p key={event.location + "- location"}>{event.location.name}</p>,
            <p key={event.date + "- date"}>{dateStringToDateTimeFormatter(event.date)}</p>,
            <EventTableActions key={idStr + "- actions"} event={event} onRefresh={onRefresh} />,
          ],
        };
        return row;
      })
    : [];

  return <TableComponent columnData={columns} rowData={rowData} />;
}
