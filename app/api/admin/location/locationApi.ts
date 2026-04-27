import { adminGet, adminPost } from "@/lib/adminClient";
import { Location } from "@/app/types/location.model";

const createLocation = async (location: {
    name: string;
    description: string;
    lat: number;
    lon: number;
}) => {
    return adminPost("/api/admin/location", location);
}

const getLocations = async (): Promise<Location[]> => {
    return (await adminGet("/api/admin/location")).json();
}

export const locationApi = {
    createLocation,
    getLocations
}