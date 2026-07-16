/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Apply spatial filtering while preserving pixels in Permanent Preservation Areas (APP).
 * 
 * DESCRIPTION:
 * This script implements a spatial refinement process for the land cover classification (2017-2025). 
 * It applies a focal mode filter (3x3 window) to pixels with low spatial connectivity (clusters <= 25 pixels) 
 * to reduce classification noise (salt-and-pepper effect). 
 * To ensure that environmentally sensitive areas like riparian forests and wetlands are not lost during 
 * smoothing, the script uses the Global HAND (Height Above Nearest Drainage) dataset. 
 * Pixels classified as Forest Formation (3) or Natural Wetland (11) that are located in low-lying areas 
 * (HAND < 10m) and meet a minimum mapping unit of 5 connected pixels are preserved and blended 
 * back into the filtered output. The final multi-temporal result is reprojected and exported 
 * as a MapBiomas Collection 4 Asset.
 */

var description = 'Spatial Filter Conserving APP Areas';
var collection_id = 4.0;

// Define the target biome
var bioma = "MATAATLANTICA";
// Reference year for visualization
var oneYear = 2018;

// Define the input and output version versions as strings
var version_in = '13';
var version_out = '14';

// Define the naming prefixes for input and output assets
var prefixo_in = 'MA_S2_p91_v';
var prefixo_out = 'MA_S2_p92_v';

// Define the workspace and data directories
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Load the intermediate merged image used as a reference mask
var merge = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat/MA_S2_p72_merge_v4');

// Load the multi-temporal input classification image
var class4GAP = ee.Image(dir_in + prefixo_in + version_in);

// Log the input classification structure to the console
print(class4GAP);

// Define the study area geometry for clipping and export
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

// Define spatial connectivity thresholds
var min_connect_pixel = 25;
var min_connect_pixel_app = 12;

// Import the palettes module for standardized MapBiomas visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for the classification map (Reference year 2023)
var vis      = {bands: 'classification_2023', 'min': 0, 'max': 69, 'palette': palettes.get('classification9')};
// Define general classification visualization parameters
var vis2     = {'min': 0, 'max': 69, 'palette': palettes.get('classification9')};
// Define visualization for the HAND (Height Above Nearest Drainage) index
var vis_hand = {'min': 0, 'max': 1, 'palette': 'white,blue'}; 

// Display the initial classification on the map
Map.addLayer(class4GAP, vis, 'class4GAP');

// Generate the sequence of years for the time series (2017 to 2025)
var anos = ee.List.sequence(2017, 2025)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });

// Process each year in the series to apply the spatial and environmental filters
var class_outTotal = ee.ImageCollection(anos
                       .map(function(ano){
                          // Construct the specific band names for classification and connectivity
                          var anoStr    = ee.Number(ano).format();
                          var nomeBanda = ee.String('classification_').cat(anoStr);
                          var connBanda = ee.String('classification_').cat(anoStr).cat('_conn');
                          
                          // Select the reference mask for the current year
                          var merge_ano = merge.select(nomeBanda);
                          // Select the original classification and apply the reference mask
                          var class_original = class4GAP.select(nomeBanda).mask(merge_ano);
                          
                          // Calculate the focal mode (3x3 pixels) to identify the majority class locally
                          var moda = class_original.focalMode(3, 'square', 'pixels')
                          // Mask the majority image to only affect pixels with low spatial connectivity
                                               .mask(class4GAP.select(connBanda).lte(min_connect_pixel));

                          // Integrate the filtered pixels into the original annual classification
                          var class_out = class_original.blend(moda);

                          // Load the Global HAND dataset and identify pixels within 10 meters of drainage
                          var hand30_100_5 = ee.ImageCollection('users/gena/global-hand/hand-100')
                          .mosaic().lt(10);
                          
                          // Add HAND overlay to the map for spatial context
                          Map.addLayer(hand30_100_5, vis_hand, 'hand');
                          
                          // Identify pixels classified as Forest Formation (3) or Natural Wetland (11)
                          var mask_classes = class_original.eq(3).or(class_original.eq(11));
                      
                          // Combine class information with HAND to identify vegetation in floodplains/valleys
                          var appHand_ano = mask_classes.add(hand30_100_5).eq(2).selfMask();
 

                          // Calculate connectivity for the identified sensitive vegetation areas
                          var appHand_ano_con = appHand_ano.connectedPixelCount(100, true).reproject('epsg:4326', null, 10);
                          
                           // Apply a secondary MMU filter: preserve patches with at least 5 connected pixels
                          var mask_final = appHand_ano_con.gte(5);
                          
                          // Extract the sensitive natural vegetation that must be preserved
                          var flo_corrigido = class_original.updateMask(mask_final.and(mask_classes));
                        
                          // Blend the preserved natural pixels back into the smoothed classification
                          var class_out2 = class_out.blend(flo_corrigido);
                          
                          // Return the final processed band for the current year
                          return class_out2.rename(nomeBanda)
                                .copyProperties(class4GAP.select(nomeBanda));
  
})).toBands();

// Function to standardize band names after the .toBands() operation
var corrIndx  = function (img){
                  var indxNames = img.bandNames();             
                  var bandNames = indxNames.map(function(nome){ 
                          // Remove the numeric prefix added by ImageCollection conversion
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames, bandNames);     
                              };

// Correct the band names and ensure global reprojection at 10m scale
var class_final = corrIndx(class_outTotal).reproject({
                            crs: 'EPSG:4326',
                            scale: 10  
});

// Output the final multi-temporal stack to the console
print(class_final);

// Add the final spatially refined and APP-preserved classification to the map
Map.addLayer(class_final, vis, 'class_final');

// Set final MapBiomas Collection 4 metadata properties
class_final = class_final
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the multi-temporal final classification result as a Google Earth Engine Asset
Export.image.toAsset({
    'image': class_final,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    // Categorical data should use mode pyramiding
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});