import io, json, os
from pathlib import Path
import torch
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from PIL import Image
from torchvision import models, transforms

app = FastAPI(title="Farm AI Crop Disease API", version="1.0.0")
ARTIFACTS = Path(os.getenv("MODEL_DIR", "artifacts"))
MODEL_PATH = ARTIFACTS / "mobilenetv3_crop_disease.pt"
CLASS_PATH = ARTIFACTS / "classes.json"
SUPPORTED_CROPS = {"tomato", "potato", "rice", "wheat", "maize", "cotton"}
device = "cuda" if torch.cuda.is_available() else "cpu"
model = None
classes = []
preprocess = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor(), transforms.Normalize([.485,.456,.406],[.229,.224,.225])])

def load_model():
    global model, classes
    if not MODEL_PATH.exists() or not CLASS_PATH.exists(): return
    classes = json.loads(CLASS_PATH.read_text())
    model = models.mobilenet_v3_small(weights=None)
    model.classifier[3] = torch.nn.Linear(model.classifier[3].in_features, len(classes))
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device)); model.to(device); model.eval()

@app.on_event("startup")
def startup(): load_model()

@app.get("/health")
def health(): return {"ok": True, "model_loaded": model is not None, "device": device, "supported_crops": sorted(SUPPORTED_CROPS)}

@app.post("/predict")
async def predict(image: UploadFile = File(...), crop: str = Form(...)):
    crop = crop.lower().strip()
    if crop not in SUPPORTED_CROPS: raise HTTPException(400, f"Crop must be one of: {', '.join(sorted(SUPPORTED_CROPS))}")
    if model is None: raise HTTPException(503, "Model is not trained or not mounted. Run ml/train.py first.")
    try: content = await image.read(); tensor = preprocess(Image.open(io.BytesIO(content)).convert("RGB")).unsqueeze(0).to(device)
    except Exception as exc: raise HTTPException(400, f"Invalid image: {exc}")
    with torch.no_grad(): probs = torch.softmax(model(tensor), dim=1)[0]
    score, index = probs.max(0); label = classes[index.item()]
    confidence = float(score.item()); uncertain = confidence < 0.70
    return {"crop": crop, "prediction": "uncertain" if uncertain else label, "confidence": round(confidence, 4), "uncertain": uncertain, "disclaimer": "This is decision support, not a definitive agronomic diagnosis."}
