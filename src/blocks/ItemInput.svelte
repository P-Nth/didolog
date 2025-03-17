<script lang="ts">
    import { blocksByTask } from "../hooks/blockRegistry";

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

    const handleFinished = (event: CustomEvent<string>) => {
        !event.detail ? type = "note" : type = event.detail;

        type === "todo" && todoInputRef?.focusTodoInput();
        type === "note" && noteInputRef?.focusNoteInput()
    }

</script>

<div class="item-wrapper">
    <div class="input-wrapper">
        <div class="input-wrapper-content">
            {#if type === "todo"}
                <TodoInput bind:this={todoInputRef} on:complete={handleFinished} />
            {:else if type === "section"}
                <SectionInput bind:this={sectionInputRef} on:complete={handleFinished} />
            {:else}
                <div class="flex flex-col gap-2">
                    <NotesInput bind:this={noteInputRef} on:input={handleInput} on:select={handleSelect} />
                    {#if !text.trim() && $blocksByTask.length === 0 }
                        <span class="p-2">Add Something here!</span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>

