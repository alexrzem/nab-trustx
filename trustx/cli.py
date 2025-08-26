import argparse
from typing import List, Optional
from trustx.logger import log


def main(argv: Optional[List[str]] = None) -> int:
    """
    The main function for the command-line interface (CLI) application.

    This function parses command-line arguments, handles subcommands,
    and executes the corresponding logic.

    Args:
        argv: A list of strings representing the command-line arguments.
              If None, sys.argv[1:] will be used. This is useful for testing.

    Returns:
        An integer exit code. 0 for success, non-zero for errors.
    """
    # 1. Create the top-level parser
    # This is the primary parser for your application.
    parser = argparse.ArgumentParser(
        prog="trustx",  # The name of the program to display in help messages
        description="TrustX Export & Synchronisation",
    )

    # 2. Add subparsers to handle different commands
    subparsers = parser.add_subparsers(
        dest="command",  # Name of the argument that will store the subcommand chosen
        help="Available commands",
        required=True,  # Forces the user to select a subcommand
    )

    # --- Subparser for the 'export' command ---
    export_parser = subparsers.add_parser("export", help="Export configuration from a TrustX instance.")
    export_parser.add_argument("-u", "--username", action="store_true", help="TRUSTX_SOURCE_USERNAME", required=False)
    export_parser.add_argument("-p", "--apikey", action="store_true", help="TRUSTX_SOURCE_API_KEY", required=False)
    export_parser.add_argument("-d", "--domain", action="store_true", help="TRUSTX_SOURCE_HOSTNAME", required=False)
    export_parser.add_argument("-g", "--gui", action="store_true", help="GUI", required=False)
    # Set the function to call when this subparser is chosen
    export_parser.set_defaults(func=export)

    # --- Subparser for the 'sync' command ---
    sync_parser = subparsers.add_parser("sync", help="Synchronise configuration between two TrustX instances.")
    sync_parser.add_argument("-g", "--gui", action="store_true", help="GUI", required=False)
    # Set the function to call when this subparser is chosen
    sync_parser.set_defaults(func=sync)

    # 3. Parse the arguments
    args = parser.parse_args(argv)

    # 4. Execute the appropriate function based on the chosen subparser
    # The 'func' attribute was set by set_defaults in each subparser.
    try:
        # Call the function associated with the chosen sub-command, passing the parsed arguments.
        # The return value of the handler function will be the exit code.
        return args.func(args)
    except Exception as e:
        # Catch any exceptions raised by the subcommand handlers
        log(f"Error executing command '{args.command}': {e}")
        return 1  # Indicate an error


# --- Handler Functions for Subcommands ---


def export(args: argparse.Namespace) -> int:
    """
    Handles the 'export' subcommand logic.
    """
    from trustx.export.export import export as export_main
    return export_main(args)


def sync(args: argparse.Namespace) -> int:
    """
    Handles the 'sync' subcommand logic.
    """
    from trustx.sync.sync import sync as sync_main
    return sync_main(args)
