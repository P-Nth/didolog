<!-- Draggable.svelte -->
<script lang="ts">
    import {createEventDispatcher, onDestroy} from 'svelte';
    import {draggedPosition} from "../../store/store";

    export let blockId: string;
    export let position: number;
    export let className: string | null = "";

    let isHovered = false;
    let isDragging = false;
    let element: HTMLElement;

    const dispatch = createEventDispatcher<{
        drop: { blockId: string; position: number; };
        dragstart: { blockId: string; position: number; };
        dragend: { blockId: string; position: number; };
    }>();

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
    <span class="px-2.5 font-semibold text-[20px]" class:opacity-10={!isHovered} class:opacity-100={isHovered}>
        ::
    </span>
    <slot></slot>
</div>

