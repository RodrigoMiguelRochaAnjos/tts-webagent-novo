import { Injectable } from '@angular/core';
import {
  BookingSummary,
  BookingSummaryResponse,
} from '../models/booking-summary-response.model';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/core/models/user/user.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AuthenticatedUser } from 'src/app/core/models/user/types/authenticated-user.model';
import { environment } from 'src/environments/environment';
import { PageableWrapper } from 'src/app/core/models/pageable-wrapper.model';
import * as moment from 'moment';
import { Status } from '../../../models/status.enum';
import { DestroyService } from 'src/app/core/services/destroy.service';
import { AirBooking } from 'src/app/shared/models/air-booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingSummaryService {
  private readonly VERSION: string = 'v1';
  private readonly ENDPOINT: string = `${environment.endpoints.BOOKING}/${this.VERSION}/bookings`;

  page: number = 0;
  size: number = 20;
  minPrice: number = 0;
  maxPrice: number = 999999;
  defaultStartDateMin: string = moment().subtract(2, 'years').format('YYYY-MM-DD');
  defaultStartDateMax: string = moment().add(2, 'years').format('YYYY-MM-DD');
  defaultCreationDateMin: string = moment().subtract(2, 'years').format('YYYY-MM-DD');
  defaultCreationDateMax: string = moment().format('YYYY-MM-DD');

  private bookings$: BehaviorSubject<BookingSummaryResponse> = new BehaviorSubject<BookingSummaryResponse>([]);
  private booking$: BehaviorSubject<AirBooking> = new BehaviorSubject<AirBooking>(new AirBooking());
  
  isLoading: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService, private destroyService: DestroyService) { }

  public getBookings(): Observable<BookingSummaryResponse> {
    return this.bookings$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
  }

  public getBooking(): Observable<AirBooking> {
    return this.booking$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
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

      let remoteUrl: string = `${this.ENDPOINT}?page=${this.page}&size=${this.size}&minprice=${this.minPrice}&maxprice=${this.maxPrice}`;

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

      this.http.get<PageableWrapper<BookingSummaryResponse>>(remoteUrl, { headers: headers }).subscribe({
          next: (data: PageableWrapper<BookingSummaryResponse>) => {
            if (data) {
              let currentBookings = this.bookings$.getValue();
              let bookingSummaries: BookingSummaryResponse = data['content'];

              bookingSummaries.map((value: BookingSummary, index: number) => {
                value.show = true;

                value.createdAt = new Date(value.createdAt);
                value.startDate = new Date(value.startDate);

                success = true;

                return value;
              });

              if(success) {
                this.bookings$.next([...currentBookings, ...bookingSummaries]);
  
                this.page++;
              }
            }
          },
          error: (error) =>
            console.error(
              'When trying to get bookings, the following error occured :',
              error
            ),
          complete: () => (this.isLoading = false),
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

        this.http.get<AirBooking>(`${this.ENDPOINT}/${id}`, { headers: headers}).subscribe({
          next: (result: AirBooking) => {
            this.booking$.next(result as AirBooking)
          },
          error: (err: any) => this.booking$.next(new AirBooking())
        });
      },
    });
  }

  public getBookingSummaryValue(): BookingSummaryResponse {
    return this.bookings$.getValue();
  }

  public updateBookingSummary(bookingSummary: BookingSummaryResponse): void {
    this.bookings$.next(bookingSummary);
  }

  arrayToQueryString(key: string, values: string[]): string {
    return values
      .map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  resetBookings(): void{
    this.bookings$.next([]);
    this.page = 0;
  }
}
