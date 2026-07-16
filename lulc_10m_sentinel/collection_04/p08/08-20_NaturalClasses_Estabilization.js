/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Stabilize natural vegetation classes using a temporal mode filter.
 * 
 * DESCRIPTION:
 * This script improves the temporal consistency of natural vegetation classes (Forest, Savanna, Wetland, etc.)
 * for the Atlantic Forest biome across the 2017-2025 series. It addresses the issue of unrealistic 
 * transitions (oscillations) between natural categories by calculating the most frequent natural 
 * class (temporal mode) for every pixel throughout the entire time series. 
 * The algorithm first filters the classification to retain only pixels labeled as natural, 
 * computes the temporal mode of these classes, and then re-applies this mode to the original 
 * classification wherever a natural class was initially predicted. This ensures that a pixel 
 * that remains natural over time keeps the same specific vegetation category, significantly 
 * reducing thematic noise while preserving legitimate transitions to anthropic classes.
 */

var description = 'Natural Classes Stabilization';
var collection_id = 4.0;

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define the input and output versions
var version_in = '6';
var version_out = '7';

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p81_v';
var prefixo_out = 'MA_S2_p82_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Load the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');
var oneYear = 2023;

var noronha = 
    /* color: #d6ccca */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
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
                  [-32.371739949942274, -3.7840037269381845]]]),
            {
              "system:index": "0"
            })]),
    geometry = 
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

// Define visualization parameters for the classification map
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

// Load the multi-temporal input classification image
var imgCol =  ee.Image(dirout+prefixo_in+version_in);

// Add the input image to the map for visualization
Map.addLayer(imgCol, vis2, 'imgCol', false);

// Define the chronological list of years for the 2017-2025 time series
var anos = ee.List.sequence(2017, 2025)                                                        
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });
                      
// Function to clean up band names by removing indices added during the .toBands() conversion
var corrIndx  = function (img){
                  var indxNames = img.bandNames();
                  var bandNames = indxNames.map(function(nome){
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames,bandNames);
                              };

// Correct the Fernando de Noronha archipelago classification across the series
var corrNoronha = ee.ImageCollection(anos.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();
                    var nomeBanda = ee.String('classification_').cat(anoStr);
                    var maskNoronha_ano = imgCol.select(nomeBanda).unmask(24).clip(noronha);
                    var n = anos.size(); 
                    // Remap the classification to include only natural classes
                      return imgCol.select(nomeBanda).blend(maskNoronha_ano).rename(nomeBanda)
                })).toBands(); 
corrNoronha = corrIndx(corrNoronha);

// Create an image collection containing only natural class pixels for each year
var countNaturais = ee.ImageCollection(anos.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();
                    var nomeBanda = ee.String('classification_').cat(anoStr);
                    var n = anos.size(); 
                    // Remap the classification to retain only specific natural categories:
                    // Forest (3), Savanna (4), Wetland (11), Grassland (12), Rocky Outcrop (29), Other Non-Veg (50)
                    var image = corrNoronha.select(nomeBanda).remap(
                              [3,4,11,12,29,50],
                              [3,4,11,12,29,50]);
                            
                    // Return the year band in int8 format
                    return image.int8().rename(nomeBanda);
    })).toBands();
    print(countNaturais);

// Calculate the temporal mode for pixels identified as natural vegetation across the series
var moda_natural = countNaturais.reduce(ee.Reducer.mode());
print(moda_natural);

// Display the calculated natural mode image on the map
Map.addLayer(moda_natural, vis, 'moda_natural', false);

// Build the corrected classification by applying the temporal mode back to the original image
var corrige = ee.ImageCollection(anos.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();
                    var nomeBanda = ee.String('classification_').cat(anoStr);
                    
                    var n = anos.size(); 

                    // Create a mask to identify where natural classes are present in the current year
                    var mask_nat_ano = corrNoronha.select(nomeBanda)
                                             .remap([ 3, 4, 5,11,12,29,50],
                                                    [ 1, 1, 1, 1, 1, 1, 1]);

                    // Mask the calculated temporal mode based on the current year's natural vegetation footprint
                    var moda_natural_ano = moda_natural.mask(mask_nat_ano);
                    
                    // Blend the original classification with the temporal mode to stabilize the classes
                    var corrige_ano = corrNoronha.select(nomeBanda).blend(moda_natural_ano);
                        corrige_ano = corrige_ano.rename(nomeBanda);
                    
                    return corrige_ano;
    })).toBands();
    
// Standardize band names after the final conversion
corrige = corrIndx(corrige);

// Display the stabilized classification on the map
Map.addLayer(corrige, vis2, 'Corrected Collection', false);
print(corrige);

// Apply MapBiomas Collection 4 metadata to the stabilized multi-temporal image
corrige = corrige
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the stabilized multi-temporal classification as a Google Earth Engine Asset
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