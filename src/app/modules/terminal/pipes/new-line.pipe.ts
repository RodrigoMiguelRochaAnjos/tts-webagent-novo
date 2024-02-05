import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newLine',
})
export class NewLinePipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    return value.replace(/\n/g, '<br>');
  }
}
