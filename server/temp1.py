import tensorflow as tf
from tensorflow import keras
model = keras.models.load_model("my_model.h5")

sar_vh = -78.338168028309
sar_vv = -18.2439517001676
incidence_angle = 30.0
input_data = [[sar_vh, sar_vv, incidence_angle]]

predictions = model.predict(input_data)
predicted_moisture = predictions[0][0]
print(f'Predicted Moisture Content: {predicted_moisture}')