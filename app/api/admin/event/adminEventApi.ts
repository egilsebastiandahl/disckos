import { clientDelete, clientPost, clientPut } from "@/lib/clientApi"

const deleteEvent = async(eventId: string) => {
    return (await clientDelete("/api/admin/event/" + eventId))
}

const publishEvent = async(eventId: string) => {
    return (await clientPost("/api/admin/event/" + eventId + "/publish"))
}
const unpublishEvent = async(eventId: string) => {
    return (await clientPost("/api/admin/event/" + eventId + "/unpublish"))
}

const updateEvent = async(eventId: string, body: {
    title: string;
    date: string;
    locationId: string;
    description: string;
    teamEvent: boolean;
    published: boolean;
    major: boolean;
}) => {
    return clientPut("/api/admin/event/" + eventId, body)
}

export const eventApi = {
    deleteEvent,
    publishEvent,
    unpublishEvent,
    updateEvent,
}