/**
 * This script merges the Southeast and Northeast agricultural classification images into a single layer.
 * It executes an iterative gap-filling algorithm across annual bands to remove temporal data voids.
 * Finally, it calculates connected pixel counts, assigns metadata, and exports the asset.
 */

// Define the description text for metadata
var description = 'Merge Agricultura'

// Define the database collection ID number
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define input variables
var versao_out = '2';
var VeightConnected = true;
var prefixo_out = 'MA_S2_p05_agric_v';

// Define the output directory path
var dirout = 'projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/classificacao-ma-S2/'; // Output directory';

// Define year and biome 
var ano = 2023;

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

// Load images from collection 7
var SE = ee.Image('projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/regioes/agric_SE_v1');
var NE = ee.Image('projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/regioes/agric_NE_v1');

// Create an image collection from the two images and get the minimum value
var image = ee.ImageCollection.fromImages([SE, NE]).min();

// Add the image to the map
Map.addLayer(image);

// Print the image to the console
print(image);

// Define years for processing
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

                // Unmask the current image using the previous image
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

// Print the bands occurrence dictionary to the console
print(bandsOccurrence);

// Create a dictionary of bands with masked values
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

// Apply gap fill to the image from t0 to tn and backwards
var imageFilledtnt0 = applyGapFill(imageAllBands);

// Apply gap fill to the pixel year representation image
var imageFilledYear = applyGapFill(imagePixelYear);

// Add the original image to the map
Map.addLayer(image.select('classification_'+ano), vis, 'original',false);

// Add the filtered image to the map
Map.addLayer(imageFilledtnt0.select('classification_'+ano), vis, 'filtered'); //.mask(bioma250mil_MA)

// Add connected pixels bands
var imageFilledConnected = imageFilledtnt0.addBands(
    imageFilledtnt0
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn')
            }
        ))
);

// Print the image with connected pixels bands to the console
print(imageFilledConnected);

// Set metadata for the classified image
var classified = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Print the classified image to the console
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

// Load the Atlantic Forest regions feature collection
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Filter the regions collection by region ID
var limite = regioesCollection//.filterMetadata('reg_id', "equals", regiao);

// Create a blank image with a mask
var blank = ee.Image(0).mask(0);

// Paint the outline of the regions on the blank image
var outline = blank.paint(limite, 'AA0000', 2); 

// Define visualization parameters for the outline
var visPar = {'palette':'000000','opacity': 0.6};

// Add the outline to the map
Map.addLayer(outline, visPar, 'regioes', false);

// Add the regions collection to the map
Map.addLayer(regioesCollection);
