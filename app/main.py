from fastapi import FastAPI, UploadFile, File, Form, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.ai_engine import process_image_mode
from app.aura_historydb import get_db, HistoryItem, engine, Base
import shutil
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

os.makedirs("uploads", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

templates = Jinja2Templates(directory="templates")

@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/history")
def read_history(db: Session = Depends(get_db)):
    return db.query(HistoryItem).order_by(HistoryItem.timestamp.desc()).limit(20).all()

@app.post("/aura/criar")
async def create_content(
    file: UploadFile = File(...),
    platform: str = Form(...),
    task: str = Form(...),
    db: Session = Depends(get_db)
):
    import uuid
    ext = file.filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    file_location = f"uploads/{new_filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    try:
        resultado_texto = await process_image_mode(file_location, platform, task)
        
        if "Erro" not in resultado_texto and "Premium" not in resultado_texto:
            new_item = HistoryItem(
                platform=platform,
                task_type=task,
                image_path=file_location,
                result_text=resultado_texto
            )
            db.add(new_item)
            db.commit()
            db.refresh(new_item)

    except Exception as e:
        return {"erro": str(e)}
    
    return {"resultado": resultado_texto}