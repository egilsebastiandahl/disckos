import { adminDelete, adminPost, adminPut } from "@/lib/adminClient"

const deleteEvent = async(eventId: string) => {
    return (await adminDelete("/api/admin/event/" + eventId))
}

const publishEvent = async(eventId: string) => {
    return (await adminPost("/api/admin/event/" + eventId + "/publish"))
}
const unpublishEvent = async(eventId: string) => {
    return (await adminPost("/api/admin/event/" + eventId + "/unpublish"))
}

const updateEvent = async(eventId: string, body: {
    title: string;
    date: string;
    locationId: string;
    description: string;
    teamEvent: boolean;
    published: boolean;
    major: boolean;
    rounds: number;
}) => {
    return adminPut("/api/admin/event/" + eventId, body)
}

export const eventApi = {
    deleteEvent,
    publishEvent,
    unpublishEvent,
    updateEvent,
}