/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Merge regional land cover classification results and apply temporal gap-filling for the 2017-2025 period.
 * 
 * DESCRIPTION:
 * This script consolidates regional Sentinel-2 land cover classifications from different input directories. 
 * It manages 30 different geographic regions by merging them into a single seamless mosaic using a minimum 
 * value approach to resolve spatial overlaps. The script implements a bidirectional temporal gap-filling 
 * algorithm: a forward pass (from 2017 to 2025) and a backward pass (from 2025 back to 2017). This ensures 
 * temporal consistency and removes data gaps by using the nearest available year's class for masked pixels. 
 * Finally, the script calculates spatial connectivity for each class and exports the multi-temporal 
 * classification stack as a MapBiomas Collection 4 asset.
 */

// Define the description of the process, translated to English
var description = 'Merge Regions';
// Define the collection identifier as a float value for Collection 4.0
var collection_id = 4.0;

// Define the target biome for processing
var bioma = "MATAATLANTICA";

// Define input and output variables, ensuring versions are strings in single quotes
var v_in = '1'; 
var versao_out = '2'; 
// Flag to determine if connectivity rule should be used for spatial analysis
var VeightConnected = true; 
// Define the prefix for the output asset filenames
var prefixo_out = 'MA_S2_p50_v'; 
// Define input directory paths for earlier collections and the current workspace
var dir_in_3 = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; 
var dir_in_4 = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 
// Define the destination directory for the final merged assets
var dirout = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 

// Define the reference year for visualization and processing check
var oneYear = 2023; 

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Define the geometry for the study area and export extent
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

// Import the shared palettes module for standardized MapBiomas colors
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for the classification map
var vis = {
    // Minimum class value
    'min': 0,
    // Maximum class value
    'max': 69,
    // Retrieve the classification9 color palette from the module
    'palette': palettes.get('classification9')
};


// 1. Load specific images using the provided IDs to check specific region data
var col3 = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/reg_10_v1');
var col4 = ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_10_v1');


// Create an image collection from all regional images, merging input directories and applying self-masking
var image = ee.ImageCollection.fromImages([
  ee.Image(dir_in_3+'reg_10_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_10_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_09_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_09_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_01_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_01_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_02_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_02_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_03_v'+ '2').addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_03_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_06_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_06_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_07_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_07_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_08_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_08_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_11_v'+ '3').addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_11_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_12_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_12_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_13_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_13_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_14_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_14_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_15_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_15_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_16_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_16_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_17_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_17_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_18_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_18_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_19_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_19_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_20_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_20_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_27_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_27_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_21_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_21_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_22_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_22_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_23_v'+ '2').addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_23_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_25_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_25_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_29_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_29_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_26_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_26_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_28_v'+ '2').addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_28_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_30_v'+v_in).addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_30_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_04_v'+ '2').addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_04_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_05_v'+ '2').addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_05_v1')).selfMask(),
  ee.Image(dir_in_3+'reg_24_v'+ '2').addBands(ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/reg_24_v1')).selfMask(),
]).min(); // Resolve overlaps by selecting the minimum value, ensuring a seamless mosaic

// Print the resulting image collection to the console for metadata inspection
print(image);

// Define the time series array covering the years 2017 to 2025
var years = [
  2017,2018,2019,2020,2021,2022,2023,2024,2025
]

/**
 * User defined functions for temporal consistency
 */

