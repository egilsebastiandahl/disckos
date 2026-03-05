export interface Column<T> {
    id?: keyof (T)
    title: string
    className?: string
}