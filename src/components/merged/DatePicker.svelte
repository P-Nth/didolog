<!--
    DatePicker Component

    This component provides a date and time selection feature, allowing users to:
    - Pick a date manually or from predefined options (Today, Tomorrow, Next Week, Next Month).
    - Select a time using the `TimePicker` component.
    - Automatically adjust the date based on time selection (e.g., if a selected time has passed, the date moves to the next day).
    - Dispatch an event with the selected date and time whenever either changes.
-->
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import FlatCalender from "../individual/FlatCalender.svelte";
    import TimePicker from "./TimePicker.svelte";

    /**
     * Props: The currently selected date and time as a tuple [date, time].
     */
    export let selectedDateTime: [string, string] = ["", ""];

    /** The currently selected date (YYYY-MM-DD) */
    let selectedDate: string = selectedDateTime[0];

    /** The currently selected time (HH:MM) */
    let selectedTime: string = selectedDateTime[1];

    /** Event dispatcher to notify parent components when selection changes */
    const dispatch = createEventDispatcher();

    /**
     * Formats a Date object to a string in YYYY-MM-DD format.
     * @param {Date} date - The date object to format.
     * @returns {string} - The formatted date string.
     */
    const formatDate = (date: Date): string => date.toISOString().split("T")[0];

    /**
     * Sets the selected date to today.
     */
    const selectToday = () => {
        selectedDate = formatDate(new Date());
    };

    /**
     * Sets the selected date to tomorrow.
     */
    const selectTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        selectedDate = formatDate(tomorrow);
    };

    /**
     * Sets the selected date to next Monday.
     */
    const selectNextWeek = () => {
        const today = new Date();
        const nextMonday = new Date();
        nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));
        selectedDate = formatDate(nextMonday);
    };

    /**
     * Sets the selected date to the same day next month.
     */
    const selectNextMonth = () => {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        selectedDate = formatDate(nextMonth);
    };

    /**
     * Reset both the selected date and time.
     *
     */
    const clearDate = () => {
        selectedTime = "";
    };

    /**
     * Handle when the user selects a date.
     * Handles selection of Date from the Datepicker component from flowbite.
     */
    const handleDateSelect = (event: CustomEvent) => {
        selectedDate = event.detail[1];
    }

    /**
     * Checks if the given time has already passed today.
     * @param {string} time - Time in "HH:MM" format.
     * @returns {boolean} - True if the time has passed today, otherwise false.
     */
    const hasTimePassedToday = (time: string): boolean => {
        const now = new Date();
        const [hour, minute] = time.split(":").map(Number);

        return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute);
    }

    /**
     * Handles selection of time from the TimePicker component.
     * If no date is manually selected, it sets the date to today or tomorrow based on the time.
     * @param {CustomEvent} event - The event object from the TimePicker.
     */
    const handleTimeSelect = (event: CustomEvent) => {
        selectedTime = event.detail;

        // If no manual date is selected, set date automatically
        if (!selectedDate) {
            if (hasTimePassedToday(selectedTime)) {
                selectTomorrow();
            } else {
                selectToday();
            }
        }
    };

    /**
     * Dispatches the selected date and time whenever either value changes.
     */
    $: dispatch("select", [selectedDate, selectedTime]);

</script>

<!--
    DatePicker Component

    This component provides a date and time selection feature, allowing users to:
    - Pick a date manually using an input field or choose from predefined options (Today, Tomorrow, Next Week, Next Month).
    - Select a time using the `TimePicker` component.
    - Automatically adjust the date based on time selection (e.g., if the selected time has already passed today, the date moves to tomorrow).
    - Clear both the date and time selection.
    - Dispatch an event with the selected date and time whenever either changes.
-->
<div class="flex flex-col gap-2">
    <!-- Predefined Buttons: Allow users to quickly select common date options -->
    <div class="flex flex-col gap-2">
        <!-- Selects today's date -->
        <button on:click={selectToday} class="px-3 py-1 border rounded hover:bg-gray-100">Today</button>

        <!-- Selects tomorrow's date -->
        <button on:click={selectTomorrow} class="px-3 py-1 border rounded hover:bg-gray-100">Tomorrow</button>

        <!-- Selects the next Monday as the due date -->
        <button on:click={selectNextWeek} class="px-3 py-1 border rounded hover:bg-gray-100">Next Week</button>

        <!-- Selects the same day in the next month -->
        <button on:click={selectNextMonth} class="px-3 py-1 border rounded hover:bg-gray-100">Next Month</button>

        <!-- Clears both the date and time selection -->
        <button on:click={clearDate} class="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">No Due Date</button>
    </div>

    <!-- Date Picker Input: Allows manual date selection -->
    <FlatCalender on:select={handleDateSelect} />

    <!-- Time Picker Component: Enables users to pick a time -->
    <TimePicker on:select={handleTimeSelect} />
</div>

