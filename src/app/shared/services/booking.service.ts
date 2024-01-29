import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AirBooking, AirBookings } from '../models/air-booking.model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AirBookingRequest } from '../models/air-booking-request.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AuthenticatedUser } from 'src/app/core/models/user/types/authenticated-user.model';
import { User } from 'src/app/core/models/user/user.model';
import { AirCheckoutDetailsResponse } from 'src/app/modules/neo/features/search/models/air-checkout-details-response.model';
import { environment } from 'src/environments/environment';
import { PageableWrapper } from 'src/app/core/models/pageable-wrapper.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookings$: BehaviorSubject<AirBookings> = new BehaviorSubject<AirBookings>([]);

  private readonly VERSION: string = 'v1';
  private readonly ENDPOINT: string = `${environment.endpoints.NEO}/${this.VERSION}/bookings`;

  private page: number = 0;
  private size: number = 5;


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) { }

  book(body: AirBookingRequest): void {
    this.authService.getUser().subscribe((user: User) => {
      if(!(user instanceof AuthenticatedUser)) return;
      
      this.http.post<AirBooking>(`${this.ENDPOINT}`, body, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`
        }
      }).subscribe({
        // next: (response: AirBooking) => this.bookings$.next(response),
        error: () => {
          alert('There was an issue with your booking, please try again');
        },
      })
    })
  }

  public getBookings(): Observable<AirBookings> {
    return this.bookings$;
  }

  public getBookingsValue() : AirBookings {
    return this.bookings$.value;
  }

  loadBookings(numberOfDays?: number, startDate?: string, endDate?: string) {
    this.authService.getUser().subscribe((user: User) => {
        if (!(user instanceof AuthenticatedUser)) return;

        const headers: HttpHeaders = new HttpHeaders({
            Authorization: `Bearer ${user.token}`
        });

        let remoteUrl: string = `${this.ENDPOINT}?page=${this.page}&size=${this.size}`;

        if (numberOfDays != null) remoteUrl += `&limit=${numberOfDays}`;

        if (startDate != null) remoteUrl += `&startdate=${startDate}`;

        if (endDate != null) remoteUrl += `&enddate=${endDate}`;

        this.http.get<PageableWrapper<AirBookings>>(remoteUrl, { headers: headers }).subscribe({
            next: (data: PageableWrapper<AirBookings>) =>  this.bookings$.next(this.bookings$.value.concat(data.content)),
            error: (error) => console.error('When trying to get bookings, the following error occured :', error)
        });
    });
  }

  resetBookings(): void{
    this.bookings$.next([]);
  }

}
