import csv
import os
import re

# Configuration
CSV_PATH = r"c:\Users\pp_it\cyberedumx.com\youtube-playlist-links-PLG1K4pAhMRgJRmanxPmX3AeAMpLS-sXlG-2025-12-18.csv"
OUTPUT_DIR = r"c:\Users\pp_it\cyberedumx.com\libro"
NOTEBOOKLM_URLS = {
    0: "https://notebooklm.google.com/notebook/c703574a-ebf5-4586-b1ea-bec4b944718f",
    1: "https://notebooklm.google.com/notebook/5b92f1d5-caac-41e8-a976-c411d2c6f171",
    2: "https://notebooklm.google.com/notebook/1f40c8a5-0ea0-40b6-b1d8-91cc223304e4",
    3: "https://notebooklm.google.com/notebook/081ab961-4c44-43ab-a68c-c5eadfe7980b",
    4: "https://notebooklm.google.com/notebook/ca387d8c-a743-48a9-922d-26373e948715",
    5: "https://notebooklm.google.com/notebook/e79cca86-53d6-4294-90cc-b6c4c41cf0b4",
    6: "https://notebooklm.google.com/notebook/be3c5227-90c1-4d21-b7b4-e3013cf1b3ca",
    7: "https://notebooklm.google.com/notebook/cc877779-605d-4472-8c93-6a8f9fc690a3",
    8: "https://notebooklm.google.com/notebook/6cfefedf-5339-4ae9-8798-a6b902af5559",
    9: "https://notebooklm.google.com/notebook/ef823779-3e15-4471-9b11-385ad0663a3c",
    10: "https://notebooklm.google.com/notebook/ba64e657-f1e5-4739-97be-8d543f35a565",
    11: "https://notebooklm.google.com/notebook/e726391d-fe58-4b13-b446-c6533fb18042",
    12: "https://notebooklm.google.com/notebook/7d4a39a1-f8e6-4d1d-a4c5-228934121408",
    13: "https://notebooklm.google.com/notebook/451ea89a-b294-4b2f-9376-92b821ef5817",
    14: "https://notebooklm.google.com/notebook/bf3a28c2-448a-4652-be08-61435e88a8c2",
    15: "https://notebooklm.google.com/notebook/059967f8-229b-48a2-93cf-77b733b7ecf5",
    16: "https://notebooklm.google.com/notebook/ae23c70d-857f-4435-83b8-ed960551b126",
    17: "https://notebooklm.google.com/notebook/44a5a00c-0df3-4e76-913d-91901187ec31",
    18: "https://notebooklm.google.com/notebook/720a82a4-23d3-4fe0-9261-66b02748838b",
    19: "https://notebooklm.google.com/notebook/77273295-83cf-4164-9887-750c44321201",
    20: "https://notebooklm.google.com/notebook/fc7112a2-14af-43b5-950d-9d7a080515d3",
    21: "https://notebooklm.google.com/notebook/be28d280-3531-44cb-a6c5-717dc21b2a51",
    22: "https://notebooklm.google.com/notebook/0c3109a3-4859-437b-bdb1-ea830c765c2f",
    23: "https://notebooklm.google.com/notebook/1b19afdc-aad1-4e9b-b99f-834b2bc2ab32",
    24: "https://notebooklm.google.com/notebook/9d09f7cf-bf62-40c3-b910-c533e1be4776",
    25: "https://notebooklm.google.com/notebook/ac61a2d3-8012-4dbb-b5d6-ebf9a10d1eae",
    26: "https://notebooklm.google.com/notebook/1b3ea2a2-3054-407c-a428-5d709211c5a9",
    27: "https://notebooklm.google.com/notebook/1f866752-38bf-4a3e-8875-88a4c4bd2d51",
    28: "https://notebooklm.google.com/notebook/638d67e0-93c1-46ee-9999-73abcd0f954b",
    29: "https://notebooklm.google.com/notebook/a4f90bbb-2b3b-4fcf-9ad0-aa4647e10566",
    30: "https://notebooklm.google.com/notebook/4ad04b91-d573-42a5-88a1-94e16f7b6c56",
    31: "https://notebooklm.google.com/notebook/4367e365-472a-4a10-85c6-6f0c92a774bc",
    32: "https://notebooklm.google.com/notebook/333c9fd0-b921-4e29-b918-d519f1bd3eca",
    33: "https://notebooklm.google.com/notebook/dc1e4992-fcfc-478a-b23b-f0454ce98d1c",
    34: "https://notebooklm.google.com/notebook/c2540665-9eae-4e13-a703-15b5b7110dfe",
    35: "https://notebooklm.google.com/notebook/bb0d6539-6ef6-4567-990a-58aec7eb9000",
    36: "https://notebooklm.google.com/notebook/949929df-ee15-4ebb-a5f4-d11b3320e649",
    37: "https://notebooklm.google.com/notebook/869b3111-1a39-4543-bdc6-fbc1c0eb179f",
    38: "https://notebooklm.google.com/notebook/a1d0623b-83e8-45c5-a5ef-c8224dfe68fc",
    39: "https://notebooklm.google.com/notebook/efa68be6-af0a-40bb-b6e4-e9da247e85d7",
    40: "https://notebooklm.google.com/notebook/8cd2a3d6-1e80-42a4-a879-3416468aa8af",
    41: "https://notebooklm.google.com/notebook/3b7e8105-d320-4038-8224-6a5c5aa7f656",
    42: "https://notebooklm.google.com/notebook/e3aaf0e6-4ce6-49b5-9064-ba2392a77142",
    43: "https://notebooklm.google.com/notebook/6dd560f5-02aa-451f-9c5c-9f13344f09bf",
    44: "https://notebooklm.google.com/notebook/e730c8ff-f4d0-48fb-b26a-7bc7381bf082",
    45: "https://notebooklm.google.com/notebook/1adb38ad-34cf-4351-ba6a-99a1c09a11ca",
    46: "https://notebooklm.google.com/notebook/eaae901a-9126-422c-8b6b-3c1bddc77b0a",
    47: "https://notebooklm.google.com/notebook/4f024224-ccad-4a71-90a1-c10dc0fd37dc",
    48: "https://notebooklm.google.com/notebook/0f65a5d2-3a86-410d-8868-2a6176268f8c",
    49: "https://notebooklm.google.com/notebook/c5a62c8b-a5c5-4fa6-8629-3e234d8efa95",
    50: "https://notebooklm.google.com/notebook/c8979d8c-8737-4f37-82a6-b95a6671610d",
    51: "https://notebooklm.google.com/notebook/b45f755b-30f2-48c9-8fa5-add66df5c032",
    52: "https://notebooklm.google.com/notebook/f916c0e8-4855-4c73-98b6-6358c536ad45",
    53: "https://notebooklm.google.com/notebook/e4440488-ab2d-49cf-83f8-6ef1a209a647",
    54: "https://notebooklm.google.com/notebook/5d417004-0f0f-4de0-b32e-18469e72be60",
    55: "https://notebooklm.google.com/notebook/a2309238-f375-4711-aaf5-cf0b1d87fbfe",
    56: "https://notebooklm.google.com/notebook/186439d4-fee6-4e58-ab07-83cac603b23b",
    57: "https://notebooklm.google.com/notebook/06ca3078-0d24-4d49-b1cc-2a4f53b13ebb",
    58: "https://notebooklm.google.com/notebook/a60024bc-13c4-4c1d-93c6-3fe7f7973a7b",
    59: "https://notebooklm.google.com/notebook/957df4ad-c731-4e28-b624-194891a3c6b4",
    60: "https://notebooklm.google.com/notebook/732da130-a817-40c9-b44e-2f093c9f2040",
    61: "https://notebooklm.google.com/notebook/edc2e281-8734-4498-bb53-e340de49f446",
    62: "https://notebooklm.google.com/notebook/b0735818-4e26-48c3-8229-dd4a040bcc58",
    63: "https://notebooklm.google.com/notebook/936925cd-a444-424c-8f46-6c2c229d2015",
    64: "https://notebooklm.google.com/notebook/3f5a87ec-1224-4074-99f1-48aa8f457d90",
    65: "https://notebooklm.google.com/notebook/7e93fe0a-e276-4988-b4e6-cfb636f2d8c5",
    66: "https://notebooklm.google.com/notebook/a2b36dc8-8dff-45ec-bc01-91aa912f6c76",
    67: "https://notebooklm.google.com/notebook/570a3762-10b4-46f9-8195-db51d3fb1dfa",
    68: "https://notebooklm.google.com/notebook/e7b7ecf4-a7fb-4be1-8daf-79fb9e61c14b",
    69: "https://notebooklm.google.com/notebook/97b5e050-e817-4e5e-8109-20437d928b06?authuser=2",
    70: "https://notebooklm.google.com/notebook/e62bb360-3aa6-4d9b-ba3a-137823a1d244",
    71: "https://notebooklm.google.com/notebook/a9e8e17f-1de3-4d6c-81b6-bb114e0f9aae?authuser=1",
    72: "https://notebooklm.google.com/notebook/8a8e756a-528a-4aa0-b961-868c83c4b4e1?authuser=2",
    73: "https://notebooklm.google.com/notebook/06445714-fd9c-492d-9414-f481edfd77a8?authuser=2",
    74: "https://notebooklm.google.com/notebook/06445714-fd9c-492d-9414-f481edfd77a8?authuser=2",
    75: "https://notebooklm.google.com/notebook/3c581b0e-3fe4-45d5-bb5d-5a8a53c31559?authuser=2",
    76: "https://notebooklm.google.com/notebook/1213542f-637e-4f51-b6a5-c21446451c8e?authuser=2",
    77: "https://notebooklm.google.com/notebook/d881ad4a-f11d-42fd-afad-522aeaaa9d37?authuser=2",
    78: "https://notebooklm.google.com/notebook/6c664da7-ad86-4efc-bfd4-82b00aa7d613?authuser=2",
    79: "https://notebooklm.google.com/notebook/0878e14e-a74e-416b-9c03-bc29cf6f501a?authuser=2",
    80: "https://notebooklm.google.com/notebook/651b863e-008b-40d1-ba8e-7e24e3da51b2?authuser=2",
    81: "https://notebooklm.google.com/notebook/d9c2f83e-d4db-499b-8cac-82d2d1d79a20?authuser=2",
    82: "https://notebooklm.google.com/notebook/84bbb065-5fa2-4130-b1f8-d90f45923045?authuser=2",
    83: "https://notebooklm.google.com/notebook/90120fc0-25b0-4859-83d1-bb7cca619f4e?authuser=2",
    84: "https://notebooklm.google.com/notebook/17c9b85b-a7ce-4986-b86f-2959be589706?authuser=2",
    85: "https://notebooklm.google.com/notebook/deca7128-9d46-4abf-9570-f08ef4f89244?authuser=2",
    86: "https://notebooklm.google.com/notebook/5d832abe-407e-43e9-9f60-c4d9a08b2483?authuser=2",
    87: "https://notebooklm.google.com/notebook/373ae22b-35f0-4234-b0d8-bf77f072312e?authuser=2",
    88: "https://notebooklm.google.com/notebook/c157bddd-48d6-403e-b64c-d8b4ecfa4735?authuser=2",
    89: "https://notebooklm.google.com/notebook/49423274-2ae1-4c7b-9f6d-be236728e224?authuser=2",
    90: "https://notebooklm.google.com/notebook/94e8963d-4d80-4564-8c9a-1b13717371ba?authuser=2"
}

