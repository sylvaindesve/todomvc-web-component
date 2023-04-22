import {
  addItem,
  completeItem,
  removeCompleted,
  removeItem,
  setFilter,
  uncompleteItem,
  updateItemDescription,
} from "../model/actions.mjs";
import { selectItems } from "../model/reducer.mjs";

export class TodoApp {
  /** @type {import("../model/StateStore.mjs").StateStore<import("../model/reducer.mjs").TodoState>} */
  #model;

  /** @type {import("../components/TodoList.mjs").TodoList} */
  #view;

  /**
   * @type {string} Le nom de la balise HTML à utiliser pour créer les vues sur
   * les items
   */
  #todoItemViewTagName;

  constructor(model, view, todoItemViewTagName) {
    this.#model = model;
    this.#view = view;
    this.#todoItemViewTagName = todoItemViewTagName;

    this.#view.addEventListener("todo-new-todo", (event) => {
      this.#model.dispatch(
        addItem({
          id: crypto.randomUUID(),
          description: event.detail,
          completed: false,
        })
      );
    });

    this.#view.addEventListener("todo-item-completed", (event) => {
      const itemId = event.target.dataset.id;
      this.#model.dispatch(completeItem(itemId));
    });

    this.#view.addEventListener("todo-item-to-do", (event) => {
      const itemId = event.target.dataset.id;
      this.#model.dispatch(uncompleteItem(itemId));
    });

    this.#view.addEventListener("todo-item-deleted", (event) => {
      const itemId = event.target.dataset.id;
      this.#model.dispatch(removeItem(itemId));
    });

    this.#view.addEventListener("todo-item-description-updated", (event) => {
      const itemId = event.target.dataset.id;
      const newDescription = event.detail;
      this.#model.dispatch(updateItemDescription(itemId, newDescription));
    });

    this.#view.addEventListener("todo-filter-selected", (event) => {
      const filter = event.detail;
      this.#model.dispatch(setFilter(filter));
    });

    this.#view.addEventListener("todo-clear-completed", () => {
      this.#model.dispatch(removeCompleted());
    });

    this.#model.subscribe(() => this.updateView());
  }

  updateView() {
    const items = selectItems(this.#model.getState());
    const filter = this.#model.getState().filter;

    this.#view.setAttribute(
      "items-left",
      items.filter((item) => !item.completed).length
    );
    this.#view.setAttribute("filter", filter);

    const currentTodoItemViews = Array.from(this.#view.children);
    items.forEach((item) => {
      const currentTodoItemView = currentTodoItemViews.find(
        (view) => view.dataset.id === item.id
      );
      if (currentTodoItemView) {
        // Update current
        currentTodoItemView.setAttribute("description", item.description);
        if (item.completed) {
          currentTodoItemView.setAttribute("completed", "completed");
        } else {
          currentTodoItemView.removeAttribute("completed");
        }
      } else {
        // Add new
        const todoItemView = document.createElement(this.#todoItemViewTagName);
        todoItemView.dataset.id = item.id;
        todoItemView.setAttribute("description", item.description);
        if (item.completed) {
          todoItemView.setAttribute("completed", "completed");
        }
        this.#view.appendChild(todoItemView);
      }
    });

    // Remove
    const todoItemViewsToRemove = currentTodoItemViews.filter(
      (currentView) =>
        !items.map((item) => item.id).includes(currentView.dataset.id)
    );
    todoItemViewsToRemove.forEach((viewToRemove) =>
      this.#view.removeChild(viewToRemove)
    );
  }
}
