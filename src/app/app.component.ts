import { AfterContentInit, AfterViewInit, Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from './core/authentication/auth.service';
import { LoadingService } from './core/interceptors/loading.service';
import { Observable } from 'rxjs';
import { IncompleteUser } from './core/models/user/types/incomplete-user.model';
import { AuthenticatedUser } from './core/models/user/types/authenticated-user.model';
import { TerminalService } from './modules/terminal/data-access/terminal.service';
import { PkeysService } from './modules/terminal/data-access/pkeys.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent{
    title = 'tts-webagent-web';

    constructor(
        private authService: AuthService,
        private pkeyService: PkeysService,
        private terminalService: TerminalService
    ) {
        this.authService.loadUserFromStorage();
        this.pkeyService.loadPkeysFromStorage();
        this.terminalService.loadCommandHistory();
    }

}
