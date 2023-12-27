import { Traveller } from "../traveller.model";

export class InfantWithSeatTraveller extends Traveller {

    constructor() {
        super()
    }

    public override toString(): PassengerType {
        return PassengerType.InfantWithSeat;
    }
}