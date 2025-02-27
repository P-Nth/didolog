<!-- Button Component -->
<script>
  /**
   * Whether the button is disabled.
   * If true, the button will not respond to click events.
   * @type {boolean}
   */
  export let disabled = false;

  /**
   * Callback function to handle click events.
   * @type {Function}
   */
  export let onClick = () => {};

  /**
   * The button's type attribute.
   * This can be "button", "submit", or "reset".
   * @type {string}
   */
  export let type = "button";

  /**
   * The size of the button.
   * This can be used to apply size-related styling (e.g., "small", "medium", "large").
   * @type {string}
   */
  export let size = "medium";

  /**
   * The visual variant of the button.
   * This can be used to apply different styling themes (e.g., "primary", "secondary").
   * @type {string}
   */
  export let variant = "primary";
</script>

<!--
  Button Component
  ----------------
  This button component uses the following props:
  - disabled: Disables the button if true.
  - onClick: Callback function triggered on click.
  - type: HTML button type (e.g., "button", "submit", "reset").
  - size: Applies size-related styles.
  - variant: Applies visual variant styling.

  The component also uses a default slot to display content,
  falling back to "Button" if no content is provided.
-->
<button
        type={type}
        on:click={onClick}
        disabled={disabled}
        class="{variant} {size}"
>
    <slot>Button</slot>
</button>

<!-- Button Component Style -->
<style>
    button {
        border: none;
        cursor: pointer;
        display: flex;
        font-weight: 600;
        border-radius: 5px;
        transition: all 0.2s ease-in-out;
        padding: 8px 12px;
        height: max-content;
        background-color: transparent;
    }

    /* Variants */
    .primary { background-color: rgb(87, 129, 165); color: #F5F5F5; opacity: .9; }
    .secondary { background-color: rgb(234, 234, 234); color: #5781A5; opacity: .9; }
    .tertiary { color: inherit }
    .danger { background-color: #E34E5C; color: #F5F5F5; opacity: .9; }
    .success { background-color: #42B75D; color: #F5F5F5; opacity: .9; }

    /* Sizes */
    .small { padding: .25em .88em; font-size: .88em; }
    .medium { padding: .5em 1em; font-size: 1em; }
    .large { padding: .75em 1.1em; font-size: 1.1em; }

    /* Button Hover State */
    button:hover {
        opacity: 1;
    }
    .tertiary:hover {
        background-color: rgba(255, 233, 221, 0.9);
    }

    /* Disabled State */
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>

