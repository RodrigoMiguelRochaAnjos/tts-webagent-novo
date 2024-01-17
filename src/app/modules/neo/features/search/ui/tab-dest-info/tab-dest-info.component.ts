import {Component, Input, OnInit} from '@angular/core';
import { InformationService } from '../../data-access/information.service';
import { Information } from '../../models/information.model';

@Component({
    selector: 'app-tab-dest-info',
    templateUrl: './tab-dest-info.component.html',
    styleUrls: ['./tab-dest-info.component.scss'],
})
export class TabDestInfoComponent implements OnInit {
    @Input() destinations!: string;

    information!: Information[];

    constructor(
        private informationService: InformationService
    ) {
    }

    ngOnInit(): void {
        this.informationService
            .getInformations(this.destinations)
            .then((information) => {
                this.information = information;
            });
    }

    toggleMoreInformation(info: Information): void {
        info.ShowingMore = !info.ShowingMore;
    }
}
