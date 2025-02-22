<script>
  export let status = "default";
  export let linkedTask = "";

  // Map status to emoji/icons & colors
  const statusMap = {
    completed: { icon: "✅", color: "green", text: "Completed" },
    "in-progress": { icon: "⏳", color: "orange", text: "In Progress" },
    linked: { icon: "📌", color: "blue", text: "Linked Task", linkedTask },
    default: { icon: "⚪", color: "gray", text: "Unknown Status" }
  };

  let { icon, color, text } = statusMap[status] || statusMap.default;
</script>

<p class="status-indicator"><span style="color: {color};">{icon} {text}</span> {linkedTask}</p>

<style>
  .status-indicator {
    gap: .5rem;
    display: flex;
    font-weight: bold;
  }
</style>
