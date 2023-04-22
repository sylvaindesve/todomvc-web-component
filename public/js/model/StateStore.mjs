/**
 * Une action pouvant modifier un état.
 * @template P
 * @typedef {Object} Action
 * @property {string} type - Le type de l'action.
 * @property {P} payload - Les arguments accompagnant l'action.
 */

/**
 * Un fonction prenant un état et une action et qui renvoie un nouvel état.
 * @template S
 * @callback Reducer
 * @param {S} [state]
 * @param {Action<any>} action
 * @return {S}
 */

/**
 * Un fonction d'écoute des changements d'état.
 * @template S
 * @callback Listener
 * @param {S} state
 * @return {void}
 */

/**
 * Un store permettant de gérer un état et de notifier lorsqu'il est modifié.
 *
 * @template S
 */
export class StateStore {
  /**
   * La fonction de réduction de ce store.
   * @type {Reducer<S>}
   */
  #reducer;

  /**
   * L'état courant géré par ce store.
   * @type {S}
   */
  #currentState;

  /**
   * Les écouteurs des changements de l'état courant.
   * @type {Listener<S>[]}
   */
  #listeners;

  /**
   * Instancie le store avec la fonction de réduction fournie. Cette fonction
   * sera immédiatement appelée pour initialiser l'état courant.
   *
   * Il est primordial que la fonction de réduction retourne toujours un nouvel
   * état et ne modifie en aucun cas l'état courant.
   *
   * @param {Reducer<S>} reducer La fonction de réduction de ce store
   */
  constructor(reducer) {
    this.#reducer = reducer;
    this.#currentState = this.#reducer(undefined, { type: "@@INIT" });
    this.#listeners = [];
  }

  /**
   * Renvoie l'état courant géré par ce store.
   * @returns {S}
   */
  getState() {
    return this.#currentState;
  }

  /**
   * Met à jour l'état courant en appliquant la fonction de réduction sur l'état
   * courant avec l'action fournie puis notifie le changement d'état à tous les
   * écouteurs.
   * @param {Action<any>} action L'action a exécuter
   */
  dispatch(action) {
    this.#currentState = this.#reducer(this.#currentState, action);
    for (const listener of this.#listeners) {
      listener(this.#currentState);
    }
  }

  /**
   * Enregistre un nouvel écouteur des changements de l'état géré par ce store.
   * @param {Listener<S>} listener Fonction d'écoute
   */
  subscribe(listener) {
    this.#listeners.push(listener);
  }
}
