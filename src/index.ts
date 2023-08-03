import 'dotenv/config';
import Openrouteservice from './Openrouteservice';

const API_KEY = process.env.OPENROUTESERVICE_API_KEY;
if (!API_KEY)
    throw new Error('API key required in .env file as OPENROUTESERVICE_API_KEY');

(async () => {
    const ors = new Openrouteservice(API_KEY);
    // const directions = await ors.getBasicDirections(
    //     Openrouteservice.options.profiles.DRIVING_CAR, 
    //     [-121.86592918628558, 37.41513158647777], 
    //     [-121.86597210162844, 37.424061505151634]
    // );

    const directions = await ors.getDirections(
        Openrouteservice.options.profiles.DRIVING_CAR,
        Openrouteservice.options.directions.format.JSON,
        {
            coordinates: [
                [-121.86592918628558, 37.41513158647777],
                [-121.86597210162844, 37.424061505151634]
            ],
            // attributes: [
            //     Openrouteservice.options.directions.attributes.AVERAGE_SPEED
            // ],
            // maneuvers: true,
            extra_info: [
                Openrouteservice.options.directions.extraInfo.COUNTRY_INFO,
                Openrouteservice.options.directions.extraInfo.GREEN,
                Openrouteservice.options.directions.extraInfo.NOISE,
                Openrouteservice.options.directions.extraInfo.TOLLWAYS,
                Openrouteservice.options.directions.extraInfo.ROAD_ACCESS_RESTRICTIONS,
                Openrouteservice.options.directions.extraInfo.CSV
            ]
        }
    );

    console.log(directions)
    // console.log(Openrouteservice.decodePolyline(directions.routes[0].geometry, true))
    
    // const isochrones = await ors.getIsochrones(
    //     Openrouteservice.options.profiles.DRIVING_CAR,
    //     {
    //         locations: [
    //             [-121.86592918628558, 37.41513158647777],
    //             [-121.86597210162844, 37.424061505151634]
    //         ],
    //         range: [300,200],
    //         // attributes: [
    //         //     Openrouteservice.options.isochrones.attributes.AREA
    //         // ]
    //     }
    // );

    // console.log(isochrones);

    // const matrix = await ors.getMatrix(
    //     Openrouteservice.options.profiles.DRIVING_CAR,
    //     {
    //         locations: [
    //             [-121.86592918628558, 37.41513158647777],
    //             [-121.86597210162844, 37.424061505151634],
    //             [-121.84919220230967, 37.402518818831076]
    //         ],
    //         // resolve_locations: true
    //     }
    // );

    // type IndexedIndexedType = { [key: string]: IndexedType }
    // type IndexedType = { [key: string]: number }

    // const formatedMatrix = matrix.sources.reduce((sourceObj: IndexedIndexedType, source, i) => {
    //     const sourceLocation = source.name ?? source.location.join(', ');
    //     sourceObj[sourceLocation] = matrix.destinations.reduce((destinationObj: IndexedType, destination, j) => {
    //         const destinationLocation = destination.name ?? destination.location.join(', ');
    //         destinationObj[destinationLocation] = matrix.durations[i][j];
    //         return destinationObj;
    //     }, {})
    //     return sourceObj;
    // }, {})

    // console.table(formatedMatrix);
})();