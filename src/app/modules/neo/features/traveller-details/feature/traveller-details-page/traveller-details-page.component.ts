import { Component, OnInit } from '@angular/core';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import { FlightOption } from '../../../../models/flight-option.model';
import { ReservationService } from '../../../../data-access/reservation/reservation.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { TravellerService } from 'src/app/modules/neo/data-access/traveller.service';
import { Traveller, Travellers } from 'src/app/modules/neo/models/traveller/traveller.model';
import { Contact } from 'src/app/core/models/user/contact/contact.model';
import { Address } from 'src/app/core/models/user/contact/segments/address.model';
import { Phone } from 'src/app/core/models/user/contact/segments/phone.model';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { TravellerTypes } from 'src/app/modules/neo/models/traveller/traveller-types.enum';
import { CheckoutService } from 'src/app/modules/neo/data-access/checkout.service';
import { TranslateService } from '@ngx-translate/core';
import { PassengerType } from '../../../search/utils/requests/air-search-request/passenger-type.enum';

@Component({
    selector: 'app-traveller-details-page',
    templateUrl: './traveller-details-page.component.html',
    styleUrls: ['./traveller-details-page.component.scss']
})
export class TravellerDetailsPageComponent implements OnInit{
    InputType = InputType;
    patterns = patterns;

    public date: moment.Moment = moment();
    contactRequestData: Contact;

