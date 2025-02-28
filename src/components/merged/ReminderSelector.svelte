<!--
  ReminderSelector Component

  A dropdown selector for managing reminders in a task or note-taking application.
  - Allows users to select multiple reminders from a list.
  - Uses event dispatching to notify parent components of selection changes.

  Features:
  - Toggles the dropdown menu open/closed.
  - Handles selection and deselection of reminders.
  - Emits custom events (`select`, `toggle`) to update external state.
  - Implements accessibility features such as keyboard navigation and ARIA attributes.
-->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type {Reminder} from "../../store/types";
    import UniIcon from "../indivitual/UniIcon.svelte";
    import {toSentenceCase} from "../../hooks/reusable";
    import DropDownItem from "../indivitual/DropDownItem.svelte";

    /**
     * Array of label options to display in the dropdown.
     * @type {Reminder[]}
     */
    export let options: Reminder[] = [];

    /**
     * Array of currently selected reminders.
     * @type {Reminder[]}
     */
    export let selectedOptions: Reminder[] = [];

    /**
     * Tracks if a time has been selected.
     * @type {string}
     */
    export let selectedTime: string = "";

    /**
     * Tracks whether the dropdown menu is open or closed.
     * `true` means the menu is open, `false` means it is closed.
     */
    let menuOpen: boolean = false;

    /**
     * Creates a Svelte event dispatcher for emitting custom events.
     * Used to notify parent components of changes (e.g., selection updates).
     */
    const dispatch = createEventDispatcher();

    /**
     * Toggles the dropdown menu.
     */
    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    /**
     * Closes the dropdown menu.
     */
    function closeMenu() {
        menuOpen = false;
    }

    /**
     * Clears the selected reminder and dispatches an event.
     */
    function clearSelection() {
        selectedOptions = [];
        dispatch('select', selectedOptions);
    }

    /**
     * Handles selecting/deselecting a reminder.
     * - If it's already selected, remove it.
     * - Otherwise, add it to the selection.
     */
    function selectReminder(option: Reminder) {
        const index = selectedOptions.findIndex((r) => r.id === option.id);

        if (index !== -1) {
            // Remove if already selected
            selectedOptions = selectedOptions.filter((r) => r.id !== option.id);
        } else {
            // Add to selection
            selectedOptions = [...selectedOptions, option];
        }

        dispatch('select', selectedOptions);
    }

    /**
     * Handles clicking outside the component to close the menu.
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
  Container for the reminder selector dropdown.
  - Uses the `clickOutside` action to close the menu when clicking outside.
-->
<div class="selector-container" use:clickOutside>
    <!--
      Dropdown trigger button:
      - Click or press 'Enter'/'Space' to toggle the dropdown menu.
      - `aria-haspopup="menu"` indicates it opens a menu.
      - `aria-expanded` reflects the menu state for accessibility.
    -->
    <div
            class="selector-content"
            role="button"
            tabindex="0"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            on:click|stopPropagation={toggleMenu}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMenu()}
    >
        <!--
          Display selected label(s):
          - If labels are selected, show the first one.
          - If multiple labels are selected, display the count of additional labels.
        -->
        <div class="selector">
            <UniIcon><span>O</span></UniIcon>

            <span>
                {#if selectedOptions.length > 0}
                    {toSentenceCase(selectedOptions[0].title)}
                    {#if selectedOptions.length > 1}
                        +{selectedOptions.length - 1} more
                    {/if}
                {:else}
                    Add Reminder
                {/if}
            </span>
        </div>

        <!--
          Clear selection button:
          - Allows users to clear all selected labels.
          - Click or press 'Enter'/'Space' to trigger `clearSelection`.
        -->
        <div class="flex items-center gap-2">
            <span
                    class="clear-selection"
                    role="button"
                    tabindex="0"
                    on:click={clearSelection}
                    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && clearSelection()}
            >
                <UniIcon><span>{selectedOptions.length > 0 ? 'X' : 'R'}</span></UniIcon>
            </span>
        </div>
    </div>

    <!--
      Dropdown menu:
      - Opens when `menuOpen` is `true`.
      - Contains `FilterSearch` for selecting and managing labels.
    -->
    {#if menuOpen}
        <div class="dropdown-menu">
            <div class="dropdown-menu-content">
                {#each options as option}
                    <div
                            class="dropdown-item"
                            role="button"
                            tabindex="0"
                            on:click={() => selectReminder(option)}
                            on:keydown={(e) => (e.key === 'Enter') && selectReminder(option)}
                    >
                        <!--
                         DropDownItem:
                         - Displays the option title with optional left and right icons.
                         - Clicking an option triggers a `select` event.
                       -->
                        <DropDownItem size="small">
                            <svelte:fragment slot="leftIcon">
                                <UniIcon><span>L</span></UniIcon>
                            </svelte:fragment>
                            <span>
                                <span>{option.title}</span>
                                <span class="reminder-time">{selectedTime === "" ? "(9:45AM)" : ""}</span>
                            </span>
                            <svelte:fragment slot="rightIcon">
                                {#if selectedOptions.some(selected => selected.id === option.id)}
                                    <UniIcon><span>✔</span></UniIcon>
                                {/if}
                            </svelte:fragment>
                        </DropDownItem>
                    </div>
                {/each}
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

    /* Styles for the clickable selector button */
    .selector-content {
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

    /* Hover effect for the selector-content */
    .selector-content:hover {
        background-color: #f2f2f2;
    }

    .selector {
        gap: .5em;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        gap: .2em;
        display: flex;
        flex-direction: column;
        padding: .5em 0;
    }

    /* Option item styling */
    .dropdown-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        border-radius: .4em;
        padding: .3em 0;
        transition: background-color .25s ease-in-out;
    }
    .dropdown-item:hover {
        background-color: #f5f5f5;
    }


    .reminder-time {
        color: #5781A5;
        font-size: 11px;
        font-weight: 300;
    }
</style>

