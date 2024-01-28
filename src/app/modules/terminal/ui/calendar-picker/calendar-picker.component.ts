import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-calendar-picker',
  templateUrl: './calendar-picker.component.html',
  styleUrls: ['./calendar-picker.component.scss'],
})

export class CalendarPickerComponent implements OnInit{
  @Output() submitEvent = new EventEmitter<Date>();
  @Input() selected!: Date | null;
  
  constructor() { }
  
  ngOnInit() {}

  onDatePick(): void {
    if(this.selected == null) return;
    this.submitEvent.emit(this.selected);
  }

}
