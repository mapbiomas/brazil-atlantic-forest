/**
 * This script stabilizes land cover transition steps over a multi-year timeline.
 * It tracks high-frequency classification changes per pixel using run-count analysis rules.
 * The anomalous shifting tracks are masked, corrected, and exported to multi-band images.
 */

var description = 'Estabiliza Area de Mudancas'
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define input and output version numbers
var vesion_in = '18';
var version_out = '21';

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p85_v';
var prefixo_out = 'MA_S2_p87_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Output directory

// Load the input Landsat 8 image from the specified directory
var S2_v2 =  ee.Image(dirout + prefixo_in + vesion_in);

// Select the classification bands for the years 2017 to 2024
S2_v2 = S2_v2.select(['classification_2017','classification_2018','classification_2019','classification_2020','classification_2021','classification_2022','classification_2023','classification_2024']);

// Add the input image to the map for visualization
Map.addLayer(S2_v2, {}, 'S2_v2', false);

// Load the palettes module for visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for the classification bands
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
var vis2 = {
    'bands':'classification_2022',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Add the classification band for 2022 to the map for visualization
Map.addLayer(S2_v2, vis2, 'S2_v2 ', true);

// Define an array of years for processing
var anos = [2017,2018,2019,2020,2021,2022,2023,2024];

// Loop through each year in the array
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];

  // Remap the classification values for the current year
  var nChanges = S2_v2.select('classification_'+ano)
                    .remap([3, 4,49,11,12,13,29, 9,19,21,22,33,50],
                           [3,21,21,21,21,21,21,21,21,21,21,21,21])
                    .rename('classification_'+ano);

  // Combine the remapped classification bands for each year
  if (i_ano == 0){ var class_so_flo = nChanges }  
  else {class_so_flo = class_so_flo.addBands(nChanges); }
}

// Calculate the number of changes for each pixel
var num_changes = class_so_flo.reduce(ee.Reducer.countRuns()).subtract(1);

// Add the number of changes image to the map for visualization
Map.addLayer(num_changes, {'min': 0,'max': 6, 'palette': ["#ffffff","#fee0d2","#fcbba1",
            "#fb6a4a","#ef3b2c","#a50f15","#67000d"],'format': 'png'}, 'nChanges',false);

// Identify pixels with more than 3 changes
var erro_changes = num_changes.gte(3).remap([1],[21]);

// Add the error changes image to the map for visualization
Map.addLayer(erro_changes, vis, 'erro_changes', false);

// Loop through each year in the array again
var anos = [2017,2018,2019,2020,2021,2022,2023,2024];
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification band for the current year
  var class_ano = S2_v2.select('classification_'+ano);

  // Remap the classification values for the current year
  var class_remap_ano = class_ano.remap([3,4,49,11,12,13,29, 9,19,21,22,25,33,50],
                                        [3,4,49,11,12,21,29, 9,21,21,22,22,33,50]).rename('classification_'+ano);

  // Blend the remapped classification band with the error changes image
  class_remap_ano = class_remap_ano.blend(erro_changes.rename('classification_'+ano));

  // Combine the corrected classification bands for each year
  if (i_ano == 0){ var class_corrigido = class_remap_ano }  
  else {class_corrigido = class_corrigido.addBands(class_remap_ano); }
}

// Add the corrected classification band for 2022 to the map for visualization
Map.addLayer(class_corrigido, vis2, 'class_corrigido', true);

// Assign the corrected classification image to a variable
var image = class_corrigido;

// Define an array of years for processing
var years = [
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023
    ];

// Create a list of band names based on the years
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a histogram dictionary of band occurrences
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

// Print the histogram dictionary to the console
print(bandsOccurrence);

// Create a dictionary of images, masking bands with less than 2 occurrences
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

// Convert the dictionary of images to a single image
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);

// Add connected pixel count bands to the image
var imageFilledConnected = image.addBands(
    image
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn')
            }
        ))
);

// Print the image with connected pixel count bands to the console
print(imageFilledConnected);

// Set metadata for the output image
imageFilledConnected = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': class_corrigido,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});
