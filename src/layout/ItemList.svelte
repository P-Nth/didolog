<script lang="ts">
    import { blockRegistry, blocksByTask, type BlockType } from "../hooks/blockRegistry";

    interface Block {
        id: string;
        type: BlockType;
        [key: string]: any;
    }

    $: blocks = $blocksByTask as Block[];
</script>

<div class="blocks-container flex flex-col gap-2">
    {#each blocks as block (block.id)}
        <div class="block-wrapper">
            {#if block.type in blockRegistry}
                <svelte:component this={blockRegistry[block.type]} {block} on:update on:delete />
            {:else}
                <div class="unknown-block">Unknown block type: {block.type}</div>
            {/if}
        </div>
    {/each}
</div>

