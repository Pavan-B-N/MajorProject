from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from typing import List
from pydantic import BaseModel

import tensorflow as tf
from tensorflow import keras
model = keras.models.load_model("my_model.h5")

app = FastAPI()

class NISARModel(BaseModel):
   sar_vh: float
   sar_vv: float
   incidence_angle: float
   
@app.get('/predict_soil_moisture')
async def get_soil_moisture(nisarmodel:NISARModel):
   print(nisarmodel)
   sar_vh=nisarmodel.sar_vh
   sar_vv=nisarmodel.sar_vv
   incidence_angle=nisarmodel.incidence_angle
   input_data = [[sar_vh, sar_vv, incidence_angle]]
   predictions = model.predict(input_data)
   predicted_moisture = predictions[0][0]
   predicted_moisture=float(predicted_moisture)
   print(f'Predicted Moisture Content: {predicted_moisture}')
   return {"soil_moisture": predicted_moisture}