CHAPTERS = [
    {"id": 0, "title": "Capítulo 0: Introducción - Estrategia Inteligente", "range": (0, 0), "intro": "¡Bienvenido a Estrategia Inteligente ECOEMS 2026! Este curso ha sido diseñado específicamente para ayudarte a dominar el examen de ingreso a la educación media superior."},
    {"id": 1, "title": "Capítulo 1: Habilidad Verbal", "range": (1, 5), "intro": "¡Bienvenido al primer nivel de tu entrenamiento! En este capítulo dominaremos el arte de la Habilidad Verbal."},
    {"id": 2, "title": "Capítulo 2: Habilidad Matemática", "range": (6, 10), "intro": "¡Nivel 2 desbloqueado! Es hora de potenciar tu lógica y razonamiento matemático."},
    {"id": 3, "title": "Capítulo 3: Biología", "range": (11, 17), "intro": "Explora los misterios de la vida y la naturaleza. ¡Ciencia aplicada al máximo!"},
    {"id": 4, "title": "Capítulo 4: Física", "range": (18, 24), "intro": "Domina las leyes que rigen el universo. Fuerza, energía y movimiento en tus manos."},
    {"id": 5, "title": "Capítulo 5: Química", "range": (25, 30), "intro": "Entra al laboratorio y descubre la composición del mundo que nos rodea."},
    {"id": 6, "title": "Capítulo 6: Matemáticas", "range": (31, 44), "intro": "El lenguaje universal. Álgebra, geometría y estadística para ganar."},
    {"id": 7, "title": "Capítulo 7: Historia", "range": (45, 58), "intro": "Viaja por el tiempo y comprende el pasado para forjar un futuro brillante."},
    {"id": 8, "title": "Capítulo 8: Español", "range": (59, 68), "intro": "Domina tu lengua. Reglas, ortografía y redacción nivel experto."},
    {"id": 9, "title": "Capítulo 9: Formación Cívica", "range": (69, 76), "intro": "Conoce tus derechos, deberes y cómo ser un ciudadano ejemplar."},
    {"id": 10, "title": "Capítulo 10: Geografía", "range": (77, 86), "intro": "Un viaje por el planeta. Paisajes, recursos y sociedad global."},
    {"id": 11, "title": "Capítulo 11: Repaso Final", "range": (87, 90), "intro": "¡La batalla final! Repasa los puntos clave y prepárate para la victoria total."},
]

