const todoApp = {
  init() {
    this.getAndRefreshTime();
    setInterval(() => this.getAndRefreshTime(), 1000);
    this.input = document.querySelector("#todoInput");
    this.todoList = document.querySelector("#todoList");
    this.loadTasks();
    this.addEventListeners();
  },

  getAndRefreshTime() {
    const dateElement = document.querySelector("#date");
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    dateElement.textContent = currentDate;
  },

  loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("taskList"));
    if (storedTasks) {
      storedTasks.forEach((task) => this.addTask(task));
    }
  },

  addEventListeners() {
    document
      .querySelector("#addButton")
      .addEventListener("click", () => this.handleAddTask());
    document
      .querySelector("#clearButton")
      .addEventListener("click", () => this.clearList());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.target.value.trim() !== "") {
        this.handleAddTask();
      }
    });
  },

  handleAddTask() {
    if (this.input.value.trim() !== "") {
      this.addTask(this.input.value);
      this.input.value = "";
    }
  },

  addTask(taskText) {
    const li = this.createListItem(taskText);
    this.todoList.appendChild(li);
    this.input.focus();
    this.updateIds();
    this.updateLocalStorage();
  },

  createListItem(taskText) {
    const li = document.createElement("li");
    li.classList.add("list-item");

    const idSpan = document.createElement("span");
    li.appendChild(idSpan);

    const taskTextNode = document.createElement("p");
    taskTextNode.textContent = taskText;
    li.appendChild(taskTextNode);

    const doneButton = this.createButton("Done", this.toggleDone);
    li.appendChild(doneButton);

    const removeButton = this.createButton(
      "Remove",
      this.removeTask.bind(this)
    );
    li.appendChild(removeButton);

    return li;
  },

  createButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
  },

  toggleDone() {
    this.parentNode.classList.toggle("done");
  },

  removeTask(event) {
    const button = event.currentTarget;
    const li = button.parentNode;
    li.parentNode.removeChild(li);
    this.updateLocalStorage();
    this.updateIds();
  },

  clearList() {
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }
    this.updateLocalStorage();
  },

  updateIds() {
    const listItems = this.todoList.querySelectorAll("li");
    listItems.forEach((li, i) => {
      li.id = "Task " + (i + 1) + ": ";
      const idSpan = li.querySelector("span");
      idSpan.textContent = li.id;
    });
    this.input.focus();
    this.updateLocalStorage();
  },

  updateLocalStorage() {
    const listItems = this.todoList.querySelectorAll("li");
    const tasks = Array.from(listItems).map(
      (li) => li.querySelector("p").textContent
    );
    localStorage.setItem("taskList", JSON.stringify(tasks));
  },
};

window.addEventListener("load", () => {
  todoApp.init();
});
