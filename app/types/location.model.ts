export interface Location {
    id: string;
    name: string;
    description: string;
    coordinates: {
        lat?: number;
        lon?: number;
    };
}