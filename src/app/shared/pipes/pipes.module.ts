import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationPipe } from './duration.pipe';
import { SortPipe } from './sort.pipe';

@NgModule({
    declarations: [DurationPipe, SortPipe],
    imports: [CommonModule],
    exports: [DurationPipe, SortPipe],
})
export class PipesModule {
}
