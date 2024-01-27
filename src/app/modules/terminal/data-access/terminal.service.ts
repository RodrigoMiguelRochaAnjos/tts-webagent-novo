import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TerminalService {
    private updateCommand!: object;
    private lastExecutedCommand!: object | string;
    private dateElement!: HTMLElement;
    private expiredSessionMessage!: string;
    private errorLabel!: string;
    private showMoreContentMessage!: string;
    private noPluginAvailableMessage!: string;

    constructor(
        private appStateService: AppStateService,
        private restService: RestService,
        private utilitiesService: UtilitiesService,
        private authService: AuthService,
        private settingsService: SettingsService,
        private router: Router,
        private menuService: MenuService,
        private translate: TranslateService
    ) {
        translate.stream('EXPIRED_SESSION_MESSAGE').subscribe((text: string) => { this.expiredSessionMessage = text });
        translate.stream('ERROR').subscribe((text: string) => { this.errorLabel = text });
        translate.stream('SHOW_MORE_CONTENT_MESSAGE').subscribe((text: string) => { this.showMoreContentMessage = text });
        translate.stream('NO_PLUGIN_SUPPORT_MESSAGE').subscribe((text: string) => { this.noPluginAvailableMessage = text });
    }

    private processFilters(filtersData): void {
        if (filtersData && filtersData.filters.length > 0) {
            this.appStateService.filtersSource.next(filtersData.filters);
            this.appStateService.lastExecutedCommandType = filtersData.type;
        } else {
            this.appStateService.filtersSource.next([]);
        }
    }

    private processMoveUpAndDown(moveDown: boolean): void {
        if (this.lastExecutedCommand === 'MD') {
            this.appStateService.mdLevel += 1;
        } else if (this.lastExecutedCommand === 'MU' && this.appStateService.mdLevel > 0) {
            this.appStateService.mdLevel -= 1;
        } else {
            this.appStateService.mdLevel = 0;
        }
        this.appStateService.showMoveUpBtnSource.next(this.appStateService.mdLevel > 0);
        this.appStateService.showMoveDownBtnSource.next(moveDown ? moveDown : false);
    }

    private processCommandResult(serverData): void {
        const terminalContent = new TerminalContent(serverData, this.appStateService.devicePlatform);
        const terminalContentRedered = terminalContent.render();
        this.appStateService.terminalContentSource.next(terminalContentRedered);
        this.executeUpdateCommand(terminalContentRedered);
    }

    private addCommandToHistory(command: string): void {
        const commands = this.appStateService.commandsHistorySource.getValue();
        if (command !== commands[commands.length - 1]) {
            commands.push(command);
            if (commands.length > maxCommandsInHistory) {
                commands.shift();
            }
            this.appStateService.commandsHistorySource.next(commands);
            localStorage.setItem(localStorageKeys.commands, JSON.stringify(commands));
        }
    }

    private processCommandErrors(serverData): void {
        if (serverData.message.text && serverData.message.text.includes('Session does not exist')) {
            this.utilitiesService.showAlert(this.errorLabel, this.expiredSessionMessage);
            this.authService.logout(false);
        } else if (serverData.msgAlert) {
            this.utilitiesService.showPopupFromServer(serverData.msgObj);
        } else {
            this.utilitiesService.showAlert(this.errorLabel, serverData.message.text);
        }
    }

    private executeUpdateCommand(terminalContent: string): void {
        if (this.updateCommand && terminalContent.includes('terminal-update')) {
            const postData = {
                sessionId: this.appStateService.sessionId,
                cmdObj: this.updateCommand,
            };
            this.restService.post(commandEndpoint, postData, false).then((result) => {
                if (result.success) {
                    if (result.data.success) {
                        const newElementsData = result.data.message as [];
                        const elementsToReplace = [].slice.call(this.currentTerminal.getElementsByClassName('terminal-update'));
                        newElementsData.forEach((newElementData: any) => {
                            const elementToReplace = elementsToReplace[newElementData.i] as HTMLElement;
                            const newElement = TerminalSpecialRender.renderSpecialBrandedFareElement(elementToReplace, newElementData);
                            elementToReplace.parentNode.replaceChild(newElement, elementToReplace);
                        });
                    } else {
                        this.processCommandErrors(result.data);
                    }
                } else {
                    this.utilitiesService.showAlert(this.errorLabel, result.message);
                }
            });
        }
    }

    private processEmailData(emailElement: HTMLElement, emailInfo): void {
        if (emailInfo && emailElement) {
            const settings = this.appStateService.settingsSource.getValue();
            if (emailElement.className.includes('terminal-email-selected')) {
                const indexToRemove = settings.sendByEMailItems.findIndex((item) => JSON.stringify(item) === JSON.stringify(emailInfo));
                pullAt(settings.sendByEMailItems, indexToRemove);
            } else {
                const index = settings.sendByEMailItems.findIndex((item) => JSON.stringify(item) === JSON.stringify(emailInfo));
                if (index < 0) {
                    settings.sendByEMailItems.push(emailInfo);
                }
            }
            this.settingsService.update(settings, false);
            emailElement.classList.toggle('terminal-email-selected');
        }
    }

    processTerminalCommand(result: Result, emailElement?: HTMLElement): void {
        if (result.data.success) {
            if (result.data.message) {
                this.updateCommand = result.data.message.updateCmd ? result.data.message.updateCmd : null;
                this.processCommandResult(result.data.message);
                this.processFilters(result.data.message.filters);
            }
            this.processMoveUpAndDown(result.data.enablePageDown);
            this.processEmailData(emailElement, result.data.emailInfo);
        } else {
            this.processCommandErrors(result.data);
        }
    }

    executeTerminalCommand(command: any, emailElement?: HTMLElement, history?: boolean): void {
        if (command === 'SOF') {
            this.authService.logout(true);
        } else {
            this.utilitiesService.showLoading();
            const isCommandAString = typeof command === 'string';
            const isCommandAArray = Array.isArray(command);
            const postData = {};
            postData['sessionId'] = this.appStateService.sessionId;
            if (isCommandAString) {
                postData['allowEnhanced'] = this.appStateService.settingsSource.getValue().enhancedResults;
                postData['command'] = command;
            } else if (isCommandAArray) {
                postData['commandFields'] = command;
            } else {
                postData['cmdObj'] = command;
            }
            this.restService.post(commandEndpoint, postData, false).then((result) => {
                if (result.success) {
                    this.lastExecutedCommand = command;
                    if (isCommandAString) {
                        this.addCommandToHistory(command as string);
                    }
                    this.processTerminalCommand(result, emailElement);
                    this.utilitiesService.dismissLoading();
                    setTimeout(() => {
                        const commandInput = document.getElementById('terminal-command-input').childNodes[0] as HTMLInputElement;
                        commandInput.focus();
                    }, 300);
                    if (history)
                        this.menuService.toggleMenu('right');

                } else {
                    this.utilitiesService.dismissLoading();
                    this.utilitiesService.showAlert(this.errorLabel, result.message);
                }
            }).catch((err) => {
                this.utilitiesService.dismissLoading();
                this.utilitiesService.showAlert(this.errorLabel, err);

            });

        }
    }

    private get currentTerminal() {
        return document.getElementById('terminal' + (this.appStateService.secondTerminalSelectedSource.getValue() ? 2 : 1));
    }

    private executeSubmit(element: HTMLElement) {
        const terminalBundleElements = this.currentTerminal.getElementsByClassName('bundle-' + element.getAttribute('data-bundle'));
        let command = element.getAttribute('data-value');
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
            + currentDateText.slice(5, 7)), months.indexOf(currentDateText.slice(2, 5)),
            Number(currentDateText.slice(0, 2)));
    }

    submitCalendar(date: Date): void {
        this.dateElement.innerText = ('0' + date.getDate()).slice(-2) +
            months[date.getMonth()] + date.getFullYear().toString().substring(2, 4);
        if (!TerminalService.checkNowDate())
            TerminalService.fixDateNow(document.getElementsByClassName('terminal-calendar')[0]);
        if (document.getElementsByClassName('terminal-calendar')[1] !== undefined && !TerminalService.checkDates())
            TerminalService.fixDates(document.getElementsByClassName('terminal-calendar')[0],
                document.getElementsByClassName('terminal-calendar')[1]);
    }

    private static checkNowDate(): boolean {
        const date_element1 = document.getElementsByClassName('terminal-calendar')[0].innerHTML;
        return new Date(Number(new Date().getFullYear().toString().slice(0, 2) + date_element1.slice(5, 7)),
            months.indexOf(date_element1.slice(2, 5)), Number(date_element1.slice(0, 2))) > new Date();
    }

    private static fixDateNow(element: Element): void {
        const dateNow = new Date();
        element.innerHTML = ('0' + dateNow.getDate()).slice(-2) +
            months[dateNow.getMonth()] + dateNow.getFullYear().toString().substring(2, 4);
    }

    private static checkDates(): boolean {
        const date_element1 = document.getElementsByClassName('terminal-calendar')[0].innerHTML;
        const date_element2 = document.getElementsByClassName('terminal-calendar')[1].innerHTML;
        return new Date(Number(new Date().getFullYear().toString().slice(0, 2) + date_element1.slice(5, 7)),
            months.indexOf(date_element1.slice(2, 5)), Number(date_element1.slice(0, 2)))
            < new Date(Number(new Date().getFullYear().toString().slice(0, 2) + date_element2.slice(5, 7)),
                months.indexOf(date_element2.slice(2, 5)), Number(date_element2.slice(0, 2)));
    }

    private static fixDates(element1: Element, element2: Element): void {
        const date = new Date(Number(new Date().getFullYear().toString().slice(0, 2) + element1.innerHTML.slice(5, 7)),
            months.indexOf(element1.innerHTML.slice(2, 5)), Number(element1.innerHTML.slice(0, 2)));
        element2.innerHTML = ('0' + date.getDate()).slice(-2) +
            months[date.getMonth()] + date.getFullYear().toString().substring(2, 4);
    }

    private executeMoreInfo(element: HTMLElement): void {
        const objs = element.getAttribute('data-objs') ? JSON.parse(element.getAttribute('data-objs').replace(/'/g, '"')) : false;
        let info = '<p class="' + element.getAttribute('data-id') + '">';
        if (!objs) {
            info += element.getAttribute('data-value');
        } else {
            objs.forEach((line) => {
                line.forEach((obj) => {
                    info += new TerminalSpecialRender(obj, this.appStateService.devicePlatform === 'Android' ? 'email' : 'text').render();
                });
                info += TerminalSpecialRender.renderShowInfo({});
            });
        }
        info += '</p>';
        if (!JSON.parse(element.getAttribute('data-showing'))) {
            const placeholderRef = element.getAttribute('data-ref') ? element.getAttribute('data-ref') : '';
            let showInfoElement = placeholderRef ? document.getElementById(placeholderRef) : element.nextElementSibling;
            while (showInfoElement && !showInfoElement.className.includes('terminal-more-info')) {
                showInfoElement = showInfoElement.nextElementSibling;
            }
            showInfoElement.innerHTML = showInfoElement.innerHTML + info;
            element.setAttribute('data-showing', 'true');
        } else {
            this.currentTerminal.getElementsByClassName(element.getAttribute('data-id'))[0].remove();
            element.setAttribute('data-showing', 'false');
        }
    }

    private executeTerminalCommandAction(element: HTMLElement): void {
        const emailElement = element.className.includes('terminal-email') ? element : null;
        const destinfoElement = element.className.includes('terminal-destinfo') ? element : null;
        if (destinfoElement) {
            const data = JSON.parse(destinfoElement.getAttribute('data-value').toString().replace(/\'/g, '"'));
            this.router.navigate([destinationInformationPageLink], {
                queryParams: {
                    destinations: data.destinations,
                },
            });
        } else {
            this.executeTerminalCommand(JSON.parse(element.getAttribute('data-value').toString().replace(/\'/g, '"')), emailElement);
        }
    }

    private async executeBrandedFareAction(element: HTMLElement): Promise<Result> {
        const brandedFareCommand = JSON.parse(element.getAttribute('data-value').toString().replace(/\'/g, '"'));
        const postData = {
            sessionId: this.appStateService.sessionId,
            cmdObj: brandedFareCommand,
        };
        return new Promise<Result>((resolve) => {
            this.restService.post(commandEndpoint, postData, true).then((result) => {
                if (result.success)
                    resolve(new Result(true, '', result.data.message));
                else
                    this.utilitiesService.showAlert(this.errorLabel, result.message);
            });
        });
    }

    executeClickAction(element: HTMLElement): void {
        if (element.tagName === 'SPAN') {
            const elementClasses = element.className.split(' ');
            switch (elementClasses[0]) {
                case 'terminal-link':
                    this.executeTerminalCommand(element.getAttribute('data-value'));
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

    async executeBranded(element: HTMLElement): Promise<Result> {
        return (await this.executeBrandedFareAction(element)).data;
    }

    executeSubmitAction(element: HTMLInputElement): void {
        if (element.className.includes('terminal-submit-input')) {
            const inputs = [].slice.call(this.currentTerminal.getElementsByClassName('terminal-submit-input'));
            const fields = [];
            inputs.map(input => {
                const inputSize = Number(input.size);
                let inputValue: string = input.value;
                inputValue = inputValue.length > 0 && inputValue.length < inputSize ? inputValue + repeat(' ', inputSize - inputValue.length) : inputValue;
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

    fixTerminalContent(id: string): void {
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

    async requestFareQuote(command: object): Promise<Result> {
        const postData = { sessionId: this.appStateService.sessionId, cmdObj: command };
        return new Promise<Result>((resolve) => {
            this.restService.post(commandEndpoint, postData, true).then((result) => {
                if (result.success)
                    resolve(result.data.message);
                else {
                    this.utilitiesService.showAlert(this.errorLabel, result.message);
                }
            });
        });
    }
}
