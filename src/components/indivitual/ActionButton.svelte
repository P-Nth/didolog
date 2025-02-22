<!-- ActionButton Component -->
<script>
  // Import the reusable Button component.
  import Button from "./Button.svelte";

  /**
   * Callback function for the "Edit" action.
   * When provided, an "Edit" button is displayed.
   *
   * @type {Function|null}
   */
  export let onEdit = null;

  /**
   * Callback function for the "Delete" action.
   * When provided, a "Delete" button is displayed.
   *
   * @type {Function|null}
   */
  export let onDelete = null;

  /**
   * Callback function for the "Complete" action.
   * When provided, a "Complete" button is displayed.
   *
   * @type {Function|null}
   */
  export let onComplete = null;

  /**
   * Indicates whether the item is currently in an editing state.
   * This is used to disable the "Edit" button.
   *
   * @type {boolean}
   */
  export let isEditing = false;

  /**
   * Indicates whether the item has been completed.
   * This is used to disable the "Complete" button.
   *
   * @type {boolean}
   */
  export let isCompleted = false;
</script>

<!--
  Action Buttons Component
  -------------------------
  This component conditionally renders action buttons based on the provided callback props.
  - If `onEdit` is provided, an "Edit" button is displayed.
    The button is disabled when `isEditing` is true.
  - If `onComplete` is provided, a "Complete" button is displayed.
    The button is disabled when `isCompleted` is true.
  - If `onDelete` is provided, a "Delete" button is displayed.
-->
<div class="action-buttons">
  {#if onEdit}
    <!-- Edit Button: triggers onEdit callback when clicked -->
    <Button on:click={onEdit} disabled={isEditing}>✏️ Edit</Button>
  {/if}

  {#if onComplete}
    <!-- Complete Button: triggers onComplete callback when clicked -->
    <Button on:click={onComplete} disabled={isCompleted}>✅ Complete</Button>
  {/if}

  {#if onDelete}
    <!-- Delete Button: triggers onDelete callback when clicked -->
    <Button on:click={onDelete}>🗑️ Delete</Button>
  {/if}
</div>

<!-- Action Button Style -->
<style>
  .action-buttons {
    gap: 8px;
    display: flex;
    margin-top: 8px;
  }
</style>