// Function to apply temporal gap filling to a multi-band classification image
var applyGapFill = function (image) {

    // Step 1: Forward gap fill from the first year (t0) to the last year (tn)
    var imageFilledt0tn = bandNames.slice(1)
        .iterate(
            function (bandName, previousImage) {

                // Select the current classification band
                var currentImage = image.select(ee.String(bandName));

                // Cast the accumulated result from previous steps as an Image
                previousImage = ee.Image(previousImage);

                // Unmask the current year using the valid data from the preceding year
                currentImage = currentImage.unmask(
                    previousImage.select([0]));

                // Add the filled current band to the growing stack of bands
                return currentImage.addBands(previousImage);

            }, ee.Image(imageAllBands.select([bandNames.get(0)]))
        );

    // Cast the forward-filled result to an Image object
    imageFilledt0tn = ee.Image(imageFilledt0tn);

    // Prepare a reversed list of bands for the backward pass
    var bandNamesReversed = bandNames.reverse();

    // Step 2: Backward gap fill from the final year (tn) back to the first year (t0)
    var imageFilledtnt0 = bandNamesReversed.slice(1)
        .iterate(
            function (bandName, previousImage) {

                // Select the band from the forward-filled stack
                var currentImage = imageFilledt0tn.select(ee.String(bandName));

                // Cast the backward accumulated result as an Image
                previousImage = ee.Image(previousImage);

                // Unmask remaining gaps using the data from the subsequent year (last added band)
                currentImage = currentImage.unmask(
                    previousImage.select(previousImage.bandNames().length().subtract(1)));

                // Add the updated current band to the backward stack
                return previousImage.addBands(currentImage);

            }, ee.Image(imageFilledt0tn.select([bandNamesReversed.get(0)]))
        );


    // Cast final result as Image and restore the original chronological band order
    imageFilledtnt0 = ee.Image(imageFilledtnt0).select(bandNames);

    // Return the temporally stabilized image
    return imageFilledtnt0;
};

// Map each year to its classification band name format
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a dictionary tracking which bands exist in the input image versus the requested list
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

// Print the band availability stats to the console
print(bandsOccurrence);

// Create a dictionary of bands, filling missing years with masked images
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                // If value is 2, the band is present in the input; otherwise create a mask
                ee.Number(value).eq(2),
                image.select([key]).byte(),
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Convert the dictionary into a single multi-band image containing all years in the series
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);

// Create a temporal tracking image where pixel values equal the year
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);

// Execute the gap filling process on classification bands
var imageFilledtnt0 = applyGapFill(imageAllBands);
// Execute the gap filling process on the pixel year metadata bands
var imageFilledYear = applyGapFill(imagePixelYear);

// Display the original classification for the reference year (before gap fill) on the map
Map.addLayer(image.select('classification_'+oneYear), vis, 'original', false);

// Display the classification result after temporal gap filling for the reference year
Map.addLayer(imageFilledtnt0.select('classification_'+oneYear), vis, 'filtered');

// Calculate spatial connectivity for each year's classification band
var imageFilledConnected = imageFilledtnt0.addBands(
    imageFilledtnt0
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                // Rename each connectivity band with a '_conn' suffix
                return ee.String(band).cat('_conn')
            }
        ))
);

// Print the final multi-temporal stack structure including connectivity bands
print(imageFilledConnected);

// Assign standardized MapBiomas metadata to the consolidated multi-temporal classification
var classified = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the multi-band classification results as a Earth Engine Asset
Export.image.toAsset({
  "image": classified.toInt8(),
  "description": prefixo_out + versao_out,
  "assetId": dirout + prefixo_out + versao_out,
  "scale": 10,
  "pyramidingPolicy": {
      '.default': 'mode'
  },
  "maxPixels": 1e13,
  "region": geometry
});    

// Load the administrative regions collection for contextual display
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Reference the full collection for spatial boundary display
var limite = regioesCollection;

// Create a blank image to serve as a canvas for drawing the region boundaries
var blank = ee.Image(0).mask(0);
// Rasterize the region boundaries onto the blank image for visualization
var outline = blank.paint(limite, 'AA0000', 2); 

// Set visualization parameters for region outlines (black with transparency)
var visPar = {'palette':'000000','opacity': 0.6};

// Add the region boundary outlines to the map interface
Map.addLayer(outline, visPar, 'regioes', false);

// Add the original feature collection of regions for interactive use
Map.addLayer(regioesCollection);