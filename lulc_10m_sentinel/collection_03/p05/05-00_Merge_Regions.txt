/**
 * This script merges multiple regional land cover classification layers into a single mosaic.
 * It executes an iterative gap-filling algorithm across annual bands to resolve temporal data voids.
 * Finally, it calculates connected pixel counts, applies metadata, and exports the combined asset.
 */

// Define the description text for metadata
var description = 'Merge Regioes'

// Define the collection database identification number
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define input and output variables
var v_in = '1'; // Input version 
var versao_out = '10'; // Output version
var VeightConnected = true; // Flag for connected pixel count
var prefixo_out = 'MA_S2_p50_v'; // Output prefix
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Output directory

// Define year and biome
var ano = 2023; // Year

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Import palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Create an image collection from region images
var image = ee.ImageCollection.fromImages([
  ee.Image(dir_in+'reg_10_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_09_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_01_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_02_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_03_v'+ '2').selfMask(),
  ee.Image(dir_in+'reg_06_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_07_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_08_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_11_v'+ '3').selfMask(),
  ee.Image(dir_in+'reg_12_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_13_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_14_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_15_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_16_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_17_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_18_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_19_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_20_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_27_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_21_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_22_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_23_v'+ '2').selfMask(),
  ee.Image(dir_in+'reg_25_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_29_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_26_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_28_v'+ '2').selfMask(),
  ee.Image(dir_in+'reg_30_v'+v_in).selfMask(),
  ee.Image(dir_in+'reg_04_v'+ '2').selfMask(),
  ee.Image(dir_in+'reg_05_v'+ '2').selfMask(),
  ee.Image(dir_in+'reg_24_v'+ '2').selfMask(),
]).min();

// Print the image collection
print(image);

// Define years for analysis
var years = [
  2017,2018,2019,2020,2021,2022,2023,2024
]

/**
 * User defined functions
 */

// Function to apply gap fill to an image
var applyGapFill = function (image) {

    // Apply gap fill from t0 to tn
    var imageFilledt0tn = bandNames.slice(1)
        .iterate(
            function (bandName, previousImage) {

                // Select the current band
                var currentImage = image.select(ee.String(bandName));

                // Cast previousImage to an ee.Image
                previousImage = ee.Image(previousImage);

                // Unmask the current image using the previous image
                currentImage = currentImage.unmask(
                    previousImage.select([0]));

                // Add the current image to the previous image
                return currentImage.addBands(previousImage);

            }, ee.Image(imageAllBands.select([bandNames.get(0)]))
        );

    // Cast imageFilledt0tn to an ee.Image
    imageFilledt0tn = ee.Image(imageFilledt0tn);

    // Apply gap fill from tn to t0
    var bandNamesReversed = bandNames.reverse();

    var imageFilledtnt0 = bandNamesReversed.slice(1)
        .iterate(
            function (bandName, previousImage) {

                // Select the current band
                var currentImage = imageFilledt0tn.select(ee.String(bandName));

                // Cast previousImage to an ee.Image
                previousImage = ee.Image(previousImage);

                // Unmask the current image using the last band of the previous image
                currentImage = currentImage.unmask(
                    previousImage.select(previousImage.bandNames().length().subtract(1)));

                // Add the current image to the previous image
                return previousImage.addBands(currentImage);

            }, ee.Image(imageFilledt0tn.select([bandNamesReversed.get(0)]))
        );


    // Cast imageFilledtnt0 to an ee.Image and select the original band names
    imageFilledtnt0 = ee.Image(imageFilledtnt0).select(bandNames);

    // Return the gap-filled image
    return imageFilledtnt0;
};

// Get a list of band names
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a histogram dictionary of band names and image band names
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

// Print the histogram dictionary
print(bandsOccurrence);

// Create a dictionary of bands with masked bands
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

// Convert the dictionary to an image
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);

// Generate an image with pixel years
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);

// Apply gap fill to the image
var imageFilledtnt0 = applyGapFill(imageAllBands);
// Apply gap fill to the pixel year representation image
var imageFilledYear = applyGapFill(imagePixelYear);

// Add the original image to the map
Map.addLayer(image.select('classification_'+ano), vis, 'original',false);

// Add the gap-filled image to the map
Map.addLayer(imageFilledtnt0.select('classification_'+ano), vis, 'filtered'); //.mask(bioma250mil_MA)

// Add connected pixel count bands
var imageFilledConnected = imageFilledtnt0.addBands(
    imageFilledtnt0
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn')
            }
        ))
);

// Print the image with connected pixel count bands
print(imageFilledConnected);

// Set metadata for the classified image
var classified = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Print the classified image
//print(classified)

// Export the classified image to an asset
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

// Load the regions collection
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Filter the regions collection
var limite = regioesCollection//.filterMetadata('reg_id', "equals", regiao);

// Create a blank image with the region outline
var blank = ee.Image(0).mask(0);
var outline = blank.paint(limite, 'AA0000', 2); 

// Define visualization parameters for the outline
var visPar = {'palette':'000000','opacity': 0.6};

// Add the outline to the map
Map.addLayer(outline, visPar, 'regioes', false);

// Add the regions collection to the map
Map.addLayer(regioesCollection);
