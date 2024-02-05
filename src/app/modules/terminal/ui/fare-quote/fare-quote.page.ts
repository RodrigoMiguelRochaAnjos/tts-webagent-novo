import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { TerminalService } from '../../data-access/terminal.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';


class DisplayInfo {
	passengersNumber!: number;
	passengersType!: string;
	price!: number;
	currency!: string;
	priceDetails!: PriceDetails[];
	baggageAllowance!: AllowanceInfo[];
	carryOnAllowance!: AllowanceInfo[];
}

class PriceDetails {
	flight!: string;
	price!: number;
	passengersNumber!: number;
	fareName!: string;
}

class AllowanceInfo {
	carrier!: string;
	origin!: string;
	destination!: string;
	passengers!: string;
	link!: string;
	bags!: BagInfo[];
}

class BagInfo {
	number!: number;
	fee!: string;
	description!: string;
}

@Component({
	selector: 'app-fare-quote',
	templateUrl: './fare-quote.page.html',
	styleUrls: ['./fare-quote.page.scss'],
})
export class FareQuotePage implements OnInit {
	@Input() fareQuoteData: any;
	@Input() segments: any;
	@Input() selectedFares: any;
	@Output() onClose = new EventEmitter<string>();
	@Output() backTerminal = new EventEmitter<string>();
	@Output() closeBrands = new EventEmitter<string>();

	displayInfo: DisplayInfo[] = [];
	priceDetailsDisplay: boolean[] = [];
	baggageDetailsDisplay: boolean[] = [];
	private fareQuoteSubmitMessage!: string;

	constructor(
		private alertService: AlertService,
		private terminalService: TerminalService,
		private translate: TranslateService) {
			translate.stream('FARE_QUOTE_SUBMIT_MESSAGE').subscribe((text:string) => { this.fareQuoteSubmitMessage = text});
		}

	ngOnInit(): void {
		const segments: any[] = this.segments;
		const selectedFares: any[] = this.selectedFares;

		const passList = segments[0].passList;
		passList.forEach((passengerInfo: any) => {
			const info = new DisplayInfo();
			info.passengersNumber = Number(passengerInfo.numPTCs);
			info.passengersType = passengerInfo.PTC;
			info.price = 0;
			info.priceDetails = [];

			let lastFlightId = -1;
			let flight: any[] = [];
			selectedFares.forEach((fareIndex, segmentIndex) => {
				const segment = segments[segmentIndex];
				const fare = segment.faresList[fareIndex];
				if (Number(fare.conxId) !== lastFlightId) {
					this.priceDetailsDisplay.push(false);
					flight = [];
					flight.push(segment.origin);
					flight.push(segment.destination);
					fare.passFares.forEach((passengerFare: any) => {
						const priceDetails = new PriceDetails();
						if (passengerFare.PTC === info.passengersType) {
							priceDetails.passengersNumber = passengerFare.numPTCs;
							priceDetails.price = parseFloat(passengerFare.brandObj.price.amount);
							priceDetails.fareName = fare.fareInfo.name;
							info.priceDetails.push(priceDetails);
							const nextFlightId = segmentIndex < selectedFares.length - 1 ? Number(segments[segmentIndex + 1].faresList[0].conxId) : -1;
							if (nextFlightId !== Number(fare.conxId)) {
								info.priceDetails[info.priceDetails.length - 1].flight = flight.join(' - ');
							}
							info.price += parseFloat(passengerFare.brandObj.price.amount);
							if (info.currency == null) {
								info.currency = fare.fareInfo.price.currency;
							}
						}
					});
				} else {
					if (flight.length === 0 || (flight.length > 0 && flight[flight.length - 1] !== segment.origin)) {
						flight.push(segment.origin);
					}
					flight.push(segment.destination);
					info.priceDetails[info.priceDetails.length - 1].flight = flight.join(' - ');
				}
				lastFlightId = Number(fare.conxId);
			});

			info.baggageAllowance = [];
			info.carryOnAllowance = [];
			this.fareQuoteData.allowances.forEach((allowances: any) => {
				if (allowances.PTC === info.passengersType) {
					this.baggageDetailsDisplay.push(false);
					allowances.baggageAllowances.forEach((allowance: any) => {
						const allowanceInfo = new AllowanceInfo();
						allowanceInfo.carrier = allowance.carrier;
						allowanceInfo.origin = allowance.origin;
						allowanceInfo.destination = allowance.destination;
						allowanceInfo.passengers = allowance.textInfo;
						allowanceInfo.link = 'https://' + allowance.moreUrl;
						allowanceInfo.bags = [];
						allowance.bagDetails.forEach((bagInfo: any) => {
							const bag = new BagInfo();
							bag.number = bagInfo.bagNum;
							bag.fee = bagInfo.totalPrice === 'NO FEE' ? bagInfo.totalPrice : bagInfo.totalPrice + ' ' + bagInfo.currency;
							bag.description = bagInfo.text;
							allowanceInfo.bags.push(bag);
						});
						info.baggageAllowance.push(allowanceInfo);
					});
					allowances.carryAllowances.forEach((allowance: any) => {
						const allowanceInfo = new AllowanceInfo();
						allowanceInfo.carrier = allowance.carrier;
						allowanceInfo.origin = allowance.origin;
						allowanceInfo.destination = allowance.destination;
						allowanceInfo.passengers = allowance.textInfo;
						allowanceInfo.bags = [];
						allowance.carryOnDetails.forEach((bagInfo: any) => {
							const bag = new BagInfo();
							bag.number = bagInfo.bagNum;
							bag.fee = bagInfo.totalPrice === 'NO FEE' ? bagInfo.totalPrice : bagInfo.totalPrice + ' ' + bagInfo.currency;
							bag.description = bagInfo.text;
							allowanceInfo.bags.push(bag);
						});
						info.carryOnAllowance.push(allowanceInfo);
					});
				}
			});

			this.displayInfo.push(info);
		});
		for(let i = 0; i<this.displayInfo.length; i++){
			this.toggleBaggageDetailDisplay(i);
			this.togglePriceDetailDisplay(i);
		}
	}

