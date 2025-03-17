<script lang="ts">
    import {updateBlock, deleteBlock} from '../store/store';
    import type {Block, Section} from '../store/types';
    import EditableText from "../components/merged/EditableText.svelte";

    export let block: Section = {} as Section;

    let editableItemTitle: string;

    $: editableItemTitle = block.title;

    const handleTitleUpdate = (newTitle: string): void => updateBlock(block.id, { title: newTitle } as Partial<Block>);

    const handleRemoveBlock = () => deleteBlock(block.id);

</script>

<div class="item-view-container border border-black-300 rounded-[5px] px-2 py-1.5 w-full">
    <EditableText
            text={editableItemTitle}
            on:updateItem={(e) => handleTitleUpdate(e.detail.text)}
            on:removeItem={handleRemoveBlock}
    />
</div>

