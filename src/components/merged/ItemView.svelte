<!-- ItemView Component -->
<script>
  /**
   * Import store values and functions:
   * - `todos`: Writable store containing a collection of todo items.
   * - `tasks`: Writable store containing a collection of tasks.
   * - `markComplete`: Function to mark an item (task or todo) as completed.
   * - `deleteItem`: Function to delete an item from the store.
   */
  import { todos, tasks } from '../../store/store.ts';

  /**
   * Import reusable UI components:
   * - `EditableText`: Component for inline text editing.
   * - `Button`: Reusable button component for performing actions.
   * - `Pin`: Component to pin or highlight important items.
   */
  import EditableText from "../indivitual/EditableText.svelte";
  import Button from "../indivitual/Button.svelte";
  import Pin from "../indivitual/Pin.svelte";

  /**
   * Component Props:
   *
   * @prop {Object} item - The item object (task or todo) to be displayed and edited.
   * @prop {string} [type="task"] - Type of the item ("task" or "todo"). Defaults to "task".
   */
  export let item = {};
  export let type = "task";

  /**
   * Editable title of the item.
   * Falls back to `item.title` to support different item structures.
   * @type {string}
   */
  $: editableItemTitle = item.title;

  /**
   * Editable description of the item.
   * Defaults to an empty string if no description is provided.
   * @type {string}
   */
  $: editableItemDescription = item.description || '';
</script>

<!--
  Item View Component
  -------------------
  This component displays an individual item (task or todo) with multiple features:

  - **Linked Task Display:**
    If the item is linked to a task (indicated by `item.taskId`), a `Pin` component is shown with the name of the linked task.

  - **Item Status Indicator:**
    A `Pin` component displays the status of the item: "completed" if the item is finished, or "in-progress" otherwise.

  - **Editable Title:**
    The item's title is rendered via an `EditableText` component, which is always in edit mode.

  - **Time Information:**
    The creation time is always shown. If the item is completed, the completion time is also displayed.

  - **Action Buttons:**
    Two buttons are provided to mark the item as complete (using `markComplete`) or to delete the item (using `deleteItem`).

  - **Linked Todos (for tasks):**
    If the item is a task (`type === "task"`) and has linked todos (found in `$todos`), a list of these todos is displayed with their title and status.
-->
<div class="item-view-container">
    {#if !(type === "task" && item.title === "inbox")}
        <div class="item-view">
            <!-- Linked Task Display:
                 If the item is linked to a task (via item.taskId), display a Pin component
                 with a 'linked' status. The linked task's name is determined by finding the
                 corresponding task in the $tasks store.
            -->
            {#if item.taskId}
                <Pin status='linked' linkedTask={($tasks.find(task => task.id === item.taskId) || {}).title} />
            {/if}

            <!-- Item Status Indicator:
                 Display a Pin component to indicate whether the item is completed or still in progress.
            -->
            <Pin status={item.completed ? 'completed' : 'in-progress'} />

            <!-- Item Editable Title (always in edit mode):
                 Render an EditableText component to display and allow inline editing of the item title.
            -->
            <EditableText title={editableItemTitle} description={editableItemDescription} type={type} item={item}/>

            <!-- Action Buttons: Complete & Delete:
                 - "Complete" button: Calls markComplete with the item's id and type, and is disabled if the item is already completed.
                 - "Delete" button: Calls deleteItem with the item's id and type.
            -->
            <div class="action-buttons">
                <Button onClick={() => markComplete(item.id, type)} disabled={item.completed} size="small" variant="success">✅ Complete</Button>
                <Button onClick={() => deleteItem(item.id, type)} size="small" variant="danger">🗑️ Delete</Button>
            </div>

            <!-- Linked Todos (for tasks only):
                 If the current item is a task and there are todos linked to it (identified by matching taskId),
                 display a header and a list of these linked todos. Each list item shows the todo title and its
                 completion status (✅ if completed, ⏳ if in progress).
            -->
            {#if (type==="task")}
                {#if $todos.some(todo => todo.taskId === item.id)}
                    <h4>📌 Linked Todos:</h4>
                    <ul>
                        {#each $todos.filter(todo => todo.taskId === item.id) as todo}
                            <li>
                                📝 {todo.title} ({todo.completed ? "✅" : "⏳"})
                            </li>
                        {/each}
                    </ul>
                {/if}
            {/if}
        </div>
    {/if}
</div>

<!-- ItemView Styles-->
<style>
    .item-view {
        border: 1px solid #ccc;
        padding: 12px;
        margin: 8px;
        border-radius: 6px;
    }

    .action-buttons {
        display: flex;
        gap: 8px;
        margin-top: 12px;
    }
</style>

