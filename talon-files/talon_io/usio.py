import datetime
import json
from pathlib import Path
from typing import Callable, TypedDict
from .channel import Channel, channels
import socket

ChannelSockets = TypedDict(
    "ChannelSockets",
    {
        "client": socket,
        "send": Callable[[dict], None],
    },
)
channel_sockets: dict[str, ChannelSockets] = {}


def register_usio_channel(name, handle_event):
    sock_path = Path(f"/tmp/{name}.sock").as_posix()
    print("socket:", sock_path)
    client = Client(sock_path)

    def dispatch(event):
        event["occurredAt"] = int(datetime.datetime.now().timestamp() * 1000)
        client.send(event)

    channels[name] = Channel(dispatch=dispatch, handle_event=handle_event)
    return dispatch


class Client:
    def __init__(self, path: str):
        self.path = path
        self.client = None
        self.is_connected = False

    def connect(self):
        try:
            print("Connecting")
            self.client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            self.client.connect(self.path)
            self.is_connected = True
            print("Connected")
        except Exception as ex:
            self.is_connected = False
            if self.client is not None:
                self.client.close()
                self.client = None
            print(f"Client error connecting on {self.path}:", ex)

    def send(self, event: dict):
        if self.is_connected == False:
            self.connect()
        if self.is_connected:
            try:
                self.client.sendall(f"{json.dumps(event)}\n".encode())
                return
            except socket.error as e:
                self.client.close()
                self.is_connected = False
                self.client = None
                print(f"Socket error: {e}")
            except Exception as ex:
                # if .:
                print(f"Failed to send {event.get("type", 'unknown')} due to:", ex)
        print(f"Unable to send message {event.get("type", 'unknown')}")
