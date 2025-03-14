<!--
  editableText.svelte

  This component provides editable text fields for a to-do item's title and description.
  Features:
  - Two input fields for editing the title and description.
  - Change detection to enable/disable save functionality.
  - Dispatches an 'updateTodo' event with updated title and description when saved.
  - Provides cancel functionality to revert changes to their original values.
  - Prevents saving empty titles and trims whitespace from inputs.

  Props:
  - title (string): The initial title of the to-do item.
  - description (string): The initial description of the to-do item.

  Events:
  - updateTodo: Dispatched with { title, description } when edits are saved.
-->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import InputField from "./InputField.svelte";
    import Button from "./Button.svelte";

    /**
     * Props: title and description for the editable todo.
     */
    export let text: string = "";

    /**
     * Local state variables for input fields.
     */
    let value: string = text;

    /**
     * Dispatcher for sending events to parent components.
     */
    const dispatch = createEventDispatcher<{
        updateItem: { text: string };
        removeItem: null;
    }>();

    /**
     * Handles input for the title field.
     * @param newValue - New value from the input field.
     *
     * Saves the edit whenever the value changes.
     */
    function handleInput(newValue: string): void {
        value = newValue;
    }

    /**
     * Saves the edits by dispatching an `updateTodo` event with updated values.
     * Resets the `hasChanges` flag afterward.
     */
    function handleBackspace(): void {
        if (!value.trim()) {
            dispatch('removeItem');
        }
    }

    /**
     * Saves the edits by dispatching an `updateTodo` event with updated values.
     * Resets the `hasChanges` flag afterward.
     */
    function saveEdit(): void {
        if (value !== text || !value.trim()) {
            dispatch('updateItem', { text: value });
        }
    }

</script>

<!--
  Editable Text Component
  -----------------------
  This component provides an input field for editing an item's text and an "Update" button
  to save the changes. It handles:
    - Input changes with a local copy to allow canceling edits.
    - Saving updates to the store via updateItem.
    - Canceling edits with the Escape key.
-->
<div class="editable-text-container flex gap-2 items-center justify-between">
    <div class="editable-title w-full">
        <InputField
                bind:value={value}
                placeholder="Type edited text"
                onEnter={() => value.trim() && saveEdit}
                onEscape={() => (value = text)}
                onInput={handleInput}
                onBackspace={handleBackspace}
                className=""
        />
    </div>
    <Button onClick={() => text.trim() && saveEdit()} disabled={value === text || !value.trim()} className="text-sm leading-[unset] border border-gray-600 pl-1 pr-1 disabled:border-gray-300 disabled:text-gray-300">Update</Button>
</div>

