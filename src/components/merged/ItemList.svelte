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
  import { todos } from '../../store/store.ts';
  import TodoView from "./TodoView.svelte";

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
        <ul>
            {#each $todos as todo}
                <li>
                    <!-- Render each todo using the TaskView component -->
                    <TodoView item={todo} />
                </li>
            {/each}
        </ul>
    {:else}
        <p>Tasks</p>
    {/if}
</div>


