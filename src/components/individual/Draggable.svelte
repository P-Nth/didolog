<!--
    This component represents a draggable block in a list, enabling drag-and-drop functionality.
    It handles the start and end of drag operations, provides visual feedback by highlighting
    the nearest block’s top or bottom border during dragging, and integrates with a global
    store to track the dragged position. The component uses HTML5 Drag and Drop API and
    applies styles to indicate dragging state and drop targets.
-->
<script lang="ts">
    import {createEventDispatcher, onDestroy} from 'svelte';
    import {draggedPosition} from "../../store/store";

    /** Unique identifier for the block.
    * Position of the block in the list.
    * Optional CSS class name to apply to the draggable element.
    */
    export let blockId: string;
    export let position: number;
    export let className: string | null = "";

    /** Tracks whether the mouse is hovering over the element
     * Indicates if the element is currently being dragged.
     * Reference to the DOM element for direct manipulation.
     */
    let isHovered = false;
    let isDragging = false;
    let element: HTMLElement;

    /** Event dispatcher for drag-related events. */
    const dispatch = createEventDispatcher<{
        drop: { blockId: string; position: number; };
        dragstart: { blockId: string; position: number; };
        dragend: { blockId: string; position: number; };
    }>();

    /**
     * Handles the start of a drag operation.
     * @param {DragEvent} e - The drag start event.
     */
    function handleDragStart(e: DragEvent) {
        if (!e.dataTransfer) return;

        isDragging = true;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({blockId: blockId, position}));

        element.classList.add('dragging');

        $draggedPosition = position;
        document.addEventListener('dragover', handleGlobalDragOver);

        // Dispatch dragstart event
        dispatch('dragstart', {blockId: blockId, position});
    }

    /**
     * Handles the end of a drag operation, cleaning up state and listeners.
     * @param {DragEvent} e - The drag end event.
     */
    function handleDragEnd(e: DragEvent) {
        if (!e.dataTransfer) return;

        isDragging = false;

        element.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom');

        $draggedPosition = null;

        document.removeEventListener('dragover', handleGlobalDragOver);

        clearDragFeedback();

        // Dispatch dragend event
        dispatch('dragend', {blockId: blockId, position});
    }

    /**
     * Handles global dragover events to provide visual feedback on draggable blocks.
     * Detects the nearest block and applies top/bottom border indicators.
     * @param {DragEvent} e - The dragover event.
     */
    function handleGlobalDragOver(e: DragEvent) {
        e.preventDefault();

        const draggableBlocks = document.querySelectorAll('.draggable') as NodeListOf<HTMLElement>;

        let nearestDraggable: HTMLElement | null = null;
        let minDistance = Infinity;

        // Find the nearest draggable block
        draggableBlocks.forEach((draggableBlock) => {
            const rect = draggableBlock.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const distance = Math.abs(e.clientY - centerY);
            if (distance < minDistance) {
                minDistance = distance;
                nearestDraggable = draggableBlock;
            }
        })

        // Apply border feedback
        draggableBlocks.forEach((draggableBlock) => {
            draggableBlock.classList.remove('drag-over-top', 'drag-over-bottom');
            const pos = parseInt(draggableBlock.dataset.position || '');
            if (draggableBlock === nearestDraggable && pos !== $draggedPosition) {
                const rect = draggableBlock.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                if (e.clientY < midpoint) {
                    draggableBlock.classList.add('drag-over-top');
                } else {
                    draggableBlock.classList.add('drag-over-bottom');
                }
            }
        });
    }

    /**
     * Clears drag feedback (top/bottom borders) from all draggable blocks.
     */
    function clearDragFeedback() {
        const draggableBlocks = document.querySelectorAll('.draggable') as NodeListOf<HTMLElement>;

        draggableBlocks.forEach((draggableBlock) => {
            draggableBlock.classList.remove('drag-over-top', 'drag-over-bottom');
        });
    }

    // Clean up listener if component is destroyed while dragging
    onDestroy(() => {
        if (isDragging) {
            document.removeEventListener('dragover', handleGlobalDragOver);
            $draggedPosition = null;
            clearDragFeedback();
        }
    });

</script>

<!-- The root div is the draggable container for the block -->
<div
        bind:this={element}
        draggable="true"
        role="listitem"
        on:dragstart={handleDragStart}
        on:dragend={handleDragEnd}
        on:mouseenter={() => isHovered = true}
        on:mouseleave={() => isHovered = false}
        class="relative flex items-center cursor-grab {className}"
        class:opacity-50={isDragging}
        class:cursor-grabbing={isDragging}
        class:className
>
    <span class="px-2.5 font-semibold text-[20px]" class:opacity-5={!isHovered} class:opacity-100={isHovered}>
        ::
    </span>
    <slot></slot>
</div>

