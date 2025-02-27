<!--
  SearchFilter Component

  Description:
  This component provides a search and selection interface with the following features:
  - Displays a list of options that can be filtered via a search input.
  - Allows users to select an existing option.
  - Offers the ability to create a new option if no matches are found.

  Usage:
  - Pass an array of option objects (with at least a `title` property) via the `options` prop.
  - Set the `type` prop to specify the item type (e.g., "task" or "workspace").
  - Use the `filterPlaceholder` prop to customize the search input placeholder.
  - Listen to `select` and `create` events to handle user actions in the parent component.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import {capitalizeWords, toSentenceCase} from "../../hooks/reusable.ts";
  import Button from "../indivitual/Button.svelte";
  import UniIcon from "../indivitual/UniIcon.svelte";
  import InputField from "../indivitual/InputField.svelte";
  import DropDownItem from "../indivitual/DropDownItem.svelte";

  /**
   * @component SearchFilter
   * @description
   * A reusable component for searching, selecting, and creating items (e.g., tasks or workspaces).
   *
   * Events:
   * - `select`: Fired when an existing option is selected.
   * - `create`: Fired when a new option is created.
   */

  // Props
  /**
   * @prop {Array<{ title: string, [key: string]: any }>} options - Array of selectable options.
   */
  export let options = [];

  /** @type {string} itemInput - Checks if parent is an Item Input component (todos) */
  export let itemInputType = '';

  /** @type {Object} defaultOption - default option */
  export let defaultOption = {};

  /** @type {string} workspaceTitle - the workspace title */
  export let workspaceTitle = "";

  /** @type {Array} selectedLabels - Array of selected labels workspace title */
  export let selectedLabels = [];

  // Internal state
  /**
   * @prop {string} filterPlaceholder - Placeholder text for the search input field.
   * @default ""
   */
  let filterPlaceholder =`Type a ${itemInputType} name`;

  /** @type {string} filterQuery - User's search input. */
  let filterQuery = '';

  /** @type {Array} filteredOptions - Options filtered based on the search query. */
  let filteredOptions = [];

  // Event dispatcher
  /** @const dispatch - Emits 'select' and 'create' events for parent components. */
  const dispatch = createEventDispatcher();

  // Filtering logic
  /**
   * Filters the options array based on the user's query.
   * - Displays all options if the query is empty.
   * - Otherwise, shows options with titles containing the query string.
   */
  $: {
    if (filterQuery.trim() === '') {
      filteredOptions = [...options];
    } else {
      const query = filterQuery.toLowerCase().trim();
      filteredOptions = options.filter(option =>
        option.title.toLowerCase().includes(query)
      );
    }
  }

  /**
   * Handles selection of an existing option.
   * Emits the `select` event with the selected option.
   *
   * @param {Object} option - The selected option object.
   */
  function handleSelect(option) {
    dispatch('select', option);
  }

  /**
   * Handles selection of an existing option.
   * Emits the `toggle` event with the selected option.
   *
   * @param {Object} option - The selected option object.
   */
  function handleToggle(option) {
    dispatch('toggle', option);
  }

  /**
   * Handles the creation of a new option when no existing options match the query.
   * Emits the `create` event with the newly created option.
   */
  function handleCreate() {
    if (!filterQuery.trim()) return;

    const newOption = {
      title: filterQuery.trim(),
      description: ''
    };

    dispatch('create', newOption);
  }
</script>

<!--
  Component Layout:
  - Search Input: Provides a field for users to type and filter options.
  - Results List: Displays filtered options. Users can select an option or create a new one.
-->
<div class="filter-search">

    <!--
      Search Input Section:
      - Displays an input field for users to type their search query.
      - The input is bound to `filterQuery` for real-time filtering.
    -->
    <div class="filter-input-container">
        <InputField
                type="text"
                bind:value={filterQuery}
                placeholder={toSentenceCase(filterPlaceholder)}
        />
    </div>

    <!--
      Results Section:
      - Shows a list of filtered options.
      - If options are found: Displays them as clickable items.
      - If no options match: Shows a "not found" message and a button to create a new item.
    -->
    <div class="filter-results">
        {#if !filterQuery && itemInputType !== "label"}
            <!-- Default Option -->
            <div class="option-item"
                 role="button"
                 tabindex="0"
                 on:click={() => handleSelect(filteredOptions[0])}
                 on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(filteredOptions[0])}
            >
                <!--
                      DropDownItem:
                      - Displays the option title with optional left and right icons.
                      - Clicking an option triggers a `select` event.
                    -->
                <DropDownItem text={capitalizeWords(defaultOption?.title)} size="small">
                    <svelte:fragment slot="leftIcon"><UniIcon><span>L</span></UniIcon></svelte:fragment>
                    <svelte:fragment slot="rightIcon"><UniIcon><span>R</span></UniIcon></svelte:fragment>
                </DropDownItem>
            </div>

            {#if filteredOptions.length > 1}
                <span>{capitalizeWords(workspaceTitle)}</span>
            {/if}
        {/if}

        <!-- List Options -->
        {#each filteredOptions as option}
            {#if option.title !== defaultOption?.title || filterQuery || itemInputType === "label"}
                <div class="option-item"
                     role="button"
                     tabindex="0"
                     on:click={() => handleSelect(option)}
                     on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(option)}
                >
                    <!--
                      DropDownItem:
                      - Displays the option title with optional left and right icons.
                      - Clicking an option triggers a `select` event.
                    -->
                    <DropDownItem
                            text={option.title} size="small"
                            dropdownItemType={itemInputType}
                            isChecked={selectedLabels.includes(option.id)}
                            on:select={() => handleToggle(option)}
                    >
                        <svelte:fragment slot="leftIcon"><UniIcon><span>L</span></UniIcon></svelte:fragment>
                        <svelte:fragment slot="rightIcon"><UniIcon><span>R</span></UniIcon></svelte:fragment>
                    </DropDownItem>
                </div>
            {/if}
        {/each}

        <!--
          No Results Found:
          - Informs the user that no matching options were found.
          - Provides a button to create a new item with the current search query.
        -->
        {#if filteredOptions.length === 0}
            <div class="no-results">
                <span class="no-type">Add a {capitalizeWords(itemInputType)}.</span>
                <Button onClick={handleCreate} size="small" variant="tertiary">
                    + Create "{filterQuery}"
                </Button>
            </div>
        {/if}
    </div>
</div>

<!-- Search Filter Styles -->
<style>
    .filter-search {
        gap: .5em;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .filter-input-container {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding-bottom: .5em;
    }

    .filter-results {
        max-height: 200px;
        overflow-y: auto;
    }

    .option-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        border-radius: .4em;
        padding: .3em 0;
        transition: background-color .25s ease-in-out;
    }

    .option-item:hover {
        background-color: #f5f5f5;
    }

    .no-results {
        gap: .5em;
        display: flex;
        flex-direction: column;
        color: #666;
    }
</style>