	togglePriceDetailDisplay(index: number): void {
		this.priceDetailsDisplay[index] = !this.priceDetailsDisplay[index];
	}

	toggleBaggageDetailDisplay(index: number): void {
		this.baggageDetailsDisplay[index] = !this.baggageDetailsDisplay[index];
	}

	priceDetailsIcon(index: number): string {
		return this.priceDetailsDisplay[index] ? 'chevron-up' : 'chevron-down';
	}

	baggageDetailsIcon(index: number): string {
		return this.baggageDetailsDisplay[index] ? 'chevron-up' : 'chevron-down';
	}

	priceDetailsLine(index: number): string {
		return this.priceDetailsDisplay[index] ? 'none' : 'full';
	}

	baggageDetailsLine(index: number): string {
		return this.baggageDetailsDisplay[index] ? 'none' : 'full';
	}

	closeFareQuote(): void {
		this.onClose.emit();
	}

	submitFareQuote(): void {
		// this.statisticsService.addClientStat(clientStatisticsSources.brandedFareQuoteSubmit);
        this.alertService.show(AlertType.CONFIRMATION, this.fareQuoteSubmitMessage).subscribe((action: AlertAction) => {
            if(action === AlertAction.WAITING) return;

            switch(action) {
                case AlertAction.EXECUTE:
                    this.closeFareQuote();
                    const command: any = {
                        fs: {
                            t: 'rcbook',
                            s: [],
                        },
                    };

                    const segments: any[] = this.segments;
                    const selectedFares: any[] = this.selectedFares;
                    selectedFares.forEach((fareIndex, segmentIndex) => {
                        const segment = segments[segmentIndex];
                        const fare = segment.faresList[fareIndex];
                        const ptcs: any = [];
                        segment.passList.forEach((passenger: any) => {
                            for (let i = 0; i < passenger.numPTCs; i++) {
                                ptcs.push(passenger.PTC);
                            }
                        });
                        command.fs.s.push({
                            airv: segment.carrier,
                            fltnum: segment.flightNumber,
                            startdt: segment.departureTime,
                            orig: segment.origin,
                            dest: segment.destination,
                            bic: fare.fareInfo.bookingCode,
                            ptcs: ptcs,
                            farebasis: fare.fareInfo.fareBasis,
                        });
                    });
                    this.terminalService.executeTerminalCommand(command);
                    this.closeBrands.emit();
                    break;
                case AlertAction.CANCEL: return;
            }
        })
	}
}
