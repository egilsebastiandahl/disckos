import { useState } from "react";
import { locationApi } from "@/app/api/admin/location/locationApi";
import { Input } from "@/components/ui/input";
import Button from "@/app/components/button/Button";

export default function CreateLocation() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [lat, setLat] = useState(0)
    const [latString, setLatString] = useState("0")
    const [lon, setLon] = useState(0)
    const [lonString, setLonString] = useState("0")

    const onChangeLatString = (latString: string) => {
        setLatString(latString)
        const parsed = parseFloat(latString)
        if (!isNaN(parsed)) {
            setLat(parsed)
        }
    }

    const onChangeLonString = (lonString: string) => {
        setLonString(lonString)
        const parsed = parseFloat(lonString)
        if (!isNaN(parsed)) {
            setLon(parsed)
        }
    }

    const onCreateClick = () => {
        locationApi.createLocation({
            name,
            description,
            lat,
            lon
        }).then((res) => {
            if (res.ok) {
                alert("Location created successfully!")
                setName("")
                setDescription("")
                setLat(0)
                setLatString("0")
                setLon(0)
                setLonString("0")
            } else {
                alert("Failed to create location.")
            }
        })
    }

    return (<div className="flex flex-col w-full items-center justify-center p-16 gap-8">
        <Input type="text" placeholder="Navn" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="text" placeholder="Beskrivelse" value={description} onChange={(e) => setDescription(e.target.value)} />
        <section className="flex flex-row gap-4 w-full items-center">
            <label htmlFor="latInput" className="text-sm">Latitude</label>
            <Input id="latInput" type="number" placeholder="Latitude" value={latString} onChange={(e) => onChangeLatString(e.target.value)} />
        </section>
        <section className="flex flex-row gap-4 w-full items-center">
            <label htmlFor="lonInput" className="text-sm">Longitude</label>
            <Input id="lonInput" type="number" placeholder="Longitude" value={lonString} onChange={(e) => onChangeLonString(e.target.value)} />
        </section>
        <Button onClick={onCreateClick}>Opprett</Button>
    </div>)



}