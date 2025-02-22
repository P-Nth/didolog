<script>
  import ItemList from '../components/merged/ItemList.svelte';
  import ItemInput from "../components/merged/ItemInput.svelte";
  import CalendarView from '../components/merged/CalendarView.svelte';
</script>

<div class="overview">
    <h1>Overview</h1>

    <section class="list-items">
        <div class="todos">
            <div class="list-section">
                <ItemList type="todo" />
            </div>
            <div class="input-section">
                <ItemInput placeholder="Add a todo " type="todo" workspaceId={0} />
            </div>
        </div>


        <div class="tasks">
            <div class="list-section">
                <ItemList />
            </div>
            <div class="input-section">
                <ItemInput placeholder="Add a task" type="task" workspaceId={0} />
            </div>
        </div>
    </section>

    <section class="calendar">
        <h2>Calendar View</h2>
        <CalendarView />
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

