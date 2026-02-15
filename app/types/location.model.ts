export interface Location {
    locationId: string;
    name: string;
    description: string;
    coordinates: {
        lat?: number;
        lon?: number;
    };
}