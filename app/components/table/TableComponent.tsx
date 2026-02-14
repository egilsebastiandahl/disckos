import { Column } from "@/app/types/table/column.data"
import { Row } from "@/app/types/table/row.data"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useMemo } from "react"



interface TableComponentProps<T> {
    /**
     * The headers which will be displayed in the table. Type is only used as a way to get help with property values.
     */
    columnData: Column<T>[]
    /**
     * The rows of the table. Each row needs cells that matches the length of the headers.
     */
    rowData: Row[]
}

export default function TableComponent<T>({ columnData, rowData }: TableComponentProps<T>) {

    useMemo(() => {
        rowData.forEach((row) => {
            if (row.cells.length !== columnData.length) console.error("Column length and cell length mismatch! Make sure column and cell length matches.")
        })

    }, [rowData, columnData])


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columnData.map(column => {
                        return <TableHead key={column.title} className={column.className}>{column.title}</TableHead>
                    })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rowData.map((row) => {
                    return <TableRow key={row.rowId}>
                        {row.cells.map((cell, index) => {
                            return <TableCell key={index}>{cell}</TableCell>
                        })}
                    </TableRow>
                })}
            </TableBody>
        </Table>
    )
}
