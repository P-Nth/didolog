<!--
  PrioritySelector Component

  This component provides a dropdown menu for selecting a priority.
  - Displays a list of priority options.
  - Allows clearing the current selection and resetting to the default option.
  - Emits a `select` event with the chosen priority when an option is selected.
  - Handles closing the dropdown when clicking outside the component.
-->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { toSentenceCase } from "../hooks/reusable";
    import type { Priority } from '../store/types';
    import UniIcon from "../components/indivitual/UniIcon.svelte";
    import DropDownItem from "../components/indivitual/DropDownItem.svelte";

    /**
     * Array of selectable priority options.
     * Provided as a prop to the component.
     * @type {Priority[]}
     */
    export let options: Priority[] = [];

    /**
     * The default priority option.
     * Used when no specific priority is selected.
     * @type {Priority}
     */
    export let defaultOption: Priority;

    /**
     * Currently selected priority option.
     * Defaults to `defaultOption` if none is selected.
     * @type {Priority}
     */
    export let selectedOption: Priority = defaultOption;

    /**
     * Tracks the state of the dropdown menu.
     * `true` if the menu is open, `false` otherwise.
     * @type {boolean}
     */
    let menuOpen: boolean = false;

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
     * Clears the current priority selection by resetting it to the default option.
     * Dispatches a `select` event with the `defaultOption`.
     */
    function clearSelection() {
        dispatch('select', defaultOption);
        closeMenu();
    }

    /**
     * Handles the selection of a priority from the dropdown menu.
     * Dispatches a `select` event with the selected priority and closes the menu.
     *
     * @param {Priority} option - The selected priority option.
     */
    function handleSelect(option: Priority) {
        dispatch('select', option);
        closeMenu();
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
  Container for the task selector dropdown.
  - Uses the `clickOutside` action to detect clicks outside and close the menu.
-->
<div class="selector-container relative flex" use:clickOutside>
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
            class="selector cursor-pointer select-none flex items-center gap-[1em] bg-white rounded-[0.25em] border border-[#1d2846] px-[0.4em] w-full hover:bg-[#f2f2f2]"
            role="button"
            tabindex="0"
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            on:click|stopPropagation={toggleMenu}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMenu()}
    >
        <!-- Displays the selected task title in sentence case -->
        <span>{toSentenceCase(selectedOption.title === "none" ? "Priority" : selectedOption.title)}</span>

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
                        class="clear-selection flex rounded-[0.25em]"
                        role="button"
                        tabindex="0"
                        on:click={(clearSelection)}
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
        <div class="dropdown-menu absolute left-0 right-0 top-full z-[90] bg-white rounded-[0.25em] border border-[#ccc] shadow-[0_2px_5px_rgba(0,0,0,0.15)] w-[200px] p-[0.3em]">
            <div class="dropdown-menu-content flex flex-col gap-[0.2em] py-[0.5em]">
                {#each options as option}
                    <div
                            class="option-item cursor-pointer flex flex-col rounded-[0.4em] py-[0.3em] transition-colors duration-250 ease-in-out hover:bg-[#f5f5f5]"
                            class:selected={options.some(item => item.id === option.id)}
                            role="option"
                            tabindex="0"
                            aria-selected={options.some(item => item.id === option.id)}
                            on:click|stopPropagation={() => handleSelect(option)}
                            on:keydown={(e) => (e.key === 'Enter') && handleSelect(option)}
                    >
                        <!--
                          DropDownItem:
                          - Displays the option title with optional left and right icons.
                          - Clicking an option triggers a `select` event.
                        -->
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
            </div>
        </div>
    {/if}
</div>

