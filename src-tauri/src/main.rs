// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[allow(unused_imports)]
use tauri::{window::WindowBuilder, WindowUrl};

fn main() {
  let _port = 13131;
  tauri::Builder::default()
  // .plugin(tauri_plugin_localhost::Builder::new(_port).build())
  // .setup(move |app| {
  //   WindowBuilder::new(
  //     app,
  //     "main".to_string(),
  //     WindowUrl::External(format!("http://localhost:{}", _port).parse().unwrap()),
  //   )
  //   .title("Localhost QuillChat")
  //   .build()?;
  //   Ok(())
  // })
  .run(tauri::generate_context!())
  .expect("error while running tauri application");
}
