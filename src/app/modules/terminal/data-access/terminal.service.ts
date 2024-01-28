import { HttpClient } from '@angular/common/http';
import { ComponentRef, EnvironmentInjector, Injectable, createComponent } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subscription, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AuthenticatedUser } from 'src/app/core/models/user/types/authenticated-user.model';
import { User } from 'src/app/core/models/user/user.model';
import { DestroyService } from 'src/app/core/services/destroy.service';
import { environment } from 'src/environments/environment';
import { TerminalComponent } from '../ui/terminal/terminal.component';
import { SafeHtml } from '@angular/platform-browser';
import { SettingsService } from 'src/app/core/services/settings.service';
import { TerminalSpecialRender } from '../utils/terminal-special-renderer.model';
import { Stack } from 'src/app/core/utils/stack.structure';
import { TerminalContent } from '../models/terminal-content.model';
import { MenuService } from './menu.service';

export const MONTHS: string[] = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
];

@Injectable({
    providedIn: 'root',
})
export class TerminalService {
    private readonly ENDPOINT: string = environment.endpoints.TMA;

    private terminalContent$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private terminals$: BehaviorSubject<{ terminal: HTMLElement, selected: boolean }[]> = new BehaviorSubject<{ terminal: HTMLElement, selected: boolean }[]>([{
        terminal: document.getElementById('terminal')!,
        selected: true
    }]);

    private history$: BehaviorSubject<Stack<string>> = new BehaviorSubject<Stack<string>>(new Stack<string>(50));
    private filters$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    private updateCommand!: object;
    private lastExecutedCommand: { command: object | string | null, type: string } = {
        command: null,
        type: ''
    };

    private showButtons$: BehaviorSubject<{ up: boolean, down: boolean }> = new BehaviorSubject<{ up: boolean, down: boolean }>({
        up: true,
        down: true
    });
    private dateElement!: HTMLElement;

    private messages: { [key: string]: string } = {
        EXPIRED_SESSION_MESSAGE: '',
        ERROR: '',
        SHOW_MORE_CONTENT_MESSAGE: '',
        NO_PLUGIN_SUPPORT_MESSAGE: '',
    }

    private mdLevel: number = 0;

    private selectedCommand$: BehaviorSubject<string> = new BehaviorSubject<string>('');


    constructor(
        private restService: HttpClient,
        private authService: AuthService,
        private router: Router,
        private destroyService: DestroyService,
        private settingsService: SettingsService,
        private environmentInjector: EnvironmentInjector,
        private menuService: MenuService,
        translate: TranslateService,
    ) {
        Object.keys(this.messages).forEach((key: string) => {
            translate.stream(key).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((text: string) => this.messages[key] = text);
        });
    }

