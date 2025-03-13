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
<script lang="ts">
    import {blocksByTask} from "../../hooks/blocksByTask";
    import TodoView from "./TodoView.svelte";
    import NoteView from "./NoteView.svelte";
    import SectionView from "./SectionView.svelte";

    const componentMap: any = {
        todo: TodoView,
        note: NoteView,
        section: SectionView,
    };

    $: console.log($blocksByTask)
</script>

<div class="">
    <!-- Render list for todos -->
    {#each $blocksByTask as block}
        {#if componentMap[block.type]}
            <svelte:component this={componentMap[block.type]} {block} />
        {/if}
    {/each}

</div>

