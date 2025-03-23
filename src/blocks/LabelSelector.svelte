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
    import { createEventDispatcher } from 'svelte';
    import type { Label } from '../store/types';
    import { addToStore, labels } from '../store/store';
    import { toSentenceCase } from "../hooks/reusable";
    import UniIcon from "../components/individual/UniIcon.svelte";
    import FilterSearch from "../components/merged/FilterSearch.svelte";

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
<div class="selector-container relative flex" use:clickOutside>
    <!--
      Dropdown trigger button:
      - Click or press 'Enter'/'Space' to toggle the dropdown menu.
      - `aria-haspopup="menu"` indicates it opens a menu.
      - `aria-expanded` reflects the menu state for accessibility.
    -->
    <div
            class="selector cursor-pointer select-none flex items-center gap-[1em] bg-white rounded-[0.25em] border border-[#1d2846] px-[0.4em] w-full hover:bg-[#f2f2f2]"
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
                    class="clear-selection flex rounded-[0.25em]"
                    role="button"
                    tabindex="0"
                    on:click={clearSelection}
                    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && clearSelection()}
            >
                <UniIcon><span>{selectedOptions.length > 0 ? "X" : "R"}</span></UniIcon>
            </span>
        </div>
    </div>

    <!--
      Dropdown menu:
      - Opens when `menuOpen` is `true`.
      - Contains `FilterSearch` for selecting and managing labels.
    -->
    {#if menuOpen}
        <div class="dropdown-menu absolute left-0 right-0 top-full z-[90] bg-white rounded-[0.25em] border border-[#ccc] shadow-[0_2px_5px_rgba(0,0,0,0.15)] w-[200px] p-[0.3em]">
            <div class="dropdown-menu-content flex flex-col gap-[0.2em] py-[0.5em]">
                <FilterSearch
                    {options}
                    selectedOptions={selectedOptions}
                    itemInputType="label"
                    on:select={handleSelect}
                    on:create={handleCreate}
                />
            </div>
        </div>
    {/if}
</div>

