<!-- Overview -->
<script>
  import ItemList from "./ItemList.svelte";
  import ItemInput from "../blocks/ItemInput.svelte";
</script>

<div class="overview">
    <h1 class="text-base text-black-300">Overview</h1>

    <section class="list-items">
        <div class="todos">
            <div class="list-section">
                <ItemList />
            </div>
            <div class="input-section">
                <ItemInput />
            </div>
        </div>
    </section>

    <section class="calendar">
        <h2>Calendar View</h2>
        <!--        <CalendarView />-->
    </section>
</div>

<style>
    .overview {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .list-items {
        display: flex;
        gap: 1rem;
    }

    .todos {
        display: flex;
        flex-direction: column;
    }

    .calendar {
        background: #e3e3e3;
        padding: 1rem;
        border-radius: 8px;
    }
</style>

