/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Stabilize non-forest natural classes and reduce temporal noise in high-transition areas.
 * 
 * DESCRIPTION:
 * This script processes the land cover time series (2017-2025) to improve thematic stability for natural classes 
 * other than Forest (class 3). It identifies pixels that show high temporal persistence for classes like Savanna (4), 
 * Grassland (12), Rocky Outcrop (29), Herbaceous Sandbank (50), and Natural Wetland (11). 
 * For each of these classes, a temporal frequency mask is created: if a class appears more than a specific 
 * number of times across the series and is present in a reference year, that pixel is considered "stable" 
 * for that class. Additionally, the script calculates the total number of class changes (runs) per pixel; 
 * pixels with excessive transitions (typically classification noise) are remapped to "Mosaic of Uses" (class 21). 
 * The final logic blends these stable masks back into the annual classifications, ensuring that legitimate 
 * forest transitions are preserved while stabilizing non-forest natural categories.
 */

var description = 'Stabilize Change Areas without Forest (3)';
var collection_id = 4.0;

// Define the biome identifier
var bioma = "MATAATLANTICA";
var oneYear = 2018;

// Define input and output versions as strings in single quotes
var version_in = '11';
var version_out = '12';

// Define the prefix identifiers for input and output assets
var prefixo_in = 'MA_S2_p85_v';
var prefixo_out = 'MA_S2_p86_v';

// Define the input and output directory paths for processing
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Load the multi-temporal classification image from the previous processing step
var imgCol =  ee.Image(dirout + prefixo_in + version_in);

// Define the geometric boundary for the Atlantic Forest study area
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

// Import the MapBiomas palettes module for map visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Reference year for specific visualization
var oneYear = 2018;

