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
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {capitalizeWords, toSentenceCase} from "../../hooks/reusable";

  import Button from "../individual/Button.svelte";
  import UniIcon from "../individual/DdlIcon.svelte";
  import InputField from "../individual/InputField.svelte";
  import DropDownItem from "../individual/DropDownItem.svelte";

  // Props
  /**
   * @prop {Array<{ title: string, [key: string]: any }>} options - Array of selectable options.
   */
  export let options: any[] = [];

  /** @type {string} itemInput - Checks if parent is an Item Input component (todos) */
  export let itemInputType: string = '';

  /** @type {Object} defaultOption - default option */
  export let defaultOption: any | null = null;

  /** @type {string} workspaceTitle - the workspace title */
  export let workspaceTitle: string | null = "";

  /** @type {Array} selectedLabels - Array of selected labels workspace title */
  export let selectedOptions: any[] = [];

  // Internal state
  /**
   * @prop {string} filterPlaceholder - Placeholder text for the search input field.
   * @default ""
   */
  let filterPlaceholder =`Type a ${itemInputType} name`;

  /** @type {string} filterQuery - User's search input. */
  let filterQuery: string = '';

  /** @type {Array} filteredOptions - Options filtered based on the search query. */
  let filteredOptions: any[] = [];

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
  const handleSelect = (option: any) => dispatch('select', option);

  /**
   * Handles the creation of a new option when no existing options match the query.
   * Emits the `create` event with the newly created option.
   */
  const handleCreate = () => {
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
<div class="filter-search flex flex-col gap-[0.5em] w-full">

    <!--
      Search Input Section:
      - Displays an input field for users to type their search query.
      - The input is bound to `filterQuery` for real-time filtering.
    -->
    <div class="filter-input-container flex items-center border-b border-[#eee] pb-[0.5em]">
        <InputField
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
    <div class="filter-results max-h-[200px] overflow-y-auto">
        {#if !filterQuery && itemInputType !== "label"}
            <!-- Default Option -->
            <div class="option-item cursor-pointer flex flex-col rounded-[0.4em] py-[0.3em] transition-colors duration-200 hover:bg-[#f5f5f5]"
                 role="button"
                 tabindex="0"
                 on:click={() => handleSelect(defaultOption)}
                 on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(defaultOption)}
            >
                <!--
                      DropDownItem:
                      - Displays the option title with optional left and right icons.
                      - Clicking an option triggers a `select` event.
                    -->
                <DropDownItem text={capitalizeWords(defaultOption?.title)}>
                    <svelte:fragment slot="leftIcon"><UniIcon><span>L</span></UniIcon></svelte:fragment>
                    <svelte:fragment slot="rightIcon"><UniIcon><span>R</span></UniIcon></svelte:fragment>
                </DropDownItem>
            </div>

            {#if filteredOptions.length > 1}
                <span>{workspaceTitle && capitalizeWords(workspaceTitle)}</span>
            {/if}
        {/if}

        <!-- List Options -->
        {#each filteredOptions as option}
            {#if option.title !== defaultOption?.title || filterQuery || itemInputType === "label"}
                <div class="option-item cursor-pointer flex flex-col rounded-[0.4em] py-[0.3em] transition-colors duration-200 hover:bg-[#f5f5f5]"
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
                    <DropDownItem text={option.title}>
                        <svelte:fragment slot="leftIcon"><UniIcon><span>L</span></UniIcon></svelte:fragment>
                        <svelte:fragment slot="rightIcon">
                            {#if selectedOptions.some(selected => selected?.id === option.id)}
                                <UniIcon><span>✔</span></UniIcon>
                            {:else}
                                <UniIcon><span>R</span></UniIcon>
                            {/if}
                        </svelte:fragment>
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
            <div class="no-results flex flex-col gap-[0.5em] text-[#666]">
                <span class="no-type">Add a {capitalizeWords(itemInputType)}.</span>
                <Button onClick={handleCreate}>
                    + Create "{filterQuery}"
                </Button>
            </div>
        {/if}
    </div>
</div>

