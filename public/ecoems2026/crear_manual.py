
import os
import re
from pypdf import PdfWriter, PdfReader

def sorted_nicely(l): 
    """ Sort the given iterable in the way that humans expect.""" 
    convert = lambda text: int(text) if text.isdigit() else text 
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ] 
    return sorted(l, key = alphanum_key)

def crear_manual():
    base_dir = "videos"
    output_filename = "Manual_Completo_ECOEMS_2026.pdf"
    
    writer = PdfWriter()
    
    # Encontrar todas las carpetas video0, video1, etc.
    if not os.path.exists(base_dir):
        print(f"Error: No se encuentra la carpeta {base_dir}")
        return

    folders = [f for f in os.listdir(base_dir) if f.startswith('video') and os.path.isdir(os.path.join(base_dir, f))]
    folders = sorted_nicely(folders)
    
    print(f"Se encontraron {len(folders)} carpetas de video.")
    
    page_count = 0
    
    for folder in folders:
        pdf_path = os.path.join(base_dir, folder, "presentacion.pdf")
        
        if os.path.exists(pdf_path):
            try:
                reader = PdfReader(pdf_path)
                num_pages = len(reader.pages)
                
                # Agregar páginas al escritor
                for page in reader.pages:
                    writer.add_page(page)
                
                # Crear bookmark para este capítulo
                # Extraer el número del video para el título
                video_num = folder.replace('video', '')
                writer.add_outline_item(f"Lección {video_num}", page_count)
                
                print(f"Agregado: {folder} ({num_pages} páginas)")
                page_count += num_pages
                
            except Exception as e:
                print(f"Error procesando {folder}: {e}")
        else:
            print(f"Advertencia: No se encontró PDF en {folder}")

    if page_count > 0:
        print(f"\nGuardando manual completo con {page_count} páginas...")
        with open(output_filename, "wb") as f:
            writer.write(f)
        print(f"¡Éxito! Archivo guardado como: {output_filename}")
    else:
        print("No se encontraron páginas para agregar.")

if __name__ == "__main__":
    crear_manual()
