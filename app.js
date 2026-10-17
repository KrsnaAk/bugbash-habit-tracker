const app = document.querySelector("#app");
let habits = [
  { id: 1, name: "Read 20 minutes", days: ["2026-10-20"] },
  { id: 2, name: "Walk outside", days: [] },
];
const today = () => new Date().toISOString().slice(0, 10);
function render() {
  const done = habits.filter((h) => h.days.includes(today())).length;
  app.innerHTML = `<div class="row space"><div><span class="label">Daily rhythm</span><h2>${done}/${habits.length} today</h2></div><span class="pill">${today()}</span></div><div class="bar"><i style="width:${(done / habits.length) * 100}%"></i></div><div class="list">${habits
    .map((h) => {
      const checked = h.days.includes(today());
      return `<article class="item"><div><strong>${h.name}</strong><span class="muted small">${h.days.length} day streak</span></div><button class="${checked ? "secondary" : ""}" data-toggle="${h.id}">${checked ? "Completed" : "Mark done"}</button></article>`;
    })
    .join("")}</div>`;
  document.querySelectorAll("[data-toggle]").forEach(
    (b) =>
      (b.onclick = () => {
        const h = habits.find((x) => x.id === Number(b.dataset.toggle));
        h.days.push(today());
        render();
      }),
  );
}
render();
