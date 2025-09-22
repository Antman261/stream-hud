from pathlib import Path
from typing import Callable, TypedDict

Channel = TypedDict(
    "Channel",
    {
        "dispatch": Callable[[dict], None],
        "handle_event": Callable[[dict], None],
        "app_events": Path | None,
    },
)
channels: dict[str, Channel] = {}
