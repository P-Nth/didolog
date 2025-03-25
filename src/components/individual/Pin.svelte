<!--
  statusIndicator.svelte

  This component displays a status indicator with an icon, colored text, and an optional linked task.

  Features:
  - Shows status icons and colors for "completed", "progressing", and "linked" statuses.
  - Defaults to "progressing" status if no valid status is provided.

  Props:
  - status ("completed" | "progressing" | "linked"): The current status of the item (default: "progressing").
-->
<script lang="ts">
    // Props with default values
    import type { PinStatus } from "../types/types";

    // Props with default values
    export let text: string = '';
    export let className: string = '';
    export let status: PinStatus = 'progressing';

    // Background color configuration based on status
    const statusBgColors = {
        completed: 'bg-green-100',
        progressing: 'bg-blue-100',
        canceled: "bg-red-100",
    };

    // Validate status and get background color, defaulting to progressing
    $: bgColor = statusBgColors[status in statusBgColors ? status : 'progressing'];
</script>

<!--
  Displays the status indicator with an icon, status text, and linked task if applicable.
-->
<div class="pin-container inline-flex flex-1 items-center justify-between w-fit {bgColor} {className}">
    <!-- Left Icon Slot/Icon -->
    {#if $$slots.left}
        <slot name="left" />
    {/if}

    <!-- Text Content -->
    <slot>{text}</slot>

    <!-- Right Icon Slot/Icon -->
    {#if $$slots.right}
        <slot name="right" />
    {/if}
</div>

