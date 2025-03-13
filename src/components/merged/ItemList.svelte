<!--
  ItemList Component
  ------------------
  This component displays a list of items based on the provided `type` prop.

  - It imports `tasks` and `todos` from the store.
  - The header dynamically displays the type of list (either "TASK" for tasks or "TODO" if type is falsy).
  - If `type` is "task", it iterates over the tasks store and renders an `ItemView` for each task.
  - Otherwise, it iterates over the todos store and renders an `ItemView` for each todo,
    passing the `type` prop down for any type-specific logic in the child component.
-->
<script>
  import {notes, tasks, todos} from '../../store/store.ts';
  import TodoView from "./TodoView.svelte";
  import DropZone from "../indivitual/DropZone.svelte";
  import Draggable from "../indivitual/Draggable.svelte";

  /**
   * @prop {string} type - Determines the type of items to display.
   * If "task", the component will display tasks; otherwise, it will display todos.
   * Defaults to "task".
   */
  export let type = "todo";
</script>

<div class="">
    {#if (type === "todo")}
        <!-- Render list for todos -->
        <DropZone id="todo-list" accepts={["todo"]} customClass="custom-dropzone">
            {#each $todos as todo}
                <!-- Draggable Task with Custom Styling -->
                <div class="option-item">
                    <Draggable id={todo.id} type={todo.type} customClass="custom-draggable">
                        <TodoView item={todo} />
                    </Draggable>
                </div>
            {/each}
        </DropZone>
    {:else}
        <p>Tasks</p>
    {/if}
</div>

