import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { UserService } from 'src/app/core/authentication/user/user.service';
import { User } from 'src/app/core/models/user/user.model';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { CircularLinkedList } from 'src/app/core/utils/circular-linked-list.structure';
import { DoublyLinkedList } from 'src/app/core/utils/doubly-linked-list.structure';
import { CheckoutService } from 'src/app/modules/neo/data-access/checkout.service';
import { ReservationService } from 'src/app/modules/neo/data-access/reservation/reservation.service';
import { AirCheckoutDetailsResponse } from 'src/app/modules/neo/features/search/models/air-checkout-details-response.model';
import { AirSearchResponse } from 'src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit{

    InputType = InputType;

    user$!: Observable<User>;

    testResult!: AirSearchResponse;
    private doubleList: CircularLinkedList<string> = new CircularLinkedList<string>();
    private forwardsIterator: Iterator<string>;
    private reverseIterator: Iterator<string>;

    constructor(
        private authService: AuthService,
        private alertService: AlertService
    ) {

        this.doubleList.append("1");
        this.doubleList.append("2");
        this.doubleList.append("3");
        this.doubleList.append("4");

        this.forwardsIterator = this.doubleList.forwardsIterator();
        this.reverseIterator = this.doubleList.backwardIterator();

        this.testResult = JSON.parse(`
        {
    "show": true,
    "id": "d04b5c79-2658-4eaa-85e9-accb1fca4743",
    "price": {
        "amount": 319.11,
        "currency": "EUR",
        "preferredCurrency": "EUR",
        "totalAmount": 319.11,
        "includeTaxes": true,
        "exchange": false,
        "passengersPrices": [
            {
                "amount": 0,
                "currency": "EUR",
                "preferredCurrency": "EUR",
                "totalAmount": 319.11,
                "includeTaxes": true,
                "exchange": false,
                "taxes": [
                    {
                        "name": "J9",
                        "amount": 4,
                        "currency": "EUR"
                    },
                    {
                        "name": "PT",
                        "amount": 14.24,
                        "currency": "EUR"
                    },
                    {
                        "name": "YP",
                        "amount": 36.44,
                        "currency": "EUR"
                    },
                    {
                        "name": "FR",
                        "amount": 17.63,
                        "currency": "EUR"
                    },
                    {
                        "name": "IZ",
                        "amount": 1.13,
                        "currency": "EUR"
                    },
                    {
                        "name": "O4",
                        "amount": 1.5,
                        "currency": "EUR"
                    },
                    {
                        "name": "QX",
                        "amount": 11.17,
                        "currency": "EUR"
                    },
                    {
                        "name": "YQ",
                        "amount": 73,
                        "currency": "EUR"
                    }
                ],
                "ptc": "ADULT",
                "quantity": 1
            }
        ]
    },
    "outbounds": [
        {
            "id": "61b4911d-5e00-436b-89f1-8f291cfa95a2",
            "searchId": "ce905f66-ee8e-4cdf-9304-c4484789b26d",
            "provider": "XMLSELECT",
            "duration": 1440,
            "segments": [
                {
                    "origin": {
                        "code": "PDL",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "LIS",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-01-25T20:15:00",
                    "arrivalDatetime": "2024-01-25T23:30:00",
                    "flightNumber": 6626,
                    "duration": 135,
                    "equipment": {
                        "code": "320",
                        "name": "Airbus A320"
                    },
                    "operatingCarrier": {
                        "code": "S4",
                        "name": "SATA Intl",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/S4.png"
                    },
                    "marketingCarrier": {
                        "code": "TP",
                        "name": "TAP Air Portugal",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/TP.png"
                    },
                    "departureTerminal": "",
                    "arrivalTerminal": "1",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "UF0CLC00",
                            "cabinClass": "Shuttle",
                            "bookingClass": "U",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                },
                {
                    "origin": {
                        "code": "LIS",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "OPO",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-01-26T06:45:00",
                    "arrivalDatetime": "2024-01-26T07:45:00",
                    "flightNumber": 1920,
                    "duration": 60,
                    "equipment": {
                        "code": "32N",
                        "name": "Airbus A320-212"
                    },
                    "operatingCarrier": {
                        "code": "TP",
                        "name": "TAP Air Portugal",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/TP.png"
                    },
                    "marketingCarrier": {
                        "code": "TP",
                        "name": "TAP Air Portugal",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/TP.png"
                    },
                    "departureTerminal": "1",
                    "arrivalTerminal": "",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "UF0CLC00",
                            "cabinClass": "Shuttle",
                            "bookingClass": "U",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                },
                {
                    "origin": {
                        "code": "OPO",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "ORY",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-01-26T19:05:00",
                    "arrivalDatetime": "2024-01-26T22:15:00",
                    "flightNumber": 456,
                    "duration": 130,
                    "equipment": {
                        "code": "320",
                        "name": "Airbus A320"
                    },
                    "operatingCarrier": {
                        "code": "TP",
                        "name": "TAP Air Portugal",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/TP.png"
                    },
                    "marketingCarrier": {
                        "code": "TP",
                        "name": "TAP Air Portugal",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/TP.png"
                    },
                    "departureTerminal": "",
                    "arrivalTerminal": "1",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "UF0CLC00",
                            "cabinClass": "Shuttle",
                            "bookingClass": "U",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                }
            ],
            "tags": [],
            "nstops": 2,
            "show": true
        }
    ],
    "inbounds": [
        {
            "id": "dbacd2e4-f716-4248-9196-b04388324f11",
            "searchId": "ce905f66-ee8e-4cdf-9304-c4484789b26d",
            "provider": "XMLSELECT",
            "duration": 350,
            "segments": [
                {
                    "origin": {
                        "code": "ORY",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "OPO",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-01-30T10:20:00",
                    "arrivalDatetime": "2024-01-30T11:30:00",
                    "flightNumber": 453,
                    "duration": 130,
                    "equipment": {
                        "code": "E90",
                        "name": "EMBRAER 190"
                    },
                    "operatingCarrier": {
                        "code": "NI",
                        "name": "Portugalia Air",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/NI.png"
                    },
                    "marketingCarrier": {
                        "code": "TP",
                        "name": "TAP Air Portugal",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/TP.png"
                    },
                    "departureTerminal": "1",
                    "arrivalTerminal": "",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "LF0CLC00",
                            "cabinClass": "Economy",
                            "bookingClass": "L",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                },
                {
                    "origin": {
                        "code": "OPO",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "PDL",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-01-30T12:40:00",
                    "arrivalDatetime": "2024-01-30T14:10:00",
                    "flightNumber": 6627,
                    "duration": 150,
                    "equipment": {
                        "code": "320",
                        "name": "Airbus A320"
                    },
                    "operatingCarrier": {
                        "code": "S4",
                        "name": "SATA Intl",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/S4.png"
                    },
                    "marketingCarrier": {
                        "code": "TP",
                        "name": "TAP Air Portugal",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/TP.png"
                    },
                    "departureTerminal": "",
                    "arrivalTerminal": "",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "LF0CLC00",
                            "cabinClass": "Economy",
                            "bookingClass": "L",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                }
            ],
            "tags": [],
            "nstops": 1,
            "show": true
        }
    ],
    "splitTicketing": false
}`)
    }
    ngOnInit(): void {
        this.user$ = this.authService.getUser();
    }

    public forwardInList(): void {
        console.log(this.forwardsIterator.next())
    }

    public backwardsList(): void {
        console.log(this.reverseIterator.next())
    }
}
