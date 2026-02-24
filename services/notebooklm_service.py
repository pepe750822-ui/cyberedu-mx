
import os
import json
import subprocess
from supabase import create_client, Client

# Configuración de Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def run_nlm_command(cmd_args):
    """Ejecuta un comando de notebooklm-mcp-cli."""
    try:
        result = subprocess.run(
            ["nlm"] + cmd_args,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error ejecutando nlm {cmd_args}: {e.stderr}")
        return None

def fetch_content_from_notebook(notebook_id, video_id):
    """Obtiene flashcards y quizzes de un notebook específico."""
    print(f"Procesando notebook {notebook_id} para video {video_id}...")
    
    # Obtener Flashcards
    # El prompt le pide específicamente el formato JSON que queremos
    fc_prompt = "Genera 10 flashcards de estudio sobre este tema en formato JSON puro: [{\"front\": \"...\", \"back\": \"...\", \"tags\": [\"...\"], \"difficulty\": \"medium\"}]"
    fc_output = run_nlm_command(["chat", "-i", notebook_id, "-m", fc_prompt])
    
    if fc_output:
        try:
            # Intentar extraer JSON de la respuesta
            json_start = fc_output.find("[")
            json_end = fc_output.rfind("]") + 1
            flashcards = json.loads(fc_output[json_start:json_end])
            
            # Subir a Supabase
            for fc in flashcards:
                fc['video_id'] = video_id
                supabase.table("flashcards").upsert(fc).execute()
            print(f"✅ {len(flashcards)} flashcards sincronizadas.")
        except Exception as e:
            print(f"❌ Error procesando flashcards: {e}")

    # Obtener Quiz
    quiz_prompt = "Genera un quiz de 5 preguntas sobre este tema en formato JSON puro: {\"title\": \"...\", \"questions\": [{\"question\": \"...\", \"options\": [\"...\"], \"correct_index\": 0, \"explanation\": \"...\"}]}"
    quiz_output = run_nlm_command(["chat", "-i", notebook_id, "-m", quiz_prompt])
    
    if quiz_output:
        try:
            json_start = quiz_output.find("{")
            json_end = quiz_output.rfind("}") + 1
            quiz_data = json.loads(quiz_output[json_start:json_end])
            
            supabase.table("quizzes").upsert({
                "video_id": video_id,
                "title": quiz_data.get("title", "Quiz de Repaso"),
                "questions": quiz_data.get("questions", [])
            }).execute()
            print(f"✅ Quiz sincronizado para {video_id}.")
        except Exception as e:
            print(f"❌ Error procesando quiz: {e}")

def main():
    # Aquí deberías tener un mapeo de video_id -> notebook_id
    # Por ahora usaremos un ejemplo
    mappings = {
        "hv-1": "ID_DEL_NOTEBOOK_LM_AKI",
    }
    
    for v_id, n_id in mappings.items():
        fetch_content_from_notebook(n_id, v_id)

if __name__ == "__main__":
    main()
