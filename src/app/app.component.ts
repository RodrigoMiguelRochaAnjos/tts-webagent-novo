import { Component } from '@angular/core';
import { AuthService } from './core/authentication/auth.service';
import { PkeysService } from './modules/terminal/data-access/pkeys.service';
import { TerminalHistoryService } from './modules/terminal/data-access/terminal-history.service';

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
        private terminalHistoryService: TerminalHistoryService
    ) {
        this.authService.loadUserFromStorage();
        this.pkeyService.loadPkeysFromStorage();
        this.terminalHistoryService.loadCommandHistory();
    }

}
