import {
    Component,
    ElementRef,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Providers } from 'src/app/modules/neo/models/providers.enum';
import { Traveller } from 'src/app/modules/neo/models/traveller/traveller.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import { Payment } from '../../../search/models/payment.model';
import { PaymentOption } from '../../../search/models/payment-option.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { ReservationService } from 'src/app/modules/neo/data-access/reservation/reservation.service';
import { NavigationEnd, Router } from '@angular/router';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { CheckoutService } from 'src/app/modules/neo/data-access/checkout.service';
import { FlightOption } from 'src/app/modules/neo/models/flight-option.model';
import { SupportedPayments } from '../../../search/models/supported-payments.model';
import { CreditCard } from '../../../search/models/credit-card.model';
import { Address } from 'src/app/core/models/user/contact/segments/address.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { LoadingService } from 'src/app/core/services/loading.service';
import { TravellerService } from 'src/app/modules/neo/data-access/traveller.service';
import { AirCheckoutPriceRequest } from '../../../search/models/air-checkout-price-request.model';
import { AirCheckoutPriceResponse } from '../../../search/models/air-checkout-price-response.model';
import { deepClone } from 'src/app/core/utils/deep-clone.tool';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { AirCheckoutDetailsResponse } from '../../../search/models/air-checkout-details-response.model';
import { SupportedCreditCard } from '../../../search/models/supported-credit-card.model';
import { ModalControllerService } from 'src/app/core/services/modal-controller.service';
import { BookingService } from '../../data-access/booking.service';
import { AirBooking } from 'src/app/shared/models/air-booking.model';
import { AirBookingRequest } from 'src/app/shared/models/air-booking-request.model';
import { DestroyService } from 'src/app/core/services/destroy.service';
import { AirSegment } from 'src/app/modules/neo/models/air-segment.model';

@Component({
    selector: 'app-checkout-page',
    templateUrl: './checkout-page.component.html',
    styleUrls: ['./checkout-page.component.scss'],
})
export class CheckoutPageComponent implements OnInit {
    Providers = Providers;
    InputType = InputType;

    patterns = patterns;

    private travellersRequestData!: Traveller[];
    private paymentsRequestData!: Payment[];
    private currency!: string;

    @ViewChildren('reusableCreditCards')
    reusableCreditCards!: QueryList<ElementRef>;

    @ViewChild('confirmPrice')
    confirmPrice!: TemplateRef<any>;


    PaymentOption = PaymentOption;

    travellerinfo!: FormGroup;

    details$!: Observable<AirCheckoutDetailsResponse | null>;
    price$!: Observable<AirCheckoutPriceResponse | null>;
    public paymentsData: { id: string; searchId: string; payment: Payment }[] = [];


    constructor(
        private alertService: AlertService,
        private checkoutService: CheckoutService,
        private authService: AuthService,
        private loadingService: LoadingService,
        private travellerService: TravellerService,
        private modalService: ModalControllerService,
        private bookingService: BookingService,
        private destroyService: DestroyService,
        private router: Router
    ) {

        this.currency = this.authService.getUserValue().settings.currency;
        
        this.details$ = this.checkoutService.getDetails();
        this.price$ = this.checkoutService.getPrice();

        
    }

    ngOnInit() {
        const uniqueSearchIds: Set<string> = new Set();

        this.details$.pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((details: AirCheckoutDetailsResponse | null) => {
            if (details == null) return;

            details.flights.forEach((flight: FlightOption) => {
                const searchId: string = flight.provider == Providers.TRAVELFUSION ? flight.searchId : flight.provider;
                const supportedPayments: SupportedPayments | undefined = details.formOfPayments.get(searchId);


                if (!supportedPayments) return;


                if (uniqueSearchIds.has(searchId)) {
                    for (let data of this.paymentsData) {
                        if (data.searchId === searchId) {
                            data.id = flight.id;
                            return;
                        }
                    }
                    return;
                }


                uniqueSearchIds.add(searchId);

                this.paymentsData.push({
                    id: flight.id,
                    searchId: searchId,
                    payment: new Payment(
                        searchId,
                        supportedPayments.supportedTypes[0],
                        '',
                        new CreditCard(
                            '',
                            '',
                            '',
                            '',
                            ''
                        ),
                        new Address()
                    )
                });
            })
        })

        const obj: any = {
            countryCodePaymentInfo: new FormControl(),
            countryDialCode: new FormControl(),
            countryCodeContact: new FormControl(),
        };

        this.travellerinfo = new FormGroup(obj);
        
    }

