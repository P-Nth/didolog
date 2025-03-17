<script lang="ts">
    import {createEventDispatcher, onMount, tick} from "svelte";
    import type {Note} from "../store/types";
    import {addBlock, selectedTask} from '../store/store';
    import InputField from '../components/indivitual/InputField.svelte';

    let title: string = '';
    let type: string = 'note';
    let showMenu: boolean = false;

    let inputRef: InputField | null = null;

    export function focusNoteInput() {
        inputRef?.focusInput();
    }

    onMount(() => {
        focusNoteInput();
    });

    $: {
        if (title.startsWith("/") && title.length === 1) {
            showMenu = true;
        } else if (!title || title.length > 1) {
            showMenu = false;
        }
    }

    const dispatch = createEventDispatcher();

    const options = [
        { id: 1, type: "todo" },
        { id: 2, type: "section" },
    ];

    const handleSelect = (option: any) => {
        if (option.type === "todo") type = "todo";
        if (option.type === "section") type = "section";

        dispatch("select", type);

        title = "";
        showMenu = false;
    };

    const handleAddItem = async () => {
        !title.trim() && dispatch("complete");

        // if (!title.trim()) { dispatch("complete"); await tick(); focusNoteInput(); return; }

        addBlock<Note>({type: "note", title, parentId: $selectedTask.id});

        title = "";
        type = "notes";

        await tick();
        focusNoteInput();
    }

    $: dispatch("input", title);

</script>

<div class="relative">
    <div class="notes-input-container flex justify-between">
        <InputField
                type="note"
                bind:value={title}
                bind:this={inputRef}
                placeholder="Type something... (Press '/' to see options)"
                onEnter={handleAddItem}
        />
    </div>

    {#if showMenu}
        <ul class="absolute flex flex-col top-full left-0 bg-white shadow-md border rounded w-48">
            {#each options as option}
                <button
                        class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        on:click={() => handleSelect(option)}
                >
                    {option.type}
                </button>
            {/each}
        </ul>
    {/if}
</div>

