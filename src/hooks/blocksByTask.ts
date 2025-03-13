import {derived} from "svelte/store";
import {blockStore, selectedTask} from "../store/store";


export const blocksByTask = derived(
    [blockStore, selectedTask],
    ([$blockStore, $selectedTask]) =>
        Object.values($blockStore)
            .filter(block => block.parentId === $selectedTask?.id)
            .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
);