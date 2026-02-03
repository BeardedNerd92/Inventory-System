import copy
import json
import uuid
from pathlib import Path


class Repo:
    def __init__(self, data_file: Path):
        self._data_file = data_file

    def _default_state(self) -> dict:
        return {"items": []}

    def _ensure_data_file(self) -> None:
        if not self._data_file.exists():
            self._data_file.write_text(
                json.dumps(self._default_state(), indent=2),
                encoding="utf-8",
            )
            return

        raw = self._data_file.read_text(encoding="utf-8").strip()
        if raw == "":
            self._data_file.write_text(
                json.dumps(self._default_state(), indent=2),
                encoding="utf-8",
            )

    def _read_state(self) -> dict:
        self._ensure_data_file()
        raw = self._data_file.read_text(encoding="utf-8")
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            data = self._default_state()

        if not isinstance(data, dict):
            data = self._default_state()

        if "items" not in data or not isinstance(data["items"], list):
            data["items"] = []

        return data

    def _write_state(self, state: dict) -> None:
        self._data_file.write_text(
            json.dumps(state, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    # --------
    # API
    # --------

    def list_items(self) -> list[dict]:
        state = self._read_state()
        return [copy.deepcopy(item) for item in state["items"]]

    def create_item(self, name: str, qty: int) -> dict:
        if not isinstance(qty, int) or qty < 0:
            raise ValueError("qty must be a non-negative integer")

        state = self._read_state()
        item = {
            "id": str(uuid.uuid4()),
            "name": name,
            "qty": qty,
        }
        state["items"].append(item)
        self._write_state(state)
        return copy.deepcopy(item)

    def delete_item(self, item_id: str) -> None:
        state = self._read_state()
        state["items"] = [i for i in state["items"] if i.get("id") != item_id]
        self._write_state(state)
