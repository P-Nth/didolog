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

    /**
     * Props: title and description for the editable todo.
     */
    export let title: string = "";
    export let description: string = "";

    /**
     * Local state variables for input fields.
     */
    let value1: string = title;
    let value2: string = description ?? '';

    /**
     * Dispatcher for sending events to parent components.
     */
    const dispatch = createEventDispatcher<{ updateTodo: { title: string; description: string } }>();

    /**
     * Handles input for the title field.
     * @param newValue - New value from the input field.
     *
     * Saves the edit whenever the value changes.
     */
    function handleInput1(newValue: string): void {
        value1 = newValue;
        saveEdit();
    }

    /**
     * Handles input for the description field.
     * @param newValue - New value from the input field.
     *
     * Saves the edit whenever the value changes.
     */
    function handleInput2(newValue: string): void {
        value2 = newValue;
        saveEdit();
    }

    /**
     * Saves the edits by dispatching an `updateTodo` event with updated values.
     * Resets the `hasChanges` flag afterward.
     */
    function saveEdit(): void {
        if (value1 !== title || value2 !== description) {
            dispatch('updateTodo', { title: value1, description: value2 });
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
<div class="editable-text-container flex gap-2">
    <div class="editable-texts flex flex-col gap-0.5">
        <div class="editable-title">
            <InputField
                    bind:value={value1}
                    placeholder="Type edited text"
                    onEnter={() => value1.trim() && saveEdit}
                    onEscape={() => (value1 = title)}
                    onInput={handleInput1}
            />
        </div>
        <div class="editable-description">
            <InputField
                    bind:value={value2}
                    placeholder="Description"
                    onEnter={() => value2.trim() && saveEdit}
                    onEscape={() => (value2 = description)}
                    onInput={handleInput2}
            />
        </div>
    </div>
</div>

