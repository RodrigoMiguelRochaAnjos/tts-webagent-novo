import { Component } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalControllerService } from 'src/app/core/services/modal-controller.service';
import { DateRange } from 'src/app/shared/models/date-range.model';

@Component({
  selector: 'app-webagent-date-filter',
  templateUrl: './webagent-date-filter.component.html',
  styleUrls: ['./webagent-date-filter.component.scss']
})
export class WebagentDateFilterComponent extends WebagentBaseComponent{
    readonly DATE_PATTERN: RegExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    public date: moment.Moment = moment();
    public daysArray!: moment.Moment[];
    calendarOpen: boolean = false;
    dateForm!: FormGroup;

    hoveredDate!: moment.Moment;

    constructor(
        private formBuilder: FormBuilder,
        private modalService: ModalControllerService
    ) {
        super();
        this.initDateForm();
    }

    ngOnInit(): void {
        if (this.value != '' && !(this.value instanceof DateRange)) throw new Error("Value should be of type DateRange");

        if (this.min && !this.DATE_PATTERN.test(String(this.min))) throw new Error('Invalid [min] format should be DD/MM/YYYY');
        if (this.max && !this.DATE_PATTERN.test(String(this.max))) throw new Error('Invalid [max] format should be DD/MM/YYYY');

        if (moment(this.max, "DD/MM/YYYY").isBefore(this.date)) {
            this.date = moment(this.max, "DD/MM/YYYY");
        } else if (moment(this.min, "DD/MM/YYYY").isAfter(this.date)) {
            this.date = moment(this.min, "DD/MM/YYYY");
        }


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

    public selectedDate(day: moment.Moment): void {
        if (!day || this.withinBounds(day)) return;

        let dayFormatted = day.format('DD/MM/YYYY');

        if (this.dateForm.valid) {
            this.dateForm.setValue({ dateFrom: '', dateTo: '' });
        }

        if (!this.dateForm.get('dateFrom')?.value) {
            this.dateForm.get('dateFrom')?.patchValue(dayFormatted);
            return;
        }

        this.dateForm.get('dateTo')?.patchValue(dayFormatted);

        let dateFrom = moment(this.dateForm.value.dateFrom, 'DD/MM/YYYY');
        let dateTo = moment(this.dateForm.value.dateTo, 'DD/MM/YYYY');

        if (dateTo.isBefore(dateFrom)) {
            this.dateForm.setValue({ dateFrom: '', dateTo: '' });
            return;
        }

        this.value = new DateRange();

        this.value.dateFrom = dateFrom;
        this.value.dateTo = dateTo;

        this.update();

        this.calendarOpen = false;

    }

    public isHovered(day: moment.Moment): boolean {
        if (!day) return false;
        if (!this.hoveredDate) return false;

        let dateFrom = moment(this.dateForm.value.dateFrom, 'DD/MM/YYYY');

        if (this.dateForm.valid) return false;

        if (this.dateForm.get('dateFrom')?.valid) {
            return dateFrom.isBefore(day) && this.hoveredDate.isSameOrAfter(day);
        }

        return false;
    }
}
