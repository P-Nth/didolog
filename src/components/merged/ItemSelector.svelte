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
    import { toSentenceCase } from "../../hooks/reusable";

    import UniIcon from "../individual/DdlIcon.svelte";
    import InputField from "../individual/InputField.svelte";
    import DropDownItem from "../individual/DropDownItem.svelte";

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
    const toggleMenu = () => menuOpen = !menuOpen;

    /**
     * Opens the dropdown menu.
     */
    const openMenu = () => menuOpen = true;

    /**
     * Closes the dropdown menu.
     */
    const closeMenu = () => menuOpen = false;

    /**
     * Clears all selected items and dispatches the updated empty selection.
     */
    const clearSelection = () => {
        selectedOptions = [];
        dispatch('select', selectedOptions);
    }

    /**
     * Selects an option from the list
     * @param option The option to select
     */
    const selectOption = (option: any) => {
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
    const removeOption = (option: any) => {
        selectedOptions = selectedOptions.filter(
            item => item.id !== option.id
        );
        dispatch('select', selectedOptions);
    }

    /**
     * Removes the last selected option
     * Used when pressing backspace in an empty input field
     */
    const removeLastOption = () => {
        if (searchInput === '' && selectedOptions.length > 0) {
            const lastOption = selectedOptions[selectedOptions.length - 1];
            removeOption(lastOption);
        }
    }

    /**
     * Creates a new item from the search input
     */
    const createNewOption = () => {
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
    const clickOutside = (node: HTMLElement) => {
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
<div class="selector-container relative w-full" use:clickOutside>
    <div class="selector-content">
        <!-- Selectors -->
        {#if selectionMode === "single-only" || selectionMode === "multiple-only"}
            <!-- Non-editable selection display -->
            <div
                    class="normal-selector cursor-pointer select-none gap-4 flex items-center bg-white border border-[#1d2846] pl-1.5 pr-1.5 w-full hover:bg-[#f2f2f2]"
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
            <div class="selector flex items-center border border-[#ddd] rounded-[4px] px-2 focus-within:border-[#5781A5] focus-within:shadow-secondary">
                <!-- Selected items display as pins -->
                <div class="pins flex gap-1">
                    {#each selectedOptions as option}
                        <div class="pin cursor-pointer flex items-center bg-[#f0f4f8] rounded-[16px] px-2 py-1 m-0.5 text-sm gap-1.5">
                            <span class="pin-text">{toSentenceCase(option.title)}</span>
                            <span
                                    class="pin-remove flex items-center justify-center text-[12px]"
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
                        bind:value={searchInput}
                        placeholder={placeholder}
                        onInput={openMenu}
                        onBackspace={() => {selectedOptions.length > 0 && removeLastOption()}}
                        onEnter={() => {canCreateNew && createNewOption()}}
                        onEscape={clearSelection}
                />

                <!-- Action buttons (clear selection) -->
                <div class="selector-actions flex items-center">
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
        <div id="option-dropdown" class="dropdown-menu absolute left-0 right-0 top-full z-[90] bg-white rounded-[0.25em] border border-[#ccc] shadow-md w-[200px] p-[0.3em]">
            <div class="dropdown-menu-content flex flex-col gap-[0.2em] py-[0.5em]" role="listbox">
                <!-- Filtered options -->
                {#if filteredOptions.length > 0}
                    {#each filteredOptions as option}
                        <div class="option-item cursor-pointer flex flex-col rounded-[0.4em] p-[0.3em] transition-colors duration-250 ease-in-out hover:bg-[#f5f5f5] focus:bg-[#f5f5f5]"
                             class:bg-[#f5f5f5]={selectedOptions.some(item => item.id === option.id)}
                             role="option"
                             tabindex="0"
                             aria-selected={selectedOptions.some(item => item.id === option.id)}
                             on:click|stopPropagation={() => selectOption(option)}
                             on:keydown={(e) => (e.key === 'Enter') && selectOption(option)}
                        >
                            <DropDownItem text={toSentenceCase(option.title)}>
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
                                class="option-item create-new text-[#4a90e2] italic"
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
                    <div class="option-item no-options text-[#888] italic">
                        Start typing...
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

