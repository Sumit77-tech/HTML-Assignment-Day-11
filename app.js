// Get DOM elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const searchBar = document.getElementById("search-bar");

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = '';
  tasks.forEach(task => renderTask(task));
}

// Save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render task on the UI
function renderTask(task) {
  const li = document.createElement("li");
  li.classList.toggle("completed", task.completed);

  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <button class="remove-btn">Remove</button>
  `;

  // Mark task as completed
  li.addEventListener("click", () => toggleTaskCompletion(task.id));

  // Remove task
  li.querySelector(".remove-btn").addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the task from being marked as completed
    removeTask(task.id);
  });

  taskList.appendChild(li);
}

// Add task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const newTask = {
      id: Date.now(), // Use timestamp as unique ID
      text: taskText,
      completed: false,
    };
    
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(newTask);
    saveTasks(tasks);
    renderTask(newTask);

    taskInput.value = ''; // Clear input field
  }
});

// Toggle task completion
function toggleTaskCompletion(taskId) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
    loadTasks(); // Re-render the tasks after state change
  }
}

// Remove task
function removeTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks(tasks);
  loadTasks(); // Re-render the tasks after removal
}

// Search tasks
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = '';
  tasks.filter(task => task.text.toLowerCase().includes(query))
       .forEach(task => renderTask(task));
});

// Initial load
loadTasks();
