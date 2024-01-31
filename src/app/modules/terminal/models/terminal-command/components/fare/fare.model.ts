import { FareInfo } from "./fare-info.model";
import { PassFare } from "./pass-fare.model";

export class Fare {
    fareInfo!: FareInfo
    passFares!: PassFare[]
    conxId!: number;
}