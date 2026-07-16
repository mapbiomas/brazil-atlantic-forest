/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Remove spurious regeneration in stable areas at the beginning (2017) and end (2025) of the series.
 * 
 * DESCRIPTION:
 * This script addresses temporal inconsistencies in the Atlantic Forest classification series (2017-2025). 
 * It focuses on identifying and correcting "regeneration artifacts" that appear only in the first or last year.
 * Specifically, it identifies pixels that are classified as anthropic in 2017 but are natural and stable 
 * for the entire remainder of the series (2018-2025). Similarly, it identifies pixels that are anthropic 
 * and stable from 2017 to 2024 and only transition to natural in 2025. These single-year transitions 
 * are often classification noise. The script corrects these by reassigning the pixel value from the 
 * adjacent stable year.
 */

// Define the processing description in English
var description = 'Removes Regeneration in Stable Areas at the Beginning and End';
// Define the collection identifier as a float
var collection_id = 4.0;

// Define the target biome
var bioma = "MATAATLANTICA";
// Set reference year for visualization
var oneYear = 2025;

// Define the input and output versions as strings
var version_in = '8';
var version_out = '9';

// Define input and output prefixes for identifying assets
var prefixo_in = 'MA_S2_p83_v';
var prefixo_out = 'MA_S2_p84_v';

// Define the directory paths for input and output assets
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Define the geometry for the study area
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

// Import the MapBiomas palettes module for consistent visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for the land cover classification layers
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
// Visualization parameters for a specific year
var vis2 = {
    'bands': 'classification_' + oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define parameters for mosaic visualization using SWIR1, NIR, and Red bands
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'], gain: [0.08, 0.06, 0.2], gamma: 0.85};
// Import the mosaic module for Atlantic Forest Sentinel-2 processing
var mos = require('users/yasmingelli-arcplan/MapBiomas_SENTINELcol4_MA:passo01/01-01_Cria_MosaicoTotal');

// Define the time series range from 2017 to 2025
var anos = [
  2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
];

// Load the administrative regions of the Atlantic Forest for reference
var limite = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025");

// Loop through each year to load and display the Sentinel-2 mosaic for context
for (var i_ano=0; i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Get the mosaic for the specific year and region
  var mosaicoTotal = mos.getMosaic(ano, limite);

  // Add the mosaic to the map as a background layer
  Map.addLayer(mosaicoTotal.clip(limite.geometry()), visParMedian2, 'Img_Year_' + ano, false);
}

// Load the input multi-temporal classification image
var imgCol = ee.Image(dirout + prefixo_in + version_in);

// Add the original input classification to the map
Map.addLayer(imgCol, vis2, 'Original Input', false);
Map.addLayer(imgCol.select('classification_2024'), vis, 'Input 2024', false);

// Create a list of years for iteration
var anos_ee = ee.List.sequence(2017, 2025)
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });
                        
var n = anos_ee.size();                                                                                   
var ultimo = ee.Number(anos_ee.get(n.subtract(1)));        
var penult = ee.Number(anos_ee.get(n.subtract(2)));        
var prim = ee.Number(anos_ee.get(0));        
var seg = ee.Number(anos_ee.get(1));        

// Create a Level 0 classification (Natural [1] vs. Anthropic [10]) for all years
var nivel0 = ee.ImageCollection(anos_ee
               .map(function(ano){
                     var anoStr = ee.Number(ano).format();                      
                     var nomeBanda = ee.String('classification_').cat(anoStr);  
                     var class_ano = imgCol.select(nomeBanda);                  
                     // Remap classes to binary Level 0 categories
                     var nivel0_ano = class_ano.remap([3,4,11,12,29,50,21,22,23,24,25],     
                                                      [1,1, 1, 1, 1, 1,10,10,10,10,10])
                                               .rename(nomeBanda);              
                     return nivel0_ano;
                                  })).toBands();                                

