import "./components/TodoItem.mjs";
import { StateStore } from "./model/StateStore.mjs";
import { TodoApp } from "./controller/TodoApp.mjs";
import { TodoList } from "./components/TodoList.mjs";
import reducer from "./model/reducer.mjs";
import { setState } from "./model/actions.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const store = new StateStore(reducer);
  const todoList = new TodoList();

  new TodoApp(store, todoList, "todo-item");
  document.getElementById("root").appendChild(todoList);

  if (window.localStorage) {
    if (window.localStorage.getItem("todo-app-state")) {
      const storedState = JSON.parse(
        window.localStorage.getItem("todo-app-state")
      );
      store.dispatch(setState(storedState));
    }
    store.subscribe(() => {
      window.localStorage.setItem(
        "todo-app-state",
        JSON.stringify(store.getState())
      );
    });
  }
});
