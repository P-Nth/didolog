<!-- Overview -->
<script>
  import ItemList from "../components/merged/ItemList.svelte";
  import ItemInput from "../blocks/ItemInput.svelte";
  import WorkspaceView from "../components/merged/WorkspaceView.svelte";
</script>

<div class="overview flex flex-col gap-6">
    <header>
        <h1 class="text-base text-black-300">Overview</h1>
    </header>

    <section class="list-items flex gap-6">
        <div class="items flex flex-col">
            <WorkspaceView />
        </div>
        <div class="items flex flex-col">
            <div class="list-section">
                <ItemList />
            </div>
            <div class="input-section">
                <ItemInput />
            </div>
        </div>
        <div class="calendar rounded-lg p-4 bg-[e3e3e3]">
            <h2>Calendar View</h2>
            <!--        <CalendarView />-->
        </div>
    </section>

    <footer class="footer flex flex-col gap-6">

    </footer>
</div>

