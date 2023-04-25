import chai, { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { fake } from "sinon";
import sinonChai from "sinon-chai";

import "../../public/js/components/TodoList.mjs";

chai.use(sinonChai);

describe("TodoList", function () {
  beforeEach(function () {
    document.body.innerHTML = `<todo-list remaining="4" filter="completed"></todo-list>`;
    this.todoList = document.querySelector("todo-list");
    this.eventListenerCallback = fake();
  });
  describe("New todo input", function () {
    it("should have a input to enter a new todo", function () {
      expect(getNewTodoInput(this.todoList).placeholder).to.equal(
        "Qu'est-ce qui doit être fait ?"
      );
    });

    it("should dispatch a 'todo-new-todo' event with the new todo description when the new todo input change", function () {
      this.todoList.addEventListener(
        "todo-new-todo",
        this.eventListenerCallback
      );
      getNewTodoInput(this.todoList).value = "Nouvelle chose à faire";
      getNewTodoInput(this.todoList).dispatchEvent(new Event("change"));
      expect(this.eventListenerCallback).to.have.been.called;
      expect(this.eventListenerCallback.firstCall.firstArg.detail).to.equal(
        "Nouvelle chose à faire"
      );
    });
  });

  describe("Number of items remaining", function () {
    it("should indicate the number of items remaining", function () {
      expect(getRemainingParagraph(this.todoList).innerHTML).to.equal(
        "4 tâches à faire"
      );
    });

    it("should default to 0 if the number of items remaining is absent", function () {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(getRemainingParagraph(todoList).innerHTML).to.equal(
        "0 tâches à faire"
      );
    });

    it("should default to 0 if the number of items remaining is not a number", function () {
      document.body.innerHTML = `<todo-list remaining="toto"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(getRemainingParagraph(todoList).innerHTML).to.equal(
        "0 tâches à faire"
      );
    });

    it("should take into account singular form for the number of items remaining", function () {
      document.body.innerHTML = `<todo-list remaining="1"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(getRemainingParagraph(todoList).innerHTML).to.equal(
        "1 tâche à faire"
      );
    });

    it("should update when the number of items remaining is changed", function () {
      this.todoList.setAttribute("remaining", "5");
      expect(getRemainingParagraph(this.todoList).innerHTML).to.equal(
        "5 tâches à faire"
      );
    });
  });

  describe("Filters", function () {
    it("should have filters for all, active and completed", function () {
      expect(
        Array.from(getFilterLinkks(this.todoList)).map((node) => node.innerHTML)
      ).to.deep.equal(["Tous", "A faire", "Terminés"]);
    });

    it("should show the currrently selected filter", function () {
      expect(
        getFiltersList(this.todoList)
          .querySelector(".completed")
          .classList.contains("selected")
      ).to.be.true;
      expect(
        getFiltersList(this.todoList)
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.false;
      expect(
        getFiltersList(this.todoList)
          .querySelector(".active")
          .classList.contains("selected")
      ).to.be.false;
    });

    it("should default to the all filter", function () {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(
        getFiltersList(todoList)
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should fall back to the all filter if the filter value is unknown", function () {
      document.body.innerHTML = `<todo-list filter="toto"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(
        getFiltersList(todoList)
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should update when the filter value is changed", function () {
      this.todoList.setAttribute("filter", "active");
      expect(
        getFiltersList(this.todoList)
          .querySelector(".completed")
          .classList.contains("selected")
      ).to.be.false;
      expect(
        getFiltersList(this.todoList)
          .querySelector(".active")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should dispatch a 'todo-filter-selected' event  with filter value when a filter is clicked", function () {
      this.todoList.addEventListener(
        "todo-filter-selected",
        this.eventListenerCallback
      );
      getFiltersList(this.todoList).querySelector(".active").click();
      expect(this.eventListenerCallback).to.have.been.called;
      expect(this.eventListenerCallback.firstCall.firstArg.detail).to.equal(
        "active"
      );
    });
  });

  describe("Clear completed", function () {
    it("should have a 'Clear completed' button", function () {
      expect(getClearCompletedButton(this.todoList).innerHTML).to.equal(
        "Supprimer les tâches terminées"
      );
    });

    it("should dispatch a 'todo-clear-completed' event when the button is clicked", function () {
      this.todoList.addEventListener(
        "todo-clear-completed",
        this.eventListenerCallback
      );
      getClearCompletedButton(this.todoList).click();
      expect(this.eventListenerCallback).to.have.been.called;
    });
  });
});

function getNewTodoInput(todoList) {
  return todoList.shadowRoot.querySelector(".new-todo");
}

function getRemainingParagraph(todoList) {
  return todoList.shadowRoot.querySelector(".remaining");
}

function getFiltersList(todoList) {
  return todoList.shadowRoot.querySelector(".filters");
}

function getFilterLinkks(todoList) {
  return todoList.shadowRoot.querySelectorAll(".filters a");
}

function getClearCompletedButton(todoList) {
  return todoList.shadowRoot.querySelector(".clear-completed");
}
