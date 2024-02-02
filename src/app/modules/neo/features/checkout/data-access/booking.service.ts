import { HttpClient } from "@angular/common/http";
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

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private readonly VERSION: string = 'v1';
    private readonly ENDPOINT: string = `${environment.endpoints.NEO}/${this.VERSION}`;

    private booking$: BehaviorSubject<AirBooking> = new BehaviorSubject<AirBooking>(new AirBooking());

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
        private destroyService: DestroyService,
        private alertService: AlertService
    ) {}

    public getBooking(): Observable<AirBooking> {
        return this.booking$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    book(body: AirBookingRequest): Promise<boolean> {

        return new Promise<boolean>((resolve) => {
            this.authService.getUser().subscribe((user: User) => {
                if(!(user instanceof AuthenticatedUser)) return;
    
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
                    if(response.status === Status.SUCCESS){
                        const booking = this.booking$.value;

                        booking.status = Status.CANCELLED;

                        this.booking$.next(booking);
                        return;
                    }

                    if(response.errors) {
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

    
}