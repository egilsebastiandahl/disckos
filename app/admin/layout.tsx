import AdminSideBar from "./components/navigation/AdminSideBar"

interface AdminLayout {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayout) {

    return (
        <div className="flex gap-4 p-24">
            <AdminSideBar />
            <div className="max-w-3xl mx-auto space-y-8">
                {children}
            </div>
        </div>

    )
}