    option$!: Observable<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }>;

    getMaxDateLimit(type: PassengerType): string {
        return moment().subtract(type === PassengerType.Child ? 2 : 13, 'year').format('DD/MM/YYYY');
    }

    getMinDateLimit(type: PassengerType): string {
        if (type === PassengerType.Adult) return moment().subtract(200, 'year').format('DD/MM/YYYY');
        return moment().subtract(12).format('DD/MM/YYYY');
    }

    constructor(
        private reservationService: ReservationService,
        private travellerService: TravellerService,
        private alertService: AlertService,
        private translate: TranslateService,
        private authService: AuthService,
        private checkoutService: CheckoutService,
        private router: Router
    ) {
        this.option$ = this.reservationService.getSelectedFlights();
        
        this.contactRequestData = new Contact();
        
        this.contactRequestData.phone = new Phone();
        this.contactRequestData.address = new Address();
        this.contactRequestData.address.street = '';
        this.contactRequestData.address.city = '';
        this.contactRequestData.address.locality = '';
        this.contactRequestData.address.flat = '';
        this.contactRequestData.address.postCode = '';
        this.contactRequestData.address.countryCode = '';
        this.contactRequestData.phone.dialCode = '351';
        this.contactRequestData.phone.number = '';
        this.contactRequestData.title = 'MR';
        this.contactRequestData.firstName = '';
        this.contactRequestData.lastName = '';
        this.contactRequestData.email = '';

        this.authService.getUser().subscribe((user: User) => {
            this.contactRequestData.title = user.contact.title ? user.contact.title : 'MR';
            this.contactRequestData.firstName = user.contact.firstName ? user.contact.firstName : '';
            this.contactRequestData.lastName = user.contact.lastName ? user.contact.lastName : '';
            this.contactRequestData.email = user.contact.email ? user.contact.email : '';
            this.contactRequestData.entityName = user.contact.entityName;

            if (user.contact.address && this.contactRequestData.address){
                this.contactRequestData.address.street = user.contact.address.street ? user.contact.address.street : '';
                this.contactRequestData.address.city = user.contact.address.city ? user.contact.address.city : '';
                this.contactRequestData.address.locality = user.contact.address.locality ? user.contact.address.locality : '';
                this.contactRequestData.address.flat = user.contact.address.flat ? user.contact.address.flat : '';
                this.contactRequestData.address.postCode = user.contact.address.postCode ? user.contact.address.postCode : '';
                this.contactRequestData.address.countryCode = user.contact.address.countryCode ? user.contact.address.countryCode : '';
            }

            if (user.contact.phone) {
                this.contactRequestData.phone.dialCode = user.contact.phone.dialCode ? user.contact.phone.dialCode : '';
                this.contactRequestData.phone.number = user.contact.phone.number ? user.contact.phone.number : '';
            }
            
        })



        this.travellerService.setTravellers(
            this.travellerService.getTravellers().map((traveller: Traveller) => {
                traveller.contact = new Contact();
                traveller.contact.phone = new Phone();
                traveller.contact.address = new Address();

                return traveller;
            })
        ) 

    }
    ngOnInit(): void {
        this.checkoutService.resetPrice();
    }

    get travellers(): Travellers {
        return this.travellerService.getTravellers();
    }

    formatDateTime(date: string): string {
        return moment(date, "YYYY-MM-DDTHH:mm:ss").format('HH:mm');
    }

    formatDate(date: string) {
        const formattedDate: string = moment(date, "YYYY-MM-DDTHH:mm:ss").format('DD-L');

    }

    advance(): void {
        let valid = true;

        this.travellerService.getTravellers().forEach((traveller: Traveller, index: number) => {
            if(traveller.isValid()) return;

            valid = false;

            let message = "Please fill in all required fields ";

            message += `Traveller ${index + 1}: `;

            for (const name in traveller.form.controls) {
                let tmpTranslation: string = "";


                this.translate.stream(name).subscribe((text: string) => {
                    tmpTranslation = text;
                });

                if (traveller.form.controls[name].invalid) message += `${tmpTranslation}, `;
            }

            for (const name in traveller.contact.form().controls) {
                let tmpTranslation: string = "";

                this.translate.stream(name).subscribe((text: string) => {
                    tmpTranslation = text;
                });

                if(traveller.contact.form().controls[name].invalid) message += `${tmpTranslation}, `;
            }

            message = this.removeLastOccurrence(message, ", ");
            this.alertService.show(AlertType.ERROR, message);


        })


        if (!this.contactRequestData.form().valid) {
            valid = false;
            let message = "Please fill in all required fields: "

            for (const name in this.contactRequestData.form().controls) {
                let tmpTranslation: string = "";
                this.translate.stream(name).subscribe((text: string) => {
                    tmpTranslation = text;
                });

                if (this.contactRequestData.form().controls[name].invalid) message += `${tmpTranslation}, `;
            }

            message = this.removeLastOccurrence(message, ", ");
            this.alertService.show(AlertType.ERROR, message);

        }

        if (!valid) {
            return;
        }
        
        this.reservationService.checkTravellers();


        this.authService.updateUserContact(this.contactRequestData);

        
        this.router.navigate(['neo/checkout'])
    }

    updateTravellerDOB(date: moment.Moment, index: number): void{
        const traveller: Traveller | undefined = this.travellerService.getTraveller(index);

        if(traveller == null) return;

        traveller.dateOfBirth = date.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        this.travellerService.setTraveller(traveller, index);
    }
    
    removeLastOccurrence(str: string, search: string): string {
        const lastIndex = str.lastIndexOf(search);
        if (lastIndex !== -1) {
            const before = str.substring(0, lastIndex);
            const after = str.substring(lastIndex + search.length);
            return before + after;
        }
        return str;
    }

    // passangerTypeDateInput(): {minDate: string, maxDate: string} {
    //     let minDate: string = "" ;
    //     let maxDate: string = "" ;
    //     const travellers = this.travellerService.getTravellers();

    //     for (const traveller of travellers) {
    //         if ((traveller instanceof this.travellerService.getType(TravellerTypes.CHILDREN))) {
    //             minDate = moment().subtract(12, "year").format("DD/MM/YYYY");
    //             break;
    //         }

    //         if ((traveller instanceof this.travellerService.getType(TravellerTypes.ADULTS))) {
    //             maxDate = moment().subtract(2, "year").format("DD/MM/YYYY");
    //             break;
    //         }
    //     }

    //     return { minDate, maxDate };
    // }
}
