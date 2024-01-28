import { TerminalSpecialRender } from "../utils/terminal-special-renderer.model";

export class TerminalContent {
    private terminalContent: string;
    private links;
    private inputs;
    private specialObjects;
    private specialObjectControlCharacter = '&#8203;';
    private inputMode: string;

    constructor(terminalMessage: any) {
        this.terminalContent = terminalMessage.text;
        this.links = terminalMessage.masks && terminalMessage.masks.links ? terminalMessage.masks.links : null;
        this.inputs = terminalMessage.masks && terminalMessage.masks.inputs ? terminalMessage.masks.inputs : null;
        this.specialObjects = terminalMessage.masks && terminalMessage.masks.special ? terminalMessage.masks.special : null;
        this.inputMode = 'text';
    }

    private renderSpaces(): void {
        this.terminalContent = this.terminalContent.replace(/ /g, '&nbsp;');
    }

    private getContentToBeReplaced(specialObject: any): string {
        return this.specialObjectControlCharacter + '&nbsp;'.repeat(specialObject.text.length - 1);
    }

    private renderShowInfo(): void {
        // convert new lines into divs to hold more information
        this.terminalContent = this.terminalContent.replace(/\n/g, '<div class="terminal-more-info"></div>');
    }

    private renderLinks(): void {
        if (this.links && this.links.attrList && this.links.attrList.length > 0) {
            this.links.attrList.forEach((linkObject: any) => {
                this.terminalContent = this.terminalContent.replace(
                    this.links.ctlChr,
                    '<span class="terminal-link" data-value="' + linkObject.value + '">' + linkObject.name + '</span>'
                );
            });
        }
    }

    private renderInputs(): void {
        if (this.inputs && this.inputs.attrList && this.inputs.attrList.length > 0) {
            this.inputs.attrList.forEach((inputObject: any) => {
                const inputValue = inputObject.value;
                const palceholderValue = '.'.repeat(inputObject.size);
                this.terminalContent = this.terminalContent.replace(
                    this.inputs.ctlChr,
                    '<input type="text" placeholder="' +
                    palceholderValue +
                    '" inputmode="' + this.inputMode + '" class="terminal-input terminal-submit-input" maxlength="' +
                    inputObject.size +
                    '" size="' +
                    inputObject.size +
                    '" value="' +
                    inputValue +
                    '" autocomplete="off" spellcheck="false" autocorrect="off" enterKeyHint="Go" name="' +
                    inputObject.name +
                    '"/>'
                );

                this.terminalContent = `<form>${this.terminalContent}</form>`;
            });
        } else if (this.inputs) {
            this.terminalContent = this.terminalContent.replace(
                this.inputs.ctlChr,
                '<input type="text" inputmode="' + this.inputMode + '" class="terminal-input terminal-submit-input" size="4" placeholder="...." ' +
                'autocomplete="off" spellcheck="false" autocorrect="off" maxlength="4"  enterKeyHint="Go" />'
            );

            this.terminalContent = `<form>${this.terminalContent}</form>`;

        }
    }

    private renderSpecialObjects(): void {
        if (this.specialObjects && this.specialObjects.attrList && this.specialObjects.attrList.length > 0) {
            // change control character
            // this way the replace method doesn't get confused with the dots that are not meant to be replaced
            this.terminalContent = this.terminalContent.replace(/\./g, this.specialObjectControlCharacter);
            this.specialObjects.attrList.forEach((specialObject: any) => {
                const specialObjectRender = new TerminalSpecialRender(specialObject, this.inputMode);
                this.terminalContent = this.terminalContent.replace(this.getContentToBeReplaced(specialObject), specialObjectRender.render());
            });
        }
    }

    render(): string {
        this.renderSpaces();
        this.renderShowInfo();
        this.renderLinks();
        this.renderInputs();
        this.renderSpecialObjects();
        return this.terminalContent;
    }
}
