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

// Define the geometry for the Atlantic Forest region.
var limite_MA = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-48.593359954293625, -30.678347823900353],
          [-47.275000579293625, -25.525376684152373],
          [-40.595313079293625, -23.284530667538736],
          [-33.915625579293625, -6.580343714417967],
          [-35.453711516793625, -4.217995607905081],
          [-44.198828704293625, -17.856203449528717],
          [-50.483008391793625, -17.52126295946964],
          [-55.712500579293625, -21.74193426005608],
          [-55.492774016793625, -29.72888025446976]]]);

// Define the input and output version numbers.
var vesion_in = '40';
var versao_out = '41';
// Define the description of the process.
var descricao = 'Janela Movel 3 anos';
// Define the collection id.
var col = 10.0;
// Define input and output prefixes for asset naming.
var prefixo_in  = 'MA_col'+col+'_p06c_v';
var prefixo_out = 'MA_col'+col+'_p07a_v'; 
// Define output directory for assets.
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

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
var anos = ee.List.sequence(1986, 2023)                                                           
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
        print(ultimo);
                    
        // Add the first and last year's classifications.
        var class_pri   = img.select(ee.String('classification_1985')).rename('00_classification_1985');
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
Map.addLayer(imgCol.select('classification_2017'), vis, 'imgCol 2017', true);
Map.addLayer(filtered.select('classification_2017'), vis, 'class_final 2017', true);

// Show the difference between the original and filtered classifications for specific year.
var efeito = imgCol.select('classification_2017').neq(filtered.select('classification_2017'));
Map.addLayer(efeito);
//Map.setCenter(-49.54511, -25.465731,14);

// Set the metadata for the final classification image (output).
filtered = filtered
.set('territory', 'MATAATLANTICA')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('year', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the final classification image (output) to an asset.
Export.image.toAsset({
    "image": filtered.toInt8(),
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": limite_MA
});
