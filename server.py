#!/usr/bin/env python3
"""Simple local web server for previewing this site."""

from __future__ import annotations

import argparse
import os
import pathlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Serve this website locally for development preview."
    )
    parser.add_argument(
        "--host",
        default=os.getenv("HOST", "127.0.0.1"),
        help="Host to bind to (default: %(default)s)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("PORT", "8000")),
        help="Port to listen on (default: %(default)s)",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()

    # Always serve files relative to this script's folder.
    site_root = pathlib.Path(__file__).resolve().parent
    os.chdir(site_root)

    handler = SimpleHTTPRequestHandler
    server = ThreadingHTTPServer((args.host, args.port), handler)

    print(f"Serving {site_root}")
    print(f"Open: http://{args.host}:{args.port}")
    print("Press Ctrl+C to stop.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
