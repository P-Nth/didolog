<script>
  import { blocksByTask } from "../../hooks/blocksByTask";

  const componentCache = new Map();

  async function getBlockComponent(type) {
    if (componentCache.has(type)) {
      return componentCache.get(type);
    }

    try {
      const componentName = type.charAt(0).toUpperCase() + type.slice(1) + 'View';
      const module = await import(`./${componentName}.svelte`);
      componentCache.set(type, module.default);
      return module.default;
    } catch (error) {
      console.error(`Failed to load component for block type: ${type}`, error);
      return null;
    }
  }
</script>

<div class="blocks-container flex flex-col gap-3">
    {#each $blocksByTask as block (block.id)}
        <div class="block-wrapper rounded-md overflow-hidden">
            {#await getBlockComponent(block.type) then Component}
                {#if Component}
                    <svelte:component this={Component} {block} on:update on:delete />
                {/if}
            {/await}
        </div>
    {/each}
</div>


