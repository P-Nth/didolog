<!-- DropDown Items Component -->
<script>
  /**
   * Optional text property.
   * This value is used as fallback content if no default slot is provided.
   *
   * @type {string}
   */
  export let text = "Select";

  /**
   * The size of the button.
   * This can be used to apply size-related styling (e.g., "small", "medium", "large").
   * @type {string}
   */
  export let size = "medium";

</script>

<!--
  Dropdown Item Component
  -------------------------
  This component is a universal dropdown item that supports:
  - A left icon (provided via the "leftIcon" named slot)
  - A right icon (provided via the "rightIcon" named slot)
  - Text content (either passed as a prop or via the default slot)
-->
<div class="dropdown-item">
    {#if $$slots.leftIcon}
        <span class="icon left">
          <slot name="leftIcon" />
        </span>
    {/if}

    <span class="dropdown-text {size}">
        <slot>{text}</slot>
    </span>

    {#if $$slots.rightIcon}
        <span class="icon right">
          <slot name="rightIcon" />
        </span>
    {/if}
</div>

<!-- Dropdown Item Styles -->
<style>
    /* Base styles for the dropdown item container */
    .dropdown-item {
        gap: 1em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 .3rem;
        cursor: pointer;
        user-select: none;
    }

    /* Styles for any icons within the dropdown item */
    .icon {
        display: inline-flex;
        align-items: center;
    }

    /* Ensures the text content takes available space */
    .dropdown-text {
        flex: 1;
    }

    /* Sizes */
    .small { font-size: .88em; }
    .medium { font-size: 1em; }
    .large { font-size: 1.1em; }
</style>
