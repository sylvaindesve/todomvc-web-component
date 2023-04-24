import chai, { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { fake } from "sinon";
import sinonChai from "sinon-chai";

import "../../public/js/components/TodoItem.mjs";

chai.use(sinonChai);

describe("TodoItem", function () {
  beforeEach(function () {
    document.body.innerHTML = `<todo-item description="Quelque chose"></todo-item>`;
    this.todoItem = document.querySelector("todo-item");
    this.eventListenerCallback = fake();
  });
  it("should be in view mode", function () {
    expect(this.todoItem.editing).to.be.false;
    expect(getViewSection(this.todoItem).classList.contains("hide")).to.be
      .false;
    expect(getEditDescriptionInput(this.todoItem).classList.contains("hide")).to
      .be.true;
  });

  it("should render the description", function () {
    expect(getDescriptionLabel(this.todoItem).innerHTML).to.equal(
      "Quelque chose"
    );
  });

  it("should update when description is changed", function () {
    this.todoItem.description = "Autre chose";
    expect(getDescriptionLabel(this.todoItem).innerHTML).to.equal(
      "Autre chose"
    );
  });

  it("should not be checked if not completed", function () {
    expect(getCompletedCheckbox(this.todoItem).checked).to.be.false;
  });

  it("should be checked if completed", function () {
    document.body.innerHTML = `<todo-item description="Quelque chose" completed></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    expect(getCompletedCheckbox(todoItem).checked).to.be.true;
  });

  it("should update when completed attribute is changed", function () {
    this.todoItem.completed = true;
    expect(getCompletedCheckbox(this.todoItem).checked).to.be.true;
    this.todoItem.completed = false;
    expect(getCompletedCheckbox(this.todoItem).checked).to.be.false;
  });

  it("should dispatch a 'todo-item-completed' event when the checkbox is checked", function () {
    this.todoItem.addEventListener(
      "todo-item-completed",
      this.eventListenerCallback
    );
    getCompletedCheckbox(this.todoItem).click();
    expect(this.eventListenerCallback).to.have.been.called;
  });

  it("should dispatch a 'todo-item-to-do' event when the checkbox is unchecked", function () {
    document.body.innerHTML = `<todo-item description="Quelque chose" completed></todo-item>`;
    const todoItem = document.querySelector("todo-item");
    todoItem.addEventListener("todo-item-to-do", this.eventListenerCallback);
    getCompletedCheckbox(todoItem).click();
    expect(this.eventListenerCallback).to.have.been.called;
  });

  it("should dispatch a 'todo-item-deleted' event when the delete button is clicked", function () {
    this.todoItem.addEventListener(
      "todo-item-deleted",
      this.eventListenerCallback
    );
    getDeleteButton(this.todoItem).click();
    expect(this.eventListenerCallback).to.have.been.called;
  });

  it("should switch to edit mode when the description is double-clicked", function () {
    dblClick(getDescriptionLabel(this.todoItem));
    expect(this.todoItem.editing).to.be.true;
    expect(getViewSection(this.todoItem).classList.contains("hide")).to.be.true;
    expect(getEditDescriptionInput(this.todoItem).classList.contains("hide")).to
      .be.false;
  });

  it("should have the edit input initialized with current description", function () {
    dblClick(getDescriptionLabel(this.todoItem));
    expect(getEditDescriptionInput(this.todoItem).value).to.equal(
      "Quelque chose"
    );
  });

  it("should switch back to view mode when user enters Escape in the input", function () {
    dblClick(getDescriptionLabel(this.todoItem));
    enterKey(getEditDescriptionInput(this.todoItem), "Escape");
    expect(this.todoItem.editing).to.be.false;
    expect(getViewSection(this.todoItem).classList.contains("hide")).to.be
      .false;
    expect(getEditDescriptionInput(this.todoItem).classList.contains("hide")).to
      .be.true;
  });

  it("should dispatch a 'todo-item-description-updated' event with new description and switch back to view mode", function () {
    this.todoItem.addEventListener(
      "todo-item-description-updated",
      this.eventListenerCallback
    );
    dblClick(getDescriptionLabel(this.todoItem));
    getEditDescriptionInput(this.todoItem).value = "Nouvelle description";
    getEditDescriptionInput(this.todoItem).dispatchEvent(new Event("change"));
    expect(this.eventListenerCallback).to.have.been.called;
    expect(this.eventListenerCallback.firstCall.firstArg.detail).to.equal(
      "Nouvelle description"
    );
    expect(this.todoItem.editing).to.be.false;
    expect(getViewSection(this.todoItem).classList.contains("hide")).to.be
      .false;
    expect(getEditDescriptionInput(this.todoItem).classList.contains("hide")).to
      .be.true;
  });
});

function getViewSection(todoItem) {
  return todoItem.shadowRoot.querySelector(".view");
}

function getEditDescriptionInput(todoItem) {
  return todoItem.shadowRoot.querySelector(".edit");
}

function getDescriptionLabel(todoItem) {
  return todoItem.shadowRoot.querySelector(".description");
}

function getCompletedCheckbox(todoItem) {
  return todoItem.shadowRoot.querySelector(".completed");
}

function getDeleteButton(todoItem) {
  return todoItem.shadowRoot.querySelector(".delete");
}

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
