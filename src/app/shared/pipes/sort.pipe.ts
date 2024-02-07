import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort'
})
export class SortPipe implements PipeTransform {

    transform(options: any[], label: string): any[] {
        if (options.length === 0) return [];
        if (isNaN(options[0][label])) return options.sort((a, b) => a[label].localeCompare(b[label]));

        return options.sort((a, b) => a[label] - b[label]);
    }

}