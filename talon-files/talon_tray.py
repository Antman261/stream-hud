from typing import Literal
from talon import Module, speech_system, actions, cron, app, scope, registry
from talon.lib import cubeb
from .talon_io.tio_events import init_channel

ctx = cubeb.Context()
mod = Module()

dispatch_event = init_channel("talon-tray", mode="us")
state_job = None


def on_phrase(phrase):
    text = actions.user.history_transform_phrase_text(phrase.get("text"))
    if text is not None:
        dispatch_event({"type": "PHRASE_UTTERED", "phrase": text})
        if text == "drowse":
            dispatch_event({"type": "DROWSED"})


state = {"modes": set()}


def check_state(*_):
    mic = actions.sound.active_microphone()
    actions.sound.microphones()
    status = actions.speech.enabled()
    modes = scope.get("mode").difference(_default_modes)
    modes_diff = state.get("modes", set()).symmetric_difference(modes)

    if mic != state.get("mic"):
        state["mic"] = mic
        dispatch_event({"type": "MIC_SELECTED", "mic": mic})

    if status != state.get("status"):
        state["status"] = status
        event_type = "AWOKEN" if status else "DROWSED"
        dispatch_event({"type": event_type})
    if len(modes_diff) > 0:
        update_modes(modes)


mode_cron = None
_default_modes = {
    "gamepad",
    "all",
    "face",
    "noise",
    "deck",
    "hotkey",
}


def update_modes(modes):
    global mode_cron
    if mode_cron:
        cron.cancel(mode_cron)
    mode_cron = None
    state["modes"] = modes
    dispatch_event({"type": "MODES_CHANGED", "modes": list(modes)})


def on_update_contexts():
    global mode_cron
    modes = scope.get("mode").difference(_default_modes)
    modes_diff = state.get("modes", set()).symmetric_difference(modes)
    if len(modes_diff) > 0 and mode_cron == None:
        mode_cron = cron.after("50ms", lambda: update_modes(modes))


def on_ready():
    global state_job
    if state_job == None:
        state_job = cron.interval("50ms", check_state)
    ctx.register("devices_changed", check_state)
    registry.register("update_contexts", on_update_contexts)


app.register("ready", on_ready)
speech_system.register("phrase", on_phrase)
speech_system.register("post:phrase", check_state)

type NotifKind = Literal["success", "info", "alert", "warn"]


@mod.action_class
class Actions:
    def send_tray_notification(msg: str, kind: NotifKind):
        """Display Talon Tray notification"""
        dispatch_event({"type": "NOTIFIED", "kind": kind, "msg": msg})

    def select_microphone(name: str):
        """Select microphone by name"""
        actions.sound.set_microphone(name)

    def sync_talon_tray_state():
        """Synchronize talon tray state"""
        global state
        state.clear()
        check_state()
