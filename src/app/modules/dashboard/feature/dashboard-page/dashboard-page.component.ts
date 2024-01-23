import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { UserService } from 'src/app/core/authentication/user/user.service';
import { User } from 'src/app/core/models/user/user.model';
import { AirSearchResponse } from 'src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit{

    user$!: Observable<User>;

    testResult!: AirSearchResponse;

    constructor(
        private authService: AuthService
    ) {
        this.testResult = JSON.parse(`
        {
    "show": true,
    "id": "0b199ba0-7b97-4f52-b2e8-73f0a286e9ed",
    "price": {
        "amount": 246.68,
        "currency": "EUR",
        "preferredCurrency": "EUR",
        "totalAmount": 246.68,
        "includeTaxes": true,
        "exchange": false,
        "passengersPrices": [
            {
                "amount": 0,
                "currency": "EUR",
                "preferredCurrency": "EUR",
                "totalAmount": 246.68,
                "includeTaxes": true,
                "exchange": false,
                "taxes": [
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
                        "amount": 13.61,
                        "currency": "EUR"
                    },
                    {
                        "name": "GB",
                        "amount": 15.16,
                        "currency": "EUR"
                    },
                    {
                        "name": "UB",
                        "amount": 25.65,
                        "currency": "EUR"
                    },
                    {
                        "name": "YQ",
                        "amount": 42,
                        "currency": "EUR"
                    },
                    {
                        "name": "YR",
                        "amount": 2,
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
            "id": "70e943c8-eaf8-4e96-b418-8db9dc58cf0b",
            "searchId": "b4892c7f-ac41-446d-ae77-c273cedd8acd",
            "provider": "XMLSELECT",
            "duration": 85,
            "segments": [
                {
                    "origin": {
                        "code": "CDG",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "LHR",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-01-26T07:35:00",
                    "arrivalDatetime": "2024-01-26T08:00:00",
                    "flightNumber": 1680,
                    "duration": 85,
                    "equipment": {
                        "code": "223",
                        "name": "Airbus A220-300"
                    },
                    "operatingCarrier": {
                        "code": "AF",
                        "name": "Air France",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/AF.png"
                    },
                    "marketingCarrier": {
                        "code": "AF",
                        "name": "Air France",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/AF.png"
                    },
                    "departureTerminal": "2E",
                    "arrivalTerminal": "4",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "HYL0AALA",
                            "cabinClass": "Economy",
                            "bookingClass": "H",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                }
            ],
            "tags": ["LCC"],
            "nstops": 0,
            "show": true
        }
    ],
    "inbounds": [
        {
            "id": "528db03c-ecf7-4418-869c-bf7ccf8b453a",
            "searchId": "b4892c7f-ac41-446d-ae77-c273cedd8acd",
            "provider": "XMLSELECT",
            "duration": 80,
            "segments": [
                {
                    "origin": {
                        "code": "LHR",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "CDG",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-02-20T06:20:00",
                    "arrivalDatetime": "2024-02-20T08:40:00",
                    "flightNumber": 1381,
                    "duration": 80,
                    "equipment": {
                        "code": "223",
                        "name": "Airbus A220-300"
                    },
                    "operatingCarrier": {
                        "code": "AF",
                        "name": "Air France",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/AF.png"
                    },
                    "marketingCarrier": {
                        "code": "AF",
                        "name": "Air France",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/AF.png"
                    },
                    "departureTerminal": "4",
                    "arrivalTerminal": "2E",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "TYL0AALA",
                            "cabinClass": "Tourist",
                            "bookingClass": "T",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                }
            ],
            "tags": [],
            "nstops": 0,
            "show": true
        },
        {
            "id": "548e8b90-25c6-4a2f-9783-595ec818c229",
            "searchId": "b4892c7f-ac41-446d-ae77-c273cedd8acd",
            "provider": "XMLSELECT",
            "duration": 80,
            "segments": [
                {
                    "origin": {
                        "code": "LHR",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "CDG",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-02-20T11:30:00",
                    "arrivalDatetime": "2024-02-20T13:50:00",
                    "flightNumber": 1581,
                    "duration": 80,
                    "equipment": {
                        "code": "223",
                        "name": "Airbus A220-300"
                    },
                    "operatingCarrier": {
                        "code": "AF",
                        "name": "Air France",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/AF.png"
                    },
                    "marketingCarrier": {
                        "code": "AF",
                        "name": "Air France",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/AF.png"
                    },
                    "departureTerminal": "4",
                    "arrivalTerminal": "2E",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "TYL0AALA",
                            "cabinClass": "Tourist",
                            "bookingClass": "T",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                }
            ],
            "tags": [],
            "nstops": 0,
            "show": true
        },
        {
            "id": "9fdf8e9c-0199-4f93-9673-b11fc801a648",
            "searchId": "b4892c7f-ac41-446d-ae77-c273cedd8acd",
            "provider": "XMLSELECT",
            "duration": 80,
            "segments": [
                {
                    "origin": {
                        "code": "LHR",
                        "type": "AIRPORT"
                    },
                    "destination": {
                        "code": "CDG",
                        "type": "AIRPORT"
                    },
                    "departureDatetime": "2024-02-20T15:00:00",
                    "arrivalDatetime": "2024-02-20T17:20:00",
                    "flightNumber": 1781,
                    "duration": 80,
                    "equipment": {
                        "code": "223",
                        "name": "Airbus A220-300"
                    },
                    "operatingCarrier": {
                        "code": "AF",
                        "name": "Air France",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/AF.png"
                    },
                    "marketingCarrier": {
                        "code": "AF",
                        "name": "Air France",
                        "logo_url": "https://carrierlogos.s3.us-east-2.amazonaws.com/AF.png"
                    },
                    "departureTerminal": "4",
                    "arrivalTerminal": "2E",
                    "fareDetailsList": [
                        {
                            "ptc": "ADULT",
                            "fareBasis": "TYL0AALA",
                            "cabinClass": "Tourist",
                            "bookingClass": "T",
                            "description": "",
                            "privateFare": false
                        }
                    ]
                }
            ],
            "tags": [],
            "nstops": 0,
            "show": true
        }
    ],
    "splitTicketing": false
}`)
    }
    ngOnInit(): void {
        this.user$ = this.authService.getUser();
    }
}
