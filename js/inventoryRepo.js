const STORAGE_KEY = "inventory_items_v1";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function makeId() {
  return (crypto?.randomUUID?.() ??
    `id_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export function listItems() {
  return readAll();
}

export function createItem({ name, qty }) {
  const items = readAll();
  const newItem = { id: makeId(), name, qty };
  items.push(newItem);
  writeAll(items);
  return newItem;
}

export function removeItem(id) {
  const items = readAll();
  const next = items.filter((it) => it.id !== id);
  writeAll(next);
}