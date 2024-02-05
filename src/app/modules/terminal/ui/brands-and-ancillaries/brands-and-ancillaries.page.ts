import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TerminalService } from '../../data-access/terminal.service';

@Component({
	selector: 'app-brands-and-ancillaries',
	templateUrl: './brands-and-ancillaries.page.html',
	styleUrls: ['./brands-and-ancillaries.page.scss'],
})
export class BrandsAndAncillariesPage implements OnInit {
	@Input() data!: any[];
	@Output() closeEvent = new EventEmitter<string>();

	fareQuoteData: any;
	segments: any[] = [];
	selectedFares!: number[];
	selectedSegmentIndex = 0;
	isFareInfo: boolean = false;
	fare: any;
	isFareQuote: boolean = false;

	constructor(
		// private statisticsService: StatisticsService,
		private terminalService: TerminalService,
	) {}

	ngOnInit() {
		// this.statisticsService.addClientStat(clientStatisticsSources.brandedFare);
		const segments = this.data;
		this.selectedFares = [];
		segments.forEach(() => {
			this.selectedFares.push(0);
		});
		this.segments = segments;
		this.showFareInfo(0)
	}

	onCloseClick(): void{
		this.closeEvent.emit();
	}

	priceDifference(segmentIndex: number, fareIndex: number): string {
		if (fareIndex === 0) {
			return 'Original';
		} else {
			const priceDifference = Number(this.segments[segmentIndex].faresList[fareIndex].fareInfo.price.segmentBaseDiff);
			const symbol = priceDifference > 0 ? '+' : '';
			return symbol + priceDifference.toFixed(2).toString().replace('.00', '');
		}
	}

	private checkConnectionFares(): void {
		const selectedFareIndex = this.selectedFares[this.selectedSegmentIndex];
		const selectedFare = this.segments[this.selectedSegmentIndex].faresList[selectedFareIndex];
		this.segments.forEach((segment, segmentIndex) => {
			if (segmentIndex !== this.selectedSegmentIndex) {
				segment.faresList.forEach((fare: any, fareIndex: number) => {
					if (fare.conxId === selectedFare.conxId && selectedFareIndex === fareIndex) {
						this.selectedFares[segmentIndex] = fareIndex;
					}
				});
			}
		});
	}

	get totalPrice(): string {
		let total = Number(this.segments[0].faresList[0].fareInfo.price.total);
		const currency = this.segments[0].faresList[0].fareInfo.price.currency;
		let lastFlightConnectionId = -1;
		this.selectedFares.forEach((fareIndex, segmentIndex) => {
			const fare = this.segments[segmentIndex].faresList[fareIndex];
			const flightConnectionId = Number(fare.conxId);
			if (flightConnectionId !== lastFlightConnectionId) {
				const priceDifferenceString = this.priceDifference(segmentIndex, fareIndex).replace('+', '');
				const priceDifference = priceDifferenceString === 'Original' ? 0 : Number(priceDifferenceString);
				total += priceDifference;
			}
			lastFlightConnectionId = flightConnectionId;
		});
		return total.toFixed(2).replace('.00', '') + currency;
	}

	showFareInfo(fareIndex: number): void {
		this.fare = this.segments[this.selectedSegmentIndex].faresList[fareIndex];
		this.isFareInfo = true;
	}

	showConnectionIcon(segmentIndex: number): boolean {
		if (segmentIndex < this.segments.length - 1) {
			const currentSegmentConnectionId = Number(this.segments[segmentIndex].faresList[0].conxId);
			const nextSegmentConnectionId = Number(this.segments[segmentIndex + 1].faresList[0].conxId);
			return currentSegmentConnectionId === nextSegmentConnectionId;
		} else {
			return false;
		}
	}

	async requestFareQuote(): Promise<void> {
		// this.statisticsService.addClientStat(clientStatisticsSources.brandedFareQuote);

		const ptcsAges: number[] = [];
		const segmentsAndFares: any[] = [];

		// all segments have the same PTCs
		this.segments[0].passList.forEach((passenger: any) => {
			for (let i = 0; i < passenger.numPTCs; i++) {
				ptcsAges.push(passenger.PTCAge);
			}
		});

		this.selectedFares.forEach((fareIndex, segmentIndex) => {
			const segment = this.segments[segmentIndex];
			const fare = segment.faresList[fareIndex];
			segmentsAndFares.push({
				airv: segment.carrier,
				flightnum: segment.flightNumber,
				orig: segment.origin,
				dest: segment.destination,
				departTime: segment.departureTime,
				arrivTime: segment.arrivalTime,
				fare: fare.fareInfo.fareBasis,
				bic: fare.fareInfo.bookingCode,
			});
		});

		const command: any = {
			bf: {
				getPrice: {
					s: segmentsAndFares,
					p: ptcsAges,
				},
			},
		};
		this.fareQuoteData = await this.terminalService.requestFareQuote(command);
		this.isFareQuote = true;
	}

	selectFare(fareIndex: number): void {
		this.selectedFares[this.selectedSegmentIndex] = fareIndex;
		this.checkConnectionFares();
	}

	exitFareInfo(): void{
		this.isFareInfo = false;
	}

	closeFareQuote(): void {
		this.isFareQuote = false;
	}

	get canShowSelectedFares(): boolean {
		let showSelectedFares = false;
		this.selectedFares.forEach((fareIndex) => {
			if (fareIndex > 0) {
				showSelectedFares = true;
			}
		});
		return showSelectedFares;
	}

	get selectedFaresData(): any[] {
		const fares: any[] = [];
		let lastFlightId = -1;
		this.selectedFares.forEach((fareIndex, segmentIndex) => {
			const fare = this.segments[segmentIndex].faresList[fareIndex];
			if (lastFlightId !== fare.conxId) {
				fares.push(fare);
			}
			lastFlightId = fare.conxId;
		});
		return fares;
	}
}
