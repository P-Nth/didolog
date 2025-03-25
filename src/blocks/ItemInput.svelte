<!---
     This component provides a dynamic input system that switches between different
     input components based on the selected type.

     Features:
     - Supports multiple block types (e.g., todo, note, section).
     - Uses `blockRegistry` to dynamically load the correct input component.
     - Stores references to input components for programmatic focus control.
     - Handles text input, selection, and completion events.
--->
<script lang="ts">
    import { blocksByTask, blockRegistry } from "../hooks/blockRegistry";

    /**
     * Stores the current text input value for the note input field.
     * Used to determine if a placeholder message should be shown.
     * @type {string}
     */
    let text: string = '';

    /**
     * Tracks the selected block type (e.g., "note", "todo", "section").
     * Defaults to "note".
     * @type {string}
     */
    let type: string = 'note';

    /**
     * Determines whether to render an input component or a view component.
     * - `"input"`: Renders an editable input component.
     * - `"view"`: Renders a read-only component.
     * @type {"input" | "view"}
     */
    let mode: "input" | "view" = "input";

    /**
     * Stores references to input components for each block type.
     * This allows programmatic focus control when switching types.
     * @type {Record<string, any>}
     */
    let inputRefs: Record<string, any> = {};

    /**
     * Handles text input changes for the note input component.
     * Updates the `text` variable with the new input value.
     * @param {CustomEvent<string>} event - The input event containing the new text value.
     */
    const handleInput = (event: CustomEvent<string>) => text = event.detail;

    /**
     * Handles selection of a new block type.
     * Updates `type` and shifts focus to the corresponding input component.
     * @param {CustomEvent<string>} event - The selection event with the new type.
     */
    const handleSelect = (event: CustomEvent<string>) => {
        type = event.detail;
        inputRefs[type]?.focusInput?.();
    };

    /**
     * Handles the completion of an input action.
     * Resets the `type` if no value is provided and shifts focus accordingly.
     * @param {CustomEvent<string>} event - The completion event with an optional new type.
     */
    const handleFinished = (event: CustomEvent<string>) => {
        type = event.detail || "note";
        inputRefs[type]?.focusInput?.();
    };
</script>

<!--
    The HTML structure dynamically renders an input component based on the selected type.
    - Uses `blockRegistry` to determine the correct component.
    - Binds `inputRefs` to store a reference for each input.
    - Handles events for input completion, selection, and typing.
-->
<div class="item-wrapper">
    <div class="input-wrapper">
        <div class="input-wrapper-content">
            {#if blockRegistry[type]?.[mode]}
                <!-- Dynamically render the selected input component -->
                <svelte:component
                        this={blockRegistry[type][mode]}
                        bind:this={inputRefs[type]}
                        on:complete={handleFinished}
                        on:input={type === "note" ? handleInput : undefined}
                        on:select={type === "note" ? handleSelect : undefined}
                />
            {/if}

            {#if type === "note" && !text.trim() && $blocksByTask.length === 0}
                <!-- Placeholder message when there is no input or associated blocks -->
                <span class="p-2">Add Something here!</span>
            {/if}
        </div>
    </div>
</div>

