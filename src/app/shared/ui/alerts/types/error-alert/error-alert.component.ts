import { Component } from '@angular/core';
import { Alert } from '../../alert.interface';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.scss']
})
export class ErrorAlertComponent extends Alert{
    constructor() {
        super('ERROR');
    }
}
