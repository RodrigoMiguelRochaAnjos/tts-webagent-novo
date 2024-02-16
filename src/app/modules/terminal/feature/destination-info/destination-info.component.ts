import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InformationService } from 'src/app/modules/neo/features/search/data-access/information.service';
import { Information } from 'src/app/modules/neo/features/search/models/information.model';

@Component({
  selector: 'app-destination-info',
  templateUrl: './destination-info.component.html',
  styleUrls: ['./destination-info.component.scss']
})
export class DestinationInfoComponent {
    destinations!: string;

    information!: Information[];

    constructor(
        private informationService: InformationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        const dests: string | null = this.route.snapshot.paramMap.get("destinations");

        if(dests == null) {
            this.router.navigate(['terminal']);
            return;
        }

        this.destinations = dests;
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
