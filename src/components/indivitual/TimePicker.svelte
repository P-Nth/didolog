<!--
    TimePicker Logic

    This script manages a time picker that:
    - Automatically selects the next nearest 30-minute interval.
    - Generates a rolling 24-hour list of time options.
    - Allows manual time selection.
    - Dispatches events whenever a time is selected.
-->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import {toSentenceCase} from "../../hooks/reusable";
    import UniIcon from "./UniIcon.svelte";
    import InputField from "./InputField.svelte";
    import DropDownItem from "./DropDownItem.svelte";

    let selectedTime: string = getNextNearestTime();
    let timeOptions = generateTimeOptions();

    const dispatch = createEventDispatcher();

    /**
     * Gets the next nearest time that aligns with a 30-minute interval.
     * Ensures the selected time is rounded up to the nearest valid selection.
     *
     * @returns {string} - The formatted time in "HH:MM" format.
     */
    function getNextNearestTime(): string {
        const now = new Date();
        let minutes = now.getMinutes();

        // Round up to the nearest 30-minute mark
        let remainder = minutes % 30;
        if (remainder !== 0) {
            minutes += (30 - remainder);
        }

        // If rounding up pushed to the next hour
        if (minutes >= 60) {
            now.setHours(now.getHours() + 1);
            minutes = 0;
        }

        now.setMinutes(minutes, 0, 0);
        return formatTime(now);
    }

    /**
     * Generates a list of selectable time options in 30-minute increments.
     * The list spans a full 24-hour period starting from the next available slot.
     *
     * @returns {string[]} - An array of time strings in "HH:MM" format.
     */
    function generateTimeOptions(): string[] {
        let times: string[] = [];

        // Get the current time
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();

        // Round minutes up to the next 30-minute mark
        minutes = minutes <= 30 ? 30 : 0;
        if (minutes === 0) hours += 1; // Move to next hour if we rounded past 30

        // Ensure hours wrap around after 23:59
        hours = hours % 24;

        // Generate 24 hours of time slots in 30-minute increments
        for (let i = 0; i < 48; i++) { // 48 slots = 24 hours
            let formattedHour = hours.toString().padStart(2, "0");
            let formattedMin = minutes.toString().padStart(2, "0");
            times.push(`${formattedHour}:${formattedMin}`);

            // Increment by 30 minutes
            minutes += 30;
            if (minutes === 60) {
                minutes = 0;
                hours = (hours + 1) % 24; // Wrap hours after 23
            }
        }

        return times;
    }

    /**
     * Formats a Date object to a "HH:MM" string.
     *
     * @param {Date} date - The date object to format.
     * @returns {string} - The formatted time in "HH:MM" format.
     */
    function formatTime(date: Date): string {
        let hours = date.getHours().toString().padStart(2, "0");
        let minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    /**
     * Updates the selected time and dispatches an event.
     *
     * @param {string} value - The new time value.
     */
    function setTime(value: string) {
        selectedTime = value;
        dispatch("select", selectedTime);
    }

    /**
     * Converts a time string ("HH:MM") to minutes.
     *
     * @param {string} time - The time string in "HH:MM" format.
     * @returns {number} - The total minutes since midnight.
     */
    function timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    /**
     * Handles time selection from the quick-select dropdown.
     * Updates the selected time and dispatches an event.
     *
     * @param {string} time - The selected time in "HH:MM" format.
     */
    function handleSelect(time: string) {
        selectedTime = time;
        dispatch("select", selectedTime);
    }
</script>

<!--
    TimePicker Component

    This component allows users to:
    - Manually input a time using the `InputField` component.
    - Select from a list of predefined time options using a quick-select menu.
    - Dispatch the selected time when a user interacts with either the input field or quick-select options.
-->
<div class="time-picker">
    <!-- Time Input Field: Allows users to manually enter a time -->
    <InputField
            type="time"
            bind:value={selectedTime}
            onInput={setTime}
    />

    <!-- Quick Select: Provides predefined time options for faster selection -->
    <div class="quick-select">
        {#each timeOptions as time}
            <div
                    class="option-item"
                    role="button"
                    tabindex="0"
                    on:click={() => handleSelect(time)}
                    on:keydown={() => handleSelect(time)}
            >
                <!-- Dropdown Item: Displays the time option -->
                <DropDownItem text={toSentenceCase(time)} size="small">
                    <svelte:fragment slot="leftIcon">
                        <!-- Left Icon for each option -->
                        <UniIcon><span>L</span></UniIcon>
                    </svelte:fragment>
                </DropDownItem>
            </div>
        {/each}
    </div>
</div>

<!-- Time Picker Styles-->
<style>
    /* Picker styling */
    .time-picker {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    /* Quick select styling */
    .quick-select {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
    }

    /* Option item styling */
    .option-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        border-radius: .4em;
        padding: .3em 0;
        transition: background-color .25s ease-in-out;
    }
    .option-item:hover {
        background-color: #f5f5f5;
    }
</style>

