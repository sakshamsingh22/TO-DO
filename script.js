const STORAGE_KEY = "focuslist.tasks.v1";
const THEME_KEY = "focuslist.theme";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const inputError = document.getElementById("inputError");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const filterButtons = Array.from(document.querySelectorAll(".chip"));
const clearCompletedBtn = document.getElementById("clearCompleted");
const themeToggle = document.getElementById("themeToggle");

const confirmModal = document.getElementById("confirmModal");
const confirmDelete = document.getElementById("confirmDelete");
const confirmCancel = document.getElementById("confirmCancel");

let tasks = [];
let currentFilter = "all";
let pendingDeleteId = null;

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const saveTasks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const loadTasks = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
};

const setTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.classList.add("is-dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.classList.remove("is-dark");
  }
  localStorage.setItem(THEME_KEY, theme);
};

const loadTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  setTheme(storedTheme || "light");
};

const updateCounts = () => {
  totalCount.textContent = tasks.length;
  const pending = tasks.filter((task) => !task.completed).length;
  pendingCount.textContent = pending;
};

const getFilteredTasks = () => {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }
  return tasks;
};

const renderTasks = () => {
  taskList.innerHTML = "";
  const filtered = getFilteredTasks();

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "task-item";
    empty.innerHTML = "<div class=\"task-title\"><span>No tasks here. Add something above.</span></div>";
    taskList.appendChild(empty);
    updateCounts();
    return;
  }

  filtered.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;
    item.dataset.id = task.id;

    item.innerHTML = `
      <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} aria-label="Toggle task" />
      <div class="task-title">
        <span>${task.title}</span>
        <small>Added ${formatDate(task.createdAt)}</small>
      </div>
      <div class="task-actions">
        <button class="icon-btn edit-btn">Edit</button>
        <button class="icon-btn delete-btn">Delete</button>
      </div>
    `;

    taskList.appendChild(item);
  });

  updateCounts();
};

const showError = (message) => {
  inputError.textContent = message;
};

const clearError = () => {
  inputError.textContent = "";
};

const addTask = (title) => {
  const trimmed = title.trim();
  if (!trimmed) {
    showError("Please enter a task before adding.");
    return;
  }

  const duplicate = tasks.some((task) => task.title.toLowerCase() === trimmed.toLowerCase());
  if (duplicate) {
    showError("That task already exists.");
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: Date.now(),
  });
  saveTasks();
  renderTasks();
  taskForm.reset();
  clearError();
  taskInput.focus();
};

const toggleTask = (id) => {
  tasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
  saveTasks();
  renderTasks();
};

const editTask = (id) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  const updated = prompt("Edit task:", task.title);
  if (updated === null) return;

  const trimmed = updated.trim();
  if (!trimmed) {
    showError("Task title cannot be empty.");
    return;
  }

  task.title = trimmed;
  saveTasks();
  renderTasks();
  clearError();
};

const requestDeleteTask = (id) => {
  pendingDeleteId = id;
  confirmModal.hidden = false;
};

const deleteTask = () => {
  if (!pendingDeleteId) return;
  const item = taskList.querySelector(`[data-id="${pendingDeleteId}"]`);
  if (item) {
    item.classList.add("removing");
    item.addEventListener(
      "animationend",
      () => {
        tasks = tasks.filter((task) => task.id !== pendingDeleteId);
        saveTasks();
        renderTasks();
      },
      { once: true }
    );
  } else {
    tasks = tasks.filter((task) => task.id !== pendingDeleteId);
    saveTasks();
    renderTasks();
  }
  confirmModal.hidden = true;
  pendingDeleteId = null;
};

const clearCompleted = () => {
  const hasCompleted = tasks.some((task) => task.completed);
  if (!hasCompleted) return;

  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
};

const setFilter = (filter) => {
  currentFilter = filter;
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderTasks();
};

const handleListClick = (event) => {
  const target = event.target;
  const item = target.closest(".task-item");
  if (!item) return;
  const id = item.dataset.id;

  if (target.classList.contains("checkbox")) {
    toggleTask(id);
  }

  if (target.classList.contains("edit-btn")) {
    editTask(id);
  }

  if (target.classList.contains("delete-btn")) {
    requestDeleteTask(id);
  }
};

const init = () => {
  loadTheme();
  loadTasks();
  renderTasks();
};

// Event listeners

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(taskInput.value);
});

taskInput.addEventListener("input", () => {
  if (inputError.textContent) {
    clearError();
  }
});

taskList.addEventListener("click", handleListClick);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

clearCompletedBtn.addEventListener("click", clearCompleted);

confirmCancel.addEventListener("click", () => {
  confirmModal.hidden = true;
  pendingDeleteId = null;
});

confirmDelete.addEventListener("click", deleteTask);

confirmModal.addEventListener("click", (event) => {
  if (event.target === confirmModal) {
    confirmModal.hidden = true;
    pendingDeleteId = null;
  }
});

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
});

init();
