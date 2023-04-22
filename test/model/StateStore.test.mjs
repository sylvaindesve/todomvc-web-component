import { expect } from "chai";
import { describe, it } from "mocha";

import { StateStore } from "../../public/js/model/StateStore.mjs";

describe("StateStore", () => {
  it("should initialize state", () => {
    const store = new StateStore((state) => {
      if (state === undefined) {
        return "INITIAL STATE";
      } else {
        return "NOT INITIAL STATE";
      }
    });

    expect(store.getState()).to.equal("INITIAL STATE");
  });

  it("should change the state when dispatching an action", () => {
    const store = new StateStore((state = 0, action) => {
      if (action.type === "INCREMENT") {
        return state + 1;
      }
      return state;
    });
    store.dispatch({ type: "INCREMENT" });
    expect(store.getState()).to.equal(1);
  });

  it("should notify listeners of state changes", () => {
    const store = new StateStore((state = 0, action) => {
      if (action.type === "INCREMENT") {
        return state + 1;
      }
      return state;
    });
    store.subscribe((newState) => {
      expect(newState).to.equal(1);
    });
    store.dispatch({ type: "INCREMENT" });
  });
});
