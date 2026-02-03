from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
from pathlib import Path
import json

from inventory_repo import Repo

HOST = "127.0.0.1"
PORT = 8000
CORS_ALLOW_ORIGIN = "*"

inventory_repo = Repo(Path("inventory.db"))


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_no_content(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/health":
            return self._send_json(200, {"ok": True})

        if path == "/items":
            items = inventory_repo.list_items()
            return self._send_json(200, {"items": items})

        return self._send_json(404, {"error": "not found"})

    def do_POST(self):
        path = urlparse(self.path).path
        if path != "/items":
            return self._send_json(404, {"error": "not found"})

        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"

        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return self._send_json(400, {"error": "Invalid JSON"})

        name = data.get("name")
        qty = data.get("qty")

        if not isinstance(name, str) or not isinstance(qty, int):
            return self._send_json(400, {"error": "Invalid payload"})

        try:
            item = inventory_repo.create_item(name, qty)
        except ValueError as e:
            return self._send_json(400, {"error": str(e)})

        return self._send_json(201, item)

    def do_DELETE(self):
        path = urlparse(self.path).path
        if not path.startswith("/items/"):
            return self._send_json(404, {"error": "not found"})

        item_id = path.split("/")[-1].strip()
        if item_id == "":
            return self._send_json(400, {"error": "invalid id"})

        inventory_repo.delete_item(item_id)
        return self._send_no_content()

    def log_message(self, format, *args):
        print(f"{self.command} {self.path}")


def main():
    server = HTTPServer((HOST, PORT), Handler)
    print(f"API running on: http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
