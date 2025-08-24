from typing import (
    Any,
    Optional,
    Union,
)
from rich.style import Style
from rich.console import Console, JustifyMethod

CONSOLE = Console()


def log(
    msg: Any,
    sep: str = " ",
    end: str = "\n",
    style: Optional[Union[str, Style]] = None,
    justify: Optional[JustifyMethod] = None,
    emoji: Optional[bool] = None,
    markup: Optional[bool] = None,
    highlight: Optional[bool] = None,
    log_locals: bool = False,
    _stack_offset: int = 1,
) -> None:
    """Log rich content to the terminal."""

    CONSOLE.log(msg, sep=sep, end=end, style=style, justify=justify, emoji=emoji, markup=markup, highlight=highlight, log_locals=log_locals, _stack_offset=_stack_offset)
