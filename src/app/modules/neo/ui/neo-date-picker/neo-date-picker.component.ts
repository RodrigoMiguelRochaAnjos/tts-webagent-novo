import { Component } from '@angular/core';

interface CalendarDay {
    date: Date;
    month: number;
}

@Component({
    selector: 'neo-date-picker',
    templateUrl: './neo-date-picker.component.html',
    styleUrls: ['./neo-date-picker.component.scss']
})
export class NeoDatePickerComponent {
    startDate!: string | null;
    endDate!: string | null;
    isPickerOpen = false;
    currentMonth: Date;
    days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weeks: CalendarDay[][] = [];

    constructor() {
        this.currentMonth = new Date();
        this.generateCalendar();
    }

    openPicker(type: 'start' | 'end') {
        this.isPickerOpen = true;
        if (type === 'start') {
            this.startDate = null;
        } else {
            this.endDate = null;
        }
    }

    generateCalendar() {
        const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

        const weeks: CalendarDay[][] = [];
        let currentWeek: CalendarDay[] = [];
        let currentDate = new Date(firstDayOfMonth);

        while (currentDate <= lastDayOfMonth) {
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            currentWeek.push({ date: new Date(currentDate), month: currentDate.getMonth() });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        this.weeks = weeks;
    }

    selectDate(day: CalendarDay) {
        if (!this.startDate || this.endDate) {
            this.startDate = day.date.toLocaleDateString();
            this.endDate = null;
        } else {
            this.endDate = day.date.toLocaleDateString();
            this.isPickerOpen = false;
        }
    }

    isDateSelected(date: Date): boolean {
        if (!this.startDate && this.endDate) return this.endDate === date.toLocaleDateString();
        if (this.startDate && !this.endDate) return this.startDate === date.toLocaleDateString();
        
        return false;
    }

    inBetween(date: Date): boolean {
        if (!this.startDate) return false;
        if (this.endDate) return date.toLocaleDateString() < this.endDate && date.toLocaleDateString() > this.startDate;

        return false;
    }

    nextMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        this.generateCalendar();
    }

    previousMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.generateCalendar();
    }
}
