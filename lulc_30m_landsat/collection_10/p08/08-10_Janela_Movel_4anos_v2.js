/**
 * This script performs a 4-year temporal filtering aiming to remove noise of wrongly assigned classes
 * up to two consecutive years.
 * 
 * Lists of years are created to handle odd and even years separately for the temporal filtering.
 * This assures that no corrections applied on the previous iteration will affect the iteration of the following years.
 * 
 * For each year, the filter takes into account the classification of the previous year, the current year and the two following ones.
 * The function 'window4y' iterates through a list of odd and even years separately,
 * iterating through classes 3, 4, 11, 12, 21, 22, 29 and 50. It creates a mask (mask_4) that returns valid values
 * if the classification of these four years respect the following conditions:
 * the previous one (year - 1) and the current (year) must match the target class
 * and the next year (year + 1) and the year before the previous one (year - 2) must not.
 * The mask is applied to the classified image of the year before the previous one (year - 2),
 * keeping on it just the valid pixels of the mask with the original classification of that year.
 * 
 * This mask is then blended iteratively to all the years, so each valid pixel from the mask from the current year (year)
 * will be classified as the year before the previous one (year - 2).
 * The same is made after for the previous years (year - 1).
 * This sets the same class for the current and previous years as the one classified in the year before the previous one (year - 2).
 * 
 * It uses as input data output data from script 07-30.
 * The output data from this script is used as an input in script 08-20.
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

//Map.setCenter(-49.38849, -25.39505,14);

// Define the input and output version numbers.
var vesion_in = '43';
var versao_out = '44';
// Define the description of the process.
var descricao = 'Filtro de 4 anos';
// Define the collection id.
var col = 10.0;
// Define input and output prefixes for asset naming.
var prefixo_in  = 'MA_col'+col+'_p07c_v';
var prefixo_out = 'MA_col'+col+'_p08a_v';
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

// Create a list of years to process.
var anos = ee.List.sequence(1985,2024)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });
                        
// Create a list of odd years to process.
var anosI = ee.List.sequence(2023,1987,-2)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });
                        
// Create a list of even years to process.
var anosP = ee.List.sequence(2022,1988,-2)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });
print(anosP);
print(anosI);

// Function to correct band names.
var corrIndx  = function (img){
                  var indxNames = img.bandNames();
                  var bandNames = indxNames.map(function(nome){
                          return ee.String(nome).split('_').slice(1).join('_');
                                      });
                    return img.select(indxNames,bandNames);
                              };
                              
// Get the last three years from the 'anos' list.
var n = anos.size(); // list size
var ultimo = ee.Number(anos.get(n.subtract(1)));  // Get the last year.
var penult = ee.Number(anos.get(n.subtract(2)));  // Get the second to last year.
var antpen = ee.Number(anos.get(n.subtract(3)));  // Get the third to last year.

print(ultimo);
print(penult);
print(antpen);

// Function to apply a 4-year temporal filter to the classification for odd years.
var window4y = function(img, classe){
                    
                  // Initialize the output image with the classification of the last year.
                  var class_final = img.select(ee.String('classification_').cat(ultimo)).rename(ee.String('00_classification_').cat(ultimo));

                  // Create an image collection for processing odd years.
                  var classWind = ee.ImageCollection(anosI.map(function(ano){ // anosI = odd years
                    ano = ee.Number(ano);
                    var anoStr = ano.format();  
                    var nomeBanda = ee.String('classification_').cat(anoStr);
                    
                    // Select the classification for the current year.
                    var class_ano = img.select(ee.String('classification_').cat(anoStr));
                    
                    // Create a mask based on the classification values of four consecutive years.
                    var mask_4 = img.select(ee.String('classification_').cat(ano.add(1).format()))     .neq(classe)  // Class for the next year is different from the target class?
                            .and(img.select(ee.String('classification_').cat(anoStr))                   .eq(classe)) // Class for the current year is equal to the target class?
                            .and(img.select(ee.String('classification_').cat(ano.subtract(1).format())) .eq(classe)) // Class for the previous year is equal to the target class?
                            .and(img.select(ee.String('classification_').cat(ano.subtract(2).format())).neq(classe));// Class for two years before is different from the target class?
                            
                    // Apply the mask and remap values.
                    mask_4 = img.select(ee.String('classification_').cat(ano.subtract(2).format())) // Select the band for two years before.
                                .remap([3,4,11,12,21,22,29,50],
                                       [3,4,11,12,21,22,29,50]).updateMask(mask_4);
                    
                    // Blend the original classification with the masked image.
                    var class_corr = class_ano.blend(mask_4.rename(ee.String('classification_').cat(anoStr)));
                                        
                    // Blend the original classification for the previous year with the masked image.
                    var class_corr2 = img.select(ee.String('classification_').cat(ano.subtract(1).format()))
                                         .blend(mask_4.rename(ee.String('classification_').cat(ano.subtract(1).format())));

                    return class_corr.addBands(class_corr2);
                  })).toBands();
                  print(classWind, 'classWind');
                  
                    // Add the processed bands to the final image.
                    class_final = class_final.addBands(classWind).addBands(img.select('classification_1985').rename(ee.String('00_classification_1985')));
                    
                    print(class_final, 'class_final');
                                                                         
                    // Correct the band names and return the result.
                    var corrigidaFinal = corrIndx(class_final);
                    print('corrigidaFinal',corrigidaFinal);
                    return corrigidaFinal;
};

// Apply the 4-year moving window filter (iteratively) for different classes.
var filtered = window4y(imgCol,   22);
    filtered = window4y(filtered, 21);
    filtered = window4y(filtered, 50);
    filtered = window4y(filtered, 29);
    filtered = window4y(filtered,  3);
    filtered = window4y(filtered, 12);
    filtered = window4y(filtered, 11);
    filtered = window4y(filtered,  4);
    
print('pares',filtered);
Map.addLayer(filtered, vis2, 'filtered1', false);
//var anos = [2020];

// Function to apply a 4-year temporal filter to the classification for even years.
var window4y = function(img, classe){
                  
                  // Initialize the output image with the classification of the last year.
                  var class_final2 = img.select(ee.String('classification_').cat(ultimo)).rename(ee.String('00_classification_').cat(ultimo));
                      // Add the classification band for the second to last year.
                      class_final2 = class_final2.addBands(img.select(ee.String('classification_').cat(penult)).rename(ee.String('00_classification_').cat(penult)));
                      print(class_final2, 'class1');

                  // Create an image collection for processing even years.
                  var classWind = ee.ImageCollection(anosP.map(function(ano){ // anosP = even years
                    ano = ee.Number(ano);
                    var anoStr = ano.format();  
                    var nomeBanda = ee.String('classification_').cat(anoStr);
                    
                    // Select the classification for the current year.
                    var class_ano = img.select(ee.String('classification_').cat(anoStr));

                    // Create a mask for the 4-year window
                    var mask_4 = img.select(ee.String('classification_').cat(ano.add(1).format()))     .neq(classe)
                            .and(img.select(ee.String('classification_').cat(anoStr))                   .eq(classe))
                            .and(img.select(ee.String('classification_').cat(ano.subtract(1).format())) .eq(classe))
                            .and(img.select(ee.String('classification_').cat(ano.subtract(2).format())).neq(classe));
                            
                    // Apply the mask and remap values.
                    mask_4 = img.select(ee.String('classification_').cat(ano.subtract(2).format()))
                                .remap([3,4,11,12,21,22,29,50],
                                       [3,4,11,12,21,22,29,50]).updateMask(mask_4);
                    
                    // Blend the original classification with the masked image.
                    var class_corr = class_ano.blend(mask_4.rename(ee.String('classification_').cat(anoStr)));

                    // Blend the original classification for the previous year with the masked image.
                    var class_corr2 = img.select(ee.String('classification_').cat(ano.subtract(1).format()))
                                         .blend(mask_4.rename(ee.String('classification_').cat(ano.subtract(1).format())));

                    return class_corr.addBands(class_corr2);
                    
                  })).toBands();

                    // Add the processed bands to the final image.
                    class_final2 = class_final2.addBands(classWind).addBands(img.select('classification_1986').rename(ee.String('00_classification_1986')))
                                                                   .addBands(img.select('classification_1985').rename(ee.String('00_classification_1985')));

                    // Correct the band names and return the result.
                    var corrigidaFinal = corrIndx(class_final2);
                    print('corrigidaFinal',corrigidaFinal);
                    return corrigidaFinal;
};

// Apply the 4-year moving window filter (iteratively) for different classes.
filtered = window4y(filtered, 22);
filtered = window4y(filtered, 21);
filtered = window4y(filtered, 50);
filtered = window4y(filtered, 29);
filtered = window4y(filtered,  3);
filtered = window4y(filtered, 12);
filtered = window4y(filtered, 11);
filtered = window4y(filtered,  4);

print('impares',filtered);

// Add the filtered image to the map.
Map.addLayer(filtered, vis2, 'filtered2', false);

// Add the classifications for 2020 to the map.
Map.addLayer(imgCol.select('classification_2020'), vis, 'class7', true);
Map.addLayer(filtered.select('classification_2020'), vis, 'class_final2', true);

// Set the metadata for the final classification image.
filtered = filtered
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('year', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the final classification image to an asset.
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
