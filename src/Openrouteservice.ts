import { flatten, unflatten } from "flat";
import { FeatureCollection, Geometry, LineString, Point, Polygon, Position } from "geojson";

type Metadata = {
    version?: string;
    attribution: string;
    timestamp: number;
    engine?: {
        version: string;
        build_date?: string;
        graph_date?: string;
        author?: string;
        name?: string;
    }
}

type BasicDirectionsResponse = FeatureCollection<LineString, DirectionsProperties> & {
    metadata: Metadata & {
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

type DirectionsResponsePartial = {
    metadata: Metadata & {
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

type IsochronesResponse = FeatureCollection<Polygon, IsochronesProperties> & {
    metadata: Metadata & {
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

type MatrixResponse = {
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

enum GeocodeSearchSource {
    OPENSTREETMAP = 'osm',
    OPENADDRESSES = 'oa',
    WHOS_ON_FIRST = 'wof',
    GEONAMES = 'gn'
}

enum GeocodeSearchLayer {
    ADDRESS = 'address',
    VENUE = 'venue',
    NEIGHBORHOOD = 'neighbourhood',
    LOCALITY = 'locality',
    BOROUGH = 'borough',
    LOCAL_ADMINISTRATION = 'localadmin',
    COUNTY = 'county',
    MACRO_COUNTY = 'macrocounty',
    REGION = 'region',
    MACRO_REGION = 'macroregion',
    COUNTRY = 'country',
    COARSE = 'coarse',
}

type GeocodeStructuredQuery = Partial<{
    address: string;
    neighborhood: string;
    country: string;
    postalcode: string;
    region: string;
    county: string;
    locality: string;
    borough: string;
}>;

type GeocodeQuery = Partial<{
    focus: {
        point?: {
            lon: number;
            lat?: number;
        }
    }
    boundary: Partial<{
        rect: {
            min_lon: number;
            min_lat?: number;
            max_lon?: number;
            max_lat?: number;
        }
        circle: {
            lon: number;
            lat?: number;
            radius?: number;
        }
        gid: string;
        country: string;
    }>;
    sources: GeocodeSearchSource[];
    layers: GeocodeSearchLayer[];
}>;

type GeocodeResponse = FeatureCollection<Point, GeocodeProperties> & {
    geocoding: Metadata & {
        query: GeocodeQuery & Partial<GeocodeReverseQuery> & {
            size: number;
            layers?: string[];
            private: boolean;
            lang: {
                name: string;
                iso6391: string;
                iso6393: string;
                via: string;
                defaulted: boolean;
            }
            querySize: number;
            parser?: string;
            parsed_text?: {
                subject: string;
            }
            warnings?: DirectionsWarnings[];
        }
    }
}

interface GeocodeProperties {
    id: string;
    gid: string;
    layer: string;
    source: string;
    source_id: string;
    name: string;
    housenumber?: string;
    street?: string;
    confidence?: number;
    match_type?: string;
    postalcode?: string;
    accuracy?: string;
    country?: string;
    country_gid?: string;
    country_a?: string;
    macroregion?: string;
    macroregion_gid?: string;
    macroregion_a?: string;
    region?: string;
    region_gid?: string;
    region_a?: string;
    county?: string;
    county_gid?: string;
    county_a?: string;
    localadmin?: string;
    localadmin_gid?: string;
    localadmin_a?: string;
    locality?: string;
    locality_gid?: string;
    locality_a?: string;
    neighbourhood?: string;
    neighbourhood_gid?: string;
    neighbourhood_a?: string;
    borough?: string;
    borough_gid?: string;
    borough_a?: string;
    continent?: string;
    continent_gid?: string;
    label: string;
    addendum: {
        osm: {
            wheelchair: string;
            website: string;
            phone: string;
        }
    }
}

type GeocodeReverseQuery = {
    point: {
        lon: number;
        lat: number;
    }
    boundary?: {
        circle?: {
            radius: number;
        }
        country?: string;
    }
    sources?: GeocodeSearchSource[];
    layers?: GeocodeSearchLayer[];
}

enum POIRequestType {
    PLACES_OF_INTEREST = 'pois',
    STATISTICS = 'stats',
    LIST = 'list'
}

enum POISortBy {
    CATEGORY = 'category',
    DISTANCE = 'distance'
}

type POIQuery = {
    request: POIRequestType;
    geometry: {
        bbox?: [Position, Position],
        geojson?: Polygon | Point | LineString;
        buffer?: number;
    }
    filters?: {
        category_group_ids?: number[];
        category_ids?: number[];
        name?: string[];
        wheelchair?: (string | boolean)[];
        smoking?: (string | boolean)[];
        fee?: boolean[];
    }
    limit?: number;
    sortby?: POISortBy;
}

type POIInformation = {
    information: Metadata & {
        query: POIQuery;
    }
}

type POIResponsePOIs = FeatureCollection<Point, POIProperties> & POIInformation;

type POIResponseStats = {
    places: {
        total_count: number;
    } & {
        [category: string]: {
            group_id: number;
            categories: {
                [category: string]: {
                    count: number;
                    category_id: number;
                }
            }
            total_count: number;
        }
    }
} & POIInformation;

type POIResponseList = {
    [category: string]: {
        id: number;
        children: {
            [category: string]: number;
        }
    }
}

type POIResponse = POIResponsePOIs | POIResponseStats | POIResponseList;

interface POIProperties {
    osm_id: number;
    osm_type: number;
    distance: number;
    category_ids: {
        [id: string]: {
            category_name: string;
            category_group: string;
        }
    }
    osm_tags: {
        name: string;
        wheelchair: string;
    }
}

type ElevationResponsePointGeoJSON = Metadata & {
    geometry: Point;
}

type ElevationResponseLineGeoJSON = Metadata & {
    geometry: LineString;
}

type ElevationResponsePoint = Metadata & {
    geometry: Position;
}

type ElevationResponseLine = Metadata & {
    geometry: Position[];
}

type ElevationResponseEncodedPolyline = Metadata & {
    geometry: string;
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
        },
        pois: {
            requestType: POIRequestType,
            soryBy: POISortBy
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

    static unflattenResult(res: any) {
        res.geocoding.query = unflatten(res.geocoding.query);
        return res;
    }

    async getGeocodeSearch(query: string | GeocodeStructuredQuery, additionalQuery?: GeocodeQuery): Promise<GeocodeResponse> {
        const structured = typeof query !== 'string';
        
        const params: any = flatten({
            ...(structured ? query : {}),
            ...(additionalQuery ?? {})
        });

        if (!structured)
            params.text = query;

        if (additionalQuery?.sources)
            params.sources = additionalQuery.sources.join(',');

        if (additionalQuery?.layers)
            params.layers = additionalQuery.layers.join(',');

        return this.orsFetch(
            '/geocode/search' + (structured ? '/structured' : ''),
            false,
            new URLSearchParams(params).toString()
        ).then(Openrouteservice.unflattenResult);
    }

    async getGeocodeAutocomplete(text: string, query?: GeocodeQuery): Promise<GeocodeResponse> {
        const params: any = flatten(query ?? {});

        params.text = text;

        if (query?.sources)
            params.sources = query.sources.join(',');

        if (query?.layers)
            params.layers = query.layers.join(',');

        return this.orsFetch(
            '/geocode/autocomplete',
            false,
            new URLSearchParams(params).toString()
        ).then(Openrouteservice.unflattenResult);
    }

    async getGeocodeReverse(query: GeocodeReverseQuery): Promise<GeocodeResponse> {
        const params: any = flatten(query);

        if (query.sources)
            params.sources = query.sources.join(',');

        if (query.layers)
            params.layers = query.layers.join(',');

        return this.orsFetch(
            '/geocode/reverse',
            false,
            new URLSearchParams(params).toString()
        ).then(Openrouteservice.unflattenResult);
    }

    async getPOIs(query: POIQuery & { request: POIRequestType.PLACES_OF_INTEREST }): Promise<POIResponsePOIs>;
    async getPOIs(query: POIQuery & { request: POIRequestType.STATISTICS }): Promise<POIResponseStats>;
    async getPOIs(query: POIQuery & { request: POIRequestType.LIST }): Promise<POIResponseList>;
    async getPOIs(query: POIQuery): Promise<POIResponse> {
        return this.orsFetch(
            '/pois',
            true,
            JSON.stringify(query)
        );
    }

    async getElevation(geometry: Point | Position, outputFormat: 'geojson'): Promise<ElevationResponsePointGeoJSON>;
    async getElevation(geometry: LineString | Position[] | string, outputFormat: 'geojson'): Promise<ElevationResponseLineGeoJSON>;
    async getElevation(geometry: Point | Position, outputFormat: 'point'): Promise<ElevationResponsePoint>;
    async getElevation(geometry: LineString | Position[] | string, outputFormat: 'polyline'): Promise<ElevationResponseLine>;
    async getElevation(geometry: LineString | Position[] | string, outputFormat: 'encodedpolyline5'): Promise<ElevationResponseEncodedPolyline>;
    async getElevation(geometry: Point | LineString | Position | Position[] | string, outputFormat: 'geojson' | 'point' | 'polyline' | 'encodedpolyline5') {
        const isPoint = (
            typeof geometry === 'object' 
                && 
            !Array.isArray(geometry) 
                && 
            geometry.type === 'Point'
        ) || (
            Array.isArray(geometry) 
                && 
            typeof geometry[0] === 'number'
        );
        const isGeoJSON = typeof geometry === 'object' && 'type' in geometry;
        const isEncodedPolyline = typeof geometry === 'string';
        const endpoint = `/elevation/${isPoint ? 'point' : 'line'}`;
        const params = (isPoint && !isGeoJSON)
            ? new URLSearchParams({
                geometry: geometry.join(','),
                format_out: outputFormat
            }).toString() : JSON.stringify({
                format_in: (
                    isEncodedPolyline
                        ? 'encodedpolyline5'
                        : isGeoJSON
                            ? 'geojson'
                            : isPoint
                                ? 'point'
                                : 'polyline'
                ), geometry
            });
            
        return this.orsFetch(
            endpoint,
            !(isPoint && !isGeoJSON),
            params
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