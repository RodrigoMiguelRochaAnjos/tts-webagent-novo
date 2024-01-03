import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-webagent-text-date-input',
  templateUrl: './webagent-text-date-input.component.html',
  styleUrls: ['./webagent-text-date-input.component.scss']
})
export class WebagentTextDateInputComponent {
  @ViewChild('dateInput') dateInput: ElementRef | undefined;

  constructor() { }

  onDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '');

    if (val.length > 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }

    if (val.length > 7) {
      val = val.slice(0, 7);
    }

    const month = val.slice(0, 2);
    const year = val.slice(3, 7);

    const monthNumber = parseInt(month, 10);
    if (monthNumber < 1 || monthNumber > 12) {
      val = val.slice(0, 1);
    }

    input.value = val;
  }

}
