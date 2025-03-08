<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {Task} from "../../store/types";
    import {addToStore, defaultTask, tasks, notes} from '../../store/store';
    import TaskSelector from "./TaskSelector.svelte";
    import InputField from '../indivitual/InputField.svelte';

    export let selectorOptions: Task[] = $tasks;

    let title: string = '';
    let type: string = 'note';
    let showMenu: boolean = false;

    let selectedTask: Task = defaultTask;

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
        title.trim() && addToStore(notes, {title, taskId: selectedTask.id});

        title = "";
        selectedTask = defaultTask;
    }

    const handleTaskSelect = (event: CustomEvent<Task>) => {
        selectedTask = event.detail;
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
                    options={selectorOptions}
                    defaultOption={defaultTask}
                    selectedOption={selectedTask}
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

