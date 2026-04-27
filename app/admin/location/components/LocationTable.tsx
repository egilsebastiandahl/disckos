"use client";

import TableComponent from "@/app/components/table/TableComponent";
import useAdminFetch from "@/app/hooks/useAdminFetch";
import { Location } from "@/app/types/location.model";
import { Column } from "@/app/types/table/column.data";
import { Row } from "@/app/types/table/row.data";

export default function LocationTable() {
  const { data: locations } = useAdminFetch<Location[]>("/api/admin/location");

  const handleCopy = async (location: Location) => {
    const idStr = String(location.id);
    try {
      await navigator.clipboard.writeText(idStr).then(() => {
        console.log(idStr + " copied!");
      });
    } catch (e) {
      console.log("couldnt copy: " + idStr, e);
    }
  };

  const columns: Column<Location>[] = [
    {
      id: "id",
      title: "ID",
    },
    {
      id: "name",
      title: "Tittel",
    },
    {
      id: "description",
      title: "Beskrivelse",
    },
    {
      title: "Valg",
    },
  ];

  const rowData = locations
    ? locations.map((location) => {
        const idStr = String(location.id);
        const row: Row = {
          rowId: idStr,
          cells: [
            <p key={idStr + "- id"} className="cursor-pointer" onClick={() => handleCopy(location)}>
              {idStr}
            </p>,
            <p key={location.name + "- name"}>{location.name}</p>,
            <p key={location.description + "- description"}>{location.description}</p>,
            <p key={idStr + "- actions"}>Actions here</p>,
            // <LocationTableActions key={idStr + "- actions"} location={location} />
          ],
        };
        return row;
      })
    : [];

  return <TableComponent columnData={columns} rowData={rowData} />;
}
