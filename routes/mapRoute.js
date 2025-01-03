const express = require('express');
const ee = require('@google/earthengine');
const fs = require('fs');

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
    // Define the MODIS datasets and the time range
    const dataset = ee.ImageCollection('MODIS/061/MOD11A1')
      .filterDate('2001-01-31', '2001-05-01');
    const dataset1 = ee.ImageCollection('MODIS/061/MOD09CMG')
      .filterDate('2001-01-31', '2001-05-01');

    // Define the geometry
    const geometry = ee.Geometry.Polygon([
      [[-26.822, 38.112], [-26.822, 2.607], [99.74, 2.607], [99.74, 38.112]]
    ]);

    // Define the calculation function
    const calculateRmax = (image) => {
      const r = image.select('Coarse_Resolution_Surface_Reflectance_Band_1').multiply(0.160)
        .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_2').multiply(0.291))
        .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_3').multiply(0.243))
        .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_4').multiply(0.116))
        .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_5').multiply(0.112))
        .add(image.select('Coarse_Resolution_Surface_Reflectance_Band_7').multiply(0.081));

      const mask = r.gt(0.7);
      const zenithAngle = image.select('Coarse_Resolution_Solar_Zenith_Angle').multiply(Math.PI / 180).cos();
      const rmax = r.multiply(-1).add(1).multiply(1367).multiply(zenithAngle);
      return rmax.updateMask(mask).set('system:time_start', image.get('system:time_start'));
    };

    // Apply the function
    const rmaxCollection = dataset1.map(calculateRmax);
    const averageRmax = rmaxCollection.mean();

    const landSurfaceTemperatureDay = dataset.select('LST_Day_1km').mean().multiply(0.02);
    const landSurfaceTemperatureNight = dataset.select('LST_Night_1km').mean().multiply(0.02);
    const difference = landSurfaceTemperatureDay.subtract(landSurfaceTemperatureNight).abs();
    const AI = difference.divide(averageRmax);

    // Visualization parameters
    const visParams = {
      min: 0.0025,
      max: 0.1,
      palette: ['blue', 'green', 'yellow', 'red'],
    };

    // Generate map URL
    AI.getMap(visParams, (result, err) => {
      if (err) {
        console.error('Error generating map:', err);
        res.status(500).send('Error generating map');
        return;
      }

      const mapUrl = {
        tileUrlFormat: result.urlFormat,
        exampleTileUrl: result.urlFormat.replace('{z}', '0').replace('{x}', '0').replace('{y}', '0'),
      };

      res.json(mapUrl);
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
