import { derived, type Readable } from "svelte/store";

import type { Block } from "../store/types";
import { blockStore, selectedTask } from "../store/store";

import TodoInput from "../blocks/TodoInput.svelte";
import NoteInput from "../blocks/NoteInput.svelte";
import SectionInput from "../blocks/SectionInput.svelte";

import TodoView from "../blocks/TodoView.svelte";
import NoteView from "../blocks/NoteView.svelte";
import SectionView from "../blocks/SectionView.svelte";

/**
 * A derived store that provides a list of blocks associated with the currently selected task.
 * It filters blocks by `parentId` matching the selected task's ID and sorts them by creation date.
 *
 * @constant {Readable<Block[]>} blocksByTask - A store containing blocks related to the selected task.
 */
export const blocksByTask: Readable<Block[]> = derived(
    [blockStore, selectedTask],
    ([$blockStore, $selectedTask]) =>
        Object.values($blockStore)
            .filter((block) => block.parentId === $selectedTask?.id)
            .sort(
                (a, b) =>
                    new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
            )
);

/**
 * A registry that maps block types to their respective input and view components.
 * This allows dynamic selection of the correct component for a given block type.
 *
 * @constant {Record<string, { input: any; view: any }>} blockRegistry
 * @property {SvelteComponent} input - The input component associated with the block type.
 * @property {SvelteComponent} view - The view component associated with the block type.
 */
export const blockRegistry: Record<string, { input: any; view: any }> = {
    todo: { input: TodoInput, view: TodoView },
    note: { input: NoteInput, view: NoteView },
    section: { input: SectionInput, view: SectionView }
};

