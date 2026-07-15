/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Applies a correction on the stable samples based on reference data, Mapbiomas Alerta data and GEDI data.
 * 
 * DESCRIPTION: 
 * This script filters the stable samples with:
 * [a] the published MapBiomas alert data;
 * [b] the reference maps from 4 brazilian states (SP, PR, MG and ES) and
 * [c] the GEDI data.
 * 
 * The MapBiomas Alert data is used to remove any overlapping pixel as a stable sample.
 * 
 * The reference data from 4 Brazilian states are remapped to match the classes from stable samples (3, 4, 9, 11, 12, 21, 22, 33, 50).
 * Comparing each state data with the stable samples data, two analysis are made:
 * [b1] if in any data there is a *21 class* that overlaps another *non 21 class*, this pixel is removed from the stable samples;
 * [b2] if in any data there is a *3 class* that overlaps another *non 3 class*, this pixel is removed from the stable samples.
 * 
 * The GEDI (Global Ecosystem Dynamics Investigation) is filtered in two different canopy heights:
 * [c1] canopy height greater than or equal to 9 that overlaps stable samples with the class 3 are remapped to 3;
 * [c2] canopy height lower than 7 that overlaps other classes different of 3 in data sample are remapped to these classes.
 * These filters separate forests (3) from the other classes (4, 9, 11, 12, 21, 22, 29, 33, 50) based on canopy height.
 * 
 * This script uses an input data from the previous script (01-10).
 * The output data from this script is used on another script (02-20) as an input.
 */

// Load the collection of MapBopmas alerts. Alerts downloaded in 2025-02-05.
var db_alertas = ee.FeatureCollection("projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/STABLE/MATAATLANTICA/alertas_20260428");

//
// GENERAL INPUTS
//
{
// Define the output directory.
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/STABLE/MATAATLANTICA/';
// Define the input version of stable areas.
var v_estavel_in = '1';
// Define the output version.
var versao_out = '2';

// Define current collection
var colN = '10'

// Define one year for visualization.
var oneYear = 2020;

// Import the palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters.
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};

// Load the MapBiomas Collection 10.
var col = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1');

// Add the classification to the map.
Map.addLayer(col.select('classification_'+oneYear), vis, 'Col. '+colN+' '+oneYear, false);

// Load image representing stable areas from Collection 9. (from previous script)
var estaveis = ee.Image(dirout+'MA_amostras_estaveis85a24_col'+colN+'_v'+v_estavel_in);

// Add the stable areas to the map.
Map.addLayer(estaveis, vis, 'Estaveis_v'+v_estavel_in+' col'+colN, false);
}

//
// *** MAPBIOMAS ALERTS ***
//
{
// Print values for Biome and year of detection from the alerts FeatureCollection.
print(db_alertas.aggregate_array("BIOMA").distinct());
print(db_alertas.aggregate_array("ANODETEC").distinct());

// Filter alerts to include only those before 2025 and located in the Atlantic Forest biome.
var alertas = db_alertas.filter(ee.Filter.lt('ANODETEC', 2025))
                        .filter(ee.Filter.eq('BIOMA', 'Mata Atlântica'));
                          
// Create an image from the filtered alerts, assigning value 27 to alert locations.
var alertasImg = ee.Image().byte().paint(alertas, 27).rename('reference');
// Reproject the alerts image to match the projection and scale of the stable areas image.
alertasImg = alertasImg.reproject({crs: estaveis.projection(), scale: 30});
// Add alerts to the map.
Map.addLayer(alertasImg, {}, 'resample', false);

// Create a mask from the alerts image, where non-alert pixels are masked.
var mask = alertasImg
                  .unmask()          // transforms the masked pixels of 'alertsImg' into 0
                  .neq(27);          // creates binary layer where it keeps values   ​​different from 27, mask = 1 -> (true  == 1)
                                     //                               removes values ​​equal to 27,       mask = 0 -> (false == 0)
// Apply the mask to the stable areas image, removing areas with alerts.
var estAlertas = estaveis
                  .updateMask(mask); // removes all pixels where 'mask' == 0 (i.e. where there were 27 in 'alertsImg'
                       
// Add the mask and the masked stable areas image to the map.
Map.addLayer(mask, {}, 'unmasked', false);
Map.addLayer(estAlertas, vis, 'Estaveis sem alerta', false);
}

//
// *** 4 BRAZILIAN STATES REFERENCE MAPS ***
//

// Define a function to remap LULC classes.
var remapSTtoMA = function (image){
        return image.remap(
                  [3, 5,49, 4, 9,11,12,29,32,15,18,19,20,21,36,39,40,41,46,47,48,22,23,24,25,30,26,31,33,50],
                  [3, 3, 3, 4, 9,11,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,33,33,33,50]);
};

// Load reference data from 4 brazilian states (MG, ES, PR and SP)

// *** MG ***
// Load IEF data for Minas Gerais state (MG).
var IEF_MG = ee.ImageCollection('projects/mapbiomas-workspace/VALIDACAO/MATA_ATLANTICA/MG_IEF').mosaic();
    IEF_MG = remapSTtoMA(IEF_MG).clip(MG);    // Remap IEF_MG class values.
Map.addLayer(IEF_MG, vis, 'IEF_MG', false);   // Add the IEF_MG layer to the map.

// *** ES ***
// Load SEMA data for Espírito Santo state (ES).
var SEMA_ES = ee.Image('projects/mapbiomas-workspace/MAPA_REFERENCIA/MATA_ATLANTICA/ES_SEMA_IDMapBiomas_15m');
    SEMA_ES = remapSTtoMA(SEMA_ES);           // Remap SEMA_ES class values.
