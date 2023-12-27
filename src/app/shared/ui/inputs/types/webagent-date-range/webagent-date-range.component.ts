import { Component, OnInit } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import * as moment from 'moment';

@Component({
  selector: 'app-webagent-date-range',
  templateUrl: './webagent-date-range.component.html',
  styleUrls: ['./webagent-date-range.component.scss']
})
export class WebagentDateRangeComponent extends WebagentBaseComponent implements OnInit{
    public date: moment.Moment = moment();
    public daysArray!: moment.Moment[];
    
    constructor() {
        super();
    }

    ngOnInit(): void {
        this.daysArray = this.createCalendar(this.date);
    }

    public todayCheck(day: moment.Moment): boolean {
        if(!day) return false;

        return moment().format('L') === day.format('L');
    }

    public createCalendar(month: moment.Moment): moment.Moment[] {
        let firstDay = moment(month).startOf('M');
        let lastDay = moment(month).endOf('M');

        let days: any[] = Array.from({ length: month.daysInMonth() }).map(Number.call, Number).map((n: unknown) => moment(firstDay).add((n as number), 'd'));

        for(let n = 0; n < firstDay.weekday(); n++) {
            days.unshift(null);
        }

        console.log(lastDay.weekday());
        for(let n = 6; n> lastDay.weekday(); n--) {
            days.push(null);
        }

        return days;
    }

    public nextMonth(): void {
        this.date.add(1, 'M');

        this.daysArray = this.createCalendar(this.date);
    }

    public previousMonth(): void {
        this.date.subtract(1, 'M');

        this.daysArray = this.createCalendar(this.date);

    }
}
