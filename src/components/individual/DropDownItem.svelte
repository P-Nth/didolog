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
    function toggleCheck() {
        dispatch("select", !isChecked);
    }

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
    class="dropdown-item gap-4 flex items-center justify-between px-1.5 cursor-pointer select-none"
    role="button"
    tabindex="0"
    on:click={toggleCheck}
    on:keydown={(e) => (e.key === "Enter" || e.key === " ") && toggleCheck()}
>
    {#if $$slots.leftIcon}
        <span class="icon left">
          <slot name="leftIcon" />
        </span>
    {/if}

    <span class="dropdown-text flex flex-1 items-center" class:className>
        <slot>{text}</slot>
    </span>

    {#if $$slots.leftIcon}
        <span class="icon inline-flex items-center right">
            <slot name="rightIcon" />
        </span>
    {/if}
</div>

