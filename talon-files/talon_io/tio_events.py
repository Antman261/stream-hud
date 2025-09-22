from typing import Callable, Literal
from .channel import channels
from .usio import register_usio_channel
from .fsio import register_fs_channel


type CMode = Literal["fs", "us"]


def init_channel(
    name: str,
    mode: CMode | None = "fs",
    handle_event: Callable[[dict], None] | None = None,
) -> Callable[[dict], None]:
    global channels
    if channels.get(name):
        return channels.get(name)["dispatch"]
    if mode == "us":
        return register_usio_channel(name=name, handle_event=handle_event)
    return register_fs_channel(name=name, handle_event=handle_event)


def dispatch_event(channel: str, event: dict) -> None:
    channels[channel]["dispatch"](event)
