
import { PassengerType } from "src/app/modules/neo/features/search/utils/requests/air-search-request/passenger-type.enum";
import { Traveller } from "../traveller.model";

export class GovernmentTraveller extends Traveller {
    // A api pode não aceitar o campo vazio o que pode resultar num erro
    

    constructor() {
        super()
    }

    public override toString(): PassengerType {
        return PassengerType.Governement;
    }
}