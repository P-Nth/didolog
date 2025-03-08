<script lang="ts">
    import TodoInput from "./TodoInput.svelte";
    import NotesInput from "./NotesInput.svelte";

    let text: string = '';
    let type: string = 'note';

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
    <div class="input-wrapper-content">
        {#if type === "todo"}
            <TodoInput on:complete={handleFinished} />
        {:else}
            <div class="">
                <NotesInput on:input={handleInput} on:select={handleSelect} />
            </div>
        {/if}
    </div>
</div>

