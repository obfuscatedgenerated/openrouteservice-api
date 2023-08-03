import { FeatureCollection, LineString, Polygon, Position } from "geojson";

type Metadata = {
    metadata: {
        attribution: string;
        timestamp: number;
        engine: {
            version: string;
            build_date: string;
            graph_date: string;
        }
    }
}

type BasicDirectionsResponse = FeatureCollection<LineString, DirectionsProperties> & Metadata & {
    metadata: {
        service: 'routing';
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

interface DirectionsOptions {
    avoid_features?: DirectionsFeatures[];
    avoid_borders?: DirectionsBorders;
    avoid_countries?: number[];
    avoid_polygons?: {
        empty: boolean;
    }
    round_trip?: {
        length?: number;
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
    options?: DirectionsOptions;
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
    instruction?: string;
    name: string;
    waypoints: [number, number];
    maneuver?: {
        location: Position;
        bearing_before: number;
        bearing_after: number;
    }
}

type DirectionsSegment = DirectionsSummary & {
    steps: DirectionsStep[];
    avgspeed?: number;
    detourfactor?: number;
    percentage?: number;
}

interface DirectionsExtra {
    values: [ number, number, number ][];
    summary: {
        value: number;
        distance: number;
        amount: number;
    }[];
}

interface DirectionsExtras {
    steepness?: DirectionsExtra;
    suitability?: DirectionsExtra;
    surface?: DirectionsExtra;
    waycategory?: DirectionsExtra;
    waytype?: DirectionsExtra;
    tollways?: DirectionsExtra;
    traildifficulty?: DirectionsExtra;
    osmid?: DirectionsExtra;
    roadaccessrestrictions?: DirectionsExtra;
    countryinfo?: DirectionsExtra;
    green?: DirectionsExtra;
    noise?: DirectionsExtra;
}

interface DirectionsWarnings {
    code: number;
    message: string;
}

interface DirectionsRoute {
    summary: DirectionsSummary;
    segments: DirectionsSegment[];
    bbox: BoundingBox;
    geometry?: string;
    way_points: [number, number];
    legs: unknown[];
    extras?: DirectionsExtras;
    warnings?: DirectionsWarnings[];
}

type DirectionsResponsePartial = Metadata & {
    metadata: {
        service: 'routing';
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
    extras?: DirectionsExtras;
    warnings?: DirectionsWarnings[];
}

type DirectionsResponseGeoJSON = DirectionsResponsePartial & FeatureCollection<LineString, DirectionsProperties>;

type DirectionsResponseGPX = string;

type DirectionsResponse = DirectionsResponseJSON | DirectionsResponseGeoJSON | DirectionsResponseGPX;

enum IsochronesAttributes {
    AREA = 'area',
    REACH_FACTOR = 'reachfactor',
    TOTAL_POPULATION = 'total_pop'
}

enum IsochronesLocationType {
    START = 'start',
    DESTINATION = 'destination'
}

enum IsochronesRangeType {
    TIME = 'time',
    DISTANCE = 'distance'
}

interface IsochronesProperties {
    group_index: number;
    value: number;
    center: Position;
    area?: number;
    reachfactor?: number;
    total_pop?: number;
}

type IsochronesQuery = {
    locations: Position[];
    range: [number, number];
    attributes?: IsochronesAttributes[];
    id?: string;
    intersections?: boolean;
    interval?: number;
    location_type?: IsochronesLocationType;
    options?: DirectionsOptions;
    range_type?: IsochronesRangeType;
    smoothing?: number;
    areaUnits?: DirectionsUnits;
    units?: DirectionsUnits;
}

type IsochronesResponse = Metadata & FeatureCollection<Polygon, IsochronesProperties> & {
    metadata: {
        service: 'isochrones';
        query: IsochronesQuery & {
            profile: Profile
        }
    }
}

enum MatrixMetrics {
    DISTANCE = 'distance',
    DURATION = 'duration'
}

type MatrixQuery = {
    locations: Position[];
    destinations?: number[];
    id?: string;
    metrics?: MatrixMetrics;
    resolve_locations?: boolean;
    sources?: number[];
    units?: DirectionsUnits;
}

interface MatrixLocation {
    location: Position;
    snapped_distance: number;
    name?: string;
}

type MatrixResponse = Metadata & {
    metadata: {
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
        },
        isochrones: {
            attributes: IsochronesAttributes,
            locationType: IsochronesLocationType,
            rangeType: IsochronesRangeType
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

    getIsochrones = async (profile: Profile, query: IsochronesQuery): Promise<IsochronesResponse> => 
        this.orsFetch(
            '/v2/isochrones/' + profile,
            true,
            JSON.stringify(query)
        );

    getMatrix = async (profile: Profile, query: MatrixQuery): Promise<MatrixResponse> =>
        this.orsFetch(
            '/v2/matrix/' + profile,
            true,
            JSON.stringify(query)
        );


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