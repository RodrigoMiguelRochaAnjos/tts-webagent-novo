import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';
import {AppStateService} from 'src/app/services/app-state.service';
import {TerminalService} from 'src/app/services/terminal.service';
import {AuthService} from 'src/app/services/auth.service';
import {Result} from 'src/app/models/result.model';
import {Command} from 'src/app/models/command.model';
import {MenuService} from 'src/app/services/menu.service';
import {Menu} from 'src/app/models/menu.model';

@Component({
    selector: 'app-main',
    templateUrl: './terminal.page.html',
    styleUrls: ['./terminal.page.scss'],
})
export class TerminalPage implements OnInit, OnDestroy {
	showTwoTerminalsSubscription: Subscription;
	secondTerminalSelectedSubscription: Subscription;
	terminalContentSubscription: Subscription;
	filtersSubscription: Subscription;
	showBtnMdSubscription: Subscription;
	showBtnMuSubscription: Subscription;
	settingsSubscription: Subscription;
	showTwoTerminals: boolean;
	isSecondTerminalSelected: boolean;
	terminal1Content: SafeHtml;
	terminal2Content: SafeHtml;
	hasFilters: boolean;
	showBtnMu: boolean;
	showBtnMd: boolean;
	emailItems: any[];
	hasItemsToEmail: boolean;
	keepKeyboardVisible: boolean;
	menusSwipeEnabled = true;
	areFilters: boolean = false;
	canWriteCommands: boolean = true;
	data: any;
	isBrandAcc: boolean = false;
	isEmail: boolean;
	isCalendar: boolean;
	selected: Date;

    selectedPkey: number = -1;

    constructor(
        private appStateService: AppStateService,
        private domSanitizer: DomSanitizer,
        private terminalService: TerminalService,
        private menuService: MenuService,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        const rightMenu = new Menu(document.getElementById('right-menu'), 375, 'right');
        this.menuService.initializeSwipeGesture(document.getElementById('terminal-page'), rightMenu);
        this.showTwoTerminalsSubscription = this.appStateService.showTwoTerminals.subscribe((showTwoTerminals) => {
            if (this.showTwoTerminals && !showTwoTerminals) {
                this.terminal1Content = this.domSanitizer.bypassSecurityTrustHtml(this.appStateService.terminalContentSource.getValue());
                this.appStateService.secondTerminalSelectedSource.next(false);
            }
            this.showTwoTerminals = showTwoTerminals;
        });
        this.secondTerminalSelectedSubscription = this.appStateService.secondTerminalSelected.subscribe((isSecondTerminalSelected) => {
            this.isSecondTerminalSelected = isSecondTerminalSelected;
        });
        this.terminalContentSubscription = this.appStateService.terminalContent.subscribe((newTerminalContent) => {
            const terminalContent = this.domSanitizer.bypassSecurityTrustHtml(newTerminalContent);
            if (this.isSecondTerminalSelected) {
                this.terminal2Content = terminalContent;
                this.terminalService.fixTerminalContent('terminal1');
            } else {
                this.terminal1Content = terminalContent;
                this.terminalService.fixTerminalContent('terminal2');
            }
            this.processKeyboardVisibility();
        });
        this.filtersSubscription = this.appStateService.filters.subscribe((newFilters) => {
            this.hasFilters = newFilters.length > 0;
        });
        this.showBtnMdSubscription = this.appStateService.showMoveDownBtn.subscribe((showBtnMd) => {
            this.showBtnMd = showBtnMd;
        });
        this.showBtnMuSubscription = this.appStateService.showMoveUpBtn.subscribe((showBtnMu) => {
            this.showBtnMu = showBtnMu;
        });
        this.settingsSubscription = this.appStateService.settings.subscribe((newSettings) => {
            this.hasItemsToEmail = newSettings.sendByEMailItems.length > 0;
            this.emailItems = newSettings.sendByEMailItems;
            this.keepKeyboardVisible = newSettings.keepKeyboardVisible;
        });
        if (this.appStateService.terminalContentSource.getValue() === '' && this.appStateService.commandsHistorySource.getValue().length > 0) {
            const commandsHistory = this.appStateService.commandsHistorySource.getValue();
            this.terminalService.executeTerminalCommand(commandsHistory[commandsHistory.length - 1]);
        }
    }

    ngOnDestroy(): void {
        this.showTwoTerminalsSubscription.unsubscribe();
        this.secondTerminalSelectedSubscription.unsubscribe();
        this.terminalContentSubscription.unsubscribe();
        this.filtersSubscription.unsubscribe();
        this.showBtnMdSubscription.unsubscribe();
        this.showBtnMuSubscription.unsubscribe();
        this.settingsSubscription.unsubscribe();
    }

