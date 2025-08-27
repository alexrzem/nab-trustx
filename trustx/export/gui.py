import json
from typing import Dict, List, Optional, Union
from textual import events, on
from textual.app import App, ComposeResult
from textual.containers import Horizontal, HorizontalGroup, HorizontalScroll, Vertical, VerticalGroup, VerticalScroll
from textual.widgets import Button, Footer, Header, Select, Static, RichLog, Input, SelectionList
from textual.widgets.selection_list import Selection

CONFIG = []
ENVIRONMENTS = []
ENVIRONMENT = None


def load_config() -> List:
    with open("config.json") as json_data:
        CONFIG = json.load(json_data)

    for item in CONFIG:
        ENVIRONMENTS.append((item["name"], item["id"]))

    return CONFIG


def get_environment(environment_id: str) -> Dict | None:
    environments = load_config()
    selected = environments[0]
    for environment in environments:
        if environment["id"] == environment_id:
            selected = environment
            break

    return selected


class EnvironmentSelector(Static):

    def compose(self) -> ComposeResult:
        yield Select(options=ENVIRONMENTS, id="environments", name="environments", allow_blank=True, prompt="Select Environment")


class EnvironmentHost(Input):

    BORDER_TITLE = "Host Name"

    def __init__(self) -> None:
        super().__init__(id="host", placeholder="host", password=False)
        self.classes = "environment-input"


class EnvironmentName(Input):

    BORDER_TITLE = "Name"

    def __init__(self) -> None:
        super().__init__(id="name", placeholder="Name", password=False)
        self.classes = "environment-input"


class EnvironmentApikey(Input):

    BORDER_TITLE = "API Key"

    def __init__(self) -> None:
        super().__init__(id="apikey", placeholder="API Key", password=True)
        self.classes = "environment-input"


class EnvironmentBox(Static):
    """Display a greeting."""

    BORDER_TITLE = "Environments"

    def __init__(self) -> None:
        super().__init__(id="environment-box")

    def compose(self) -> ComposeResult:
        yield EnvironmentSelector()
        yield EnvironmentHost()
        yield EnvironmentName()
        yield EnvironmentApikey()


class SettingsBox(Static):
    """Display a greeting."""

    BORDER_TITLE = "Settings"

    def __init__(self) -> None:
        super().__init__(id="settings-box")

    def compose(self) -> ComposeResult:
        yield SelectionList[str](
            Selection("Cloud Functions", "Cloud Functions", False),
            Selection("Custom Data Forms", "Custom Data Forms", False),
            Selection("Custom Pages", "Custom Pages", False),
            Selection("Process Definitions", "Process Definitions", False),
            Selection("Themes", "Themes", False),
        )
        yield Button("Export", variant="primary")

    def action_next_word(self) -> None:
        """Get a new hello and update the content area."""
        hello = "next(hellos)"


class LogsBox(Static):
    """Display a greeting."""

    BORDER_TITLE = "Logs"

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

    def __init__(self) -> None:
        super().__init__()
        load_config()

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

        TEXT_LOG = self.query_one("#log", RichLog)
        TEXT_LOG.write("[bold magenta]Write text or any Rich renderable!")

    def on_key(self, event: events.Key) -> None:
        """Write Key events to log."""
        TEXT_LOG = self.query_one("#log", RichLog)
        TEXT_LOG.write(event)

    @on(Select.Changed)
    def select_changed(self, event: Select.Changed) -> None:
        """Write Key events to log."""
        TEXT_LOG = self.query_one("#log", RichLog)
        TEXT_LOG.write(event.value)

        environment = get_environment(str(event.value))
        TEXT_LOG.write(environment)
        if environment:
            self.query_one("#host", Input).value = environment["host"]
            self.query_one("#name", Input).value = environment["name"]
            self.query_one("#apikey", Input).value = environment["apikey"]


if __name__ == "__main__":
    app = ExportApp()
    app.run()
