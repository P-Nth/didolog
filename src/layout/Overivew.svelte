<!-- Overview -->
<script>
  import ItemList from "../blocks/ItemList.svelte";
  import ItemInput from "../blocks/ItemInput.svelte";
</script>

<div class="overview flex flex-col gap-6">
    <h1 class="text-base text-black-300">Overview</h1>

    <section class="list-items">
        <div class="items flex flex-col">
            <div class="list-section">
                <ItemList />
            </div>
            <div class="input-section">
                <ItemInput />
            </div>
        </div>
    </section>

    <section class="calendar rounded-lg p-4 bg-[e3e3e3]">
        <h2>Calendar View</h2>
        <!--        <CalendarView />-->
    </section>
</div>

