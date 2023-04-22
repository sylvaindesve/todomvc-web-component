import "../../public/js/components/TodoItem.mjs";
import chai, { expect } from "chai";
import { describe, it } from "mocha";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

describe("TodoItem", () => {
  it("should be in view mode", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    expect(todoItem.viewSection.classList.contains("hide")).to.be.false;
    expect(todoItem.editDescriptionInput.classList.contains("hide")).to.be.true;
  });

  it("should render the description", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    expect(todoItem.descriptionLabel.innerHTML).to.equal("Quelque chose");
  });

  it("should update when description is changed", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    todoItem.setAttribute("description", "Autre chose");
    expect(todoItem.descriptionLabel.innerHTML).to.equal("Autre chose");
  });

  it("should not be checked if not completed", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    expect(todoItem.completedCheckbox.checked).to.be.false;
  });

  it("should not checked if completed", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose" completed></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    expect(todoItem.completedCheckbox.checked).to.be.true;
  });

  it("should update when completed attribute is changed", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose" completed></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    todoItem.removeAttribute("completed");
    expect(todoItem.completedCheckbox.checked).to.be.false;
    todoItem.setAttribute("completed", "completed");
    expect(todoItem.completedCheckbox.checked).to.be.true;
  });

  it("should dispatch a 'todo-item-completed' event when the checkbox is checked", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    const callback = sinon.fake();
    todoItem.addEventListener("todo-item-completed", callback);
    todoItem.completedCheckbox.click();
    expect(callback).to.have.been.called;
  });

  it("should dispatch a 'todo-item-to-do' event when the checkbox is unchecked", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose" completed></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    const callback = sinon.fake();
    todoItem.addEventListener("todo-item-to-do", callback);
    todoItem.completedCheckbox.click();
    expect(callback).to.have.been.called;
  });

  it("should dispatch a 'todo-item-deleted' event when the delete button is clicked", () => {
    document.body.innerHTML = `<todo-item description="Titre de test"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    const callback = sinon.fake();
    todoItem.addEventListener("todo-item-deleted", callback);
    todoItem.deleteButton.click();
    expect(callback).to.have.been.called;
  });

  it("should switch to edit mode when the description is double-clicked", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    dblClick(todoItem.descriptionLabel);
    expect(todoItem.viewSection.classList.contains("hide")).to.be.true;
    expect(todoItem.editDescriptionInput.classList.contains("hide")).to.be
      .false;
  });

  it("should have the edit input initialized with current description", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    dblClick(todoItem.descriptionLabel);
    expect(todoItem.editDescriptionInput.value).to.equal("Quelque chose");
  });

  it("should switch back to view mode when user enters Escape in the input", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    dblClick(todoItem.descriptionLabel);
    enterKey(todoItem.editDescriptionInput, "Escape");
    expect(todoItem.viewSection.classList.contains("hide")).to.be.false;
    expect(todoItem.editDescriptionInput.classList.contains("hide")).to.be.true;
  });

  it("should dispatch a 'todo-item-description-updated' event with new description and switch back to view mode", () => {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    const callback = sinon.fake();
    todoItem.addEventListener("todo-item-description-updated", callback);
    dblClick(todoItem.descriptionLabel);
    todoItem.editDescriptionInput.value = "Nouvelle description";
    todoItem.editDescriptionInput.dispatchEvent(new Event("change"));
    expect(callback).to.have.been.called;
    expect(callback.firstCall.firstArg.detail).to.equal("Nouvelle description");
    expect(todoItem.viewSection.classList.contains("hide")).to.be.false;
    expect(todoItem.editDescriptionInput.classList.contains("hide")).to.be.true;
  });
});

function dblClick(node) {
  node.dispatchEvent(
    new MouseEvent("dblclick", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  );
}

function enterKey(node, key) {
  node.dispatchEvent(new KeyboardEvent("keydown", { key }));
}
