<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {addToStore, notes} from '../../store/store';
    import InputField from '../indivitual/InputField.svelte';

    let title: string = '';
    let type: string = 'note';
    let showMenu: boolean = false;

    $: {
        if (title.startsWith("/") && title.length === 1) {
            showMenu = true;
        } else if (!title || title.length > 1) {
            showMenu = false;
        }
    }

    const options = [
        { id: 1, type: "todo" },
    ];

    const handleSelect = (option: any) => {
        if (option.type === "todo") type = "todo";

        dispatch("select", type);

        title = "";
        showMenu = false;
    };

    const dispatch = createEventDispatcher();

    const addItem = () => {
        title.trim() && addToStore(notes, {title});
        title = "";
    }

    $: dispatch("input", title);

</script>

<div class="relative">
    <InputField
            type="note"
            textSize="medium"
            variant="description"
            bind:value={title}
            placeholder="Type something... (Press '/' to see options)"
            onEnter={addItem}
    />

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

