<!-- ItemSelector Component -->
<script lang="ts">
    // Import the UniIcon function.
    import { createEventDispatcher } from 'svelte';
    import type {Reminder} from "../../store/types";
    import UniIcon from "../indivitual/UniIcon.svelte";
    import DatePicker from "../indivitual/DatePicker.svelte";
    import ReminderSelector from "./ReminderSelector.svelte";

    /**
    * @prop {string} selectorTitle - Text displayed as the initial selector title (task, workspace)
    */
    export let selectorTitle: [string, string] = ["", ""];

    /**
     * Array of all reminder options.
     * @type {Reminder[]}
     */
    export let reminderOptions: Reminder[] = [];

    /**
     * Array of currently selected reminders.
     * @type {Reminder[]}
     */
    export let selectedReminderOptions: Reminder[] = [];

    /**
    * @prop {boolean} open - Controls whether the dropdown menu is open.
    */
    let menuOpen = false;

    /**
     * Creates a Svelte event dispatcher for emitting custom events.
     * Used to notify parent components of changes (e.g., selection updates).
     */
    const dispatch = createEventDispatcher();

    /**
    * Toggle the dropdown menu open/close state.
    */
    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    /**
    * Close the dropdown menu.
    */
    function closeMenu() {
        menuOpen = false;
    }

    /**
    * Clear the selection made.
    */
    function clearSelection() {
        selectorTitle = ["", ""];

        dispatch("select", selectorTitle);
        closeMenu()
    }

    /**
     * Handles the selection of a reminder.
     * - Dispatches a 'select' event with updated selections.
     *
     * @param {CustomEvent<[string, string]>} event - The event containing the selected date & time.
     */
    function handleSelect(event: CustomEvent<[string, string]>) {
        selectorTitle = event.detail;

        dispatch("select", selectorTitle);

        closeMenu();
    }

    /**
     * Sets the selected date and time based on the current time for the reminder.
     * - Will be of reset if the time and date are already selected
     * - If the time is past 9:45 AM, set to tomorrow at 9:45 AM.
     * - Otherwise, set to today at 9:45 AM.
     */
    const handleReminderDate = () => {
        const now = new Date();
        const targetHour = 9;
        const targetMinute = 45;

        // Check if current time is past 9:45 AM today
        if (now.getHours() > targetHour || (now.getHours() === targetHour && now.getMinutes() > targetMinute)) {
            // Set to tomorrow at 9:45 AM
            now.setDate(now.getDate() + 1);
        }

        // Format date as YYYY-MM-DD
        const formattedDate = now.toISOString().split("T")[0];

        // Format time as HH:MM
        const formattedTime = `${targetHour.toString().padStart(2, "0")}:${targetMinute.toString().padStart(2, "0")}`;

        // Update the stores
        selectorTitle = [
            selectorTitle[0] === "" ? formattedDate : selectorTitle[0],
            selectorTitle[1] === "" ? formattedTime : selectorTitle[1]
        ];
    }

    /**
     * Handles the selection of a reminder.
     * - Dispatches a 'select' event with updated selections.
     *
     * @param {CustomEvent<[string, string]>} event - The event containing the selected date & time.
     */
    function handleReminderSelect(event: CustomEvent<Reminder[]>) {
        selectedReminderOptions = event.detail;

        handleReminderDate();

        dispatch("reminderSelect", selectedReminderOptions);
    }

    /**
     * Svelte action that detects clicks outside the specified element and triggers a callback.
     *
     * @param node - The DOM node to monitor for outside clicks.
     * @returns An object with a `destroy` method to clean up the event listener.
     */
    function clickOutside(node: HTMLElement) {
        const handleClick = (event: MouseEvent) => {
            if (!node.contains(event.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener('click', handleClick, true);
        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            },
        };
    }
</script>

<!--
  Container for the Date selector dropdown.
  - Uses the `clickOutside` action to close the menu when clicking outside.
-->
<div class="selector-container" use:clickOutside>
    <!-- Selector button to open the dropdown menu -->
    <div
            class="selector"
            role="button"
            tabindex="0"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            on:click|stopPropagation={toggleMenu}
            on:keydown={toggleMenu}
    >
        <!-- Displays the selected date and time, or "Date" if none is selected -->
        <span>
            {selectorTitle[0]
              ? `${selectorTitle[0]} ${selectorTitle[1] ? selectorTitle[1] : ""}`.trim()
              : "Date"}
        </span>

        <div class="flex items-center gap-2">
            <!--
              Clear selection button:
              - Appears only when a date/time is selected.
              - Clicking or pressing 'Enter' clears the selection.
            -->
            <span
                    class="clear-selection"
                    role="button"
                    tabindex="0"
                    on:click={clearSelection}
                    on:keydown={(e) => (e.key === 'Enter') && clearSelection()}
            >
                <UniIcon><span>{selectorTitle[0] !== "" || selectorTitle[1] !== "" ? 'X' : 'R'}</span></UniIcon>
            </span>
        </div>
    </div>

    <!-- Dropdown menu for date and time selection -->
    {#if menuOpen}
        <div class="dropdown-menu">
            <div class="dropdown-menu-content">
                <!-- DatePicker component allows selecting date and time -->
                <DatePicker selectedDateTime={selectorTitle} on:select={handleSelect} />
                <ReminderSelector
                        options={reminderOptions}
                        selectedOptions={selectedReminderOptions}
                        selectedTime={selectorTitle[1]}
                        on:select={handleReminderSelect}
                />
            </div>
        </div>
    {/if}
</div>

<!-- Selector Styles -->
<style>
    /* Container for the selector and its dropdown menu */
    .selector-container {
        position: relative;
        display: flex;
    }

    /* Styles for the clickable selector */
    .selector {
        cursor: pointer;
        user-select: none;
        gap: 1em;
        display: flex;
        align-items: center;
        background-color: white;
        border-radius: .25em;
        border: 1px solid #1d2846;
        padding: 0 .4em;
        width: 100%;
    }

    /* Hover effect for the selector */
    .selector:hover {
        background-color: #f2f2f2;
    }


    .clear-selection {
        display: flex;
        border-radius: .25em;
    }

    /* Dropdown menu styling */
    .dropdown-menu {
        z-index: 100;
        left: 0;
        right: 0;
        top: 100%;
        position: absolute;
        background: white;
        border-radius: .25em;
        border: 1px solid #ccc;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        width: 200px;
        padding: .3em .3em;
    }

    /* Dropdown item styling */
    .dropdown-menu-content {
        gap: 1em;
        display: flex;
        flex-direction: column;
        padding: .5em 0;
    }
</style>

