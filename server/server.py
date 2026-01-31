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
        self.end_headers()
        self.wfile.write(body)


    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/health":
            return self._send_json(200, {"ok": True})
        
        return self._send_json(404, {"error": "not found"})
    
    def log_message(self, format, *args):
        return 
    
def main():
    server = HTTPServer((HOST, PORT), Handler)
    print(f"API running on: http://{HOST}:{PORT}")
    server.serve_forever()

if __name__ == "__main__":
    main()