    getPaymentOptionSupportedTypes(id: string): string[] {
        const supportedPayments: PaymentOption[] | undefined = this.getPaymentOption(id)?.supportedTypes;

        if (supportedPayments == null) return [];

        return Object.values(supportedPayments);
    }

    getPaymentOptionSupportedCards(id: string): string[] {
        const supportedPayments: SupportedCreditCard[] | undefined = this.getPaymentOption(id)?.supportedCreditCards;

        if (supportedPayments == null) return [];

        return supportedPayments.map((value: SupportedCreditCard) => value.cardType);
    }

    getPaymentOption(id: string): SupportedPayments | undefined {
        let searchId = '';

        for (let obj of this.paymentsData) {
            if (obj.id != id) continue;

            searchId = obj.searchId;
            break;
        }

        return this.formsOfPayment.get(searchId);
    }

    get formsOfPayment(): Map<string, SupportedPayments> {
        return this.checkoutService.getDetailsValue()!.formOfPayments;
    }

    flightItinerary(searchId: string): string {
        const flights = this.checkoutService
            .getDetailsValue()
            ?.flights.filter((f) => f.searchId === searchId);
        let price = 0;

        if (!flights) return '';

        for (const flight of flights) {
            if (flight.price && flight.price.totalAmount)
                price += flight.price.totalAmount;
        }

        return price === 0
            ? ''
            : price +
            ' ' +
            this.checkoutService.getDetailsValue()?.flights[0].price
                .preferredCurrency;
    }

