import { useState } from "react";
import { locationApi } from "@/app/api/admin/location/locationApi";

export default function CreateLocation() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [lat, setLat] = useState(0)
    const [lon, setLon] = useState(0)

    const onCreateClick = () => {
        locationApi.createLocation({
            name,
            description,
            coordinates: {
                lat,
                lon
            }
        }).then((res) => {
            if (res.ok) {
                alert("Location created successfully!")
                setName("")
                setDescription("")
                setLat(0)
                setLon(0)
            } else {
                alert("Failed to create location.")
            }
        })
    }

    return (<>
        <p>Create location</p>
        <input type="text" placeholder="Navn" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Beskrivelse" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Latitude" value={lat} onChange={(e) => setLat(parseFloat(e.target.value))} />
        <input type="number" placeholder="Longitude" value={lon} onChange={(e) => setLon(parseFloat(e.target.value))} />
        <button onClick={onCreateClick}>Create</button>
    </>)



}