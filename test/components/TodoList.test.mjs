import "../../public/js/components/TodoList.mjs";
import chai, { expect } from "chai";
import { describe, it } from "mocha";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

describe("TodoList", () => {
  describe("New todo input", () => {
    it("should have a inout to enter a new todo", () => {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.newTodoInput.placeholder).to.equal(
        "Qu'est-ce qui doit être fait ?"
      );
    });

    it("should dispatch a 'todo-new-todo' event with the new todo description when the new todo input change", () => {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      const callback = sinon.fake();
      todoList.addEventListener("todo-new-todo", callback);
      todoList.newTodoInput.value = "Nouvelle chose à faire";
      todoList.newTodoInput.dispatchEvent(new Event("change"));
      expect(callback).to.have.been.called;
      expect(callback.firstCall.firstArg.detail).to.equal(
        "Nouvelle chose à faire"
      );
    });
  });

  describe("Number of items left", () => {
    it("should indicate the number of items left", () => {
      document.body.innerHTML = `<todo-list items-left="4"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.itemsLeftParagraph.innerHTML).to.equal(
        "4 tâches à faire"
      );
    });

    it("should default to 0 if the number of items left is absent", () => {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.itemsLeftParagraph.innerHTML).to.equal(
        "0 tâches à faire"
      );
    });

    it("should default to 0 if the number of items left is not a number", () => {
      document.body.innerHTML = `<todo-list items-left="toto"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.itemsLeftParagraph.innerHTML).to.equal(
        "0 tâches à faire"
      );
    });

    it("should take into account singular form for the number of items left", () => {
      document.body.innerHTML = `<todo-list items-left="1"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.itemsLeftParagraph.innerHTML).to.equal("1 tâche à faire");
    });

    it("should update when the number of items left is changed", () => {
      document.body.innerHTML = `<todo-list items-left="1"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      todoList.setAttribute("items-left", "5");
      expect(todoList.itemsLeftParagraph.innerHTML).to.equal(
        "5 tâches à faire"
      );
    });
  });

  describe("Filters", () => {
    it("should have filters for all, active and completed", () => {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(
        Array.from(todoList.filterLinks).map((node) => node.innerHTML)
      ).to.deep.equal(["Tous", "A faire", "Terminés"]);
    });

    it("should show the currrently selected filter", () => {
      document.body.innerHTML = `<todo-list filter="completed"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(
        todoList.filtersList
          .querySelector(".completed")
          .classList.contains("selected")
      ).to.be.true;
      expect(
        todoList.filtersList
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.false;
      expect(
        todoList.filtersList
          .querySelector(".active")
          .classList.contains("selected")
      ).to.be.false;
    });

    it("should default to the all filter", () => {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(
        todoList.filtersList
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should fall back to the all filter if the filter value is unknown", () => {
      document.body.innerHTML = `<todo-list filter="toto"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(
        todoList.filtersList
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should update when the filter value is changed", () => {
      document.body.innerHTML = `<todo-list filter="all"></todo-list>`;
      const todoList = document.querySelector("todo-list");
      todoList.setAttribute("filter", "active");
      expect(
        todoList.filtersList
          .querySelector(".all")
          .classList.contains("selected")
      ).to.be.false;
      expect(
        todoList.filtersList
          .querySelector(".active")
          .classList.contains("selected")
      ).to.be.true;
    });

    it("should dispatch a 'todo-filter-selected' event  with filter value when a filter is clicked", () => {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      const callback = sinon.fake();
      todoList.addEventListener("todo-filter-selected", callback);
      todoList.filtersList.querySelector(".active").click();
      expect(callback).to.have.been.called;
      expect(callback.firstCall.firstArg.detail).to.equal("active");
    });
  });

  describe("Clear completed", () => {
    it("should have a 'Clear completed' button", () => {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      expect(todoList.clearCompletedButton.innerHTML).to.equal(
        "Supprimer les tâches terminées"
      );
    });

    it("should dispatch a 'todo-clear-completed' event when the button is clicked", () => {
      document.body.innerHTML = `<todo-list></todo-list>`;
      const todoList = document.querySelector("todo-list");
      const callback = sinon.fake();
      todoList.addEventListener("todo-clear-completed", callback);
      todoList.clearCompletedButton.click();
      expect(callback).to.have.been.called;
    });
  });
});
