/**
 * This script filters temporal anomalies in the first and last years of the time series data.
 * It targets small deforestation and regeneration noise using structural land cover thresholds and connectivity rules.
 * The adjusted annual bands are re-compiled into a clean collection and exported as an asset.
 */

// Define the baseline description text for metadata
var description = 'Corrige Incio e Fim da Serie'
// Define the database collection identifier value
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define input and output version numbers
var vesion_in = '13';
var version_out = '14';

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p73_remap_v';
var prefixo_out = 'MA_S2_p81_v';

// Define localized specific metadata details description
var description = 'Corrige pequenos ruidos de desmatamento e regeneracao - Primeiro e Ultimo ano'
// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Output directory

// Import the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for the classification map
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
}
// Define alternate base visualization parameters mapping
var vis2 = {
    'bands':'classification_2017',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load the input Landsat 8 image
var imgCol =  ee.Image(dir_in+prefixo_in+vesion_in);
// Add the input image to the map
Map.addLayer(imgCol, vis2, 'imgCol', false);

// Create a list of years (update here and the rest of the code adjusts automatically).
var anos = ee.List.sequence(2017, 2024)                 // Creates a list of years from A to B.
                  .map(function(y){                                                                     
                        return ee.Number(y).int(); });  // Turns each value in the list into an integer number.
var n      = anos.size();                               // List size.                                                                    
var ultimo = ee.Number(anos.get(n.subtract(1)));        // Gets the last value in the list.
var penult = ee.Number(anos.get(n.subtract(2)));        // Gets the second-to-last value in the list.

// Create a level 0 collection of image classifications for all years.
var nivel0 = ee.ImageCollection(anos
               .map(function(ano){
                     var anoStr = ee.Number(ano).format();                      // Converts the number to a string.
                     var nomeBanda = ee.String('classification_').cat(anoStr);  // Creates the band names by concatenating the two strings.
                     var class_ano = imgCol.select(nomeBanda);                  // Selects all bands.
                     var nivel0_ano = class_ano.remap([3,4,11,12,29,50,21,22],     // Remaps classes to level 0 (natural and anthropic).
                                                      [1,1, 1, 1, 1, 1,10,10])
                                               .rename(nomeBanda);              // Renames bands 'remapped'.
                     return nivel0_ano;
                                  })).toBands();                                // Converts the imageCollection to a multiband image.

// Define an inner helper function to clean band name strings
var corrIndx  = function (img){
                  var indxNames = img.bandNames();                              // 'bandNames' creates an 'ee.List' from bands in an 'ee.Image'.
                  var bandNames = indxNames.map(function(nome){                 // Removes the index created by '.toBands()'.
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames,bandNames);                     // Replaces bands with 'XX_' created by '.toBands()' with clean names.
                              };
    // Format the baseline level 0 representation band layout
    nivel0 = corrIndx(nivel0);

// LASTS YEARS CORRECTIONS //
// Select the level 0 classifications for the lasts three years.
var nivel0_ult = nivel0.select(ee.String('classification_').cat(ultimo));   // Selects the band of the last year of the image.
var nivel0_pen = nivel0.select(ee.String('classification_').cat(penult));   // Selects the band of the penultimate year of the image.


// Correct small DEFORESTATION areas.
var desmat = nivel0_ult.eq(10)    // TRUE for anthropic class in the last year.
        .and(nivel0_pen.eq(1))    // TRUE for natural class in the penultimate year.

        
var conectedDesmat = desmat.selfMask()                         // Masks null values.
                           .connectedPixelCount(51, true)
                           .reproject('epsg:4326', null, 10);
                            
// Establish threshold condition for noise patch filtering
var desmat1ha = conectedDesmat.lte(50);                                           
var ruidoDesmat_pen = imgCol.select(ee.String('classification_').cat(penult))
                            .updateMask(desmat1ha);                             // Applies the mask of small deforestations to the image 
// Correct small REGENERATION areas.
var regen = nivel0_ult.eq(1)     // TRUE for natural class in the last year.
     .and(nivel0_pen.eq(10))    // TRUE for anthropic class in the penultimate year.

var conectedRegen = regen.selfMask()                         // Masks null values.
                         .connectedPixelCount(51,true)
                         .reproject('epsg:4326', null, 10);
                         
// Apply maximum cluster limit threshold filter rules
var regen2ha = conectedRegen.lte(50);                                           
var ruidoRegen_pen = imgCol.select(ee.String('classification_').cat(penult))
                           .updateMask(regen2ha);                               // Applies the mask of small regenerations to the image 

// FIRSTS YEARS CORRECTIONS //
// Select the level 0 classifications for the first three years.
var nivel0_pri = nivel0.select('classification_2017');
var nivel0_seg = nivel0.select('classification_2018');
var nivel0_ter = nivel0.select('classification_2019');

// Correct small DEFORESTATION areas in the first years.
var desmat = nivel0_pri.eq(1)
        .and(nivel0_seg.eq(10))

var conectedDesmat = desmat.selfMask()
                           .connectedPixelCount(101,true)
                           .reproject('epsg:4326', null, 10);
                           
// Isolate deforestation noise patches below the threshold layout limit
var desmat2ha = conectedDesmat.lte(100);
// Apply masking values to flag early-stage noise issues
var ruidoDesmat_pri = imgCol.select('classification_2018').updateMask(desmat2ha);

// Correct small REGENERATION areas in the first years.
var regen = nivel0_pri.eq(10)
        .and(nivel0_seg.eq(1))

var conectedregen = regen.selfMask()
                         // Count connected pixels within a 100-pixel radius. `true` ensures 8-connectivity.
                         .connectedPixelCount(101,true)
                         .reproject('epsg:4326', null, 10);
                         

// Isolate early time-series regeneration pixels matching constraints
var regen1ha = conectedregen.lte(100);
// Apply the mask to the 2018 classification image.
// This will mask out small regeneration areas, leaving only larger ones.
var ruidoRegen_pri = imgCol.select('classification_2018').updateMask(regen1ha);


// Create a corrected image collection.
var class_final = ee.ImageCollection((anos)
                    .map(function(ano){
                          ano = ee.Number(ano);
                          var anoStr = ano.format();
                          var class_ano = imgCol.select(ee.String('classification_').cat(anoStr));

                          // Apply corrections based on the year.
                          var class_corr = ee.Image(
                            ee.Algorithms.If(ano.eq(2017),
                              class_ano.blend(ruidoDesmat_pri)
                                       .blend(ruidoRegen_pri),
                                       
                            ee.Algorithms.If(ano.eq(ultimo),
                              class_ano.blend(ruidoDesmat_pen)
                                       .blend(ruidoRegen_pen),
                            class_ano
                            ))
                          );

                          return class_corr.rename(ee.String('classification_').cat(anoStr));
})).toBands();

// Correct the band names.
class_final = corrIndx(class_final);
// Output properties metadata details to user logs console
print(class_final);

Map.addLayer(class_final, vis2, 'class_final', false);

// Show the difference between the original and filtered classifications for specific year.
var efeito = imgCol.select('classification_2017').neq(class_final.select('classification_2017'));
Map.addLayer(efeito);

// Set the metadata for the output image
class_final = class_final
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': class_final,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});
