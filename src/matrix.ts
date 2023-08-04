import { Position } from "geojson";
import { Metadata, Profile } from "./common";
import { DirectionsUnits } from "./directions";

export enum MatrixMetrics {
    DISTANCE = 'distance',
    DURATION = 'duration'
}

export type MatrixQuery = {
    locations: Position[];
    destinations?: number[];
    id?: string;
    metrics?: MatrixMetrics;
    resolve_locations?: boolean;
    sources?: number[];
    units?: DirectionsUnits;
}

export interface MatrixLocation {
    location: Position;
    snapped_distance: number;
    name?: string;
}

export type MatrixResponse = {
    metadata: Metadata & {
        service: 'matrix';
        query: MatrixQuery & {
            profile: Profile;
            responseType: 'json';
        }
    }
} & {
    durations: number[][];
    destinations: MatrixLocation[];
    sources: MatrixLocation[];
}