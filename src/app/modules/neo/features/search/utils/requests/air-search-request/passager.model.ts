import { PassengerType } from "./passenger-type.enum";


export declare type Passengers = Passenger[];

export class Passenger {
    type: PassengerType;
    age!: number;

    constructor(type: PassengerType) {
        this.type = type;
    }
}
