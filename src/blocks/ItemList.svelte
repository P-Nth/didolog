<script lang="ts">
    import {updateBlockOrder} from "../store/store";

    import { blockRegistry, blocksByTask } from "../hooks/blockRegistry";

    import Draggable from '../components/individual/Draggable.svelte';
    import Dropzone from '../components/individual/DropZone.svelte';

    let draggedPosition: number | null = null;

    const handleDragStart = (event: CustomEvent<{ blockId: string; position: number }>) => {
        draggedPosition = event.detail.position;

        document.addEventListener('dragover', handleGlobalDragOver);
    }

    const handleGlobalDragOver = (e: DragEvent) => {
        e.preventDefault();

        let minDistance = Infinity;
        let nearestDraggable: HTMLElement | null = null;

        const draggableBlocks = document.querySelectorAll('.draggable') as NodeListOf<HTMLElement>;

        // Find the nearest draggable block
        draggableBlocks.forEach((draggableBlock) => {
            const rect = draggableBlock.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const distance = Math.abs(e.clientY - centerY);
            if (distance < minDistance) {
                minDistance = distance;
                nearestDraggable = draggableBlock;
            }
        });

        // Apply border feedback
        draggableBlocks.forEach((draggableBlock) => {
            draggableBlock.classList.remove('drag-over-top', 'drag-over-bottom');
            const pos = parseInt(draggableBlock.dataset.position || '');
            if (draggableBlock === nearestDraggable && pos !== draggedPosition) {
                const rect = draggableBlock.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                if (e.clientY < midpoint) {
                    draggableBlock.classList.add('drag-over-top'); // Dropzone above this block
                } else {
                    draggableBlock.classList.add('drag-over-bottom'); // Dropzone below this block
                }
            }
        });
    }

    const handleDragEnd = () => {
        draggedPosition = null;

        clearDragFeedback();

        document.removeEventListener('dragover', handleGlobalDragOver);
    }

    const handleDrop = (event: CustomEvent<{ blockId: string; position: number }>) => {
        updateBlockOrder(event.detail.blockId, event.detail.position);

        clearDragFeedback();
    }

    const clearDragFeedback = () => {
        const draggableBlocks = document.querySelectorAll('.draggable') as NodeListOf<HTMLElement>;

        draggableBlocks.forEach((draggableBlock) => {
            draggableBlock.classList.remove('drag-over-top', 'drag-over-bottom');
        });
    }

</script>

<div class="blocks-container flex flex-col">
    {#each $blocksByTask as block, position (block.id)}
        <Dropzone {position} on:drop={handleDrop} data-position={position}>
            <Draggable
                    blockId={block.id}
                    {position}
                    className="block-wrapper draggable"
                    on:dragstart={handleDragStart}
                    on:dragend={handleDragEnd}
                    data-position={position}
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

