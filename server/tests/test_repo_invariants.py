import pytest
from pathlib import Path

from repo import Repo


@pytest.fixture
def repo(tmp_path: Path):
    return Repo(tmp_path / "data.json")


def test_create_allows_zero_qty(repo):
    item = repo.create_item("Apples", 0)
    assert item["qty"] == 0


def test_create_rejects_negative_qty(repo):
    with pytest.raises(ValueError):
        repo.create_item("Apples", -1)


def test_create_rejects_non_integer_qty(repo):
    with pytest.raises(ValueError):
        repo.create_item("Apples", 1.5)
    with pytest.raises(ValueError):
        repo.create_item("Apples", "1")  # type: ignore[arg-type]


def test_ids_are_unique(repo):
    a = repo.create_item("A", 1)
    b = repo.create_item("B", 1)
    assert a["id"] != b["id"]


def test_id_not_reused_after_delete(repo):
    a = repo.create_item("A", 1)
    old_id = a["id"]

    repo.delete_item(old_id)
    b = repo.create_item("B", 1)

    assert b["id"] != old_id


def test_delete_is_idempotent(repo):
    item = repo.create_item("A", 1)

    repo.delete_item(item["id"])
    repo.delete_item(item["id"])  # should not raise

    assert repo.list_items() == []


def test_create_returns_copy_not_live_reference(repo):
    created = repo.create_item("A", 1)
    created["qty"] = 999  # attempt corruption

    stored = repo.list_items()
    assert stored[0]["qty"] == 1


def test_list_returns_copies_not_live_references(repo):
    repo.create_item("A", 1)
    items = repo.list_items()

    items[0]["qty"] = 999  # attempt corruption

    again = repo.list_items()
    assert again[0]["qty"] == 1
