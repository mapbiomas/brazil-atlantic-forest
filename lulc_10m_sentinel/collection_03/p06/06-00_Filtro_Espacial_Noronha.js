/**
 * This script applies a spatial filter to smooth the land use classification of Fernando de Noronha.
 * It uses focal mode and pixel connectivity thresholds to eliminate isolated, noisy pixels across years.
 * The cleaned annual bands are merged into a final multi-band image and exported as an asset.
 */

var description = 'Filtro Espacial FN'
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define the input and output versions
var vesion_in = '1';
var versao_out = '3';

// Define the minimum number of connected pixels
var min_connect_pixel = 25;

// Define the input and output prefixes
var prefixo_out = 'FNoronha_p60_v';

// Define the directories
var dir_in = 'projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/regioes/'; // Input directory
var dirout = 'projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/classificacao-ma-S2/'; // Output directory

// Load the classification image from the input version
var class4GAP = ee.Image(dir_in+'FNoronha_v'+vesion_in)//.mask(bioma250mil_MA)
print(class4GAP);

////*************************************************************
// Do not Change from these lines
////*************************************************************

//var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
//var bioma250mil_MA = biomes.mask(biomes.eq(2));
//Map.addLayer(bioma250mil_MA,{'palette': 'ccffcc'}, 'bioma250mil_MA', false)

// Load the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define the palette for the classification image
var pal = palettes.get('classification2');

// Define the visualization parameters for the classification image
var vis = {
      bands: 'classification_2023',
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

// Add the classification image to the map
Map.addLayer(class4GAP, vis, 'class4GAP');

// Define the years to process
var anos = ['2022','2023','2024'];

//var anos = ['2022'];

// Loop through the years and blend the classification image with the agriculture images
for (var i_ano=0;i_ano<anos.length; i_ano++){  
  // Set the loop year variable
  var ano = anos[i_ano]; 
//var anos = ['1985']

// Loop through the years
for (var i_ano=0;i_ano<anos.length; i_ano++){  
  // Get the current year
  var ano = anos[i_ano]; 

  // Apply a focal mode filter to the classification image
  var moda = class4GAP.select('classification_'+ano).focal_mode(3, 'square', 'pixels');

  // Mask the image based on the minimum number of connected pixels
  moda = moda.mask(class4GAP.select('classification_'+ano+'_conn').lte(min_connect_pixel));

  // Blend the original classification image with the filtered image
  var class_out = class4GAP.select('classification_'+ano).blend(moda);

  // Combine the output images for each year
  if (i_ano == 0){ var class_outTotal = class_out }  
  // Append the current layer to the total bands image
  else {class_outTotal = class_outTotal.addBands(class_out); }
}

// Print the output image
print(class_outTotal);

// Add the output image to the map
Map.addLayer(class_outTotal, vis, 'class_outTotal');
// Map.addLayer(class_out2, vis, 'class_out2');
}
// Set the metadata for the output image
class_outTotal = class_outTotal
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': class_outTotal,
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': limite,
    'scale': 10,
    'maxPixels': 1e13
});
