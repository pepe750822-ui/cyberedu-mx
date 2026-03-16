
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
        # HABILIDAD MATEMÁTICA
        "hm-1": "be3c5227-90c1-4d21-b7b4-e3013cf1b3ca",
        "hm-2": "cc877779-605d-4472-8c93-6a8f9fc690a3",
        "hm-3": "6cfefedf-5339-4ae9-8798-a6b902af5559",
        "hm-4": "ef823779-3e15-4471-9b11-385ad0663a3c",
        "hm-5": "ba64e657-f1e5-4739-97be-8d543f35a565",
        # BIOLOGÍA
        "bio-1": "e726391d-fe58-4b13-b446-c6533fb18042",
        "bio-2": "7d4a39a1-f8e6-4d1d-a4c5-228934121408",
        "bio-3": "451ea89a-b294-4b2f-9376-92b821ef5817",
        "bio-4": "bf3a28c2-448a-4652-be08-61435e88a8c2",
        "bio-5": "059967f8-229b-48a2-93cf-77b733b7ecf5",
        "bio-6": "ae23c70d-857f-4435-83b8-ed960551b126",
        "bio-7": "44a5a00c-0df3-4e76-913d-91901187ec31",
        # FÍSICA
        "fis-1": "720a82a4-23d3-4fe0-9261-66b02748838b",
        "fis-2": "77273295-83cf-4164-9887-750c44321201",
        "fis-3": "fc7112a2-14af-43b5-950d-9d7a080515d3",
        "fis-4": "be28d280-3531-44cb-a6c5-717dc21b2a51",
        "fis-5": "0c3109a3-4859-437b-bdb1-ea830c765c2f",
        "fis-6": "1b19afdc-aad1-4e9b-b99f-834b2bc2ab32",
        "fis-7": "9d09f7cf-bf62-40c3-b910-c533e1be4776",
        # QUÍMICA
        "qui-1": "ac61a2d3-8012-4dbb-b5d6-ebf9a10d1eae",
        "qui-2": "1b3ea2a2-3054-407c-a428-5d709211c5a9",
        "qui-3": "1f866752-38bf-4a3e-8875-88a4c4bd2d51",
        "qui-4": "638d67e0-93c1-46ee-9999-73abcd0f954b",
        "qui-5": "a4f90bbb-2b3b-4fcf-9ad0-aa4647e10566",
        "qui-6": "4ad04b91-d573-42a5-88a1-94e16f7b6c56",
        # MATEMÁTICAS
        "mat-1": "4367e365-472a-4a10-85c6-6f0c92a774bc",
        "mat-2": "333c9fd0-b921-4e29-b918-d519f1bd3eca",
        "mat-3": "dc1e4992-fcfc-478a-b23b-f0454ce98d1c",
        "mat-4": "c2540665-9eae-4e13-a703-15b5b7110dfe",
        "mat-5": "bb0d6539-6ef6-4567-990a-58aec7eb9000",
        "mat-6": "949929df-ee15-4ebb-a5f4-d11b3320e649",
        "mat-7": "869b3111-1a39-4543-bdc6-fbc1c0eb179f",
        "mat-8": "a1d0623b-83e8-45c5-a5ef-c8224dfe68fc",
        "mat-9": "efa68be6-af0a-40bb-b6e4-e9da247e85d7",
        "mat-10": "8cd2a3d6-1e80-42a4-a879-3416468aa8af",
        "mat-11": "3b7e8105-d320-4038-8224-6a5c5aa7f656",
        "mat-12": "e3aaf0e6-4ce6-49b5-9064-ba2392a77146",
        "mat-13": "6dd560f5-02aa-451f-9c5c-9f13344f09bf",
        "mat-14": "e730c8ff-f4d0-48fb-b26a-7bc7381bf082",
        # HISTORIA UNIVERSAL
        "hu-1": "1adb38ad-34cf-4351-ba6a-99a1c09a11ca",
        "hu-2": "eaae901a-9126-422c-8b6b-3c1bddc77b0a",
        "hu-3": "4f024224-ccad-4a71-90a1-c10dc0fd37dc",
        "hu-4": "0f65a5d2-3a86-410d-8868-2a6176268f8c",
        "hu-5": "c5a62c8b-a5c5-4fa6-8629-3e234d8efa95",
        "hu-6": "c8979d8c-8737-4f37-82a6-b95a6671610d",
        "hu-7": "b45f755b-30f2-48c9-8fa5-add66df5c032",
        # HISTORIA DE MÉXICO
        "hm-mx-1": "f916c0e8-4855-4c73-98b6-6358c536ad45",
        "hm-mx-2": "e4440488-ab2d-49cf-83f8-6ef1a209a647",
        "hm-mx-3": "5d417004-0f0f-4de0-b32e-18469e72be60",
        "hm-mx-4": "a2309238-f375-4711-aaf5-cf0b1d87fbfe",
        "hm-mx-5": "186439d4-fee6-4e58-ab07-83cac603b23b",
        "hm-mx-6": "06ca3078-0d24-4d49-b1cc-2a4f53b13ebb",
        "hm-mx-7": "a60024bc-13c4-4c1d-93c6-3fe7f7973a7b",
        # ESPAÑOL
        "esp-1": "957df4ad-c731-4e28-b624-194891a3c6b4",
        "esp-2": "732da130-a817-40c9-b44e-2f093c9f2040",
        "esp-3": "edc2e281-8734-4498-bb53-e340de49f446",
        "esp-4": "b0735818-4e26-48c3-8229-dd4a040bcc58",
        "esp-5": "936925cd-a444-424c-8f46-6c2c229d2015",
        "esp-6": "3f5a87ec-1224-4074-99f1-48aa8f457d90",
        "esp-7": "7e93fe0a-e276-4988-b4e6-cfb636f2d8c5",
        "esp-8": "a2b36dc8-8dff-45ec-bc01-91aa912f6c76",
        "esp-9": "570a3762-10b4-46f9-8195-db51d3fb1dfa",
        "esp-10": "e7b7ecf4-a7fb-4be1-8daf-79fb9e61c14b",
        # FCE
        "fce-1": "97b5e050-e817-4e5e-8109-20437d928b06",
        "fce-2": "e62bb360-3aa6-4d9b-ba3a-137823a1d244",
        "fce-3": "a9e8e17f-1de3-4d6c-81b6-bb114e0f9aae",
        "fce-4": "8a8e756a-528a-4aa0-b961-868c83c4b4e1",
        "fce-5": "06445714-fd9c-492d-9414-f481edfd77a8",
        "fce-6": "06445714-fd9c-492d-9414-f481edfd77a8",
        "fce-7": "3c581b0e-3fe4-45d5-bb5d-5a8a53c31559",
        "fce-8": "1213542f-637e-4f51-b6a5-c21446451c8e",
        # GEOGRAFÍA
        "geo-1": "d881ad4a-f11d-42fd-afad-522aeaaa9d37",
        "geo-2": "6c664da7-ad86-4efc-bfd4-82b00aa7d613",
        "geo-3": "0878e14e-a74e-416b-9c03-bc29cf6f501a",
        "geo-4": "651b863e-008b-40d1-ba8e-7e24e3da51b2",
        "geo-5": "d9c2f83e-d4db-499b-8cac-82d2d1d79a20",
        "geo-6": "84bbb065-5fa2-4130-b1f8-d90f45923045",
        "geo-7": "90120fc0-25b0-4859-83d1-bb7cca619f4e",
        "geo-8": "17c9b85b-a7ce-4986-b86f-2959be589706",
        "geo-9": "deca7128-9d46-4abf-9570-f08ef4f89244",
        "geo-10": "5d832abe-407e-43e9-9f60-c4d9a08b2483",
        # REPASO
        "rep-1": "373ae22b-35f0-4234-b0d8-bf77f072312e",
        "rep-2": "c157bddd-48d6-403e-b64c-d8b4ecfa4735",
        "rep-3": "49423274-2ae1-4c7b-9f6d-be236728e224",
        "rep-4": "94e8963d-4d80-4564-8c9a-1b13717371ba",
    }
    
    # Por ahora probamos solo con el primero para no saturar
    test_id = "hv-1"
    fetch_content_from_notebook(mappings[test_id], test_id)

if __name__ == "__main__":
    main()
