//Selectors
const todoInput = document.querySelector(".todo-input");
const filterButton = document.querySelector(".filter-btns");
const allButton = document.querySelector(".all-btn");
const completedButton = document.querySelector(".completed-btn");
const uncompletedButton = document.querySelector(".uncompleted-btn");
const addTodo = document.querySelector(".add-todo");
const todoItems = document.querySelector(".todo-items");
const completedTodo = document.querySelector(".completed-todo");
const todoTotalCount = document.querySelector(".total-todo");
const todoUncompletedlCount = document.querySelector(".uncompleted-todo");
const todoCheckCount = document.querySelector(".todo-check");
const toxProgress = document.querySelector(".tox-progress");
const progressText = document.querySelector(".text-center");
const apiError = document.querySelector(".api_error");
const container = document.querySelector(".container");

const url = "http://127.0.0.1:8000/todo/";

//declaring Variables
let total = 0;
let undone = 0;
let done = 0;

//Event HAndling
addTodo.addEventListener("click", addTodoItem);
todoItems.addEventListener("click", todoItemAction);
filterButton.addEventListener("click", filterTodoitems);

document.addEventListener("DOMContentLoaded", (event) => {
  //Calling startup variables and functions
  todoInput.style.display = "none";
  addTodo.style.display = "none";
  container.style.display = "none";
  apiError.innerHTML =
    "<img class='loading' src='images/loading.gif' alt='Network Error Image' /><br />";

  fetchTodo();
});

//-------------------Functions-------------------------

function createTodoItem() {
  //create new todo item
  const todoDiv = document.createElement("div");
  //adding class to the todoDiv just created
  todoDiv.classList.add("todoCollection");
  todoDiv.setAttribute("data-id", "");

  //creating a check-box items
  const todoCheck = document.createElement("input");
  todoCheck.classList.add("todo-check");
  todoCheck.setAttribute("type", "checkbox");
  //Appending child element to parent div
  todoDiv.appendChild(todoCheck);

  //creating a 'b' to hold the todo Strings
  const todoString = document.createElement("span");
  todoString.innerText = todoInput.value.trim();
  todoString.classList.add("todo-string");
  //Appending child element to parent div
  todoDiv.appendChild(todoString);

  //creating a button to delete items
  const todoDelete = document.createElement("i");
  todoDelete.classList.add("fa");
  todoDelete.classList.add("fa-trash");
  todoDelete.classList.add("todo-delete");
  todoDelete.setAttribute("aria-hidden", "true");

  //Appending child element to parent div
  todoDiv.appendChild(todoDelete);

  return todoDiv;
}

function addTodoItem(Event) {
  const todoValue = todoInput.value;

  if (todoValue.trim() != "") {
    todoDiv = createTodoItem();

    const todo = {
      title: todoValue.trim(),
    };

    saveTodo(todo, todoDiv);
  } else {
    alert("Todo Item cant be empty!");
  }
}

function todoItemAction(e) {
  item = e.target;
  const todo = item.parentElement;
  //Delete Todo Items from List
  if (item.classList[2] === "todo-delete") {
    const text = todo.querySelector(".todo-string");

    //delete confirmation alert
    if (
      window.confirm(
        "Do want to delete this todo task? \n \n" + " '" + text.innerText + "'"
      )
    ) {
      if (todo.classList[1] === "completed") {
        total--;
        undone--;
        done--;
      } else {
        total--;
      }
      todo.classList.remove("completed");
      deleteTodo(todo);
    }
  } else if (item.classList[0] === "todo-check") {
    // Looking for Checked Checkbox
    if (item.checked) {
      //Applying strike-through if an item is done;
      const todoText = todo.querySelector(".todo-string");
      todoText.classList.add("strike");
      todo.classList.add("completed");
      const update = {
        completed: true,
      };

      updateTodo(update, todo);

      done++;
      calUndone();
    } else {
      const update = {
        completed: false,
      };
      //Removing strike-through CSS if an item is done;
      const todoText = todo.querySelector(".todo-string");
      todoText.classList.remove("strike");
      todo.classList.remove("completed");

      updateTodo(update, todo);

      done--;
      calUndone();
    }
  }
}

function calUndone() {
  undone = total - done;
  todoUncompletedlCount.innerText = undone;
  todoTotalCount.innerText = total;
  progressCalculation(total, done);
}

