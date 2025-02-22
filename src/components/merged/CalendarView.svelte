<script>
  import { todos, tasks } from '../../store/store.js';

  // Function to get today's date in YYYY-MM-DD format without timezone issues
  function getLocalDateString(date) {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  let selectedDate = getLocalDateString(new Date()); // Default: today

  // Reactive block that filters tasks and todos by the selected date
  $: filteredItems = [
    ...$todos.filter(todo => {
      const todoDate = new Date(todo.startTime);
      return getLocalDateString(todoDate) === selectedDate;
    }).map(todo => ({
      ...todo,
      type: "Todo",
      parentTask: $tasks.find(task => task.id === todo.taskId)
    })),
    ...$tasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return getLocalDateString(taskDate) === selectedDate;
    }).map(task => ({
      ...task,
      type: "Task"
    }))
  ]
    .sort((a, b) => a.startTime - b.startTime);  // Sort by startTime

  function formatTime(date) {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  }
</script>

<!-- Date Picker -->
<label for="date">Select Date: </label>
<input type="date" id="date" bind:value={selectedDate}>

<!-- Display filtered tasks and todos -->
<ul>
    {#each filteredItems as item}
        <li>
            <div style="gap: .5em; display: flex; flex-direction: column; padding: .5em 0">
                <strong>{item.title}</strong>
                {#if item.description}
                    <span>{item.description}</span>
                {/if}
            </div>
            {#if item.parentTask}
                (in {item.parentTask.title})
            {/if}
            <br>
            🕒 Start: {formatTime(item.startTime)}
            <br>
            {#if item.completed}
                ✅ Completed at: {formatTime(item.endTime)}
            {/if}
            <br>
            <span style="background-color: {item.type === 'Task' ? 'lightblue' : 'lightgreen'}; padding: 2px 5px; border-radius: 5px;">
                {item.type}
            </span>
        </li>
    {/each}
</ul>
