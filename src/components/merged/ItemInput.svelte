<!--
  ItemInput Component
  -------------------
  This component allows users to add new items (tasks or todos) with:
  - An input field for the item's title.
  - An optional input field for the item's description.
  - A dropdown selector (for todos) to link the new todo to a task.
  - An "Add" button to submit the new item.

  Key Features:
  - The "Enter" key submits the form.
  - Input fields are cleared after a successful addition.
  - For todos, the selector defaults to the first task in the tasks store.
-->
<script>
  // Import the addItem function to add items to the store and the tasks store for task data.
  import { addItem, tasks, priorities, labels } from '../../store/store.js';

  // Import reusable UI components.
  import {capitalizeWords} from "../../hooks/reusable.js";
  import ItemSelector from "./ItemSelector.svelte";
  import Button from "../indivitual/Button.svelte";
  import InputField from "../indivitual/InputField.svelte";

  /**
   * Component Props:
   * ----------------
   * @prop {string} type - The type/category of the item (e.g., "task" or "todo"). Defaults to "task".
   * @prop {string} placeholder - Placeholder text for the title input field.
   * @prop {number} workspaceId - workspace ID for the item being added.
   * @prop {string} descPlaceholder - Placeholder text for the description input field.
   */
  export let type = "";
  export let placeholder = "";
  export let workspaceId = null;
  export let descPlaceholder = "Description";

  // Local state variables:
  let newItem = ''; // Title of the new item
  let newItemDescription = ''; // Description of the new item
  let selectedTaskId = $tasks[0].id; // Selected task ID for todos (defaults to the first task, typically "inbox")
  let selectorTitle = capitalizeWords($tasks[0].title); // Title displayed in the selector for the selected task
  let selectedPriorityId = $priorities[3].id; // Selected task ID for todos (defaults to the first task, typically "inbox")
  let selectorPriorityTitle = capitalizeWords($priorities[3].title); // Title displayed in the selector for the selected task
  let selectedLabelId = null; // Selected label ID for todos
  let selectorLabelTitle = 'Label'; // Title displayed in the selector for the selected label


  /**
   * Reactive statement to keep the task selector's title and ID in sync with the `$tasks` store.
   *
   * Behavior:
   * 1. **Finds the currently selected task** based on `selectedTaskId`.
   * 2. **If the selected task is invalid or has been deleted:**
   *    - Defaults the selection to the first task in `$tasks` (commonly the "inbox").
   *    - Updates `selectedTaskId` and `selectorTitle` to match the default task.
   * 3. **If a valid task is found:**
   *    - Updates `selectorTitle` to reflect any changes to the task title (e.g., after renaming).
   *
   * This ensures the selector UI:
   * - Never points to a deleted or non-existent task.
   * - Always displays the latest task title.
   */
  $: {
    const validTask = $tasks.find(task => task.id === selectedTaskId); // Find the currently selected task

    if (!validTask && $tasks.length > 0) {
      // 🛡️ Fallback: If selected task doesn't exist (e.g., after deletion), default to the first task
      selectedTaskId = $tasks[0].id; // Set selected task to the first available task
      selectorTitle = capitalizeWords($tasks[0].title); // Update title with sentence case formatting
    } else if (validTask) {
      // 🔄 Keep title updated if the task exists and its title changes
      selectorTitle = capitalizeWords(validTask.title); // Sync selector title with the current task's title
    }
  }

  /**
   * addToStore Function:
   * --------------------
   * Adds a new item to the global store:
   * - Trims whitespace from inputs.
   * - Calls `addItem` with the new item title, description, type, and selected task ID.
   * - Resets input fields and selector state after successful addition.
   */
  function addToStore() {
    if (newItem.trim()) {
      if (type !== "todo") {
        addItem(
          newItem.trim().toLowerCase(),
          newItemDescription.trim().toLowerCase(),
          type,
          null,
          workspaceId,
        );
      } else {
        addItem(
          newItem.trim().toLowerCase(),
          newItemDescription.trim().toLowerCase(),
          type,
          selectedTaskId,
          null,
          selectedPriorityId,
          selectedLabelId
        );
      }

      // Reset the input fields and selector to default values
      newItem = '';
      newItemDescription = '';
      selectedTaskId = $tasks[0].id; // Reset to "inbox" task
      selectorTitle = capitalizeWords($tasks[0].title); // Reset selector title
      selectedPriorityId = $priorities[3].id; // Selected task ID for todos (defaults to the first task, typically "inbox")
      selectorPriorityTitle = capitalizeWords($priorities[3].title); // Title displayed in the selector for the selected task
      selectedLabelId = null; // Selected label ID for todos
      selectorLabelTitle = 'label'; // Title displayed in the selector for the selected label
    }
  }
</script>

<!--
  Component Markup:
  -----------------
  Layout:
  - A container with two sections:
    1. Input fields for title and description.
    2. Form actions with a selector (for todos) and an add button.
-->
<div class="input-container">
    <div class="input-section">
        <!--
          Title InputField:
          -----------------
          - Binds to `newItem` for the item title.
          - Displays `placeholder` text.
          - Pressing "Enter" triggers `addToStore`.
        -->
        <InputField
                type="text"
                textSize="medium"
                bind:value={newItem}
                placeholder={placeholder}
                onEnter={addToStore}
        />

        <!--
          Description InputField:
          -----------------------
          - Binds to `newItemDescription` for the item description.
          - Displays `descPlaceholder` text.
          - Pressing "Enter" triggers `addToStore`.
        -->
        <InputField
                type="text"
                variant="description"
                placeholder={descPlaceholder}
                bind:value={newItemDescription}
                onEnter={addToStore}
        />
    </div>

    {#if type === 'todo'}
        <div class="add-actions">

        </div>
    {/if}

    <div class="type-selector">
        {#if type === 'todo'}
            <!--
              ItemSelector Component (for todos):
              --------------------------------
              - Displays a dropdown to select a related task.
              - Options are sourced from the `$tasks` store.
              - Binds:
                - `selectorTitle`: Displays the selected task title.
                - `selectedTaskId`: Tracks the selected task's ID.
              - Defaults to the "inbox" task if none is selected.
            -->
            <ItemSelector
                    options={$tasks}
                    workspaceId={workspaceId}
                    placeholder={capitalizeWords("inbox")}
                    bind:selectorTitle={selectorTitle}
                    bind:selectedItemId={selectedTaskId}
            />
        {/if}

        <!--
          Cancel Button:
          -----------
          - Click triggers `clear selection` and dont add the new item.

          Add Button:
          -----------
          - Click triggers `addToStore` to add the new item.
          - Disabled if the title input is empty or contains only whitespace.
        -->
        <div class="input-action">
            <Button size="small" onClick={addToStore} disabled={!newItem || !newItem.trim()}>
                Add
            </Button>
        </div>
    </div>
</div>

<!-- Styling the Item Input -->
<style>
    .input-container {
        gap: 1em;
        display: flex;
        flex-direction: column;
    }

    .input-section {
        gap: .1em;
        display: flex;
        flex-direction: column;
    }

    .add-actions {
        gap: .5em;
        display: flex;
    }

    .type-selector {
        gap: 1rem;
        display: flex;
        justify-content: space-between;
    }
</style>

