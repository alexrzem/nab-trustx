import argparse
from trustx.logger import log


def export(args: argparse.Namespace) -> int:
    """
    Handles the 'export' subcommand logic.
    """

    if args.gui:
        from .gui import ExportApp
        app = ExportApp()
        app.run()
    else:
        name = args.username
        if args.apikey:
            message = f"EXPORT, {name.upper()}!"
        else:
            message = f"export, {name}."
        log(message)

    return 0  # Success
