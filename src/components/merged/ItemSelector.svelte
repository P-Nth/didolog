<!--
  ItemSelector Component

  A flexible dropdown selector for managing selectable items (labels, tags, etc.) in an application.
  - Accepts a generic type parameter to work with different item types
  - Uses an input field for searching and filtering options
  - Displays selected items as pins/tags with removal capability
  - Supports creation of new items when no match is found
  - Uses event dispatching to notify parent components of selection changes

  Features:
  - Opens dropdown when input is focused or clicked
  - Filters options based on input text
  - Displays selected items as removable pins
  - Supports keyboard navigation
  - Supports backspace to remove the last selected item when input is empty
  - Emits custom events (`select`, `toggle`, `create`) to update external state
  - Implements accessibility features
-->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import UniIcon from "../indivitual/UniIcon.svelte";
    import { toSentenceCase } from "../../hooks/reusable";
    import InputField from "../indivitual/InputField.svelte";
    import DropDownItem from "../indivitual/DropDownItem.svelte";

    /**
     * Type of the selectable items, passed from parent component
     */
    export let itemType: string = "item";

    /**
     * Array of options to display in the dropdown.
     * @type {any[]}
     */
    export let options: any[] = [];

    /**
     * Selection mode for the component
     * - "multiple-add": Multiple selection allowed, new items can be created
     * - "multiple-only": Multiple selection allowed, only existing items
     * - "single-add": Single selection only, new items can be created
     * - "single-only": Single selection only, only existing items
     */
    export let selectionMode: "multiple-add" | "multiple-only" | "single-add" | "single-only" = "multiple-add";

    /**
     * Array of currently selected options.
     * @type {any[]}
     */
    export let selectedOptions: any[] = [];

    /**
     * Placeholder text for the input field
     */
    export let placeholder: string = `Search or add ${itemType}...`;

    /**
     * Tracks whether the dropdown menu is open or closed.
     * `true` means the menu is open, `false` means it is closed.
     */
    let menuOpen: boolean = false;

    /**
     * The current search input value
     */
    let searchInput: string = '';

    /**
     * Filtered options based on the search input
     */
    $: filteredOptions = searchInput.trim()
        ? options.filter(option =>
            option.title
                .toLowerCase()
                .includes(searchInput.toLowerCase())
        )
        : options;

    /**
     * Computed flags for selection behavior
     */
    $: allowMultiple = selectionMode.startsWith("multiple");
    $: allowAddition = selectionMode.endsWith("add");

    /**
     * Determines if a new item can be created based on search input and mode
     */
    $: canCreateNew = allowAddition &&
        searchInput.trim() &&
        !options.some(option => option.title.toLowerCase() === searchInput.toLowerCase());

    /**
     * Creates a Svelte event dispatcher for emitting custom events.
     */
    const dispatch = createEventDispatcher();

    /**
     * Opens the dropdown menu.
     */
    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    /**
     * Opens the dropdown menu.
     */
    function openMenu() {
        menuOpen = true;
    }

    /**
     * Closes the dropdown menu.
     */
    function closeMenu() {
        menuOpen = false;
    }

    /**
     * Clears all selected items and dispatches the updated empty selection.
     */
    function clearSelection() {
        selectedOptions = [];
        dispatch('select', selectedOptions);
    }

    /**
     * Selects an option from the list
     * @param option The option to select
     */
    function selectOption(option: any) {
        const alreadySelected = selectedOptions.some(
            item => item.id === option.id
        );

        if (alreadySelected) {
            // If already selected, remove it (toggle behavior for multiple select)
            if (allowMultiple) {
                removeOption(option);
            }

            // For single select, clicking an already selected item does nothing
            if (!allowMultiple) closeMenu();
        }

        if (!alreadySelected) {
            if (allowMultiple) {
                // For multiple selection, add to existing selections
                selectedOptions = [...selectedOptions, option];
            } else {
                // For single selection, replace any existing selection
                selectedOptions = [option];
            }

            dispatch('select', selectedOptions);
            searchInput = '';

            // For single selection, close the menu after selecting
            if (!allowMultiple) {
                closeMenu();
            }
        }
    }

    /**
     * Removes a selected option
     * @param option The option to remove
     */
    function removeOption(option: any) {
        selectedOptions = selectedOptions.filter(
            item => item.id !== option.id
        );
        dispatch('select', selectedOptions);
    }

    /**
     * Removes the last selected option
     * Used when pressing backspace in an empty input field
     */
    function removeLastOption() {
        if (searchInput === '' && selectedOptions.length > 0) {
            const lastOption = selectedOptions[selectedOptions.length - 1];
            removeOption(lastOption);
        }
    }

    /**
     * Creates a new item from the search input
     */
    function createNewOption() {
        if (!allowAddition || !searchInput.trim() || !canCreateNew) return;

        const newOptionTitle = {
            title: searchInput.trim(),
            description: ""
        };

        dispatch('create', newOptionTitle);
        searchInput = '';
    }

    /**
     * Svelte action that detects clicks outside the specified element
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

<!-- Container for the dynamic selector dropdown -->
<div class="selector-container" use:clickOutside>
    <div class="selector-content">
        <!-- Selectors -->
        {#if selectionMode === "single-only" || selectionMode === "multiple-only"}
            <!-- Non-editable selection display -->
            <div
                    class="normal-selector"
                    role="button"
                    tabindex="0"
                    aria-label="Select option"
                    on:click={toggleMenu}
                    on:keydown={(e) => (e.key === 'Enter') && toggleMenu()}
            >
                <span class="selected-option">
                    {#if selectedOptions.length > 0}
                        {toSentenceCase(selectedOptions[0].title)}
                        {#if selectedOptions.length > 1}
                            +{selectedOptions.length - 1} more
                       {/if}
                    {:else}
                        {placeholder}  <!-- Default text when no labels are selected -->
                    {/if}
                </span>
                <span
                        class="clear-selection"
                        role="button"
                        tabindex="0"
                        aria-label="Clear selection"
                        on:click={clearSelection}
                        on:keydown={(e) => (e.key === 'Enter') && clearSelection}
                >
                    <UniIcon><span>{selectedOptions.length > 0 ? "X" : "R"}</span></UniIcon>
                </span>
            </div>
        {:else}
            <div class="selector">
                <!-- Selected items display as pins -->
                <div class="pins">
                    {#each selectedOptions as option}
                        <div class="pin">
                            <span class="pin-text">{toSentenceCase(option.title)}</span>
                            <span
                                    class="pin-remove"
                                    role="button"
                                    tabindex="0"
                                    aria-label={`Remove ${option.title}`}
                                    on:click|stopPropagation={() => removeOption(option)}
                                    on:keydown={(e) => (e.key === 'Enter') && removeOption(option)}
                            >
                                <UniIcon><span>X</span></UniIcon>
                            </span>
                        </div>
                    {/each}
                </div>

                <!-- Editable input field for other modes -->
                <InputField
                        type="text"
                        textSize="medium"
                        variant="description"
                        bind:value={searchInput}
                        placeholder={placeholder}
                        onInput={openMenu}
                        onBackspace={() => {selectedOptions.length > 0 && removeLastOption()}}
                        onEnter={() => {canCreateNew && createNewOption()}}
                        onEscape={clearSelection}
                />

                <!-- Action buttons (clear selection) -->
                <div class="selector-actions">
                    <span
                            class="clear-selection"
                            role="button"
                            tabindex="0"
                            aria-label="Clear all selections"
                            on:click|stopPropagation={clearSelection}
                            on:keydown={(e) => (e.key === 'Enter') && clearSelection()}
                    >
                        <UniIcon><span>{selectedOptions.length > 0 ? "X" : "R"}</span></UniIcon>
                    </span>
                </div>
            </div>
        {/if}
    </div>

    <!-- Dropdown menu -->
    {#if menuOpen}
        <div id="option-dropdown" class="dropdown-menu">
            <div class="dropdown-menu-content" role="listbox">
                <!-- Filtered options -->
                {#if filteredOptions.length > 0}
                    {#each filteredOptions as option}
                        <div
                                class="option-item"
                                class:selected={selectedOptions.some(item => item.id === option.id)}
                                role="option"
                                tabindex="0"
                                aria-selected={selectedOptions.some(item => item.id === option.id)}
                                on:click|stopPropagation={() => selectOption(option)}
                                on:keydown={(e) => (e.key === 'Enter') && selectOption(option)}
                        >
                            <DropDownItem text={toSentenceCase(option.title)} size="small">
                                <svelte:fragment slot="leftIcon">
                                    <UniIcon><span>L</span></UniIcon>
                                </svelte:fragment>
                                <svelte:fragment slot="rightIcon">
                                    <UniIcon><span>R</span></UniIcon>
                                </svelte:fragment>
                            </DropDownItem>
                        </div>
                    {/each}
                {:else if searchInput.trim()}
                    <!-- Create new option when searching -->
                    {#if canCreateNew}
                        <div
                                class="option-item create-new"
                                role="option"
                                tabindex="0"
                                aria-selected={searchInput.trim() !== ""}
                                on:click|stopPropagation={createNewOption}
                                on:keydown={(e) => (e.key === 'Enter') && createNewOption()}
                        >
                            Create "{searchInput}"
                        </div>
                    {/if}
                {:else}
                    <!-- No options message -->
                    <div class="option-item no-options">
                        Start typing...
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<!-- ItemSelector Styles-->
<style>
    .selector-container {
        position: relative;
        width: 100%;
    }

    .normal-selector {
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
    .normal-selector:hover {
        background-color: #f2f2f2;
    }

    .selector {
        display: flex;
        align-items: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 0 .4em;
    }

    .selector:focus-within {
        border-color: #5781A5;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }

    .pins {
        gap: 0.25rem;
        display: flex;
    }

    .pin {
        cursor: pointer;
        gap: .3rem;
        display: flex;
        align-items: center;
        background-color: #f0f4f8;
        border-radius: 16px;
        padding: 0.25rem 0.5rem;
        margin: 0.125rem;
        font-size: 0.875rem;
    }

    .pin-remove {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }

    .selector-actions {
        display: flex;
        align-items: center;
    }

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

    .dropdown-menu-content {
        gap: .2em;
        display: flex;
        flex-direction: column;
        padding: .5em 0;
    }

    .option-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        border-radius: .4em;
        padding: .3em 0;
        transition: background-color .25s ease-in-out;
    }

    .option-item:hover, .option-item:focus {
        background-color: #f5f5f5;
    }

    .option-item.selected {
        background-color: #f5f5f5;
    }

    .create-new {
        color: #4a90e2;
        font-style: italic;
    }

    .no-options {
        color: #888;
        font-style: italic;
    }
</style>

