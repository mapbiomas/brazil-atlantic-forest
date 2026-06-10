/**
 * This script applies a spatial filter to smooth agricultural classification maps across years.
 * It calculates a focal mode texture to clean up noisy isolated pixels based on pixel connectivity.
 * The filtered layers are merged into an annual multi-band collection and exported as an asset.
 */

// Define the description text for metadata
var description = 'Filtro Espacial Agricultura'

// Define the database collection ID number
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define the input and output versions
var vesion_in = '1';
var versao_out = '2';

// Define the minimum number of connected pixels for smoothing
var min_connect_pixel = 40;

// Define the input and output prefixes for the asset names
var prefixo_in = 'MA_S2_p50_agric_v';
var prefixo_out = 'MA_S2_p60_agric_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/classificacao-ma-S2/'; // Input directory
var dirout = 'projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/classificacao-ma-S2/'; // Output directory

// Load the input classification image
var class4GAP = ee.Image(dir_in+prefixo_in+vesion_in);//.mask(bioma250mil_MA)

// Print the loaded image metadata to the console
print(class4GAP);

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Load the biomes image
//var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
// Mask the biomes image to select the desired biome
//var bioma250mil_MA = biomes.mask(biomes.eq(2));
// Add the masked biome image to the map
//Map.addLayer(bioma250mil_MA,{'palette': 'ccffcc'}, 'bioma250mil_MA', false)

// Load the palettes for visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Extract specific map palette definition
var pal = palettes.get('classification2');

// Define the visualization parameters for the classification image
var vis = {
      bands: 'classification_2021',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
    };

// Define the visualization parameters for the output image
var vis2 = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Add the input classification image to the map
Map.addLayer(class4GAP, vis, 'class4GAP');

// Define the years to process
var anos = ['2017','2018','2019','2020','2021', '2022','2023', '2024'];
//var anos = ['1985']

// Loop through each year
for (var i_ano=0;i_ano<anos.length; i_ano++){  
  // Get the current year
  var ano = anos[i_ano]; 
  
  // Apply a focal mode filter to smooth the classification
  var moda = class4GAP.select('classification_'+ano).focal_mode(3, 'square', 'pixels')
  
  // Mask the smoothed classification based on the minimum connected pixel threshold
  moda = moda.mask(class4GAP.select('classification_'+ano+'_conn').lte(min_connect_pixel))
  
  // Blend the original classification with the smoothed classification
  var class_out = class4GAP.select('classification_'+ano).blend(moda)
  
  // Combine the output classifications for each year
  if (i_ano == 0){ var class_outTotal = class_out }  
  // Append the current year band to the collection
  else {class_outTotal = class_outTotal.addBands(class_out); }
}

// Print the combined output classification
print(class_outTotal)

// Add the combined output classification to the map
Map.addLayer(class_outTotal, vis, 'class_outTotal');
// Map.addLayer(class_out2, vis, 'class_out2');

// Set the metadata for the output classification
class_outTotal = class_outTotal
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output classification to an asset
Export.image.toAsset({
    'image': class_outTotal,
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});
