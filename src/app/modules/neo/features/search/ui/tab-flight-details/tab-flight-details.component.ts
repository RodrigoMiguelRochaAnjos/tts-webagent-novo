import {Component, Input} from '@angular/core';
import { AirSegment } from 'src/app/modules/neo/models/air-segment.model';
import { FlightOption } from 'src/app/modules/neo/models/flight-option.model';

@Component({
    selector: 'app-tab-flight-details',
    templateUrl: './tab-flight-details.component.html',
    styleUrls: ['./tab-flight-details.component.scss'],
})
export class TabFlightDetailsComponent {
    @Input() option!: FlightOption;
    @Input() outbound!: boolean;

    getOrigDestLabel(option: FlightOption): string {
        let label = '';
        label = option.segments[0].origin.code;
        label +=
            ' - ' + option.segments[option.segments.length - 1].destination.code;
        return label;
    }

    totalDuration(option: FlightOption): string {
        let duration = '';

        const hours: number = Math.floor(option.duration / 60);
        if (hours > 0) {
            duration += hours + 'h';
        }

        const minutes: number = Math.floor(option.duration % 60);
        if (minutes > 0) {
            duration += minutes + 'm';
        }

        return duration;
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

    get isOutbound(): boolean {
        return this.outbound;
    }

    isSameDay(dateString1: string, dateString2: string): boolean {
        const date1 = new Date(dateString1);
        const date2 = new Date(dateString2);

        return (
            date1.getFullYear() == date2.getFullYear() &&
            date1.getMonth() == date2.getMonth() &&
            date1.getDate() == date2.getDate()
        )
    }
}
