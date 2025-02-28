declare module "flowbite-datepicker/Datepicker" {
    export default class Datepicker {
        constructor(element: HTMLElement, options?: {
            autohide?: boolean;
            format?: string;
            minDate?: Date;
            maxDate?: Date;
            [key: string]: any;
        });
        setDate(date: string | Date | null): void;
        getDate(): Date | null;
        destroy(): void;
    }
}