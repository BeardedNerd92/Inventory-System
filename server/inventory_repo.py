import sqlite3
import uuid
from pathlib import Path


class Repo:
    def __init__(self, data_file: Path):
        self._db_path = data_file
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._db_path)
        conn.row_factory = sqlite3.Row

        conn.execute("PRAGMA foreign_keys = ON;")
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = NORMAL;")

        return conn

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS items (
                    id   TEXT PRIMARY KEY,
                    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
                    qty  INTEGER NOT NULL CHECK (qty >= 0)
                );
                """
            )


    def list_items(self) -> list[dict]:
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT id, name, qty FROM items ORDER BY name ASC"
            ).fetchall()

        return [{"id": r["id"], "name": r["name"], "qty": r["qty"]} for r in rows]

    def create_item(self, name: str, qty: int) -> dict:

        self._assert_invariants(name, qty)
        
        item = {
            "id": str(uuid.uuid4()),
            "name": name,
            "qty": qty,
        }

        with self._connect() as conn:
            conn.execute(
                "INSERT INTO items (id, name, qty) VALUES (?, ?, ?)",
                (item["id"], item["name"], item["qty"]),
            )

        return dict(item)

    def delete_item(self, item_id: str) -> None:
        with self._connect() as conn:
            conn.execute("DELETE FROM items WHERE id = ?", (item_id,))


    def _assert_invariants(self, name: str, qty: int) -> None:
        if not isinstance(name, str) or name.strip() == "":
            raise ValueError("name must be a non-empty string")
        if not isinstance(qty, int) or qty < 0:
            raise ValueError("qty must be a non-negative integer")
