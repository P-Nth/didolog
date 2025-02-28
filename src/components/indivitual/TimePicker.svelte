<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import {toSentenceCase} from "../../hooks/reusable";
    import UniIcon from "./UniIcon.svelte";
    import DropDownItem from "./DropDownItem.svelte";
    import InputField from "./InputField.svelte";

    let selectedTime: string = getNextNearestTime();
    let timeOptions = generateTimeOptions();

    const dispatch = createEventDispatcher();

    /**
     * Get the next nearest time that is a factor of 30 minutes ahead of the current time.
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
     * Generate a rolling 24-hour time selection list
     * starting from the next nearest 30-minute interval.
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
     * Format Date object to "HH:MM" string.
     */
    function formatTime(date: Date): string {
        let hours = date.getHours().toString().padStart(2, "0");
        let minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    function setTime(value: string) {
        selectedTime = value;
        dispatch("select", selectedTime);
    }

    function timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    function handleSelect(time: string) {
        selectedTime = time;
        dispatch("select", selectedTime);
    }
</script>

<div class="time-picker">
    <InputField
            type="time"
            bind:value={selectedTime}
            onInput={setTime}
    />

    <div class="quick-select">
        {#each timeOptions as time}
            <div
                    class="option-item"
                    role="button"
                    tabindex="0"
                    on:click={() => handleSelect(time)}
                    on:keydown={() => handleSelect(time)}
            >
                <DropDownItem text={toSentenceCase(time)} size="small">
                    <svelte:fragment slot="leftIcon">
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

