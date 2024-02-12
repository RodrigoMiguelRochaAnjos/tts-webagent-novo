import { Component } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-password',
  templateUrl: './webagent-password.component.html',
  styleUrls: ['./webagent-password.component.scss']
})
export class WebagentPasswordComponent extends WebagentBaseComponent {
	show = false;

    toggleEye(): void {
        this.show = !this.show;
    }
}
