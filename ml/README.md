# Crop disease model

Recommended data flow:

1. Download [PlantVillage](https://github.com/spMohanty/PlantVillage-Dataset) for the initial 38-class baseline.
2. Hold out whole leaf groups when splitting train/validation; do not randomly duplicate near-identical images across both sets.
3. Evaluate the trained model on [PlantDoc](https://github.com/pratikkayal/PlantDoc-Dataset) or locally collected field photos before claiming field accuracy.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-ml.txt
python ml\train.py --data data --epochs 12
```

The trainer fine-tunes MobileNetV3-Small with augmentation and label smoothing, then saves `artifacts/mobilenetv3_crop_disease.pt` and `classes.json`. The current React Native app is ready to upload a selected photo to an inference API; the next integration should load these weights behind `/predict` and return class, confidence, and an uncertainty flag.
