/**
 * This script applies a spatial filter to a multi-year classification image over the Atlantic Forest biome.
 * It cleans noise using focal mode filtering while preserving floodplains and natural wetlands via a global HAND model.
 * The annual layers are combined into an image collection, reprojected, and exported as a unified asset.
 */

var description = 'Filtro Espacial Conservando Areas de APP'
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";
// Define input and output version numbers
var vesion_in = '10';
var versao_out = '11';

// Define minimum connected pixel threshold
var min_connect_pixel = 25;
// var min_connect_pixel_app = 12;

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p50_v';
var prefixo_out = 'MA_S2_p60_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Output directory


// Load the input classification image
var class4GAP = ee.Image(dir_in+prefixo_in+vesion_in);//.mask(bioma250mil_MA)

// Print the loaded classification image metadata to the console
print(class4GAP);

////*************************************************************
// Do not Change from these lines
////*************************************************************

//var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
//var bioma250mil_MA = biomes.mask(biomes.eq(2));
//Map.addLayer(bioma250mil_MA,{'palette': 'ccffcc'}, 'bioma250mil_MA', false)

// Load palettes for visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');
var pal = palettes.get('classification9');

// Define visualization parameters for the classification image
var vis = {
      bands: 'classification_2021',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
    };

// Define visualization parameters for the output image
var vis2 = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define visualization parameters.
var vis      = {bands: 'classification_2023','min': 0,'max': 69,'palette': palettes.get('classification9')};
var vis2     = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
var vis_hand = {'min': 0,'max': 1,'palette': 'white,blue'}; // for HAND

// Add the input classification image to the map
Map.addLayer(class4GAP, vis, 'class4GAP');

// Create a list of years (update here and the rest of the code adjusts automatically).
var anos = ee.List.sequence(2017, 2024)                                                                           
                  .map(function(y){                                                                     
                        return ee.Number(y).int(); });

// Create an image collection by processing each year.
var class_outTotal = ee.ImageCollection(anos
                       .map(function(ano){
                          // Construct band names dynamically.
                          var anoStr    = ee.Number(ano).format();
                          var nomeBanda = ee.String('classification_').cat(anoStr);
                          var connBanda = ee.String('classification_').cat(anoStr).cat('_conn');
                          
                          var class_original = class4GAP.select(nomeBanda);
                          
                          // Apply a focal mode filter to the classification image.
                          var moda = class_original.focalMode(3, 'square', 'pixels')
                          // Filter the mode image by masking just the pixels with less than 6 connected pixels.
                                                               .mask(class4GAP.select(connBanda).lte(min_connect_pixel));
                          //Map.addLayer(moda.reproject({crs: 'EPSG:4326',scale: 30}), vis2, 'class_out_'+ano, false);

                          // Blend the original and filtered classifications.
                          var class_out = class_original.blend(moda);
                          //Map.addLayer(class_out.reproject({crs: 'EPSG:4326',scale: 30}), vis2, 'class_out_'+ano, false);

                          // Load the HAND images.
                          var hand30_100_5 = ee.ImageCollection('users/gena/global-hand/hand-100')
                          .mosaic().lt(10);
                          Map.addLayer(hand30_100_5, vis_hand, 'hand');
                          
                          // Binary mask where original classification is 3 (Forest Formation) OR 11 (Natural Wetland).
                          var mask_classes = class_original.eq(3).or(class_original.eq(11))//.mask(class4GAP.select(connBanda).gte(min_connect_pixel_app));
                      
                          // Combine class mask with HAND. Result equals 1 if both conditions are met.
                          var appHand_ano = mask_classes.add(hand30_100_5).eq(2).selfMask();
 

                          // Count connected pixels for flooded areas.
                          var appHand_ano_con = appHand_ano.connectedPixelCount(100, true).reproject('epsg:4326', null, 10);
                          //print('appHand_ano_con',appHand_ano_con)
                          //Map.addLayer(appHand_ano_con, {'palette': '#1eff05'}, 'appHand_ano_con');
                          
                           // Final mask: Pixels that passed the minimum area filter (patches >= 1 pixel).
                          var mask_final = appHand_ano_con.gte(1);
                          
                          var flo_corrigido = class_original.updateMask(mask_final.and(mask_classes));
                        
                          // Blend the classification corrected by mode (class_out) with valid flood
                          // or wetland areas (flo_corrigido).
                          var class_out2 = class_out.blend(flo_corrigido);
                          
                          // Return the corrected image to the collection.
                          return class_out2.rename(nomeBanda)
                                           .copyProperties(class4GAP.select(nomeBanda));
  
})).toBands();


// Function to correct band names after 'toBands()'.
var corrIndx  = function (img){
                  var indxNames = img.bandNames();              // creates an ee.List from bands of an ee.Image.
                  var bandNames = indxNames.map(function(nome){ // remove the index created by .toBands().
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames,bandNames);     // replaces bands with 'XX_' created by .toBands() with clean names.
                              };

// Correct band names and reproject the final classification.
var class_final = corrIndx(class_outTotal).reproject({
                            crs: 'EPSG:4326',
                            scale: 10  // export with 30 m/pixel.
});

// Add the combined output classification to the map
Map.addLayer(class_final, vis, 'class_final');
// Map.addLayer(class_out2, vis, 'class_out2');

// Set metadata for the output classification
class_final = class_final
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output classification to an asset
Export.image.toAsset({
    'image': class_final,
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});