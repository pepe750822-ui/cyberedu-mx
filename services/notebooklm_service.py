
import os
import json
import subprocess
import httpx
import time

# Configuración
NLM_PATH = r"C:\Users\pp_it\AppData\Local\Python\pythoncore-3.14-64\Scripts\nlm"
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos.")
    exit(1)

def run_nlm_command(cmd_args):
    """Ejecuta un comando de notebooklm-mcp-cli usando la ruta absoluta."""
    try:
        # Usamos la ruta completa a nlm
        result = subprocess.run(
            [NLM_PATH] + cmd_args,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error ejecutando nlm {cmd_args}: {e.stderr}")
        return None

def upsert_supabase(table, data):
    """Realiza un upsert en Supabase usando httpx."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    with httpx.Client() as client:
        try:
            response = client.post(url, json=data, headers=headers)
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"❌ Error Supabase ({table}): {e}")
            return False

def fetch_content_from_notebook(notebook_id, video_id):
    """Obtiene flashcards y quizzes de un notebook específico."""
    print(f"--- Procesando: {video_id} ---")
    
    # 1. Obtener Flashcards
    fc_prompt = "Genera 10 flashcards de estudio sobre este tema en formato JSON puro (solo el array): [{\"front\": \"...\", \"back\": \"...\", \"tags\": [\"...\"], \"difficulty\": \"medium\"}]"
    print(f"Solicitando Flashcards a la IA...")
    fc_output = run_nlm_command(["chat", "-i", notebook_id, "-m", fc_prompt])
    
    if fc_output:
        try:
            json_start = fc_output.find("[")
            json_end = fc_output.rfind("]") + 1
            flashcards = json.loads(fc_output[json_start:json_end])
            
            for fc in flashcards:
                fc['video_id'] = video_id
                upsert_supabase("flashcards", fc)
            print(f"✅ {len(flashcards)} flashcards sincronizadas.")
        except Exception as e:
            print(f"❌ Error procesando flashcards: {e}")

    # 2. Obtener Quiz
    quiz_prompt = "Genera un quiz de 5 preguntas sobre este tema en formato JSON puro: {\"title\": \"...\", \"questions\": [{\"question\": \"...\", \"options\": [\"...\"], \"correct_index\": 0, \"explanation\": \"...\"}]}"
    print(f"Solicitando Quiz a la IA...")
    quiz_output = run_nlm_command(["chat", "-i", notebook_id, "-m", quiz_prompt])
    
    if quiz_output:
        try:
            json_start = quiz_output.find("{")
            json_end = quiz_output.rfind("}") + 1
            quiz_data = json.loads(quiz_output[json_start:json_end])
            
            payload = {
                "video_id": video_id,
                "title": quiz_data.get("title", "Quiz de Repaso"),
                "questions": quiz_data.get("questions", [])
            }
            upsert_supabase("quizzes", payload)
            print(f"✅ Quiz sincronizado.")
        except Exception as e:
            print(f"❌ Error procesando quiz: {e}")

def main():
    mappings = {
        # HABILIDAD VERBAL
        "hv-1": "5b92f1d5-caac-41e8-a976-c411d2c6f171",
        "hv-2": "1f40c8a5-0ea0-40b6-b1d8-91cc223304e4",
        "hv-3": "081ab961-4c44-43ab-a68c-c5eadfe7980b",
        "hv-4": "ca387d8c-a743-48a9-922d-26373e948715",
        "hv-5": "e79cca86-53d6-4294-90cc-b6c4c41cf0b4",
        # ... el resto de mappings están en GitHub
    }
    
    # Por ahora probamos solo con el primero para no saturar
    test_id = "hv-1"
    fetch_content_from_notebook(mappings[test_id], test_id)

if __name__ == "__main__":
    main()

if __name__ == "__main__":
    main()
