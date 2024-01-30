export class TerminalSpecialRender {
    private specialObject;
    private inputMode: string;

    constructor(specialObject: any, inputMode: string) {
        this.specialObject = specialObject;
        this.inputMode = inputMode;
    }

    static renderShowInfo(specialObject: any): string {
        const id = specialObject.placeholderId != null ? 'id="placeholder' + specialObject.placeholderId + '"' : '';
        return '<div ' + id + ' class="terminal-more-info"></div>';
    }

    static renderSpecialBrandedFareElement(updateableElement: HTMLElement, newElementData: any): HTMLElement {
        const element = document.createElement('span');
        element.appendChild(document.createTextNode((updateableElement.textContent as string)));
        // tslint:disable-next-line: quotemark
        element.setAttribute('data-value', JSON.stringify(newElementData.c).replace(/"/g, "'"));
        element.setAttribute('class', 'terminal-branded-fare');
        return element;
    }

    private renderSpecialText(): string {
        return '<span class="terminal-text">' + this.specialObject.text + '</span>';
    }

    private renderSpecialInput(): string {
        return (
            '<input type="text" inputmode="' + this.inputMode + '" class="terminal-input bundle-' +
            this.specialObject.extended.bundle +
            ' terminal-input-green" data-prefix="' +
            this.specialObject.extended.prefix +
            '" data-suffix="' +
            this.specialObject.extended.suffix +
            '" size="3" value="' +
            this.specialObject.text +
            '" maxlength="3" autocorrect="off" autocomplete="off" spellcheck="false"/>'
        );
    }

    private renderSpecialCalendarInput(): string {
        return '<span class="terminal-calendar bundle-' + this.specialObject.extended.bundle + '">' + this.specialObject.text + '</span>';
    }

    private renderSpecialCommand(): string {
        let objectClass = ' ';
        if (this.specialObject.extended.class === 'terminal-destinfo') {
            objectClass += 'terminal-destinfo';
        } else if (this.specialObject.extended.class) {
            objectClass += 'terminal-email';
        } else {
            objectClass = '';
        }
        return (
            '<span class="terminal-command' +
            objectClass +
            '" data-value="' +
            // tslint:disable-next-line: quotemark
            JSON.stringify(this.specialObject.extended.cmd).replace(/"/g, "'") +
            '">' +
            this.specialObject.text +
            '</span>'
        );
    }

    private renderSpecialSubmit(): string {
        return (
            '<span class="terminal-submit" data-prefix="' +
            this.specialObject.extended.prefix +
            '" data-suffix="' +
            this.specialObject.extended.suffix +
            '" data-bundle="' +
            this.specialObject.extended.bundle +
            '" data-value="' +
            this.specialObject.extended.text +
            '">' +
            this.specialObject.text +
            '</span>'
        );
    }

    private renderSpecialBic(): string {
        let bicClass = 'bic-opened';
        switch (this.specialObject.extended.status) {
            case 'C' || 'X':
                bicClass = 'bic-closed';
                break;
            case 0:
                bicClass = 'bic-zero';
                break;
            case 'L' || 'R':
                bicClass = 'bic-restricted';
                break;
        }
        let element = '';
        if (bicClass !== 'bic-closed' && this.specialObject.extended.cmd) {
            element =
                '<span class="terminal-command ' +
                bicClass +
                '" data-value="' +
                // tslint:disable-next-line: quotemark
                JSON.stringify(this.specialObject.extended.cmd).replace(/"/g, "'") +
                '">' +
                this.specialObject.text +
                '</span>';
        } else {
            element = '<span class="' + bicClass + '">' + this.specialObject.text + '</span>';
        }
        return element;
    }

    private renderSpecialUpdateable(): string {
        return '<span class="terminal-update">' + this.specialObject.text + '</span>';
    }

    private renderSpecialBrandedFare(): string {
        return (
            '<span class="terminal-branded-fare" data-value="' +
            // tslint:disable-next-line: quotemark
            JSON.stringify(this.specialObject.extended.cmd).replace(/"/g, "'") +
            '">' +
            this.specialObject.text +
            '</span>'
        );
    }

    private renderSpecialInfo(): string {
        let moreInfoText = this.specialObject.extended.text ? this.specialObject.extended.text : '';
        if (moreInfoText) {
            moreInfoText = moreInfoText.replace(/ /g, '&nbsp;');
            moreInfoText = moreInfoText.replace(/\n/g, '<br>');
        }
        const moreInfoObjs = this.specialObject.extended.objs ? JSON.stringify(this.specialObject.extended.objs).replace(/"/g, "'") : '';
        const placeholderRef = this.specialObject.extended.placeholderRef ? 'placeholder' + this.specialObject.extended.placeholderRef : '';
        return (
            '<span class="terminal-info" data-ref="' +
            placeholderRef +
            '" data-objs="' +
            moreInfoObjs +
            '" data-value="' +
            moreInfoText +
            '" data-showing="false" data-id="' +
            Math.floor(Math.random() * 500) +
            Date.now() +
            '">' +
            this.specialObject.text +
            '</span>'
        );
    }

    render(): string {
        let renderedElement = '';
        this.specialObject.text = this.specialObject.text.replace(/ /g, '&nbsp;');
        this.specialObject.text = this.specialObject.text.replace(/\n/g, '<br>');
        if (this.specialObject.extended) {
            switch (this.specialObject.extended.type) {
                case 'input-text':
                    renderedElement = this.renderSpecialInput();
                    break;
                case 'calendar':
                    renderedElement = this.renderSpecialCalendarInput();
                    break;
                case 'cmd':
                    renderedElement = this.renderSpecialCommand();
                    break;
                case 'submit':
                    renderedElement = this.renderSpecialSubmit();
                    break;
                case 'bic':
                    renderedElement = this.renderSpecialBic();
                    break;
                case 'update':
                    renderedElement = this.renderSpecialUpdateable();
                    break;
                case 'updatecmd':
                    renderedElement = this.renderSpecialBrandedFare();
                    break;
                case 'info':
                    renderedElement = this.renderSpecialInfo();
                    break;
            }
        } else {
            if (this.specialObject.placeholderId != null) {
                renderedElement = TerminalSpecialRender.renderShowInfo(this.specialObject);
            } else {
                renderedElement = this.renderSpecialText();
            }
        }
        return renderedElement;
    }
}
