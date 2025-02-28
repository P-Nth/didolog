<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import Datepicker from "flowbite-datepicker/Datepicker";
    import TimePicker from "./TimePicker.svelte";

    export let selectedDateTime: [string, string] = ["", ""]

    let selectedDate: string = selectedDateTime[0];  // Holds selected date
    let selectedTime: string = selectedDateTime[1];  // Holds selected time
    let userSelectedDate = false;   // Tracks if user manually picked a date

    let datepickerInstance: Datepicker | null = null;

    const dispatch = createEventDispatcher();

    /**
     * Formats a date as YYYY-MM-DD
     */
    function formatDate(date: Date): string {
        return date.toISOString().split("T")[0];
    }

    /**
     * Determines if the selected time has already passed today.
     */
    function hasTimePassedToday(time: string): boolean {
        const now = new Date();
        const [hour, minute] = time.split(":").map(Number);

        return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute);
    }

    /**
     * Selects today's date.
     */
    function selectToday() {
        selectedDate = formatDate(new Date());
        userSelectedDate = true;  // Mark as manually selected
    }

    /**
     * Selects tomorrow's date.
     */
    function selectTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        selectedDate = formatDate(tomorrow);
        userSelectedDate = true;
    }

    /**
     * Selects next week's Monday.
     */
    function selectNextWeek() {
        const today = new Date();
        const nextMonday = new Date();
        nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));
        selectedDate = formatDate(nextMonday);
        userSelectedDate = true;
    }

    /**
     * Selects the same date next month.
     */
    function selectNextMonth() {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        selectedDate = formatDate(nextMonth);
        userSelectedDate = true;
    }

    /**
     * Clears both date and time selections.
     */
    function clearDate() {
        selectedDate = "";
        selectedTime = "";
        userSelectedDate = false; // Reset manual selection
    }

    /**
     * Handles time selection from TimePicker.
     */
    function handleTimeSelect(event: CustomEvent) {
        selectedTime = event.detail;

        // If no manual date is selected, set date automatically
        if (!userSelectedDate) {
            if (hasTimePassedToday(selectedTime)) {
                selectTomorrow();
            } else {
                selectToday();
            }
        }
    }

    /**
     * Handles manual date selection.
     */
    function handleDateSelect(event: Event) {
        const date = (event.target as HTMLInputElement).value;
        selectedDate = date || "";
        userSelectedDate = true; // Mark that the user manually selected a date
    }

    // Sync datepicker with selectedDate
    onMount(() => {
        const datepickerEl = document.getElementById("datepicker") as HTMLInputElement;
        if (datepickerEl) {
            datepickerInstance = new Datepicker(datepickerEl, {
                autohide: true,
                format: "yyyy-mm-dd",
                minDate: new Date(new Date().setDate(new Date().getDate() - 4)), // Min selectable date: 4 days ago
            });

            datepickerEl.addEventListener("changeDate", handleDateSelect);
        }

        return () => {
            if (datepickerInstance) {
                datepickerInstance.destroy();
                datepickerInstance = null;
            }
        };
    });

    // 🚀 Dispatch event whenever date or time changes
    $: dispatch("select", [selectedDate, selectedTime]);

</script>

<div class="flex flex-col gap-2">
    <!-- Predefined Buttons -->
    <div class="flex gap-2">
        <button on:click={selectToday} class="px-3 py-1 border rounded hover:bg-gray-100">Today</button>
        <button on:click={selectTomorrow} class="px-3 py-1 border rounded hover:bg-gray-100">Tomorrow</button>
        <button on:click={selectNextWeek} class="px-3 py-1 border rounded hover:bg-gray-100">Next Week</button>
        <button on:click={selectNextMonth} class="px-3 py-1 border rounded hover:bg-gray-100">Next Month</button>
        <button on:click={clearDate} class="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">No Due Date</button>
    </div>

    <!-- Date Picker Input -->
    <input
            type="text"
            id="datepicker"
            bind:value={selectedDate}
            placeholder="YYYY-MM-DD"
            class="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <!-- Time Picker -->
    <TimePicker on:select={handleTimeSelect} />
</div>

