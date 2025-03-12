<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {Note, Task} from "../../store/types";
    import {addBlock, tasks, selectedTask} from '../../store/store';
    import TaskSelector from "./TaskSelector.svelte";
    import InputField from '../indivitual/InputField.svelte';

    let title: string = '';
    let type: string = 'note';
    let showMenu: boolean = false;

    let newSelectedTask: Task = $selectedTask;

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
        title.trim() && addBlock<Note>({type: "note", title, parentId: $selectedTask.id});

        title = "";
        newSelectedTask = $selectedTask;
    }

    const handleTaskSelect = (event: CustomEvent<Task>) => {
        newSelectedTask = event.detail;
    };

    $: dispatch("input", title);

</script>

<div class="relative">
    <div class="notes-input-container flex justify-between">
        <InputField
                type="note"
                textSize="medium"
                variant="description"
                bind:value={title}
                placeholder="Type something... (Press '/' to see options)"
                onEnter={addItem}
        />

        <div class="list-selector">
            <TaskSelector
                    options={$tasks}
                    defaultOption={$selectedTask}
                    selectedOption={newSelectedTask}
                    on:select={handleTaskSelect}
            />
        </div>
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

