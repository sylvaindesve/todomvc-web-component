import { expect } from "chai";
import { describe, it } from "mocha";

import {
  addItem,
  completeItem,
  removeCompleted,
  removeItem,
  setFilter,
  setState,
  uncompleteItem,
  updateItemDescription,
} from "../../public/js/model/actions.mjs";
import reducer, {
  countRemainingItems,
  selectItems,
  selectVisibleItems,
} from "../../public/js/model/reducer.mjs";

function getThreeItemsState() {
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
}

describe("reducer", function () {
  it("should initialize to empty items and 'all' filter", function () {
    const initialState = reducer(undefined, { type: "@@INIT" });
    expect(initialState).to.deep.equal({ items: {}, filter: "all" });
  });

  describe("adding an item", function () {
    it("should add the provided item", function () {
      const newItem = {
        id: "item-4",
        description: "Item 4",
        completed: false,
      };
      const newState = reducer(getThreeItemsState(), addItem(newItem));
      expect(newState).to.deep.equal({
        items: {
          ...getThreeItemsState().items,
          "item-4": {
            id: "item-4",
            description: "Item 4",
            completed: false,
          },
        },
        filter: "all",
      });
    });

    it("should not change the initial state", function () {
      const initialState = getThreeItemsState();
      const newItem = {
        id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
        description: "Acheter du beurre de cacahuète",
        completed: false,
      };
      reducer(initialState, addItem(newItem));
      expect(initialState).to.deep.equal(getThreeItemsState());
    });
  });

  describe("updating an item description", function () {
    it("should update the item description", function () {
      const newState = reducer(
        getThreeItemsState(),
        updateItemDescription("item-2", "Item 2 updated")
      );
      expect(newState).to.deep.equal({
        items: {
          ...getThreeItemsState().items,
          "item-2": {
            id: "item-2",
            description: "Item 2 updated",
            completed: true,
          },
        },
        filter: "all",
      });
    });

    it("should do nothing if provided ID does not point to any item", function () {
      const newState = reducer(
        getThreeItemsState(),
        updateItemDescription("unknown-id", "Unknown item")
      );
      expect(newState).to.deep.equal(getThreeItemsState());
    });

    it("should not change the initial state", function () {
      const initialState = getThreeItemsState();
      reducer(initialState, updateItemDescription("item-2", "Item 2 updated"));
      expect(initialState).to.deep.equal(getThreeItemsState());
    });
  });

  describe("complete an item", function () {
    it("should change the item state to completed", function () {
      const newState = reducer(getThreeItemsState(), completeItem("item-1"));
      expect(newState).to.deep.equal({
        items: {
          ...getThreeItemsState().items,
          "item-1": {
            id: "item-1",
            description: "Item 1",
            completed: true,
          },
        },
        filter: "all",
      });
    });

    it("should do nothing if provided ID does not point to any item", function () {
      const newState = reducer(
        getThreeItemsState(),
        completeItem("unknown-id")
      );
      expect(newState).to.deep.equal(getThreeItemsState());
    });

    it("should not change the initial state", function () {
      const initialState = getThreeItemsState();
      reducer(initialState, completeItem("item-1"));
      expect(initialState).to.deep.equal(getThreeItemsState());
    });
  });

  describe("uncomplete an item", function () {
    it("should change the item state to not completed", function () {
      const newState = reducer(getThreeItemsState(), uncompleteItem("item-2"));
      expect(newState).to.deep.equal({
        items: {
          ...getThreeItemsState().items,
          "item-2": {
            id: "item-2",
            description: "Item 2",
            completed: false,
          },
        },
        filter: "all",
      });
    });

    it("should do nothing if provided ID does not point to any item", function () {
      const newState = reducer(
        getThreeItemsState(),
        uncompleteItem("unknown-id")
      );
      expect(newState).to.deep.equal(getThreeItemsState());
    });

    it("should not change the initial state", function () {
      const initialState = getThreeItemsState();
      reducer(initialState, uncompleteItem("item-2"));
      expect(initialState).to.deep.equal(getThreeItemsState());
    });
  });

  describe("removing an item", function () {
    it("should remove the item with the provided ID", function () {
      const newState = reducer(getThreeItemsState(), removeItem("item-1"));
      expect(newState).to.deep.equal({
        items: {
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
      });
    });

    it("should do nothing if there is no item with the provided ID", function () {
      const initialState = getThreeItemsState();
      const newState = reducer(initialState, removeItem("unknown-id"));
      expect(newState).to.deep.equal(getThreeItemsState());
    });

    it("should not change the initial state", function () {
      const initialState = getThreeItemsState();
      reducer(initialState, removeItem("item-1"));
      expect(initialState).to.deep.equal(getThreeItemsState());
    });
  });

  describe("removing completed items", function () {
    it("should remove completed items", function () {
      const newState = reducer(getThreeItemsState(), removeCompleted());
      expect(newState).to.deep.equal({
        items: {
          "item-1": {
            id: "item-1",
            description: "Item 1",
            completed: false,
          },
          "item-3": {
            id: "item-3",
            description: "Item 3",
            completed: false,
          },
        },
        filter: "all",
      });
    });
    it("should not change the initial state", function () {
      const initialState = getThreeItemsState();
      reducer(initialState, removeCompleted());
      expect(initialState).to.deep.equal(getThreeItemsState());
    });
  });

  describe("setting state", function () {
    it("should replace with provided state", function () {
      const initialState = getThreeItemsState();
      const futureState = {
        items: {
          "item-4": {
            id: "item-4",
            description: "Item 4",
            completed: true,
          },
          "item-5": {
            id: "item-5",
            description: "Item 5",
            completed: false,
          },
        },
        filter: "active",
      };
      const newState = reducer(initialState, setState(futureState));
      expect(newState).to.deep.equal({
        items: {
          "item-4": {
            id: "item-4",
            description: "Item 4",
            completed: true,
          },
          "item-5": {
            id: "item-5",
            description: "Item 5",
            completed: false,
          },
        },
        filter: "active",
      });
    });

    it("should not change the initial state", function () {
      const initialState = getThreeItemsState();
      const futureState = {
        items: {
          "item-4": {
            id: "item-4",
            description: "Item 4",
            completed: true,
          },
          "item-5": {
            id: "item-5",
            description: "Item 5",
            completed: false,
          },
        },
        filter: "active",
      };
      reducer(initialState, setState(futureState));
      expect(initialState).to.deep.equal(getThreeItemsState());
    });
  });

  describe("Set filter", function () {
    it("should set the filter value", function () {
      const newState = reducer(getThreeItemsState(), setFilter("active"));
      expect(newState).to.deep.equal({
        items: getThreeItemsState().items,
        filter: "active",
      });
    });

    it("should not change the initial state", function () {
      const initialState = getThreeItemsState();
      reducer(initialState, setFilter("active"));
      expect(initialState).to.deep.equal(getThreeItemsState());
    });
  });
});

describe("selectItems", function () {
  it("should return items as array from a state", function () {
    const items = selectItems(getThreeItemsState());
    expect(items).to.deep.equal([
      {
        id: "item-1",
        description: "Item 1",
        completed: false,
      },
      {
        id: "item-2",
        description: "Item 2",
        completed: true,
      },
      {
        id: "item-3",
        description: "Item 3",
        completed: false,
      },
    ]);
  });
});

describe("countRemainingItems", function () {
  it("should return the number of remainign items", function () {
    const remaining = countRemainingItems(getThreeItemsState());
    expect(remaining).to.equal(2);
  });
});

describe("selectVisibleItems", function () {
  it("should return all items if filter is 'all'", function () {
    expect(selectVisibleItems(getThreeItemsState())).to.deep.equal([
      {
        id: "item-1",
        description: "Item 1",
        completed: false,
      },
      {
        id: "item-2",
        description: "Item 2",
        completed: true,
      },
      {
        id: "item-3",
        description: "Item 3",
        completed: false,
      },
    ]);
  });

  it("should return non completed items if filter is 'active'", function () {
    expect(
      selectVisibleItems({ ...getThreeItemsState(), filter: "active" })
    ).to.deep.equal([
      {
        id: "item-1",
        description: "Item 1",
        completed: false,
      },
      {
        id: "item-3",
        description: "Item 3",
        completed: false,
      },
    ]);
  });

  it("should return completed items if filter is 'completed'", function () {
    expect(
      selectVisibleItems({ ...getThreeItemsState(), filter: "completed" })
    ).to.deep.equal([
      {
        id: "item-2",
        description: "Item 2",
        completed: true,
      },
    ]);
  });
});
