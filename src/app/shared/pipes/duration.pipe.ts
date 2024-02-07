import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration',
})
export class DurationPipe implements PipeTransform {
    transform(value: number, ...args: any[]): string {
        let duration: string = '';

        const hours: number = Math.floor(value / 60);
        duration += ('00' + hours).slice(-2) + 'h';

        const minutes: number = Math.floor(value % 60);

        duration += ('00' + minutes).slice(-2) + 'm';

        return duration;
    }
}