    continue(): void {
        let valid = true;

        const invalidCreditCards: string[] = [];
        const invalidAddresses: string[] = [];
        const invalidEntityNames: string[] = [];

        this.paymentsData.forEach(
            (value: { id: string; searchId: string; payment: Payment }) => {
                if (
                    !value.payment.creditCard?.isValid() &&
                    value.payment.type !== PaymentOption.CASH
                ) {
                    valid = false;
                    invalidCreditCards.push(
                        `${value.payment.creditCard!.cardType} ${value.payment.creditCard!.number
                        }`
                    );
                    return;
                }

                if (
                    !value.payment.address!.isValid() &&
                    value.payment.type !== PaymentOption.CASH
                ) {
                    valid = false;
                    invalidAddresses.push(
                        value.payment.address!.street ? value.payment.address!.street : ''
                    );
                    return;
                }

                if (
                    (value.payment.entityName == '' ||
                        value.payment.entityName == null) &&
                    value.payment.type !== PaymentOption.CASH
                ) {
                    valid = false;
                    invalidEntityNames.push(
                        value.payment.entityName ? value.payment.entityName : ''
                    );
                    return;
                }
            }
        );

        if (!valid) {
            if (
                invalidCreditCards.length > 0 &&
                invalidCreditCards.filter((value: string) => value != ' ').length == 0
            ) {
                this.alertService.show(
                    AlertType.ERROR,
                    `The credit card(s) provided are not valid`
                );

                return;
            }

            if (invalidCreditCards.length > 0) {
                this.alertService.show(
                    AlertType.ERROR,
                    `The following credit card(s) are not valid: \n${invalidCreditCards.join(
                        '\n'
                    )}`
                );

                return;
            }

            if (
                invalidAddresses.length > 0 &&
                invalidAddresses.filter((value: string) => value != '').length == 0
            ) {
                this.alertService.show(
                    AlertType.ERROR,
                    `The address(es) provided are not valid`
                );
                return;
            }

            if (invalidAddresses.length > 0) {
                this.alertService.show(
                    AlertType.ERROR,
                    `The following addresses are not valid: \n${invalidAddresses.join(
                        '\n'
                    )}`
                );
                return;
            }

            if (
                invalidEntityNames.length > 0 &&
                invalidEntityNames.filter((value: string) => value != '').length == 0
            ) {
                this.alertService.show(
                    AlertType.ERROR,
                    `The entity names provided are not valid`
                );
                return;
            }

            if (invalidEntityNames.length > 0) {
                this.alertService.show(AlertType.ERROR,
                    `The following entity name(s) are not valid: \n${invalidEntityNames.join('\n')}`
                );
                return;
            }

            return;
        }

        this.travellersRequestData = deepClone(
            this.travellerService.getTravellers()
        );
        this.paymentsRequestData = [];

        //transform data
        // for (let i = 0; i < this.travellersRequestData.length; i++) {
        //     if (
        //         this.travellersRequestData[i].dateOfBirth != null &&
        //         this.travellersRequestData[i].dateOfBirth.length > 0
        //     ) {
        //         const date: Date = new Date(this.travellersRequestData[i].dateOfBirth);

        //         this.travellersRequestData[i].contact.address = null

        //         this.travellersRequestData[i].dateOfBirth =
        //             date.getFullYear() +
        //             '-' +
        //             (date.getMonth() + 1).toString().padStart(2, '0') +
        //             '-' +
        //             date.getDate().toString().padStart(2, '0');
        //     }
        // }

        //remove unecessary data

        for (const obj of this.paymentsData) {
            if (obj.payment.type != PaymentOption.CASH) continue;

            obj.payment.creditCard = null;
            obj.payment.address = null;
        }

        this.paymentsData.forEach((obj: { id: string; searchId: string; payment: Payment }, index: number) => {
            const value: Payment = obj.payment;

            if (value.type === PaymentOption.CASH) {
                this.paymentsRequestData.push(value);
                return;
            }

            if (!value.creditCard?.isValid()) return;

            value.creditCard!.number = value.creditCard!.number.toString();

            this.paymentsRequestData.push(value);
        }
        );

        this.travellersRequestData.forEach((element) => {
            element.frequentFlyerNumbers = element.frequentFlyerNumbers.filter(
                (flyerNumber) => flyerNumber.trim() != ''
            );
        });

        const requestData: AirCheckoutPriceRequest = new AirCheckoutPriceRequest();

        requestData.price = this.checkoutService.getDetailsValue()!.price;
        requestData.flights = this.checkoutService.getDetailsValue()!.flights;
        requestData.passengers = this.travellersRequestData;
        requestData.contact = this.authService.getUserValue().contact;
        requestData.payments = this.paymentsRequestData;
        requestData.currency = this.currency;

        this.checkoutService.loadPrice(requestData);

        this.checkoutService.getPrice().subscribe((response: AirCheckoutPriceResponse | null) => {
            if (response == null) return;

            this.modalService.showModal(this.confirmPrice, "price-confirmation");

            this.travellerService.getTravellers().forEach((traveller) => {
                traveller.frequentFlyerNumbers =
                    traveller.frequentFlyerNumbers.filter(
                        (flyerNumber) => flyerNumber.trim() !== ''
                    );
            });

            this.travellerService.setTravellers(this.travellersRequestData);

        }
        );
    }

    removeLastOccurrence(term: string, search: string): string {
        const lastIndex = term.lastIndexOf(search);
        if (lastIndex !== -1) {
            const before = term.substring(0, lastIndex);
            const after = term.substring(lastIndex + search.length);

            return before + after;
        }

        return term;
    }

    get arePaymentsOnlyCash(): boolean {
        for (const obj of this.paymentsData) {
            if (obj.payment.type != PaymentOption.CASH) return false;
        }

        return true
    }

    public isSupportedPaymentType(searchId: string, type?: string): boolean {

        if (type == null) return false;

        const paymentOptions: SupportedPayments | undefined = this.getPaymentOption(searchId);

        if (paymentOptions == null) return false;

        for (let supportedCard of paymentOptions.supportedCreditCards) {
            if (supportedCard.cardType == type) return true;
        }

        return false;
    }

