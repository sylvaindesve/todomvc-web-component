export class TodoItem extends HTMLElement {
  static get style() {
    return `
    .view {
      display: flex;
      padding: 1rem;
    }
    .completed {
      margin: auto 0.2rem;
      height: 100%;
    }
    .completed:checked + .description {
      text-decoration: line-through;
    }
    .description {
      margin: auto 0.2rem;
    }
    :hover .delete {
      visibility: visible;
    }
    .delete {
      appearance: none;
      transition: color 0.2s ease-out;
      visibility: hidden;
      margin: auto 0.2rem;
      margin-left: auto;
      border: 0;
      background: none;
      padding: 0;
      color: #cc9a9a;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
    }
    .delete:hover {
      color: #af5b5e;
    }
    .edit {
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      box-sizing: border-box;
      width: 100%;
      padding: 1rem;
    }
    .edit:focus {
      outline: 0;
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
    <div class="view">
      <input class="completed" type="checkbox" />
      <label class="description"></label>
      <button class="delete">X</button>
    </div>
    <input class="edit hide" />
    `;
    return template;
  }

  static get observedAttributes() {
    return ["description", "completed"];
  }

  #state = {
    editing: false,
    newDescription: "",
  };

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      this.constructor.template.content.cloneNode(true)
    );

    // Handlers

    this.completedCheckbox.addEventListener("click", () => {
      if (this.completed) {
        this.dispatchEvent(
          new CustomEvent("todo-item-to-do", { bubbles: true })
        );
      } else {
        this.dispatchEvent(
          new CustomEvent("todo-item-completed", { bubbles: true })
        );
      }
    });

    this.descriptionLabel.addEventListener("dblclick", () => {
      this.#state.editing = true;
      this.#state.newDescription = this.description;
      this.update("state.editing", "state.newDescription");
    });

    this.deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent("todo-item-deleted", { bubbles: true })
      );
    });

    this.editDescriptionInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.#state.editing = false;
        this.update("state.editing");
      }
      this.#state.newDescription = this.editDescriptionInput.value;
    });

    this.editDescriptionInput.addEventListener("change", () => {
      this.dispatchEvent(
        new CustomEvent("todo-item-description-updated", {
          bubbles: true,
          detail: this.editDescriptionInput.value,
        })
      );
      this.#state.editing = false;
      this.update("state.editing");
    });

    this.update("completed", "description", "state.editing");
  }

  attributeChangedCallback(name) {
    this.update(name);
  }

  get description() {
    return this.getAttribute("description");
  }

  get completed() {
    return this.hasAttribute("completed");
  }

  get descriptionLabel() {
    return this.shadowRoot.querySelector(".description");
  }

  get completedCheckbox() {
    return this.shadowRoot.querySelector(".completed");
  }

  get deleteButton() {
    return this.shadowRoot.querySelector(".delete");
  }

  get viewSection() {
    return this.shadowRoot.querySelector(".view");
  }

  get editDescriptionInput() {
    return this.shadowRoot.querySelector(".edit");
  }

  update(...attrs) {
    if (!this.shadowRoot) return;

    if (attrs.includes("description")) {
      this.descriptionLabel.innerHTML = this.description;
    }

    if (attrs.includes("completed")) {
      if (this.completed) {
        this.completedCheckbox.setAttribute("checked", "checked");
      } else {
        this.completedCheckbox.removeAttribute("checked");
      }
    }

    if (attrs.includes("state.editing")) {
      if (this.#state.editing) {
        this.viewSection.classList.add("hide");
        this.editDescriptionInput.classList.remove("hide");
        this.editDescriptionInput.focus();
      } else {
        this.viewSection.classList.remove("hide");
        this.editDescriptionInput.classList.add("hide");
      }
    }

    if (attrs.includes("state.newDescription")) {
      this.editDescriptionInput.value = this.#state.newDescription;
    }
  }
}

if (!window.customElements.get("todo-item")) {
  window.customElements.define("todo-item", TodoItem);
}
