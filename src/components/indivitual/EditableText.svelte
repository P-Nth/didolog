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
    export let title: string = "";
    export let description: string = "";

    /**
     * Local state variables for input fields.
     */
    let value1: string = title;
    let value2: string = description ?? '';

    /**
     * Tracks whether changes have been made to the inputs.
     */
    let hasChanges: boolean = false;

    /**
     * Dispatcher for sending events to parent components.
     */
    const dispatch = createEventDispatcher<{ updateTodo: { title: string; description: string } }>();

    /**
     * Reactive statement:
     * Resets input fields if there are no changes (e.g., after save or cancel).
     */
    $: if (!hasChanges) {
        value1 = title;
        value2 = description;
    }

    /**
     * Checks if the input fields differ from the original props.
     * Ensures the title is not empty to enable saving.
     */
    function checkForChanges(): void {
        hasChanges = (value1.trim() !== title || value2.trim() !== description) && value1.trim() !== "";
    }

    /**
     * Handles input for the title field.
     * @param newValue - New value from the input field.
     */
    function handleInput1(newValue: string): void {
        value1 = newValue;
        checkForChanges();
    }

    /**
     * Handles input for the description field.
     * @param newValue - New value from the input field.
     */
    function handleInput2(newValue: string): void {
        value2 = newValue;
        checkForChanges();
    }

    /**
     * Saves the edits by dispatching an `updateTodo` event with updated values.
     * Resets the `hasChanges` flag afterward.
     */
    function saveEdit(): void {
        if (!hasChanges) return;

        dispatch('updateTodo', { title: value1.trim(), description: value2.trim() });

        title = value1.trim();
        description = value2.trim();
        hasChanges = false;
    }

    /**
     * Cancels edits by reverting input fields to the original values.
     * Disables the save button afterward.
     */
    function cancelEdit(): void {
        value1 = title;
        value2 = description;
        hasChanges = false;
    }

    /**
     * Reactive call to check for changes whenever `value1` or `value2` are updated.
     */
    $: checkForChanges();
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
<div class="editable-text-container">
    <div class="editable-texts">
        <div class="editable-title">
            <InputField
                    bind:value={value1}
                    placeholder="Type edited text"
                    textSize="medium"
                    onEnter={saveEdit}
                    onEscape={cancelEdit}
                    onInput={handleInput1}
            />
        </div>
        <div class="editable-description">
            <InputField
                    bind:value={value2}
                    variant="description"
                    placeholder="Description"
                    onEnter={saveEdit}
                    onEscape={cancelEdit}
                    onInput={handleInput2}
            />
        </div>
    </div>

    <Button onClick={saveEdit} disabled={!hasChanges} size="small">Update</Button>
</div>

<!-- EditableText Style -->
<style>
    .editable-text-container {
        gap: .5rem;
        display: flex;
    }
    .editable-texts {
        gap: .1em;
        display: flex;
        flex-direction: column;
    }
</style>

