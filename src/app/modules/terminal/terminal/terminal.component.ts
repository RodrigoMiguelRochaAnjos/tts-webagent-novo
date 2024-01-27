import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TerminalComponent implements OnInit, OnDestroy {
  @Input() content: SafeHtml;
  @Output() click = new EventEmitter<HTMLElement | HTMLInputElement>();
  @Output() submit = new EventEmitter<HTMLInputElement>();

  private settingsSubscription: Subscription;

  private portraitFontSize: number;

  fontSize: number;

  private firstTouchDistance: number;

  constructor(
    private appStateService: AppStateService,
  ) {}

  ngOnInit(): void {
    this.settingsSubscription = this.appStateService.settings.subscribe((newSettings) => {
      this.portraitFontSize = newSettings.portraitFontSize;
      this.updateFontSize();
    });
  }
  private updateFontSize(): void {
    this.fontSize = this.portraitFontSize;
  }

  ngOnDestroy(): void {
    this.settingsSubscription.unsubscribe();
  }

  emitClickEvent(event): void {
    this.click.emit(event.target as HTMLElement);
  }

  emitSubmitEvent(event): void {
    if (event && event.key === 'Enter')
      this.submit.emit(event.target as HTMLInputElement);
  }

  onKeyUpEvent(event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    let maxLength: string | number = inputElement.getAttribute('maxlength');
    maxLength = maxLength ? +maxLength : null;
    if (maxLength && value.length > maxLength) {
      inputElement.value = value.substr(0, maxLength);
    }
  }

  private calcGestureDistance(touches): number {
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

  onGestureChange(event): void {
    if (this.appStateService.devicePlatform !== 'Android') {
      this.applyZoom(event.scale);
    }
  }

  onTouchStart(event): void {
    if (this.appStateService.devicePlatform === 'Android' && event.touches.length === 2) {
      this.firstTouchDistance = this.calcGestureDistance(event.touches);
    }
  }

  onTouchMove(event): void {
    if (this.appStateService.devicePlatform === 'Android' && event.touches.length === 2) {
      const distance = this.calcGestureDistance(event.touches);
      const ratio = distance / this.firstTouchDistance;
      this.applyZoom(ratio);
    }
  }
}
