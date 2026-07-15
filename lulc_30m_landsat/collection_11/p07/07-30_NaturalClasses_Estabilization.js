/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Improving the temporal consistency for natural areas.
 * 
 * DESCRIPTION:
 * This script iterates through each year, remapping classifications to only include classes considered
 * "natural" (3,4,11,12,29,50), obtaining yearly natural-class images.
 * Then, the mode of each pixel across all years is calculated (moda_natural),
 * representing the most frequent natural class at each location over the time series.
 * 
 * Another loop iterates through each year and creates a mask identifying pixels classified as natural
 * in the original image (mask_nat_ano). This mask is used to apply the moda_natural image,
 * replacing pixels in the original classification only where the mask indicates a natural class.
 * 
 * It uses as input data output data from script 07-20.
 * The output data from this script is used as an input in script 08-10.
 * 
 */

// Define the description of the process.
var descricao = 'Natural classes mode estabilization';

// Define the geometry for the Atlantic Forest region. 
var limite_MA = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-48.593359954293625, -30.678347823900353],
          [-47.275000579293625, -25.525376684152373],
          [-40.595313079293625, -23.284530667538736],
          [-33.915625579293625, -6.580343714417967],
          [-35.453711516793625, -4.217995607905081],
          [-44.198828704293625, -17.856203449528717],
          [-50.483008391793625, -17.52126295946964],
          [-55.712500579293625, -21.74193426005608],
          [-55.492774016793625, -29.72888025446976]]]);

// Define the input version number (from previous step) and output version number.
var vesion_in = '8';
var versao_out = '9';

// Define the collection id.
var col = 11.0;

// Define input and output prefixes for asset naming.
var prefixo_in  = 'MA_col'+col+'_p07b_v';
var prefixo_out = 'MA_col'+col+'_p07c_v';

// Define input and output directories for assets.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define the year and biome.
var oneYear = 2020;
var bioma = "MATAATLANTICA";
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
var biome_img = biomes_img.mask(biomes_img.eq(2));

// Load the input image (collection 10).
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in);

// Import the palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters.
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
var vis2 = {
    'bands': 'classification_'+oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define years for processing.
var anos = ee.List.sequence(1985, 2025)                                                           
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
    print(countNaturais);

// Calculate the mode of the natural classes.
var moda_natural = countNaturais.reduce(ee.Reducer.mode());
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
    corrige = corrIndx(corrige);

//print(corrige);

// Add the corrected classification image to the map.
Map.addLayer(imgCol, vis2, 'imgCol'+oneYear, false);
Map.addLayer(corrige, vis2, 'col corrigido'+oneYear, false);

var efeito = imgCol.select('classification_'+oneYear).neq(corrige.select('classification_'+oneYear))
Map.addLayer(efeito, {}, 'mudancas')
// Set the metadata for the final classification image.
corrige = corrige
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the final classification image to an asset.
Export.image.toAsset({
    "image": corrige.toInt8(),
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": limite_MA,
    "overwrite": true
});
