
import { PassengerType } from "src/app/modules/neo/features/search/utils/requests/air-search-request/passenger-type.enum";
import { Traveller } from "../traveller.model";

export class ChildTraveller extends Traveller {

    constructor() {
        super()
    }

    public override toString(): PassengerType {
        return PassengerType.Child;
    }
}