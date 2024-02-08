import { Component } from '@angular/core';
import { InputType } from '../../input-type.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ModalControllerService } from 'src/app/core/services/modal-controller.service';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-calendar-input',
  templateUrl: './webagent-calendar-input.component.html',
  styleUrls: ['./webagent-calendar-input.component.scss']
})
export class WebagentCalendarInputComponent extends WebagentBaseComponent{
    InputType = InputType;
    readonly DATE_PATTERN: RegExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    public date: moment.Moment = moment();
    public daysArray!: moment.Moment[];
    calendarOpen: boolean = false;
    dateForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private modalService: ModalControllerService
    ) {
        super();
        this.initDateForm();
    }

    ngOnInit(): void {
        this.daysArray = this.createCalendar(this.date);

    }

    private initDateForm(): FormGroup {
        return this.dateForm = this.formBuilder.group({
            selectedDate: [null, Validators.required],
        })
    }

    public selectDate(day: moment.Moment) {
        if (!day || this.withinBounds(day)) return;

        let dayFormatted = day.format('DD/MM/YYYY');

        this.dateForm.setValue({ selectedDate: dayFormatted });

        this.calendarOpen = false;

        this.value = day;
        this.update();
    }

    public createCalendar(month: moment.Moment): moment.Moment[] {
        let firstDay = moment(month).startOf('M');
        let lastDay = moment(month).endOf('M');

        let days: any[] = Array.from({ length: month.daysInMonth() }).map(Number.call, Number).map((n: unknown) => moment(firstDay).add((n as number), 'd'));

        for (let n = 0; n < firstDay.weekday(); n++) {
            days.unshift(null);
        }

        for (let n = 6; n > lastDay.weekday(); n--) {
            days.push(null);
        }

        return days;
    }

    isSelected(day: moment.Moment): boolean {
        if (!day) return false;
        if (!this.dateForm.valid) return false;

        let selectDate: moment.Moment = moment(this.dateForm.get("selectedDate")?.value, 'DD/MM/YYYY')

        return day.isSame(selectDate);
    }

    openCalendar(): void {
        this.calendarOpen = true;
    }

    public todayCheck(day: moment.Moment): boolean {
        if (!day) return false;

        return moment().format('L') === day.format('L');
    }

    withinBounds(day: moment.Moment): boolean {
        let isWithinBounds: boolean = false;

        if (this.min) {
            const min: moment.Moment = moment(this.min, "DD/MM/YYYY");

            isWithinBounds = day.isSameOrBefore(min);
        }

        if (this.max) {
            const max: moment.Moment = moment(this.max, "DD/MM/YYYY");

            isWithinBounds = isWithinBounds || day.isSameOrAfter(max);
        }

        return isWithinBounds;
    }

    public nextMonth(): void {
        this.date.add(1, 'M');

        this.daysArray = this.createCalendar(this.date);
    }

    public previousMonth(): void {
        this.date.subtract(1, 'M');

        this.daysArray = this.createCalendar(this.date);

    }

    public getPreviousYears(): string[] {
        return Array.from({ length: 200 }, (_, index) => moment().add(100).subtract(index, 'years').format('YYYY'));
    }

    public changeYear(event: string): void {
        if (!this.isNumeric(event)) return;

        this.date = this.date.year(Number.parseInt(event))

        this.daysArray = this.createCalendar(this.date);

        this.modalService.hideModal('year-popup');
    }

    showYearPopup(modalContent: any, id: string): void {
        this.modalService.showModal(modalContent, id);
    }
}