def load_video_data():
    videos = {}
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        # The file starts with #,title... so the '#' is the column name for the index.
        # No need to skip the first line.
        reader = csv.DictReader(f)
        for row in reader:
            try:
                # The CSV uses # for the first column (1-indexed id) and position for 0-indexed pos
                pos = int(row['position'])
                title = row['title'].replace('**', '').strip()
                # Remove VIDEO X: part if present to clean up
                title = re.sub(r'VIDEO \d+:\s*', '', title, flags=re.IGNORECASE)
                videos[pos] = {
                    "title": title,
                    "videoId": row['videoId'],
                    "url": row['videoUrl']
                }
            except KeyError as e:
                # Key error might happen if the line isn't formatted correctly
                continue
            except Exception:
                continue
    return videos

def clean_title(title):
    # Remove emojis and markdown bolding
    title = re.sub(r'[^\w\s\(\)\-\:\.,!]', '', title)
    return title.strip()

def generate_video_block(idx, video):
    nl_url = NOTEBOOKLM_URLS.get(idx, "#")
    return f'''
        <!-- VIDEO {idx} -->
        <div class="video-block">
            <div class="video-title">
                <i class="fas fa-play-circle"></i>
                {idx}. {video['title']}
            </div>
            <div class="video-desc">
                Recursos multimedia y material de estudio para esta lección.
            </div>

            <!-- Web Player -->
            <div class="video-wrapper">
                <iframe src="https://www.youtube.com/embed/{video['videoId']}" title="Video {idx}" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>

            <!-- ASSETS SECTION -->
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="margin-top:0; font-weight:bold; color:#2c3e50;"><i class="fas fa-box-open"></i> Recursos de la Misión:</p>

                <div style="display: flex; flex-wrap: wrap; gap: 15px; align-items: start; justify-content: space-between;">
                    <!-- Graphic -->
                    <div style="flex: 1; min-width: 250px; text-align: center;">
                        <img src="../ecoems2026/videos/video{idx}/infografia.png" alt="Infografía Video {idx}"
                            style="max-width: 100%; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor: pointer;"
                            onclick="openLightbox(this.src)">
                        <p style="font-size: 0.9em; color: #777;">Infografía Resumen</p>
                    </div>

                    <!-- Audio -->
                    <div style="flex: 1; min-width: 250px;">
                        <audio controls style="width: 100%; margin-bottom: 10px;">
                            <source src="../ecoems2026/videos/video{idx}/podcast.mp3" type="audio/mpeg">
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                        <div style="font-size: 0.8em; color: #666; text-align: center;"><i class="fas fa-headphones"></i> Podcast / Audio de Repaso</div>
                    </div>
                </div>

                <!-- PDF Embed -->
                <div style="margin-top: 20px;">
                    <p style="font-weight: bold; font-size: 0.9em; color: #e74c3c; margin-bottom: 5px;"><i class="fas fa-file-pdf"></i> Material de Estudio (PDF):</p>
                    <object data="../ecoems2026/videos/video{idx}/presentacion.pdf" type="application/pdf" width="100%" height="400px" style="border: 1px solid #ddd; border-radius: 5px;">
                        <p>Tu navegador no puede mostrar este PDF. <a href="../ecoems2026/videos/video{idx}/presentacion.pdf">Descárgalo aquí</a>.</p>
                    </object>
                </div>
            </div>

            <!-- NotebookLM Link -->
            <div style="text-align: right; margin-top: 15px;">
                <a href="{nl_url}" target="_blank" class="notebooklm-btn">
                    <i class="fas fa-robot"></i> Estudiar con NotebookLM
                </a>
            </div>

            <!-- Print QR -->
            <div class="print-only-qr">
                <strong>Ver Video {idx}:</strong><br>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={video['url']}" alt="QR Video {idx}" width="100">
            </div>
        </div>
    '''

