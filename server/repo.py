import json
from pathlib import Path

DATA_FILE = Path("data.json")

DEFAULT_STATE = {
    "next_id": 1,
    "items": []
}

def _ensure_data_file() -> None:
    if not DATA_FILE.exists():
        DATA_FILE.write_text(
            json.dumps(DEFAULT_STATE, indent=2),
            encoding="utf-8"
        )
        return
    raw = DATA_FILE.read_text(encoding="utf-8").strip()
    if raw == "":
        DATA_FILE.write_text(json.dumps(DEFAULT_STATE, indent=2), encoding="utf-8")


def _read_state() -> dict:
    _ensure_data_file()

    raw = DATA_FILE.read_text(encoding="utf-8")
    
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = DEFAULT_STATE.copy()

    if not isinstance(data, dict):
        data = DEFAULT_STATE.copy()
    
    if "next_id" not in data or not isinstance(data["next_id"], int):
         data["next_id"] = DEFAULT_STATE["next_id"]
    if "items" not in data or not isinstance(data["items"], list):
        data["items"] = []

    return data
    

def _write_state(state: dict) -> None:
   DATA_FILE.write_text(
       json.dumps(state, ensure_ascii=False, indent=2),
       encoding="utf-8"
   )

def list_items() -> list[dict]:
    state = _read_state()
    return state["items"]


def create_item(name: str, qty: int) -> dict:
    state = _read_state()

    new_item = {
        "id": state["next_id"],
        "name": name,
        "qty": qty
    }

    state["next_id"] += 1
    state["items"].append(new_item)
    _write_state(state)
    return new_item

def delete_item(item_id: int) -> bool:
    state = _read_state()
    before = len(state["items"])

    state["items"] = [item for item in state["items"] if item.get("id") != item_id]
    removed = len(state["items"]) != before

    if removed:
        _write_state(state)

    return removed