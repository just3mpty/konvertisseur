// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image::ImageFormat;
use image::ImageReader;
use std::fs;
use std::path::PathBuf;
use tauri::Emitter;
use tauri::Window;
use webp::{Encoder, WebPMemory};

#[tauri::command]
async fn convert_images(
    window: Window,
    source_folder: String,
    destination_folder: String,
    format: String,
    quality: Option<u8>,
) -> Result<(), String> {
    fs::create_dir_all(&destination_folder)
        .map_err(|e| format!("Erreur création dossier destination : {}", e))?;

    let output_format = match format.to_lowercase().as_str() {
        "jpeg" | "jpg" => ImageFormat::Jpeg,
        "png" => ImageFormat::Png,
        "webp" => ImageFormat::WebP,
        "bmp" => ImageFormat::Bmp,
        "tiff" => ImageFormat::Tiff,
        other => return Err(format!("Format non supporté : {}", other)),
    };

    let entries = fs::read_dir(&source_folder)
        .map_err(|e| format!("Erreur lecture dossier source: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Erreur lecture fichier: {}", e))?;
        let path = entry.path();

        if path.is_file() {
            if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
                if ext.to_lowercase() == "svg" {
                    let log = format!(
                        "⚠️ Format `.svg` non supporté : on passe au suivant ({})",
                        path.display()
                    );
                    window.emit("log", log).unwrap();
                    continue;
                }

                let file_name = path.file_name().unwrap().to_string_lossy().to_string();
                window
                    .emit("log", format!("🕐 Conversion de {} ...", file_name))
                    .unwrap();

                let img_result = ImageReader::open(&path)
                    .map_err(|e| format!("Erreur ouverture image {}: {}", file_name, e))?
                    .decode();

                let img = match img_result {
                    Ok(decoded) => decoded,
                    Err(err) => {
                        window
                            .emit(
                                "log",
                                format!("❌ Erreur décodage image {}: {}", file_name, err),
                            )
                            .unwrap();
                        continue;
                    }
                };

                let mut new_path = PathBuf::from(&destination_folder);
                new_path.push(format!(
                    "{}.{}",
                    path.file_stem().unwrap().to_string_lossy(),
                    format
                ));

                // Sauvegarde avec qualité si spécifiée
                match (output_format, quality) {
                    (ImageFormat::Jpeg, Some(q)) => {
                        let mut jpeg_encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(
                            std::fs::File::create(&new_path).map_err(|e| {
                                format!("Erreur création fichier {}: {}", file_name, e)
                            })?,
                            q,
                        );
                        jpeg_encoder
                            .encode(
                                &img.to_rgb8(),
                                img.width(),
                                img.height(),
                                image::ExtendedColorType::Rgb8,
                            )
                            .map_err(|e| format!("Erreur sauvegarde JPEG {}: {}", file_name, e))?;
                    }
                    (ImageFormat::WebP, Some(q)) => {
                        // WebP avec qualité personnalisée
                        let rgb_img = img.to_rgb8();
                        let encoder =
                            Encoder::from_rgb(&rgb_img, rgb_img.width(), rgb_img.height());
                        let encoded_webp: WebPMemory = encoder.encode(q as f32);

                        std::fs::write(&new_path, &*encoded_webp)
                            .map_err(|e| format!("Erreur sauvegarde WebP {}: {}", file_name, e))?;
                    }
                    _ => {
                        img.save_with_format(&new_path, output_format)
                            .map_err(|e| format!("Erreur sauvegarde image {}: {}", file_name, e))?;
                    }
                }

                window
                    .emit("log", format!("✅ Conversion terminée pour {}", file_name))
                    .unwrap();
            } else {
                window
                    .emit(
                        "log",
                        format!("❌ Fichier sans extension détecté : {}", path.display()),
                    )
                    .unwrap();
            }
        }
    }

    window.emit("log", "✅ Conversion terminée !").unwrap();
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![convert_images])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
