import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fareServiceChargeable',
})
export class FareServiceChargeablePipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    let info = '';
    switch (value.chargeable) {
      case 'included':
        info = 'Included';
        break;
      case 'notoffered':
        info = 'Not Offered';
        break;
      case 'charged':
        if (value.priceRange) {
          info = 'From: ' + value.priceRange.start + value.priceRange.currency;
          if (value.priceRange.end) {
            info += ' To: ' + value.priceRange.end + value.priceRange.currency;
          }
        } else {
          info = 'Charged';
        }
        break;
    }
    return info;
  }
}
