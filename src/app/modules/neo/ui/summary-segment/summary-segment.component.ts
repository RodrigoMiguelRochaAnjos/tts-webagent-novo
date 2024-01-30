import { Component, Input } from '@angular/core';
import { AirSegment } from '../../models/air-segment.model';

@Component({
  selector: 'summary-segment',
  templateUrl: './summary-segment.component.html',
  styleUrls: ['./summary-segment.component.scss']
})
export class SummarySegmentComponent {
    @Input() segment!: AirSegment;

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
}
