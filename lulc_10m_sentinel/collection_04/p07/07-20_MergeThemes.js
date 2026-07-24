/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Merge general land use classification, agriculture-specific maps, and Fernando de Noronha archipelago data.
 * 
 * DESCRIPTION:
 * This script consolidates different thematic and regional classification products into a final multi-temporal 
 * output for the Atlantic Forest biome (2017-2025). The merging process follows a specific hierarchy:
 * 1. It integrates the general land use classification as the base layer.
 * 2. It incorporates a refined classification for the Fernando de Noronha (FN) archipelago.
 * 3. It applies a specific rule for agricultural classes: if a pixel is classified as "Mosaic of Uses" (class 21) 
 *    in the general map and as "Agriculture" (class 19) in the specific agricultural map, it is updated to class 19.
 * The script iterates through each year, builds a mosaic where the last added layers have higher priority, 
 * and exports the final consolidated multi-band product as a Google Earth Engine Asset for Collection 4.
 */

// Define the study area geometry for the Atlantic Forest
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

// Define the processing description in English
var description = 'Merge between Agriculture Areas, FN and Regions';
// Set the collection identifier as a float value
var collection_id = 4.0;

// Define the biome for identification in metadata
var bioma = "MATAATLANTICA";

// Define the input version and output version as strings in single quotes
var version_in = '3';
var version_out = '4';

// Define the prefix for the final output asset name
var prefixo_out = 'MA_S2_p72_merge_v';

// Define the input directory containing intermediate regional and thematic classifications
var dir_in = 'projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/'; 
// Define the final output directory for MapBiomas Collection 4
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat/'; 

// Load the general land use classification image
var class_uso = ee.Image(dir_in + 'MA_S2_p60_v' + version_in);
// Load the specific classification for Fernando de Noronha
var class_nor = ee.Image('projects/mapbiomas-workspace/COLECAO4_S2/MATA_ATLANTICA/classification-mat/FNoronha_p70_v4'); 
// Load the specific agricultural classification image
var class_agr = ee.Image(dir_in + 'MA_S2_p60_agric_v' + version_in);

// Import the palettes module for standardized visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');
// Retrieve the classification9 palette
var pal = palettes.get('classification9');

//Define one year for visualization and processing checks
var oneYear = 2023;

// Define visualization parameters for the 2023 reference year
var vis = {
      bands: 'classification_' + oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
    };
// Define general visualization parameters for classification layers
var vis2 = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Add each input layer to the map for visual comparison
Map.addLayer(class_uso, vis, 'class_uso', false);
Map.addLayer(class_nor, vis, 'class_nor', false);
Map.addLayer(class_agr, vis, 'class_agr', false);

// Define the temporal range for processing from 2017 to 2025
var anos = ['2017','2018','2019','2020','2021', '2022','2023','2024','2025'];

// Iterate through each year to merge the specific thematic maps
for (var i_ano=0; i_ano<anos.length; i_ano++){  
    // Select the current year from the array
    var ano = anos[i_ano];  
    
    // Convert the year string into an Earth Engine Number for logical comparison
    var anoNum = ee.Number.parse(ano); 
    
    // Check if the current year is 2022 or later for specific logic inclusion
    var condicao = anoNum.gte(2022); 

    // Construct the band name for the current year
    var bandName = 'classification_' + ano;
    // Select the corresponding band from general land use and agricultural maps, converting to 8-bit integer
    var class_uso_ano = class_uso.select(bandName).toInt8();
    var class_agr_ano = class_agr.select(bandName).toInt8();

    // Identify pixels classified as Mosaic of Uses (class 21) in the general map
    var class__21_ano = class_uso_ano.eq(21);
    // Extract pixels classified as Agriculture (class 19) in the specific map, limited to Mosaic areas
    var class_agr__19 = class_agr_ano.eq(19).mask(class__21_ano).remap([1],[19]).rename(bandName).toInt8();

    // Select the Fernando de Noronha band for the current year
    var class_nor_ano = class_nor.select(bandName).rename(bandName).toInt8();
    
    // Create a mosaic where layers are ordered by priority (later images overwrite previous ones)
    var img_col = ee.ImageCollection.fromImages([
        // Base layer: General Land Use
        class_uso_ano,
        // Second priority: Fernando de Noronha specific corrections
        class_nor_ano, 
        // Highest priority for agricultural refinement: Overwrite class 21 with class 19
        class_agr__19
    ]).mosaic();
    
    // Initialize the final multi-band image or append the new mosaic result to the stack
    if (i_ano == 0){ 
        var class_outTotal = img_col; 
    } else {
        class_outTotal = class_outTotal.addBands(img_col); 
    }
}

// Print the consolidated multi-temporal image structure to the console
print('class_outTotal', class_outTotal);

// Add the final merged classification product to the map
Map.addLayer(class_outTotal, vis, 'class_outTotal');

// Assign MapBiomas Collection 4 metadata properties to the final output image
class_outTotal = class_outTotal
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the final multi-temporal merged classification as a Google Earth Engine Asset
Export.image.toAsset({
    'image': class_outTotal,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    // Use mode pyramiding for categorical/classification data
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13,
    'overwrite': true
});