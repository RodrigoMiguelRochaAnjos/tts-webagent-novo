import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import { AirCheckoutDetailsResponse } from "../features/search/models/air-checkout-details-response.model";
import { AirCheckoutPriceRequest } from "../features/search/models/air-checkout-price-request.model";
import { AirCheckoutDetailsRequest } from "../features/search/models/air-checkout-details-request.model";
import { HttpClient } from "@angular/common/http";
import { AirCheckoutPriceResponse } from "../features/search/models/air-checkout-price-response.model";
import { AuthService } from "src/app/core/authentication/auth.service";
import { User } from "src/app/core/models/user/user.model";
import { AuthenticatedUser } from "src/app/core/models/user/types/authenticated-user.model";
import { DestroyService } from "src/app/core/services/destroy.service";
import { SupplierInfo } from "../features/search/models/supplier-info.model";
import { SupportedPayments } from "../features/search/models/supported-payments.model";
import { BookingRefs } from "../features/search/models/booking-ref.model";

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {
    private readonly VERSION: string = 'v1';
    private readonly ENDPOINT: string = `${environment.endpoints.NEO}/${this.VERSION}/bookings`;

    private details$: BehaviorSubject<AirCheckoutDetailsResponse | null> = new BehaviorSubject<AirCheckoutDetailsResponse | null>(null);
    private price$: BehaviorSubject<AirCheckoutPriceResponse | null> = new BehaviorSubject<AirCheckoutPriceResponse | null>(null);

//     private details: any = Object.assign(new AirCheckoutDetailsResponse(), JSON.parse(`
//         {
//     "id": "a24cb64d-e6e7-401f-ab9c-7d677f97e5a4",
//     "price": {
//         "amount": 109.66,
//         "currency": "EUR",
//         "preferredCurrency": "EUR",
//         "totalAmount": 109.66,
//         "includeTaxes": true,
//         "exchange": false,
//         "passengersPrices": [
//             {
//                 "amount": 0.0,
//                 "currency": "EUR",
//                 "preferredCurrency": "EUR",
//                 "totalAmount": 109.66,
//                 "includeTaxes": true,
//                 "exchange": false,
//                 "ptc": "ADULT",
//                 "quantity": 1
//             }
//         ]
//     },
//     "flights": [
//         {
//             "id": "05722671-dfee-4594-a80b-d0779d6038e1",
//             "searchId": "3a29e77f-af1d-4229-ae94-c772f5213d76",
//             "provider": "XMLSELECT",
//             "price": {
//                 "amount": 58.66,
//                 "currency": "EUR",
//                 "preferredCurrency": "EUR",
//                 "totalAmount": 58.66,
//                 "includeTaxes": true,
//                 "exchange": false,
//                 "passengersPrices": [
//                     {
//                         "amount": 0.0,
//                         "currency": "EUR",
//                         "preferredCurrency": "EUR",
//                         "totalAmount": 58.66,
//                         "includeTaxes": true,
//                         "exchange": false,
//                         "taxes": [
//                             {
//                                 "name": "J9",
//                                 "amount": 2.0,
//                                 "currency": "EUR"
//                             },
//                             {
//                                 "name": "PT",
//                                 "amount": 3.56,
//                                 "currency": "EUR"
//                             },
//                             {
//                                 "name": "YP",
//                                 "amount": 15.1,
//                                 "currency": "EUR"
//                             }
//                         ],
//                         "ptc": "ADULT",
//                         "quantity": 1
//                     }
//                 ]
//             },
//             "duration": 90,
//             "segments": [
//                 {
//                     "origin": {
//                         "code": "LIS",
//                         "type": "AIRPORT"
//                     },
//                     "destination": {
//                         "code": "MAD",
//                         "type": "AIRPORT"
//                     },
//                     "departureDatetime": "2024-02-16T20:40:00",
//                     "arrivalDatetime": "2024-02-16T23:10:00",
//                     "flightNumber": 3105,
//                     "duration": 90,
//                     "equipment": {
//                         "code": "320",
//                         "name": "Airbus A320"
//                     },
//                     "operatingCarrier": {
//                         "code": "IB",
//                         "name": "Iberia",
//                         "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/IB.png"
//                     },
//                     "marketingCarrier": {
//                         "code": "IB",
//                         "name": "Iberia",
//                         "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/IB.png"
//                     },
//                     "departureTerminal": "1",
//                     "arrivalTerminal": "4S",
//                     "fareDetailsList": [
//                         {
//                             "ptc": "ADULT",
//                             "fareBasis": "ADNNAOB4",
//                             "cabinClass": "First Class",
//                             "bookingClass": "A",
//                             "description": "",
//                             "privateFare": false
//                         }
//                     ]
//                 }
//             ],
//             "tags": [],
//             "nstops": 0
//         },
//         {
//             "id": "HLD37EDGCI0QHSHO",
//             "searchId": "N2RR64Q7T8JNUNHL",
//             "provider": "TRAVELFUSION",
//             "price": {
//                 "amount": 51.0,
//                 "currency": "EUR",
//                 "preferredCurrency": "EUR",
//                 "totalAmount": 51.0,
//                 "includeTaxes": true,
//                 "exchange": false,
//                 "passengersPrices": [
//                     {
//                         "amount": 51.0,
//                         "currency": "EUR",
//                         "preferredCurrency": "EUR",
//                         "totalAmount": 51.0,
//                         "includeTaxes": true,
//                         "exchange": false,
//                         "ptc": "ADULT",
//                         "quantity": 1
//                     }
//                 ]
//             },
//             "duration": 650,
//             "segments": [
//                 {
//                     "origin": {
//                         "code": "MAD",
//                         "type": "AIRPORT"
//                     },
//                     "destination": {
//                         "code": "BCN",
//                         "type": "AIRPORT"
//                     },
//                     "departureDatetime": "2024-02-28T22:35:00",
//                     "arrivalDatetime": "2024-02-28T23:55:00",
//                     "flightNumber": 1009,
//                     "duration": 80,
//                     "operatingCarrier": {
//                         "code": "VY",
//                         "name": "Vueling Airlines",
//                         "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/VY.png"
//                     },
//                     "marketingCarrier": {
//                         "code": "VY",
//                         "name": "Vueling Airlines",
//                         "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/VY.png"
//                     },
//                     "fareDetailsList": [
//                         {
//                             "ptc": "ADULT",
//                             "fareBasis": "DCOWLPB",
//                             "cabinClass": "Economy With Restrictions - Basic Fare",
//                             "bookingClass": "DL",
//                             "description": "On board hand luggage included: Fee applies for additional checked baggage;Cancellations not permitted;Ticket is non refundable in case of no show;Route changes not permitted;PAX name change subject to a fee;Flight dates change subject to a fee.",
//                             "privateFare": false
//                         }
//                     ]
//                 },
//                 {
//                     "origin": {
//                         "code": "BCN",
//                         "type": "AIRPORT"
//                     },
//                     "destination": {
//                         "code": "LIS",
//                         "type": "AIRPORT"
//                     },
//                     "departureDatetime": "2024-02-29T07:20:00",
//                     "arrivalDatetime": "2024-02-29T08:25:00",
//                     "flightNumber": 8460,
//                     "duration": 125,
//                     "operatingCarrier": {
//                         "code": "VY",
//                         "name": "Vueling Airlines",
//                         "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/VY.png"
//                     },
//                     "marketingCarrier": {
//                         "code": "VY",
//                         "name": "Vueling Airlines",
//                         "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/VY.png"
//                     },
//                     "fareDetailsList": [
//                         {
//                             "ptc": "ADULT",
//                             "fareBasis": "OQI3CC1",
//                             "cabinClass": "Economy With Restrictions - Basic Fare",
//                             "bookingClass": "OQ",
//                             "description": "On board hand luggage included: Fee applies for additional checked baggage;Cancellations not permitted;Ticket is non refundable in case of no show;Route changes not permitted;PAX name change subject to a fee;Flight dates change subject to a fee.",
//                             "privateFare": false
//                         }
//                     ]
//                 }
//             ],
//             "tags": [
//                 "LCC"
//             ],
//             "nstops": 1
//         }
//     ],
//     "supplierParameters": {
//         "HLD37EDGCI0QHSHO": [
//             {
//                 "name": "DateOfBirth",
//                 "type": "formatted_text",
//                 "displayText": "Date of birth (dd/mm/yyyy)",
//                 "perPassenger": true,
//                 "isOptional": false
//             },
//             {
//                 "name": "DateOfBirthIsNotRequiredForAdults",
//                 "type": "notice",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "FrequentFlyerNumber",
//                 "type": "text",
//                 "displayText": "Frequent flyer number",
//                 "perPassenger": true,
//                 "isOptional": true
//             },
//             {
//                 "name": "CardSecurityNumber",
//                 "type": "notice",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": false
//             },
//             {
//                 "name": "ChildrenAndInfantsSearch",
//                 "type": "notice",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "ChildrenAndInfantsBooking",
//                 "type": "notice",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "HandLuggageOptions",
//                 "type": "value_select",
//                 "displayText": "Please Select Hand Luggage Option: 1 (1 bags - 10Kg total - 48.00 EUR)",
//                 "perPassenger": true,
//                 "isOptional": true
//             },
//             {
//                 "name": "FrequentFlyerType",
//                 "type": "value_select",
//                 "displayText": "Please Select a Frequent Flyer Type: VA(Vueling Frequent Flyer), IB(Iberia Frequent Flyer)",
//                 "perPassenger": true,
//                 "isOptional": true
//             },
//             {
//                 "name": "SeatOptions",
//                 "type": "custom",
//                 "displayText": "Please Select Seat Options: 1009-1A(PS|EL|W@60.00EUR@32A),1009-1B(1A|PS|EL|N@60.00EUR@32A),1009-1C(1A|A|PS|EL@60.00EUR@32A),1009-1D(1A|A|PS|EL@60.00EUR@32A),1009-1E(1A|PS|EL|N@60.00EUR@32A),1009-1F(PS|EL|W@60.00EUR@32A),1009-2A(PS|EL|W@30.00EUR@32A),1009-2B(1A|PS|EL|N@30.00EUR@32A),1009-2C(1A|A|PS|EL@30.00EUR@32A),1009-2D(1A|A|PS|EL@30.00EUR@32A),1009-2E(1A|PS|EL|N@30.00EUR@32A),1009-2F(PS|EL|W@30.00EUR@32A),1009-3A(PS|EL|W@30.00EUR@32A),1009-3B(1A|PS|EL|N@30.00EUR@32A),1009-3C(1A|A|PS|EL@30.00EUR@32A),1009-3D(1A|A|PS|EL@30.00EUR@32A),1009-3E(1A|PS|EL|N@30.00EUR@32A),1009-3F(PS|EL|W@30.00EUR@32A),1009-4A(PS|EL|W@24.00EUR@32A),1009-4B(1A|PS|EL|N@24.00EUR@32A),1009-4C(1A|A|PS|EL@24.00EUR@32A),1009-4D(1A|A|PS|EL@24.00EUR@32A),1009-4E(1A|PS|EL|N@24.00EUR@32A),1009-4F(PS|EL|W@24.00EUR@32A),1009-5A(UF|W@7.00EUR@32A),1009-5B(1A|UF|N@7.00EUR@32A),1009-5C(1A|UF|A@7.00EUR@32A),1009-5D(1A|UF|A@7.00EUR@32A),1009-5E(1A|UF|N@7.00EUR@32A),1009-5F(UF|W@7.00EUR@32A),1009-6A(UF|W@7.00EUR@32A),1009-6B(1A|UF|N@7.00EUR@32A),1009-6C(1A|UF|A@7.00EUR@32A),1009-6D(1A|UF|A@7.00EUR@32A),1009-6E(1A|UF|N@7.00EUR@32A),1009-6F(UF|W@7.00EUR@32A),1009-7A(UF|W@7.00EUR@32A),1009-7B(1A|UF|N@7.00EUR@32A),1009-7C(1A|UF|A@7.00EUR@32A),1009-7D(1A|UF|A@7.00EUR@32A),1009-7E(1A|UF|N@7.00EUR@32A),1009-7F(UF|W@7.00EUR@32A),1009-8A(UF|W@7.00EUR@32A),1009-8B(1A|UF|N@7.00EUR@32A),1009-8C(1A|UF|A@7.00EUR@32A),1009-8D(1A|UF|A@7.00EUR@32A),1009-8E(1A|UF|N@7.00EUR@32A),1009-8F(UF|W@7.00EUR@32A),1009-9A(UF|W@7.00EUR@32A),1009-9B(1A|UF|N@7.00EUR@32A),1009-9C(1A|UF|A@7.00EUR@32A),1009-9D(1A|UF|A@7.00EUR@32A),1009-9E(1A|UF|N@7.00EUR@32A),1009-9F(UF|W@7.00EUR@32A),1009-10A(WG|1A|UF|W@7.00EUR@32A),1009-10B(WG|1A|UF|N@7.00EUR@32A),1009-10C(WG|1A|UF|A@7.00EUR@32A),1009-10D(WG|1A|UF|A@7.00EUR@32A),1009-10E(WG|1A|UF|N@7.00EUR@32A),1009-10F(WG|1A|UF|W@7.00EUR@32A),1009-11A(WG|1A|UF|W|IE@7.00EUR@32A),1009-11B(WG|1A|UF|IE|N@7.00EUR@32A),1009-11C(WG|1A|UF|A|IE@7.00EUR@32A),1009-11D(WG|1A|UF|A|IE@7.00EUR@32A),1009-11E(WG|1A|UF|IE|N@7.00EUR@32A),1009-11F(WG|1A|UF|W|IE@7.00EUR@32A),1009-12A(WG|1A|E|EL|W|IE@9.00EUR@32A),1009-12B(WG|1A|E|EL|IE|N@9.00EUR@32A),1009-12C(WG|1A|A|E|EL|IE@9.00EUR@32A),1009-12D(WG|1A|A|E|EL|IE@9.00EUR@32A),1009-12E(WG|1A|E|EL|IE|N@9.00EUR@32A),1009-12F(WG|1A|E|EL|W|IE@9.00EUR@32A),1009-14A(WG|1A|E|EL|W|IE@9.00EUR@32A),1009-14B(WG|1A|E|EL|IE|N@9.00EUR@32A),1009-14C(WG|1A|A|E|EL|IE@9.00EUR@32A),1009-14D(WG|1A|A|E|EL|IE@9.00EUR@32A),1009-14E(WG|1A|E|EL|IE|N@9.00EUR@32A),1009-14F(WG|1A|E|EL|W|IE@9.00EUR@32A),1009-15A(WG|W|IE@6.00EUR@32A),1009-15B(WG|1A|IE|N@6.00EUR@32A),1009-15C(WG|1A|A|IE@6.00EUR@32A),1009-15D(WG|1A|A|IE@6.00EUR@32A),1009-15E(WG|1A|IE|N@6.00EUR@32A),1009-15F(WG|W|IE@6.00EUR@32A),1009-16A(WG|W@6.00EUR@32A),1009-16B(WG|1A|N@6.00EUR@32A),1009-16C(WG|1A|A@6.00EUR@32A),1009-16D(WG|1A|A@6.00EUR@32A),1009-16E(WG|1A|N@6.00EUR@32A),1009-16F(WG|W@6.00EUR@32A),1009-17A(W@6.00EUR@32A),1009-17B(1A|N@6.00EUR@32A),1009-17C(1A|A@6.00EUR@32A),1009-17D(1A|A@6.00EUR@32A),1009-17E(1A|N@6.00EUR@32A),1009-17F(W@6.00EUR@32A),1009-18A(W@6.00EUR@32A),1009-18B(1A|N@6.00EUR@32A),1009-18C(1A|A@6.00EUR@32A),1009-18D(1A|A@6.00EUR@32A),1009-18E(1A|N@6.00EUR@32A),1009-18F(W@6.00EUR@32A),1009-19A(1A|W@6.00EUR@32A),1009-19B(1A|N@6.00EUR@32A),1009-19C(1A|A@6.00EUR@32A),1009-19D(1A|A@6.00EUR@32A),1009-19E(1A|N@6.00EUR@32A),1009-19F(1A|W@6.00EUR@32A),1009-20A(1A|W@5.00EUR@32A),1009-20B(1A|T|N@5.00EUR@32A),1009-20C(1A|A|T@5.00EUR@32A),1009-20D(1A|A|T@5.00EUR@32A),1009-20E(1A|T|N@5.00EUR@32A),1009-20F(1A|T|W@5.00EUR@32A),1009-21A(W@5.00EUR@32A),1009-21B(1A|N@5.00EUR@32A),1009-21C(1A|A@5.00EUR@32A),1009-21D(1A|A@5.00EUR@32A),1009-21E(1A|N@5.00EUR@32A),1009-21F(W@5.00EUR@32A),1009-22A(W@5.00EUR@32A),1009-22B(1A|N@5.00EUR@32A),1009-22C(1A|A@5.00EUR@32A),1009-22D(1A|A@5.00EUR@32A),1009-22E(1A|N@5.00EUR@32A),1009-22F(W@5.00EUR@32A),1009-23A(W@5.00EUR@32A),1009-23B(1A|N@5.00EUR@32A),1009-23C(1A|A@5.00EUR@32A),1009-23D(1A|A@5.00EUR@32A),1009-23E(1A|N@5.00EUR@32A),1009-23F(W@5.00EUR@32A),1009-24A(W@5.00EUR@32A),1009-24B(1A|N@5.00EUR@32A),1009-24C(1A|A@5.00EUR@32A),1009-24D(1A|A@5.00EUR@32A),1009-24E(1A|N@5.00EUR@32A),1009-24F(W@5.00EUR@32A),1009-25A(1A|W@4.00EUR@32A),1009-25B(1A|N@4.00EUR@32A),1009-25C(1A|A@4.00EUR@32A),1009-25D(1A|A@4.00EUR@32A),1009-25E(1A|N@4.00EUR@32A),1009-25F(1A|W@4.00EUR@32A),1009-26A(1A|W@4.00EUR@32A),1009-26B(1A|N@4.00EUR@32A),1009-26C(1A|A@4.00EUR@32A),1009-26D(1A|A@4.00EUR@32A),1009-26E(1A|N@4.00EUR@32A),1009-26F(1A|W@4.00EUR@32A),1009-27A(1A|W@4.00EUR@32A),1009-27B(1A|N@4.00EUR@32A),1009-27C(1A|A@4.00EUR@32A),1009-27D(1A|A@4.00EUR@32A),1009-27E(1A|N@4.00EUR@32A),1009-27F(1A|W@4.00EUR@32A),1009-28A(1A|W@4.00EUR@32A),1009-28B(1A|N@4.00EUR@32A),1009-28C(1A|A@4.00EUR@32A),1009-28D(1A|A@4.00EUR@32A),1009-28E(1A|N@4.00EUR@32A),1009-28F(1A|W@4.00EUR@32A),1009-29A(1A|T|W@4.00EUR@32A),1009-29B(1A|N@4.00EUR@32A),1009-29C(1A|A@4.00EUR@32A),1009-29D(1A|A@4.00EUR@32A),1009-29E(1A|N@4.00EUR@32A),1009-29F(1A|W@4.00EUR@32A),1009-30A(1A|W@4.00EUR@32A),1009-30B(1A|N@4.00EUR@32A),1009-30C(1A|A@4.00EUR@32A),1009-30D(1A|A@4.00EUR@32A),1009-30E(1A|N@4.00EUR@32A),1009-30F(1A|W@4.00EUR@32A),1009-31A(1A|W|IE@4.00EUR@32A),1009-31B(1A|IE|N@4.00EUR@32A),1009-31C(1A|A|IE@4.00EUR@32A),1009-31D(1A|A|IE@4.00EUR@32A),1009-31E(1A|IE|N@4.00EUR@32A),1009-31F(1A|W|IE@4.00EUR@32A),1009-32A(1A|T|W|IE@4.00EUR@32A),1009-32B(1A|T|IE|N@4.00EUR@32A),1009-32C(1A|A|T|IE@4.00EUR@32A),1009-32D(1A|A|T|IE@4.00EUR@32A),1009-32E(1A|T|IE|N@4.00EUR@32A),1009-32F(1A|T|W|IE@4.00EUR@32A);8460-1A(PS|T|EL|W@60.00EUR@321),8460-1B(1A|PS|T|EL|N@60.00EUR@321),8460-1C(1A|A|PS|EL@60.00EUR@321),8460-1D(1A|A|PS|T|EL@60.00EUR@321),8460-1E(1A|PS|T|EL|N@60.00EUR@321),8460-1F(PS|T|EL|W@60.00EUR@321),8460-2A(PS|T|EL|W@32.00EUR@321),8460-2B(1A|PS|T|EL|N@32.00EUR@321),8460-2C(1A|A|PS|T|EL@32.00EUR@321),8460-2D(1A|A|PS|EL@32.00EUR@321),8460-2E(1A|PS|EL|N@32.00EUR@321),8460-2F(PS|EL|W@32.00EUR@321),8460-3A(PS|EL|W@32.00EUR@321),8460-3B(1A|PS|EL|N@32.00EUR@321),8460-3C(1A|A|PS|EL@32.00EUR@321),8460-3D(1A|A|PS|EL@32.00EUR@321),8460-3E(1A|PS|EL|N@32.00EUR@321),8460-3F(PS|EL|W@32.00EUR@321),8460-4A(PS|EL|W@25.00EUR@321),8460-4B(1A|PS|EL|N@25.00EUR@321),8460-4C(1A|A|PS|EL@25.00EUR@321),8460-4D(1A|A|PS|EL@25.00EUR@321),8460-4E(1A|PS|EL|N@25.00EUR@321),8460-4F(PS|EL|W@25.00EUR@321),8460-5A(UF|W@9.00EUR@321),8460-5B(1A|UF|N@9.00EUR@321),8460-5C(1A|UF|A@9.00EUR@321),8460-5D(1A|UF|A|T@9.00EUR@321),8460-5E(1A|UF|T|N@9.00EUR@321),8460-5F(UF|T|W@9.00EUR@321),8460-6A(UF|W@9.00EUR@321),8460-6B(1A|UF|N@9.00EUR@321),8460-6C(1A|UF|A@9.00EUR@321),8460-6D(1A|UF|A@9.00EUR@321),8460-6E(1A|UF|N@9.00EUR@321),8460-6F(UF|W@9.00EUR@321),8460-7A(UF|W@9.00EUR@321),8460-7B(1A|UF|N@9.00EUR@321),8460-7C(1A|UF|A@9.00EUR@321),8460-7D(1A|UF|A@9.00EUR@321),8460-7E(1A|UF|N@9.00EUR@321),8460-7F(UF|W@9.00EUR@321),8460-8A(UF|W@9.00EUR@321),8460-8B(1A|UF|N@9.00EUR@321),8460-8C(1A|UF|A@9.00EUR@321),8460-8D(1A|UF|A@9.00EUR@321),8460-8E(1A|UF|N@9.00EUR@321),8460-8F(UF|W@9.00EUR@321),8460-9A(UF|W@9.00EUR@321),8460-9B(1A|UF|N@9.00EUR@321),8460-9C(1A|UF|A@9.00EUR@321),8460-9D(1A|UF|A@9.00EUR@321),8460-9E(1A|UF|N@9.00EUR@321),8460-9F(UF|W@9.00EUR@321),8460-10B(WG|1A|UF|E|IE|N@9.00EUR@321),8460-10C(WG|1A|UF|A|E|IE@9.00EUR@321),8460-10D(WG|1A|UF|A|E|IE@9.00EUR@321),8460-10E(WG|1A|UF|E|IE|N@9.00EUR@321),8460-12A(WG|1A|E|EL|W|IE@11.00EUR@321),8460-12B(WG|1A|E|EL|IE|N@11.00EUR@321),8460-12C(WG|1A|A|E|EL|IE@11.00EUR@321),8460-12D(WG|1A|A|T|E|EL|IE@11.00EUR@321),8460-12E(WG|1A|T|E|EL|IE|N@11.00EUR@321),8460-12F(WG|1A|E|EL|W|IE@11.00EUR@321),8460-15A(WG|W|IE@8.00EUR@321),8460-15B(WG|1A|IE|N@8.00EUR@321),8460-15C(WG|1A|A|IE@8.00EUR@321),8460-15D(WG|1A|A|IE@8.00EUR@321),8460-15E(WG|1A|IE|N@8.00EUR@321),8460-15F(WG|W|IE@8.00EUR@321),8460-16A(W@8.00EUR@321),8460-16B(1A|N@8.00EUR@321),8460-16C(1A|A@8.00EUR@321),8460-16D(1A|A@8.00EUR@321),8460-16E(1A|N@8.00EUR@321),8460-16F(W@8.00EUR@321),8460-17A(W@8.00EUR@321),8460-17B(1A|N@8.00EUR@321),8460-17C(1A|A@8.00EUR@321),8460-17D(1A|A@8.00EUR@321),8460-17E(1A|N@8.00EUR@321),8460-17F(W@8.00EUR@321),8460-18A(W@8.00EUR@321),8460-18B(1A|N@8.00EUR@321),8460-18C(1A|A@8.00EUR@321),8460-18D(1A|A@8.00EUR@321),8460-18E(1A|N@8.00EUR@321),8460-18F(W@8.00EUR@321),8460-19A(1A|W@8.00EUR@321),8460-19B(1A|N@8.00EUR@321),8460-19C(1A|A@8.00EUR@321),8460-19D(1A|A@8.00EUR@321),8460-19E(1A|N@8.00EUR@321),8460-19F(1A|W@8.00EUR@321),8460-20A(1A|T|W@7.00EUR@321),8460-20B(1A|T|N@7.00EUR@321),8460-20C(1A|A|T@7.00EUR@321),8460-20D(1A|A|T@7.00EUR@321),8460-20E(1A|T|N@7.00EUR@321),8460-20F(1A|T|W@7.00EUR@321),8460-21A(T|W@7.00EUR@321),8460-21B(1A|N@7.00EUR@321),8460-21C(1A|A@7.00EUR@321),8460-21D(1A|A@7.00EUR@321),8460-21E(1A|N@7.00EUR@321),8460-21F(W@7.00EUR@321),8460-22A(W@7.00EUR@321),8460-22B(1A|N@7.00EUR@321),8460-22C(1A|A@7.00EUR@321),8460-22D(1A|A@7.00EUR@321),8460-22E(1A|N@7.00EUR@321),8460-22F(W@7.00EUR@321),8460-23A(W@7.00EUR@321),8460-23B(1A|N@7.00EUR@321),8460-23C(1A|A@7.00EUR@321),8460-23D(1A|A@7.00EUR@321),8460-23E(1A|N@7.00EUR@321),8460-23F(W@7.00EUR@321),8460-24A(W@7.00EUR@321),8460-24B(1A|N@7.00EUR@321),8460-24C(1A|A@7.00EUR@321),8460-24D(1A|A@7.00EUR@321),8460-24E(1A|N@7.00EUR@321),8460-24F(W@7.00EUR@321),8460-25A(1A|W@5.00EUR@321),8460-25B(1A|N@5.00EUR@321),8460-25C(1A|A@5.00EUR@321),8460-25D(1A|A|T@5.00EUR@321),8460-25E(1A|N@5.00EUR@321),8460-25F(1A|W@5.00EUR@321),8460-26A(1A|W@5.00EUR@321),8460-26B(1A|N@5.00EUR@321),8460-26C(1A|A@5.00EUR@321),8460-26D(1A|A@5.00EUR@321),8460-26E(1A|N@5.00EUR@321),8460-26F(1A|W@5.00EUR@321),8460-27A(1A|T|W|IE@5.00EUR@321),8460-27B(1A|IE|N@5.00EUR@321),8460-27C(1A|A|IE@5.00EUR@321),8460-27D(1A|A|IE@5.00EUR@321),8460-27E(1A|IE|N@5.00EUR@321),8460-27F(1A|T|W|IE@5.00EUR@321),8460-28A(1A|E|EL|W|IE@11.00EUR@321),8460-28B(1A|E|EL|IE|N@11.00EUR@321),8460-28C(1A|A|E|EL|IE@11.00EUR@321),8460-28D(1A|A|E|EL|IE@11.00EUR@321),8460-28E(1A|E|EL|IE|N@11.00EUR@321),8460-28F(1A|E|EL|W|IE@11.00EUR@321),8460-29A(1A|W|IE@5.00EUR@321),8460-29B(1A|IE|N@5.00EUR@321),8460-29C(1A|A|IE@5.00EUR@321),8460-29D(1A|A|IE@5.00EUR@321),8460-29E(1A|IE|N@5.00EUR@321),8460-29F(1A|T|W|IE@5.00EUR@321),8460-30A(1A|W@5.00EUR@321),8460-30B(1A|N@5.00EUR@321),8460-30C(1A|A@5.00EUR@321),8460-30D(1A|A@5.00EUR@321),8460-30E(1A|N@5.00EUR@321),8460-30F(1A|W@5.00EUR@321),8460-31A(1A|W@5.00EUR@321),8460-31B(1A|N@5.00EUR@321),8460-31C(1A|A@5.00EUR@321),8460-31D(1A|A@5.00EUR@321),8460-31E(1A|N@5.00EUR@321),8460-31F(1A|T|W@5.00EUR@321),8460-32A(1A|W@5.00EUR@321),8460-32B(1A|N@5.00EUR@321),8460-32C(1A|A@5.00EUR@321),8460-32D(1A|A@5.00EUR@321),8460-32E(1A|T|N@5.00EUR@321),8460-32F(1A|T|W@5.00EUR@321),8460-33A(1A|W@5.00EUR@321),8460-33B(1A|N@5.00EUR@321),8460-33C(1A|A@5.00EUR@321),8460-33D(1A|A@5.00EUR@321),8460-33E(1A|N@5.00EUR@321),8460-33F(1A|W@5.00EUR@321),8460-34A(1A|W@5.00EUR@321),8460-34B(1A|N@5.00EUR@321),8460-34C(1A|A@5.00EUR@321),8460-34D(1A|A@5.00EUR@321),8460-34E(1A|N@5.00EUR@321),8460-34F(1A|W@5.00EUR@321),8460-35A(1A|W@5.00EUR@321),8460-35B(1A|N@5.00EUR@321),8460-35C(1A|A@5.00EUR@321),8460-35D(1A|A@5.00EUR@321),8460-35E(1A|N@5.00EUR@321),8460-35F(1A|W@5.00EUR@321),8460-36A(1A|W@5.00EUR@321),8460-36B(1A|N@5.00EUR@321),8460-36C(1A|A@5.00EUR@321),8460-36D(1A|A|T@5.00EUR@321),8460-36E(1A|T|N@5.00EUR@321),8460-36F(1A|T|W@5.00EUR@321),8460-37A(1A|W@5.00EUR@321),8460-37B(1A|N@5.00EUR@321),8460-37C(1A|A@5.00EUR@321),8460-37D(1A|A@5.00EUR@321),8460-37E(1A|N@5.00EUR@321),8460-37F(1A|W@5.00EUR@321),8460-38A(1A|W@5.00EUR@321),8460-38B(1A|N@5.00EUR@321),8460-38C(1A|A@5.00EUR@321),8460-38D(1A|A@5.00EUR@321),8460-38E(1A|N@5.00EUR@321),8460-38F(1A|W@5.00EUR@321),8460-39A(1A|W@5.00EUR@321),8460-39B(1A|N@5.00EUR@321),8460-39C(1A|A@5.00EUR@321),8460-39D(1A|A@5.00EUR@321),8460-39E(1A|N@5.00EUR@321),8460-39F(1A|W@5.00EUR@321),8460-40A(1A|T|W@5.00EUR@321),8460-40B(1A|T|N@5.00EUR@321),8460-40C(1A|A|T@5.00EUR@321),8460-40D(1A|A@5.00EUR@321),8460-40E(1A|N@5.00EUR@321),8460-40F(1A|T|W@5.00EUR@321);",
//                 "perPassenger": true,
//                 "isOptional": true
//             },
//             {
//                 "name": "LuggageOptions",
//                 "type": "value_select",
//                 "displayText": "Please Select Luggage Option: 1 (1 bags - 15Kg total - 48.00 EUR), 2 (1 bags - 20Kg total - 50.00 EUR), 3 (1 bags - 25Kg total - 52.00 EUR), 4 (1 bags - 30Kg total - 135.00 EUR)",
//                 "perPassenger": true,
//                 "isOptional": true
//             },
//             {
//                 "name": "ValueAddedTaxNumber",
//                 "type": "text",
//                 "displayText": "VAT Identification Number",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCAAResTransStatus",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCAAv",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCACResTransStatus",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCADSTransID",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCAXID",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCAECI",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCAMessageVersion",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "EmergencyContactName",
//                 "type": "text",
//                 "displayText": "Emergency contact name(s) - non-traveller(s)",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "EmergencyContactLastName",
//                 "type": "text",
//                 "displayText": "Emergency contact last name(s) - non-travelle(s)",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "EmergencyContactCountry",
//                 "type": "formatted_text",
//                 "displayText": "Emergency contact country (two-letter code, e.g. GB) - non-traveller(s)",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "EmergencyContactPhoneNumber",
//                 "type": "text",
//                 "displayText": "Country code - phone number (two/three digit code using - delimiter, e.g. +44-07890123456)",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "EmergencyContactEmail",
//                 "type": "text",
//                 "displayText": "Emergency contact email",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "AmexBTACostCentre",
//                 "type": "text",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "AmexBTAEmployeeId",
//                 "type": "text",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "AmexBTATravelBookerName",
//                 "type": "text",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "AmexBTAJobNumber",
//                 "type": "text",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "AmexBTAProjectCode",
//                 "type": "text",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "AmexBTABusinessUnit",
//                 "type": "text",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "AmexBTAOther",
//                 "type": "text",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCAThreeDSServerTransID",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             },
//             {
//                 "name": "SCACAVVAlgorithm",
//                 "type": "custom",
//                 "displayText": "",
//                 "perPassenger": false,
//                 "isOptional": true
//             }
//         ]
//     },
//     "supplierInfos": {
//         "HLD37EDGCI0QHSHO": [
//             {
//                 "displayName": "Space One or Space Plus Seat Notice",
//                 "infoType": "text",
//                 "info": "Contains Attribute PS, including 2 pieces in cabin (one underseat bag + cabin bag)"
//             },
//             {
//                 "displayName": "Title Notice",
//                 "infoType": "remark",
//                 "info": "Title must be provided for children and infants, otherwise it would default to 'Mr'."
//             },
//             {
//                 "displayName": "Cabin Bag",
//                 "infoType": "text",
//                 "info": "Passengers in this booking who are travelling with an infant or have booked a Space One or Space Plus seat will travel with 2 pieces in cabin (one underseat bag + cabin bag).All other passengers can only take 1 item of hand luggage, which must fit under the seat in front (max. 40x20x30 cm). It they take a second item or if their luggage exceeds the permitted size, they will have to check it in at a cost of up to 75.00 EUR."
//             },
//             {
//                 "displayName": "Hand luggage",
//                 "infoType": "url",
//                 "info": "https://www.vueling.com/en/vueling-services/prepare-your-trip/luggage"
//             },
//             {
//                 "displayName": "Terms and Conditions",
//                 "infoType": "url",
//                 "info": "https://www.vueling.com/en/customer-services/conditions-of-carriage"
//             },
//             {
//                 "displayName": "Basic Fare",
//                 "infoType": "remark",
//                 "info": "VY1009:On board hand luggage included: Fee applies for additional checked baggage;Cancellations not permitted;Ticket is non refundable in case of no show;Route changes not permitted;PAX name change subject to a fee;Flight dates change subject to a fee.;VY8460:On board hand luggage included: Fee applies for additional checked baggage;Cancellations not permitted;Ticket is non refundable in case of no show;Route changes not permitted;PAX name change subject to a fee;Flight dates change subject to a fee.;"
//             }
//         ]
//     },
//     "formOfPayments": {
//         "XMLSELECT": {
//             "supportedTypes": [
//                 "CASH"
//             ],
//             "supportedCreditCards": []
//         },
//         "N2RR64Q7T8JNUNHL": {
//             "supportedTypes": [
//                 "CREDIT_CARD"
//             ],
//             "supportedCreditCards": [
//                 {
//                     "cardType": "American Express",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "Visa Debit",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "Visa Electron",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "Corporate MasterCard",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "Corporate American Express",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "MasterCard Debit",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "Discover",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "MasterCard",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "Air Plus",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "Visa Credit",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "Corporate Visa Credit",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "UATP",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "BTA American Express",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 },
//                 {
//                     "cardType": "I-BTA American Express",
//                     "amount": 0.0,
//                     "currency": "EUR"
//                 }
//             ]
//         }
//     }
// }
//     `) as any);

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
        private destroyService: DestroyService
    ) {
        // const supplierInfos = new Map<string, SupplierInfo[]>();

        // if (this.details.supplierInfos != null) {
        //     for (const key in this.details.supplierInfos) {
        //         supplierInfos.set(key, (this.details.supplierInfos[key] as SupplierInfo[]));
        //     }
        // }

        // this.details.supplierInfos = supplierInfos;

        // const formOfPayments = new Map<string, SupportedPayments>();

        // if (this.details.formOfPayments != null) {
        //     for (const key in this.details.formOfPayments) {
        //         formOfPayments.set(key, (this.details.formOfPayments[key] as SupportedPayments))
        //     }
        // }

        // this.details.formOfPayments = formOfPayments;

        // this.details$.next(this.details);
    }

    public getDetails(): Observable<AirCheckoutDetailsResponse | null> {
        return this.details$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getDetailsValue(): AirCheckoutDetailsResponse | null {
        return this.details$.value;
    }

    public getPrice(): Observable<AirCheckoutPriceResponse | null> {
        return this.price$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getPriceValue(): AirCheckoutPriceResponse | null {
        return this.price$.value;
    }

    async loadDetails(body: AirCheckoutDetailsRequest): Promise<void> {

        return new Promise<void>((resolve) => {
            this.authService.getUser().subscribe((user: User) => {
                if(!(user instanceof AuthenticatedUser)) return;
                
                this.httpClient.post<AirCheckoutDetailsResponse>(`${this.ENDPOINT}/checkout-details`, body, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`
                    }
                }).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe({
                    next: (response: AirCheckoutDetailsResponse) => {
                        const details: any = response as AirCheckoutDetailsResponse;


                        const supplierInfos = new Map<string, SupplierInfo[]>();

                        if (details.supplierInfos != null) {
                            for (const key in details.supplierInfos) {
                                supplierInfos.set(key, (details.supplierInfos[key] as SupplierInfo[]));
                            }
                        }

                        details.supplierInfos = supplierInfos;

                        const formOfPayments = new Map<string, SupportedPayments>();

                        if (details.formOfPayments != null) {
                            for (const key in details.formOfPayments) {
                                formOfPayments.set(key, (details.formOfPayments[key] as SupportedPayments))
                            }
                        }

                        details.formOfPayments = formOfPayments;
                        
                        this.details$.next(details);
                    },
                    error: () => {
                        this.details$.next(null)
                        resolve();
                    },
                    complete: () => resolve()
                });
            })
        })
    }

    loadPrice(body: AirCheckoutPriceRequest): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            this.httpClient.post<AirCheckoutPriceResponse>(`${this.ENDPOINT}/checkout-price`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`
                }
            }).subscribe({
                next: (response: AirCheckoutPriceResponse) =>{

                    const price: any = response as AirCheckoutPriceResponse;


                    const supplierInfos = new Map<string, SupplierInfo[]>();

                    if (price.supplierInfos != null) {
                        for (const key in price.supplierInfos) {
                            supplierInfos.set(key, (price.supplierInfos[key] as SupplierInfo[]));
                        }
                    }

                    price.supplierInfos = supplierInfos;

                    const bookingRefs: Map<string, BookingRefs> = new Map<string, BookingRefs>();

                    if (price.bookingRefs != null) {
                        for (const key in price.bookingRefs) {
                            bookingRefs.set(key, (price.bookingRefs[key] as BookingRefs))
                        }
                    }

                    price.bookingRefs = bookingRefs;

                    this.price$.next(price);
                },
                error: (err: Error) => {
                    this.price$.next(null)
                }
            });
        });
    }

    resetPrice(): void {
        this.price$.next(null);
    }

    resetDetails(): void {
        this.details$.next(null);
    }
}