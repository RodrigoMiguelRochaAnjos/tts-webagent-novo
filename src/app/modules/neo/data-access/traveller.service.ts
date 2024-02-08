import { Type } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Traveller, Travellers } from "../models/traveller/traveller.model";
import { AdultTraveller } from "../models/traveller/types/adult-traveller.model";
import { ChildTraveller } from "../models/traveller/types/child-traveller.model";
import { GovernmentTraveller } from "../models/traveller/types/government-traveller.model";
import { InfantWithNoSeatTraveller } from "../models/traveller/types/infant-with-no-seat-traveller.model";
import { InfantWithSeatTraveller } from "../models/traveller/types/infant-with-seat-traveller.model";
import { MilitaryTraveller } from "../models/traveller/types/military-traveller.model";
import { SeniorTraveller } from "../models/traveller/types/senior-traveller.model";
import { TravellerTypes } from "../models/traveller/traveller-types.enum";
import { Contact } from "src/app/core/models/user/contact/contact.model";
import { Phone } from "src/app/core/models/user/contact/segments/phone.model";
import { Address } from "src/app/core/models/user/contact/segments/address.model";

@Injectable({
    providedIn: 'root'
})
export class TravellerService {

    private _flagMapping: { [key: string]: { flag: TravellerTypes, type: any } } = {
        ADULTS: { flag: TravellerTypes.ADULTS, type: AdultTraveller },
        CHILDREN: { flag: TravellerTypes.CHILDREN, type: ChildTraveller },
        INFANTS: { flag: TravellerTypes.INFANTS, type: InfantWithNoSeatTraveller },
        INFANTSWSEAT: { flag: TravellerTypes.INFANTS_NO_SEAT, type: InfantWithSeatTraveller },
        SENIORS: { flag: TravellerTypes.SENIORS, type: SeniorTraveller },
        MILITARY: { flag: TravellerTypes.MILITARY, type: MilitaryTraveller },
        GOVERNMENT: { flag: TravellerTypes.GOVERNMENT, type: GovernmentTraveller },
    }

    private _travellers: Travellers = [];

    public addTraveller(flag: TravellerTypes): void {
        const type = this.getType(flag);

        this._travellers.push(new type())
    }

    public removeTraveller(flag: TravellerTypes): void {
        const type = this.getType(flag);

        for (let i = 0; i < this._travellers.length; i++) {
            if (!(this._travellers[i] instanceof type)) continue;

            this._travellers.splice(i, 1);
            break;
        }
    }

    public numTravellers(arg?: TravellerTypes): number {
        if (!arg) return this._travellers.length;

        let sum: number = 0;

        for (const traveller of this._travellers) {
            if (!(traveller instanceof this.getType(arg))) continue;

            sum++;
        }

        return sum;
    }

    public getTravellers(): Travellers {
        return this._travellers
    }

    public setTravellers(travellers: Travellers): void {
        this._travellers = travellers;
    }

    public getTraveller(index: number): Traveller | undefined {
        return this._travellers[index];
    }

    public setTraveller(traveller: Traveller, index: number): void {
        this._travellers[index] = traveller;
    }

    public getType(travellerType: TravellerTypes): any {
        for (const flagName in this._flagMapping) {
            if ((travellerType & this._flagMapping[flagName].flag) != this._flagMapping[flagName].flag) continue;

            return this._flagMapping[flagName].type;
        }
    }

    public areTravellersValid(): boolean {
        for (const traveller of this._travellers) {
            if (!traveller?.isValid()) return false;
        }
        return true;
    }

}