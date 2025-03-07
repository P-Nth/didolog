<script lang="ts">
    import NotesInput from "./NotesInput.svelte";
    import TodoInput from "./TodoInput.svelte";

    let text: string = '';
    let type: string = 'note';
    let isPlaceholder = text === '';

    const handleInput = (event: CustomEvent<string>) => {
        text = event.detail;
    }

    const handleSelect = (event: CustomEvent<string>) => {
        type = event.detail;
    }

    const handleFinished = () => {
        type = "note";
    }

</script>

<div class="input-wrapper">
    {#if type === "todo"}
        <TodoInput on:complete={handleFinished} />
    {:else}
        <div class="">
            <NotesInput on:input={handleInput} on:select={handleSelect} />

            <!-- Show Placeholder when only default note exists -->
            {#if isPlaceholder}
                <span>Placeholder Component</span>
            {/if}
        </div>
    {/if}
</div>

