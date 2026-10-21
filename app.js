const app = document.querySelector("#app");

let habits = [
  { id: 1, name: "Read 20 minutes", days: ["2026-10-20"] },
  { id: 2, name: "Walk outside", days: [] },
];

// Helper: Timezone-aware local YYYY-MM-DD date string
const today = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper: Calculate consecutive daily streak ending today or yesterday
function calculateStreak(days) {
  if (!days || days.length === 0) return 0;

  const sortedDays = Array.from(new Set(days)).sort().reverse();
  const todayStr = today();

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yearY = yesterday.getFullYear();
  const monthY = String(yesterday.getMonth() + 1).padStart(2, "0");
  const dayY = String(yesterday.getDate()).padStart(2, "0");
  const yesterdayStr = `${yearY}-${monthY}-${dayY}`;

  if (!sortedDays.includes(todayStr) && !sortedDays.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  let curr = new Date(sortedDays.includes(todayStr) ? todayStr : yesterdayStr);

  while (true) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, "0");
    const d = String(curr.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    if (sortedDays.includes(dateStr)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function render() {
  const t = today();
  const done = habits.filter((h) => h.days.includes(t)).length;
  const progressPercent = habits.length > 0 ? (done / habits.length) * 100 : 0;

  app.innerHTML = `
    <div class="row space">
      <div>
        <span class="label">Daily rhythm</span>
        <h2>${done}/${habits.length} today</h2>
      </div>
      <span class="pill">${t}</span>
    </div>
    
    <div class="bar">
      <i style="width:${progressPercent}%"></i>
    </div>

    <!-- Add New Habit Form -->
    <form id="add-habit-form" class="row" style="margin-top: 18px; gap: 8px;">
      <input type="text" id="habit-name-input" placeholder="Enter a new habit..." required style="flex: 1;" />
      <button type="submit">Add Habit</button>
    </form>

    <div class="list">
      ${
        habits.length === 0
          ? `<p class="muted small" style="text-align: center; padding: 12px;">No habits added yet. Start by adding one above!</p>`
          : habits
              .map((h) => {
                const checked = h.days.includes(t);
                const streak = calculateStreak(h.days);
                return `
                  <article class="item">
                    <div>
                      <strong>${h.name}</strong>
                      <span class="muted small">${streak} day streak</span>
                    </div>
                    <button class="${checked ? "secondary" : ""}" data-toggle="${h.id}">
                      ${checked ? "Completed" : "Mark done"}
                    </button>
                  </article>
                `;
              })
              .join("")
      }
    </div>
  `;

  // Attach event listener for adding new habits
  const addForm = document.querySelector("#add-habit-form");
  addForm.onsubmit = (e) => {
    e.preventDefault();
    const input = document.querySelector("#habit-name-input");
    const name = input.value.trim();
    if (name) {
      habits.push({
        id: Date.now(),
        name: name,
        days: [],
      });
      render();
    }
  };

  // Attach event listeners for toggling habit completion
  document.querySelectorAll("[data-toggle]").forEach((b) => {
    b.onclick = () => {
      const id = Number(b.dataset.toggle);
      const h = habits.find((x) => x.id === id);

      if (h.days.includes(t)) {
        h.days = h.days.filter((d) => d !== t);
      } else {
        h.days.push(t);
      }

      render();
    };
  });
}

render();