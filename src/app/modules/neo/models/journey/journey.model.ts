
import { JourneyType } from "../../features/search/utils/journey-type.enum";
import { SelectedLocation } from "../selected-location.model";
import { Travellers } from "../traveller/traveller.model";

export abstract class Journey {
    public origin!: SelectedLocation;
    public destination!: SelectedLocation;
    public travellers!: Travellers;

    public returnDate!: string;
    public departureDate!: string;


    public maxDate: Date;
    public minDate: Date;

    private currentDate: Date;

    constructor() {
        this.currentDate = new Date();
        this.maxDate = new Date(
            this.currentDate.getFullYear() + 1,
            this.currentDate.getMonth(),
            this.currentDate.getDate()
        );

        this.minDate = this.currentDate;
    }
    public abstract toString(): JourneyType;

}