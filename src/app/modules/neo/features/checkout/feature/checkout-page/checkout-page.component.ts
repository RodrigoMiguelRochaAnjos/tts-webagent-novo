import { Component } from '@angular/core';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent {

  InputType = InputType;
  
  patterns = patterns;

}
