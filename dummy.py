"""Serve the browser guessing game on http://127.0.0.1:8080."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


GAME_DIRECTORY = Path(__file__).parent / "game"
ADDRESS = ("127.0.0.1", 8080)


def main() -> None:
    handler = partial(SimpleHTTPRequestHandler, directory=str(GAME_DIRECTORY))
    server = ThreadingHTTPServer(ADDRESS, handler)
    print(f"Number game running at http://{ADDRESS[0]}:{ADDRESS[1]}")
    print("Press Ctrl+C to stop the server.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nGame server stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
