<!-- InputItem -->
<script lang="ts">
    import { addToStore, todos, tasks, defaultTask, defaultReminder, defaultPriority } from '../../store/store';
    import type { Task } from '../../store/types';
    import InputField from '../indivitual/InputField.svelte';
    import TaskSelector from './TaskSelector.svelte';
    import Button from '../indivitual/Button.svelte';

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
     * Adds a new to-do item to the `todos` store.
     * - Requires a non-empty `title`.
     * - Links the to-do item to the selected task, default priority, and default reminder.
     * - Clears the form fields after successful addition.
     */
    const addItem = () => {
        if (title.trim()) {
            addToStore(todos, {
                title,
                description,
                taskId: selectedTask.id,
                priorityId: defaultPriority.id,
                labelIds: [],
                locationId: '',
                reminderIds: [defaultReminder.id],
                dueDate: null,
            });
            title = '';
            description = '';
            selectedTask = defaultTask;
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
                id="add-todo-title"
                textSize="medium"
                bind:value={title}
                placeholder="Type a todo"
                onEnter={addItem}
        />
        <InputField
                type="text"
                id="add-todo-description"
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
    <div class="add-actions"></div>

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

