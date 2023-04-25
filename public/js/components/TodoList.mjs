const style = `
:host {
  display: block;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
}
:host([filter="active"]) ::slotted([completed]) {
  display: none !important;
}
:host([filter="completed"]) ::slotted(:not([completed])) {
  display: none !important;
}

.new-todo {
  box-sizing: border-box;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
  padding: 1rem;
  width: 100%;
  color: inherit;
  font: inherit;
}
.new-todo:focus {
  outline: 0;
}
.new-todo::placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

footer {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  font-size: 60%;
  color; #777;
}
footer > * {
  margin: 0 0.5rem;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  list-style: none;
}
.filters > li {
  margin: 0 0.5rem;
}
.filters > li > a {
  border: 1px solid transparent;
  border-radius: 0.2rem;
  padding: 0.2rem;
  text-decoration: none;
  color: inherit;
}
.filters > li > a:hover {
  border-color: rgba(175, 47, 47, 0.1);
}
.filters > li > a.selected {
  border-color: rgba(175, 47, 47, 0.2);
}

.clear-completed {
  appearance: none;
  border: 0;
  background: none;
  cursor: pointer;
  color: inherit;
  font: inherit;
}
.clear-completed:hover {
  text-decoration: underline;
}

.hide {
  display: none;
}
`;

const template = document.createElement("template");
template.innerHTML = `
<style>${style}</style>
<header>
  <input class="new-todo" type="text" placeholder="Qu'est-ce qui doit être fait ?" />
</header>
<slot></slot>
<footer>
  <p class="remaining">0 tâches à faire<p>
  <ul class="filters">
    <li><a class="all selected" href="#">Tous</a></li>
    <li><a class="active" href="#">A faire</a></li>
    <li><a class="completed" href="#">Terminés</a></li>
  </ul>
  <button class="clear-completed">Supprimer les tâches terminées</button>
</footer>`;

export class TodoList extends HTMLElement {
  static get observedAttributes() {
    return ["remaining", "filter"];
  }

  static get filterValues() {
    return ["all", "active", "completed"];
  }

  /** @type {HTMLInputElement} */
  #newTodoInput;
  /** @type {HTMLParagraphElement} */
  #remainingParagraph;
  /** @type {HTMLUListElement} */
  #filtersList;
  /** @type {HTMLButtonElement} */
  #clearCompletedButton;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#newTodoInput = this.shadowRoot.querySelector(".new-todo");
    this.#remainingParagraph = this.shadowRoot.querySelector(".remaining");
    this.#filtersList = this.shadowRoot.querySelector(".filters");
    this.#clearCompletedButton =
      this.shadowRoot.querySelector(".clear-completed");
  }

  connectedCallback() {
    this.#newTodoInput.addEventListener("change", () => {
      this.dispatchEvent(
        new CustomEvent("todo-new-todo", { detail: this.#newTodoInput.value })
      );
      this.#newTodoInput.value = "";
    });

    TodoList.filterValues.forEach((filterValue) => {
      this.#filtersList
        .querySelector("." + filterValue)
        .addEventListener("click", () => {
          this.dispatchEvent(
            new CustomEvent("todo-filter-selected", { detail: filterValue })
          );
        });
    });

    this.#clearCompletedButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent("todo-clear-completed"));
    });
  }

  attributeChangedCallback(name) {
    if (name === "remaining") {
      const plural = !(this.remaining === 1);
      this.#remainingParagraph.innerHTML = `${this.remaining} tâche${
        plural ? "s" : ""
      } à faire`;
    }

    if (name === "filter") {
      this.#filtersList
        .querySelectorAll("a")
        .forEach((filterLink) => filterLink.classList.remove("selected"));
      this.#filtersList
        .querySelector("." + this.filter)
        .classList.add("selected");
    }
  }

  set remaining(value) {
    const remainingValue = Number(value);
    if (isNaN(remainingValue)) {
      this.setAttribute("remaining", 0);
    } else {
      this.setAttribute("remaining", remainingValue);
    }
  }

  get remaining() {
    if (
      this.hasAttribute("remaining") &&
      !isNaN(Number(this.getAttribute("remaining")))
    ) {
      return Number(this.getAttribute("remaining"));
    } else {
      return 0;
    }
  }

  set filter(value) {
    const filterValue = TodoList.filterValues.includes(value) ? value : "all";
    this.setAttribute("filter", filterValue);
  }

  get filter() {
    if (
      !this.hasAttribute("filter") ||
      !TodoList.filterValues.includes(this.getAttribute("filter"))
    ) {
      return "all";
    }
    return this.getAttribute("filter");
  }
}

if (!window.customElements.get("todo-list")) {
  window.customElements.define("todo-list", TodoList);
}
