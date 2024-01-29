import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription, forkJoin} from 'rxjs';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { TerminalService } from '../../data-access/terminal.service';
import { Command } from '../../models/command.module';
import { User } from 'src/app/core/models/user/user.model';
import { Stack } from 'src/app/core/utils/stack.structure';
import { MenuService } from '../../data-access/menu.service';
import { Menu } from '../../models/menu.model';
import { CircularLinkedList } from 'src/app/core/utils/circular-linked-list.structure';

@Component({
    selector: 'app-main',
    templateUrl: './terminal.page.html',
    styleUrls: ['./terminal.page.scss'],
})
export class TerminalPage implements OnInit {
	showTwoTerminals!: boolean;
	isSecondTerminalSelected!: boolean;
	terminalContent!: SafeHtml;
	hasFilters!: boolean;
	showBtnMu!: boolean;
	showBtnMd!: boolean;
	emailItems: any[] = [];
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

    selectedPkey: number = -1;

    terminals$!: Observable<{ terminal: HTMLElement, selected: boolean }[]>;
    history$!: Observable<CircularLinkedList<string>>;

    terminalContent$!: Observable<string>;

    constructor(
        private domSanitizer: DomSanitizer,
        private terminalService: TerminalService,
        private menuService: MenuService,
        private authService: AuthService
    ) {
        this.terminals$ = this.terminalService.getTerminals();
        this.terminalContent$ = this.terminalService.getTerminalContent();
        this.history$ = this.terminalService.getHistory();
    }

    ngOnInit(): void {
        const rightMenu = new Menu(document.getElementById('right-menu')!, 375, 'right');
        this.menuService.initializeSwipeGesture(document.getElementById('terminal-page')!, rightMenu);

        this.terminalContent$.subscribe((val: string) => {
            this.terminalContent = this.domSanitizer.bypassSecurityTrustHtml(val);
            this.terminalService.fixTerminalContent(this.terminalService.currentTerminal?.getAttribute('id'));

            this.processKeyboardVisibility();
        });

        this.terminalService.getFilters().subscribe((newFilters: any[]) => {
            this.hasFilters = newFilters.length > 0;
        });

        this.terminalService.getShowButtons().subscribe((buttons: {up: boolean, down: boolean}) => {
            this.showBtnMd = buttons.down;
            this.showBtnMu = buttons.up;
        });

        this.authService.getUser().subscribe((user: User) => {
            this.hasItemsToEmail = user.settings.sendByEmailItems ? user.settings.sendByEmailItems.length > 0 : false;
            this.emailItems = user.settings ? user.settings.sendByEmailItems : [];
            this.keepKeyboardVisible = user.settings.keepKeyboardVisible;
        });


        // forkJoin({ terminalContent: this.terminalContent$, history: this.history$}).subscribe({
        //     next: (value: { terminalContent: string, history: Stack<string> }) => {
        //         if (value.terminalContent !== '' || value.history.getSize() <= 0) return;

        //         const commandToExecute: string | undefined = value.history.pop();

        //         if(commandToExecute == null) return;

        //         this.terminalService.executeTerminalCommand(commandToExecute);
        //     }
        // })
    }

    /**
     * Method that handles the click events on terminal
     * @param element : HTMLElement
     * @param isSecondTerminal : boolean
     */
    async onTerminalClick(element: HTMLElement, index: number): Promise<void> {
        // fazer o component para calendário ao meio e depois enviar a data para o terminal em si
        this.terminalService.selectTerminal(index);

        if (element.tagName !== 'SPAN') return;

        const elementClasses = element.className.split(' ');

        if (elementClasses[0] === 'terminal-calendar') { // handles the date picker calendar
            this.selected = this.terminalService.executeCalendar(element);
            this.openCalendar();
            this.terminalService.currentTerminal.style.pointerEvents = 'none';
            
            return;
        }
        
        if (elementClasses[0] === 'terminal-branded-fare') {  // handles the brand and ancillaries
            this.data = await this.terminalService.executeBranded(element);
            this.onBrandClick();
            return;
        }

        this.terminalService.executeClickAction(element);
    }

    /**
     * Method that handles the brand and ancillaries component appear while making the rest of the terminal unusable
     */
    private onBrandClick(): void {
        if (this.showTwoTerminals) {
            document.getElementById('terminal2')!.style.pointerEvents = 'none';
        }
        this.isBrandAcc = true;
        document.getElementById('terminal1')!.style.pointerEvents = 'none';
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
            return;
        }

        this.terminalService.selectCommand(commandObj.command);
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
				if (document.getElementById('terminal-command-input') != null)	{
					const commandInput = document.getElementById('terminal-command-input')?.childNodes[0] as HTMLInputElement;

                    if(commandInput) commandInput.focus();
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

    toggleMenu(side: 'right'): void {
        this.menuService.toggleMenu(side);
    }
}
