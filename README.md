# `README.md`

# CLI Project Template

This project provides a clean and extensible template for building command-line interface (CLI) applications in Python. It's designed for ease of use, maintainability, and extensibility, using `argparse` for robust argument handling and `uv` for dependency management and project execution.

-----

## Project Structure

The project has a simple and intuitive structure:

```
py_cli/
├── __init__.py
├── __main__.py
└── cli.py
```

  * **`py_cli/`**: This is the root directory of your Python package. You should replace `py_cli` with the actual name of your application.
  * **`__main__.py`**: This file serves as the **entry point** for your CLI application. When you run `python -m py_cli`, this file is executed. It imports the `main` function from `cli.py` and handles the program's exit status, including basic error handling.
  * **`cli.py`**: This file contains the core logic of your CLI. It defines the `main` function, which uses Python's `argparse` module to define command-line arguments and subcommands. This is where you'll add new commands and their respective functionalities.
  * **`README.md`**: This file (you're reading it now\!) provides documentation for your project, explaining its structure, how to use it, and how to extend it.

-----

## How it Works

When you execute your application (e.g., `python -m py_cli <command>`), the following happens:

1.  The `__main__.py` file is executed.
2.  It calls the `main()` function defined in `cli.py`.
3.  The `main()` function in `cli.py` uses `argparse` to parse the command-line arguments you provided.
4.  Based on the subcommand chosen (e.g., `greet` or `calculate`), the corresponding handler function (`_handle_greet` or `_handle_calculate`) is invoked.
5.  The handler function executes the specific logic for that command and returns an integer exit code (0 for success, non-zero for errors).
6.  This exit code is then used by `__main__.py` to exit the application, signaling its success or failure to the operating system.

-----

## Extending and Modifying This Template

You can easily extend this template to add more commands and features to your CLI application.

1.  **Rename `py_cli`**: Start by renaming the `py_cli/` directory to the desired name of your application (e.g., `my_awesome_tool/`).
2.  **Modify `cli.py`**:
      * **Add New Subparsers**: For each new command you want to add (e.g., `configure`, `report`, `deploy`), create a new subparser using `subparsers.add_parser()`.
        ```python
        # Example for a new 'new_command'
        new_command_parser = subparsers.add_parser(
            "new_command",
            help="Does something new."
        )
        new_command_parser.add_argument(
            "--option",
            type=str,
            help="An option for the new command."
        )
        new_command_parser.set_defaults(func=_handle_new_command)
        ```
      * **Create Handler Functions**: For each new subparser, create a corresponding handler function (e.g., `_handle_new_command`). These functions will contain the specific logic for that command and must accept `args: argparse.Namespace` as their first argument and return an `int` exit code.
        ```python
        def _handle_new_command(args: argparse.Namespace) -> int:
            """
            Handles the 'new_command' subcommand logic.
            """
            print(f"Executing new command with option: {args.option}")
            # Add your command's logic here
            return 0 # Return 0 for success
        ```
      * **Add Arguments**: Define any necessary arguments for your new command within its subparser using `add_argument()`. Refer to the `argparse` documentation for various argument types and options (positional, optional, flags, etc.).

-----

## Using `uv` with This Project

`uv` is an extremely fast Python package installer and resolver. It's an excellent choice for managing your project's dependencies and running your CLI application.

### Installation

If you don't have `uv` installed, you can install it using `pipx` (recommended for CLI tools):

```bash
pipx install uv
```

Alternatively, using `pip`:

```bash
pip install uv
```

### Adding Dependencies

To add a new dependency to your project (e.g., `rich` for rich text output), navigate to the root directory of your project (where `__main__.py` is located) and use `uv add`:

```bash
uv add rich
```

This will automatically create a `pyproject.toml` file (if one doesn't exist) and add `rich` to your project's dependencies. `uv` will also manage your virtual environment automatically.

### Running the Script with `uv`

You can run your CLI application using `uv run`. Replace `py_cli` with the actual name of your application's package directory (e.g., `py_cli`).

```bash
uv run py_cli --help
```

This command will display the help message for your application.

Here are some examples of running the template's commands:

```bash
# Run the greet command
uv run py_cli greet Alice

# Run the greet command loudly
uv run py_cli greet Bob --loud

# Run the calculate command
uv run py_cli calculate 10 20 5
```

-----

## Testing

This project uses [`pytest`](https://www.google.com/search?q=%5Bhttps://docs.pytest.org/%5D\(https://docs.pytest.org/\)) for unit and integration testing. Tests are located in the `tests/` directory and ensure that the CLI application behaves as expected.

### Installing Pytest

Pytest is installed as a development dependency:

```bash
uv add pytest --dev
```

### Running Tests

To run all tests, navigate to the root directory of your project (e.g., `my_cli_app/`) and use `uv run` to execute `pytest`:

```bash
uv run pytest
```

You should see output indicating the number of tests passed or failed.

-----