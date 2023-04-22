import "../../public/js/components/TodoList.mjs";
import { beforeEach, describe, it } from "mocha";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

describe("TodoList", function () {
  beforeEach(function () {
    document.body.innerHTML = `<todo-list items-left="4" filter="completed"></todo-list>`;
    this.currentTest.todoList = document.querySelector("todo-list");
    this.currentTest.eventListenerCallback = sinon.fake();
  });
  describe("New todo input", function () {
    it("should have a input to enter a new todo", function () {
      expect(this.test.todoList.newTodoInput.placeholder).to.equal(
        "Qu'est-ce qui doit être fait ?"
      );
    });

    it("should dispatch a 'todo-new-todo' event with the new todo description when the new todo input change", function () {
      this.test.todoList.addEventListener(
        "todo-new-todo",
        this.test.eventListenerCallback
      );
      this.test.todoList.newTodoInput.value = "Nouvelle chose à faire";
      this.test.todoList.newTodoInput.dispatchEvent(new Event("change"));
      expect(this.test.eventListenerCallback).to.have.been.called;
      expect(
        this.test.eventListenerCallback.firstCall.firstArg.detail
      ).to.equal("Nouvelle chose à faire");
    });
  });

  describe("Number of items left", function () {
    it("should indicate the number of items left", function () {
      expect(this.test.todoList.itemsLeftParagraph.innerHTML).to.equal(
        "4 tâches à faire"
      );
    });

    it("should default to 0 if the number of items left is absent", function () {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.itemsLeftParagraph.innerHTML).to.equal(
        "0 tâches à faire"
      );
    });

    it("should default to 0 if the number of items left is not a number", function () {
      document.body.innerHTML = `<todo-list items-left="toto"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.itemsLeftParagraph.innerHTML).to.equal(
        "0 tâches à faire"
      );
    });

    it("should take into account singular form for the number of items left", function () {
      document.body.innerHTML = `<todo-list items-left="1"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.itemsLeftParagraph.innerHTML).to.equal("1 tâche à faire");
    });

    it("should update when the number of items left is changed", function () {
      this.test.todoList.setAttribute("items-left", "5");
      expect(this.test.todoList.itemsLeftParagraph.innerHTML).to.equal(
        "5 tâches à faire"
      );
    });
  });

  describe("Filters", function () {
    it("should have filters for all, active and completed", function () {
      expect(
        Array.from(this.test.todoList.filterLinks).map((node) => node.innerHTML)
      ).to.deep.equal(["Tous", "A faire", "Terminés"]);
    });

    it("should show the currrently selected filter", function () {
      expect(
        this.test.todoList.filtersList
          .querySelector(".completed")
          .classList.contains("selected")
      ).to.be.true;
      expect(
        this.test.todoList.filtersList
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.false;
      expect(
        this.test.todoList.filtersList
          .querySelector(".active")
          .classList.contains("selected")
      ).to.be.false;
    });

    it("should default to the all filter", function () {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(
        todoList.filtersList
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should fall back to the all filter if the filter value is unknown", function () {
      document.body.innerHTML = `<todo-list filter="toto"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(
        todoList.filtersList
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should update when the filter value is changed", function () {
      this.test.todoList.setAttribute("filter", "active");
      expect(
        this.test.todoList.filtersList
          .querySelector(".completed")
          .classList.contains("selected")
      ).to.be.false;
      expect(
        this.test.todoList.filtersList
          .querySelector(".active")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should dispatch a 'todo-filter-selected' event  with filter value when a filter is clicked", function () {
      this.test.todoList.addEventListener(
        "todo-filter-selected",
        this.test.eventListenerCallback
      );
      this.test.todoList.filtersList.querySelector(".active").click();
      expect(this.test.eventListenerCallback).to.have.been.called;
      expect(
        this.test.eventListenerCallback.firstCall.firstArg.detail
      ).to.equal("active");
    });
  });

  describe("Clear completed", function () {
    it("should have a 'Clear completed' button", function () {
      expect(this.test.todoList.clearCompletedButton.innerHTML).to.equal(
        "Supprimer les tâches terminées"
      );
    });

    it("should dispatch a 'todo-clear-completed' event when the button is clicked", function () {
      this.test.todoList.addEventListener(
        "todo-clear-completed",
        this.test.eventListenerCallback
      );
      this.test.todoList.clearCompletedButton.click();
      expect(this.test.eventListenerCallback).to.have.been.called;
    });
  });
});
