<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import Flatpickr from 'svelte-flatpickr';
    import '../../styles/calender.css';

    /** Event dispatcher to notify parent components when selection changes */
    const dispatch = createEventDispatcher();

    // Flatpickr configuration
    const options = {
        minDate: new Date().toISOString().split("T")[0],
        inline: true,
        shorthandCurrentMonth: true
    };

    /**
     * Handle when the user selects a date.
     * Handles selection of Date from the Datepicker component from flowbite.
     */
    const handleDateSelect = (event: CustomEvent) => dispatch("select", event.detail);

</script>

<!-- Date Picker Input: Allows manual date selection -->
<Flatpickr children {options} on:change={handleDateSelect} />

