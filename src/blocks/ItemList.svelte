<!---
    This component dynamically renders blocks associated with the selected task.
    It retrieves the blocks from the `blocksByTask` store and determines the appropriate
    input or view component for each block type using the `blockRegistry`.

    Features:
    - Supports multiple block types (e.g., todos, notes, sections).
    - Uses Svelte `<svelte:component>` for dynamic component rendering.
    - Allows switching between "input" and "view" modes.
--->
<script lang="ts">
    import { blockRegistry, blocksByTask } from "../hooks/blockRegistry";

    let mode: "input" | "view" = "view";

    /**
     * Reactive variable containing blocks associated with the selected task.
     * This updates whenever `blocksByTask` changes.
     */
    $: blocks = $blocksByTask;
</script>

<!--
    The HTML structure dynamically renders blocks within a container.
    - Iterates through `blocks`, checking if the block type exists in `blockRegistry`.
    - If a valid type is found, it renders the appropriate input or view component.
    - If the block type is unknown, it displays an error message.
-->
<div class="blocks-container flex flex-col gap-2">
    {#each blocks as block (block.id)}
        <div class="block-wrapper">
            {#if block.type in blockRegistry}
                <!-- Dynamically render the correct component based on the block type and mode -->
                <svelte:component this={blockRegistry[block.type][mode]} {block} />
            {:else}
                <!-- Display a fallback message if the block type is not registered -->
                <div class="unknown-block">Unknown block type: {block.type}</div>
            {/if}
        </div>
    {/each}
</div>

