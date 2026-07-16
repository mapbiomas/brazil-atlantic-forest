/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Apply spatial filtering to land cover classification while conserving sensitive permanent preservation areas (APP).
 * 
 * DESCRIPTION:
 * This script implements a spatial filtering workflow for the Atlantic Forest biome classification (2017-2025). 
 * It aims to reduce classification noise without losing critical environmental features like riparian forests and wetlands. 
 * The process iterates through each year, applying a focal mode filter (3x3 window) to pixels with low spatial connectivity 
 * (below the specified threshold). To protect APP areas, the script utilizes the Global HAND (Height Above Nearest Drainage) 
 * index to identify potential floodplains and valley bottoms. If a pixel is classified as Forest Formation (3) or 
 * Natural Wetland (11) and is located in a low-lying area (HAND < 10m), it is preserved even if it would otherwise 
 * be filtered out by the connectivity threshold. The final multi-temporal bands are reassembled, metadata is updated 
 * for Collection 4, and the product is exported as a Google Earth Engine Asset.
 */

// Define the processing description in English
var description = 'Spatial Filter Conserving APP Areas';
// Define the collection ID as a float for Collection 4.0
var collection_id = 4.0;

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define the input and output versions as strings in single quotes
var version_in = '2';
var version_out = '3';

// Define the spatial threshold for the minimum number of connected pixels
var min_connect_pixel = 25;

// Define the input and output prefixes for asset identification
var prefixo_in = 'MA_S2_p50_v';
var prefixo_out = 'MA_S2_p60_v';

// Define the input and output directories for the classification assets
var dir_in = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 
var dirout = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 


// Load the multi-temporal input classification image from the specified asset path
var class4GAP = ee.Image(dir_in + prefixo_in + version_in);
// Log the classification image structure to the console
print(class4GAP);

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Define the geographic polygon geometry for the study area and export
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

// Load the shared palettes module for map visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');
// Retrieve the classification9 palette
var pal = palettes.get('classification9');

// Define visualization parameters for the land cover classification (2021 as reference)
var vis = {
      bands: 'classification_2021',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
    };

// Define secondary visualization parameters for the classification layers
var vis2 = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define comprehensive visualization parameters including reference year 2023
var vis      = {bands: 'classification_2023','min': 0,'max': 69,'palette': palettes.get('classification9')};
var vis2     = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
// Define visualization parameters for the HAND (Height Above Nearest Drainage) index
var vis_hand = {'min': 0,'max': 1,'palette': 'white,blue'}; 

// Add the initial classification image to the map for spatial context
Map.addLayer(class4GAP, vis, 'class4GAP');

// Generate a list of years for the temporal loop spanning from 2017 to 2025
var anos = ee.List.sequence(2017, 2025)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });

// Transform the list of years into a multi-band image by processing each year individually
var class_outTotal = ee.ImageCollection(anos
                       .map(function(ano){
                          // Construct dynamic strings for current year band and its connectivity counterpart
                          var anoStr    = ee.Number(ano).format();
                          var nomeBanda = ee.String('classification_').cat(anoStr);
                          var connBanda = ee.String('classification_').cat(anoStr).cat('_conn');
                          
                          // Select the original classification band for the specific year
                          var class_original = class4GAP.select(nomeBanda);
                          
                          // Create a majority-filtered image using focal mode smoothing
                          var moda = class_original.focalMode(3, 'square', 'pixels')
                          // Mask the filtered image to target only fragments below the connectivity threshold
                                               .mask(class4GAP.select(connBanda).lte(min_connect_pixel));

                          // Integrate the filtered pixels into the original classification image
                          var class_out = class_original.blend(moda);

                          // Load and mosaic the HAND dataset, identifying low-lying drainage areas below 10m
                          var hand30_100_5 = ee.ImageCollection('users/gena/global-hand/hand-100')
                          .mosaic().lt(10);
                          // Display the HAND floodplain mask on the map
                          Map.addLayer(hand30_100_5, vis_hand, 'hand');
                          
                          // Create a binary mask for sensitive classes: Forest Formation (3) or Natural Wetland (11)
                          var mask_classes = class_original.eq(3).or(class_original.eq(11));
                      
                          // Combine the target classes with the drainage proximity mask (HAND < 10m)
                          var appHand_ano = mask_classes.add(hand30_100_5).eq(2).selfMask();
 

                          // Calculate pixel connectivity for the newly identified sensitive drainage areas
                          var appHand_ano_con = appHand_ano.connectedPixelCount(100, true).reproject('epsg:4326', null, 10);
                          
                           // Determine final spatial mask where identified drainage vegetation exists (area >= 1 pixel)
                          var mask_final = appHand_ano_con.gte(1);
                          
                          // Extract the sensitive pixels that must be preserved regardless of general filtering
                          var flo_corrigido = class_original.updateMask(mask_final.and(mask_classes));
                        
                          // Blend the generally filtered image with the protected riparian and wetland areas
                          var class_out2 = class_out.blend(flo_corrigido);
                          
                          // Return the final year band with original naming and properties
                          return class_out2.rename(nomeBanda)
                                        .copyProperties(class4GAP.select(nomeBanda));
  
})).toBands();


// Function to strip internal collection indices from band names after conversion
var corrIndx  = function (img){
                  var indxNames = img.bandNames();              
                  var bandNames = indxNames.map(function(nome){ 
                          // Remove the numeric prefix added by the .toBands() operation
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames,bandNames);     
                              };

// Clean up the band names and reproject the finalized classification to WGS84 at 10m resolution
var class_final = corrIndx(class_outTotal).reproject({
                            crs: 'EPSG:4326',
                            scale: 10  
});

// Display the final spatially filtered and APP-conserved classification on the map
Map.addLayer(class_final, vis, 'class_final');

// Apply MapBiomas Collection 4 metadata to the resulting multi-temporal image
class_final = class_final
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the final spatially and environmentally filtered classification as a Earth Engine Asset
Export.image.toAsset({
    'image': class_final,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    // Set pyramiding to mode for categorical data
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});