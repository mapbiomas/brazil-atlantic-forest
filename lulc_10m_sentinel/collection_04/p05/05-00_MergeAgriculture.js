/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Merge regional agricultural classifications and apply temporal gap filling for the 2017-2025 period.
 * 
 * DESCRIPTION:
 * This script consolidates agricultural classification results from different regional processing units 
 * (Southeast and Northeast) within the Atlantic Forest biome. The script addresses data gaps by 
 * implementing a bidirectional temporal gap-fill algorithm that iterates forward (2017 to 2025) 
 * and backward (2025 to 2017) to ensure each pixel has a valid class based on its nearest temporal 
 * neighbor. It also calculates spatial connectivity using a connected pixel count to filter or 
 * identify small fragments. The final result is a multi-band image (one band per year) with 
 * standardized MapBiomas metadata, ready for export as a Google Earth Engine Asset.
 */

// Define the processing description translated to English
var description = 'Agriculture Merge';
// Define the collection ID as a float value
var collection_id = 4.0;

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define input version as a string in single quotes
var version_out = '3';
// Define connectivity rule for spatial analysis
var VeightConnected = true;
// Define the prefix for the output asset name
var prefixo_out = 'MA_S2_p50_agric_v';

// Define the output directory path
var dirout = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 

// Define the reference year for visualization
var oneYear = 2023;

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Define the study area geometry
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-56.05851880152852, -30.04613371617718],
          [-49.20305005152852, -30.841736663987348],
          [-41.46867505152852, -23.861579784474333],
          [-34.17375317652852, -8.163484389272043],
          [-32.251145754653514, -3.695273154047937],
          [-35.66789380152852, -4.582835761516412],
          [-49.07121411402852, -16.947367124654484],
          [-56.10246411402852, -21.01873071079243]]]);

// Import the palettes module for standardized visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define the visualization parameters for the classification map
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load classification images from the Southeast region (SE) and add current collection bands
var SE =  ee.Image('projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/regioes/agric_SE_v1')
.addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/agric_SE_v1'));

// Load classification images from the Northeast region (NE) and add current collection bands
var NE = ee.Image('projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/regioes/agric_NE_v1')
.addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/agric_NE_v1'));

// Merge regional images into a collection and calculate the minimum value for overlapping pixels
var image = ee.ImageCollection.fromImages([SE, NE]).min();

// Add the initial merged image to the map
Map.addLayer(image);

// Print image metadata to the console
print(image);

// Define the time series range from 2017 to 2025
var years = [
  2017,2018,2019,2020,2021,2022,2023,2024,2025
];

/**
 * User defined functions
 */

// Function to perform temporal gap filling on a multi-band classification image
var applyGapFill = function (image) {

    // First iteration: Forward gap fill from the start year (t0) to the final year (tn)
    var imageFilledt0tn = bandNames.slice(1)
        .iterate(
            function (bandName, previousImage) {

                // Select the classification band for the current iteration
                var currentImage = image.select(ee.String(bandName));

                // Cast the accumulated image to Earth Engine Image type
                previousImage = ee.Image(previousImage);

                // Replace masked pixels with values from the previous chronological band
                currentImage = currentImage.unmask(
                    previousImage.select([0]));

                // Append the filled current band to the stack
                return currentImage.addBands(previousImage);

            }, ee.Image(imageAllBands.select([bandNames.get(0)]))
        );

    // Cast the forward-filled result to an Image object
    imageFilledt0tn = ee.Image(imageFilledt0tn);

    // Prepare the list of years in reverse order for the second pass
    var bandNamesReversed = bandNames.reverse();

    // Second iteration: Backward gap fill from the final year (tn) back to the start (t0)
    var imageFilledtnt0 = bandNamesReversed.slice(1)
        .iterate(
            function (bandName, previousImage) {

                // Select the current band from the forward-filled result
                var currentImage = imageFilledt0tn.select(ee.String(bandName));

                // Cast the accumulated backward-filled image to Image type
                previousImage = ee.Image(previousImage);

                // Replace masked pixels with values from the next chronological year
                currentImage = currentImage.unmask(
                    previousImage.select(previousImage.bandNames().length().subtract(1)));

                // Append the result to the backward-growing band stack
                return previousImage.addBands(currentImage);

            }, ee.Image(imageFilledt0tn.select([bandNamesReversed.get(0)]))
        );

    // Restore original chronological order of the bands and select target names
    imageFilledtnt0 = ee.Image(imageFilledtnt0).select(bandNames);

    // Return the temporally stabilized image
    return imageFilledtnt0;
};

// Create a list of band names formatted for each year in the series
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a dictionary counting the occurrence of each band to identify missing years
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

// Print band availability statistics to the console
print(bandsOccurrence);

// Create a dictionary of images where missing years are initialized as empty masked byte images
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                image.select([key]).byte(),
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Assemble all individual bands into a single multi-band image for the entire period
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);

// Create an image where pixel values correspond to the year, used for tracking temporal logic
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);

// Execute gap filling for the classification bands
var imageFilledtnt0 = applyGapFill(imageAllBands);
// Execute gap filling for the year tracking bands
var imageFilledYear = applyGapFill(imagePixelYear);

// Add the original classification for the selected reference year to the map
Map.addLayer(image.select('classification_'+oneYear), vis, 'original',false);

// Add the temporally filled classification for the selected year to the map
Map.addLayer(imageFilledtnt0.select('classification_'+oneYear), vis, 'filtered');

// Calculate spatial connectivity for each classification band
var imageFilledConnected = imageFilledtnt0.addBands(
    imageFilledtnt0
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn')
            }
        ))
);

// Display the classification result including connectivity data on the map
Map.addLayer(imageFilledConnected.select('classification_'+oneYear), vis, 'imageFilledConnected');
// Print the multi-band stack containing connectivity bands to the console
print(imageFilledConnected);

// Assign metadata attributes to the final multi-temporal classified image
var classified = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Display the final processed classified layer for the reference year
Map.addLayer(classified.select('classification_'+oneYear), vis, 'classified');

// Export the multi-band classification result to a permanent Earth Engine Asset
Export.image.toAsset({
  "image": classified.toInt8(),
  "description": prefixo_out + version_out,
  "assetId": dirout + prefixo_out + version_out,
  "scale": 10,
  "pyramidingPolicy": {
      '.default': 'mode'
  },
  "maxPixels": 1e13,
  "region": geometry,
  "overwrite":true
});    

// Load the feature collection for Atlantic Forest administrative regions
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025");

// Use the regions collection as a global boundary reference
var limite = regioesCollection;

// Create a blank image to serve as a mask for drawing regional outlines
var blank = ee.Image(0).mask(0);

// Rasterize the regional outlines onto the blank image
var outline = blank.paint(limite, 'AA0000', 2); 

// Set visualization parameters for regional boundary display
var visPar = {'palette':'000000','opacity': 0.6};

// Add the regional outlines as a layer on the map
Map.addLayer(outline, visPar, 'regioes', false);

// Add the full regions feature collection to the map interface
Map.addLayer(regioesCollection);