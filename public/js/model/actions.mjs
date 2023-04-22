export const ADD_ITEM = "ADD_ITEM";

/**
 * Créé une action d'ajout d'item à la liste.
 * @param {import("./reducer.mjs").TodoItem} newItem L'item à ajouter
 * @returns {import("./StateStore.mjs").Action<import("./reducer.mjs").TodoItem>}
 */
export function addItem(newItem) {
  return {
    type: ADD_ITEM,
    payload: newItem,
  };
}

export const UPDATE_ITEM_DESCRIPTION = "UPDATE_ITEM_DESCRIPTION";

/**
 * @typedef IdAndDescription
 * @type {Object}
 * @property {string} id - Identifiant unique
 * @property {string} description - Description de l'item
 */

/**
 *
 * @param {string} itemId L'ID de l'item dont la description doit changer
 * @param {string} description Nouvelle description
 * @returns {import("./StateStore.mjs").Action<IdAndDescription>}
 */
export function updateItemDescription(itemId, description) {
  return {
    type: UPDATE_ITEM_DESCRIPTION,
    payload: {
      itemId,
      description,
    },
  };
}

export const COMPLETE_ITEM = "COMPLETE_ITEM";

/**
 * Créé une action pour terminer un item
 * @param {string} itemId L'ID de l'item à terminer
 * @returns {import("./StateStore.mjs").Action<string>}
 */
export function completeItem(itemId) {
  return {
    type: COMPLETE_ITEM,
    payload: itemId,
  };
}

export const UNCOMPLETE_ITEM = "UNCOMPLETE_ITEM";

/**
 * Créé une action pour repasser un item à non terminé
 * @param {string} itemId L'ID de l'item rebasculer en non terminé
 * @returns {import("./StateStore.mjs").Action<string>}
 */
export function uncompleteItem(itemId) {
  return {
    type: UNCOMPLETE_ITEM,
    payload: itemId,
  };
}

export const REMOVE_ITEM = "REMOVE_ITEM";

/**
 * Créé une action pour supprimer un item
 * @param {string} itemId L'ID de l'item à supprimer
 * @returns {import("./StateStore.mjs").Action<string>}
 */
export function removeItem(itemId) {
  return {
    type: REMOVE_ITEM,
    payload: itemId,
  };
}

export const REMOVE_COMPLETED = "REMOVE_COMPLETED";

/**
 * Créé une action pou supprimer les items terminés
 * @returns {import("./StateStore.mjs").Action<any>}
 */
export function removeCompleted() {
  return {
    type: REMOVE_COMPLETED,
  };
}

export const SET_FILTER = "SET_FILTER";

/**
 *
 * @param {import("./reducer.mjs").FilterValue} filter
 * @returns {import("./StateStore.mjs").Action<import("./reducer.mjs").FilterValue>}
 */
export function setFilter(filter) {
  return {
    type: SET_FILTER,
    payload: filter,
  };
}

export const SET_STATE = "SET_STATE";

/**
 * Créé une action pour remplacer la totalité de l'état
 * @param {import("./reducer.mjs").TodoState} state
 * @returns {import("./StateStore.mjs").Action<import("./reducer.mjs").TodoState>}
 */
export function setState(state) {
  return {
    type: SET_STATE,
    payload: state,
  };
}
