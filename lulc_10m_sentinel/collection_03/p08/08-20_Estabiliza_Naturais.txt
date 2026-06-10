/**
 * This script improves temporal consistency across natural land cover classes using a mode filter.
 * It extracts annual natural areas, computes their multi-year frequency mode, and fills transient shifts.
 * The stabilized results are reassigned metadata descriptors and exported as a multi-band asset collection.
 */

// Define metadata description string
var description = 'Estabiliza Classes Naturais'
// Define database collection identifier number
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define input and output version numbers
var vesion_in = '14';
var version_out = '15';

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p81_v';
var prefixo_out = 'MA_S2_p82_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Output directory

// Import the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for the classification map
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define alternate year visualization parameters mapping
var vis2 = {
    'bands': 'classification_2020',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
// Load the input Landsat 8 image
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in);
// Add the input image to the map
Map.addLayer(imgCol, vis2, 'imgCol', false);

// Define years for processing.
var anos = ee.List.sequence(2017, 2024)                                                         
                  .map(function(y){                                                                     
                        return ee.Number(y).int(); });
                        
                        
// Function to correct band names after using .toBands().
var corrIndx  = function (img){
                  var indxNames = img.bandNames();
                  var bandNames = indxNames.map(function(nome){
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames,bandNames);
                              };

// Create an image collection containing only natural classes for each year.
var countNaturais = ee.ImageCollection(anos.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();
                    var nomeBanda = ee.String('classification_').cat(anoStr);
                    
                    var n = anos.size(); // list size
                    // Remap the classification to include only natural classes.
                    var image = imgCol.select(nomeBanda).remap(
                                      [3,4,11,12,29,50],
                                      [3,4,11,12,29,50]);
                                    
                    // Convert the image to int8.
                    return image.int8().rename(nomeBanda);
    })).toBands();
    // Print computed baseline natural occurrences layer to log console
    print(countNaturais);

// Calculate the mode of the natural classes.
var moda_natural = countNaturais.reduce(ee.Reducer.mode());
// Print the natural mode layer to the console
print(moda_natural);

// Add the mode image to the map.
Map.addLayer(moda_natural, vis, 'moda_natural', false);

// Create an image collection to correct the classification using the mode of natural classes.
var corrige = ee.ImageCollection(anos.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();
                    var nomeBanda = ee.String('classification_').cat(anoStr);
                    
                    var n = anos.size(); // list size

                    // Create a mask for natural classes.
                    var mask_nat_ano = imgCol.select(nomeBanda)
                                             .remap([ 3, 4, 5,11,12,29,50],
                                                    [ 1, 1, 1, 1, 1, 1, 1]);

                    // Apply the mode of natural classes to the masked areas.
                    var moda_natural_ano = moda_natural.mask(mask_nat_ano);
                    // Blend the original classification with the masked mode image.
                    var corrige_ano = imgCol.select(nomeBanda).blend(moda_natural_ano);
                        corrige_ano = corrige_ano.rename(nomeBanda);
                    
                    return corrige_ano;
    })).toBands();
    // Clear index suffix names and format final collection output layers
    corrige = corrIndx(corrige);

//print(corrige);

// Add the corrected classification image to the map.
Map.addLayer(corrige, vis2, 'col corrigido', false);
// Print final corrected image collection metadata to logs
print(corrige)
// Set the metadata for the output image
corrige = corrige
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': corrige,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});