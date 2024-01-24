import { AirSearchPrice } from "../../../models/air-search-price.model";
import { FlightOption } from "../../../models/flight-option.model";
import { SupplierInfo } from "./supplier-info.model";
import { SupplierParameters } from "./supplier-parameters.model";
import { SupportedPayments } from "./supported-payments.model";

export class AirCheckoutDetailsResponse {
    flights!: FlightOption[];
    formOfPayments!: Map<string, SupportedPayments>;
    id!: string;
    price!: AirSearchPrice;
    supplierInfos!: Map<string, SupplierInfo[]>;
    supplierParameters!: SupplierParameters;
}