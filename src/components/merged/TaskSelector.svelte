<!-- ItemSelector -->
<script lang="ts">
    import { addToStore, tasks, defaultWorkspace } from '../../store/store';
    import { toSentenceCase } from "../../hooks/reusable";
    import { createEventDispatcher } from 'svelte';
    import type { Task } from '../../store/types';
    import UniIcon from "../indivitual/UniIcon.svelte";
    import FilterSearch from "./FilterSearch.svelte";

    /**
     * List of selectable task options.
     * Provided as a prop to the component.
     * @type {Task[]}
     */
    export let options: Task[] = [];

    /**
     * The default task option.
     * Used when no specific task is selected.
     * @type {Task}
     */
    export let defaultOption: Task;

    /**
     * Currently selected task option.
     * Defaults to `defaultOption` if none is selected.
     * @type {Task}
     */
    export let selectedOption: Task = defaultOption;

    /**
     * Tracks the state of the dropdown menu.
     * `true` if the menu is open, `false` otherwise.
     * @type {boolean}
     */
    let menuOpen = false;

    /**
     * Svelte event dispatcher for emitting custom events to parent components.
     */
    const dispatch = createEventDispatcher();

    /**
     * Toggles the visibility of the dropdown menu.
     */
    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    /**
     * Closes the dropdown menu by setting `menuOpen` to `false`.
     */
    function closeMenu() {
        menuOpen = false;
    }

    /**
     * Clears the current task selection by resetting it to the default option.
     * Dispatches a `select` event with the `defaultOption`.
     */
    function clearSelection() {
        dispatch('select', defaultOption);
        closeMenu();
    }

    /**
     * Handles selection of a task from the dropdown menu.
     * Dispatches a `select` event with the selected task and closes the menu.
     *
     * @param {CustomEvent<Task>} event - Event containing the selected task.
     */
    function handleSelect(event: CustomEvent<Task>) {
        dispatch('select', event.detail);
        closeMenu();
    }

    /**
     * Handles the creation of a new task from the input field.
     * - Trims and validates the input title.
     * - Adds the new task to the `tasks` store under the `defaultWorkspace`.
     *
     * @param {CustomEvent<{ title: string }>} event - Event containing the title of the new task.
     */
    function handleCreate(event: CustomEvent<{ title: string }>) {
        const { title } = event.detail;
        if (!title.trim()) return;

        const baseData = { title: title.trim(), description: "" };

        addToStore(tasks, { ...baseData, workspaceId: defaultWorkspace.id });
    }

    /**
     * Svelte action that detects clicks outside the specified element and closes the menu.
     *
     * @param {HTMLElement} node - The DOM node to monitor for outside clicks.
     * @returns {object} Cleanup function to remove the event listener when the element is destroyed.
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
  Container for the task selector dropdown.
  - Uses the `clickOutside` action to detect clicks outside and close the menu.
-->
<div class="selector-container" use:clickOutside>

    <!--
      Selector button that displays the currently selected option.
      - Acts as a button with accessible roles and keyboard interactions.
      - Toggles the dropdown menu on click or when pressing 'Enter' or 'Space'.
      - Displays the selected task title in sentence case.
      - Shows an icon indicating whether the default option is selected:
          - "R" icon if the selected option is the default task.
          - "X" icon with a clickable area to clear the selection if a non-default option is selected.
    -->
    <div
            class="selector"
            role="button"
            tabindex="0"
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            on:click|stopPropagation={toggleMenu}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMenu()}
    >
        <!-- Displays the selected task title in sentence case -->
        <span>{toSentenceCase(selectedOption.title)}</span>

        <div class="flex items-center gap-2">
            {#if selectedOption?.id === defaultOption?.id}
                <!-- Icon indicating the default option is selected -->
                <UniIcon size="16px"><span>R</span></UniIcon>
            {:else}
                <!--
                  Clear selection button:
                  - Appears only when the selected option is not the default one.
                  - Clicking or pressing 'Enter'/'Space' clears the selection.
                -->
                <span
                        class="clear-selection"
                        role="button"
                        tabindex="0"
                        on:click={clearSelection}
                        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && clearSelection()}
                >
                    <UniIcon><span>X</span></UniIcon>
                </span>
            {/if}
        </div>
    </div>

    <!--
      Dropdown menu that appears when `menuOpen` is true.
      Contains a searchable list of task options and an option to create new tasks.
    -->
    {#if menuOpen}
        <div class="dropdown-menu">
            <div class="dropdown-menu-content">
                <FilterSearch
                        {options}
                        itemInputType="todo"
                        {defaultOption}
                        on:select={handleSelect}
                        on:create={handleCreate}
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

    /* Styles for the clickable selector button */
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

    /* Hover effect for the selector-content */
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
        gap: .2em;
        display: flex;
        flex-direction: column;
        padding: .5em 0;
    }
</style>