// Define visualization parameters for classification layers
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
// Visualization parameters for the specified reference year band
var vis2 = {
    'bands': 'classification_' + oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Add the initial classification stack to the map
Map.addLayer(imgCol, vis2, 'imgCol ', true);

// Calculate the temporal occurrence of Savanna (class 4) across the 2017-2025 period
var savan = imgCol.select('classification_2017').eq(4).add(
            imgCol.select('classification_2018').eq(4)).add(
            imgCol.select('classification_2019').eq(4)).add(
            imgCol.select('classification_2020').eq(4)).add(
            imgCol.select('classification_2021').eq(4)).add(
            imgCol.select('classification_2022').eq(4)).add(
            imgCol.select('classification_2023').eq(4)).add(
            imgCol.select('classification_2024').eq(4)).add(
            imgCol.select('classification_2025').eq(4));

// Create a stable savanna mask for pixels appearing at least 4 times and present in 2024
var savan_estave = savan.gte(4).mask(imgCol.select('classification_2024').eq(4)).remap([1],[4]).selfMask();

// Calculate the temporal occurrence of Grassland (class 12) across the 2017-2025 period
var campo = imgCol.select('classification_2017').eq(12).add(
            imgCol.select('classification_2018').eq(12)).add(
            imgCol.select('classification_2019').eq(12)).add(
            imgCol.select('classification_2020').eq(12)).add(
            imgCol.select('classification_2021').eq(12)).add(
            imgCol.select('classification_2022').eq(12)).add(
            imgCol.select('classification_2023').eq(12)).add(
            imgCol.select('classification_2024').eq(12)).add(
            imgCol.select('classification_2025').eq(12));

// Create a stable grassland mask for pixels appearing at least 4 times and present in 2024
var campo_estave = campo.gte(4).mask(imgCol.select('classification_2024').eq(12)).remap([1],[12]).selfMask();

// Calculate the temporal occurrence of Rocky Outcrop (class 29) across the 2017-2025 period
var aflor = imgCol.select('classification_2017').eq(29).add(
            imgCol.select('classification_2018').eq(29)).add(
            imgCol.select('classification_2019').eq(29)).add(
            imgCol.select('classification_2020').eq(29)).add(
            imgCol.select('classification_2021').eq(29)).add(
            imgCol.select('classification_2022').eq(29)).add(
            imgCol.select('classification_2023').eq(29)).add(
            imgCol.select('classification_2024').eq(29)).add(
            imgCol.select('classification_2025').eq(29));

// Create a stable rocky outcrop mask for pixels appearing at least 5 times and present in 2024
var aflor_estave = aflor.gte(5).mask(imgCol.select('classification_2024').eq(29)).remap([1],[29]).selfMask();

// Calculate the temporal occurrence of Herbaceous Sandbank (class 50) across the 2017-2025 period
var resti = imgCol.select('classification_2017').eq(50).add(
            imgCol.select('classification_2018').eq(50)).add(
            imgCol.select('classification_2019').eq(50)).add(
            imgCol.select('classification_2020').eq(50)).add(
            imgCol.select('classification_2021').eq(50)).add(
            imgCol.select('classification_2022').eq(50)).add(
            imgCol.select('classification_2023').eq(50)).add(
            imgCol.select('classification_2024').eq(50)).add(
            imgCol.select('classification_2025').eq(50));

// Create a stable sandbank mask for pixels appearing at least 5 times and present in 2024
var resti_estave = resti.gte(5).mask(imgCol.select('classification_2024').eq(50)).remap([1],[50]).selfMask();

// Load the intermediate merged image from earlier in the workflow to check agricultural consistency
var antesRemp = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat/MA_S2_p72_merge_v4');
Map.addLayer(antesRemp, vis2, 'beforeRemap ', false);

// Identify pixels classified as temporary crops (19) or rice (9) in the intermediate data
var agro19_9 = antesRemp.eq(19).or(antesRemp.eq(9));
Map.addLayer(agro19_9, vis2, 'agriculture_9_19', false);

// Identify agricultural pixels currently classified as Mosaic (21) in the current image stack
var intersAgro_21 = agro19_9.and(imgCol.eq(21));
Map.addLayer(intersAgro_21, vis2, 'agriculture_intersect_mosaic', false);

// Calculate the occurrence frequency of these identified agricultural pixels across the time series
var agric = intersAgro_21.select('classification_2017').eq(1).add(
            intersAgro_21.select('classification_2018').eq(1)).add(
            intersAgro_21.select('classification_2019').eq(1)).add(
            intersAgro_21.select('classification_2020').eq(1)).add(
            intersAgro_21.select('classification_2021').eq(1)).add(
            intersAgro_21.select('classification_2022').eq(1)).add(
            intersAgro_21.select('classification_2023').eq(1)).add(
            intersAgro_21.select('classification_2024').eq(1)).add(
            intersAgro_21.select('classification_2025').eq(1));

// Create a stable agriculture mask for pixels appearing at least 4 times
var agric_estave = agric.gte(4).remap([1],[19]).selfMask();

// Calculate the temporal occurrence of Natural Wetland (class 11) across the 2017-2025 period
var varze = imgCol.select('classification_2017').eq(11).add(
            imgCol.select('classification_2018').eq(11)).add(
            imgCol.select('classification_2019').eq(11)).add(
            imgCol.select('classification_2020').eq(11)).add(
            imgCol.select('classification_2021').eq(11)).add(
            imgCol.select('classification_2022').eq(11)).add(
            imgCol.select('classification_2023').eq(11)).add(
            imgCol.select('classification_2024').eq(11)).add(
            imgCol.select('classification_2025').eq(11));

// Create a stable wetland mask for pixels appearing at least 7 times in the series
var varze_estave = varze.gte(7).remap([1],[11]).selfMask();

// Calculate the total number of thematic class changes per pixel throughout the series
var nChanges = imgCol.reduce(ee.Reducer.countRuns()).subtract(1);

// Add the count of transitions to the map to help identify noisy areas
Map.addLayer(nChanges, {'min': 0,'max': 6, 'palette': ["#ffffff","#fee0d2","#fcbba1",
            "#fb6a4a","#ef3b2c","#a50f15","#67000d"],'format': 'png'}, 'nChanges',false);

// Create an error mask for pixels with 5 or more changes, remapping them to Mosaic (class 21)
var erro_changes = nChanges.gte(5).remap([1],[21]);

// Add all generated stability and error masks to the map for visual validation
Map.addLayer(agric_estave, vis, 'stable_agriculture', false);
Map.addLayer(varze_estave, vis, 'stable_wetland', false);
Map.addLayer(erro_changes, {}, 'high_transition_error', false);
Map.addLayer(savan_estave, vis, 'stable_savanna', false);
Map.addLayer(campo_estave, vis, 'stable_grassland', false);
Map.addLayer(aflor_estave, vis, 'stable_outcrop', false);
Map.addLayer(resti_estave, vis, 'stable_sandbank', false);

// Define the sequence of years for the correction loop
var anos = [2017,2018,2019,2020,2021,2022,2023,2024,2025];

// Iterate through each year to apply the stabilization masks
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];

  // Select the classification band for the current year
  var class_ano = imgCol.select('classification_'+ano);

  // Standardize the annual classification by remapping specific intermediate codes
  var class_remap_ano = class_ano.remap([3,4,49,11,12,29, 9,19,21,22,23,24,25,33,50],
                                        [3,4,49,11,12,29,21,21,21,22,23,24,25,33,50]).rename('classification_'+ano);
                                        
  // Identify forest pixels in the current year to ensure they are preserved during blending
  var class_flo_ano = class_remap_ano.eq(3).remap([1],[3]);

  // Apply sequential blending to integrate stability masks and the high-transition error mask
  class_remap_ano = class_remap_ano.blend(erro_changes.rename('classification_'+ano))
                                   .blend(agric_estave.rename('classification_'+ano))
                                   .blend(varze_estave.rename('classification_'+ano))
                                   .blend(resti_estave.rename('classification_'+ano))
                                   .blend(aflor_estave.rename('classification_'+ano))
                                   .blend(campo_estave.rename('classification_'+ano))
                                   .blend(class_flo_ano.rename('classification_'+ano))
                                   .blend(savan_estave.rename('classification_'+ano));
                                   
  // Final standardization of classes after blending operations
  class_remap_ano = class_remap_ano.remap([3,4,49,11,12,29, 9,19,21,22,23,24,25,33,50],
                                          [3,4,49,11,12,29,21,21,21,22,23,24,25,33,50]).rename('classification_'+ano);

  // Accumulate the corrected year bands into a final multi-band image
  if (i_ano == 0){ 
      var class_corrigido = class_remap_ano;
  } else {
      class_corrigido = class_corrigido.addBands(class_remap_ano); 
  }
}

// Add the final stabilized multi-temporal classification to the map
Map.addLayer(class_corrigido, vis2, 'class_final_stabilized', true);

// Set standardized MapBiomas Collection 4 metadata for the resulting asset
class_corrigido = class_corrigido
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the stabilized multi-temporal classification to a Google Earth Engine Asset
Export.image.toAsset({
    'image': class_corrigido,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    // Use mode pyramiding for categorical data integrity
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});