<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import type {Section} from "../store/types";
    import { addBlock, selectedTask } from "../store/store";
    import InputField from "../components/individual/InputField.svelte";

    let title = "";

    let inputRef: InputField | null = null;

    export const focusSecInput = () => inputRef?.focusInput();

    onMount(() => { focusSecInput(); });

    const dispatch = createEventDispatcher();

    function handleAddSection() {
        !title.trim() && dispatch("complete");

        addBlock<Section>({type: "section", title: title.trim(), parentId: $selectedTask.id,});

        title = "";

        dispatch("complete");
    }
</script>

<div class="section-input flex mt-2.5 gap-2">
    <InputField
            type="text"
            bind:value={title}
            bind:this={inputRef}
            placeholder="Add a section title..."
            onEnter={handleAddSection}
            className="text-xl font-semibold text-gray-700"
    />
</div>

