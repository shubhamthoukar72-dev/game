"""Serve the browser guessing game on http://127.0.0.1:8080."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


SCRIPT_DIRECTORY = Path(__file__).resolve().parent
GAME_DIRECTORY = next(
    (
        candidate
        for candidate in (
            SCRIPT_DIRECTORY / "game",
            SCRIPT_DIRECTORY.parent / "game",
        )
        if candidate.is_dir()
    ),
    SCRIPT_DIRECTORY / "game",
)
ADDRESS = ("127.0.0.1", 8080)


def main() -> None:
    if not GAME_DIRECTORY.is_dir():
        raise FileNotFoundError(
            f"Game assets were not found. Expected a 'game' folder beside "
            f"{Path(__file__).name} or in its parent directory."
        )
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

