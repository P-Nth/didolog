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
   * This can be used to apply element-related styling for button
   * @type {string}
   */
  export let className = "";

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
        class="{className} cursor-pointer flex font-normal rounded transition-all duration-200 ease-in-out h-max bg-transparent"
>
    <slot>Button</slot>
</button>

