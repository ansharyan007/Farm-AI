"""Train a crop-disease classifier from an ImageFolder dataset.

Expected layout: data/train/<class>/*.jpg and data/val/<class>/*.jpg
The default backbone is MobileNetV3-Small so the exported model is suitable
for later mobile/ONNX conversion. Do not treat a PlantVillage-only score as
field accuracy; evaluate on PlantDoc or your own farm photos.
"""
import argparse, json, os
from pathlib import Path
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--data", default="data")
    p.add_argument("--epochs", type=int, default=12)
    p.add_argument("--batch-size", type=int, default=32)
    p.add_argument("--out", default="artifacts")
    args = p.parse_args()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    train_tf = transforms.Compose([transforms.Resize((224,224)), transforms.RandomHorizontalFlip(), transforms.RandomRotation(15), transforms.ColorJitter(brightness=.2, contrast=.2, saturation=.2), transforms.ToTensor(), transforms.Normalize([.485,.456,.406],[.229,.224,.225])])
    val_tf = transforms.Compose([transforms.Resize((224,224)), transforms.ToTensor(), transforms.Normalize([.485,.456,.406],[.229,.224,.225])])
    train = datasets.ImageFolder(Path(args.data)/"train", train_tf)
    val = datasets.ImageFolder(Path(args.data)/"val", val_tf)
    if train.classes != val.classes: raise ValueError("train and val class folders must match")
    tl = DataLoader(train, batch_size=args.batch_size, shuffle=True, num_workers=2, pin_memory=device=="cuda")
    vl = DataLoader(val, batch_size=args.batch_size, shuffle=False, num_workers=2, pin_memory=device=="cuda")
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    model.classifier[3] = nn.Linear(model.classifier[3].in_features, len(train.classes))
    model.to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-4)
    loss_fn = nn.CrossEntropyLoss(label_smoothing=.1)
    best = 0.0
    for epoch in range(args.epochs):
        model.train(); seen = correct = 0; total_loss = 0.0
        for x,y in tl:
            x,y=x.to(device),y.to(device); opt.zero_grad(); logits=model(x); loss=loss_fn(logits,y); loss.backward(); opt.step()
            total_loss += loss.item()*len(y); correct += (logits.argmax(1)==y).sum().item(); seen += len(y)
        model.eval(); val_correct=val_seen=0
        with torch.no_grad():
            for x,y in vl:
                logits=model(x.to(device)); val_correct += (logits.argmax(1)==y.to(device)).sum().item(); val_seen += len(y)
        acc=val_correct/max(val_seen,1); print(f"epoch {epoch+1:02d} train_acc={correct/seen:.3f} val_acc={acc:.3f}")
        if acc>best:
            best=acc; Path(args.out).mkdir(exist_ok=True); torch.save(model.state_dict(),Path(args.out)/"mobilenetv3_crop_disease.pt")
    Path(args.out).mkdir(exist_ok=True); (Path(args.out)/"classes.json").write_text(json.dumps(train.classes, indent=2)); print(f"best_val_acc={best:.3f} device={device}")

if __name__ == "__main__": main()
