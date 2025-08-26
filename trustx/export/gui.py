from textual import events, on
from textual.app import App, ComposeResult
from textual.widgets import Footer, Header, Select, Static, RichLog, Input
from textual.widgets._select import NoSelection


BLANK = NoSelection()

ENVIRONMENTS = [("Dev", "DEV"), ("Sit", "SIT"), ("Prd", "PROD")]
ENVIRONMENT = None


class EnvironmentSelector(Select):
    def __init__(self) -> None:
        super().__init__(options=ENVIRONMENTS, id="environments", name="environments", allow_blank=False, prompt="Select Environment")


class EnvironmentDomain(Input):

    BORDER_TITLE = "Domain Name"

    def __init__(self) -> None:
        super().__init__(id="domain", placeholder="Domain", password=False)
        self.classes = "environment-input"


class EnvironmentUsername(Input):

    BORDER_TITLE = "Username"

    def __init__(self) -> None:
        super().__init__(id="username", placeholder="Username", password=False)
        self.classes = "environment-input"


class EnvironmentApikey(Input):

    BORDER_TITLE = "API Key"

    def __init__(self) -> None:
        super().__init__(id="apikey", placeholder="API Key", password=True)
        self.classes = "environment-input"


class EnvironmentBox(Static):
    """Display a greeting."""

    BORDER_TITLE = "Environments"
    CSS = """

    """

    def __init__(self) -> None:
        super().__init__(id="environment-box")

    def compose(self) -> ComposeResult:
        yield EnvironmentSelector()
        yield EnvironmentDomain()
        yield EnvironmentUsername()
        yield EnvironmentApikey()


class SettingsBox(Static):
    """Display a greeting."""

    BORDER_TITLE = "Settings"
    CSS = """
    #settings-box {
        height: 100%;
        width: 1fr;
        border: solid #c678dd;
    }
    """

    def __init__(self) -> None:
        super().__init__(id="settings-box")

    def action_next_word(self) -> None:
        """Get a new hello and update the content area."""
        hello = "next(hellos)"


class LogsBox(Static):
    """Display a greeting."""

    BORDER_TITLE = "Logs"
    DEFAULT_CSS = """

    """

    def __init__(self) -> None:
        super().__init__(id="logging-box")

    def compose(self) -> ComposeResult:
        yield RichLog(id="log", highlight=True, markup=True)

    def on_ready(self) -> None:
        """Called  when the DOM is ready."""
        text_log = self.query_one("#log", RichLog)
        text_log.write("[bold magenta]Write text or any Rich renderable!")


class ExportApp(App):
    """A Textual app to manage stopwatches."""

    BINDINGS = [("d", "toggle_dark", "Toggle dark mode")]
    CSS_PATH = "style.tcss"

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield Header()

        yield EnvironmentBox()
        yield SettingsBox()
        yield LogsBox()

        yield Footer()

    def action_toggle_dark(self) -> None:
        """An action to toggle dark mode."""
        self.theme = "textual-dark" if self.theme == "textual-light" else "textual-light"

    def on_ready(self) -> None:
        """Called  when the DOM is ready."""
        text_log = self.query_one("#log", RichLog)
        text_log.write("[bold magenta]Write text or any Rich renderable!")

    def on_key(self, event: events.Key) -> None:
        """Write Key events to log."""
        text_log = self.query_one("#log", RichLog)
        text_log.write(event)

    @on(Select.Changed)
    def select_changed(self, event: Select.Changed) -> None:
        """Write Key events to log."""
        text_log = self.query_one("#log", RichLog)
        text_log.write(event.value)

        text_log = self.query()


if __name__ == "__main__":
    app = ExportApp()
    app.run()