TEMPLATE_HEAD = '''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - ECOEMS 2026</title>
    <meta name="description" content="Manual Estratégico ECOEMS 2026. {{title}}. Recursos multimedia y material de estudio.">
    <meta name="keywords" content="ECOEMS 2026, Manual Estratégico, BioReto Academy, CyberEdu MX, Guía de Estudio">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {{ --bg-color: #f4f7f6; --text-color: #333; --card-bg: white; --nav-bg: #2c3e50; }}
        .dark-mode {{ --bg-color: #0f172a; --text-color: #e2e8f0; --card-bg: #1e293b; --nav-bg: #1e293b; }}

        body {{ margin: 0; padding: 0; background: var(--bg-color); color: var(--text-color); transition: background 0.3s, color 0.3s; }}
        .nav-bar {{ position: sticky; top: 0; background: var(--nav-bg); color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.2); font-family: 'Montserrat', sans-serif; }}
        .nav-links {{ display: flex; gap: 15px; align-items: center; }}
        .nav-btn {{ color: white; text-decoration: none; padding: 8px 15px; border-radius: 5px; background: rgba(255,255,255,0.1); transition: all 0.3s; font-size: 0.9em; display: flex; align-items: center; gap: 8px; }}
        .nav-btn:hover {{ background: #4ECDC4; color: #2c3e50; }}
        .nav-btn.disabled {{ opacity: 0.3; pointer-events: none; }}
        
        .theme-toggle {{ cursor: pointer; padding: 8px; border-radius: 50%; background: rgba(255,255,255,0.1); transition: background 0.3s; }}
        .theme-toggle:hover {{ background: rgba(255,255,255,0.2); }}

        .capitulo-section {{ font-family: 'Lora', serif; max-width: 21cm; margin: 40px auto; padding: 2cm; background: var(--card-bg); box-shadow: 0 0 20px rgba(0,0,0,0.1); border-radius: 8px; color: var(--text-color); }}
        .capitulo-section h1 {{ font-family: 'Montserrat', sans-serif; color: #4ECDC4; font-size: 24pt; border-bottom: 3px solid #4ECDC4; padding-bottom: 10px; margin-bottom: 30px; }}
        .chap-intro {{ font-size: 12pt; margin-bottom: 40px; text-align: justify; }}
        .video-block {{ margin-bottom: 50px; border-bottom: 1px solid #eee; padding-bottom: 30px; page-break-inside: avoid; }}
        .video-block:last-child {{ border-bottom: none; }}
        .video-title {{ font-family: 'Montserrat', sans-serif; font-size: 14pt; font-weight: 700; color: #4ECDC4; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }}
        .video-desc {{ font-style: italic; color: #666; margin-bottom: 15px; font-size: 11pt; }}
        .video-wrapper {{ position: relative; padding-bottom: 56.25%; height: 0; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); }}
        .video-wrapper iframe {{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; }}
        .notebooklm-btn {{ display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #4ECDC4, #2c3e50); color: white; text-decoration: none; padding: 10px 20px; border-radius: 25px; font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 10pt; transition: transform 0.2s, box-shadow 0.2s; }}
        .notebooklm-btn:hover {{ transform: translateY(-2px); box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4); }}
        .print-only-qr {{ display: none; text-align: center; margin-top: 10px; padding: 10px; background: #f9f9f9; border: 1px dashed #ccc; }}
        
        .fab-contact {{ position: fixed; bottom: 20px; right: 20px; z-index: 1000; }}
        .fab-btn {{ width: 50px; height: 50px; border-radius: 50%; background: #4ECDC4; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.3s; }}
        .fab-btn:hover {{ transform: rotate(15deg) scale(1.1); }}
        .fab-menu {{ display: none; margin-bottom: 10px; flex-direction: column; gap: 10px; }}
        .fab-menu a {{ width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; font-size: 18px; }}

        @media print {{ .nav-bar {{ display: none; }} .video-wrapper, .notebooklm-btn, .fab-contact {{ display: none; }} .print-only-qr {{ display: block; }} .capitulo-section {{ padding: 0; width: 100%; box-shadow: none; margin: 0; }} }}
    </style>
</head>
<body>
    <div class="nav-bar">
        <div class="nav-links">
            <a href="dashboard.html" class="nav-btn"><i class="fas fa-th"></i> Portal Estratégico</a>
            <div class="theme-toggle" onclick="toggleTheme()"><i id="theme-icon" class="fas fa-moon"></i></div>
        </div>
        <div class="nav-links">
            <a href="{prev_link}" class="nav-btn {{prev_disabled}}"><i class="fas fa-chevron-left"></i> Anterior</a>
            <a href="{next_link}" class="nav-btn {{next_disabled}}">Siguiente <i class="fas fa-chevron-right"></i></a>
        </div>
    </div>
    <div class="capitulo-section" id="cap-{id}">
        <h1>{title}</h1>
        <div class="chap-intro">
            <p>{intro}</p>
        </div>
'''