    /**
     * Method that handles the click events on terminal
     * @param element : HTMLElement
     * @param isSecondTerminal : boolean
     */
    async onTerminalClick(element: HTMLElement, isSecondTerminal: boolean): Promise<void> {
        //fazer o component para calendário ao meio e depois enviar a data para o terminal em si
        this.appStateService.secondTerminalSelectedSource.next(isSecondTerminal);
        this.isSecondTerminalSelected = isSecondTerminal;
        if (element.tagName === 'SPAN') {
            const elementClasses = element.className.split(' ');
            if (elementClasses[0] === 'terminal-calendar') { // handles the date picker calendar
                this.selected = this.terminalService.executeCalendar(element);
                this.openCalendar();
                document.getElementById('terminal1').style.pointerEvents = 'none';
                if (isSecondTerminal) {
                    document.getElementById('terminal2').style.pointerEvents = 'none';
                }
            } else if (elementClasses[0] === 'terminal-branded-fare') {  // handles the brand and ancillaries
                this.data = await this.terminalService.executeBranded(element);
                this.onBrandClick();
            } else {
                this.terminalService.executeClickAction(element);
            }
        }
    }

    /**
     * Method that handles the brand and ancillaries component appear while making the rest of the terminal unusable
     */
    private onBrandClick(): void {
        if (this.showTwoTerminals) {
            document.getElementById('terminal2').style.pointerEvents = 'none';
        }
        this.isBrandAcc = true;
        document.getElementById('terminal1').style.pointerEvents = 'none';
        this.allowCommands();
    }

    /**
     * Method that handles the closing of the brand and ancillaries component
     */
    onBrandClose(): void {
        if (this.showTwoTerminals) {
            document.getElementById('terminal2').style.pointerEvents = 'auto';
        }
        this.isBrandAcc = false;
        document.getElementById('terminal1').style.pointerEvents = 'auto';
        this.allowCommands();
    }

    onTerminalSubmit(element: HTMLInputElement): void {
        this.terminalService.executeSubmitAction(element);
    }

    onCommandInputSubmit(command: string): void {
        if (command) {
            this.terminalService.executeTerminalCommand(command);
        }
    }

    onFilterBtnClick(): void {
        if (this.showTwoTerminals) {
            document.getElementById('terminal2').style.pointerEvents = 'none';
        }
        this.areFilters = true;
        document.getElementById('terminal1').style.pointerEvents = 'none';
    }

    onExecuteCommandEvent(commandObj: Command): void {
        if (commandObj.autoExecute) {
            this.terminalService.executeTerminalCommand(commandObj.command, undefined, true);
        } else {
            this.appStateService.selectedCommandSource.next(commandObj.command);
        }
    }

    private openCalendar(): void {
        this.isCalendar = !this.isCalendar;
        this.allowCommands();
    }

    submitCalendar(date: Date): void {
        document.getElementById('terminal1').style.pointerEvents = 'auto';
        if (this.isSecondTerminalSelected) {
            document.getElementById('terminal2').style.pointerEvents = 'auto';
        }
        this.terminalService.submitCalendar(date);
        this.openCalendar();
    }

	logout(): void {
		this.authService.logout(true);
	}

    executeMdMuCommands(command: 'MU' | 'MD'): void {
        this.terminalService.executeTerminalCommand(command);
    }

    onEmailItemsClick(): void {
        this.isEmail = true;
        document.getElementById('terminal1').style.pointerEvents = 'none';
        this.allowCommands();
    }

    onCommandResult(result: Result): void {
        this.terminalService.processTerminalCommand(result);
    }

	private processKeyboardVisibility(): void {
		setTimeout(() => {
				if (document.getElementById('terminal-command-input') !== null)	{
					const commandInput = document.getElementById('terminal-command-input').childNodes[0] as HTMLInputElement;
					commandInput.focus();
				}
		}, 1000);
	}

    setPkey(index: number) {
        this.selectedPkey = -1;

        setTimeout(() => {
            this.selectedPkey = index;

        }, 300);
    }

    setMenusSwipe(enabled: boolean): void {
        this.menusSwipeEnabled = enabled;
    }

    clickOutFilters(): void {
        if (this.areFilters) {
            this.exitFilters();
            this.allowCommands();
        }
    }

    allowCommands(): void {
        setTimeout(() => {
            this.canWriteCommands = !this.canWriteCommands;
            this.hasFilters = !this.hasFilters;
        }, 200);
    }

    exitFilters(): void {
        setTimeout(() => {
            this.areFilters = !this.areFilters;
            if (this.showTwoTerminals) {
                document.getElementById('terminal2').style.pointerEvents = 'auto';
            }
            document.getElementById('terminal1').style.pointerEvents = 'auto';
            document.getElementById('filters').style.pointerEvents = 'auto';
        }, 200)
    }

    exitEmailItems(): void {
        this.isEmail = false;
        document.getElementById("terminal1").style.pointerEvents = "auto";
        this.allowCommands();
    }

}
