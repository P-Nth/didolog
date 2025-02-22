<!-- ItemSelector Component -->
<script>
  // Import the UniIcon function.
  import { addItem } from '../../store/store.js';
  import {toSentenceCase} from "../../hooks/reusable.js";
  import FilterSearch from "./FilterSearch.svelte";
  import UniIcon from "../indivitual/UniIcon.svelte";

  /**
   * @prop {Array<Object>} items - Array of dropdown item objects.
   * Each item should have:
   * - id: Unique identifier.
   * - text: The text to display.
   * - leftIcon (optional): URL for a left icon.
   * - rightIcon (optional): URL for a right icon.
   */
  export let options = []

  /**
   * @prop {string} placeholder - Text shown when no option is selected.
   */
  export let placeholder = '';

  /**
   * @prop {string} filterPlaceholder - Text shown in the search filter input.
   */
  export let filterPlaceholder = 'Type a task name';

  /**
   * @prop {string} type - Type of data being selected (task, workspace)
   */
  export let type = "task";

  /**
   * @prop {string} selectorTitle - Text displayed as the initial selector title (task, workspace)
   * @prop {string} selectorTitle - ID if  the initial selected task or workspace
   */
  export let selectorTitle = placeholder;
  export let selectedItemId = options[0]?.id;
  /**
   * @prop {boolean} open - Controls whether the dropdown menu is open.
   */
  let open = false;

  /**
   * Toggle the dropdown menu open/close state.
   */
  function toggleMenu() {
    open = !open;
  }

  /**
   * Close the dropdown menu.
   */
  function closeMenu() {
    open = false;
  }

  /**
   * Clear the selection made.
   */
  function clearSelection() {
    selectedItemId = options[0]?.id;
    selectorTitle = placeholder;
    closeMenu()
  }

  /**
   * Handle the selection of a dropdown item.
   * Updates the selected text and closes the dropdown.
   *
   * @param {Object} event - Custom event with selected item in detail.
   */
  function handleSelect(event) {
    const item = event.detail;

    if (item.id === "none") {
      // If the user doesn't select a task, link it to the default option
      selectorTitle = placeholder;
      selectedItemId = options[0]?.id;
    } else {
      // Otherwise, link it to the selected item
      selectedItemId = item.id;
      selectorTitle = toSentenceCase(item.title);
    }

    closeMenu();
  }

  /**
   * Handle creating a new item.
   * Adds the item to the store and waits for store update before selecting it.
   *
   * @param {Object} event - Custom event with item details
   */
  function handleCreate(event) {
    const { title } = event.detail;

    // Add the item to the store
    addItem(title, '', type);
  }

  /**
   * Custom Svelte action to detect clicks outside a given node.
   * When a click occurs outside the node, a "clickOutside" event is dispatched.
   *
   * @param {HTMLElement} node - The element to watch.
   * @returns {Object} - An object with a destroy function to remove the event listener.
   */
  function clickOutside(node) {
    const handleClick = event => {
      if (!node.contains(event.target)) {
        node.dispatchEvent(new CustomEvent('clickOutside'));
      }
    };
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
</script>

<!--
  Selector Component
  ------------------
  This component provides a dropdown selector with search functionality.
  - Clicking the selector opens the dropdown containing a `SearchFilter` component.
  - Users can search through provided options (e.g., tasks or projects).
  - If no match is found, the `SearchFilter` allows adding a new option.
  - Selected items update the selector title and trigger selection handling.
-->
<div class="selector-container" use:clickOutside on:clickOutside={closeMenu}>
    <!--
      Selector Container:
      -------------------
      - Wraps the entire selector and dropdown.
      - Uses the `clickOutside` action to detect clicks outside the container and close the dropdown.
      - The `on:clickOutside` event calls the `closeMenu` function.
    -->

    <div class="selector-content">
        <!--
          Selector Button:
          ----------------
          - Displays the currently selected option (`selectorTitle`) or the placeholder if none is selected.
          - Clicking this element toggles the dropdown menu via `toggleMenu`.
          - The `|stopPropagation` modifier prevents click events from bubbling, avoiding unwanted dropdown toggles.
        -->
        <div class="selector" on:click|stopPropagation={toggleMenu} on:keydown={toggleMenu}>
            <p>{selectorTitle}</p>
            {#if selectorTitle === placeholder}
                <!-- Placeholder Icon:
                     Shown when no option is selected to indicate the selector is empty.
                -->
                <UniIcon size="16px"><span>R</span></UniIcon>
            {/if}
        </div>

        {#if selectorTitle !== placeholder}
            <!--
              Clear Selection Button:
              -----------------------
              - Appears when an option is selected.
              - Clicking this icon clears the current selection by calling `clearSelection`.
              - `|stopPropagation` prevents the event from affecting the dropdown state.
            -->
            <span class="clear-selection" on:click={clearSelection} on:keydown={clearSelection}>
                <UniIcon size="12px"><span>X</span></UniIcon>
            </span>
        {/if}
    </div>

    {#if open}
        <!--
          Dropdown Menu:
          --------------
          - Rendered when the `open` state is true.
          - Contains the `SearchFilter` component for searching and selecting options.
          - Clicking outside this container triggers `clickOutside` to close the menu.
        -->
        <div class="dropdown-menu">
            <div class="dropdown-menu-content">
                <!--
                  SearchFilter Component:
                  -----------------------
                  - Provides real-time filtering of the given `options`.
                  - Displays "Task not found" when no matches are found.
                  - Offers a button to add a new task when no existing match is found.
                  - Emits a `select` event handled by `handleSelect` to update the selection.
                -->
                <FilterSearch
                        {options}
                        type={type}
                        {filterPlaceholder}
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

    /* Styles for the clickable selector */
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
        gap: 1em;
        display: flex;
        align-items: center;
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

