import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fare-info',
  templateUrl: './fare-info.page.html',
  styleUrls: ['./fare-info.page.scss'],
})
export class FareInfoPage implements OnInit {
  @Input() fare: any;
  showingMoreInfoItems!: any[];
	@Output() exitFareInfo = new EventEmitter<string>();

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.showingMoreInfoItems = new Array(this.fare.fareInfo.services.length + 1);
  }

  onCloseClick(): void {
    this.exitFareInfo.emit();
  }

  getDetailIcon(index: number): string {
    return this.showingMoreInfoItems[index] ? 'chevron-up' : 'chevron-down';
  }

  toggleShowMoreInfo(index: number): void {
    this.showingMoreInfoItems[index] = this.showingMoreInfoItems[index] == null ? true : !this.showingMoreInfoItems[index];
  }

  getLineType(index: number): string {
    return this.showingMoreInfoItems[index] ? 'none' : 'full';
  }
}
