<!-- Dropzone.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let position: number;
    export let className: string | null = ""

    const dispatch = createEventDispatcher<{ drop: { blockId: string; position: number; }; }>();

    const handleDrop = (e: DragEvent) => {
        if (!e.dataTransfer) return;

        e.preventDefault();

        const data = JSON.parse(e.dataTransfer.getData('text/plain'));

        dispatch('drop', {blockId: data.blockId, position });

    }
</script>

<div
        class="relative {className}"
        role="list"
        on:drop={handleDrop}
        on:dragover={(e) => e.preventDefault()}
>
    <slot></slot>
</div>

