import { Component, Output, EventEmitter, OnInit, OnDestroy, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TerminalService } from '../../data-access/terminal.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { Stack } from 'src/app/core/utils/stack.structure';
import { PkeysService } from '../../data-access/pkeys.service';
import { PKey } from '../../models/pkey.model';
import { deepClone } from 'src/app/core/utils/deep-clone.tool';
import { CircularLinkedList } from 'src/app/core/utils/circular-linked-list.structure';
import { TerminalHistoryService } from '../../data-access/terminal-history.service';
import { MenuService } from '../../data-access/menu.service';


class PKeyObject {
    text: string;
    isVariable: boolean;

    constructor(text: string, isVariable: boolean) {
        this.text = text;
        this.isVariable = isVariable;
    }
}


@Component({
    selector: 'terminal-bottom-bar',
    templateUrl: './bottom-bar.component.html',
    styleUrls: ['./bottom-bar.component.scss'],
})

export class BottomBarComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() pkeyIndex: number = -1;

    @Output() commandSubmit = new EventEmitter<string>();
    @ViewChild('terminalCommandInput') terminalCommandInput!: ElementRef;
    @ViewChildren('variableElement') variableElements!: QueryList<ElementRef>

    hasActivePkey: boolean = true;

    private selectedCommandSubscription!: Subscription;
    private settingsSubscription!: Subscription;
    private commandsHistorySubscription!: Subscription;
    private commandsHistory!: string[];
    private numberClicks: number = -1;

    pKey?: PKey;
    pkeyObjects!: PKeyObject[];
    originalPKeyObjects!: PKeyObject[];

    showingQKeys = false;
    quickKeys: string[] = [];
    inputMode!: string;

    constructor(
        private terminalHistoryService: TerminalHistoryService,
        private terminalService: TerminalService,
        private authService: AuthService,
        private menuService: MenuService,
        private pkeysService: PkeysService
    ) { }

    ngOnInit(): void {
        this.inputMode = 'text';
        this.authService.getUser().subscribe((user: User) => this.quickKeys = user.settings.qks[0]);
        
        this.commandsHistorySubscription = this.terminalService.commandsHistory.subscribe((newCommandsHistory) => {
            // hack angular to display the commands array in the correct order
            this.commandsHistory = [];
            newCommandsHistory.forEach((command) => {
                this.commandsHistory.unshift(command);
            });
        });
    }

    ngAfterViewInit(): void {
        this.selectedCommandSubscription = this.terminalService.selectedCommand.subscribe((newSelectedCommand) => {
            this.terminalCommandInput.nativeElement.value = newSelectedCommand;
        });
    }

    ngOnDestroy(): void {
        this.selectedCommandSubscription.unsubscribe();
        this.commandsHistorySubscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.pkeyIndex === -1) {
            this.hasActivePkey = false;
            return;
        }
        this.pKey = deepClone(this.pkeysService.get(this.pkeyIndex));

        const pkeyObjects = this.getPKeyObjects();
        const clonedPKeyObjects = deepClone(pkeyObjects);
        this.pkeyObjects = clonedPKeyObjects;
        // clear pkey variables text in order for the text inputs to be empty
        this.pkeyObjects.forEach((object) => {
            if (object.isVariable) {
                object.text = '';
            }
        });
        this.originalPKeyObjects = pkeyObjects;

        this.hasActivePkey = true;


        setTimeout(() => this.executeCommandAuto(), 300);
    }

    private executeCommandAuto() {
        if (this.variableElements.length <= 0) {
            if (this.pKey!.autoExecute) {
                this.terminalService.executeTerminalCommand(this.pKey!.command.toUpperCase())

                this.reset();
                return;
            }
            setTimeout(() => {
                this.terminalCommandInput.nativeElement.value = this.pKey!.command.toUpperCase().toUpperCase();
                this.terminalCommandInput.nativeElement.focus();
            }, 300);
            this.hasActivePkey = false;


            this.variableElements.get(0)?.nativeElement.focus();
            return;
        }
        this.menuService.toggleMenu("right");
    }

    emitSubmitEvent(event: any): void {
        if (event && event.key === 'Enter') {
            this.commandSubmit.emit((this.terminalCommandInput.nativeElement.value as string).trim().toUpperCase());

            this.commandsHistory.splice(this.numberClicks, 1);
            this.commandsHistory.unshift((this.terminalCommandInput.nativeElement.value as string).trim().toUpperCase());

            this.numberClicks = -1;
            this.terminalCommandInput.nativeElement.value = '';
        }
    }

    toggleQKeys(): void {
        this.showingQKeys = !this.showingQKeys;
    }

    onQKeyClick(character: string): void {
        const value = this.terminalCommandInput.nativeElement.value;
        const selectionStart = this.terminalCommandInput.nativeElement.selectionStart != null ? this.terminalCommandInput.nativeElement.selectionStart : value.length;
        const selectionEnd = this.terminalCommandInput.nativeElement.selectionEnd != null ? this.terminalCommandInput.nativeElement.selectionEnd : value.length;

        // Modify Input Value
        this.terminalCommandInput.nativeElement.value = value.slice(0, selectionStart) + character + value.slice(selectionEnd);

        // Set New Selection Range
        const newSelection = selectionStart + 1;
        this.terminalCommandInput.nativeElement.setSelectionRange(newSelection, newSelection);

        // Focus on the Input Element
        this.terminalCommandInput.nativeElement.focus();
    }

    /** Method that makes it possible to scroll through the command history via pressing the up arrow and
     * down arrow keys. When this component is initialized the number of clicks starts at -1, which corresponds
     * to a blank space on the terminal input. When the up arrow is pressed it increments 1 to the number of clicks,
     * and when the down arrow is pressed it decrements 1 to the number of clicks. The command shown in the interface
     * will be the command that corresponds to the element in the history array, using the index of number of clicks.
     */
    onArrowClick(event: any): void {
        if (event.key === "ArrowUp") {
            if (this.numberClicks < this.commandsHistory.length - 1)
                this.numberClicks += 1;
            else
                this.numberClicks = -1;
        }
        else if (event.key === "ArrowDown" && this.numberClicks > -1)
            this.numberClicks -= 1;

        const value = "";
        const selectionStart = this.terminalCommandInput.nativeElement.selectionStart != null ? this.terminalCommandInput.nativeElement.selectionStart : value.length;
        const selectionEnd = this.terminalCommandInput.nativeElement.selectionEnd != null ? this.terminalCommandInput.nativeElement.selectionEnd : value.length;
        this.terminalCommandInput.nativeElement.value = `${value.slice(0, selectionStart)}${this.getCommand()}${value.slice(selectionEnd)}`;
        const newSelection = selectionStart + 1;
        this.terminalCommandInput.nativeElement.setSelectionRange(newSelection, newSelection);
    }

    /** Returns the command given the number of clicks.
     * If the number of clicks is less than 0, then it will return a blank string.
     * If the number of clicks is more than 0, then it will return an element of the array
     * using the number of clicks as an index.
     */
    private getCommand(): string {
        if (this.numberClicks < 0)
            return "";
        else
            return this.commandsHistory[this.numberClicks];
    }

    private getPKeyObjects(): PKeyObject[] {
        const objs: any = [];
        const commandVariables: any = this.pKey?.commandVariables;
        let pkeyItems: any[] | undefined = this.pKey?.command.trim().split('%');
        pkeyItems = pkeyItems ? pkeyItems : [this.pKey?.command.trim()];
        let variableIndex = 0;
        pkeyItems.forEach((item, itemIndex) => {
            if (item === '') {
                if (variableIndex < commandVariables.length) {
                    objs.push(new PKeyObject(commandVariables[variableIndex], true));
                    variableIndex++;
                }
            } else {
                objs.push(new PKeyObject(item, false));
                if (itemIndex < objs.length && variableIndex < commandVariables.length) {
                    objs.push(new PKeyObject(commandVariables[variableIndex], true));
                    variableIndex += 1;
                }
            }
        });
        return objs;
    }

    checkTab(event: any): void {
        if (event && event.key === 'Tab' && this.variableElements.length >= 0 && document.activeElement == this.variableElements.last.nativeElement) {
            setTimeout(() => {
                this.variableElements.get(0)?.nativeElement.focus();
            }, 20);
        }
    }

    executePKey(event: any): void {

        if (event && event.key === 'Enter') {
            // this.statisticsService.addClientStat(clientStatisticsSources.pkeyExec);
            let command = '';
            let emptyVariables = 0;
            this.pkeyObjects.forEach((obj) => {
                command += obj.isVariable ? obj.text.trim() : obj.text;
                if (obj.isVariable && obj.text.trim().length === 0) {
                    emptyVariables += 1;
                }
            });
            if (emptyVariables <= 0) {
                if (this.pKey?.autoExecute) {
                    this.terminalService.executeTerminalCommand(command.toUpperCase());
                } else {
                    this.hasActivePkey = false;

                    setTimeout(() => {
                        this.terminalCommandInput.nativeElement.value = command.toUpperCase();
                        this.terminalCommandInput.nativeElement.focus();
                    }, 300);

                    // this.appStateService.selectedCommandSource.next(command.toUpperCase());
                }
                this.reset();
            }
        }

    }

    @HostListener('keydown', ['$event'])
    removePkeys(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            this.reset();
        }
    }


    reset() {
        this.hasActivePkey = false;
        this.pKey = undefined;
    }

    toggleMenu(side: 'right'): void {
        this.menuService.toggleMenu(side);
    }
}
