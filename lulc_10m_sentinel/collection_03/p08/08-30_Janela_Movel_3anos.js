/**
 * This script performs a 3-year temporal filter.
 * A list of years is created, excluding the first and last year (1985 and 2024)
 * because an iteration over them would result in an error,
 * since there is no classification for the years 1984 or 2025.
 * 
 * The script analyzes, from the second year to the penultimate year, for each natural class,
 * the classification of the current year (central), the previous year (-1) and the following year (+1).
 * 
 * Then it creates a mask (mask_3) where the class of the central year differs from
 * the previous (-1) and subsequent (+1) years. The analysis performed is:
 * year -1      | EQUAL     | Class    | No class
 * central year | DIFFERENT | No class | Class
 * year +1      | EQUAL     | Class    | No class
 * If the class of the central year differs from the previous (-1) and subsequent (+1) years,
 * the mask has the value 'TRUE' for that pixel.
 * 
 * This mask is used to extract the values from the previous year where its value is 'TRUE', through the 'update mask'.
 * This does not create a binary mask but keeps only those pixels from the input layer (classPrev)
 * that match the pixels masked as 'TRUE' in mask_3 ( .eq(), .neq(), creates a binary layer).
 * 
 * Then, this mask is applied only to the values that respect the condition for the central year.
 * Updating, with the values from the previous year (year -1) those years (central year)
 * that have a distinct class from their years before and after.
 * And so on iteratively for each year, until the penultimate year of the series.
 * 
 * It uses as input data output data from script 06-30.
 * The output data from this script is used as an input in script 07-20.
 * 
 */

var description = 'Filtro Temporal Janela 3 Anos'
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";
// Define input and output version numbers
var vesion_in = '15';
var version_out = '16';

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p82_v';
var prefixo_out = 'MA_S2_p83_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Output directory

// Set visualization parameters for RGB composites
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'],gain: [0.08, 0.06, 0.2],gamma: 0.85}
// Import the module to build image mosaics
var mos = require('users/yasmingelli-arcplan/MapBiomas_SENTINELcol3_MA:passo01/01-01_Cria_MosaicoTotal')

// Define the years to process (2016-2023)
var anos = [
  2017,2018,2019,2020,2021,2022,2023,2024
]

// Load the regional boundaries feature collection layout
var limite = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Loop through each year.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  // Extract index year integer variable
  var ano = anos[i_ano];
  
  // Generate total mosaic corresponding to given bounds
  var mosaicoTotal = mos.getMosaic(ano,limite);

  // ALL EMBEDDING BANDS + 20 MOST IMPORTANTS FROM SENTINEL2

  //var BDamostras = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/col9/MATA_ATLANTICA/teste/REGIONs_'+regiaoID+'_'+ano)
  
  // Display clipped baseline yearly mosaic matrices over map visualization layout
  Map.addLayer(mosaicoTotal.clip(limite.geometry()), visParMedian2, 'Img_Year_'+ano, false);
}
// Load the collection 10 image.
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in);

// Import the palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters.
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

// Create a list of years, excluding boundary years to avoid errors. Boundary years don't have one year before or one year after.
var anos = ee.List.sequence(2018, 2023)                                                                           
                  .map(function(y){                                                                     
                        return ee.Number(y).int(); });
                        
// Function to apply a 3-year moving window filter.
var window3y = function (img, classe){
                // Map over the years to process each year individually.
                var classWind = ee.ImageCollection(anos.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();  
                    var nomeBanda = ee.String('classification_').cat(anoStr);

                    // Get classification bands for the current year, previous year, and next year.
                    var class_Ano = img.select(nomeBanda);
                    var classPrev = img.select(ee.String('classification_').cat(ano.subtract(1).format()));
                    var classNext = img.select(ee.String('classification_').cat(ano.add(1).format()));
                    
                    // Create a mask to identify pixels where the current year matches the target class, but the previous and next years do not.
                    var mask_3 = classNext.neq(classe)
                            .and(class_Ano.eq(classe))
                            .and(classPrev.neq(classe));
       
                    // Remap the previous year's classification, applying the mask.
                    // This handles specific classes in a list, but Water class is not included.
                    mask_3 = classPrev.remap([3,4,11,12,21,22,29,50],
                                             [3,4,11,12,21,22,29,50]).updateMask(mask_3);
                                             
                    // Blend the original classification with the masked classification.
                    var class_corr = class_Ano.blend(mask_3.rename(nomeBanda));
                       
                    return class_corr;
                    
                                                                            })).toBands();
                                                                            //print('classWind',classWind)
        // Get the size of the years list.
        var n = anos.size();
        // Calculate the last year + 1.
        var ultimo = ee.Number(anos.get(n.subtract(1))).add(1);
        // Print the evaluated timeline limits parameters to logs console
        print(ultimo);
                    
        // Add the first and last year's classifications.
        var class_pri   = img.select(ee.String('classification_2017')).rename('00_classification_2017');
        var class_ult   = img.select(ee.String('classification_').cat(ultimo))
                             .rename(ee.String('00_classification_').cat(ultimo));
        var class_final = class_pri.addBands(classWind).addBands(class_ult);
        //print('class_final',class_final);
                                                                            
        // Function to correct band names.
        var corrIndx  = function (img){
              var indxNames = img.bandNames();
              var bandNames = indxNames.map(function(nome){
                  return ee.String(nome).split('_').slice(1).join('_');
                                          });
              return img.select(indxNames,bandNames);
                                      };
        // Correct band names and return the processed image.
        var corrigidaFinal = corrIndx(class_final);
        // Print standardized tracking dataset configuration records to user terminal
        print('corrigidaFinal',corrigidaFinal);
                return corrigidaFinal;
                
};

// Apply the 3-year moving window filter iteratively for different classes.
var filtered = window3y(imgCol,   22);
    filtered = window3y(filtered, 50);
    filtered = window3y(filtered, 29);
    filtered = window3y(filtered,  3);
    filtered = window3y(filtered,  4);
    filtered = window3y(filtered, 21);
    filtered = window3y(filtered, 12);
    filtered = window3y(filtered, 11);

// Add the original and filtered images to the map.
Map.addLayer(imgCol, vis2, 'imgCol', false);
Map.addLayer(filtered, vis2, 'class_final', false);

// Add specific year classifications for comparison.
Map.addLayer(imgCol.select('classification_2022'), vis, 'imgCol 2022', true);
Map.addLayer(filtered.select('classification_2022'), vis, 'class_final 2022', true);

// Show the difference between the original and filtered classifications for specific year.
var efeito = imgCol.select('classification_2022').neq(filtered.select('classification_2022'));
Map.addLayer(efeito);
//Map.setCenter(-49.54511, -25.465731,14);

// Set the metadata for the final classification image (output).
filtered = filtered
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': filtered,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});