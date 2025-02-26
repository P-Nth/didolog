<!--
InputItem.svelte

Description:
This component provides an interface for adding new to-do items. It includes:
- Input fields for the to-do title and description.
- A task selector for linking the to-do to a specific task.
- A button to submit and add the to-do item.

Props:
None.

State:
- title (string): The entered to-do item title.
- description (string): The entered to-do item description.
- selectedTask (Task): The task linked to the to-do item, defaulting to `defaultTask`.

Functions:
- addItem(): Adds a new to-do item to the `todos` store with associated default values for priority, reminder, and completion status.
- handleTaskSelect(event): Updates `selectedTask` when a task is selected from the `ItemSelector`.

Usage:
Fill in the title and description, select a task (optional), and click the add button to create a new to-do item.

Example:
<InputItem />
-->
<script lang="ts">
    import { addToStore, todos, tasks, priorities, defaultTask, defaultPriority, defaultReminder } from '../../store/store';
    import type {Task, Priority} from '../../store/types';
    import Button from '../indivitual/Button.svelte';
    import TaskSelector from './TaskSelector.svelte';
    import InputField from '../indivitual/InputField.svelte';
    import PrioritySelector from "./PrioritySelector.svelte";

    /**
     * Title of the to-do item entered by the user.
     * @type {string}
     */
    let title: string = '';

    /**
     * Description of the to-do item entered by the user.
     * @type {string}
     */
    let description: string = '';

    /**
     * Currently selected task for the to-do item.
     * Defaults to the predefined default task.
     * @type {Task}
     */
    let selectedTask: Task = defaultTask;

    /**
     * Currently selected priority for the to-do item.
     * - Determines the urgency or importance of the to-do item.
     * - Defaults to the predefined `defaultPriority` if no selection is made.
     * @type {Priority}
     */
    let selectedPriority: Priority = defaultPriority;

    /**
     * Adds a new to-do item to the `todos` store.
     * - Requires a non-empty `title`.
     * - Links the to-do item to the selected task, default priority, default reminder, and isComplete.
     * - Clears the form fields after successful addition.
     */
    const addItem = () => {
        if (title.trim()) {
            addToStore(todos, {
                title,
                description,
                taskId: selectedTask.id,
                priorityId: selectedPriority.id,
                labelIds: [],
                locationId: '',
                reminderIds: [defaultReminder.id],
                dueDate: null,
                isComplete: false
            });
            title = '';
            description = '';
            selectedTask = defaultTask;
            selectedPriority = defaultPriority;
        }
    };

    /**
     * Handles the selection of a task from the `ItemSelector` component.
     * Updates the `selectedTask` with the task chosen by the user.
     *
     * @param {CustomEvent<Task>} event - The custom event containing the selected task.
     */
    const handleTaskSelect = (event: CustomEvent<Task>) => {
        selectedTask = event.detail;
    };

    /**
     * Handles the selection of a priority from the priority selector component.
     * - Updates the `selectedPriority` with the priority chosen by the user.
     *
     * @param {CustomEvent<Priority>} event - The custom event containing the selected priority in its `detail` property.
     */
    const handlePrioritySelect = (event: CustomEvent<Priority>) => {
        selectedPriority = event.detail;
    };
</script>

<!--
  Container for the entire input section, including fields for the to-do title, description, task selector, and add button.
-->
<div class="input-container">

    <!--
      Section containing input fields for the to-do item's title and description.
      - `InputField` for the title:
          - Binds to `title` variable.
          - Triggers `addItem` on pressing Enter.
          - Placeholder guides the user to type the to-do title.
      - `InputField` for the description:
          - Binds to `description` variable.
          - Uses "description" variant styling.
          - Triggers `addItem` on pressing Enter.
          - Placeholder guides the user to add notes.
    -->
    <div class="input-section">
        <InputField
                type="text"
                textSize="medium"
                bind:value={title}
                placeholder="Type a todo"
                onEnter={addItem}
        />
        <InputField
                type="text"
                variant="description"
                bind:value={description}
                placeholder="Notes"
                onEnter={addItem}
        />
    </div>

    <!--
      Placeholder for additional action buttons or future enhancements.
      Currently empty.
    -->
    <div class="add-actions">
        <PrioritySelector
                options={$priorities}
                defaultOption={defaultPriority}
                selectedOption={selectedPriority}
                on:select={handlePrioritySelect}
        />
    </div>

    <!--
      Section for selecting the task type and submitting the to-do item.
      - `ItemSelector`:
          - Displays available tasks from `$tasks` store.
          - Highlights `defaultTask` as the default option.
          - Updates `selectedTask` when a task is selected.
      - `Button`:
          - Adds the to-do item when clicked.
          - Disabled if `title` is empty or contains only whitespace.
    -->
    <div class="type-selector">
        <TaskSelector
                options={$tasks}
                defaultOption={defaultTask}
                selectedOption={selectedTask}
                on:select={handleTaskSelect}
        />

        <div class="input-action">
            <Button size="small" onClick={addItem} disabled={!title || !title.trim()}>
                Add
            </Button>
        </div>
    </div>
</div>

<!-- ItemInput Styles -->
<style>
    .input-container {
        gap: 1em;
        display: flex;
        flex-direction: column;
    }

    .input-section {
        gap: .3em;
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

