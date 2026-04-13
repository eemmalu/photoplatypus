from fastapi import FastAPI
from fastapi import UploadFile, File, HTTPException
import shutil
from pathlib import Path
from sqlalchemy import text
from backend.database import SessionLocal

app = FastAPI()


@app.get("/")
def home():
    return {"message": "PhotoPlatypus API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}


UPLOAD_DIR = Path("uploads")
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400, detail="Unsupported file type")
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")

        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Save record to database
        db = SessionLocal()

        query = text("""
            insert into photos (filename, filepath)
            values (:filename, :filepath)
        """)

        db.execute(query, {
            "filename": file.filename,
            "filepath": str(file_path)
        })

        db.commit()
        db.close()

        return {
            "message": "Upload successful and saved to DB",
            "filename": file.filename
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong: {str(e)}"
        )
