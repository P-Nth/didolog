<script lang="ts">
    import {updateBlockOrder} from "../store/store";

    import { blockRegistry, blocksByTask } from "../hooks/blockRegistry";

    import Draggable from '../components/individual/Draggable.svelte';
    import Dropzone from '../components/individual/DropZone.svelte';

    let draggedPosition: number | null = null;

    function handleDrop(event: CustomEvent<{ blockId: string; position: number }>) {
        updateBlockOrder(event.detail.blockId, event.detail.position);

        clearDragFeedback();
    }

    function handleDragStart(event: CustomEvent<{ blockId: string; position: number }>) {
        draggedPosition = event.detail.position;
        document.addEventListener('dragover', handleGlobalDragOver);
    }

    function handleDragEnd() {
        draggedPosition = null;
        clearDragFeedback();
        document.removeEventListener('dragover', handleGlobalDragOver);
    }

    function handleGlobalDragOver(e: DragEvent) {
        e.preventDefault();
        const draggableBlocks = document.querySelectorAll('.draggable');
        let nearestDraggable: HTMLElement | null = null;
        let minDistance = Infinity;

        // Find the nearest draggable block
        draggableBlocks.forEach((draggableBlock) => {
            const el = draggableBlock as HTMLElement; // Type assertion
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const distance = Math.abs(e.clientY - centerY);
            if (distance < minDistance) {
                minDistance = distance;
                nearestDraggable = el;
            }
        });

        // Apply border feedback and determine target dropzone
        draggableBlocks.forEach((draggableBlock) => {
            const el = draggableBlock as HTMLElement; // Type assertion
            el.classList.remove('drag-over-top', 'drag-over-bottom');
            const pos = parseInt(el.dataset.position || '');
            if (el === nearestDraggable && pos !== draggedPosition) {
                const rect = el.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                if (e.clientY < midpoint) {
                    el.classList.add('drag-over-top');
                } else {
                    el.classList.add('drag-over-bottom');
                }
            }
        });
    }

    function clearDragFeedback() {
        const draggableBlocks = document.querySelectorAll('.draggable');
        draggableBlocks.forEach((draggableBlock) => {
            const el = draggableBlock as HTMLElement; // Type assertion
            el.classList.remove('drag-over-top', 'drag-over-bottom');
        });
    }

</script>

<div class="blocks-container flex flex-col">
    {#each $blocksByTask as block, position (block.id)}
        <Dropzone {position} on:drop={handleDrop}>
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

