import { isDefined, isKeyOf, isObjectGuard } from '../../core';

/**
 * @description
 * Accepts an object of type T and single key or array of keys (K extends keyof T).
 * Constructs new object based on provided keys.
 *
 * @example
 *
 * const cat = {id: 1, type: 'cat', name: 'Fluffy'};
 *
 * const catWithoutType = extract(cat, ['name', 'id']);
 *
 * // catWithoutType will be:
 * // {id: 1, name: 'Fluffy'};
 *
 * @example
 * // Usage with RxState
 *
 * export class AnimalsListComponent {
 *
 *    constructor(private state: RxState<ComponentState>, private api: ApiService) {
 *      state.connect(
 *        'animals'
 *        this.api.getAnimals(),
 *        (state, animals) => {
 *            return animals.map(animal => extract(animal, ['id', 'name']));
 *        }
 *      );
 *    }
 * }
 *
 * @returns T
 *
 * @docsPage extract
 * @docsCategory transformation-helpers
 */
export function extract<T extends object, K extends keyof T>(
  object: T,
  keys: K | K[]
): Pick<T, K> {
  const objectIsObject = isDefined(object) && isObjectGuard(object);

  if (!objectIsObject) {
    console.warn(`Extract: original value (${object}) is not an object.`);
    return undefined as any;
  }

  const sanitizedKeys = (Array.isArray(keys) ? keys : [keys]).filter(
    (k) => isKeyOf<T>(k) && k in object
  );

  if (!sanitizedKeys.length) {
    console.warn(`Extract: provided keys not found`);
    return undefined as any;
  }

  return sanitizedKeys.reduce(
    (acc, k) => ({ ...acc, [k]: object[k] }),
    {} as Pick<T, K>
  );
}