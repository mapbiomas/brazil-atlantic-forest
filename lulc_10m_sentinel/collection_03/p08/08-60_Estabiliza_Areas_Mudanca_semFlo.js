/**
 * This script stabilizes non-forest land cover classes across the time series.
 * It flags high-frequency classification runs as anomalies and applies consistency rules.
 * The stable masks are blended iteratively by year and saved as an asset.
 */

var description = 'Estabiliza Area de Mudanca sem Floresta (3)'
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";
// Define input and output version numbers
var vesion_in = '18';
var version_out = '19';

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p85_v';
var prefixo_out = 'MA_S2_p86_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Output directory


// Load the input image from the specified asset path
var imgCol =  ee.Image(dirout + prefixo_in + vesion_in);

// Import the palettes module for visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for the classification layer
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
var vis2 = {
    'bands': 'classification_2020',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Add the classification layer for 2022 to the map
Map.addLayer(imgCol, vis2, 'imgCol ', true);

// Create a composite image for savanna class from 2016 to 2023
var savan = imgCol.select('classification_2017').eq(4).add(
            imgCol.select('classification_2018').eq(4)).add(
            imgCol.select('classification_2019').eq(4)).add(
            imgCol.select('classification_2020').eq(4)).add(
            imgCol.select('classification_2021').eq(4)).add(
            imgCol.select('classification_2022').eq(4)).add(
            imgCol.select('classification_2023').eq(4)).add(
            imgCol.select('classification_2024').eq(4));

// Create a mask for savanna class in 2023 and apply it to the composite
var savan_estave = savan.gte(4).mask(imgCol.select('classification_2024').eq(4)).remap([1],[4]).selfMask();

// // Create a composite image for forest class from 2016 to 2023
// var flore = imgCol.select('classification_2016').eq(3).add(
//             imgCol.select('classification_2017').eq(3)).add(
//             imgCol.select('classification_2018').eq(3)).add(
//             imgCol.select('classification_2019').eq(3)).add(
//             imgCol.select('classification_2020').eq(3)).add(
//             imgCol.select('classification_2021').eq(3)).add(
//             imgCol.select('classification_2022').eq(3)).add(
//             imgCol.select('classification_2023').eq(3));
// // Create a mask for forest class in 2023 and 2022 and apply it to the composite
// var flore_estave = flore.gte(6).mask(imgCol.select('classification_2023').eq(3)).mask(imgCol.select('classification_2022').eq(3)).remap([1],[3]).selfMask();

// Create a composite image for pasture class from 2016 to 2023
var campo = imgCol.select('classification_2017').eq(12).add(
            imgCol.select('classification_2018').eq(12)).add(
            imgCol.select('classification_2019').eq(12)).add(
            imgCol.select('classification_2020').eq(12)).add(
            imgCol.select('classification_2021').eq(12)).add(
            imgCol.select('classification_2022').eq(12)).add(
            imgCol.select('classification_2023').eq(12)).add(
            imgCol.select('classification_2024').eq(12));

// Create a mask for pasture class in 2023 and apply it to the composite
var campo_estave = campo.gte(4).mask(imgCol.select('classification_2024').eq(12)).remap([1],[12]).selfMask();

// Create a composite image for outcrop class from 2016 to 2023
var aflor = imgCol.select('classification_2017').eq(29).add(
            imgCol.select('classification_2018').eq(29)).add(
            imgCol.select('classification_2019').eq(29)).add(
            imgCol.select('classification_2020').eq(29)).add(
            imgCol.select('classification_2021').eq(29)).add(
            imgCol.select('classification_2022').eq(29)).add(
            imgCol.select('classification_2023').eq(29)).add(
            imgCol.select('classification_2024').eq(29));

// Create a mask for outcrop class in 2023 and apply it to the composite
var aflor_estave = aflor.gte(5).mask(imgCol.select('classification_2024').eq(29)).remap([1],[29]).selfMask();

// Create a composite image for non-vegetated class from 2016 to 2023
var resti = imgCol.select('classification_2017').eq(50).add(
            imgCol.select('classification_2018').eq(50)).add(
            imgCol.select('classification_2019').eq(50)).add(
            imgCol.select('classification_2020').eq(50)).add(
            imgCol.select('classification_2021').eq(50)).add(
            imgCol.select('classification_2022').eq(50)).add(
            imgCol.select('classification_2023').eq(50)).add(
            imgCol.select('classification_2024').eq(50));

// Create a mask for non-vegetated class in 2023 and apply it to the composite
var resti_estave = resti.gte(5).mask(imgCol.select('classification_2024').eq(50)).remap([1],[50]).selfMask();

// Load the baseline merged dataset prior to remapping
var antesRemp = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p72_merge_v12')
Map.addLayer(antesRemp, vis2, 'antesRemp ', false);

// Identify historical locations of specific agricultural classes
var agro19_9 = antesRemp.eq(19).or(antesRemp.eq(9))
Map.addLayer(agro19_9, vis2, 'agro19_9', false)

// Intersect historical classes with current general agriculture
var intersAgro_21 = agro19_9.and(imgCol.eq(21))
Map.addLayer(intersAgro_21, vis2, 'intersAgro_21', false)

// Create a composite image for agriculture class from 2016 to 2023
var agric = intersAgro_21.select('classification_2017').eq(1).add(
            intersAgro_21.select('classification_2018').eq(1)).add(
            intersAgro_21.select('classification_2019').eq(1)).add(
            intersAgro_21.select('classification_2020').eq(1)).add(
            intersAgro_21.select('classification_2021').eq(1)).add(
            intersAgro_21.select('classification_2022').eq(1)).add(
            intersAgro_21.select('classification_2023').eq(1)).add(
            intersAgro_21.select('classification_2024').eq(1));

// Create a mask for agriculture class in 2023 and apply it to the composite
var agric_estave = agric.gte(4).remap([1],[19]).selfMask();

// Create a composite image for flooded vegetation class from 2016 to 2023
var varze = imgCol.select('classification_2017').eq(11).add(
            imgCol.select('classification_2018').eq(11)).add(
            imgCol.select('classification_2019').eq(11)).add(
            imgCol.select('classification_2020').eq(11)).add(
            imgCol.select('classification_2021').eq(11)).add(
            imgCol.select('classification_2022').eq(11)).add(
            imgCol.select('classification_2023').eq(11)).add(
            imgCol.select('classification_2024').eq(11));

// Create a mask for flooded vegetation class in 2023 and apply it to the composite
var varze_estave = varze.gte(7).remap([1],[11]).selfMask();

// Calculate the number of changes in the classification over time
var nChanges = imgCol.reduce(ee.Reducer.countRuns()).subtract(1);

// Add the change count layer to the map for visualization
Map.addLayer(nChanges, {'min': 0,'max': 6, 'palette': ["#ffffff","#fee0d2","#fcbba1",
            "#fb6a4a","#ef3b2c","#a50f15","#67000d"],'format': 'png'}, 'nChanges',false);

// Create a mask for areas with more than 4 changes
var erro_changes = nChanges.gte(5).remap([1],[21]);

// Add the masked layers to the map for visualization
Map.addLayer(agric_estave, vis, 'agric_estave', false);
Map.addLayer(varze_estave, vis, 'varze_estave', false);
Map.addLayer(erro_changes, {}, 'erro_changes', false);
Map.addLayer(savan_estave, vis, 'savan_estave', false);
// Map.addLayer(flore_estave, vis, 'flore_estave', false);
Map.addLayer(campo_estave, vis, 'campo_estave', false);
Map.addLayer(aflor_estave, vis, 'aflor_estave', false);
Map.addLayer(resti_estave, vis, 'resti_estave', false);

// Define an array of years for processing
var anos = [2017,2018,2019,2020,2021,2022,2023,2024];

// Loop through each year and apply corrections to the classification
for (var i_ano=0;i_ano<anos.length; i_ano++){
  // Extract integer loop year
  var ano = anos[i_ano];

  // Select the classification band for the current year
  var class_ano = imgCol.select('classification_'+ano);

  // Remap specific classes to adjust transitions
  var class_remap_ano = class_ano.remap([3,4,49,11,12,29, 9,19,21,22,33,50],
                                        [3,4,49,11,12,29,21,21,21,22,33,50]).rename('classification_'+ano);
                                        
  // Create a mask for forest class in the current year
  var class_flo_ano = class_remap_ano.eq(3).remap([1],[3]);

  // Blend the corrected classification with the masked layers
  class_remap_ano = class_remap_ano.blend(erro_changes.rename('classification_'+ano))
                                   .blend(agric_estave.rename('classification_'+ano))
                                   .blend(varze_estave.rename('classification_'+ano))
                                   .blend(resti_estave.rename('classification_'+ano))
                                   .blend(aflor_estave.rename('classification_'+ano))
                                   .blend(campo_estave.rename('classification_'+ano))
                                   .blend(class_flo_ano.rename('classification_'+ano))
                                   .blend(savan_estave.rename('classification_'+ano));
                                   
  class_remap_ano = class_remap_ano.remap([3,4,49,11,12,29, 9,19,21,22,33,50],
                                          [3,4,49,11,12,29,21,21,21,22,33,50]).rename('classification_'+ano);

  // Combine the corrected classification bands for each year
  if (i_ano == 0){ var class_corrigido = class_remap_ano }  
  else {class_corrigido = class_corrigido.addBands(class_remap_ano); }
}

// Add the corrected classification layer to the map for visualization
Map.addLayer(class_corrigido, vis2, 'class_corrigido', true);

// Load intermediate verification and map progression version layers
var p50_v10       = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p50_v10')
var p60_v11       = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p60_v11')
var p72_merge_v12 = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p72_merge_v12')
var p73_remap_v13 = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p73_remap_v13')
var p81_v14       = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p81_v14')
var p82_v15       = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p82_v15')
var p83_v16       = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p83_v16')
var p84_v17       = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p84_v17')
var p85_v18       = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p85_v18')
var p86_v19       = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/MA_S2_p86_v19')

// Display the historical progression map versions
Map.addLayer(p50_v10      , vis2, 'p50_v10      ', true);
Map.addLayer(p60_v11      , vis2, 'p60_v11      ', true);
Map.addLayer(p72_merge_v12, vis2, 'p72_merge_v12', true);
Map.addLayer(p73_remap_v13, vis2, 'p73_remap_v13', true);
Map.addLayer(p81_v14      , vis2, 'p81_v14      ', true);
Map.addLayer(p82_v15      , vis2, 'p82_v15      ', true);
Map.addLayer(p83_v16      , vis2, 'p83_v16      ', true);
Map.addLayer(p84_v17      , vis2, 'p84_v17      ', true);
Map.addLayer(p85_v18      , vis2, 'p85_v18      ', true);
Map.addLayer(p86_v19      , vis2, 'p86_v19      ', true);






// Map.setCenter(-40.84541, -15.41185,20)
// Set metadata for the corrected classification image
class_corrigido = class_corrigido
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': class_corrigido,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});
