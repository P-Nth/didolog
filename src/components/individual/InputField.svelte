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
     * The type attribute for the input element.
     * Typically, "text", but can be "password", "email", etc.
     * @type {string}
     */
    export let type: string = "text";

    /**
     * The current value of the input.
     * @type {string}
     */
    export let value: string = "";

    /**
     * Defines the custom class for styling for the input.
     * @type {string}
     */
    export let className: string = "";

    /**
     * Placeholder text for the input when it is empty.
     * @type {string}
     */
    export let placeholder: string = "Type something...";

    /**
     * Callback function called when the input value changes.
     */
    export let onInput: (value: string) => void = () => {};

    /**
     * Callback function called when the "Enter" key is pressed.
     */
    export let onEnter: () => void = () => {};

    /**
     * Callback function called when the "Backspace" key is pressed.
     */
    export let onBackspace: () => void = () => {};

    /**
     * Callback function called when the "Escape" key is pressed.
     */
    export let onEscape: () => void = () => {};

    /**
     * The unique id of the input. If no id is provided, a UUID is generated.
     * @type {string}
     */
    let id: string = crypto.randomUUID();

    /**
     * Reference to the input and textarea elements. Used to programmatically blur the input and textarea.
     * @type {HTMLInputElement | null}
     * @type {HTMLTextAreaElement | null}
     */
    let inputRef: HTMLInputElement | HTMLTextAreaElement | null = null;

    /**
     * Ensures focus is on the input
     */
    export const focusInput = () => inputRef?.focus();

    /**
     * Adjusts textarea dynamically.
     */
    const adjustHeight = () => {
        if (inputRef && type === "note") {
            inputRef.style.height = inputRef.scrollHeight + "px";
        }
    }

    /**
     * Handles keydown events on the input field.
     * - Calls `onEnter` and blurs the input when "Enter" is pressed.
     * - Calls `onEscape` and blurs the input when "Escape" is pressed.
     *
     * @param {KeyboardEvent} event - The keydown event object.
     */
    const handleKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            onEnter();
            inputRef?.blur();
        } else if (event.key === "Enter" && type === "note" && event.shiftKey) {
            event.preventDefault();
            onEnter();
        } else if (event.key === "Escape") {
            event.preventDefault();
            onEscape();
            inputRef?.blur();
        } else if (event.key === 'Backspace') {
            onBackspace();
        }
    }
</script>

<!-- Input Html -->
{#if type === "text"}
    <input
            type="text"
            bind:value
            id={id}
            bind:this={inputRef}
            placeholder={placeholder}
            on:input={() => onInput(value)}
            on:focus={() => onInput(value)}
            on:click={() => onInput(value)}
            on:keydown={handleKeydown}
            class="input-field rounded w-full"
            class:className
    />
{:else if type === "note"}
    <textarea
            id={id}
            bind:value
            bind:this={inputRef}
            placeholder={placeholder}
            on:input={() => {onInput(value); adjustHeight();}}
            on:focus={() => onInput(value)}
            on:click={() => onInput(value)}
            on:keydown={handleKeydown}
            class="textarea-field resize-none overflow-hidden whitespace-pre-wrap box-border border-none outline-none bg-transparent"
            class:className
    />
{:else if type === "time"}
    <input
            type="time"
            id={id}
            bind:value
            bind:this={inputRef}
            step="600"
            on:input={() => onInput(value)}
            on:focus={() => onInput(value)}
            on:click={() => onInput(value)}
            on:keydown={handleKeydown}
            class="input-field rounded w-full"
            class:className
    />
{:else}
    <span>No Input</span>
{/if}

