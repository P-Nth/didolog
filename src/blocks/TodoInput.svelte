<!--
TodoItem.svelte

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
    import {createEventDispatcher, onMount, tick} from "svelte";
    import {
        addBlock,
        tasks,
        addToStore,
        priorities,
        labels,
        reminders, selectedTask,
    } from '../store/store';
    import type {Task, Todo, Priority, Label, Reminder} from '../store/types';

    import TaskSelector from './TaskSelector.svelte';
    import DateSelector from "./DateSelector.svelte";
    import LabelSelector from "./LabelSelector.svelte";
    import PrioritySelector from "./PrioritySelector.svelte";
    import Button from '../components/individual/Button.svelte';
    import InputField from '../components/individual/InputField.svelte';
    import ItemSelector from "../components/merged/ItemSelector.svelte";

    /**
     * Currently selected task for the to-do item.
     * Defaults to the predefined default task.
     */
    $: newSelectedTask = $selectedTask;

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
     * Represents the due date for the to-do item.
     * Stored as a tuple with two string values: [startDate, endDate].
     * Defaults to empty strings, indicating no due date is set.
     * @type {[string, string]}
     */
    let dueDate: [string, string] = ["", ""];

    /**
     * Currently selected labels for the to-do item.
     * Users can select one or more labels.
     * @type {Reminder[]}
     */
    let selectedReminders: Reminder[] = [];

    /**
     * Currently selected priority for the to-do item.
     * - Determines the urgency or importance of the to-do item.
     * - Defaults to the predefined `defaultPriority` if no selection is made.
     * @type {Priority}
     */
    const defaultPriority: Priority = $priorities.find(item => item.isDefault)!;
    let selectedPriority = defaultPriority;

    /**
     * Currently selected labels for the to-do item.
     * Users can select one or more labels.
     * @type {Label[]}
     */
    let selectedLabels: Label[] = [];

    /**
     * Reference to the `InputField` component.
     * This allows us to call functions exposed by `InputField`.
     */
    let inputRef: InputField | null = null;

    /**
     * Focuses the todo input field.
     * Calls the `focusInput()` method exposed by the `InputField` component.
     */
    export const focusTodoInput = () => inputRef?.focusInput();

    /**
     * Ensures focus is on the input on mount
     */
    onMount(() => { focusTodoInput(); });

    /**
     * Creates a Svelte event dispatcher for emitting custom events.
     * Used to notify parent components of changes (e.g., selection updates).
     */
    const dispatch = createEventDispatcher();

    const addItem = () => {
        addBlock<Todo>({
            type: "todo",
            title,
            description,
            parentId: newSelectedTask.id,
            dueDate: dueDate,
            priorityId: selectedPriority.id,
            labelIds: selectedLabels.map(label => label.id),
            reminderIds: selectedReminders.map(reminder => reminder.id),
            locationId: "",
            isComplete: false
        });
    }
    /**
     * Adds a new to-do item to the `todos` store.
     * - Requires a non-empty `title`.
     * - Links the to-do item to the selected task, default priority, default reminder, and isComplete.
     * - Clears the form fields after successful addition.
     */
    const handleAddItem = async () => {
        // If the title is empty dispatch and return
        if (!title.trim()) { dispatch("complete"); addItem(); return; }

        // Only add the todo if the title is not empty
        addItem();

        dispatch("complete", "todo");

        await tick();
        focusTodoInput();

        // Reset all form fields regardless of whether we added a todo
        title = "";
        description = "";
        newSelectedTask = $selectedTask;
        dueDate = ["", ""];
        selectedPriority = $priorities.find(item => item.isDefault)!;
        selectedLabels = [];
        selectedReminders = [];
    };

    /**
     * Handles the backspace events
     * - Requires an empty `title`.
     * - Dispatches an event complete if the title is empty & backspace is being pressed
     */
    const handleBackspace = () => title.trim() === "" && dispatch("complete");

    /**
     * Handles the selection of a task from the `ItemSelector` component.
     * Updates the `selectedTask` with the task chosen by the user.
     *
     * @param {CustomEvent<Task>} event - The custom event containing the selected task.
     */
    const handleTaskSelect = (event: CustomEvent<Task>) => newSelectedTask = event.detail;

    const handleDateSelect = (event: CustomEvent<[string, string]>) => dueDate = event.detail;

    /**
     * Handles the selection of a priority from the priority selector component.
     * - Updates the `selectedPriority` with the priority chosen by the user.
     *
     * @param {CustomEvent<Priority>} event - The custom event containing the selected priority in its `detail` property.
     */
    const handlePrioritySelect = (event: CustomEvent<Priority>) => selectedPriority = event.detail;

    /**
     * Handles selection of one or more labels.
     * Updates `selectedLabels` with the selected labels.
     *
     * @param {CustomEvent<Label[]>} event - Event containing an array of selected labels.
     */
    const handleLabelSelect = (event: CustomEvent<Label[]>) => selectedLabels = event.detail;

    // Handle new label creation
    const handleLabelCreate = (event: CustomEvent<{title: string, description: string}>) => {
        const { title, description } = event.detail;
        if (!title.trim()) return;

        const baseData = { title: title.trim(), description: description.trim() };
        addToStore(labels, { ...baseData });
    }

    /**
     * Handles selection of one or more labels.
     * Updates `selectedLabels` with the selected labels.
     *
     * @param {CustomEvent<Reminder>} event - Event containing an array of selected labels.
     */
    const handleReminderSelect = (event: CustomEvent<Reminder[]>) => selectedReminders = event.detail;

</script>

<!--
  Container for the entire input section, including fields for the to-do title, description, task selector, and add button.
-->
<div class="input-container flex flex-col gap-4">

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
    <div class="input-section flex flex-col gap-1.5">
        <InputField
                bind:value={title}
                bind:this={inputRef}
                placeholder="Type a todo"
                onEnter={handleAddItem}
                onBackspace={handleBackspace}
        />
        <InputField
                bind:value={description}
                placeholder="Notes"
                onEnter={handleAddItem}
        />
    </div>

    <!--
      Placeholder for additional action buttons or future enhancements.
      Currently empty.
    -->
    <div class="add-actions flex gap-2">
        <DateSelector
                selectorTitle={dueDate}
                on:select={handleDateSelect}
                reminderOptions={$reminders}
                selectedReminderOptions={selectedReminders}
                on:reminderSelect={handleReminderSelect}
        />
        <PrioritySelector
                options={$priorities}
                defaultOption={defaultPriority}
                selectedOption={selectedPriority}
                on:select={handlePrioritySelect}
        />
        <LabelSelector
                options={$labels}
                selectedOptions={selectedLabels}
                on:select={handleLabelSelect}
        />
        <ItemSelector
                itemType="label"
                options={$labels}
                selectedOptions={selectedLabels}
                on:select={handleLabelSelect}
                on:create={handleLabelCreate}
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
    <div class="type-selector flex gap-4 justify-between">
        <TaskSelector
                options={$tasks}
                defaultOption={$selectedTask}
                selectedOption={newSelectedTask}
                on:select={handleTaskSelect}
        />

        <div class="input-action">
            <Button onClick={handleAddItem} disabled={!title || !title.trim()}>
                Add
            </Button>
        </div>
    </div>
</div>

