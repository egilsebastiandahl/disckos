import { Location } from "@/app/types/location.model";
import { clientGet, clientPost } from "@/lib/clientApi";

const createLocation = async (location: {
    name: string;
    description: string;
    lat: number;
    lon: number;
}) => {
    return clientPost("/api/admin/location", location);
}

const getLocations = async (): Promise<Location[]> => {
    return (await clientGet("/api/admin/location")).json();
}

export const locationApi = {
    createLocation,
    getLocations
}