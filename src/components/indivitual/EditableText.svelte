<script>
  /**
   * Import the store update function and child components.
   */
  import { updateItem } from "../../store/store.js";
  import InputField from "./InputField.svelte";
  import Button from "./Button.svelte";

  /**
   * @prop {Object} item - The item object to be edited.
   */
  export let item = {};

  /**
   * @prop {string} text - The current text for the item (derived from the store).
   */
  export let title = "";

  /**
   * @prop {string} text - The current description for the item (derived from the store).
   */
  export let description = "";

  /**
   * @prop {string} type - The type/category of the item. Defaults to "task".
   */
  export let type = "task";

  /**
   * Local state:
   * - `value1` holds the editable title value, initialized with the store's `title`.
   * - `value2` holds the editable description value, initialized with the store's `description`.
   * - `hasChanges` tracks whether the local value has been modified compared to `title/description`.
   */
  let value1 = title;
  let value2 = description || '';
  let hasChanges = false;

  /**
   * Reactive statement to ensure that when external changes occur to `title/description`
   * (and there are no unsaved local changes), the local `value` is updated.
   */
  $: if (!hasChanges) {
    value1 = title;
    value2 = description;
  }

  /**
   * Check if there are changes in either field.
   */
  function checkForChanges() {
    hasChanges = (value1 !== title || value2 !== description) && value1 !== ""; // Ensure title is not empty
  }

  /**
   * Handle input events from the InputField.
   * Updates the local value and sets the change flag if the trimmed value differs from the original text.
   *
   * @param {string} newValue - The new value entered by the user.
   */
  function handleInput1(newValue) {
    value1 = newValue;
    checkForChanges();
  }

  function handleInput2(newValue) {
    value2 = newValue;
    checkForChanges();
  }

  /**
   * Save the edited text if changes exist.
   * Calls the updateItem function to update the store, updates the local text, and resets the change flag.
   */
  function saveEdit() {
    if (!hasChanges) return;

    let updatedTitle = value1;
    let updatedDescription = value2;

    updateItem(item.id, updatedTitle, updatedDescription, type);

    title = updatedTitle;
    description = updatedDescription;
    hasChanges = false;
  }

  /**
   * Cancel the edit process.
   * Resets the local value to the current store text and clears any unsaved changes.
   */
  function cancelEdit() {
    value1 = title; // ✅ Reset input field to store value
    value2 = description; // ✅ Reset input field to store value
    hasChanges = false; // ✅ Disable button after reset
  }

  /**
   * Ensure reactivity is properly updating
   */
  $: checkForChanges(); // Runs reactively whenever `value1` or `value2` change

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

