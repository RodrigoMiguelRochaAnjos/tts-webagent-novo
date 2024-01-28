export class Menu {
    private lastTranslatonValue: number = 0;
    private readonly minOpenCloseSize: number = 50;

    size: number;
    side: 'right';
    element: HTMLElement;
    opened: boolean;

    constructor(element: HTMLElement, size: number, side: 'right') {
        this.element = element;
        this.size = size;
        this.side = side;
        this.opened = false;
        this.initialize();
    }

    private initialize(): void {
        this.element.style.display = 'block';
        this.element.style.position = 'fixed';
        this.element.style.width = this.size + 'px';
        this.element.style.height = '100%';
        this.element.style.zIndex = '1000';
        this.element.style.top = '0';
        this.element.style.right = this.side === 'right' ? this.size * -1 + 'px' : 'auto';
    }

    open(): void {
        this.element.style.transition = 'transform 0.3s ease-out';
        const translatioValue = this.size * -1;
        this.element.style.transform = 'translateX(' + translatioValue + 'px)';
        this.opened = true;
        this.lastTranslatonValue = translatioValue;
    }

    close(): void {
        this.element.style.transition = 'transform 0.3s ease-out';
        this.element.style.transform = 'translateX(0px)';
        this.opened = false;
        this.lastTranslatonValue = 0;
    }
}
