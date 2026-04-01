import fitz
import tempfile
import os
import asyncio
import edge_tts
from utils.resume_preprocess import preprocess_resume_text

def parse_resume_service(uploaded_file):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
        uploaded_file.save(temp.name)
        temp_path = temp.name

    try:
        doc = fitz.open(temp_path)
        raw_text = "\n".join([page.get_text() for page in doc])
        
        processed_text = preprocess_resume_text(raw_text)
        
        doc.close()
        os.remove(temp_path)

        return {"resume_text": processed_text}

    except Exception as e:
        return {"message": str(e)}, 500


def speak_service(user_text):
    voice = "en-US-JennyNeural"

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
            file_path = temp_audio.name

        async def generate_audio():
            tts = edge_tts.Communicate(text=user_text, voice=voice)
            await tts.save(file_path)

        asyncio.run(generate_audio())

        return file_path

    except Exception as e:
        return {"error": str(e)}, 500