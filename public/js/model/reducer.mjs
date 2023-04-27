import {
  ADD_ITEM,
  COMPLETE_ITEM,
  REMOVE_COMPLETED,
  REMOVE_ITEM,
  SET_FILTER,
  SET_STATE,
  UNCOMPLETE_ITEM,
  UPDATE_ITEM_DESCRIPTION,
} from "./actions.mjs";

/**
 * @typedef TodoItem
 * @type {Object}
 * @property {string} id - Identifiant unique
 * @property {string} description - Description de l'item
 * @property {boolean} completed - Indique si l'item est fait
 */

/**
 * @typedef FilterValue
 * @type {"all" | "active" | "completed"}
 */

/**
 * @typedef TodoState
 * @type {Object}
 * @property {Object.<string, TodoItem>} items
 * @property {FilterValue} filter
 */

/**
 * @type {TodoState}
 */
const initialState = {
  items: {},
  filter: "all",
};

/**
 *
 * @type {import("./StateStore.mjs").Reducer<TodoState>}
 */
function reducer(state = initialState, action) {
  if (action.type === ADD_ITEM) {
    /** @type {TodoItem} */
    const newItem = action.payload;
    return { ...state, items: { ...state.items, [newItem.id]: newItem } };
  }

  if (action.type === UPDATE_ITEM_DESCRIPTION) {
    const { itemId, description } = action.payload;
    if (itemId in state.items) {
      return {
        ...state,
        items: {
          ...state.items,
          [itemId]: {
            ...state.items[itemId],
            description,
          },
        },
      };
    }
  }

  if (action.type === COMPLETE_ITEM) {
    const itemId = action.payload;
    if (itemId in state.items) {
      return {
        ...state,
        items: {
          ...state.items,
          [itemId]: {
            ...state.items[itemId],
            completed: true,
          },
        },
      };
    }
  }

  if (action.type === UNCOMPLETE_ITEM) {
    const itemId = action.payload;
    if (itemId in state.items) {
      return {
        ...state,
        items: {
          ...state.items,
          [itemId]: {
            ...state.items[itemId],
            completed: false,
          },
        },
      };
    }
  }

  if (action.type === REMOVE_ITEM) {
    const itemId = action.payload;
    if (itemId in state.items) {
      // eslint-disable-next-line no-unused-vars
      const { [itemId]: removedItem, ...otherItems } = state.items;
      return {
        ...state,
        items: otherItems,
      };
    }
  }

  if (action.type === REMOVE_COMPLETED) {
    return {
      ...state,
      items: Object.values(state.items).reduce((itemsById, item) => {
        if (item.completed) return itemsById;
        return { ...itemsById, [item["id"]]: item };
      }, {}),
    };
  }

  if (action.type === SET_FILTER) {
    const filter = action.payload;
    return {
      ...state,
      filter,
    };
  }

  if (action.type === SET_STATE) {
    return action.payload;
  }

  return state;
}

/**
 * Renvoie les items de l'état sous forme d'un tableau
 * @param {TodoState} state
 * @returns {TodoItem[]}
 */
export function selectItems(state) {
  return Object.values(state.items);
}

/**
 * Renvoie les items de l'état sous forme d'un tableau
 * @param {TodoState} state
 * @returns {number}
 */
export function countRemainingItems(state) {
  return Object.values(state.items).filter((item) => !item.completed).length;
}

/**
 * Renvoie les items de l'état sous forme d'un tableau
 * @param {TodoState} state
 * @returns {TodoItem[]}
 */
export function selectVisibleItems(state) {
  if (state.filter === "active") {
    return Object.values(state.items).filter((item) => !item.completed);
  }
  if (state.filter === "completed") {
    return Object.values(state.items).filter((item) => item.completed);
  }
  return Object.values(state.items);
}

export default reducer;
