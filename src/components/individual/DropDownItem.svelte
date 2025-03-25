<!-- DropDown Items Component -->
<script lang="ts">
    import { createEventDispatcher } from "svelte";

    /**
    * Optional text property.
    * This value is used as fallback content if no default slot is provided.
    *
    * @type {string}
    */
    export let text: string = "Select";

    /**
    * The classNames of the button.
    * @type {string}
    */
    export let className: string = "";

    /**
     * Whether the checkbox is checked.
     * Defaults to `false` if not provided.
     */
    export let isChecked: boolean = false;

    /** Svelte event dispatcher for emitting custom events */
    const dispatch = createEventDispatcher();

    /** Toggles the checkbox state and dispatches the new checked state */
    const toggleCheck = () => dispatch("select", !isChecked);

</script>

<!--
  Dropdown Item Component
  -------------------------
  This component is a universal dropdown item that supports:
  - A left icon (provided via the "leftIcon" named slot)
  - A right icon (provided via the "rightIcon" named slot)
  - Text content (either passed as a prop or via the default slot)
-->
<div
    class="dropdown-item gap-4 inline-flex flex-1 items-center justify-between px-1.5 cursor-pointer select-none {className}"
    role="button"
    tabindex="0"
    on:click={toggleCheck}
    on:keydown={(e) => (e.key === "Enter" || e.key === " ") && toggleCheck()}
>
    <!-- Left Icon Slot/Icon -->
    {#if $$slots.leftIcon}
      <slot name="leftIcon" />
    {/if}

    <!-- Text Content -->
    <slot>{text}</slot>

    <!-- Right Icon Slot/Icon -->
    {#if $$slots.leftIcon}
        <slot name="rightIcon" />
    {/if}
</div>

