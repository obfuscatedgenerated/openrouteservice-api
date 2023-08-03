import 'dotenv/config';
import Openrouteservice from './Openrouteservice';
import console from 'console';

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
    // const directions = await ors.getDirections(
    //     Openrouteservice.options.profiles.DRIVING_CAR,
    //     Openrouteservice.options.directions.format.GEOJSON,
    //     {
    //         coordinates: [
    //             [-121.86592918628558, 37.41513158647777],
    //             [-121.86597210162844, 37.424061505151634]
    //         ]
    //     }
    // );
    
    const isochrones = await ors.getIsochrones(
        Openrouteservice.options.profiles.DRIVING_CAR,
        {
            locations: [
                [-121.86592918628558, 37.41513158647777],
                [-121.86597210162844, 37.424061505151634]
            ],
            range: [300,200]
        }
    );

    // console.log(Openrouteservice.decodePolyline(directions.routes[0].geometry, true))
    console.log(isochrones.features[0].geometry)
    // console.dir(directions, { depth: Infinity })
})();