    public useSameCardAs(card: CreditCard | null, address: Address | null, entityName: string, id: string): void {
        const payment: Payment | undefined = this.getPayment(id);

        if (payment == null) return;

        if (card == null) return;

        payment.type = PaymentOption.CREDIT_CARD;
        payment.creditCard = card.copy();

        if (address == null) return;

        payment.address = address.copy();

        if (entityName == null) return;

        payment.entityName = entityName;
    }

    clearForm(id: string): void {
        const payment = this.getPayment(id);

        if (payment == null) return;

        payment.creditCard = new CreditCard('', '', '', '', '');
    }

    isSameDay(day1: string, day2: string): boolean {
        const date1 = new Date(day1);
        const date2 = new Date(day2);

        return (
            date1.getFullYear() == date2.getFullYear() &&
            date1.getMonth() == date2.getMonth() &&
            date1.getDate() == date2.getDate()
        )
    }

    cardNumberDisplayFormatted(creditCard: CreditCard | null): string {
        if (creditCard == null) return "";

        const formattedNumber: string = creditCard?.number.toString().substring(creditCard.number.toString().length - 4, creditCard.number.toString().length);

        return `${formattedNumber} - ${creditCard.cardType}`;
    }


    public findPayment(id: string): Payment | undefined {
        for (let obj of this.paymentsData) {
            if (obj.id == id) return obj.payment;
        }

        return undefined;
    }

    public findPayments(id: string): Payment[] {
        const payments: Payment[] = [];

        for (let obj of this.paymentsData) {
            if (obj.searchId == id) payments.push(obj.payment);
        }

        return payments;
    }

    getPayment(id: string): Payment | undefined {
        const payment: Payment | undefined = this.findPayment(id);
        return payment;
    }

    getPayments(): Payment[] {
        const payments: Payment[] = [];

        return payments;
    }

    getPaymentCreditCard(id: string): CreditCard {
        const payment: Payment | undefined = this.findPayment(id);

        if (payment == null) return new CreditCard('', '', '', '', '');

        if (payment.creditCard == null) return new CreditCard('', '', '', '', '');

        return payment.creditCard;
    }

    getPaymentAddress(id: string): Address {
        const payment: Payment | undefined = this.getPayment(id);

        if (payment == null) return new Address();

        if (payment.address == null) return new Address();

        return payment.address;
    }

    onDateInput(event: Event, flightId: string): void {
        const inputElement = event.target as HTMLInputElement;

        let inputValue = inputElement.value.replace(/[^0-9]/g, ''); // remove non numeric numbers

        if (inputValue.length >= 2) inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);

        inputElement.value = inputValue;
        this.getPaymentCreditCard(flightId).expiryDate = inputValue;
    }

    isDateInvalid(input: string): boolean {
        const regex = /^([\d]{2})\/([\d]{4})$/;;
        const match = input.match(regex);

        if (!match) return true;

        const month = parseInt(match[1], 10);
        const year = parseInt(match[2], 10);

        if (isNaN(month) || isNaN(year)) return true;

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        //Compare only year and month
        if (year < currentYear || (year === currentYear && month < currentMonth)) return true; // Input date is before the current date

        return false;
    }

    book(): void {
        this.price$.subscribe((price: AirCheckoutPriceResponse | null) => {
            if(price == null) return;

            const request: AirBookingRequest = new AirBookingRequest(price.id); 

            this.alertService.show(AlertType.CONFIRMATION, "Are you sure you want to book this flight?").subscribe((action: AlertAction) => {
                if(action === AlertAction.WAITING) return;

                switch(action) {
                    case AlertAction.EXECUTE:
                        this.bookingService.book(request).then((success: boolean) => {
                            if (!success) {
                                this.alertService.show(AlertType.ERROR, "Booking failed");
                                return;
                            }

                            this.router.navigate([`neo/booking-info`]);
                        });
                        break;
                    case AlertAction.CANCEL:
                        return;
                }
            })

            


        });


    }

    segmentDuration(segment: AirSegment): string {
        let duration = '';

        const hours: number = Math.floor(segment.duration / 60);
        if (hours > 0) {
            duration += hours + 'h';
        }

        const minutes: number = Math.floor(segment.duration % 60);
        if (minutes > 0) {
            duration += minutes + 'm';
        }

        return duration;
    }
}
