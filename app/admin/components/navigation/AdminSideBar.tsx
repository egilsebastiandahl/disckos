import { sideBarNavigationData } from "@/app/admin/data/side-bar-navigation.data"
import Link from "next/link"

export default function AdminSideBar() {


    return (
        <div className="flex flex-col gap-4">
            {sideBarNavigationData.map((e) => {
                return <Link key={e.url} href={e.url}>{e.name}</Link>
            })}
        </div>
    )
}