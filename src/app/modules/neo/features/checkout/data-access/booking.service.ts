import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { AuthService } from "src/app/core/authentication/auth.service";
import { AuthenticatedUser } from "src/app/core/models/user/types/authenticated-user.model";
import { User } from "src/app/core/models/user/user.model";
import { DestroyService } from "src/app/core/services/destroy.service";
import { AirBookingRequest } from "src/app/shared/models/air-booking-request.model";
import { AirBooking } from "src/app/shared/models/air-booking.model";
import { environment } from "src/environments/environment";
import { CancelBookingResponse } from "../models/cancel-booking-response.model";
import { Status } from "../../../models/status.enum";
import { AlertService } from "src/app/core/services/alert.service";
import { AlertType } from "src/app/shared/ui/alerts/alert-type.enum";
import { EmmitTicketResponse } from "../models/emmit-ticket-response.model";
import * as moment from "moment";
import { PageableWrapper } from "src/app/core/models/pageable-wrapper.model";
import { BookingSummaryResponse, BookingSummary } from "../../my-bookings/models/booking-summary-response.model";

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private readonly VERSION: string = 'v1';
    private readonly ENDPOINT: string = `${environment.endpoints.NEO}/${this.VERSION}`;
    private readonly SUMMARY_ENDPOINT: string = `${environment.endpoints.BOOKING}/${this.VERSION}/bookings`;

    private booking$: BehaviorSubject<AirBooking> = new BehaviorSubject<AirBooking>(new AirBooking());
    private bookingSummaries$: BehaviorSubject<BookingSummaryResponse> = new BehaviorSubject<BookingSummaryResponse>([]);

    isLoading: boolean = false;

    page: number = 0;
    size: number = 20;
    minPrice: number = 0;
    maxPrice: number = 999999;
    defaultStartDateMin: string = moment().subtract(2, 'years').format('YYYY-MM-DD');
    defaultStartDateMax: string = moment().add(2, 'years').format('YYYY-MM-DD');
    defaultCreationDateMin: string = moment().subtract(2, 'years').format('YYYY-MM-DD');
    defaultCreationDateMax: string = moment().format('YYYY-MM-DD');

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
        private destroyService: DestroyService,
        private alertService: AlertService
    ) { }

    public getBooking(): Observable<AirBooking> {
        return this.booking$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getBookingValue(): AirBooking {
        return this.booking$.value;
    }

    public getBookingSummaries(): Observable<BookingSummaryResponse> {
        return this.bookingSummaries$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getBookingsSummary(
        status?: string[],
        creationDateStart?: string,
        creationDateEnd?: string,
        startDateStart?: string,
        startDateEnd?: string
    ): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            const headers: HttpHeaders = new HttpHeaders({
                Authorization: `Bearer ${user.token}`,
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json'
            });

            let success = false;

            let remoteUrl: string = `${this.SUMMARY_ENDPOINT}?page=${this.page}&size=${this.size}&minprice=${this.minPrice}&maxprice=${this.maxPrice}`;

            if (status != null) remoteUrl += `&${this.arrayToQueryString('status', status)}`;
            else remoteUrl += `&${this.arrayToQueryString('status', Object.values(Status))}`;

            if (creationDateStart != null) remoteUrl += `&creationdate=${creationDateStart}`;
            else remoteUrl += `&creationdate=${this.defaultCreationDateMin}`;

            if (creationDateEnd != null) remoteUrl += `&creationdate=${creationDateEnd}`;
            else remoteUrl += `&creationdate=${this.defaultCreationDateMax}`;

            if (startDateStart != null) remoteUrl += `&startdate=${startDateStart}`;
            else remoteUrl += `&startdate=${this.defaultStartDateMin}`;

            if (startDateEnd != null) remoteUrl += `&startdate=${startDateEnd}`;
            else remoteUrl += `&startdate=${this.defaultStartDateMax}`;

            this.httpClient.get<PageableWrapper<BookingSummaryResponse>>(remoteUrl, { headers: headers }).subscribe({
                next: (data: PageableWrapper<BookingSummaryResponse>) => {
                    if (data) {
                        let currentBookings = this.bookingSummaries$.getValue();
                        let bookingSummaries: BookingSummaryResponse = data['content'];

                        bookingSummaries.map((value: BookingSummary, index: number) => {
                            value.show = true;

                            value.createdAt = new Date(value.createdAt);
                            value.startDate = new Date(value.startDate);

                            success = true;

                            return value;
                        });

                        if (success) {
                            this.bookingSummaries$.next([...currentBookings, ...bookingSummaries]);

                            this.page++;
                        }
                    }
                },
                error: (error: Error) =>
                    console.error(
                        'When trying to get bookings, the following error occured :',
                        error
                    ),
                complete: () => (this.isLoading = false),
            });
        });
    }

    book(body: AirBookingRequest): Promise<boolean> {

        return new Promise<boolean>((resolve) => {
            this.authService.getUser().subscribe((user: User) => {
                if (!(user instanceof AuthenticatedUser)) return;

                this.httpClient.post<AirBooking>(`${this.ENDPOINT}/bookings`, body, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`
                    }
                }).subscribe({
                    next: (response: AirBooking) => {
                        this.booking$.next(response)
                        resolve(true);
                    },
                    error: (err: Error) => resolve(false)
                })
            })
        })

    }

    cancel(bookingCode: string): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            this.httpClient.delete<CancelBookingResponse>(`${this.ENDPOINT}/bookings`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,

                },
                params: {
                    "pnr": bookingCode
                }
            }).subscribe({
                next: (response: CancelBookingResponse) => {
                    if (response.status === Status.SUCCESS) {
                        const booking = this.booking$.value;

                        booking.status = Status.CANCELLED;

                        this.booking$.next(booking);
                        return;
                    }

                    if (response.errors) {
                        this.alertService.show(AlertType.ERROR, response.errors.join('</br>'))
                    }

                    if (response.warnings) {
                        this.alertService.show(AlertType.ERROR, response.warnings.join('</br>'))
                    }
                }
            });
        });

    }

    emit(bookingCode: string): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            this.httpClient.post<EmmitTicketResponse>(`${this.ENDPOINT}/ticketing?pnr=${bookingCode}`, {}).subscribe({
                next: (response: EmmitTicketResponse) => {
                    this.alertService.show(AlertType.SUCCESS, response.message);

                    const booking = this.booking$.value;

                    booking.status = Status.EMITED;

                    this.booking$.next(booking);

                    if (response.warnings) {
                        this.alertService.show(AlertType.ERROR, response.warnings.join('</br>'))
                    }
                }
            });
        });
    }

    public getBookingSummaryById(id: string): void {
        this.authService.getUser()
            .subscribe({
                next: (user: User) => {
                    if (!(user instanceof AuthenticatedUser)) return;

                    const headers: HttpHeaders = new HttpHeaders({
                        Authorization: `Bearer ${user.token}`,
                    });

                    this.httpClient.get<AirBooking>(`${this.SUMMARY_ENDPOINT}/${id}`, { headers: headers }).subscribe({
                        next: (result: AirBooking) => {
                            this.booking$.next(result as AirBooking)
                        },
                        error: (err: any) => this.booking$.next(new AirBooking())
                    });
                },
            });
    }

    public getBookingSummaryValue(): BookingSummaryResponse {
        return this.bookingSummaries$.getValue();
    }

    public updateBookingSummary(bookingSummary: BookingSummaryResponse): void {
        this.bookingSummaries$.next(bookingSummary);
    }

    arrayToQueryString(key: string, values: string[]): string {
        return values
            .map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    resetBookings(): void {
        this.bookingSummaries$.next([]);
        this.page = 0;
    }
}