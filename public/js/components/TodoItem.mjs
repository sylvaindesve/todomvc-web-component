const style = `
:host {
  display: block;
}
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

const template = document.createElement("template");
template.innerHTML = `
<style>${style}</style>
<div class="view">
  <input class="completed" type="checkbox" />
  <label class="description"></label>
  <button class="delete">X</button>
</div>
<input class="edit hide" />
`;

/**
 * Un composant représentant une tâche à faire.
 *
 * @tagname todo-iem
 *
 * @attribute {string} description - Description de la tâche à faire
 * @attribute {boolean} completed - Indique si la tâche est faite
 *
 * @fires {CustomEvent} todo-item-to-do - Pour indiquer que la tâche est désormais à faire
 * @fires {CustomEvent} todo-item-completed - Pour indiquer que la tâche est désormais terminée
 * @fires {CustomEvent} todo-item-deleted - Pour indiquer que la tâche est supprimée
 * @fires {CustomEvent} todo-item-description-updated - Pour indiquer que la description de la tâche a été modifiée
 */
export class TodoItem extends HTMLElement {
  // Nodes
  #viewSection;
  #descriptionLabel;
  #completedCheckbox;
  #deleteButton;
  #editDescriptionInput;

  // Properties
  #description = "Tâche à faire";
  #completed = false;
  #editing = false;
  #editDescription = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#descriptionLabel = this.shadowRoot.querySelector(".description");
    this.#completedCheckbox = this.shadowRoot.querySelector(".completed");
    this.#deleteButton = this.shadowRoot.querySelector(".delete");
    this.#viewSection = this.shadowRoot.querySelector(".view");
    this.#editDescriptionInput = this.shadowRoot.querySelector(".edit");
  }

  connectedCallback() {
    this.#completedCheckbox.addEventListener("change", (event) => {
      const success = this.#dispatchCompletionOrUncompletion();
      if (!success) event.preventDefault();
    });
    this.#descriptionLabel.addEventListener("dblclick", () => {
      this.editDescription = this.description;
      this.editing = true;
    });
    this.#deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.#dispatchDeletion();
    });
    this.#editDescriptionInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.editing = false;
      }
      this.editDescription = this.#editDescriptionInput.value;
    });
    this.#editDescriptionInput.addEventListener("change", () => {
      this.editDescription = this.#editDescriptionInput.value;
      if (this.#dispatchDescriptionUpdate()) {
        this.editing = false;
      }
    });
  }

  set description(value) {
    this.#description = String(value);
    this.#descriptionLabel.innerHTML = this.#description;
  }

  get description() {
    return this.#description;
  }

  set completed(value) {
    this.#completed = Boolean(value);
    this.#completedCheckbox.checked = this.#completed;
  }

  get completed() {
    return this.#completed;
  }

  set editing(isEditing) {
    this.#editing = isEditing;
    if (isEditing) {
      this.#viewSection.classList.add("hide");
      this.#editDescriptionInput.classList.remove("hide");
      this.#editDescriptionInput.focus();
    } else {
      this.#viewSection.classList.remove("hide");
      this.#editDescriptionInput.classList.add("hide");
    }
  }

  get editing() {
    return this.#editing;
  }

  set editDescription(value) {
    this.#editDescription = value;
    this.#editDescriptionInput.value = value;
  }

  get editDescription() {
    return this.#editDescription;
  }

  #dispatchCompletionOrUncompletion() {
    if (this.completed) {
      return this.dispatchEvent(
        new CustomEvent("todo-item-to-do", { bubbles: true })
      );
    } else {
      return this.dispatchEvent(
        new CustomEvent("todo-item-completed", { bubbles: true })
      );
    }
  }

  #dispatchDeletion() {
    return this.dispatchEvent(
      new CustomEvent("todo-item-deleted", { bubbles: true })
    );
  }

  #dispatchDescriptionUpdate() {
    return this.dispatchEvent(
      new CustomEvent("todo-item-description-updated", {
        bubbles: true,
        detail: this.editDescription,
      })
    );
  }
}

if (!window.customElements.get("todo-item")) {
  window.customElements.define("todo-item", TodoItem);
}
