import os
import numpy as np
from PIL import Image
from keras.models import load_model
from keras.layers import Layer
import keras.ops as ops
import keras

# =========================
# Custom Attention Layer
# =========================
@keras.saving.register_keras_serializable()
class AttentionLayer(Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(
            name="attention_weight",
            shape=(input_shape[-1], input_shape[-1]),
            initializer="glorot_uniform",
            trainable=True,
        )
        self.b = self.add_weight(
            name="attention_bias",
            shape=(input_shape[-1],),
            initializer="zeros",
            trainable=True,
        )
        super().build(input_shape)

    def call(self, x):
        e = ops.tanh(ops.dot(x, self.W) + self.b)
        a = ops.softmax(e, axis=-1)
        return x * a


# =========================
# CONFIG
# =========================
MODEL_PATH = "app/models/best_fer_model.keras"
IMAGE_PATH = "221.jpg"   # <-- put ONE test face image here
IMG_SIZE = (72,72)            # change if your training used 72x72


# =========================
# LOAD MODEL
# =========================
print("🔄 Loading model...")
model = load_model(
    MODEL_PATH,
    custom_objects={"AttentionLayer": AttentionLayer},
    safe_mode=False
)

print("✅ Model loaded")
print("📐 Model output shape:", model.output_shape)


# =========================
# LOAD & PREPROCESS IMAGE
# =========================
print("\n🖼 Loading image:", IMAGE_PATH)
img = Image.open(IMAGE_PATH).convert("L")
img = img.resize(IMG_SIZE)

img_arr = np.array(img).astype("float32") / 255.0

print("📊 Image stats:")
print(" - shape (H,W):", img_arr.shape)
print(" - min:", img_arr.min())
print(" - max:", img_arr.max())
print(" - mean:", img_arr.mean())

# add batch + channel
img_arr = np.expand_dims(img_arr, axis=(0, -1))
print(" - final model input shape:", img_arr.shape)


# =========================
# MODEL PREDICTION
# =========================
print("\n🧠 Running model prediction...")
pred = model.predict(img_arr, verbose=0)

print("🔢 Raw model output:")
print(pred)
print("🔝 Argmax index:", np.argmax(pred))
print("🎯 Max confidence:", float(np.max(pred)))
