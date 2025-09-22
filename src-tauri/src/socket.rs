use std::io::{BufRead, BufReader};
use std::os::unix::net::{UnixListener, UnixStream};
use std::thread;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn start_socket_server(app: &AppHandle) {
    std::fs::remove_file("/tmp/talon-tray.sock").unwrap_or_default();
    let listener = UnixListener::bind("/tmp/talon-tray.sock").unwrap();
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                thread::scope(|s| {
                    s.spawn(move || {
                        handle_client(&app, stream);
                    });
                });
            }
            Err(err) => {
                println!("Error: {}", err);
                break;
            }
        }
    }
    std::fs::remove_file("/tmp/talon-tray.sock").unwrap_or_default();
}

fn handle_client(app: &AppHandle, stream: UnixStream) {
    let stream = BufReader::new(stream);
    for line in stream.lines() {
        match line {
            Ok(line) => {
                app.emit("talon-event", line).unwrap();
            }
            Err(err) => {
                println!("Error: {}", err);
                break;
            }
        }
    }
}
