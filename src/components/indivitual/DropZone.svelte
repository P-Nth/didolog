<script lang="ts">
    import { createEventDispatcher } from "svelte";

    /**
     * A reusable drop zone component.
     *
     * @prop {string} id - A unique identifier for this drop zone. Should be manually set for consistency.
     * @prop {string[]} accepts - The types of draggable items this drop zone allows.
     * @prop {string} [customClass] - Optional custom CSS class for styling.
     */
    export let id: string;
    export let accepts: string[] = [];
    export let customClass: string = "";

    const dispatch = createEventDispatcher();

    /**
     * Handles drag over event, allowing valid items to be dropped.
     * @param {DragEvent} event - The drag event.
     */
    function onDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = "move";
    }

    /**
     * Handles drop event and moves the dragged element to this drop zone.
     * @param {DragEvent} event - The drop event.
     * Explicitly cast to HTMLElement
     */
    function onDrop(event: DragEvent) {
        event.preventDefault();
        const draggedId = event.dataTransfer?.getData("text/plain");
        if (!draggedId) return;

        const draggedElement = document.getElementById(draggedId);
        if (draggedElement && accepts.includes(draggedElement.dataset.type!)) {
            const dropZone = event.currentTarget as HTMLElement;
            dropZone.appendChild(draggedElement);
            dispatch("drop", { draggedId, dropzoneId: id });
        }
    }

</script>

<!--
  Drop zone container:
  - Defines an area where draggable items can be placed.
  - Uses a persistent ID to ensure stability across renders.
  - Accepts specific types of draggable items (e.g., "task", "label").
  - The user can override styling with the "customClass" prop.
  - Implements drag-and-drop event listeners.
-->
<div
        id={id}
        class="dropzone ${customClass}"
        role="list"
        on:dragover={onDragOver}
        on:drop={onDrop}
>
    <!-- Slot allows any child elements (draggable items) to be added here -->
    <slot />
</div>

