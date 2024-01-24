import { Component, Input } from "@angular/core";
import { AirSegment } from "src/app/modules/neo/models/air-segment.model";
import { FareDetails } from "src/app/modules/neo/models/fare-details.model";
import { FlightOption } from "src/app/modules/neo/models/flight-option.model";
import { PassengerPrices } from "src/app/modules/neo/models/passengers-price.model";
import { AirSearchResponse } from "src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model";

@Component({
	selector: 'app-tab-price-details',
	templateUrl: './tab-price-details.component.html',
	styleUrls: ['./tab-price-details.component.scss'],
})
export class TabPriceDetailsComponent {
	@Input() result!: AirSearchResponse;
    @Input() selected!: { [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null };

	constructor() {}

	get passengersPrices(): PassengerPrices {
		const prices: PassengerPrices = [];
		for (let price of this.result.price.passengersPrices) {
			if (prices.every((p) => p.ptc != price.ptc)) {
				prices.push(price);
			}
		}
		return prices;
	}

	get hasPassengersPrice(): boolean {
		return !(this.result.price.passengersPrices == null);
	}

	get isRoundTrip(): boolean {
		return this.result.inbounds && this.result.inbounds.length > 0;
	}

	fareDetails(ptc: string, segment: AirSegment): FareDetails {
		const fareDetails: FareDetails[] = segment.fareDetailsList.filter(
            (details: FareDetails) => details.ptc == ptc
		);
		return fareDetails[0];
	}

    get inbound(): FlightOption | null {
        if(!this.selected) return null;

        return this.selected['INBOUNDS'];
    }

    get outbound(): FlightOption | null {
        if(!this.selected) return null;
        return this.selected['OUTBOUNDS'];
    }
}
