<!-- Draggable.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';

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

        // Dispatch dragstart event
        dispatch('dragstart', {blockId: blockId, position});
    }

    function handleDragEnd(e: DragEvent) {
        if (!e.dataTransfer) return;

        isDragging = false;

        element.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom');

        // Dispatch dragend event
        dispatch('dragend', {blockId: blockId, position});
    }

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
        {...$$restProps}
>
    <span class="px-2.5 font-semibold text-[20px]" class:opacity-10={!isHovered} class:opacity-100={isHovered}>
        ::
    </span>
    <slot></slot>
</div>

<style>
    .drag-over-top {
        border-top: 2px solid blue;
    }
    .drag-over-bottom {
        border-bottom: 2px solid blue;
    }
</style>

