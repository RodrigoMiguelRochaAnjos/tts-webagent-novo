import { AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import * as moment from 'moment';
import { InputType } from '../../input-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { ModalControllerService } from 'src/app/core/services/modal-controller.service';
import { deepClone } from 'src/app/core/utils/deep-clone.tool';

@Component({
    selector: 'app-webagent-date-range',
    templateUrl: './webagent-date-range.component.html',
    styleUrls: ['./webagent-date-range.component.scss']
})
export class WebagentDateRangeComponent extends WebagentBaseComponent implements OnInit {
    @ViewChild("calendar") calendar!: ElementRef;
    readonly DATE_PATTERN: RegExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    public date: moment.Moment = moment();
    public dateNext: moment.Moment = moment().add(1, 'M');

    public daysArray!: moment.Moment[];
    public daysNextArray!: moment.Moment[];

    InputType = InputType;

    dateForm!: FormGroup;

    hoveredDate!: moment.Moment;

    calendarOpen: boolean = false;


    @HostBinding("class.align-left")
    alignLeft: boolean = false;

    @HostBinding("class.align-top")
    alignTop: boolean = false;

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
            this.dateNext = moment(this.max, "DD/MM/YYYY").add(1, 'M');
        } else if (moment(this.min, "DD/MM/YYYY").isAfter(this.date)) {
            this.date = moment(this.min, "DD/MM/YYYY");
            this.dateNext = moment(this.min, "DD/MM/YYYY").add(1, 'M');
        }


        this.daysArray = this.createCalendar(this.date);
        this.daysNextArray = this.createCalendar(this.dateNext);

    }

    public initDateForm(): FormGroup {
        return this.dateForm = this.formBuilder.group({
            dateFrom: [this.value?.dateFrom ? this.value?.dateFrom : null, Validators.required],
            dateTo: [this.value?.dateTo ? this.value?.dateTo : null, Validators.required]
        })
    }

    public todayCheck(day: moment.Moment): boolean {
        if (!day) return false;

        return moment().format('L') === day.format('L');
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

    public nextMonth(): void {
        this.date.add(1, 'M');
        this.dateNext.add(1, 'M');

        this.daysArray = this.createCalendar(this.date);
        this.daysNextArray = this.createCalendar(this.dateNext);
    }

    public previousMonth(): void {
        this.date.subtract(1, 'M');
        this.dateNext.subtract(1, 'M');

        this.daysArray = this.createCalendar(this.date);
        this.daysNextArray = this.createCalendar(this.dateNext);

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

    public isSelected(day: moment.Moment): boolean {
        if (!day) return false;

        let dateFrom = moment(this.dateForm.value.dateFrom, 'DD/MM/YYYY');
        let dateTo = moment(this.dateForm.value.dateTo, 'DD/MM/YYYY');

        if (this.dateForm.valid) return dateFrom.isSameOrBefore(day) && dateTo.isSameOrAfter(day);

        if (this.dateForm.get('dateFrom')?.valid) {
            return dateFrom.isSame(day);
        }

        return false;
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

    public openCalendar(): void {
        this.calendarOpen = true;

        this.detectInterception();

    }

    public detectInterception(): void {

        const observer = new IntersectionObserver(entries => this.handleIntersection(entries), {
            threshold: .5,
            root: document.body,
            rootMargin: '0px'
        });

        observer.observe(this.calendar.nativeElement);
    }

    private handleIntersection(entries: IntersectionObserverEntry[]): void {
        entries.forEach(entry => {
            if ((entry.boundingClientRect.x + entry.boundingClientRect.width) > entry.rootBounds!.right) this.alignLeft = true;

            if ((entry.boundingClientRect.y + entry.boundingClientRect.height) > entry.rootBounds!.bottom) this.alignTop = true;
        });
    }

    public getPreviousYears(): string[] {
        return Array.from({ length: 200 }, (_, index) => moment().add(100).subtract(index, 'years').format('YYYY'));
    }

    public changeYear(event: string): void {
        if (!this.isNumeric(event)) return;

        this.date = this.date.year(Number.parseInt(event))

        this.daysArray = this.createCalendar(this.date);

        this.dateNext = this.dateNext.year(Number.parseInt(event));

        this.daysNextArray = this.createCalendar(this.dateNext);

        this.modalService.hideModal('year-popup');
    }

    showYearPopup(modalContent: any, id: string): void {
        this.modalService.showModal(modalContent, id);
    }

    get fromDate(): string {
        if (!this.value?.dateFrom?.isValid() || this.value?.dateFrom == null) return ''

        return this.value?.dateFrom.format('DD/MM/YYYY');
    }

    get toDate(): string {
        if (!this.value?.dateTo?.isValid() || this.value?.dateTo == null) return '';
        return this.value?.dateTo.format('DD/MM/YYYY');
    }
}
