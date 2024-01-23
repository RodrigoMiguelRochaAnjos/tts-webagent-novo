import { HttpClient } from "@angular/common/http";
import { Component, OnInit, Input, HostListener, NgZone, ElementRef, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/authentication/auth.service";
import { UserService } from "src/app/core/authentication/user/user.service";
import { LoadingService } from "src/app/core/interceptors/loading.service";
import { FlightOption } from "src/app/modules/neo/models/flight-option.model";
import { Providers } from "src/app/modules/neo/models/providers.enum";
import { AirSearchResponse } from "src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model";
import { Balance } from "src/app/shared/models/balance.model";
import { FlightOptionTabs } from "../../models/flight-option-tabs.enum";
import { BalanceService } from "src/app/shared/services/balance.service";
import { AirCheckoutDetailsRequest } from "../../models/air-checkout-details-request.model";
import { ReservationService } from "src/app/modules/neo/data-access/reservation.service";
import { AirSegment } from "src/app/modules/neo/models/air-segment.model";


@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
    @Input() result!: AirSearchResponse;

    private currency!: string;
    showCurrencyInfo: boolean = false;
    showFlightDetails = false;
    showPriceDetails = false;
    showDestInfo = false;
    tooltipOpen = false;

    constructor(
        private authService: AuthService,
        private reservationService: ReservationService,
    ) { }
    
    ngOnInit() {
        this.currency = this.authService.getUserValue().currency;
        console.log(JSON.stringify(this.result));
    }

    get originDestinationLabel(): string {
        let label = '';
        const lastOutbountIndex = this.result.outbounds[0].segments.length - 1;

        label = this.result.outbounds[0].segments[0].origin.code;
        label += ' - ';
        label += this.result.outbounds[0].segments[lastOutbountIndex];

        return label;
    }

    /**
     * Para melhorar
     * 
     * @param tab specifies the tab to open
     */
    toggleTab(tab: string): void {
        this.showDestInfo = false;
        this.showFlightDetails = false;
        this.showPriceDetails = false;
        switch (tab) {
            case FlightOptionTabs.DestInfo:
                this.showDestInfo = true;
                break;
            case FlightOptionTabs.PriceDetails:
                this.showPriceDetails = true;
                break;
            case FlightOptionTabs.FlightDetails:
                this.showFlightDetails = true;
                break;
        }
    }

    get hasInbounds(): boolean {
        if (this.result.inbounds == null) return false;

        return this.result.inbounds.length > 0;
    }

    get isOriginalCurrency(): boolean {
        return !this.result.price.exchange;
    }

    get canBook(): boolean {
        return true;
        // return this.reservationService.canBook(this.result.id);
    }

    get selectedOptions(): { [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null } {
        return this.reservationService.getSelectedFlightsValue();
    }

    get destinations(): string {

        const destinations: string[] = this.result.outbounds?.flatMap(outbound =>
            outbound.segments.map(segment => segment.destination.code)
        )?.concat(this.result.inbounds?.flatMap(inbound =>
            inbound.segments.map(segment => segment.destination.code)
        ));
        console.log(destinations.toString());
        return destinations.toString();
    }

    toggleCurrencyInfo(): void {
        this.showCurrencyInfo = !this.showCurrencyInfo;
    }

    selectOptions(option: FlightOption, type: "INBOUNDS" | "OUTBOUNDS"): void {
        this.reservationService.activeResult = this.result.id;
        this.reservationService.selectFlight(option, type);
        
        if (!(this.result.inbounds && this.result.inbounds.length > 0)) return;

        switch (type) {
            case "INBOUNDS":
                if (this.result.outbounds.length <= 1) this.reservationService.selectFlight(this.result.outbounds[0], "OUTBOUNDS");
                break;
            case "OUTBOUNDS":
                if (this.result.inbounds.length <= 1) this.reservationService.selectFlight(this.result.inbounds[0], "INBOUNDS");
                break;
        }

    }

    toggleTooltip(): void {
        this.tooltipOpen = !this.tooltipOpen;
    }

    async advance(): Promise<void> {
        if (!this.canBook) return;

        let hasEnoughFunds: boolean = false;
        let totalFee: number = 0;

        this.reservationService.checkFunds();

        // if (!this.reservationService.selectionFlights['OUTBOUND']) return;

        // const outbound: FlightOption = this.reservationService.selectionFlights['OUTBOUND'];

        // let selectionFlights: FlightOption[] = [outbound];

        // if (this.reservationService.selectionFlights['INBOUND']) selectionFlights.push(this.reservationService.selectionFlights['INBOUND']);

        // const body: AirCheckoutDetailsRequest = new AirCheckoutDetailsRequest(this.result.price, selectionFlights, this.currency);

        // selectionFlights.forEach((option: FlightOption) => {
        //     if (option.provider === Providers.TRAVELFUSION) totalFee += 4.5;
        // });

        // if (totalFee === 0) {
        //     await this.makeCheckoutDetailsRequest(body);
        //     return;
        // }

        // hasEnoughFunds = this.balanceService.getBalanceValue().amount >= totalFee;

        // if (!hasEnoughFunds) alert(`Not enough money in current account., You need to have enough money for the fee of ${totalFee} USD`);

        // await this.makeCheckoutDetailsRequest(body);

    }

    // makeCheckoutDetailsRequest(body: AirCheckoutDetailsRequest): void {
    //     this.checkoutService.getCheckoutDetails(body).subscribe({
    //         next: async (result: Result) => {

    //             if(!result.success) return;

    //             const details: any = result.data as AirCheckoutDetailsResponse;


    //             const supplierInfos = new Map<string, SupplierInfo[]>();

    //             if (details.supplierInfos != null){
    //                 for (const key in details.supplierInfos) {
    //                     supplierInfos.set(key, (details.supplierInfos[key] as SupplierInfo[]));
    //                 }
    //             }

    //             details.supplierInfos = supplierInfos;

    //             const formOfPayments = new Map<string, SupportedPayments>();

    //             if (details.formOfPayments != null){
    //                 for (const key in details.formOfPayments){
    //                     formOfPayments.set(key, (details.formOfPayments[key] as SupportedPayments))
    //                 }
    //             }

    //             details.formOfPayments = formOfPayments;

    //             this.reservationService.updateCheckoutDetails(details);


    //             await this.loadingService.dismiss();

    //             this.router.navigate(['trip/summary'])
    //         },
    //         error: async (error) => {
    //             await this.loadingService.dismiss();
    //         }
    //     });
    // }
}