    public getTerminals(): Observable<{ terminal: HTMLElement, selected: boolean }[]> {
        return this.terminals$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getTerminalContent(): Observable<string> {
        return this.terminalContent$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getFilters(): Observable<any[]> {
        return this.filters$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getShowButtons(): Observable<{ up: boolean, down: boolean }> {
        return this.showButtons$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getHistory(): Observable<Stack<string>> {
        return this.history$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getSelectedCommand(): Observable<string> {
        return this.selectedCommand$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public selectTerminal(index: number) {
        this.terminals$.next(
            this.terminals$.value.map((terminalWindow: { terminal: HTMLElement, selected: boolean }, terminalIndex: number) => {
                terminalWindow.selected = false;
                if (index === terminalIndex) terminalWindow.selected = true;

                return terminalWindow;
            })
        )
    }

    public selectCommand(command: string): void {
        this.selectedCommand$.next(command);
    }

    public createTerminal(content: SafeHtml): void {
        const componentRef: ComponentRef<TerminalComponent> = createComponent(TerminalComponent, {
            environmentInjector: this.environmentInjector
        });

        componentRef.instance.content = content;

        const terminals: { terminal: HTMLElement, selected: boolean }[] = this.terminals$.value;
        terminals.push({ terminal: componentRef.location.nativeElement, selected: false });


        this.terminals$.next(terminals);
    }

    private processFilters(filtersData: any): void {
        if (filtersData && filtersData.filters?.length > 0) {
            this.filters$.next(filtersData.filters)
            this.lastExecutedCommand.type = filtersData.type;

            return;
        }

        this.filters$.next([]);
    }

    private processMoveUpAndDown(moveDown: boolean): void {
        this.mdLevel = 0;

        if (this.lastExecutedCommand.command === 'MD') this.mdLevel++;

        if (this.lastExecutedCommand.command === 'MU' && this.mdLevel > 0) this.mdLevel--;

        this.showButtons$.next({
            up: this.mdLevel > 0,
            down: moveDown ? moveDown : false
        });
    }

    private processCommandResult(serverData: any): void {
        const terminalContent = new TerminalContent(serverData);
        const terminalContentRedered = terminalContent.render();

        this.terminalContent$.next(terminalContentRedered);
        this.executeUpdateCommand(terminalContentRedered);
    }

    private addCommandToHistory(command: string): void {
        const commands: Stack<string> = this.history$.value;
        if (command === commands.pop()) {
            return;
        }

        commands.push(command);

        this.history$.next(commands);

        localStorage.setItem('commands', JSON.stringify(commands));
    }

    private processCommandErrors(serverData: any): void {
        if (serverData.message.text && serverData.message.text.includes('Session does not exist')) {
            // this.utilitiesService.showAlert(this.errorLabel, this.expiredSessionMessage);
            this.authService.logout();
            return;
        }

        if (serverData.msgAlert) {
            // this.utilitiesService.showPopupFromServer(serverData.msgObj);
            return;
        }

        // this.utilitiesService.showAlert(this.errorLabel, serverData.message.text);
    }

    private executeUpdateCommand(terminalContent: string): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;
            if (!this.updateCommand || !terminalContent.includes('terminal-update')) return;

            const postData = {
                sessionId: user.id,
                cmdObj: this.updateCommand,
            };

            this.restService.post(`${this.ENDPOINT}/TerminalCommand`, postData).subscribe({
                next: (result: any) => {
                    if (!result.success) this.processCommandErrors(result);
                    const newElementsData = result.message as [];
                    const elementsToReplace = [].slice.call(this.currentTerminal.getElementsByClassName('terminal-update'));
                    newElementsData.forEach((newElementData: any) => {
                        const elementToReplace: HTMLElement = elementsToReplace[newElementData.i] as HTMLElement;
                        const newElement = TerminalSpecialRender.renderSpecialBrandedFareElement(elementToReplace, newElementData);
                        elementToReplace.parentNode?.replaceChild(newElement, elementToReplace);
                    });
                },
                error: (error: Error) => {
                    // this.utilitiesService.showAlert(this.errorLabel, result.message);
                }
            })
        })
    }

    private processEmailData(emailElement: HTMLElement, emailInfo: any): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!emailInfo || !emailElement) return;

            if (emailElement.className.includes('terminal-email-selected')) {
                const indexToRemove = user.settings.sendByEmail.findIndex((item) => JSON.stringify(item) === JSON.stringify(emailInfo));
                user.settings.sendByEmail = user.settings.sendByEmail.splice(indexToRemove, 1);

                this.settingsService.update(user.settings, false);
                emailElement.classList.toggle('terminal-email-selected');
                return;
            }

            const index = user.settings.sendByEmail.findIndex((item) => JSON.stringify(item) === JSON.stringify(emailInfo));
            if (index < 0) user.settings.sendByEmail.push(emailInfo);

            this.settingsService.update(user.settings, false);
            emailElement.classList.toggle('terminal-email-selected');

        });
    }

    processTerminalCommand(result: any, emailElement?: HTMLElement): void {
        if (!result.success) {
            this.processCommandErrors(result);
            return;
        }
        if (result.message) {
            this.updateCommand = result.message.updateCmd ? result.message.updateCmd : null;
            this.processCommandResult(result.message);
            this.processFilters(result.message.filters);

        }

        this.processMoveUpAndDown(result.enablePageDown);

        if (emailElement == null) return;

        this.processEmailData(emailElement, result.emailInfo);
    }

    executeTerminalCommand(command: string | string[] | Object, emailElement?: HTMLElement, history?: boolean): void {
        console.log("Command:", command);
        if (command === 'SOF') {
            this.authService.logout();
            return;
        }

        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            // this.utilitiesService.showLoading();
            const isCommandAString = typeof command === 'string';
            const isCommandAArray = Array.isArray(command);

            const postData: any = {};
            postData['sessionId'] = user.id;
            if (isCommandAString) {
                postData['allowEnhanced'] = user.settings.enhancedResults;
                postData['command'] = command;
            } else if (isCommandAArray) {
                postData['commandFields'] = command;
            } else {
                postData['cmdObj'] = command;
            }

            this.restService.post<any>(`${this.ENDPOINT}/TerminalCommand`, postData).subscribe({
                next: (result: any) => {
                    this.lastExecutedCommand.command = command;

                    if (isCommandAString) this.addCommandToHistory(command as string);

                    this.processTerminalCommand(result, emailElement);
                    // this.utilitiesService.dismissLoading();

                    if (history) this.menuService.toggleMenu('right');

                    setTimeout(() => {
                        const commandInput: HTMLInputElement | undefined = document.getElementById('terminal-command-input')?.childNodes[0] as HTMLInputElement;
                        if (commandInput) commandInput.focus();
                    }, 300);
                },
                error: (err: Error) => {
                    // this.utilitiesService.dismissLoading();
                    // this.utilitiesService.showAlert(this.errorLabel, err);
                }
            })


        })
    }

    public get currentTerminal() {
        console.log("terminals:", this.terminals$.value);
        return this.terminals$.value.filter((val: { terminal: HTMLElement, selected: boolean }) => val.selected == true).map((val: { terminal: HTMLElement, selected: boolean }) => val.terminal)[0];
    }

    private executeSubmit(element: HTMLElement) {
        const terminalBundleElements = this.currentTerminal.getElementsByClassName('bundle-' + element.getAttribute('data-bundle'));
        let command = element.getAttribute('data-value')!;
        [].slice.call(terminalBundleElements).forEach((bundleElement: HTMLElement) => {
            const prefix = bundleElement.getAttribute('data-prefix') ? bundleElement.getAttribute('data-prefix') : '';
            const suffix = bundleElement.getAttribute('data-suffix') ? bundleElement.getAttribute('data-suffix') : '';
            const text = bundleElement.className.includes('terminal-calendar')
                ? bundleElement.innerText.slice(0, 5)
                : (bundleElement as HTMLInputElement).value.trim();
            command += prefix + text + suffix;
        });
        const tprefix = element.getAttribute('data-prefix') ? element.getAttribute('data-prefix') : '';
        const tsuffix = element.getAttribute('data-suffix') ? element.getAttribute('data-suffix') : '';
        command = tprefix + command.toUpperCase() + tsuffix;
        this.executeTerminalCommand(command);
    }

    executeCalendar(element: HTMLElement): Date {
        this.dateElement = element;
        let currentDateText = element.innerText;
        const nowDate = new Date();
        return new Date(Number(nowDate.getFullYear().toString().slice(0, 2)
            + currentDateText.slice(5, 7)), MONTHS.indexOf(currentDateText.slice(2, 5)),
            Number(currentDateText.slice(0, 2)));
    }

    submitCalendar(date: Date): void {
        this.dateElement.innerText = ('0' + date.getDate()).slice(-2) +
            MONTHS[date.getMonth()] + date.getFullYear().toString().substring(2, 4);
        if (!TerminalService.checkNowDate())
            TerminalService.fixDateNow(document.getElementsByClassName('terminal-calendar')[0]);
        if (document.getElementsByClassName('terminal-calendar')[1] !== undefined && !TerminalService.checkDates())
            TerminalService.fixDates(document.getElementsByClassName('terminal-calendar')[0],
                document.getElementsByClassName('terminal-calendar')[1]);
    }

    private static checkNowDate(): boolean {
        const date_element1 = document.getElementsByClassName('terminal-calendar')[0].innerHTML;
        return new Date(Number(new Date().getFullYear().toString().slice(0, 2) + date_element1.slice(5, 7)),
            MONTHS.indexOf(date_element1.slice(2, 5)), Number(date_element1.slice(0, 2))) > new Date();
    }

    private static fixDateNow(element: Element): void {
        const dateNow = new Date();
        element.innerHTML = ('0' + dateNow.getDate()).slice(-2) +
            MONTHS[dateNow.getMonth()] + dateNow.getFullYear().toString().substring(2, 4);
    }

    private static checkDates(): boolean {
        const date_element1 = document.getElementsByClassName('terminal-calendar')[0].innerHTML;
        const date_element2 = document.getElementsByClassName('terminal-calendar')[1].innerHTML;
        return new Date(Number(new Date().getFullYear().toString().slice(0, 2) + date_element1.slice(5, 7)),
            MONTHS.indexOf(date_element1.slice(2, 5)), Number(date_element1.slice(0, 2)))
            < new Date(Number(new Date().getFullYear().toString().slice(0, 2) + date_element2.slice(5, 7)),
                MONTHS.indexOf(date_element2.slice(2, 5)), Number(date_element2.slice(0, 2)));
    }

    private static fixDates(element1: Element, element2: Element): void {
        const date = new Date(Number(new Date().getFullYear().toString().slice(0, 2) + element1.innerHTML.slice(5, 7)),
            MONTHS.indexOf(element1.innerHTML.slice(2, 5)), Number(element1.innerHTML.slice(0, 2)));
        element2.innerHTML = ('0' + date.getDate()).slice(-2) +
            MONTHS[date.getMonth()] + date.getFullYear().toString().substring(2, 4);
    }

    private executeMoreInfo(element: HTMLElement): void {
        const objs: any = element.getAttribute('data-objs') ? JSON.parse(element.getAttribute('data-objs')!.replace(/'/g, '"')) : false;
        let info = '<p class="' + element.getAttribute('data-id') + '">';
        if (!objs) {
            info += element.getAttribute('data-value');
        } else {
            objs.forEach((line: any) => {
                line.forEach((obj: any) => {
                    info += new TerminalSpecialRender(obj, 'text').render();
                });
                info += TerminalSpecialRender.renderShowInfo({});
            });
        }
        info += '</p>';
        if (!JSON.parse(element.getAttribute('data-showing')!)) {
            const placeholderRef = element.getAttribute('data-ref') ? element.getAttribute('data-ref') : '';
            let showInfoElement = placeholderRef ? document.getElementById(placeholderRef) : element.nextElementSibling;
            while (showInfoElement && !showInfoElement.className.includes('terminal-more-info')) {
                showInfoElement = showInfoElement.nextElementSibling;
            }
            showInfoElement!.innerHTML = showInfoElement!.innerHTML + info;
            element.setAttribute('data-showing', 'true');
        } else {
            this.currentTerminal.getElementsByClassName(element.getAttribute('data-id')!)[0].remove();
            element.setAttribute('data-showing', 'false');
        }
    }

    private executeTerminalCommandAction(element: HTMLElement): void {
        const emailElement: HTMLElement | undefined = element.className.includes('terminal-email') ? element : undefined;
        const destinfoElement: HTMLElement | undefined = element.className.includes('terminal-destinfo') ? element : undefined;
        if (destinfoElement) {
            const data = JSON.parse(destinfoElement.getAttribute('data-value')!.toString().replace(/\'/g, '"'));

            this.router.navigate(["info/dest"], {
                queryParams: {
                    destinations: data.destinations,
                },
            });
        } else {
            this.executeTerminalCommand(JSON.parse(element.getAttribute('data-value')!.toString().replace(/\'/g, '"')), emailElement);
        }
    }

    private async executeBrandedFareAction(element: HTMLElement): Promise<any> {

        return new Promise<any>((resolve) => {
            this.authService.getUser().subscribe((user: User) => {
                if (!(user instanceof AuthenticatedUser)) return;

                const brandedFareCommand = JSON.parse(element.getAttribute('data-value')!.toString().replace(/\'/g, '"'));
                const postData = {
                    sessionId: user.id,
                    cmdObj: brandedFareCommand,
                };
                this.restService.post<any>(`${this.ENDPOINT}/TerminalCommand`, postData).subscribe({
                    next: (result: any) => {
                        resolve(result.message);
                    },
                    error: (err: Error) => {
                        // this.utilitiesService.showAlert(this.errorLabel, result.message)
                    }
                });
            });
        })

    }

    executeClickAction(element: HTMLElement): void {
        if (element.tagName === 'SPAN') {
            const elementClasses = element.className.split(' ');
            switch (elementClasses[0]) {
                case 'terminal-link':
                    this.executeTerminalCommand(element.getAttribute('data-value')!);
                    break;
                case 'terminal-submit':
                    this.executeSubmit(element);
                    break;
                case 'terminal-info':
                    this.executeMoreInfo(element);
                    break;
                case 'terminal-command':
                    this.executeTerminalCommandAction(element);
                    break;
            }
        }
    }

    async executeBranded(element: HTMLElement): Promise<any> {
        return (await this.executeBrandedFareAction(element));
    }

    executeSubmitAction(element: HTMLInputElement): void {
        if (element.className.includes('terminal-submit-input')) {
            const inputs: HTMLInputElement[] = [].slice.call(this.currentTerminal.getElementsByClassName('terminal-submit-input'));
            const fields: { name: string, value: any, size: number, selected: boolean }[] = [];
            inputs.map(input => {
                const inputSize = Number(input.size);
                let inputValue: string = input.value;
                inputValue = inputValue.length > 0 && inputValue.length < inputSize ? inputValue + ' '.repeat(inputSize - inputValue.length) : inputValue;
                fields.push({
                    name: input.name,
                    value: inputValue,
                    size: inputSize,
                    selected: input.isSameNode(element),
                });
            });
            this.executeTerminalCommand(fields);
        }
    }

    fixTerminalContent(id: string | null): void {
        if (id == null) return;
        const terminal = document.getElementById(id);
        if (terminal !== null) {
            const terminalContent = terminal.getElementsByClassName('terminal-content')[0];
            let content = terminalContent.innerHTML;
            if (content) {
                content = content.split('terminal-link').join('');
                content = content.split('terminal-submit-input').join('');
                content = content.split('terminal-branded-fare').join('');
                content = content.split('terminal-calendar').join('');
                content = content.split('terminal-email').join('');
                content = content.split('terminal-command').join('');
                content = content.split('terminal-submit').join('');
                terminalContent.innerHTML = content;
            }
        }
    }

    async requestFareQuote(command: object): Promise<any> {
        return new Promise<any>((resolve) => {
            this.authService.getUser().subscribe((user: User) => {
                if (!(user instanceof AuthenticatedUser)) return;

                const postData = {
                    sessionId: user.id,
                    cmdObj: command
                };
                this.restService.post(`${this.ENDPOINT}/TerminalCommand`, postData).subscribe({
                    next: (result: any) => resolve(result.message),
                    error: (err: any) => {
                        // this.utilitiesService.showAlert(this.errorLabel, result.message);
                    }
                })
            })
        });
    }
}
