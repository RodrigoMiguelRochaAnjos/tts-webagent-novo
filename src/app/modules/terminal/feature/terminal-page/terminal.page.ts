import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { TerminalService } from '../../data-access/terminal.service';
import { Command } from '../../models/command.module';
import { User } from 'src/app/core/models/user/user.model';
import { Stack } from 'src/app/core/utils/stack.structure';
import { MenuService } from '../../data-access/menu.service';
import { Menu } from '../../models/menu.model';
import { CircularLinkedList } from 'src/app/core/utils/circular-linked-list.structure';
import { TerminalHistoryService } from '../../data-access/terminal-history.service';
import { ModalControllerService } from 'src/app/core/services/modal-controller.service';

@Component({
    selector: 'app-main',
    templateUrl: './terminal.page.html',
    styleUrls: ['./terminal.page.scss'],
})
export class TerminalPage implements OnInit {
    showTwoTerminalsSubscription!: Subscription;
    secondTerminalSelectedSubscription!: Subscription;
    terminalContentSubscription!: Subscription;
    filtersSubscription!: Subscription;
    showBtnMdSubscription!: Subscription;
    showBtnMuSubscription!: Subscription;
    settingsSubscription!: Subscription;
    showTwoTerminals!: boolean;
    isSecondTerminalSelected!: boolean;
    terminal1Content!: SafeHtml;
    terminal2Content!: SafeHtml;
    hasFilters!: boolean;
    showBtnMu!: boolean;
    showBtnMd!: boolean;
    emailItems!: any[];
    hasItemsToEmail!: boolean;
    keepKeyboardVisible!: boolean;
    menusSwipeEnabled = true;
    areFilters: boolean = false;
    canWriteCommands: boolean = true;
    data: any;
    isBrandAcc: boolean = false;
    isEmail!: boolean;
    isCalendar!: boolean;
    selected!: Date;

    @ViewChild("brandsAndAcillaries") brandsAndAcillaries!: TemplateRef<any>;

    selectedPkey: number = -1;

    constructor(
        private domSanitizer: DomSanitizer,
        private terminalHistoryService: TerminalHistoryService,
        private terminalService: TerminalService,
        private menuService: MenuService,
        private modalService: ModalControllerService,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        const rightMenu = new Menu(document.getElementById('right-menu')!, 375, 'right');
        this.menuService.initializeSwipeGesture(document.getElementById('terminal-page')!, rightMenu);

        this.showTwoTerminalsSubscription = this.terminalService.showTwoTerminals.subscribe((showTwoTerminals) => {
            if (this.showTwoTerminals && !showTwoTerminals) {
                this.terminal1Content = this.domSanitizer.bypassSecurityTrustHtml(this.terminalService.terminalContentSource.getValue());
                this.terminalService.secondTerminalSelectedSource.next(false);
            }
            this.showTwoTerminals = showTwoTerminals;
        });

        this.secondTerminalSelectedSubscription = this.terminalService.secondTerminalSelected.subscribe((isSecondTerminalSelected) => {
            this.isSecondTerminalSelected = isSecondTerminalSelected;
        });

        this.terminalContentSubscription = this.terminalService.terminalContent.subscribe((newTerminalContent) => {
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
        this.filtersSubscription = this.terminalService.filters.subscribe((newFilters) => {
            this.hasFilters = newFilters.length > 0;
        });
        this.showBtnMdSubscription = this.terminalService.showMoveDownBtn.subscribe((showBtnMd) => {
            this.showBtnMd = showBtnMd;
        });
        this.showBtnMuSubscription = this.terminalService.showMoveUpBtn.subscribe((showBtnMu) => {
            this.showBtnMu = showBtnMu;
        });

        this.authService.getUser().subscribe((user: User) => {
            this.hasItemsToEmail = user.settings.sendByEmailItems.length > 0;
            this.emailItems = user.settings.sendByEmailItems;
            this.keepKeyboardVisible = user.settings.keepKeyboardVisible;
        })

        console.log(this.terminalService.commandsHistorySource.getValue());

        if (this.terminalService.terminalContentSource.getValue() === '' && this.terminalService.commandsHistorySource.getValue().length > 0) {
            const commandsHistory = this.terminalService.commandsHistorySource.getValue();
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
    }

    /**
     * Method that handles the click events on terminal
     * @param element : HTMLElement
     * @param isSecondTerminal : boolean
     */
    async onTerminalClick(element: HTMLElement, isSecondTerminal: boolean): Promise<void> {
        //fazer o component para calendário ao meio e depois enviar a data para o terminal em si
        this.terminalService.secondTerminalSelectedSource.next(isSecondTerminal);
        this.isSecondTerminalSelected = isSecondTerminal;
        if (element.tagName === 'SPAN') {
            const elementClasses = element.className.split(' ');
            if (elementClasses[0] === 'terminal-calendar') { // handles the date picker calendar
                this.selected = this.terminalService.executeCalendar(element);
                this.openCalendar();
                document.getElementById('terminal1')!.style.pointerEvents = 'none';
                if (isSecondTerminal) {
                    document.getElementById('terminal2')!.style.pointerEvents = 'none';
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
        this.isBrandAcc = true;

        this.modalService.showModal(this.brandsAndAcillaries, "brands-and-acillaries");
        this.allowCommands();
    }

    /**
     * Method that handles the closing of the brand and ancillaries component
     */
    onBrandClose(): void {
        if (this.showTwoTerminals) {
            document.getElementById('terminal2')!.style.pointerEvents = 'auto';
        }
        this.isBrandAcc = false;
        document.getElementById('terminal1')!.style.pointerEvents = 'auto';
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
            document.getElementById('terminal2')!.style.pointerEvents = 'none';
        }
        this.areFilters = true;
        document.getElementById('terminal1')!.style.pointerEvents = 'none';
    }

    onExecuteCommandEvent(commandObj: Command): void {
        if (commandObj.autoExecute) {
            this.terminalService.executeTerminalCommand(commandObj.command, undefined, true);
        } else {
            this.terminalService.selectedCommandSource.next(commandObj.command);
        }
    }

    private openCalendar(): void {
        this.isCalendar = !this.isCalendar;
        this.allowCommands();
    }

    submitCalendar(date: Date): void {
        document.getElementById('terminal1')!.style.pointerEvents = 'auto';
        if (this.isSecondTerminalSelected) {
            document.getElementById('terminal2')!.style.pointerEvents = 'auto';
        }
        this.terminalService.submitCalendar(date);
        this.openCalendar();
    }

    logout(): void {
        this.authService.logout();
    }

    executeMdMuCommands(command: 'MU' | 'MD'): void {
        this.terminalService.executeTerminalCommand(command);
    }

    onEmailItemsClick(): void {
        this.isEmail = true;
        document.getElementById('terminal1')!.style.pointerEvents = 'none';
        this.allowCommands();
    }

    onCommandResult(result: any): void {
        this.terminalService.processTerminalCommand(result);
    }

    private processKeyboardVisibility(): void {
        setTimeout(() => {
            if (document.getElementById('terminal-command-input') != null) {
                const commandInput = document.getElementById('terminal-command-input')?.childNodes[0] as HTMLInputElement;

                if (commandInput) commandInput.focus();
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
                document.getElementById('terminal2')!.style.pointerEvents = 'auto';
            }
            document.getElementById('terminal1')!.style.pointerEvents = 'auto';
            document.getElementById('filters')!.style.pointerEvents = 'auto';
        }, 200)
    }

    exitEmailItems(): void {
        this.isEmail = false;
        document.getElementById("terminal1")!.style.pointerEvents = "auto";
        this.allowCommands();
    }
}
