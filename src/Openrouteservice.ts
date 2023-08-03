import { FeatureCollection, LineString, Position } from "geojson";

type Metadata = {
    metadata: {
        attribution: string;
        service: 'routing';
        timestamp: number;
        engine: {
            version: string;
            build_date: string;
            graph_date: string;
        }
    }
}

type BasicDirectionsResponse = FeatureCollection & Metadata & {
    metadata: {
        query: {
            coordinates: [ Position, Position ];
            profile: Profile;
            format: 'json';
        }
    }
}

enum DirectionsAttributes {
    AVERAGE_SPEED = 'avgspeed',
    DETOUR_FACTOR = 'detourfactor',
    PERCENTAGE = 'percentage'
}

enum DirectionsExtraInfo {
    STEEPNESS = 'steepness',
    SUITABILITY = 'suitability',
    SURFACE = 'surface',
    WAY_CATEGORY = 'waycategory',
    WAY_TYPE = 'waytype',
    TOLLWAYS = 'tollways',
    TRAIL_DIFFICULTY = 'traildifficulty',
    OSM_ID = 'osmid',
    ROAD_ACCESS_RESTRICTIONS = 'roadaccessrestrictions',
    COUNTRY_INFO = 'countryinfo',
    GREEN = 'green',
    NOISE = 'noise',
    CSV = 'csv',
    SHADOW = 'shadow'
}

enum DirectionsFeatures {
    HIGHWAYS = 'highways',
    TOLLWAYS = 'tollways',
    FERRIES = 'ferries'
}

enum DirectionsBorders {
    ALL = 'all',
    CONTROLLED = 'controlled',
    NONE = 'none'
}

enum DirectionsVehicleType {
    HGV = 'hgv',
    BUS = 'bus',
    AGRICULTURAL = 'agricultural',
    DELIVERY = 'delivery',
    FORESTRY = 'forestry',
    GOODS = 'goods',
    UNKNOWN = 'unknown'
}

enum DirectionsSmoothness {
    EXCELLENT = 'excellent',
    GOOD = 'good',
    INTERMEDIATE = 'intermediate',
    BAD = 'bad',
    VERY_BAD = 'very_bad',
    HORRIBLE = 'horrible'
}

enum DirectionsPreference {
    FASTEST = 'fastest',
    SHORTEST = 'shortest',
    RECOMMENDED = 'recommended'
}

enum DirectionsUnits {
    METERS = 'm',
    KILOMETERS = 'km',
    MILES = 'mi'
}

enum DirectionsFormat {
    JSON = 'json',
    GPX = 'gpx',
    GEOJSON = 'geojson'
}

type DirectionsQuery = {
    coordinates: Position[];
    alternative_routes?: {
        target_count?: number;
        weight_factor?: number;
        share_factor?: number;
    }
    attributes?: DirectionsAttributes[];
    continue_straight?: boolean;
    elevation?: string;
    extra_info?: DirectionsExtraInfo[];
    geometry_simplify?: boolean;
    id?: string;
    instructions?: boolean;
    instructions_format?: string;
    language?: string;
    maneuvers?: boolean;
    options?: {
        avoid_features?: DirectionsFeatures[];
        avoid_borders?: DirectionsBorders;
        avoid_countries?: number[];
        avoid_polygons?: {
            empty: boolean;
        }
        round_trip?: {
            lengt?: number;
            points?: number;
            seed?: number;
        }
        vehicle_type?: DirectionsVehicleType;
        profile_params?: {
            weightings?: {
                steepness_difficulty?: number;
                green?: number;
                quiet?: number;
                shadow?: number;
            }
            restrictions?: {
                length?: number;
                width?: number;
                height?: number;
                axleload?: number;
                weight?: number;
                hazmat?: boolean;
                surface_type?: string;
                track_type?: string;
                smoothness_type?: DirectionsSmoothness;
                maximum_sloped_kerb?: number;
                maximum_incline?: number;
                minimum_width?: number;
            },
            surface_quality_known?: boolean;
            allow_unsuitable?: boolean;
        }
        preference?: DirectionsPreference;
        radiuses?: number[];
        roundabout_exits?: boolean;
        skip_segments?: number[];
        supress_warnings?: boolean;
        units?: DirectionsUnits;
        geometry?: boolean;
        bearings?: number[][];
        maximum_speed?: number;
    }
}

type BoundingBox = [number, number, number, number];

enum DirectionsInstructionType {
    LEFT, RIGHT, 
    SHARP_LEFT, SHARP_RIGHT,
    SLIGHT_LEFT, SLIGHT_RIGHT,
    STRAIGHT, 
    ENTER_ROUNDABOUT, EXIT_ROUNDABOUT,
    U_TURN, GOAL, DEPART,
    KEEP_LEFT, KEEP_RIGHT
}

