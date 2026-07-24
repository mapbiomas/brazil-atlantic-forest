/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Apply spatial filtering and frequency-based smoothing to agricultural classification results.
 * 
 * DESCRIPTION:
 * This script performs a spatial filter on multi-temporal agricultural classification layers for the Atlantic Forest 
 * biome across the 2017-2025 time series. It utilizes a focal mode filter combined with connectivity thresholds 
 * (min_connect_pixel) to remove small, isolated spatial fragments and smooth the classification grid. 
 * For each year, the script identifies connected components based on previously generated connectivity bands, 
 * applies a focal mode operation (3x3 square window), and blends the smoothed pixels with the original classification. 
 * Finally, the filtered multi-temporal dataset is updated with MapBiomas Collection 4 metadata and exported 
 * as a Google Earth Engine Asset.
 */

// Define the processing description translated to English
var description = 'Agriculture Spatial Filter';
// Set the collection ID as a float value for Collection 4.0
var collection_id = 4.0;

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define the input and output versions as strings in single quotes
var version_in = '3';
var version_out = '3';

// Define the minimum number of connected pixels used as a threshold for spatial smoothing
var min_connect_pixel = 40;

// Define the input and output prefixes for asset identification
var prefixo_in = 'MA_S2_p50_agric_v';
var prefixo_out = 'MA_S2_p60_agric_v';

// Define the input and output directories for assets
var dir_in = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 
var dirout = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 

// Load the input multi-temporal classification image containing gap-filled and connectivity bands
var class4GAP = ee.Image(dir_in + prefixo_in + version_in);
// Log the loaded image structure to the console
print(class4GAP);

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Define the geometry for the study area and spatial bounds for export
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-56.05851880152852, -30.04613371617718],
          [-49.20305005152852, -30.841736663987348],
          [-41.46867505152852, -23.861579784474333],
          [-34.17375317652852, -8.163484389272043],
          [-34.26164380152852, -4.801825741437062],
          [-35.66789380152852, -4.582835761516412],
          [-49.07121411402852, -16.947367124654484],
          [-56.10246411402852, -21.01873071079243]]]);

// Load the shared palettes module for map visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');
var pal = palettes.get('classification2');

// Define visualization parameters targeting a specific year (2021)
var vis = {
    bands: 'classification_2021',
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

// Add the initial classification image to the map interface
Map.addLayer(class4GAP, vis, 'class4GAP');

// Define the time series array covering the years 2017 to 2025
var anos = ['2017','2018','2019','2020','2021', '2022','2023', '2024', '2025'];

// Iterate through each year in the sequence to apply spatial filters
for (var i_ano=0; i_ano<anos.length; i_ano++){  
  // Get the string value of the current year in the loop
  var ano = anos[i_ano]; 
  
  // Apply a focal mode filter using a 3x3 square kernel to smooth pixel clusters
  var moda = class4GAP.select('classification_'+ano).focal_mode(3, 'square', 'pixels');
  
  // Mask the smoothed output based on the connectivity threshold to target only small isolated patches
  moda = moda.mask(class4GAP.select('classification_'+ano+'_conn').lte(min_connect_pixel));
  
  // Blend the original classification with the smoothed focal mode result
  var class_out = class4GAP.select('classification_'+ano).blend(moda);
  
  // Initialize the combined image or append the new filtered band to the multi-band stack
  if (i_ano === 0){ 
      var class_outTotal = class_out; 
  } else {
      class_outTotal = class_outTotal.addBands(class_out); 
  }
}

// Print the combined spatially filtered multi-band image to the console
print(class_outTotal);

// Add the final filtered classification stack to the map
Map.addLayer(class_outTotal, vis, 'class_outTotal');

// Assign standardized metadata properties to the final output image for Collection 4
class_outTotal = class_outTotal
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the filtered multi-temporal classification image as a Google Earth Engine Asset
Export.image.toAsset({
    'image': class_outTotal,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13,
    'overwrite': true
});