import { Location } from "@/app/types/location.model";
import { clientPost } from "@/lib/clientApi";

const createLocation = async (location: {
    name: string;
    description: string;
    lat: number;
    lon: number;
}) => {
    return clientPost("/api/admin/location", location);
}

export const locationApi = {
    createLocation
}