// app.ts
import { Task, TaskStatus, addTask, completeTask, filterByStatus } from "./model.js";

let tasks: Task[] = [];
let filter: "all" | TaskStatus = "all";

// Grab elements — cast so tsc knows exactly what they are.
const titleInput = document.getElementById("title") as HTMLInputElement;
const addBtn = document.getElementById("add") as HTMLButtonElement;
const statusSelect = document.getElementById("status") as HTMLSelectElement;
const listEl = document.getElementById("list") as HTMLUListElement;
const chipsEl = document.getElementById("chips") as HTMLDivElement;

const statusOptions: Array<"all" | TaskStatus> = ["all", "todo", "in-progress", "done"];

function renderChips(): void {
  chipsEl.innerHTML = "";

  for (const option of statusOptions) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.textContent = option === "all" ? "All" : option;
    chip.classList.toggle("active", option === filter);
    chip.onclick = () => {
      filter = option;
      statusSelect.value = option === "all" ? "todo" : option;
      render();
    };
    chipsEl.appendChild(chip);
  }
}

function render(): void {
  const visibleTasks = filter === "all" ? tasks : filterByStatus(tasks, filter);
  listEl.innerHTML = "";

  if (visibleTasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No tasks in this view";
    listEl.appendChild(emptyItem);
    return;
  }

  for (const task of visibleTasks) {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${task.title} (${task.status})`;

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.textContent = task.status === "done" ? "Completed" : "Complete";
    doneBtn.disabled = task.status === "done";
    doneBtn.onclick = () => {
      tasks = completeTask(tasks, task.id);
      render();
    };

    item.append(label, doneBtn);
    listEl.appendChild(item);
  }

  renderChips();
}

addBtn.onclick = () => {
  const title = titleInput.value.trim();
  if (!title) return;

  tasks = addTask(tasks, title);
  titleInput.value = "";
  render();
};

statusSelect.onchange = () => {
  filter = statusSelect.value === "all" ? "all" : (statusSelect.value as TaskStatus);
  render();
};

render();