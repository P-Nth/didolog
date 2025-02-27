<!--
  LabelSelector Component

  A dropdown selector for managing labels in a task or note-taking application.
  - Allows users to select multiple labels from a list.
  - Supports searching, selecting, and deselecting labels.
  - Enables the creation of new labels.
  - Uses event dispatching to notify parent components of selection changes.

  Features:
  - Toggles the dropdown menu open/closed.
  - Handles selection and deselection of labels.
  - Emits custom events (`select`, `toggle`, `create`) to update external state.
  - Implements accessibility features such as keyboard navigation and ARIA attributes.
-->
<script lang="ts">
    import { addToStore, labels } from '../../store/store';
    import { toSentenceCase } from "../../hooks/reusable";
    import { createEventDispatcher } from 'svelte';
    import type { Label } from '../../store/types';
    import UniIcon from "../indivitual/UniIcon.svelte";
    import FilterSearch from "./FilterSearch.svelte";

    /**
     * Array of label options to display in the dropdown.
     * @type {Label[]}
     */
    export let options: Label[] = [];

    /**
     * Array of currently selected labels.
     * @type {Label[]}
     */
    export let selectedOptions: Label[] = [];

    /**
     * Tracks whether the dropdown menu is open or closed.
     * `true` means the menu is open, `false` means it is closed.
     */
    let menuOpen: boolean = false;

    /**
     * Stores the list of selected label IDs.
     * This keeps track of the currently selected labels.
     */
    let selectedLabels: string[] = [];

    /**
     * Creates a Svelte event dispatcher for emitting custom events.
     * Used to notify parent components of changes (e.g., selection updates).
     */
    const dispatch = createEventDispatcher();

    /**
     * Toggles the dropdown menu open or closed.
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
     * Clears all selected labels and dispatches the updated empty selection.
     */
    function clearSelection() {
        selectedOptions = [];
        dispatch('select', selectedOptions);
    }

    /**
     * Handles the selection of a label.
     * - Adds the label if not already selected.
     * - Removes the label if it's already selected.
     * - Dispatches a 'select' event with updated selections.
     *
     * @param {CustomEvent<Label>} event - The event containing the selected label.
     */
    function handleSelect(event: CustomEvent<Label>) {
        const selectedLabel = event.detail;
        const alreadySelected = selectedOptions.some(label => label.id === selectedLabel.id);

        selectedOptions = alreadySelected
            ? selectedOptions.filter(label => label.id !== selectedLabel.id)
            : [...selectedOptions, selectedLabel];

        dispatch('select', selectedOptions);
    }

    /**
     * Handles toggling the selection of a label.
     *
     * - If the label is already selected, it is removed from `selectedLabels`.
     * - If the label is not selected, it is added to `selectedLabels`.
     *
     * @param {CustomEvent<Label>} event - The event containing the selected label.
     */
    function handleToggle(event: CustomEvent<Label>) {
        const selectedLabel = event.detail;

        selectedLabels = selectedLabels.includes(selectedLabel.id)
            ? selectedLabels.filter(id => id !== selectedLabel.id)
            : [...selectedLabels, selectedLabel.id];
    }

    /**
     * Handles the creation of a new label.
     * - Adds the newly created label to the store.
     * - Automatically selects the new label.
     * - Dispatches the updated selection.
     *
     * @param {CustomEvent<{ title: string }>} event - The event containing the new label title.
     */
    function handleCreate(event: CustomEvent<{ title: string }>) {
        const { title } = event.detail;
        if (!title.trim()) return;

        const baseData = { title: title.trim(), description: "" };
        addToStore(labels, { ...baseData });

        // Safely find the newly created label or set it to null if not found
        let newItem: Label | null = null;
        labels.subscribe(current => {
            newItem = current.find(label => label.title === baseData.title) ?? null;
        })();
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
  Container for the label selector dropdown.
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
            class="selector"
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
        <span>
          {#if selectedOptions.length > 0}
            {toSentenceCase(selectedOptions[0].title)}
              {#if selectedOptions.length > 1}
                  +{selectedOptions.length - 1} more
              {/if}
          {:else}
            Labels  <!-- Default text when no labels are selected -->
          {/if}
        </span>

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
                <UniIcon><span>X</span></UniIcon>
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
                <FilterSearch
                    {options}
                    {selectedLabels}
                    itemInputType="label"
                    on:select={handleSelect}
                    on:toggle={handleToggle}
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

