export class TodoList extends HTMLElement {
  static get style() {
    return `
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
  }

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
    <style>${this.style}</style>
    <header>
      <input class="new-todo" type="text" placeholder="Qu'est-ce qui doit être fait ?" />
    </header>
    <slot></slot>
    <footer>
      <p class="items-left"><p>
      <ul class="filters">
        <li><a class="all" href="#">Tous</a></li>
        <li><a class="active" href="#">A faire</a></li>
        <li><a class="completed" href="#">Terminés</a></li>
      </ul>
      <button class="clear-completed">Supprimer les tâches terminées</button>
    </footer>`;
    return template;
  }

  static get observedAttributes() {
    return ["items-left", "filter"];
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      this.constructor.template.content.cloneNode(true)
    );

    this.newTodoInput.addEventListener("change", () => {
      this.dispatchEvent(
        new CustomEvent("todo-new-todo", { detail: this.newTodoInput.value })
      );
      this.newTodoInput.value = "";
    });

    ["all", "active", "completed"].forEach((filterValue) => {
      this.filtersList
        .querySelector("." + filterValue)
        .addEventListener("click", () => {
          this.dispatchEvent(
            new CustomEvent("todo-filter-selected", { detail: filterValue })
          );
        });
    });

    this.clearCompletedButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent("todo-clear-completed"));
    });

    this.update("items-left", "filter");
  }

  attributeChangedCallback(name) {
    this.update(name);
  }

  get itemsLeft() {
    if (
      this.hasAttribute("items-left") &&
      !isNaN(Number(this.getAttribute("items-left")))
    ) {
      return Number(this.getAttribute("items-left"));
    }
    return 0;
  }

  get filter() {
    if (
      !this.hasAttribute("filter") ||
      !["all", "active", "completed"].includes(this.getAttribute("filter"))
    ) {
      return "all";
    }
    return this.getAttribute("filter");
  }

  get newTodoInput() {
    return this.shadowRoot.querySelector(".new-todo");
  }

  get itemsLeftParagraph() {
    return this.shadowRoot.querySelector(".items-left");
  }

  get filtersList() {
    return this.shadowRoot.querySelector(".filters");
  }

  get filterLinks() {
    return this.filtersList.querySelectorAll("a");
  }

  get clearCompletedButton() {
    return this.shadowRoot.querySelector(".clear-completed");
  }

  update(...attrs) {
    if (!this.shadowRoot) return;

    if (attrs.includes("items-left")) {
      const plural = !(this.itemsLeft === 1);
      this.itemsLeftParagraph.innerHTML = `${this.itemsLeft} tâche${
        plural ? "s" : ""
      } à faire`;
    }

    if (attrs.includes("filter")) {
      this.filtersList
        .querySelectorAll("a")
        .forEach((filterLink) => filterLink.classList.remove("selected"));
      this.filtersList
        .querySelector("." + this.filter)
        .classList.add("selected");
    }
  }
}
if (!window.customElements.get("todo-list")) {
  window.customElements.define("todo-list", TodoList);
}
