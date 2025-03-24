<script lang="ts">
    import type {Block} from "../../store/types";
    import { blocksByWorkSpace } from "../../hooks/blockRegistry";
    import {selectedWorkspace, selectedTask, updateBlock} from "../../store/store";

    import DropDown from "./DropDown.svelte";

    // Handle dropdown toggle event
    const handleToggle = (event: CustomEvent<{ menuOpen: boolean }>) => {
        console.log("Dropdown toggled:", event.detail.menuOpen);
    };

    // Handle icon click event
    const handleIconClick = () => {
        console.log("An icon was clicked.");
    };

    // Handle option selection event
    const handleSelect = (event: CustomEvent) => {
        const newTask = event.detail;
        const prevTask = $selectedTask;

        if (prevTask?.id !== newTask.id) {
            // Deselect the previous task
            prevTask && updateBlock(prevTask.id, { isSelected: false } as Partial<Block>);

            // Select the new task
            updateBlock(newTask.id, { isSelected: true } as Partial<Block>);
        }
    };

</script>

<div class="workspace-list flex flex-col">
    <DropDown
            title={$selectedWorkspace?.title}
            options={$blocksByWorkSpace ?? []}
            selectedOption={$selectedTask}
            icons={[]}
            isOpenByDefault={true}
            on:toggle={handleToggle}
            on:iconClick={handleIconClick}
            on:select={handleSelect}
    />
</div>

