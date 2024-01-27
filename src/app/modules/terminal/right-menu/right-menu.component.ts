import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppStateService} from 'src/app/services/app-state.service';
import {PKey} from 'src/app/models/pkey.model';
import {Router} from '@angular/router';
import {pkeyExecutePageLink} from 'src/app/data/router-links.data';
import {Queue} from 'src/app/models/queue.model';
import {RestService} from 'src/app/services/rest.service';
import {activeQueuesEndpoint, pnrsEndpoint, lastPnrEndpoint} from 'src/app/data/endpoints.data';
import {UtilitiesService} from 'src/app/services/utilities.service';
import {GetParameter} from 'src/app/models/get-parameter.model';
import {Result} from 'src/app/models/result.model';
import {Command} from 'src/app/models/command.model';
import {StatisticsService} from 'src/app/services/statistics.service';
import {clientStatisticsSources} from 'src/app/data/conf.data';
import {MenuService} from 'src/app/services/menu.service';

@Component({
    selector: 'app-right-menu',
    templateUrl: './right-menu.component.html',
    styleUrls: ['./right-menu.component.scss'],
})
export class RightMenuComponent implements OnInit, OnDestroy {
    @Output() executeCommand = new EventEmitter<Command>();
    @Output() logout = new EventEmitter<void>();
    @Output() commandResult = new EventEmitter<Result>();
    @Output() onOpenPkey = new EventEmitter<number>();

    private pkeysSubscription: Subscription;
    private commandsHistorySubscription: Subscription;
    tabs = ['PKeys', 'History', 'Queues', 'Tools'];
    activeTab = 0;
    commandsHistory: string[];
    pkeys: PKey[];
    queues: Queue[];
    queuesAreLoading = false;

    constructor(
        private appStateService: AppStateService,
        private menuService: MenuService,
        private router: Router,
        private restService: RestService,
        private utilitiesService: UtilitiesService,
        private statisticsService: StatisticsService
    ) {
    }

    ngOnInit(): void {
        this.pkeysSubscription = this.appStateService.pkeys.subscribe((newPkeys) => {
            this.pkeys = newPkeys;
        });
        this.commandsHistorySubscription = this.appStateService.commandsHistory.subscribe((newCommandsHistory) => {
            // hack angular to display the commands array in the correct order
            this.commandsHistory = [];
            newCommandsHistory.forEach((command) => {
                this.commandsHistory.unshift(command);
            });
        });
    }

    ngOnDestroy(): void {
        this.pkeysSubscription.unsubscribe();
        this.commandsHistorySubscription.unsubscribe();
    }

    onTabChange(tabIndex: number): void {
        this.activeTab = tabIndex;
        if (this.activeTab === 2) {
            this.getQueues();
        }
    }

    onCommandClick(command: string): void {
        this.statisticsService.addClientStat(clientStatisticsSources.historyCommandExec);
        this.executeCommand.emit(new Command(command, this.appStateService.settingsSource.getValue().autoExecuteHistory));

    }

    openPKey(index: number) {
        this.onOpenPkey.emit(index);
    }

    get hasCommandsInHistory(): boolean {
        return this.commandsHistory.length > 0;
    }

    get hasQueues(): boolean {
        return this.queues.length > 0;
    }

    getQueues(): void {
        this.queuesAreLoading = true;
        const getData = [];
        getData.push(new GetParameter('sessionid', this.appStateService.sessionId));
        getData.push(new GetParameter('ts', new Date().getTime()));
        this.restService.get(activeQueuesEndpoint, getData, false).then((result) => {
            if (result.success) {
                this.queues = [];
                result.data.forEach((queueObject) => {
                    this.queues.push(Queue.fromServer(queueObject));
                });
            } else {
                this.utilitiesService.showAlert('Error', result.message);
            }
            this.queuesAreLoading = false;
        });
    }

    executeQueueCommand(id: number): void {
        this.statisticsService.addClientStat(clientStatisticsSources.queueExec);
        this.executeCommand.emit(new Command('QLD/' + id, true));
    }

    getPnrs(): void {
        this.statisticsService.addClientStat(clientStatisticsSources.myPnrs);
        const data = [new GetParameter('sessionid', this.appStateService.sessionId)];
        this.restService.get(pnrsEndpoint, data, true).then((result) => {
            if (result.success) {
                this.commandResult.emit(result);
                this.menuService.toggleMenu('right');
            } else {
                this.utilitiesService.showAlert('Error', result.message);
            }
        });
    }

}
