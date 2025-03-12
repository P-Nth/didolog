<!--
  Svelte component for displaying and managing a single to-do item.
  Provides functionality to:
  - Edit the title and description.
  - Mark the to-do item as complete.
  - Delete the to-do item.
  - Display the linked task title.

  Props:
  - item (Todo): The to-do item to display and manage.

  Functions:
  - handleTodoUpdate: Updates the to-do item's title and description.
  - handleAction: Handles 'complete' or 'delete' actions for the to-do item.

  Reactive Variables:
  - editableItemTitle: Reflects the editable title of the to-do item.
  - editableItemDescription: Reflects the editable description of the to-do item.
  - linkedTaskTitle: The title of the task linked to the to-do item.
-->
<script lang="ts">
    import {updateBlock, tasks, selectedTask, deleteBlock,} from '../../store/store';
    import { toSentenceCase } from "../../hooks/reusable";
    import type {Todo, Task, Block} from '../../store/types';
    import EditableText from "../indivitual/EditableText.svelte";
    import Button from "../indivitual/Button.svelte";
    import Pin from "../indivitual/Pin.svelte";

    /**
     * The to-do item passed to the component.
     * @type {Todo}
     */
    export let item: Todo = {} as Todo;

    /**
     * Reactive variable holding the editable title of the to-do item.
     * Updates when the `item.title` changes.
     * @type {string}
     */
    let editableItemTitle: string;
    $: editableItemTitle = item.title;

    /**
     * Reactive variable holding the editable description of the to-do item.
     * Defaults to an empty string if `item.description` is undefined.
     * @type {string}
     */
    let editableItemDescription: string;
    $: editableItemDescription = item.description || '';

    /**
     * Retrieves the title of the task linked to the current to-do item.
     * If no matching task is found, defaults to an empty string.
     * @type {string}
     */
    const linkedTaskTitle: string = $tasks.find((task: Task) => task.id === item.parentId)?.title ?? "";

    /**
     * Handles the update of a to-do item’s title and/or description.
     *
     * @param {string} [newTitle] - The new title to update (optional).
     * @param {string} [newDescription] - The new description to update (optional).
     * @returns {void}
     */
    function handleTodoUpdate(newTitle: string, newDescription: string): void {
        updateBlock(item.id, { title: newTitle, description: newDescription } as Partial<Block>);
    }

    /**
     * Handles actions (complete or delete) for the to-do item.
     *
     * @param {'complete' | 'delete'} action - The action type to perform.
     * - `'complete'`: Marks the to-do item as complete.
     * - `'delete'`: Deletes the to-do item from the store.
     * @returns {void}
     */
    function handleAction(action: 'complete' | 'delete'): void {
        if (action === 'complete') {
            updateBlock(item.id, { isComplete: true } as Partial<Block>);
        } else if (action === 'delete') {
            deleteBlock(item.id);
        }
    }
</script>

<!--
  Renders the detailed view of a to-do item, allowing users to:
  - View linked task information.
  - See completion status.
  - Edit the title and description.
  - Perform actions (complete or delete the item).

  Elements:
  - Pin: Displays the linked task (if any) and completion status.
  - EditableText: Provides editable fields for title and description.
  - Button: Handles complete and delete actions.
-->
<div class="item-view-container border border-gray-300 rounded-[5px] p-3 w-full">
    {#if ($selectedTask.id !== "inbox")}
        <div class="item-view">
            {#if item.parentId}
                <!--
                  Pin component indicating the linked task.
                  Props:
                  - status: 'linked' (displays the linked task status)
                  - linkedTask: The title of the linked task (formatted to sentence case)
                -->
                <Pin status='linked' linkedTask={toSentenceCase(linkedTaskTitle)} />
            {/if}

            <!--
              Pin component showing the to-do item's completion status.
              Props:
              - status: 'completed' if item.isComplete is true, otherwise 'progressing'
            -->
            <Pin status={item.isComplete ? 'completed' : 'progressing'} />

            <!--
              EditableText component allowing the user to edit the to-do item's title and description.
              Props:
              - title: The current editable title of the item.
              - description: The current editable description of the item.
              Events:
              - updateTodo: Triggered when the item is updated, calling handleTodoUpdate with the new title and description.
            -->
            <EditableText
                    title={editableItemTitle}
                    description={editableItemDescription}
                    on:updateTodo={(e) => handleTodoUpdate(e.detail.title, e.detail.description)}
            />

            <div class="action-buttons mt-3 flex gap-x-2 justify-between">
                <!--
                  Button to mark the to-do item as complete.
                  Props:
                  - onClick: Calls handleAction with 'complete' action.
                  - disabled: Prevents clicking if the item is already complete.
                  - size: 'small' for button size.
                  - variant: 'success' to indicate a positive action.
                -->
                <Button onClick={() => handleAction("complete")} disabled={item.isComplete} size="small" variant="success">
                    ✅ Complete
                </Button>

                <!--
                  Button to delete the to-do item.
                  Props:
                  - onClick: Calls handleAction with 'delete' action.
                  - size: 'small' for button size.
                  - variant: 'danger' to indicate a destructive action.
                -->
                <Button onClick={() => handleAction("delete")} size="small" variant="danger">
                    🗑️ Delete
                </Button>
            </div>
        </div>
    {/if}
</div>

