import { Component } from '@angular/core';
import { Alert } from '../../alert.interface';

@Component({
  selector: 'app-warning-alert',
  templateUrl: './warning-alert.component.html',
  styleUrls: ['./warning-alert.component.scss']
})
export class WarningAlertComponent extends Alert{
    constructor() {
        super('WARNING');
    }
}
