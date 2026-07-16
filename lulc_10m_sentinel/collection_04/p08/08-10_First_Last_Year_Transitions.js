/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Correct temporal noise in land cover classification at the beginning and end of the 2017-2025 series.
 * 
 * DESCRIPTION:
 * This script identifies and filters small spatial noise related to deforestation and regeneration 
 * transitions occurring between the first two years (2017-2018) and the last two years (2024-2025) 
 * of the Sentinel-2 classification series for the Atlantic Forest. 
 * By simplifying the legend into "Natural" and "Anthropic" (Level 0), the script detects changes 
 * that are spatially inconsistent (less than 1 or 2 hectares) and corrects them by blending the 
 * stable thematic class from the neighboring year. This ensures that the start and end of the 
 * time series are not affected by isolated pixel artifacts that could misrepresent land cover dynamics.
 */

// Define the processing description in English
var description = 'Corrects noise at the beginning and end of the series';
// Define the collection identifier as a float
var collection_id = 4.0;

// Define the target biome identifier
var bioma = "MATAATLANTICA";

// Define input and output versions as strings in single quotes
var version_in = '5';
var version_out = '6';

// Define the input and output prefixes for asset identification
var prefixo_in = 'MA_S2_p73_remap_v';
var prefixo_out = 'MA_S2_p81_v';

// Redefine description for detailed metadata
var description = 'Corrects small deforestation and regeneration noise - First and Last year';

// Define input and output directory paths
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Define the study area geometry
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
          [-34.26164380152852, -4.801825741437062],
          [-35.66789380152852, -4.582835761516412],
          [-49.07121411402852, -16.947367124654484],
          [-56.10246411402852, -21.01873071079243]]]);

// Import the MapBiomas palettes module for visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

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

// Load the Atlantic Forest regional boundaries for map overlay
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025");
Map.addLayer(regioesCollection, {}, "Mata Atlantica Regions");

// Merge regional boundaries and Fernando de Noronha into a single processing geometry
var geometry_limit = regioesCollection.merge(noronha);
Map.addLayer(geometry_limit, {}, "Mata Atlantica Boundary");

// Load the input multi-temporal classification image and handle missing values
var imgCol =  ee.Image(dir_in + prefixo_in + version_in).unmask(24);
Map.addLayer(imgCol, vis2, 'imgCol', false);

// Create a chronological list of years from 2017 to 2025
var anos = ee.List.sequence(2017, 2025)                 
                  .map(function(y){                                                     
                        return ee.Number(y).int(); }); 
var n      = anos.size();                                                                            
var ultimo = ee.Number(anos.get(n.subtract(1)));        
var penult = ee.Number(anos.get(n.subtract(2)));        

// Generate a simplified "Level 0" classification stack (Natural vs. Anthropic)
var nivel0 = ee.ImageCollection(anos
               .map(function(ano){
                     var anoStr = ee.Number(ano).format();                                
                     var nomeBanda = ee.String('classification_').cat(anoStr);            
                     var class_ano = imgCol.select(nomeBanda);                            
                     // Map natural classes to 1 and anthropic/urban/agriculture to 10
                     var nivel0_ano = class_ano.remap([3,4,11,12,29,50,21,22,23,24,25],      
                                                      [1,1, 1, 1, 1, 1,10,10,10,10,10])
                                               .rename(nomeBanda);                        
                     return nivel0_ano;
                                  })).toBands();                                

// Define a function to correct band indices added by the .toBands() operation
var corrIndx  = function (img){
                  var indxNames = img.bandNames();                              
                  var bandNames = indxNames.map(function(nome){                 
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames,bandNames);                     
                              };
nivel0 = corrIndx(nivel0);

// REFINEMENT FOR THE LAST YEARS OF THE SERIES //
// Select level 0 data for the final years (2024 and 2025)
var nivel0_ult = nivel0.select(ee.String('classification_').cat(ultimo));   
var nivel0_pen = nivel0.select(ee.String('classification_').cat(penult));   

// Detect small deforestation noise patches (less than 0.5 hectares)
var desmat = nivel0_ult.eq(10)    
        .and(nivel0_pen.eq(1));    

var conectedDesmat = desmat.selfMask()                         
                           .connectedPixelCount(51, true)
                           .reproject('epsg:4326', null, 10);
                            
var desmat1ha = conectedDesmat.lte(50);                                         
var ruidoDesmat_pen = imgCol.select(ee.String('classification_').cat(penult))
                            .updateMask(desmat1ha);                             

// Detect small regeneration noise patches (less than 0.5 hectares)
var regen = nivel0_ult.eq(1)    
     .and(nivel0_pen.eq(10));    

var conectedRegen = regen.selfMask()                         
                         .connectedPixelCount(51,true)
                         .reproject('epsg:4326', null, 10);
                         
var regen2ha = conectedRegen.lte(50);                                         
var ruidoRegen_pen = imgCol.select(ee.String('classification_').cat(penult))
                           .updateMask(regen2ha);                             

// REFINEMENT FOR THE START OF THE SERIES //
// Select level 0 data for the early years (2017, 2018, 2019)
var nivel0_pri = nivel0.select('classification_2017');
var nivel0_seg = nivel0.select('classification_2018');
var nivel0_ter = nivel0.select('classification_2019');

// Correct small deforestation artifacts in the first year
var desmat_pri = nivel0_pri.eq(1)
        .and(nivel0_seg.eq(10));

var conectedDesmat_pri = desmat_pri.selfMask()
                           .connectedPixelCount(101,true)
                           .reproject('epsg:4326', null, 10);
                           
var desmat2ha_pri = conectedDesmat_pri.lte(100);
var ruidoDesmat_pri = imgCol.select('classification_2018').updateMask(desmat2ha_pri);

// Correct small regeneration artifacts in the first year
var regen_pri = nivel0_pri.eq(10)
       .and(nivel0_seg.eq(1));

var conectedregen_pri = regen_pri.selfMask()
                         .connectedPixelCount(101,true)
                         .reproject('epsg:4326', null, 10);
                         
var regen1ha_pri = conectedregen_pri.lte(100);
var ruidoRegen_pri = imgCol.select('classification_2018').updateMask(regen1ha_pri);

// Create the final corrected multi-temporal classification stack
var class_final = ee.ImageCollection((anos)
                    .map(function(ano){
                          ano = ee.Number(ano);
                          var anoStr = ano.format();
                          var imgCol_mask_ano = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat/MA_S2_p73_remap_v5')
                                                  .select(ee.String('classification_').cat(anoStr)).mask();
                          var class_ano = imgCol.select(ee.String('classification_').cat(anoStr));

                          // Apply noise corrections specifically for 2017 and 2025
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

                          return class_corr.rename(ee.String('classification_').cat(anoStr)).mask(imgCol_mask_ano);
})).toBands();

// Clean the resulting band names
class_final = corrIndx(class_final);
print(class_final);

Map.addLayer(class_final, vis2, 'class_final', false);

// Generate a layer showing where changes were made to visualize the filter effect for 2017
var efeito = imgCol.select('classification_2017').neq(class_final.select('classification_2017'));
Map.addLayer(efeito, {min: 0, max: 1, palette: 'black, red'}, 'Correction Mask (2017)');

// Assign standardized metadata for Collection 4 output
class_final = class_final
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the filtered multi-temporal classification as a Google Earth Engine Asset
Export.image.toAsset({
    'image': class_final,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});