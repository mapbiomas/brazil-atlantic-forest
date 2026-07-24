/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Apply spatial filtering to the land cover classification of Fernando de Noronha (FN).
 * 
 * DESCRIPTION:
 * This script processes the multi-temporal land cover classification for the Fernando de Noronha archipelago.
 * It combines data from Collection 3 and Collection 4 to create a base image for the 2017-2025 period.
 * The core logic applies a spatial smoothing filter (focal mode) with a 3x3 square kernel. 
 * This smoothing is specifically targeted at small, isolated pixel clusters identified through a 
 * connectivity threshold (min_connect_pixel). Pixels belonging to clusters smaller than or equal 
 * to the threshold are replaced by the local majority class, while larger, more stable features 
 * are preserved. The final multi-band image is then enriched with MapBiomas metadata and exported 
 * as a Google Earth Engine Asset.
 */

// Define the processing description translated to English
var description = 'FN Spatial Filter';
// Define the collection identifier as a float value for Collection 4.0
var collection_id = 4.0;

// Define the biome for processing identification
var bioma = "MATAATLANTICA";

// Define the input and output versions as strings in single quotes
var version_in = '1';
var version_out = '3';

// Define the threshold for the minimum number of connected pixels to trigger smoothing
var min_connect_pixel = 25;

// Define the prefix for the output asset name
var prefixo_out = 'FNoronha_p60_v';

// Define the input and output directories for the classification assets
var dir_in = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 
var dirout = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 

// Load the base classification image by combining Collection 3 and Collection 4 bands for Fernando de Noronha
var class4GAP = ee.Image('projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/regioes/FNoronha_v' + version_in)
                  .addBands(ee.Image(dir_in + 'FNoronha_v' + version_in));

// Print the initial image structure to the console for metadata inspection
print(class4GAP);

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Define the study area geometry for clipping and export
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-32.39663074204338, -3.785031245924777],
          [-32.43739744964606, -3.8071275947681587],
          [-32.4757632558307, -3.8319627521753064],
          [-32.50331621620784, -3.861421741315502],
          [-32.506837346047284, -3.889852450971306],
          [-32.48057341026156, -3.9109184787539504],
          [-32.442635991066815, -3.90321108689405],
          [-32.40761564327281, -3.8985872916682607],
          [-32.37671638706442, -3.8720402605800093],
          [-32.35491578246739, -3.8172315928217264],
          [-32.35783527085197, -3.794623261419398],
          [-32.371739949942274, -3.7840037269381845]]]);

// Import the MapBiomas palettes module for standardized land cover colors
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Retrieve the classification2 palette from the imported module
var pal = palettes.get('classification2');

// Define visualization parameters for the classification map using 2023 as the reference year
var vis = {
    bands: 'classification_2023',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define standard visualization parameters for classification layers
var vis2 = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Add the initial multi-temporal image to the map for visual inspection
Map.addLayer(class4GAP, vis, 'class4GAP');

// Define the full time series range for processing (2017 to 2025)
var anos = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

// Start the outer loop through the defined years
for (var i_ano = 0; i_ano < anos.length; i_ano++) {  
  // Get the specific year string for the current iteration
  var ano = anos[i_ano]; 

  // Start the internal loop to process each year and generate the filtered bands
  for (var i_ano = 0; i_ano < anos.length; i_ano++) {  
    // Retrieve the year string again for the inner loop scope
    var ano = anos[i_ano]; 

    // Apply a focal mode filter with a 3x3 square kernel to determine the local majority class
    var moda = class4GAP.select('classification_' + ano).focal_mode(3, 'square', 'pixels');

    // Mask the focal mode result to keep only areas where connectivity is below the threshold (small noise)
    moda = moda.mask(class4GAP.select('classification_' + ano + '_conn').lte(min_connect_pixel));

    // Blend the smoothed noise patches back into the original classification image
    var class_out = class4GAP.select('classification_' + ano).blend(moda);

    // If it is the first year, initialize the total output image; otherwise, merge the new band
    if (i_ano === 0) { 
      var class_outTotal = class_out; 
    } else {
      class_outTotal = class_outTotal.addBands(class_out); 
    }
  }
  
  // Log the resulting multi-band spatially filtered image to the console
  print(class_outTotal);

  // Add the processed multi-temporal classification to the map
  Map.addLayer(class_outTotal, vis, 'class_outTotal');
}

// Assign standardized MapBiomas metadata to the consolidated output image
class_outTotal = class_outTotal
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the filtered multi-temporal classification as a permanent Google Earth Engine Asset
Export.image.toAsset({
    'image': class_outTotal,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});