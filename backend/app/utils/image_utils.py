import cv2
import numpy as np

IMG_SIZE=72

def preprocess_image(contents:bytes):
    np_img=np.frombuffer(contents,np.uint8)
    img=cv2.imdecode(np_img,cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Invalid image")
    img=cv2.resize(img,(IMG_SIZE,IMG_SIZE))
    img=img.astype("float32")/255.0
    img=np.expand_dims(img,axis=-1)
    img=np.expand_dims(img,axis=0)

    return img