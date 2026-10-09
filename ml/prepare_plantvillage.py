import argparse, random, shutil
from pathlib import Path

CLASSES = [
    'Tomato___Bacterial_spot','Tomato___Early_blight','Tomato___healthy','Tomato___Late_blight',
    'Tomato___Leaf_Mold','Tomato___Septoria_leaf_spot','Tomato___Spider_mites Two-spotted_spider_mite','Tomato___Target_Spot','Tomato___Tomato_mosaic_virus','Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Potato___Early_blight','Potato___healthy','Potato___Late_blight',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot','Corn_(maize)___Common_rust_','Corn_(maize)___healthy','Corn_(maize)___Northern_Leaf_Blight'
]

def main():
    p=argparse.ArgumentParser(); p.add_argument('--source',default='data/plantvillage/raw/color'); p.add_argument('--out',default='data/processed'); p.add_argument('--val',type=float,default=.2); p.add_argument('--seed',type=int,default=42); a=p.parse_args(); random.seed(a.seed)
    src=Path(a.source); out=Path(a.out)
    if out.exists(): shutil.rmtree(out)
    for cls in CLASSES:
        files=list((src/cls).glob('*')); random.shuffle(files); cut=max(1,int(len(files)*a.val))
        for split, subset in [('val',files[:cut]),('train',files[cut:])]:
            target=out/split/cls; target.mkdir(parents=True,exist_ok=True)
            for f in subset: shutil.copy2(f,target/f.name)
        print(cls, len(files)-cut, 'train', cut, 'val')
if __name__=='__main__': main()
