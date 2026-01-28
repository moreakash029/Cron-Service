import moment from 'moment-timezone';

export class DateTimeUtils {

    private static get appTimezone(): string {
        return process.env.APP_TIMEZONE || 'UTC';
    }

    /**
     * Get current time as a moment object in the application timezone
     */
    static now(): moment.Moment {
        return moment().tz(this.appTimezone);
    }

    /**
     * Convert input to a moment object in the application timezone
     * @param date Date string, Date object, or moment object
     */
    static toDate(date?: string | Date | moment.Moment): moment.Moment {
        return moment(date).tz(this.appTimezone);
    }

    /**
     * Get current date string formatted
     * @param format Optional format string (default: YYYY-MM-DD HH:mm:ss)
     */
    static nowFormatted(format = 'YYYY-MM-DD HH:mm:ss'): string {
        return this.now().format(format);
    }

    /**
     * Format a given date
     * @param date Date to format
     * @param format Format string
     */
    static format(date: string | Date | moment.Moment, format = 'YYYY-MM-DD HH:mm:ss'): string {
        return this.toDate(date).format(format);
    }

    /**
     * Compare if date1 is same as date2
     */
    static isSameDay(date1: string | Date | moment.Moment, date2: string | Date | moment.Moment, granularity?: moment.unitOfTime.StartOf): boolean {
        return this.toDate(date1).isSame(this.toDate(date2), granularity);
    }

    /**
     * Compare if date1 is after date2
     */
    static isAfter(date1: string | Date | moment.Moment, date2: string | Date | moment.Moment): boolean {
        return this.toDate(date1).isAfter(this.toDate(date2));
    }

    /**
     * Compare if date1 is before date2
     */
    static isBefore(date1: string | Date | moment.Moment, date2: string | Date | moment.Moment): boolean {
        return this.toDate(date1).isBefore(this.toDate(date2));
    }

    /**
     * Get start of unit (day, month, year, week, etc.)
     * @param date Date to start from (default: now)
     * @param unit Unit of time
     */
    static startOf(unit: moment.unitOfTime.StartOf, date?: string | Date | moment.Moment): moment.Moment {
        return this.toDate(date || this.now()).startOf(unit);
    }

    /**
     * Get end of unit (day, month, year, week, etc.)
     * @param date Date to end from (default: now)
     * @param unit Unit of time
     */
    static endOf(unit: moment.unitOfTime.StartOf, date?: string | Date | moment.Moment): moment.Moment {
        return this.toDate(date || this.now()).endOf(unit);
    }

    // --- Convenience Methods ---

    static startOfDay(date?: string | Date | moment.Moment): moment.Moment {
        return this.startOf('day', date);
    }

    static endOfDay(date?: string | Date | moment.Moment): moment.Moment {
        return this.endOf('day', date);
    }

    static startOfWeek(date?: string | Date | moment.Moment): moment.Moment {
        return this.startOf('week', date);
    }

    static endOfWeek(date?: string | Date | moment.Moment): moment.Moment {
        return this.endOf('week', date);
    }

    static startOfMonth(date?: string | Date | moment.Moment): moment.Moment {
        return this.startOf('month', date);
    }

    static endOfMonth(date?: string | Date | moment.Moment): moment.Moment {
        return this.endOf('month', date);
    }

    /**
     * Get start of next day
     */
    static startOfNextDay(date?: string | Date | moment.Moment): moment.Moment {
        return this.toDate(date || this.now()).add(1, 'day').startOf('day');
    }

    /**
     * Add time to date
     */
    static add(amount: number, unit: moment.unitOfTime.DurationConstructor, date?: string | Date | moment.Moment): moment.Moment {
        return this.toDate(date || this.now()).add(amount, unit);
    }

    /**
     * Subtract time from date
     */
    static subtract(amount: number, unit: moment.unitOfTime.DurationConstructor, date?: string | Date | moment.Moment): moment.Moment {
        return this.toDate(date || this.now()).subtract(amount, unit);
    }

    /**
     * Get difference between two dates
     */
    static diff(date1: string | Date | moment.Moment, date2: string | Date | moment.Moment, unit: moment.unitOfTime.Diff = 'milliseconds', precise = false): number {
        return this.toDate(date1).diff(this.toDate(date2), unit, precise);
    }

    /**
     * Get specific component (day, month, year)
     */
    static get(unit: moment.unitOfTime.All, date?: string | Date | moment.Moment): number {
        return this.toDate(date || this.now()).get(unit);
    }
}
