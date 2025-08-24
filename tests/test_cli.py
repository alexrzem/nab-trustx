import pytest

from py_cli.cli import main


# Fixture to capture stdout for testing print statements
@pytest.fixture
def capsys_stdout(capsys):
    """
    A pytest fixture to capture stdout and stderr during tests.
    Returns:
        The capsys fixture object.
    """
    return capsys


def test_main_greet_default(capsys_stdout):
    """
    Test the 'greet' command with default behavior.
    """
    # Simulate command-line arguments: ['greet', 'World']
    exit_code = main(["greet", "World"])

    # Assert that the program exited successfully (code 0)
    assert exit_code == 0

    # Capture standard output and error
    captured = capsys_stdout.readouterr()

    # Assert that the correct greeting message was printed to stdout
    assert "Hello, World." in captured.out
    assert captured.err == ""  # Ensure no error output


def test_main_greet_loud(capsys_stdout):
    """
    Test the 'greet' command with the '--loud' flag.
    """
    # Simulate command-line arguments: ['greet', 'TestUser', '--loud']
    exit_code = main(["greet", "TestUser", "--loud"])

    assert exit_code == 0

    captured = capsys_stdout.readouterr()
    assert "HELLO, TESTUSER!" in captured.out
    assert captured.err == ""


def test_main_calculate_success(capsys_stdout):
    """
    Test the 'calculate' command with valid numbers.
    """
    # Simulate command-line arguments: ['calculate', '1', '2', '3']
    exit_code = main(["calculate", "1", "2", "3"])

    assert exit_code == 0

    captured = capsys_stdout.readouterr()
    assert "The sum of [1, 2, 3] is: 6" in captured.out
    assert captured.err == ""


def test_main_missing_command():
    """
    Test calling main without a subcommand (should return non-zero exit code).
    argparse will automatically print help/error to stderr and exit.
    """
    # Use pytest.raises to check for SystemExit, which argparse might raise
    # when arguments are invalid or missing required ones.
    # We pass None to main to simulate no arguments provided, which should trigger argparse's help/error
    with pytest.raises(SystemExit) as excinfo:
        main([])  # No arguments given

    # argparse typically exits with 2 for argument errors, but can vary.
    # We just want to ensure it's a non-zero exit code indicating failure.
    assert excinfo.value.code != 0


def test_main_invalid_calculate_arg(capsys_stdout):
    """
    Test the 'calculate' command with invalid (non-integer) numbers.
    This should result in a non-zero exit code due to argparse's type checking.
    """
    with pytest.raises(SystemExit) as excinfo:
        main(["calculate", "1", "abc", "3"])

    # Argparse usually exits with 2 for parsing errors.
    assert excinfo.value.code != 0
    captured = capsys_stdout.readouterr()
    # Check that an error message related to the argument type is printed
    assert "invalid int value" in captured.err
