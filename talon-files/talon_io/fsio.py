import datetime
import json
from pathlib import Path
from tempfile import gettempdir
from talon import cron
from .channel import Channel, channels

watch_job = None


def _init_directory(name):
    dirpath = _get_channel_dirpath(name)
    talon_events = dirpath / "talon-events"
    app_events = dirpath / "app-events"
    talon_events.mkdir(mode=0o777, parents=True, exist_ok=True)
    app_events.mkdir(mode=0o777, parents=True, exist_ok=True)
    return (talon_events, app_events)


def _get_channel_dirpath(name: str):
    return Path(gettempdir()) / f"{name}"


def register_fs_channel(name, handle_event):
    global watch_job
    (talon_events, app_events) = _init_directory(name)
    event_number: int = 0

    def dispatch(event):
        nonlocal event_number
        event["occurredAt"] = datetime.datetime.now().timestamp() * 1000
        file = talon_events / f"e-{event_number}.json"
        file.write_text(data=json.dumps(event))
        event_number += 1

    channels[name] = Channel(
        dispatch=dispatch, app_events=app_events, handle_event=handle_event
    )

    if watch_job == None and handle_event != None:
        watch_job = cron.interval("50ms", _process_events)

    return dispatch


def _process_events():
    for channel in channels.values():
        if channel["app_events"] == None:
            continue
        files = list(channel["app_events"].iterdir())
        files.sort()
        for event_file in files:
            event = json.load(event_file)
            channel["handle_event"](event)
