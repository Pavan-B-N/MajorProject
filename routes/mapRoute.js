const express = require('express');
const ee = require('@google/earthengine');
const fs = require('fs');
const axios = require('axios');

const router = express.Router();

// Authenticate using a service account JSON key
const privateKey = require('../ee_cred.json'); // Replace with the path to your JSON key file

ee.data.authenticateViaPrivateKey(privateKey, () => {
  ee.initialize();
  console.log('Earth Engine authenticated successfully.');
}, (err) => {
  console.error('Authentication failed:', err);
});

router.get('/getMap', async (req, res) => {
  try {
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.long);

    if (!lat || !lon) {
      res.status(400).send('Latitude and Longitude are required');
      return;
    }
    console.log(lat+"    "+lon)
    // Define the width and height of the rectangle (in degrees, or adjust as needed)
    const width = 0.2;  // Rectangle width (degrees)
    const height = 0.2; // Rectangle height (degrees)

    // Create the geometry of the rectangle using the center point (lat, lon)
    const geometry = ee.Geometry.Polygon([
      [
        [lon - width / 2, lat - height / 2], // Bottom-left corner
        [lon + width / 2, lat - height / 2], // Bottom-right corner
        [lon + width / 2, lat + height / 2], // Top-right corner
        [lon - width / 2, lat + height / 2], // Top-left corner
      ]
    ],null,false);
    console.log(geometry)
    // Define the MODIS datasets and the time range
    const dataset = ee.ImageCollection('MODIS/061/MOD11A1')
      .filterDate('2024-01-31', '2024-04-01');
    const dataset1 = ee.ImageCollection('MODIS/061/MOD09CMG')
      .filterDate('2024-01-31', '2024-04-01');

    // Define the calculation function
    const calculateRmax = (image)=> {
      image=image.clip(geometry);
      // Select surface reflectance bands
      var r = image.select('Coarse_Resolution_Surface_Reflectance_Band_1').multiply(0.160)
          .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_2').multiply(0.291))
          .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_3').multiply(0.243))
          .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_4').multiply(0.116))
          .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_5').multiply(0.112))
          .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_7').multiply(0.081));
      
      // Mask low reflectance values
      var mask = r.gt(0.7);
      
      // Calculate solar zenith angle (assuming zenith angle is in degrees, converting to radians if necessary)
      var zenithAngle = image.select('Coarse_Resolution_Solar_Zenith_Angle').multiply(Math.PI / 180).cos();
      
      // Calculate rmax for the image
      var rmax = r.multiply(-1).add(1).multiply(1367).multiply(zenithAngle);
      var zenithAngleMask = image.select('Coarse_Resolution_Solar_Zenith_Angle').gt(80);
    
      mask=mask.and(zenithAngleMask)
      // Apply the mask and set the result in each image
      return rmax.updateMask(mask.not()).set('system:time_start', image.get('system:time_start'));
    };
    // Apply the function
    const rmaxCollection = dataset1.map(calculateRmax);
    const averageRmax = rmaxCollection.mean();

    const landSurfaceTemperatureDay = dataset.select('LST_Day_1km').mean().multiply(0.02);
    const landSurfaceTemperatureNight = dataset.select('LST_Night_1km').mean().multiply(0.02);
    const difference = landSurfaceTemperatureDay.subtract(landSurfaceTemperatureNight).abs();
    var AI = difference.divide(averageRmax);


    AI = AI.reproject({
      crs: 'EPSG:3857', // Flat projection (Web Mercator)
      scale: 1000      // Set a scale in meters for the projection
    });

    var stats = AI.reduceRegion({
      reducer: ee.Reducer.minMax(),  // Calculate min and max
      geometry: geometry,    // Use the image geometry (whole image)
      scale: 1000,                   // Set an appropriate scale (in meters, adjust based on your dataset)
      maxPixels: 1e8                 // Set a high maxPixels to ensure that all pixels are considered
    });
    
    // Extract min and max values from the stats
    var minValue = stats.get('LST_Day_1km_min').getInfo(); 
    var maxValue = stats.get('LST_Day_1km_max').getInfo();
    console.log(minValue+"    "+maxValue);
    
    // Set the dynamic visualization parameters based on the min/max values
    var visParams = {
      min: minValue,  // Convert the EE number to a native JavaScript number
      max: maxValue,  // Convert the EE number to a native JavaScript number
      palette: ['blue', 'green', 'yellow', 'red']
    };

    const params = {
      dimensions: '2048x2048', // Set the dimensions of the image
      region: geometry,
      format: 'png', // Request a PNG
      ...visParams,
    };

    // Generate map URL
    AI.getThumbURL(params, async (url, err) => {
      if (err) {
        console.error('Error generating thumbnail URL:', err);
        res.status(500).send('Error generating thumbnail');
        return;
      }

      try {
        console.log("generating image");
        // Fetch the PNG image
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Send the image as the response
        res.setHeader('Content-Type', 'image/png');
        console.log('PNG image successfully generated!');
        res.send(imageBuffer);
      } catch (downloadError) {
        console.error('Error downloading the image:', downloadError);
        res.status(500).send('Error downloading the image');
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
