<script lang="ts">
    import type {Block} from "../../store/types";
    import type { IconItem } from "../types/types";
    import { blocksByWorkSpace } from "../../hooks/blockRegistry";
    import { workspaceStore, selectedWorkspace, selectedTask, updateBlock } from "../../store/store";

    import DropDown from "./DropDown.svelte";

    // Define icon actions
    const addBlock = () => {
        if ($selectedWorkspace) {
            console.log("Adding new block to workspace:", $selectedWorkspace.title);
            // Add your block creation logic here
        }
    };

    const editWorkspace = () => {
        console.log("Editing workspace:", $selectedWorkspace?.title);
        // Add edit workspace logic here
    };

    // Icon definitions using Iconify (Material Design Icons prefix: "mdi:")
    const icons: IconItem[] = [
        { icon: "mdi:plus", action: addBlock, title: "Add New Block" },
        { icon: "mdi:dots-vertical", action: editWorkspace, title: "Edit Workspace" },
    ];

    // Handle workspace selection
    const selectWorkspace = (workspaceId: string) => {
        // Deselect all workspaces
        Object.values($workspaceStore).forEach(ws => {
            if (ws.id !== workspaceId && ws.isSelected) {
                workspaceStore.update(store => {
                    store[ws.id].isSelected = false;
                    return store;
                });
            }
        });

        // Select the clicked workspace
        workspaceStore.update(store => {
            store[workspaceId].isSelected = true;
            return store;
        });
    }

    // Handle option selection event
    const handleTaskSelect = (event: CustomEvent) => {
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
    {#each Object.values($workspaceStore) as workspace, i}
        <div
                class="workspace-item rounded px-2"
                class:bg-blue-50={workspace.isSelected}
                role="option"
                aria-selected="true"
                tabindex={i}
                on:click={() => selectWorkspace(workspace.id)}
                on:keydown={(e) => (e.key === 'Enter') && selectWorkspace(workspace.id)}

        >
            <DropDown
                    title={$selectedWorkspace?.title}
                    options={$blocksByWorkSpace ?? []}
                    selectedOption={$selectedTask}
                    {icons}
                    isOpenByDefault={workspace.isSelected}
                    on:select={handleTaskSelect}
            />
        </div>
    {/each}
</div>

