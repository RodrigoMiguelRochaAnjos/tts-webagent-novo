import { FareInfoService } from "./fare-info-service.model";
import { FarePrice } from "./fare-price.model";

export class FareInfo {
    name!: string;
    fareBasis!: string;
    fareInfoKey!: string;
    price!: FarePrice;
    services!: FareInfoService[];
    text!: string;
    imageRef!: string;
    bookingCode!: string;
    fareCalc!: string;
    carrier!: string;
}