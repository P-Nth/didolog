<script lang="ts">
    import {updateBlockOrder} from "../../store/store";

    import { blockRegistry, blocksByTask } from "../../hooks/blockRegistry";

    import Draggable from '../individual/Draggable.svelte';
    import Dropzone from '../individual/DropZone.svelte';

    const handleDrop = (event: CustomEvent<{ blockId: string; position: number }>) => {
        updateBlockOrder(event.detail.blockId, event.detail.position);
    }

</script>

<div class="blocks-container flex flex-col">
    {#each $blocksByTask as block, position (block.id)}
        <Dropzone {position} on:drop={handleDrop} data-position={position}>
            <Draggable
                    blockId={block.id}
                    {position}
                    className="block-wrapper draggable"
            >
                {#if blockRegistry[block.type]}
                    <!-- Dynamically render the correct component based on the block type and mode -->
                    <svelte:component this={blockRegistry[block.type]['view']} {block} />
                {:else}
                    <!-- Display a fallback message if the block type is not registered -->
                    <div class="unknown-block">Unknown block type: {block.type}</div>
                {/if}
            </Draggable>
        </Dropzone>
    {/each}
</div>

