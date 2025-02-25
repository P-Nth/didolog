<!-- InputField Component -->
<script>
  /**
   * The id of the input.
   * @type {string}
   */
  export let id = "global-input-field";

  /**
   * The current value of the input.
   * @type {string}
   */
  export let value = "";

  /**
   * The type attribute for the input element.
   * Typically, "text", but can be "password", "email", etc.
   * @type {string}
   */
  export let type = "text";

  /**
   * Defines the size styling for the input.
   * This can be used to apply CSS classes for different sizes (e.g., "small", "medium", "large").
   * @type {string}
   */
  export let textSize = "small";

  /**
   * Defines the variant styling for the input.
   * This can be used to apply CSS classes for different sizes (e.g., "main", "description").
   * @type {string}
   */
  export let variant = "main";

  /**
   * Placeholder text for the input when it is empty.
   * @type {string}
   */
  export let placeholder = "Type something...";

  /**
   * Callback function that is called when the input value changes.
   * @type {Function}
   */
  export let onInput = value => {};

  /**
   * Callback function that is called when the "Enter" key is pressed.
   * @type {Function}
   */
  export let onEnter = () => {};

  /**
   * Callback function that is called when the "Escape" key is pressed.
   * @type {Function}
   */
  export let onEscape = () => {};

  /**
   * Reference to the input element.
   * This is used to programmatically blur (remove focus from) the input.
   * @type {HTMLInputElement}
   */
  let inputRef;

  /**
   * Handles keydown events on the input field.
   * - If the "Enter" key is pressed, calls the onEnter callback and blurs the input.
   * - If the "Escape" key is pressed, calls the onEscape callback and blurs the input.
   *
   * @param {KeyboardEvent} event - The keydown event object.
   */
  function handleKeydown(event) {
    if (event.key === "Enter") {
      onEnter();
      inputRef?.blur();
    } else if (event.key === "Escape") {
      onEscape();
      inputRef?.blur();
    }
  }
</script>

<!-- Input Html -->
{#if type === "number"}
    <!-- Render an input field for numbers -->
    <input
        type="number"
        bind:value
        id={id}
        placeholder={placeholder}
        on:input={() => onInput(value)}
        on:keydown={handleKeydown}
        class="input-field"
    />
{:else if type === "date"}
    <!-- Render an input field for dates -->
    <input
        type="date"
        bind:value
        id={id}
        on:input={() => onInput(value)}
        on:keydown={handleKeydown}
        class="input-field"
    />
{:else}
    <!-- Render a text input field as the default case -->
    <input
        type="text"
        bind:value
        id={id}
        bind:this={inputRef}
        placeholder={placeholder}
        on:input={() => onInput(value)}
        on:keydown={handleKeydown}
        class="input-field {textSize} {variant}"
    />
{/if}

<!-- InputField Styles -->
<style>
    .input-field {
        padding: 0 .63em;
        border-radius: .25em;
        background-color: inherit;
        width: 100%;
    }

    /* Variants */
    .main { font-weight: 600 }
    .description { font-weight: 400; }

    /* Sizes */
    .small { font-size: 13px; }
    .medium { font-size: 15px; }
    .large { font-size: 18px; }
</style>

