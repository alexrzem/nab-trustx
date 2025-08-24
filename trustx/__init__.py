from rich import print, pretty
from .logger import log

# Define the __all__ variable
#__all__ = ["module1", "module2"]

## Define package-level variables
__version__ = "0.0.1"
__author__ = "NAB"

# Import the submodules
#from . import module1
#from . import module2

log(f":shield: [bold white]TrustX[/bold white] Package [bold blue]v{__version__}[/bold blue] initialized")
