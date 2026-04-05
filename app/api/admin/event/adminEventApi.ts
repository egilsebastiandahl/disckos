import { clientDelete, clientPost } from "@/lib/clientApi"

const deleteEvent = async(eventId: string) => {
    return (await clientDelete("/api/admin/event/" + eventId))
}

const publishEvent = async(eventId: string) => {
    return (await clientPost("/api/admin/event/" + eventId + "/publish"))
}
const unpublishEvent = async(eventId: string) => {
    return (await clientPost("/api/admin/event/" + eventId + "/unpublish"))
}


export const eventApi = {
    deleteEvent,
    publishEvent,
    unpublishEvent
}