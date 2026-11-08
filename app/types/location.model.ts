export interface Location {
    id: string;
    name: string;
    description: string;
    lat: number;
    lon: number;
    /** Course difficulty adjustment for ranks, strokes per 18 holes. Only sent by admin endpoints. */
    rankOffset?: number;
}