TEMPLATE_FOOT = '''
    </div>
    <!-- Footer Nav -->
    <div style="max-width: 21cm; margin: 20px auto 30px; display: flex; justify-content: space-between; font-family: 'Montserrat', sans-serif;">
        <a href="{prev_link}" style="text-decoration:none; color:#4ECDC4; font-weight:bold;" class="{prev_disabled}">
            <i class="fas fa-arrow-left"></i> Capítulo Anterior
        </a>
        <a href="dashboard.html" style="text-decoration:none; color:#4ECDC4; font-weight:bold;">
            <i class="fas fa-th"></i> Portal Estratégico
        </a>
        <a href="{next_link}" style="text-decoration:none; color:#4ECDC4; font-weight:bold;" class="{next_disabled}">
            Capítulo Siguiente <i class="fas fa-arrow-right"></i>
        </a>
    </div>

    <!-- Ecosystem Links -->
    <div style="max-width: 21cm; margin: 0 auto 100px; text-align: center; font-family: 'Montserrat', sans-serif; color: #777; font-size: 0.9em;">
        <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;">
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <a href="https://cyberedumx.com" target="_blank" style="color: inherit; text-decoration: none;">cyberedumx.com</a>
            <a href="../ecoems2026.php" style="color: inherit; text-decoration: none;">Plataforma ECOEMS</a>
            <a href="https://www.udemy.com/course/ecoems2026conia/" target="_blank" style="color: inherit; text-decoration: none;">Curso Udemy</a>
        </div>
    </div>

    <!-- Floating Action Button (Contact) -->
    <div class="fab-contact">
        <div id="fab-menu" class="fab-menu">
            <a href="https://wa.me/525523269241" target="_blank" style="background:#25D366;"><i class="fab fa-whatsapp"></i></a>
            <a href="mailto:JoseLuisGlez@cyberedumx.com" style="background:#0078D4;"><i class="fas fa-envelope"></i></a>
        </div>
        <div class="fab-btn" onclick="toggleFAB()"><i class="fas fa-headset"></i></div>
    </div>

    <script>
        function toggleTheme() {{
            const body = document.body;
            const icon = document.getElementById('theme-icon');
            if (body.classList.contains('dark-mode')) {{
                body.classList.remove('dark-mode');
                localStorage.theme = 'light';
                icon.classList.replace('fa-sun', 'fa-moon');
            }} else {{
                body.classList.add('dark-mode');
                localStorage.theme = 'dark';
                icon.classList.replace('fa-moon', 'fa-sun');
            }}
        }}

        function toggleFAB() {{
            const menu = document.getElementById('fab-menu');
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        }}

        // Initialize Theme
        if (localStorage.theme === 'dark') {{
            document.body.classList.add('dark-mode');
            const icon = document.getElementById('theme-icon');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        }}
    </script>
</body>
</html>
'''

