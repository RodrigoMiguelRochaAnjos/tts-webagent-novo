import { Component, Input } from '@angular/core';
import { AirSegment } from '../../models/air-segment.model';

@Component({
  selector: 'air-segment',
  templateUrl: './air-segment.component.html',
  styleUrls: ['./air-segment.component.scss']
})
export class AirSegmentComponent {
    @Input() segmentIndex!: number;
    @Input() segment!: AirSegment;
    @Input() numberOfStops!: number;

    range(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }

    segmentDuration(): string {
        let duration = '';

        const hours: number = Math.floor(this.segment.duration / 60);
        if (hours > 0) {
            duration += hours + 'h';
        }

        const minutes: number = Math.floor(this.segment.duration % 60);
        if (minutes > 0) {
            duration += minutes + 'm';
        }

        return duration;
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
