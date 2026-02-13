import { sideBarNavigationData } from "@/app/admin/data/side-bar-navigation.data"
import Link from "next/link"

export default function AdminSideBar() {


    return (
        <nav className="flex flex-col gap-4 p-4 border rounded-md">
            {sideBarNavigationData.map((e) => {
                return <Link key={e.url} href={e.url}>{e.name}</Link>
            })}
        </nav>
    )
}