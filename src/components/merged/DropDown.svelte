<script lang="ts">
    import  { createEventDispatcher } from 'svelte';

    import {toSentenceCase} from "../../hooks/reusable";
    import type {IconItem} from "../types/types";

    import DropDownItem from "../individual/DropDownItem.svelte";
    import UniIcon from "../individual/UniIcon.svelte";

    export let title: string = "DropDown";
    export let options: any[];
    export let selectedOption: any = null;
    export let icons: IconItem[] = [];
    export let isOpenByDefault: boolean = false;

    $: menuOpen = isOpenByDefault;

    const dispatch = createEventDispatcher();

    // Toggle dropdown
    const toggleMenu = () => {
        menuOpen = !menuOpen;
        dispatch('toggle', { menuOpen });
    }

    // Handle icon click
    const handleIconClick = (icon: IconItem) => {
        icon.action();
        dispatch('iconClick', { icon });
    }

    // Handle icon click
    const handleOptionSelect = (option: any) => {
        dispatch('select', option);
    }

    /**
     * Svelte action that detects clicks outside the specified element and triggers a callback.
     *
     * @param node - The DOM node to monitor for outside clicks.
     * @returns An object with a `destroy` method to clean up the event listener.
     */
    function clickOutside(node: HTMLElement) {
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

<div class="dropdown-container relative w-full" use:clickOutside>
    <div class="dropdown-header flex items-center justify-between cursor-pointer">
        <div
                class="title-button flex-1 flex items-center justify-between "
                role="menu"
                tabindex="0"
                on:click={toggleMenu}
                on:keydown={(e) => (e.key === "Enter" || e.key === " ") && toggleMenu()}

        >
            <span class="title">{title}</span>
            <span class="material-icons dropdown-icon">
                {menuOpen ? 'expand_less' : 'expand_more'}
            </span>
        </div>

        {#if icons.length > 0}
            <div class="icons-container">
                {#each icons as iconItem}
                    <div
                            class="cursor-pointer bg-none hover:bg-[#333]"
                            role="button"
                            tabindex="0"
                            title={iconItem.title}
                            on:click={() => handleIconClick(iconItem)}
                            on:keydown={(e) => (e.key === 'Enter') && handleIconClick(iconItem)}
                    >
                        <span class="material-icons">{iconItem.icon}</span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    {#if menuOpen}
        <div class="dropdown-list absolute top-full left-0 right-0 bg-white border border-blue-100 rounded mt-1 list-none z-50 overflow-y-auto transition-all duration-200 ease-in-out">
            {#if options.length === 0}
                <span class="no-options">Nothing to see here!</span>
            {:else}
                {#each options as option}
                    <div
                            class="option-item cursor-pointer flex flex-col rounded-[0.4em] py-[0.3em] transition-colors duration-200 ease-in-out hover:bg-[#f5f5f5]"
                            class:text-blue-700={selectedOption?.id === option.id}
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

