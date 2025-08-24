import argparse
from trustx.logger import log


def sync(args: argparse.Namespace) -> int:
    """
    Handles the 'sync' subcommand logic.
    """

    if args.gui:
        from .gui import SyncApp
        app = SyncApp()
        app.run()
    else:
        total = sum(args.numbers)

        log(f"The sum of {args.numbers} is: {total}")

    return 0  # Success