// Define a function to clean up band names by stripping internal index prefixes
var corrIndx  = function (img){
                  var indxNames = img.bandNames();                              
                  var bandNames_clean = indxNames.map(function(nome){                 
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames, bandNames_clean);                     
                              };
nivel0 = corrIndx(nivel0);

/**
 * START-OF-SERIES CORRECTIONS (2017)
 * Detects pixels that are Anthropic in 2017 but are Natural from 2018 to 2025.
 */
var reg_primAno =  nivel0.select('classification_2017').eq(10)  
              .and(nivel0.select('classification_2018').eq(1))  
              .and(nivel0.select('classification_2019').eq(1))  
              .and(nivel0.select('classification_2020').eq(1))  
              .and(nivel0.select('classification_2021').eq(1))  
              .and(nivel0.select('classification_2022').eq(1))  
              .and(nivel0.select('classification_2023').eq(1))  
              .and(nivel0.select('classification_2024').eq(1))  
              .and(nivel0.select('classification_2025').eq(1));

/**
 * END-OF-SERIES CORRECTIONS (2025)
 * Detects pixels that are Anthropic from 2017 to 2024 and transition to Natural only in 2025.
 */
var reg_ultAno  =  nivel0.select('classification_2017').eq(10)  
              .and(nivel0.select('classification_2018').eq(10))  
              .and(nivel0.select('classification_2019').eq(10))  
              .and(nivel0.select('classification_2020').eq(10))  
              .and(nivel0.select('classification_2021').eq(10))  
              .and(nivel0.select('classification_2022').eq(10))  
              .and(nivel0.select('classification_2023').eq(10))  
              .and(nivel0.select('classification_2024').eq(10))  
              .and(nivel0.select('classification_2025').eq(1));

// Process the image collection and apply the masks to correct single-year regeneration
var class_final = ee.ImageCollection(anos_ee
                    .map(function(ano){
                          ano = ee.Number(ano);
                          var anoStr = ano.format();
                          var class_ano = imgCol.select(ee.String('classification_').cat(anoStr));

                          // Determine the replacement pixels for artifacts in the first and last year
                          var corrPri = imgCol.select(ee.String('classification_').cat(seg)).mask(reg_primAno);
                          var corrUlt = imgCol.select(ee.String('classification_').cat(penult)).mask(reg_ultAno);

                          // Conditional correction logic based on the year index
                          var class_corr = ee.Image(
                            ee.Algorithms.If(ano.eq(2017),
                              // Correct 2017 by blending values from 2018
                              imgCol.select(ee.String('classification_').cat(prim)).blend(corrPri.rename('classification_2017')),
                                       
                            ee.Algorithms.If(ano.eq(ultimo),
                              // Correct 2025 by blending values from 2024
                              imgCol.select(ee.String('classification_').cat(ultimo)).blend(corrUlt.rename(ee.String('classification_').cat(ultimo))),
                              
                            // For intermediate years, no change is applied
                            class_ano
                            ))
                          );

                          return class_corr.rename(ee.String('classification_').cat(anoStr));
})).toBands();

// Standardize the resulting band names
class_final = corrIndx(class_final);
print('Final Corrected Image', class_final);

// Add the final corrected classification to the map
Map.addLayer(class_final, vis2, 'Final Corrected', false);
Map.addLayer(class_final.select('classification_2024'), vis, 'Final 2024', false);

// Create a mask to visualize where changes occurred between the original and corrected image
var efeito = imgCol.select('classification_' + oneYear).neq(class_final.select('classification_' + oneYear));
Map.addLayer(efeito, {min: 0, max: 1, palette: 'black, red'}, 'Correction Mask');

// Set standardized MapBiomas Collection 4 metadata properties for the output asset
class_final = class_final
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the multi-band final classification to a Google Earth Engine Asset
Export.image.toAsset({
    'image': class_final,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    // Use mode pyramiding suitable for categorical data
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});