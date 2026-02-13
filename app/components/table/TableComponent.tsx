import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"
import { useMemo } from "react"

interface ColumnData {
    title: string
    valueProp: string
    className?: string
}

interface RowData {
    rowId: string
    cells: React.ReactNode[]
}

interface TableComponentProps {
    columnData: ColumnData[]
    rowData: RowData[]
}

export default function TableComponent({ columnData, rowData }: TableComponentProps) {

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
