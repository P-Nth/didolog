<!-- ItemSelector Component -->
<script lang="ts">
    // Import the UniIcon function.
    import { createEventDispatcher } from 'svelte';
    import UniIcon from "../indivitual/UniIcon.svelte";
    import DatePicker from "../indivitual/DatePicker.svelte";

    /**
    * @prop {string} selectorTitle - Text displayed as the initial selector title (task, workspace)
    */
    export let selectorTitle: [string, string] = ["", ""];

    /**
    * @prop {boolean} open - Controls whether the dropdown menu is open.
    */
    let menuOpen = false;

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
     * Handles the selection of a label.
     * - Adds the label if not already selected.
     * - Removes the label if it's already selected.
     * - Dispatches a 'select' event with updated selections.
     *
     * @param {CustomEvent<Label>} event - The event containing the selected label.
     */
    function handleSelect(event: CustomEvent<[string, string]>) {
        selectorTitle = event.detail;

        dispatch("select", selectorTitle);
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

<div class="selector-container" use:clickOutside>
    <div
            class="selector"
            role="button"
            tabindex="0"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            on:click|stopPropagation={toggleMenu}
            on:keydown={toggleMenu}
    >
        <!-- Displays the selected task title in sentence case -->
        <span>
            {selectorTitle[0]
              ? `${selectorTitle[0]} ${selectorTitle[1] ? selectorTitle[1] : ""}`.trim()
              : "Date"}
        </span>

        <div class="flex items-center gap-2">
            {#if (selectorTitle === null)}
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
                        on:click={(clearSelection)}
                        on:keydown={(e) => (e.key === 'Enter') && clearSelection()}
                >
                    <UniIcon><span>X</span></UniIcon>
                </span>
            {/if}
        </div>
    </div>

    {#if menuOpen}
        <div class="dropdown-menu">
            <div class="dropdown-menu-content">
                <DatePicker selectedDateTime={selectorTitle} on:select={handleSelect} />
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
        gap: .3em;
        display: flex;
        flex-direction: column;
        padding: .5em 0;
    }
</style>

