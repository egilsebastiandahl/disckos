import { httpPost } from "../../public/apiPublicHelper";
import { Location } from "@/app/types/location.model";

const createLocation = async (location: Partial<Location>) => {
    return httpPost("/api/admin/location", location);

}

export const locationApi = {
    createLocation
}