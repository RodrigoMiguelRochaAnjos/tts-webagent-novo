import { AfterContentInit, AfterViewInit, Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from './core/authentication/auth.service';
import { LoadingService } from './core/interceptors/loading.service';
import { Observable } from 'rxjs';
import { IncompleteUser } from './core/models/user/types/incomplete-user.model';
import { AuthenticatedUser } from './core/models/user/types/authenticated-user.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent{
    title = 'tts-webagent-web';

    isModalOpen = false;

    constructor(
        private authService: AuthService,
    ) {
        this.authService.loadUserFromStorage();
    }

    toggleModal() {
        this.isModalOpen = !this.isModalOpen;
        console.log(this.isModalOpen);
      }

}
