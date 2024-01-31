import {Component, Input, OnInit} from '@angular/core';
import { AirSegment } from 'src/app/modules/neo/models/air-segment.model';

@Component({
    selector: 'app-itinerary-option',
    templateUrl: './itinerary-option.component.html',
    styleUrls: ['./itinerary-option.component.scss'],
})
export class ItineraryOptionComponent implements OnInit {

    @Input() tags?: string[];
    @Input() segment!: AirSegment;
    public daysDifference!: number;

    constructor() {
        this.makeRequired(this.segment);
    }

    ngOnInit() {
        const timeDiff = Math.abs(new Date(this.segment.departureDatetime).getTime() - new Date(this.segment.arrivalDatetime).getTime());
        this.daysDifference = Math.floor(timeDiff / (1000 * 3600 * 24));
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

    private makeRequired(input: any) {
        if (input !== null) {
            return;
        }

        throw new Error("Required attribute not set");
    }
}
