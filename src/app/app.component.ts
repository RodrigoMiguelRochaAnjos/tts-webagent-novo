import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthService } from './core/authentication/auth.service';
import { PkeysService } from './modules/terminal/data-access/pkeys.service';
import { TerminalHistoryService } from './modules/terminal/data-access/terminal-history.service';
import { User } from './core/models/user/user.model';
import { AuthenticatedUser } from './core/models/user/types/authenticated-user.model';
import { IncompleteUser } from './core/models/user/types/incomplete-user.model';
import { TranslateService } from '@ngx-translate/core';
import { TerminalService } from './modules/terminal/data-access/terminal.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    title = 'tts-webagent-web';

    @HostBinding("class.logged-in")
    loggedIn: boolean = false;

    constructor(
        private authService: AuthService,
        private pkeyService: PkeysService,
        private terminalHistoryService: TerminalService,
        private translate: TranslateService
    ) {
        
    }
    ngOnInit(): void {
        this.authService.getUser().subscribe((user: User) => {
            this.loggedIn = (user instanceof AuthenticatedUser || user instanceof IncompleteUser);

            if(user.settings == null) return;
            
            this.translate.use(user.settings.languageCode);
        });

        this.authService.loadUserFromStorage();
        this.pkeyService.loadPkeysFromStorage();
        this.terminalHistoryService.loadCommandsHistoryFromStorage();
    }

}
