<!--
    This component serves as an invisible drop target for draggable blocks in a list.
    It listens for drop events from the HTML5 Drag and Drop API and dispatches a 'drop'
    event with the block ID and position to the parent component, facilitating block
    reordering. It remains visually minimal, relying on Draggable.svelte for feedback.
-->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    /** Position of the dropzone in the list, passed to the drop event.
     * Optional CSS class name to apply to the dropzone element.
     */
    export let position: number;
    export let className: string | null = ""

    /** Event dispatcher for drop events. */
    const dispatch = createEventDispatcher<{ drop: { blockId: string; position: number; }; }>();

    /**
     * Handles the drop event when a draggable block is released over this dropzone.
     * Dispatches the block ID and position to the parent component.
     * @param {DragEvent} e - The drop event.
     */
    const handleDrop = (e: DragEvent) => {
        if (!e.dataTransfer) return;

        e.preventDefault();

        const data = JSON.parse(e.dataTransfer.getData('text/plain'));

        dispatch('drop', {blockId: data.blockId, position });

    }
</script>

<!-- The root div is an invisible container that accepts dropped blocks -->
<div
        class="relative {className}"
        role="list"
        on:drop={handleDrop}
        on:dragover={(e) => e.preventDefault()}
        {...$$restProps}
>
    <slot></slot>
</div>

