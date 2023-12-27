import { Aircraft } from "./aircraft.model";
import { Carrier } from "./carrier.model";
import { FareDetails } from "./fare-details.model";
import { Place } from "./place.model";
import { Status } from "./status.enum";


export class AirSegment {
	arrivalDatetime!: string;
	arrivalTerminal!: string;
	departureDatetime!: string;
	departureTerminal!: string;
	destination!: Place;
	duration!: number;
	equipment!: Aircraft;
	fareDetailsList!: FareDetails[];
	flightNumber!: string;
	marketingCarrier!: Carrier;
	operatingCarrier!: Carrier;
	origin!: Place;
	status!: Status;
}