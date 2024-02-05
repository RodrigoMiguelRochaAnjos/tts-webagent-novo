import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';

@Component({
    selector: 'app-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TerminalComponent implements OnInit {
    @Input() content!: SafeHtml;
    @Output() click = new EventEmitter<HTMLElement | HTMLInputElement>();
    @Output() submit = new EventEmitter<HTMLInputElement>();

    private portraitFontSize!: number;
    fontSize!: number;

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.authService.getUser().subscribe((user: User) => {
            this.portraitFontSize = user.settings.portraitFontSize;
            this.updateFontSize();
        });
    }
    private updateFontSize(): void {
        this.fontSize = this.portraitFontSize;
    }

    emitClickEvent(event: MouseEvent): void {
        this.click.emit(event.target as HTMLElement);
    }

    emitSubmitEvent(event: KeyboardEvent): void {
        if (event && event.key === 'Enter')
            this.submit.emit(event.target as HTMLInputElement);
    }

    onKeyUpEvent(event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        let maxLength: string | number | null = inputElement.getAttribute('maxlength');
        maxLength = maxLength ? + maxLength : null;
        if (maxLength && value.length > maxLength) {
            inputElement.value = value.substring(0, maxLength);
        }
    }

    private calcGestureDistance(touches: any): number {
        const zw = touches[0].pageX - touches[1].pageX, zh = touches[0].pageY - touches[1].pageY;
        return Math.sqrt(zw * zw + zh * zh);
    }

    private applyZoom(scale: number): void {
        // smooth zoom to 5%
        const smoothedScale = scale < 1 ? 0.95 : 1.05;
        // zoom updates the font size
        // the font size limitations are the same as the settings
        this.fontSize = Math.max(0.5, Math.min(this.fontSize * smoothedScale, 2.5));
    }
}
