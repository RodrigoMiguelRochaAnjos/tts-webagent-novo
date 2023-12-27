import { Component, Input } from '@angular/core';

@Component({
  selector: 'news-template',
  templateUrl: './news-template.component.html',
  styleUrls: ['./news-template.component.scss']
})
export class NewsTemplateComponent {
    @Input() title!: string;
    @Input() text!: string;
}
