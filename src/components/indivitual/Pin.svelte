<!--
  statusIndicator.svelte

  This component displays a status indicator with an icon, colored text, and an optional linked task.

  Features:
  - Shows status icons and colors for "completed", "progressing", and "linked" statuses.
  - Displays a linked task name when the status is "linked".
  - Defaults to "progressing" status if no valid status is provided.

  Props:
  - status ("completed" | "progressing" | "linked"): The current status of the item (default: "progressing").
  - linkedTask (string): Optional name of the linked task displayed when the status is "linked".
-->
<script lang="ts">
    /**
     * Props:
     * - status: The current status of the item ("completed", "in-progress", or "linked").
     * - linkedTask: Optional linked task name displayed when status is "linked".
     */
    export let status: "completed" | "progressing" | "linked" = "progressing";
    export let linkedTask: string = "";

    /**
     * Type representing the structure of the status information.
     */
    type StatusInfo = {
        icon: string;
        color: string;
        text: string;
        linkedTask?: string;
    };

    /**
     * Map of statuses to their corresponding icon, color, and text.
     */
    const statusMap: Record<"completed" | "progressing" | "linked", StatusInfo> = {
        completed: { icon: "✅", color: "green", text: "Completed" },
        progressing: { icon: "⏳", color: "orange", text: "In Progress" },
        linked: { icon: "📌", color: "blue", text: "Linked Task", linkedTask },
    };

    /**
     * Destructure the appropriate status info from the statusMap.
     * Defaults to "in-progress" if the provided status is invalid.
     */
    let { icon, color, text } = statusMap[status] ?? statusMap["progressing"];
</script>

<!--
  Displays the status indicator with an icon, status text, and linked task if applicable.
-->
<span class="status-indicator">
    <span style="color: {color};">{icon} {text}</span>
    {#if status === "linked" && linkedTask}
        {linkedTask}
    {/if}
</span>

<!-- Pin Styles -->
<style>
    .status-indicator {
        gap: 0.5rem;
        display: flex;
        font-weight: bold;
    }
</style>
