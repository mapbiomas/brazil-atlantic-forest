/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Stabilize pixels with high transition rates to reduce temporal noise.
 * 
 * DESCRIPTION:
 * This script addresses temporal instability in the classification by identifying pixels that 
 * undergo an unrealistic number of thematic changes (transitions) between 2017 and 2025. 
 * The process simplified the annual maps into a binary Forest vs. Non-Forest representation 
 * to calculate the "countRuns" metric. Pixels exhibiting 3 or more changes in this simplified 
 * time series are flagged as unstable. These noisy pixels are then remapped to the 
 * "Mosaic of Agriculture and Pasture" (class 21) across all years to ensure thematic 
 * consistency and a cleaner cartographic product. The script also generates spatial 
 * connectivity bands for the corrected stack and exports the result as a Collection 4 Asset.
 */

// Define the project description for metadata
var description = 'Stabilize Change Areas';
// Set the collection ID to FLOAT format
var collection_id = 4.0;

// Define the biome identifier
var bioma = "MATAATLANTICA";
// Set the reference year for visualization
var oneYear = 2018;

// Define the input and output versions as STRINGS in single quotes
var version_in = '13';
var version_out = '12';

// Define the asset name prefixes
var prefixo_in = 'MA_S2_p86_v';
var prefixo_out = 'MA_S2_p87_v';

// Define the directory paths for input and output assets
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Load the multi-temporal classification image from the previous step
var S2_v2 =  ee.Image(dirout + prefixo_in + version_in);

// Select specific classification bands for the 2017-2025 time series
S2_v2 = S2_v2.select(['classification_2017','classification_2018','classification_2019','classification_2020','classification_2021','classification_2022','classification_2023','classification_2024','classification_2025']);

// Define the study area geometry for export and spatial reference
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

// Import the MapBiomas palettes module for map visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for general classification view
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define visualization parameters targeting the year 2022
var vis2 = {
    'bands': 'classification_2022',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Display the original input classification on the map
Map.addLayer(S2_v2, vis2, 'S2_v2 ', true);

// Load the biomes raster auxiliary dataset
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biome_2025_buf5k_30m');

// Mask the biomes image to isolate the Atlantic Forest (ID 4)
var biome_img = biomes_img.mask(biomes_img.eq(4));

// Define the chronological list of years for processing
var anos = [2017,2018,2019,2020,2021,2022,2023,2024,2025];

// Loop through each year to create a simplified Forest (3) vs Non-Forest (21) representation
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];

  // Map thematic classes into a binary mask to identify stable forest areas
  var nChanges = S2_v2.select('classification_'+ano)
                    .remap([3, 4, 49, 11, 12, 29, 21, 21, 21, 22, 23, 24, 25, 33, 50],
                           [3, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21])
                           .rename('classification_'+ano);

  // Initialize the binary collection or append the new year band
  if (i_ano == 0){ 
      var class_so_flo = nChanges; 
  } else {
      class_so_flo = class_so_flo.addBands(nChanges); 
  }
}

// Calculate the total number of thematic changes (runs) per pixel across the series
var num_changes = class_so_flo.reduce(ee.Reducer.countRuns()).subtract(1);

// Add the change count layer to the map to visualize unstable areas
Map.addLayer(num_changes, {
    'min': 0,
    'max': 6, 
    'palette': ["#ffffff","#fee0d2","#fcbba1","#fb6a4a","#ef3b2c","#a50f15","#67000d"]
}, 'nChanges', false);

// Identify pixels with 3 or more transitions, flagging them as thematic errors
var erro_changes = num_changes.gte(3).remap([1],[21]);

// Display the identified high-transition error areas on the map
Map.addLayer(erro_changes, vis, 'High Transition Noise', false);

// Repeat the loop through the years to apply the correction mask
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification band for the current year
  var class_ano = S2_v2.select('classification_'+ano);

  // Standardize the annual classification by remapping specific intermediate codes
  var class_remap_ano = class_ano.remap([3,4,49,11,12,29, 9,19,21,22,23,24,25,33,50],
                                        [3,4,49,11,12,29, 9,21,21,22,23,24,25,33,50]).rename('classification_'+ano);

  // Blend the classification with the error mask to stabilize unstable pixels to class 21
  class_remap_ano = class_remap_ano.blend(erro_changes.rename('classification_'+ano));

  // Consolidate the corrected bands into the final multi-temporal stack
  if (i_ano == 0){ 
      var class_corrigido = class_remap_ano; 
  } else {
      class_corrigido = class_corrigido.addBands(class_remap_ano); 
  }
}

// Apply the Atlantic Forest biome mask to the final corrected image
var image = class_corrigido.mask(biome_img);
// Display the stabilized classification for the reference year 2022
Map.addLayer(image, vis2, 'class_corrigido', true);

// Define the time series array for metadata reconstruction
var years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Create a list of band names for the 2017-2025 period
var bandNames = ee.List(
    years.map(function (year) {
            return 'classification_' + String(year);
        })
);

// Verify band occurrences using a frequency histogram dictionary
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

// Log band availability for consistency verification
print(bandsOccurrence);

// Create a dictionary of bands, handling potentially missing data with masked images
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

// Reassemble the image stack using the verified bands from the dictionary
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, imageAccumulator) {
            return ee.Image(imageAccumulator).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);

// Calculate the number of connected pixels of the same class for each year
var imageFilledConnected = image.addBands(
    image
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn');
            }
        ))
);

// Log the final image structure with connectivity bands to the console
print(imageFilledConnected);

// Assign standardized MapBiomas Collection 4 metadata properties to the output
imageFilledConnected = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the stabilized multi-temporal land cover classification as a Google Earth Engine Asset
Export.image.toAsset({
    'image': class_corrigido,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    // Ensure categorical data uses mode pyramiding
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});