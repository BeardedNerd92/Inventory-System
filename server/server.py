from repo import create_item, delete_item, list_items
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
import json

HOST = "127.0.0.1"
PORT = 8000
CORS_ALLOW_ORIGIN = "*"

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
            items = list_items()
            return self._send_json(200, {"items": items})
        
        return self._send_json(404, {"error": "not found"})
    

    
    def do_POST(self):
        path = urlparse(self.path).path
        if path != "/items":
            return self._send_json(404, {"error": "not found"})
        
        length = int(self.headers.get("Content-Length", 0))
        data = json.loads(self.rfile.read(length))

        name = data.get("name")
        qty = data.get("qty")

        if not isinstance(name, str) or not isinstance(qty, int):
            return self._send_json(400, {"error": "Invalid payload"})
        
        items = create_item(name, qty)
        return self._send_json(201, items)
    


    def do_DELETE(self):
        path = urlparse(self.path).path
        if not path.startswith("/items/"):
            return self._send_json(404, {"error": "not found"})
        
        try: 
            item_id = int(path.split("/")[-1])
        except ValueError:
            return self._send_json(400, {"error": "invalid id"})
       
        delete_item(item_id)

        return self._send_json(204, {})
        
    
    def log_message(self, format, *args):
        print(f"{self.command} {self.path}")
    
def main():
    server = HTTPServer((HOST, PORT), Handler)
    print(f"API running on: http://{HOST}:{PORT}")
    server.serve_forever()

if __name__ == "__main__":
    main()