function progressCalculation(totalTodo, doneTodo) {
  let progressCount = ((doneTodo / totalTodo) * 100).toFixed(1);
  toxProgress.setAttribute("data-progress", Math.round(progressCount));
  if (progressCount.isNaN) {
    progressText.innerText = 0 + "%";
    ToxProgress.create();
    ToxProgress.animate();
  } else {
    ToxProgress.create();
    ToxProgress.animate();
    progressText.innerText = progressCount + "%";
  }
}

function filterTodoitems(e) {
  const todoGroup = document.querySelectorAll(".todoCollection");

  todoGroup.forEach(function (todo) {
    if (e.target.classList.contains("completed-btn")) {
      if (todo.classList.contains("completed")) {
        const collection = document.querySelector(".todoCollection");

        //highlighting selected button
        completedButton.classList.add("selected_btn");
        allButton.classList.remove("selected_btn");
        uncompletedButton.classList.remove("selected_btn");

        todo.style.display = "flex";
      } else {
        todo.style.display = "none";
      }
    } else if (e.target.classList.contains("uncompleted-btn")) {
      if (!todo.classList.contains("completed")) {
        const collection = document.querySelector(".todoCollection");

        //highlighting selected button
        completedButton.classList.remove("selected_btn");
        allButton.classList.remove("selected_btn");
        uncompletedButton.classList.add("selected_btn");

        todo.style.display = "flex";
      } else {
        todo.style.display = "none";
      }
    } else if (e.target.classList.contains("all-btn")) {
      //highlighting selected button
      completedButton.classList.remove("selected_btn");
      allButton.classList.add("selected_btn");
      uncompletedButton.classList.remove("selected_btn");
      todo.style.display = "flex";
    }
  });
}

const fetchTodo = async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(res.status);
      console.log(res.status);
    }
    const data = await res.json();
    // get total items and appending it
    total = data.length;
    todoTotalCount.innerText = total;

    data.forEach(function (todo) {
      const todoDiv = createTodoItem();
      // setting data-id
      todoDiv.setAttribute("data-id", todo.id);
      // setting string value
      const textItem = todoDiv.querySelector(".todo-string");
      textItem.innerText = todo.title;

      if (todo.completed === true) {
        done++;
        todoDiv.classList.add("completed");
        textItem.classList.add("strike");
        const checkItem = todoDiv.querySelector(".todo-check");
        checkItem.setAttribute("checked", "");
      }
      //Apend child html
      todoItems.appendChild(todoDiv);
    });
    allButton.classList.add("selected_btn");
    apiError.style.display = "none";
    todoInput.style.display = "";
    addTodo.style.display = "";
    container.style.display = "";
    calUndone();
    todoUncompletedlCount.innerText = total - done;
  } catch (error) {
    apiError.innerHTML =
      "<h2 class='sever_error'> " +
      "<img src='images/connecting-cables.jpg' alt='Network Error Image' /><br />" +
      "Connection Error: Unable to fetch data from server! <br /> <span>Refresh and try again</span></h2>";
    container.style.display = "none";
    todoInput.style.display = "none";
    addTodo.style.display = "none";
  }
};

function saveTodo(todo, todoDiv) {
  const request = new Request(url, {
    method: "POST",
    body: JSON.stringify(todo),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  // pass request object to `fetch()`
  fetch(request)
    .then((res) => res.json())
    .then((res) => {
      // setting data-id from return from rewuest response
      todoDiv.setAttribute("data-id", res.id);

      // add +1 total, undone items and appending it
      total++;
      undone++;
      todoTotalCount.innerText = total;
      todoUncompletedlCount.innerText = undone;

      //Apend child html
      // todoItems.appendChild(todoDiv);
      todoItems.insertBefore(todoDiv, todoItems.firstChild);

      //Clearing input field
      todoInput.value = "";
    });
}

function updateTodo(update, todo) {
  const id = todo.getAttribute("data-id");
  const request = new Request(url + id + "/", {
    method: "PATCH",
    body: JSON.stringify(update),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  // pass request object to `fetch()`
  fetch(request).then((res) => res.json());
}

function deleteTodo(todo) {
  // const todoCheckBox = todo.querySelector(".todo-check");
  const id = todo.getAttribute("data-id");

  todo.classList.add("fadeout");
  todo.addEventListener("transitionend", function () {
    // Looking for Checked Checkbox
    todo.remove();
    todoTotalCount.innerText = total;
    calUndone();
  });
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url + id + "/", options)
    .then((res) => {
      if (res.ok) {
        return Promise.resolve("Todo Item deleted.");
      } else {
        return Promise.reject("An error occurred.");
      }
    })
    .then((res) => console.log(res));
}