Map.addLayer(SEMA_ES, vis,'SEMA_ES', false);  // Add the SEMA_ES layer to the map.

// *** PR ***
// Load SEMA data for Paraná state (PR).
var SEMA_PR = ee.Image('projects/mapbiomas-workspace/MAPA_REFERENCIA/MATA_ATLANTICA/PR_Sema_LULC_10m_ids_MapBiomas3');
    SEMA_PR = remapSTtoMA(SEMA_PR);           // Remap SEMA_PR class values.
Map.addLayer(SEMA_PR, vis, 'SEMA_PR', false); // Add the SEMA_PR layer to the map.

// *** SP ***
// Load SEMA data for São Paulo state (SP).
var SEMA_SP = ee.Image('projects/mapbiomas-workspace/MAPA_REFERENCIA/MATA_ATLANTICA/SP_IF_2020_2');
    SEMA_SP = remapSTtoMA(SEMA_SP);           // Remap SEMA_SP class values.
Map.addLayer(SEMA_SP, vis, 'SEMA_SP', false); // Add the SEMA_SP layer to the map.

// Create a mosaic of the reference data from 4 states.
var refEstados = ee.ImageCollection.fromImages([IEF_MG,SEMA_ES,SEMA_PR,SEMA_SP]).mosaic();
Map.addLayer(refEstados, vis, 'Referência', false); // Add to the map.

// Applying corrections on these reference data.
// Define functions to remove pixels as stable samples in the reference data.

// 'apaga21': *21 class* that overlaps another *non 21 class*, this pixel is removed from the stable samples.
var apaga21 = function(image){
       return image.remap([3,4,9,11,12,13,29,22],[100,100,100,100,100,100,100,100])
                   .add(estaveis)
                   .remap([121],[27]);
};
// 'apaga03': *3 class* that overlaps another *non 3 class*, this pixel is removed from the stable samples.
var apaga03 = function (image) {
       return image.remap([4,9,11,12,13,29,21,22],[100,100,100,100,100,100,100,100])
                   .add(estaveis)
                   .remap([103],[27]);
};
// 'complemento': keep classes 11, 12 and as they are.
var complemento = function (image) {
           return image.remap([11,12,29],[11,12,29]);
};

// Blend the corrections for each state.
var correctedMG = apaga21(IEF_MG) .blend(apaga03(IEF_MG)) .blend(complemento(IEF_MG));
var correctedSP = apaga21(SEMA_SP).blend(apaga03(SEMA_SP)).blend(complemento(SEMA_SP));
var correctedES = apaga21(SEMA_ES).blend(apaga03(SEMA_ES)).blend(complemento(SEMA_ES));
var correctedPR = apaga21(SEMA_PR).blend(apaga03(SEMA_PR)).blend(complemento(SEMA_PR));

// Blend the corrected reference data with the masked stable areas image.
var estUFs = estAlertas.blend(correctedMG)
                       .blend(correctedSP)
                       .blend(correctedES)
                       .blend(correctedPR);

//
// *** GEDI ***
//

// Load GEDI data and clip to geometry.
var GEDI = ee.Image('users/potapovpeter/GEDI_V27/GEDI_SAM_v27').clip(limite_MA2).rename('GEDI');

// Define visualization parameters for GEDI.
var imageVisGEDI = {"min": 0,"max": 15,"palette":["c9f5f1","#ffbeee","#daffe0","#c0debf","08ff04","#037e07","0b240a"]};
// Add the GEDI layer to the map.
Map.addLayer(GEDI, imageVisGEDI,'GEDI', false);

// Classify GEDI data into forest (floresta) and non-forest (campo).
// Forest (floresta): Canopy height greater than or equal to 9m. Remap to 100.
var ma_flo_gedi = GEDI.gte(9).remap([1],[100],0);
Map.addLayer(ma_flo_gedi, {"palette":["037e07"]},'GEDI_Floresta', false);
// Non-forest (campo): Canopy height lower than 7m. Remap to 200.
var ma_cam_gedi = GEDI.lt(7).remap([1],[200],0);
Map.addLayer(ma_cam_gedi, {"palette":["806316"]},'GEDI_Campo', false);
 
// Final steps.

// Combine the processed data from the stable areas (Alert + UF) with GEDI data.
var estGEDI = estUFs.add(ma_flo_gedi).add(ma_cam_gedi);
Map.addLayer(estGEDI, vis, 'estGEDI', false);

// Remap values in the combined data.
estGEDI = estGEDI.remap(
  [104,111,112,113,121,122,129,133,150,203,103,204,109,209,211,212,221,222,229,233,250],
  [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  3,  4,  9,  9, 11, 12, 21, 22, 29, 33, 50],0 ).rename('reference');

// Add GEDI stable layer to the map.
Map.addLayer(estUFs, vis, 'estaveis_v2', false);
Map.addLayer(estGEDI, vis, 'estGEDIremap', true);
Map.addLayer(alertasImg,{'palette':'red'}, 'Alertas_image', false);
// Export the final stable samples image to an asset.
Export.image.toAsset({
    "image": estGEDI.toInt8(),
    "description": 'MA_amostras_estaveis85a24_col'+colN+'_v'+versao_out,
    "assetId": dirout + 'MA_amostras_estaveis85a24_col'+colN+'_v'+versao_out,
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": limite_MA2
});  
