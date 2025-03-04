<script lang="ts">
    import { createEventDispatcher } from "svelte";

    /**
     * A reusable draggable component.
     *
     * @prop {string} id - A unique identifier (UUID recommended) for this draggable item.
     * @prop {string} type - The type of item (must match a drop zone's accepted types).
     * @prop {HTMLElement | null} originalParent - The original container before dragging.
     */
    export let id: string;
    export let type: string;
    export let customClass: string = "";

    const dispatch = createEventDispatcher();
    let originalParent: HTMLElement | null = null;

    /**
     * Handles the drag start event and saves the original parent container.
     * @param {DragEvent} event - The drag event.
     */
    function onDragStart(event: DragEvent) {
        event.dataTransfer!.setData("text/plain", id);
        event.dataTransfer!.effectAllowed = "move";

        const target = event.currentTarget as HTMLElement;
        if (target) {
            originalParent = target.parentElement;
            dispatch("dragstart", { id, originalParent });
        }
    }

    /**
     * Handles the drag end event and ensures items return to their original position if necessary.
     * @param {DragEvent} event - The drag event.
     */
    function onDragEnd(event: DragEvent) {
        const target = event.currentTarget as HTMLElement;
        if (originalParent && target && target.parentElement !== originalParent) {
            originalParent.appendChild(target);
        }
        dispatch("dragend", { id, dropzone: target?.parentElement });
    }
</script>

<!--
  Draggable item container:
  - Uses a UUID for uniqueness.
  - "type" must match an accepted drop zone type.
  - The user can override styling with the "customClass" prop.
  - Ensures the item returns to its original parent if dropped outside a valid drop zone.
-->
<div
        id={id}
        class="draggable ${customClass}"
        draggable="true"
        role="listitem"
        aria-grabbed="false"
        data-type={type}
        on:dragstart={onDragStart}
        on:dragend={onDragEnd}
>
    <!-- Slot allows any content to be wrapped inside this draggable component -->
    <slot />
</div>

<style>
    .draggable {
        padding: 8px;
        margin: 5px;
        background-color: white;
        border: 1px solid #ccc;
        cursor: grab;
    }

    .draggable:active {
        cursor: grabbing;
    }
</style>

