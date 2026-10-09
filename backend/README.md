# Farm AI inference API

Run from the project root after training a model:

```powershell
pip install -r backend\requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Android Emulator clients reach the host API at `http://10.0.2.2:8000`. A physical device needs the computer's LAN IP and firewall access. Set `MODEL_DIR` when the model artifacts live elsewhere.