def main():
    video_data = load_video_data()
    
    for i, cap in enumerate(CHAPTERS):
        filename = f"capitulo_{cap['id']}.html" if cap['id'] > 0 else "capitulo_introduccion.html"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Calculate nav links
        prev_cap = CHAPTERS[i-1] if i > 0 else None
        next_cap = CHAPTERS[i+1] if i < len(CHAPTERS) - 1 else None
        
        prev_link = (f"capitulo_{prev_cap['id']}.html" if prev_cap['id'] > 0 else "capitulo_introduccion.html") if prev_cap else "#"
        next_link = (f"capitulo_{next_cap['id']}.html" if next_cap['id'] > 0 else "capitulo_introduccion.html") if next_cap else "#"
        
        prev_disabled = "disabled" if not prev_cap else ""
        next_disabled = "disabled" if not next_cap else ""

        print(f"Generating {filename}...")
        
        content = TEMPLATE_HEAD.format(
            id=cap['id'], 
            title=cap['title'], 
            intro=cap['intro'],
            prev_link=prev_link,
            next_link=next_link,
            prev_disabled=prev_disabled,
            next_disabled=next_disabled
        )
        
        start_v, end_v = cap['range']
        for v_idx in range(start_v, end_v + 1):
            if v_idx in video_data:
                content += generate_video_block(v_idx, video_data[v_idx])
        
        content += TEMPLATE_FOOT.format(
            prev_link=prev_link,
            next_link=next_link,
            prev_disabled=prev_disabled,
            next_disabled=next_disabled
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == "__main__":
    main()
