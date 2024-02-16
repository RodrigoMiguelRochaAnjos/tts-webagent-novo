import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Observable, Subscription, takeUntil} from 'rxjs';
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
import { AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { CircularLinkedList } from 'src/app/core/utils/circular-linked-list.structure';
import { TerminalHistoryService } from '../../data-access/terminal-history.service';
import { DestroyService } from 'src/app/core/services/destroy.service';
import { TranslateService } from '@ngx-translate/core';
import { GetParameter } from 'src/app/modules/neo/models/get-parameter.model';

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

    private messages: {[key: string]: string} = {
        NO_PNR_TO_SHOW_ITINERARY_MESSAGE: ''
    }

    tabs = ['PKeys', 'History', 'Queues', 'Tools'];
    activeTab = 0;
    queues: Queue[] = [];
    queuesAreLoading = false;
    private historySize: number = 0;
    
    history$!: Observable<CircularLinkedList<string>>;
    pkeys$!: Observable<PKey[]>;

    constructor(
        private menuService: MenuService,
        private router: Router,
        private pkeyService: PkeysService,
        private terminalHistoryService: TerminalHistoryService,
        private terminalService: TerminalService,
        private restService: HttpClient,
        private alertService: AlertService,
        private authService: AuthService,
        private destroyService: DestroyService,
        translate: TranslateService,
    ) {
        
        Object.keys(this.messages).forEach((key: string) => {
            translate.stream(key).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((text: string) => this.messages[key] = text);
        });
        
    }

    ngOnInit(): void {
        this.history$ = this.terminalHistoryService.getHistory();

        this.pkeys$ = this.pkeyService.getPkeys();
        
        this.history$.subscribe((val: CircularLinkedList<string>) => this.historySize = val.getSize());
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
        return this.historySize > 0;
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
                    this.alertService.show(AlertType.ERROR, err.message);
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
                    this.alertService.show(AlertType.ERROR, err.message);
                }
            });
        })
        
    }

    viewTripItinerary(): void {
        //this.statisticsService.addClientStat(clientStatisticsSources.viewTrip);
        
        this.authService.getUser().subscribe((user: User) => {
            if(!(user instanceof AuthenticatedUser)) return;
           
            let data = [new GetParameter('sessionid', user.id)];

            this.restService.get(`${this.ENDPOINT}/GetLastPNR`, {
                params: {
                    'sessionid': user.id
                }
            }).subscribe({
                next: (result: any) => {
                    if (!result) {
                        this.alertService.show(AlertType.ERROR, (this.messages['NO_PNR_TO_SHOW_ITINERARY_MESSAGE']));
                        return;
                    }

                    const url = 'https://viewtrip.travelport.com/#!/itinerary?loc=' + result.code + '&lName=' + result.name.split('/')[0];
                    window.open(url);
                },
                error: (err: Error) => {
                    this.alertService.show(AlertType.ERROR, err.message);

                }
            });
        });
    }

    printTerminal(): void {
        const windowPrint: Window | null = window.open();
        windowPrint!.document.write(document.getElementById('terminal-window')!.innerHTML);
        windowPrint!.print();
    }

    toggleDoubleTerminal(): void {
        const showTwoTerminals = !this.terminalService.showTwoTerminalsSource.getValue();
        this.terminalService.showTwoTerminalsSource.next(showTwoTerminals);
        // this.statisticsService.addClientStat(
        //     showTwoTerminals ? "DoubleWindowON" : "DoubleWindowOFF"
        // );
        this.menuService.toggleMenu('right');
    }
}
