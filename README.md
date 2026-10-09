# Farm AI

Farm AI is a React Native mobile platform for crop-health monitoring, disease screening, field insights, and farmer assistance.

> Status: active prototype / research build. The CNN pipeline is real for the trained classes, but the platform still requires production authentication, HTTPS deployment, field validation, and crop-specific datasets before commercial agronomic use.

## Project overview

### Mobile app

- Farm overview with field-health metrics and alerts
- Crop disease photo capture and gallery selection
- Field insights and recommended actions
- Farm AI Copilot interface
- Weather, calendar, reminder, and community screens

The mobile scan flow is designed to send an image to the inference API. Android Emulator clients use `10.0.2.2` to reach a local API.

### Machine-learning pipeline

The `ml/` directory contains:

- `prepare_plantvillage.py` — reproducible train/validation split
- `train.py` — MobileNetV3-Small transfer learning with augmentation and label smoothing
- `crops.json` — crop/class mapping
- `README.md` — dataset and training notes

The current checkpoint covers 17 PlantVillage classes:

- Tomato: 10 classes
- Potato: 3 classes
- Maize: 4 classes

The held-out PlantVillage validation result was 99.7%. This is a controlled-dataset result, not field accuracy. Rice, wheat, and cotton require additional field datasets before trustworthy production support.

### Inference API

The `backend/` directory contains a FastAPI service that loads the trained checkpoint and returns a prediction, confidence, and uncertainty flag.

```powershell
cd "D:\farm AI\publish"
pip install -r backend\requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Required model files:

```text
artifacts/mobilenetv3_crop_disease.pt
artifacts/classes.json
```

## Run the mobile app

```powershell
npm install
npm start
```

In another terminal:

```powershell
adb devices
npm run android
```

The emulator must appear as `device`, not `offline`.

## Train the model

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-ml.txt
```

Download PlantVillage from the [official dataset repository](https://github.com/spMohanty/PlantVillage-Dataset), then run:

```powershell
python ml\prepare_plantvillage.py
python ml\train.py --data data\processed --epochs 12 --batch-size 64
```

Training writes `artifacts/mobilenetv3_crop_disease.pt` and `artifacts/classes.json`.

For serious evaluation, test against PlantDoc or locally collected field photos. Controlled-background accuracy must not be presented as real-world accuracy.

## API contract

`POST /predict` accepts multipart form data:

- `image`: JPEG, PNG, or WebP leaf image
- `crop`: supported crop name

Example response:

```json
{
  "crop": "tomato",
  "prediction": "Tomato___Early_blight",
  "confidence": 0.91,
  "uncertain": false,
  "disclaimer": "Decision support only; consult an agronomist."
}
```

## Production roadmap

Before public production use, the project needs:

1. Field datasets for rice, wheat, and cotton.
2. External validation by region, crop, disease, and camera type.
3. Real authentication with password hashing or a managed identity provider.
4. Protected API/admin routes with role-based access control.
5. HTTPS, strict CORS, security headers, rate limiting, and quotas.
6. Secure image validation, size limits, malware scanning, and private storage.
7. Environment-managed secrets; never commit API keys or passwords.
8. Dependency scanning, secret scanning, CI checks, and reproducible deployments.
9. Agronomist review for low-confidence predictions.
10. Monitoring, audit logs, model versioning, rollback, and incident response.

## Security note

Do not use the development server or local HTTP endpoint in production. Do not place API keys in React Native source code. Use environment variables and a server-side secret manager. The model is decision support and must not be treated as a definitive diagnosis.

## License and data

Review the license and attribution requirements for every external dataset before redistribution or commercial use. PlantVillage and PlantDoc have separate terms and should not be assumed to have identical licensing.
