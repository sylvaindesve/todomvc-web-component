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
import { describe, it } from "mocha";
import reducer, { selectItems } from "../../public/js/model/reducer.mjs";
import { expect } from "chai";

describe("reducer", () => {
  it("should initialize to empty items and 'all' filter", () => {
    const initialState = reducer(undefined, { type: "@@INIT" });
    expect(initialState).to.deep.equal({ items: {}, filter: "all" });
  });

  describe("adding an item", () => {
    it("should add the provided item", () => {
      const initialState = { items: {}, filter: "all" };
      const newItem = {
        id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
        description: "Acheter du beurre de cacahuète",
        completed: false,
      };
      const newState = reducer(initialState, addItem(newItem));
      expect(newState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: false,
          },
        },
        filter: "all",
      });
    });

    it("should not change the initial state", () => {
      const initialState = { items: {}, filter: "all" };
      const newItem = {
        id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
        description: "Acheter du beurre de cacahuète",
        completed: false,
      };
      reducer(initialState, addItem(newItem));
      expect(initialState).to.deep.equal({ items: {}, filter: "all" });
    });
  });

  describe("updating an item description", () => {
    it("should update the item description", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: false,
          },
        },
        filter: "all",
      };
      const newState = reducer(
        initialState,
        updateItemDescription(
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
          "Acheter du tofu"
        )
      );
      expect(newState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du tofu",
            completed: false,
          },
        },
        filter: "all",
      });
    });

    it("should do nothing if provided ID does not point to any item", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
          filter: "all",
        },
      };
      const newState = reducer(
        initialState,
        updateItemDescription("unknown-id", "Acheter du tofu")
      );
      expect(newState).to.deep.equal(initialState);
    });

    it("should not change the initial state", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      };
      reducer(
        initialState,
        updateItemDescription(
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
          "Acheter du tofu"
        )
      );
      expect(initialState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      });
    });
  });

  describe("complete an item", () => {
    it("should change the item state to completed", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: false,
          },
        },
        filter: "all",
      };
      const newState = reducer(
        initialState,
        completeItem("49b6c1cd-25e2-4d84-b37d-768fccd59b24")
      );
      expect(newState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      });
    });

    it("should do nothing if provided ID does not point to any item", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      };
      const newState = reducer(initialState, completeItem("unknown-id"));
      expect(newState).to.deep.equal(initialState);
    });

    it("should not change the initial state", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      };
      reducer(
        initialState,
        completeItem("49b6c1cd-25e2-4d84-b37d-768fccd59b24")
      );
      expect(initialState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      });
    });
  });

  describe("uncomplete an item", () => {
    it("should change the item state to not completed", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      };
      const newState = reducer(
        initialState,
        uncompleteItem("49b6c1cd-25e2-4d84-b37d-768fccd59b24")
      );
      expect(newState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: false,
          },
        },
        filter: "all",
      });
    });

    it("should do nothing if provided ID does not point to any item", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      };
      const newState = reducer(initialState, uncompleteItem("unknown-id"));
      expect(newState).to.deep.equal(initialState);
    });

    it("should not change the initial state", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      };
      reducer(
        initialState,
        uncompleteItem("49b6c1cd-25e2-4d84-b37d-768fccd59b24")
      );
      expect(initialState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      });
    });
  });

  describe("removing an item", () => {
    it("should remove the item with the provided ID", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
          "b9929567-1cb7-4b35-9c4d-bae2b8ee625c": {
            id: "b9929567-1cb7-4b35-9c4d-bae2b8ee625c",
            description: "Trouver du bon café",
            completed: false,
          },
        },
        filter: "all",
      };
      const newState = reducer(
        initialState,
        removeItem("49b6c1cd-25e2-4d84-b37d-768fccd59b24")
      );
      expect(newState).to.deep.equal({
        items: {
          "b9929567-1cb7-4b35-9c4d-bae2b8ee625c": {
            id: "b9929567-1cb7-4b35-9c4d-bae2b8ee625c",
            description: "Trouver du bon café",
            completed: false,
          },
        },
        filter: "all",
      });
    });

    it("should not change the initial state", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      };
      reducer(initialState, removeItem("49b6c1cd-25e2-4d84-b37d-768fccd59b24"));
      expect(initialState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
        },
        filter: "all",
      });
    });
  });

  describe("removing completed items", () => {
    it("should remove completed items", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
          "b9929567-1cb7-4b35-9c4d-bae2b8ee625c": {
            id: "b9929567-1cb7-4b35-9c4d-bae2b8ee625c",
            description: "Trouver du bon café",
            completed: false,
          },
          "65168839-90f9-4605-87b8-0d3ac8987451": {
            id: "65168839-90f9-4605-87b8-0d3ac8987451",
            description: "Acheter du lait",
            completed: true,
          },
        },
        filter: "all",
      };
      const newState = reducer(initialState, removeCompleted());
      expect(newState).to.deep.equal({
        items: {
          "b9929567-1cb7-4b35-9c4d-bae2b8ee625c": {
            id: "b9929567-1cb7-4b35-9c4d-bae2b8ee625c",
            description: "Trouver du bon café",
            completed: false,
          },
        },
        filter: "all",
      });
    });
    it("should not change the initial state", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
          "b9929567-1cb7-4b35-9c4d-bae2b8ee625c": {
            id: "b9929567-1cb7-4b35-9c4d-bae2b8ee625c",
            description: "Trouver du bon café",
            completed: false,
          },
          "65168839-90f9-4605-87b8-0d3ac8987451": {
            id: "65168839-90f9-4605-87b8-0d3ac8987451",
            description: "Acheter du lait",
            completed: true,
          },
        },
        filter: "all",
      };
      reducer(initialState, removeCompleted());
      expect(initialState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: true,
          },
          "b9929567-1cb7-4b35-9c4d-bae2b8ee625c": {
            id: "b9929567-1cb7-4b35-9c4d-bae2b8ee625c",
            description: "Trouver du bon café",
            completed: false,
          },
          "65168839-90f9-4605-87b8-0d3ac8987451": {
            id: "65168839-90f9-4605-87b8-0d3ac8987451",
            description: "Acheter du lait",
            completed: true,
          },
        },
        filter: "all",
      });
    });
  });

  describe("setting state", () => {
    it("should replace with provided state", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: false,
          },
        },
        filter: "all",
      };
      const futureState = {
        items: {
          "280652c3-b823-472c-9386-9a511d299f1b": {
            id: "280652c3-b823-472c-9386-9a511d299f1b",
            description: "Faire du sport",
            completed: false,
          },
          "f6ef974a-104d-431e-8262-c5ce06b22c1f": {
            id: "f6ef974a-104d-431e-8262-c5ce06b22c1f",
            description: "Bien dormir",
            completed: false,
          },
        },
        filter: "active",
      };
      const newState = reducer(initialState, setState(futureState));
      expect(newState).to.deep.equal({
        items: {
          "280652c3-b823-472c-9386-9a511d299f1b": {
            id: "280652c3-b823-472c-9386-9a511d299f1b",
            description: "Faire du sport",
            completed: false,
          },
          "f6ef974a-104d-431e-8262-c5ce06b22c1f": {
            id: "f6ef974a-104d-431e-8262-c5ce06b22c1f",
            description: "Bien dormir",
            completed: false,
          },
        },
        filter: "active",
      });
    });

    it("should not change the initial state", () => {
      const initialState = {
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: false,
          },
        },
        filter: "all",
      };
      const futureState = {
        items: {
          "280652c3-b823-472c-9386-9a511d299f1b": {
            id: "280652c3-b823-472c-9386-9a511d299f1b",
            description: "Faire du sport",
            completed: false,
          },
          "f6ef974a-104d-431e-8262-c5ce06b22c1f": {
            id: "f6ef974a-104d-431e-8262-c5ce06b22c1f",
            description: "Bien dormir",
            completed: false,
          },
        },
        filter: "active",
      };
      reducer(initialState, setState(futureState));
      expect(initialState).to.deep.equal({
        items: {
          "49b6c1cd-25e2-4d84-b37d-768fccd59b24": {
            id: "49b6c1cd-25e2-4d84-b37d-768fccd59b24",
            description: "Acheter du beurre de cacahuète",
            completed: false,
          },
        },
        filter: "all",
      });
    });
  });

  describe("Set filter", () => {
    it("should set the filter value", () => {
      const initialState = {
        items: {},
        filter: "all",
      };
      const newState = reducer(initialState, setFilter("active"));
      expect(newState).to.deep.equal({
        items: {},
        filter: "active",
      });
    });

    it("should not change the initial state", () => {
      const initialState = {
        items: {},
        filter: "all",
      };
      reducer(initialState, setFilter("active"));
      expect(initialState).to.deep.equal({
        items: {},
        filter: "all",
      });
    });
  });
});

describe("selectItems", () => {
  it("should return items as array from a state", () => {
    const state = {
      items: {
        "280652c3-b823-472c-9386-9a511d299f1b": {
          id: "280652c3-b823-472c-9386-9a511d299f1b",
          description: "Faire du sport",
          completed: false,
        },
        "f6ef974a-104d-431e-8262-c5ce06b22c1f": {
          id: "f6ef974a-104d-431e-8262-c5ce06b22c1f",
          description: "Bien dormir",
          completed: false,
        },
      },
      filter: "all",
    };
    const items = selectItems(state);
    expect(items).to.deep.equal([
      {
        id: "280652c3-b823-472c-9386-9a511d299f1b",
        description: "Faire du sport",
        completed: false,
      },
      {
        id: "f6ef974a-104d-431e-8262-c5ce06b22c1f",
        description: "Bien dormir",
        completed: false,
      },
    ]);
  });
});
