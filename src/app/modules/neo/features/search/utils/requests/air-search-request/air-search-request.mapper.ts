import { Mapper } from "src/app/core/models/mapper";
import { Journey } from "src/app/modules/neo/models/journey/journey.model";
import { AirSearchRequest, AirSearchRequestBuilder } from "./air-search-request.model";
import { FlightRoute } from "../../route.model";
import { PlaceType } from "../../place-type.enum";
import { Place } from "src/app/modules/neo/models/place.model";
import { Passenger, Passengers } from "./passager.model";
import { Traveller } from "src/app/modules/neo/models/traveller/traveller.model";
import { JourneyType } from "../../journey-type.enum";

export class AirSearchRequestMapper implements Mapper<Journey, AirSearchRequest>{
    
    
    map(obj: Journey): AirSearchRequest {
        const origin: Place = new Place();
        origin.code = obj.origin.code;
        origin.type = obj.origin.isCity ? PlaceType.City : PlaceType.Airport;

        const destination: Place = new Place();
        destination.code = obj.destination.code;
        destination.type = obj.destination.isCity ? PlaceType.City : PlaceType.Airport;

        const req: AirSearchRequestBuilder = new AirSearchRequestBuilder()
            .routeType(obj.toString())
            .currency("EUR")
            .passengers(obj.travellers?.map((traveller: Traveller) => new Passenger(traveller.toString())))
            .outbound(new FlightRoute(origin, destination, obj.departureDate));

        if(obj.toString() === JourneyType.ROUND_TRIP) {
            req.inbound(new FlightRoute(destination, origin, obj.returnDate));
        }


        return req.build();
    }

    
    mapArray(obj: Journey[]): AirSearchRequest[] {
        return obj.map(obj => this.map(obj));
    }
    

    
}