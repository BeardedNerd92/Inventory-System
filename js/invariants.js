/**
 * Dev-only invariant checks.
 * These enforce normalized state guarantees and are stripped/no-op in production.
 */



const __DEV__ =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV) ||
  (typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production");

/**
 * Throws in dev if condition is false.
 */
export function invariant(condition, message) {
  if (!__DEV__) return;
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Inventory normalized shape invariants:
 * - byId is an object
 * - allIds is an array
 * - every id in allIds exists in byId
 * - no extra keys in byId that aren't listed in allIds (optional but recommended)
 */
export function assertInventoryState(state) {
  if (!__DEV__) return;

  invariant(state && typeof state === "object", "inventory state must be an object");
  invariant(state.byId && typeof state.byId === "object", "inventory.byId must be an object");
  invariant(Array.isArray(state.allIds), "inventory.allIds must be an array");

  // 1) allIds -> byId
  for (const id of state.allIds) {
    invariant(id != null && id !== "", "inventory.allIds contains an empty/invalid id");
    invariant(
      Object.prototype.hasOwnProperty.call(state.byId, id),
      `inventory invariant failed: allIds contains "${id}" but byId is missing it`
    );
  }

  // 2) byId -> allIds (recommended: prevents "ghost items" in byId)
  const allIdsSet = new Set(state.allIds);
  for (const id of Object.keys(state.byId)) {
    invariant(
      allIdsSet.has(id),
      `inventory invariant failed: byId has "${id}" but allIds is missing it`
    );
  }
}
