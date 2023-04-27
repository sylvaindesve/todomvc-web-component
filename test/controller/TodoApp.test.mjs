import chai, { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { fake } from "sinon";
import sinonChai from "sinon-chai";

import { TodoApp } from "../../public/js/controller/TodoApp.mjs";

chai.use(sinonChai);

describe("TodoApp", () => {
  beforeEach(function () {
    this.currentTest.fakeModel = {
      dispatch: fake(),
      getState: function () {
        return {
          items: {
            "item-1": {
              id: "item-1",
              description: "Item 1",
              completed: false,
            },
            "item-2": {
              id: "item-2",
              description: "Item 2",
              completed: true,
            },
            "item-3": {
              id: "item-3",
              description: "Item 3",
              completed: false,
            },
          },
          filter: "all",
        };
      },
      subscribe: fake(),
    };
    this.currentTest.fakeView = document.createElement("ul");
    new TodoApp(this.currentTest.fakeModel, this.currentTest.fakeView, "li");
  });

  describe("Manage the model", function () {
    it("should subscribe to the model", function () {
      expect(this.test.fakeModel.subscribe).to.have.been.called;
    });

    it("should dispatch to the model when the view send an item creation event", function () {
      this.test.fakeView.dispatchEvent(
        new CustomEvent("todo-new-todo", { detail: "Item description" })
      );
      expect(this.test.fakeModel.dispatch).to.have.been.called;
      const action = this.test.fakeModel.dispatch.firstCall.firstArg;
      expect(action.type).to.equal("ADD_ITEM");
      expect(action.payload.description).to.equal("Item description");
      expect(action.payload.completed).to.be.false;
    });

    it("should dispatch to the model when the view send a item completed event", function () {
      this.test.fakeView.children[0].dispatchEvent(
        new CustomEvent("todo-item-completed", { bubbles: true })
      );
      expect(this.test.fakeModel.dispatch).to.have.been.called;
      const action = this.test.fakeModel.dispatch.firstCall.firstArg;
      expect(action.type).to.equal("COMPLETE_ITEM");
      expect(action.payload).to.equal("item-1");
    });

    it("should dispatch to the model when the view send a item uncompleted event", function () {
      this.test.fakeView.children[1].dispatchEvent(
        new CustomEvent("todo-item-to-do", { bubbles: true })
      );
      expect(this.test.fakeModel.dispatch).to.have.been.called;
      const action = this.test.fakeModel.dispatch.firstCall.firstArg;
      expect(action.type).to.equal("UNCOMPLETE_ITEM");
      expect(action.payload).to.equal("item-2");
    });

    it("should dispatch to the model when the view send a item deleted event", function () {
      this.test.fakeView.children[2].dispatchEvent(
        new CustomEvent("todo-item-deleted", { bubbles: true })
      );
      expect(this.test.fakeModel.dispatch).to.have.been.called;
      const action = this.test.fakeModel.dispatch.firstCall.firstArg;
      expect(action.type).to.equal("REMOVE_ITEM");
      expect(action.payload).to.equal("item-3");
    });

    it("should dispatch to the model when the view send a item updated event", function () {
      this.test.fakeView.children[0].dispatchEvent(
        new CustomEvent("todo-item-description-updated", {
          detail: "Item 1 updated",
          bubbles: true,
        })
      );
      expect(this.test.fakeModel.dispatch).to.have.been.called;
      const action = this.test.fakeModel.dispatch.firstCall.firstArg;
      expect(action.type).to.equal("UPDATE_ITEM_DESCRIPTION");
      expect(action.payload.itemId).to.equal("item-1");
      expect(action.payload.description).to.equal("Item 1 updated");
    });

    it("should dispatch to the model when the view send a filter selected event", function () {
      this.test.fakeView.dispatchEvent(
        new CustomEvent("todo-filter-selected", {
          detail: "active",
        })
      );
      expect(this.test.fakeModel.dispatch).to.have.been.called;
      const action = this.test.fakeModel.dispatch.firstCall.firstArg;
      expect(action.type).to.equal("SET_FILTER");
      expect(action.payload).to.equal("active");
    });

    it("should dispatch to the model when the view send a clear completed items event", function () {
      this.test.fakeView.dispatchEvent(new CustomEvent("todo-clear-completed"));
      expect(this.test.fakeModel.dispatch).to.have.been.called;
      const action = this.test.fakeModel.dispatch.firstCall.firstArg;
      expect(action.type).to.equal("REMOVE_COMPLETED");
    });
  });

  describe("Manage the view", function () {
    it("should set the items left attribute of the view", function () {
      expect(this.test.fakeView.getAttribute("remaining")).to.equal("2");
    });

    it("should set the filter attribute of the view", function () {
      expect(this.test.fakeView.getAttribute("filter")).to.equal("all");
    });

    it("should append children to the view for each item in the model", function () {
      expect(this.test.fakeView.children.length).to.equal(3);
    });

    it("should append children to the view based on the filter value", function () {
      const fakeModel = {
        dispatch: fake(),
        getState: function () {
          return {
            items: {
              "item-1": {
                id: "item-1",
                description: "Item 1",
                completed: false,
              },
              "item-2": {
                id: "item-2",
                description: "Item 2",
                completed: true,
              },
              "item-3": {
                id: "item-3",
                description: "Item 3",
                completed: false,
              },
            },
            filter: "active",
          };
        },
        subscribe: fake(),
      };
      const fakeView = document.createElement("ul");
      new TodoApp(fakeModel, fakeView, "li");
      expect(fakeView.children.length).to.equal(2);
    });

    it("should set the description for each item", function () {
      expect(
        Array.from(this.test.fakeView.children).map(
          (child) => child.description
        )
      ).to.deep.equal(["Item 1", "Item 2", "Item 3"]);
    });

    it("should set the completed state for each item", function () {
      expect(
        Array.from(this.test.fakeView.children).map((child) => child.completed)
      ).to.deep.equal([false, true, false]);
    });

    it("should set the id for each item", function () {
      expect(
        Array.from(this.test.fakeView.children).map((child) => child.dataset.id)
      ).to.deep.equal(["item-1", "item-2", "item-3"]);
    });

    it("should update the view when the model change", function () {
      const fakeModel = {
        listener: null,
        subscribe: function (listener) {
          this.listener = listener;
        },
        fire() {
          this.listener();
        },
        getState: function () {
          return {
            items: {
              "item-1": {
                id: "item-1",
                description: "Item 1",
                completed: false,
              },
              "item-2": {
                id: "item-2",
                description: "Item 2",
                completed: true,
              },
              "item-3": {
                id: "item-3",
                description: "Item 3",
                completed: false,
              },
            },
            filter: "all",
          };
        },
      };
      const fakeView = document.createElement("ul");
      new TodoApp(fakeModel, fakeView, "li");

      fakeModel.getState = function () {
        return {
          items: {
            "item-1": {
              id: "item-1",
              description: "Item 1",
              completed: true,
            },
            "item-3": {
              id: "item-3",
              description: "Item 3 updated",
              completed: false,
            },
            "item-4": {
              id: "item-4",
              description: "Item 4",
              completed: false,
            },
          },
          filter: "active",
        };
      };

      fakeModel.fire();

      expect(
        Array.from(fakeView.children).map((child) => ({
          id: child.dataset.id,
          description: child.description,
          completed: child.completed,
        }))
      ).to.deep.equal([
        { id: "item-3", description: "Item 3 updated", completed: false },
        { id: "item-4", description: "Item 4", completed: false },
      ]);
      expect(fakeView.getAttribute("filter")).to.equal("active");
    });
  });
});
