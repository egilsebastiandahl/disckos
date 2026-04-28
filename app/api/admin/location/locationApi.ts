import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/adminClient";
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

const updateLocation = async (id: string, location: {
    name: string;
    description: string;
    lat: number;
    lon: number;
}) => {
    return adminPut(`/api/admin/location/${id}`, location);
}

const deleteLocation = async (id: string) => {
    return adminDelete(`/api/admin/location/${id}`);
}

export const locationApi = {
    createLocation,
    getLocations,
    updateLocation,
    deleteLocation,
}