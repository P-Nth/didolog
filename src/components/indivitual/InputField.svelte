<!--
  InputField Component

  This is a reusable input component that supports various configurations:
  - Dynamic placeholder text.
  - Size and variant styling through props.
  - Event handling for input changes, "Enter" key submission, and "Escape" key cancellation.
  - Automatic generation of a unique `id` using UUID to prevent DOM issues with duplicate form inputs.

  Props:
  - id: {string} - Unique identifier for the input element. Defaults to a generated UUID if not provided.
  - value: {string} - Current input value.
  - type: {string} - Input type (e.g., "text", "password", "email"). Default is "text".
  - textSize: {string} - Size of the input (e.g., "small", "medium", "large").
  - variant: {string} - Visual variant for styling (e.g., "main", "description").
  - placeholder: {string} - Placeholder text when the input is empty.
  - onInput: {Function} - Callback triggered when the input value changes.
  - onEnter: {Function} - Callback triggered when the "Enter" key is pressed.
  - onEscape: {Function} - Callback triggered when the "Escape" key is pressed.

  Features:
  - UUID ensures unique input IDs across the app to avoid duplication issues.
  - Handles key events for improved user interaction.
  - Provides input element reference for programmatic focus management.
-->
<script lang="ts">
    /**
     * The unique id of the input. If no id is provided, a UUID is generated.
     * @type {string}
     */
    export let id: string = crypto.randomUUID();

    /**
     * The current value of the input.
     * @type {string}
     */
    export let value: string = "";

    /**
     * The type attribute for the input element.
     * Typically, "text", but can be "password", "email", etc.
     * @type {string}
     */
    export let type: string = "text";

    /**
     * Defines the size styling for the input.
     * Used to apply CSS classes for different sizes (e.g., "small", "medium", "large").
     * @type {string}
     */
    export let textSize: string = "small";

    /**
     * Defines the variant styling for the input.
     * Used to apply CSS classes for different variants (e.g., "main", "description").
     * @type {string}
     */
    export let variant: string = "main";

    /**
     * Placeholder text for the input when it is empty.
     * @type {string}
     */
    export let placeholder: string = "Type something...";

    /**
     * Callback function called when the input value changes.
     * @type {(value: string) => void}
     */
    export let onInput: (value: string) => void = () => {};

    /**
     * Callback function called when the "Enter" key is pressed.
     * @type {() => void}
     */
    export let onEnter: () => void = () => {};

    /**
     * Callback function called when the "Escape" key is pressed.
     * @type {() => void}
     */
    export let onEscape: () => void = () => {};

    /**
     * Reference to the input element. Used to programmatically blur the input.
     * @type {HTMLInputElement | null}
     */
    let inputRef: HTMLInputElement | null = null;

    /**
     * Handles keydown events on the input field.
     * - Calls `onEnter` and blurs the input when "Enter" is pressed.
     * - Calls `onEscape` and blurs the input when "Escape" is pressed.
     *
     * @param {KeyboardEvent} event - The keydown event object.
     */
    function handleKeydown(event: KeyboardEvent): void {
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

