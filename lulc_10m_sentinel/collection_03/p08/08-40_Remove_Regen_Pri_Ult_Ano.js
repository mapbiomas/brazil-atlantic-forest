/**
 * This script filters temporal edge noise in the first and last years of the dataset.
 * It targets false regeneration spikes occurring strictly on time series boundaries.
 * Boundary noise anomalies are corrected using data from adjacent stable timeline years.
 */

var description = 'Remove Regeneracao em Area Estavel no Inicio e Fim'
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define input and output version numbers
var vesion_in = '16';
var version_out = '17';

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p83_v';
var prefixo_out = 'MA_S2_p84_v';


// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Output directory

// Import the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for the classification map
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
}
var vis2 = {
    'bands':'classification_2017',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define visualization settings for RGB composites
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'],gain: [0.08, 0.06, 0.2],gamma: 0.85}
// Import the module to retrieve image mosaics
var mos = require('users/yasmingelli-arcplan/MapBiomas_SENTINELcol3_MA:passo01/01-01_Cria_MosaicoTotal')

// Define the years to process (2016-2023)
var anos = [
  2017,2018,2019,2020,2021,2022,2023,2024
]

// Load regional boundaries feature collection
var limite = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Loop through each year.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  // Extract current loop index year
  var ano = anos[i_ano];
  
  // Fetch total mosaic for target year and bounds
  var mosaicoTotal = mos.getMosaic(ano,limite);

  // ALL EMBEDDING BANDS + 20 MOST IMPORTANTS FROM SENTINEL2

  //var BDamostras = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/col9/MATA_ATLANTICA/teste/REGIONs_'+regiaoID+'_'+ano)
  
  // Display baseline annual mosaic on map
  Map.addLayer(mosaicoTotal.clip(limite.geometry()), visParMedian2, 'Img_Year_'+ano, false);
}

// Load the input Landsat 8 image
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in);
// Add the input image to the map
Map.addLayer(imgCol, vis2, 'imgCol', false);

// Create a list of years (update here and the rest of the code adjusts automatically).
var anos = ee.List.sequence(2017, 2024)                 // Creates a list of years from A to B.
                  .map(function(y){                                                                     
                        return ee.Number(y).int(); });  // Turns each value in the list into an integer number.
var n      = anos.size();                               // List size.                                                                    
var ultimo = ee.Number(anos.get(n.subtract(1)));        // Gets the last value in the list.
var penult = ee.Number(anos.get(n.subtract(2)));        // Gets the second-to-last value in the list.
var prim = ee.Number(anos.get(n.subtract(n)));        // Gets the second-to-last value in the list.
var seg = ee.Number(anos.get(n.subtract(n.subtract(1))));        // Gets the second-to-last value in the list.

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

var corrIndx  = function (img){
                  var indxNames = img.bandNames();                              // 'bandNames' creates an 'ee.List' from bands in an 'ee.Image'.
                  var bandNames = indxNames.map(function(nome){                 // Removes the index created by '.toBands()'.
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                                      
                    return img.select(indxNames,bandNames);                     // Replaces bands with 'XX_' created by '.toBands()' with clean names.
                              };
// Standardize band names for level 0 collection
nivel0 = corrIndx(nivel0);

// LASTS YEARS CORRECTIONS //
// Select the level 0 classifications for the lasts three years.

// Correct small DEFORESTATION areas.
// Identify pixels that are anthropic in the first year but natural afterward
var reg_primAno =  nivel0.select(ee.String('classification_2017')).eq(10)  
              .and(nivel0.select(ee.String('classification_2018')).eq(1))  
              .and(nivel0.select(ee.String('classification_2019')).eq(1))  
              .and(nivel0.select(ee.String('classification_2020')).eq(1))  
              .and(nivel0.select(ee.String('classification_2021')).eq(1))  
              .and(nivel0.select(ee.String('classification_2022')).eq(1))  
              .and(nivel0.select(ee.String('classification_2023')).eq(1))  
              .and(nivel0.select(ee.String('classification_2024')).eq(1))  

              
            // Map.addLayer(reg_primAno, {}, 'reg_primAno')

// Identify pixels that are anthropic until the penultimate year but natural in the last year
var reg_ultAno  =  nivel0.select(ee.String('classification_2017')).eq(10)  
              .and(nivel0.select(ee.String('classification_2018')).eq(10))  
              .and(nivel0.select(ee.String('classification_2019')).eq(10))  
              .and(nivel0.select(ee.String('classification_2020')).eq(10))  
              .and(nivel0.select(ee.String('classification_2021')).eq(10))  
              .and(nivel0.select(ee.String('classification_2022')).eq(10))  
              .and(nivel0.select(ee.String('classification_2023')).eq(10))  
              .and(nivel0.select(ee.String('classification_2024')).eq(1))  
            
            // Map.addLayer(reg_ultAno, {}, 'reg_ultAno')

        
// Create a corrected image collection.
var class_final = ee.ImageCollection((anos)
                    .map(function(ano){
                          ano = ee.Number(ano);
                          var anoStr = ano.format();
                          var class_ano = imgCol.select(ee.String('classification_').cat(anoStr));

                          // Create correction layer for first year anomalies using second year data
                          var corrPri = imgCol.select(ee.String('classification_').cat(seg)).mask(reg_primAno)
                          // Create correction layer for last year anomalies using penultimate year data
                          var corrUlt = imgCol.select(ee.String('classification_').cat(penult)).mask(reg_ultAno)

                          // Apply corrections based on the year.
                          var class_corr = ee.Image(
                            ee.Algorithms.If(ano.eq(2017),
                              // Overlay first year correction patch
                              imgCol.select(ee.String('classification_').cat(prim)).blend(corrPri.rename('classification_2017')),
                                       
                            ee.Algorithms.If(ano.eq(2024),
                              // Overlay last year correction patch
                              imgCol.select(ee.String('classification_').cat(ultimo)).blend(corrUlt.rename('classification_2024')),
                              
                            class_ano
                            ))
                          );

                          return class_corr.rename(ee.String('classification_').cat(anoStr));
})).toBands();

// Correct the band names.
class_final = corrIndx(class_final);
// Print corrected imagery collection metadata to logs
print(class_final);

Map.addLayer(class_final, vis2, 'class_final', false);

// Show the difference between the original and filtered classifications for specific year.
var efeito = imgCol.select('classification_2017').neq(class_final.select('classification_2017'));
// Map.addLayer(efeito);

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
