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
  // Import tasks and todos from the global store.
  import { tasks, todos } from '../../store/store.ts';
  // Import the ItemView component to render each individual item.
  import ItemView from "./ItemView.svelte";

  /**
   * @prop {string} type - Determines the type of items to display.
   * If "task", the component will display tasks; otherwise, it will display todos.
   * Defaults to "task".
   */
  export let type = "task";
</script>

<!-- Item List Display -->
{#if type === "task"}
    <!-- Render list for tasks -->
    <ul>
        {#each $tasks as task}
            <li>
                <!-- Render each task using the ItemView component -->
                <ItemView item={task} />
            </li>
        {/each}
    </ul>
{:else}
    <!-- Render list for todos -->
    <ul>
        {#each $todos as todo}
            <li>
                <!-- Render each todo using the ItemView component and pass the type prop -->
                <ItemView type={type} item={todo} />
            </li>
        {/each}
    </ul>
{/if}

