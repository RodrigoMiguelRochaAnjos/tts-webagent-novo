import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import { Command } from '../../models/command.module';
import { Router } from '@angular/router';
import { PKey } from '../../models/pkey.model';
import { PkeysService } from '../../data-access/pkeys.service';
import { TerminalService } from '../../data-access/terminal.service';
import { Stack } from 'src/app/core/utils/stack.structure';
import { Queue } from '../../models/queue.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { AuthenticatedUser } from 'src/app/core/models/user/types/authenticated-user.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MenuService } from '../../data-access/menu.service';
@Component({
    selector: 'app-right-menu',
    templateUrl: './right-menu.component.html',
    styleUrls: ['./right-menu.component.scss'],
})
export class RightMenuComponent implements OnInit {
    @Output() executeCommand = new EventEmitter<Command>();
    @Output() logout = new EventEmitter<void>();
    @Output() commandResult = new EventEmitter<any>();
    @Output() onOpenPkey = new EventEmitter<number>();

    private ENDPOINT: string = environment.endpoints.TMA;

    tabs = ['PKeys', 'History', 'Queues', 'Tools'];
    activeTab = 0;
    pkeys!: PKey[];
    queues: Queue[] = [];
    queuesAreLoading = false;
    private commandHistory!: Stack<string>;

    private history$!: Observable<Stack<string>>;

    constructor(
        private menuService: MenuService,
        private router: Router,
        private pkeyService: PkeysService,
        private terminalService: TerminalService,
        private restService: HttpClient,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.history$ = this.terminalService.getHistory();

        this.pkeyService.getPkeys().subscribe((newPkeys) => {
            this.pkeys = newPkeys;
        });
        
        this.history$.subscribe((val: Stack<string>) => this.commandHistory = val)
    }

    onTabChange(tabIndex: number): void {
        this.activeTab = tabIndex;
        if (this.activeTab === 2) {
            this.getQueues();
        }
    }

    onCommandClick(command: string): void {
        this.authService.getUser().subscribe((user: User) => {
            // this.statisticsService.addClientStat(clientStatisticsSources.historyCommandExec);
            this.executeCommand.emit(new Command(command, user.settings.autoExecuteHistory));

        });

    }

    openPKey(index: number) {
        this.onOpenPkey.emit(index);
    }

    get hasCommandsInHistory(): boolean {
        return this.commandHistory.getSize() > 0;
    }

    get hasQueues(): boolean {
        return this.queues.length > 0;
    }

    getQueues(): void {
        this.authService.getUser().subscribe((user: User) => {
            if(!(user instanceof AuthenticatedUser)) return;
            
            this.queuesAreLoading = true;
            
            this.restService.get(`${this.ENDPOINT}/GetActiveQueues?sessionid=${user.id}&ts=${new Date().getTime()}`).subscribe({
                next: (result: any) => {
                    this.queues = [];
                    result.forEach((queueObject: any) => {
                        this.queues.push(Queue.fromServer(queueObject));
                    });
                },
                error: (err: Error) => {
                    // this.utilitiesService.showAlert('Error', result.message);
                },
                complete: () => this.queuesAreLoading = false
            })
        })
        
    }

    executeQueueCommand(id: number): void {
        // this.statisticsService.addClientStat(clientStatisticsSources.queueExec);
        this.executeCommand.emit(new Command('QLD/' + id, true));
    }

    getPnrs(): void {
        this.authService.getUser().subscribe((user: User) => {
            if(!(user instanceof AuthenticatedUser)) return;

            // this.statisticsService.addClientStat(clientStatisticsSources.myPnrs);
            this.restService.get(`${this.ENDPOINT}/GetPNRs?sessionid=${user.id}`).subscribe({
                next: (result: any) => {
                    this.commandResult.emit(result);
                    this.menuService.toggleMenu('right');
                },
                error: (err: Error) => {
                    // this.utilitiesService.showAlert('Error', result.message);
                }
            });
        })
        
    }

}
