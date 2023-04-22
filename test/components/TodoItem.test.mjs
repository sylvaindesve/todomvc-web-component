import chai, { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { fake } from "sinon";
import sinonChai from "sinon-chai";

import "../../public/js/components/TodoItem.mjs";

chai.use(sinonChai);

describe("TodoItem", function () {
  beforeEach(function () {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    this.currentTest.todoItem = document.querySelector("todo-item");
    this.currentTest.eventListenerCallback = fake();
  });
  it("should be in view mode", function () {
    expect(this.test.todoItem.viewSection.classList.contains("hide")).to.be
      .false;
    expect(this.test.todoItem.editDescriptionInput.classList.contains("hide"))
      .to.be.true;
  });

  it("should render the description", function () {
    expect(this.test.todoItem.descriptionLabel.innerHTML).to.equal(
      "Quelque chose"
    );
  });

  it("should update when description is changed", function () {
    this.test.todoItem.setAttribute("description", "Autre chose");
    expect(this.test.todoItem.descriptionLabel.innerHTML).to.equal(
      "Autre chose"
    );
  });

  it("should not be checked if not completed", function () {
    expect(this.test.todoItem.completedCheckbox.checked).to.be.false;
    expect(this.test.todoItem.completedCheckbox.hasAttribute("checked")).to.be
      .false;
  });

  it("should be checked if completed", function () {
    document.body.innerHTML = `<todo-item description="Quelque chose" completed></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    expect(todoItem.completedCheckbox.checked).to.be.true;
    expect(todoItem.completedCheckbox.hasAttribute("checked")).to.be.true;
  });

  it("should update when completed attribute is changed", function () {
    this.test.todoItem.setAttribute("completed", "completed");
    expect(this.test.todoItem.completedCheckbox.checked).to.be.true;
    this.test.todoItem.removeAttribute("completed");
    expect(this.test.todoItem.completedCheckbox.checked).to.be.false;
  });

  it("should dispatch a 'todo-item-completed' event when the checkbox is checked", function () {
    this.test.todoItem.addEventListener(
      "todo-item-completed",
      this.test.eventListenerCallback
    );
    this.test.todoItem.completedCheckbox.click();
    expect(this.test.eventListenerCallback).to.have.been.called;
  });

  it("should dispatch a 'todo-item-to-do' event when the checkbox is unchecked", function () {
    document.body.innerHTML = `<todo-item description="Quelque chose" completed></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    todoItem.addEventListener(
      "todo-item-to-do",
      this.test.eventListenerCallback
    );
    todoItem.completedCheckbox.click();
    expect(this.test.eventListenerCallback).to.have.been.called;
  });

  it("should dispatch a 'todo-item-deleted' event when the delete button is clicked", function () {
    this.test.todoItem.addEventListener(
      "todo-item-deleted",
      this.test.eventListenerCallback
    );
    this.test.todoItem.deleteButton.click();
    expect(this.test.eventListenerCallback).to.have.been.called;
  });

  it("should switch to edit mode when the description is double-clicked", function () {
    dblClick(this.test.todoItem.descriptionLabel);
    expect(this.test.todoItem.viewSection.classList.contains("hide")).to.be
      .true;
    expect(this.test.todoItem.editDescriptionInput.classList.contains("hide"))
      .to.be.false;
  });

  it("should have the edit input initialized with current description", function () {
    dblClick(this.test.todoItem.descriptionLabel);
    expect(this.test.todoItem.editDescriptionInput.value).to.equal(
      "Quelque chose"
    );
  });

  it("should switch back to view mode when user enters Escape in the input", function () {
    dblClick(this.test.todoItem.descriptionLabel);
    enterKey(this.test.todoItem.editDescriptionInput, "Escape");
    expect(this.test.todoItem.viewSection.classList.contains("hide")).to.be
      .false;
    expect(this.test.todoItem.editDescriptionInput.classList.contains("hide"))
      .to.be.true;
  });

  it("should dispatch a 'todo-item-description-updated' event with new description and switch back to view mode", function () {
    this.test.todoItem.addEventListener(
      "todo-item-description-updated",
      this.test.eventListenerCallback
    );
    dblClick(this.test.todoItem.descriptionLabel);
    this.test.todoItem.editDescriptionInput.value = "Nouvelle description";
    this.test.todoItem.editDescriptionInput.dispatchEvent(new Event("change"));
    expect(this.test.eventListenerCallback).to.have.been.called;
    expect(this.test.eventListenerCallback.firstCall.firstArg.detail).to.equal(
      "Nouvelle description"
    );
    expect(this.test.todoItem.viewSection.classList.contains("hide")).to.be
      .false;
    expect(this.test.todoItem.editDescriptionInput.classList.contains("hide"))
      .to.be.true;
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
