<script lang="ts">
    import TodoInput from "./TodoInput.svelte";
    import NotesInput from "./NoteInput.svelte";
    import SectionInput from "./SectionInput.svelte";

    let text: string = '';
    let type: string = 'note';
    let todoInputRef: TodoInput |  null = null;
    let noteInputRef: NotesInput |  null = null;
    let sectionInputRef: SectionInput |  null = null;

    const handleInput = (event: CustomEvent<string>) => {
        text = event.detail;
    }

    const handleSelect = (event: CustomEvent<string>) => {
        type = event.detail;

        type === "todo" && todoInputRef?.focusTodoInput();
        type === "section" && sectionInputRef?.focusSecInput();
    }

    const handleFinished = () => {
        type = "note";
        noteInputRef?.focusNoteInput();
    }

</script>

<div class="input-wrapper">
    <div class="input-wrapper-content">
        {#if type === "todo"}
            <TodoInput bind:this={todoInputRef} on:complete={handleFinished} />
        {:else if type === "section"}
            <SectionInput bind:this={sectionInputRef} on:complete={handleFinished} />
        {:else}
            <NotesInput bind:this={noteInputRef} on:input={handleInput} on:select={handleSelect} />
        {/if}
    </div>
</div>

