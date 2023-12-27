import { AfterContentInit, AfterViewInit, Component, ComponentRef, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './core/authentication/auth.service';
import { LoadingService } from './core/interceptors/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'tts-webagent-web';

    constructor(
        private authService: AuthService,
    ) {
        this.authService.loadUserFromStorage();
    }

}
