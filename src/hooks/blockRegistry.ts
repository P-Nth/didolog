import type { ComponentType } from "svelte";
import {derived, type Readable} from "svelte/store";

import type { Block } from "../store/types";
import {blockStore, selectedTask} from "../store/store";

import TodoView from "../blocks/TodoView.svelte";
import NoteView from "../blocks/NoteView.svelte";
import SectionView from "../blocks/SectionView.svelte";

// Define a string literal type for the allowed block types
export type BlockType = 'todo' | 'note' | 'section';

// Create a type-safe registry
export const blockRegistry: Record<BlockType, ComponentType> = {
    todo: TodoView,
    note: NoteView,
    section: SectionView
};

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

