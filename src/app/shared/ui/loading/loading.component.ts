import { Component } from '@angular/core';
import { LoadingService } from '../../../core/interceptors/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
    show$!: Observable<boolean>;
    
    constructor(
        private loadingService: LoadingService
    ) {
        this.show$ = this.loadingService.getLoadingStatus();
    }
}