type DirectionsSummary = {
    distance: number;
    duration: number;
}

type DirectionsStep = DirectionsSummary & {
    type: DirectionsInstructionType;
    instruction: string;
    name: string;
    waypoints: [number, number];
}

type DirectionsSegment = DirectionsSummary & {
    steps: DirectionsStep[];
}

interface DirectionsRoute {
    summary: DirectionsSummary;
    segments: DirectionsSegment[];
    bbox: BoundingBox;
    geometry: string;
    way_points: [number, number];
    legs: unknown[];
}

type DirectionsResponsePartial = Metadata & {
    metadata: {
        query: DirectionsQuery & {
            profile: Profile;
            format: DirectionsFormat;
        }
    }
}

type DirectionsResponseJSON = DirectionsResponsePartial & {
    bbox: BoundingBox,
    routes: DirectionsRoute[];
}

interface DirectionsProperties {
    transfers: number;
    fare: number;
    segments: DirectionsSegment[];
    way_points: [number, number];
    summary: DirectionsSummary;
}

type DirectionsResponseGeoJSON = DirectionsResponsePartial & FeatureCollection<LineString, DirectionsProperties>;

type DirectionsResponseGPX = string;

type DirectionsResponse = DirectionsResponseJSON | DirectionsResponseGeoJSON | DirectionsResponseGPX;

enum Profile {
    DRIVING_CAR = 'driving-car',
    DRIVING_HGV = 'driving-hgv',
    CYCLING_REGULAR = 'cycling-regular',
    CYCLING_ROAD = 'cycling-road',
    CYCLING_MOUNTAIN = 'cycling-mountain',
    CYCLING_ELECTRIC = 'cycling-electric',
    FOOT_WALKING = 'foot-walking',
    FOOT_HIKING = 'foot-hiking',
    WHEELCHAIR = 'wheelchair'
}

export default class Openrouteservice {
    static options = {
        profiles: Profile,
        directions: {
            attributes: DirectionsAttributes,
            extraInfo: DirectionsExtraInfo,
            features: DirectionsFeatures,
            borders: DirectionsBorders,
            vehicleType: DirectionsVehicleType,
            smoothness: DirectionsSmoothness,
            preference: DirectionsPreference,
            units: DirectionsUnits,
            format: DirectionsFormat,
            instructionType: DirectionsInstructionType
        }
    }

    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private orsFetch = (endpoint: string, post: boolean, body: string) => fetch(
        `https://api.openrouteservice.org${endpoint}${
            post ? '' : `?api_key=${this.apiKey}&${body}`
        }`, 
        post ? {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.apiKey
            },
            body
        } : {}
    ).then(async res => {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            return text;
        }
    });

    getBasicDirections = async (profile: Profile, start: Position, end: Position): Promise<BasicDirectionsResponse> => 
        this.orsFetch(
            '/v2/directions/' + profile, 
            false, 
            new URLSearchParams({
                start: start.join(','),
                end: end.join(',')
            }).toString()
        );

    async getDirections (profile: Profile, format: DirectionsFormat.JSON, query: DirectionsQuery): Promise<DirectionsResponseJSON>;
    async getDirections (profile: Profile, format: DirectionsFormat.GEOJSON, query: DirectionsQuery): Promise<DirectionsResponseGeoJSON>;
    async getDirections (profile: Profile, format: DirectionsFormat.GPX, query: DirectionsQuery): Promise<DirectionsResponseGPX>;
    async getDirections (profile: Profile, format: DirectionsFormat, query: DirectionsQuery): Promise<DirectionsResponse> {
        return this.orsFetch(
            `/v2/directions/${profile}/${format}`, 
            true, 
            JSON.stringify(query)
        );
    }

    static decodePolyline(encodedPolyline: string, includeElevation?: boolean): Position[] {
        const points = [];
        let index = 0;
        let lat = 0;
        let lng = 0;
        let ele = 0;
        while (index < encodedPolyline.length) {
            let b;
            let shift = 0;
            let result = 0;
            do {
                b = encodedPolyline.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
        
            lat += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
            shift = 0;
            result = 0;
            do {
                b = encodedPolyline.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            lng += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        
            if (includeElevation) {
                shift = 0;
                result = 0;
                do {
                    b = encodedPolyline.charAt(index++).charCodeAt(0) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                ele += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
            }
            try {
                let location = [(lng / 1E5), (lat / 1E5)];
                if (includeElevation) location.push((ele / 100));
                points.push(location);
            } catch (e) {
                console.log(e);
            }
        }
        return points;
    }
}