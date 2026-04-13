import os
import re

def extract_content(html_content, tag):
    """Extracts content within a specific tag (e.g., 'style', 'body')."""
    pattern = f"<{tag}[^>]*>(.*?)</{tag}>"
    matches = re.findall(pattern, html_content, re.DOTALL | re.IGNORECASE)
    return "\n".join(matches)

def process_css(css, wrapper_class):
    """
    Scopes 'body' selectors to a specific wrapper class to prevent global style conflicts.
    """
    # Replace "body {" or "body\s*{" 
    processed = re.sub(r'body\s*\{', f'.{wrapper_class} {{', css, flags=re.IGNORECASE)
    return processed

def main():
    base_dir = r"c:\Users\pp_it\cyberedumx.com\libro"
    portada_path = os.path.join(base_dir, "portada.html")
    output_path = os.path.join(base_dir, "manual_prueba.html")

    print(f"Reading from {portada_path}")

    try:
        with open(portada_path, "r", encoding="utf-8") as f:
            portada_html = f.read()
    except FileNotFoundError as e:
        print(f"Error: Could not find file. {e}")
        return

    # Extract Portada content
    portada_css = extract_content(portada_html, "style")
    portada_css_scoped = process_css(portada_css, "portada-section")
    portada_body = extract_content(portada_html, "body")

    # Find all chapter files (capitulo_introduccion.html and capitulo_1.html, capitulo_2.html, etc.)
    # We want to order them: introduccion, then numeric chapters
    all_files = os.listdir(base_dir)
    chapter_files = [f for f in all_files if f.startswith("capitulo_") and f.endswith(".html")]
    
    # Custom sort: introduccion first, then numeric
    def sort_key(filename):
        if "introduccion" in filename:
            return 0
        match = re.search(r'capitulo_(\d+)', filename)
        if match:
            return int(match.group(1))
        return 999

    chapter_files.sort(key=sort_key)
    
    print(f"Chapters found: {chapter_files}")

    all_chapters_content = ""
    all_chapters_css = ""

    for chap_file in chapter_files:
        chap_path = os.path.join(base_dir, chap_file)
        # Unique class for scoping based on filename
        # e.g. capitulo_introduccion -> intro-section, capitulo_1 -> capitulo-1-section
        if "introduccion" in chap_file:
            wrapper_class = "intro-section"
        else:
            n = re.search(r'(\d+)', chap_file).group(1)
            wrapper_class = f"capitulo-{n}-section"

        try:
            with open(chap_path, "r", encoding="utf-8") as f:
                html = f.read()
                css = extract_content(html, "style")
                body = extract_content(html, "body")
                
                all_chapters_css += f"\n/* --- Styles for {chap_file} --- */\n"
                all_chapters_css += process_css(css, wrapper_class)
                
                # Default style for the section wrapper
                all_chapters_css += f"\n.{wrapper_class} {{ width: 100%; max-width: none; margin: 0; padding: 2cm; }}\n"

                all_chapters_content += f"""
    <!-- {chap_file} PAGE -->
    <div class="manual-page">
        <div class="{wrapper_class}">
            {body}
        </div>
    </div>
"""
        except Exception as e:
            print(f"Warning: Could not process {chap_file}: {e}")

    # Construct Master HTML
    master_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual ECOEMS 2026 - Vista Previa</title>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    
    <style>
        /* RESET & BASE */
        * {{ box-sizing: border-box; }}
        body {{ 
            margin: 0; 
            padding: 20px; 
            background: #ccc; 
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
        }}

        .manual-page {{
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            margin-bottom: 20px;
            overflow: hidden; 
            position: relative;
            width: 100%;
            max-width: 21.59cm; /* Letter Width */
            min-height: 27.94cm; /* Letter Height */
            margin-left: auto;
            margin-right: auto;
        }}

        /* --- PORTADA STYLES --- */
        {portada_css_scoped}
        .portada-section {{
            width: 100%;
            height: auto; 
            min-height: 27.94cm;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }}

        /* --- CHAPTERS STYLES --- */
        {all_chapters_css}
        
        /* Video Wrapper Responsive */
        .video-wrapper {{
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
            margin-bottom: 20px;
        }}
        .video-wrapper iframe {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }}

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 768px) {{
            body {{ padding: 10px; background: #f0f0f0; }}
            .manual-page {{ box-shadow: none; margin-bottom: 10px; min-height: auto; border-radius: 8px; }}
            .intro-section, [class*="capitulo-"] {{ padding: 1.5rem; }}
            h1 {{ font-size: 1.8rem; }}
        }}

        @media print {{
            body {{ background: white; padding: 0; display: block; }}
            .manual-page {{ 
                box-shadow: none; 
                margin: 0; 
                page-break-after: always;
                width: 100%;
                max-width: 100%;
                min-height: auto;
            }}
            .intro-section, [class*="capitulo-"] {{ padding: 0; }}
        }}
    </style>
</head>
<body>

    <!-- PORTADA PAGE -->
    <div class="manual-page">
        <div class="portada-section">
            {portada_body}
        </div>
    </div>

    {all_chapters_content}

</body>
</html>"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(master_html)

    print(f"Successfully created {output_path}")

if __name__ == "__main__":
    main()

