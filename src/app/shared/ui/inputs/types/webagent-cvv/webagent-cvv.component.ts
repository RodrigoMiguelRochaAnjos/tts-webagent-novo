import { Component } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-webagent-cvv',
  templateUrl: './webagent-cvv.component.html',
  styleUrls: ['./webagent-cvv.component.scss']
})
export class WebagentCvvComponent extends WebagentBaseComponent{
  cvvForm: FormGroup; 

  constructor(private formBuilder: FormBuilder) {
    super();

    this.cvvForm = this.formBuilder.group({
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,5}$/)]]

    });
  }

  ngOnInit() {

  }

  get isValidCvv(): boolean {
    return this.cvvForm.get('cvv')?.valid || false;
  }
}