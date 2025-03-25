<script lang="ts">
    import  { createEventDispatcher } from 'svelte';
    import Icon from "@iconify/svelte";

    import {toSentenceCase} from "../../hooks/reusable";
    import type {IconItem} from "../types/types";

    import DropDownItem from "../individual/DropDownItem.svelte";
    import UniIcon from "../individual/DdlIcon.svelte";

    export let title: string = "DropDown";
    export let options: any[];
    export let selectedOption: any = null;
    export let icons: IconItem[] = [];
    export let isOpenByDefault: boolean = false;
    export let className: string = "";

    $: menuOpen = isOpenByDefault;

    const dispatch = createEventDispatcher();

    // Handle icon click
    const handleIconClick = (icon: IconItem) => icon.action();

    // Handle icon click
    const handleOptionSelect = (option: any) => dispatch('select', option);

    /**
     * Svelte action that detects clicks outside the specified element and triggers a callback.
     *
     * @param node - The DOM node to monitor for outside clicks.
     * @returns An object with a `destroy` method to clean up the event listener.
     */
    const clickOutside = (node: HTMLElement) => {
        const handleClick = (event: MouseEvent) => {
            if (!node.contains(event.target as Node)) {
                dispatch('clickOutside', { menuOpen: false });
            }
        };

        document.addEventListener('click', handleClick, true);
        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            },
        };
    }
</script>

<div class="dropdown-container relative {className}" use:clickOutside>
    <div class="dropdown-header w-full flex items-center justify-between cursor-pointer">
        <div
                class="title-button flex-1 flex items-center justify-between "
                role="menu"
                tabindex="0"
                on:click={() => menuOpen = !menuOpen}
                on:keydown={(e) => (e.key === "Enter" || e.key === " ") && (menuOpen = !menuOpen)}

        >
            <span class="title">{title}</span>
            <Icon
                    icon="mdi-light:chevron-down"
                    class="text-gray-800 text-[24px] ml-2 transition-transform duration-200 {menuOpen ? 'rotate-180' : 'rotate-0'}"
                    on:click={() => menuOpen = !menuOpen}
                    on:keydown={(e) => (e.key === "Enter" || e.key === " ") && (menuOpen = !menuOpen)}
            />
        </div>

        {#if icons.length > 0}
            <div class="icons-container flex gap-1 ml-1">
                {#each icons as iconItem, i}
                    <div
                            class="cursor-pointer bg-none p-[3px] rounded hover:bg-blue-100"
                            role="button"
                            tabindex={i}
                            title={iconItem.title}
                            on:click={() => handleIconClick(iconItem)}
                            on:keydown={(e) => (e.key === 'Enter') && handleIconClick(iconItem)}
                    >
                        <Icon icon={iconItem.icon} class="text-[16px]" />
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    {#if menuOpen}
        <div class="dropdown-list absolute top-full w-full left-0 right-0 bg-white border border-blue-50 rounded mt-1 list-none z-50 overflow-y-auto transition-all duration-200 ease-in-out">
            {#if options.length === 0}
                <span class="no-options">Nothing to see here!</span>
            {:else}
                {#each options as option}
                    <div
                            class="option-item cursor-pointer flex flex-col rounded-[0.4em] py-[0.3em] transition-colors duration-200 ease-in-out hover:bg-[#f5f5f5]"
                            class:text-blue-400={selectedOption?.id === option.id}
                            class:underline={selectedOption?.id === option.id}
                            role="option"
                            tabindex="0"
                            aria-selected={options.some(option => option.id === selectedOption?.id)}
                            on:click|stopPropagation={() => handleOptionSelect(option)}
                            on:keydown={(e) => (e.key === 'Enter') && handleOptionSelect(option)}
                    >
                        <!--
                          DropDownItem:
                          - Displays the option title with optional left and right icons.
                          - Clicking an option triggers a `select` event.
                        -->
                        <DropDownItem text={toSentenceCase(option.title)}>
                            <svelte:fragment slot="rightIcon">
                                <UniIcon><span>R</span></UniIcon>
                            </svelte:fragment>
                        </DropDownItem>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>

