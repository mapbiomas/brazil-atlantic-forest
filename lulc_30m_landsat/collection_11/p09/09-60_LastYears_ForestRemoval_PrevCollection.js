/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Correcting forest (3) and Savanna (4) from the last years using previous collection agriculture classification.
 * 
 * DESCRIPTION:
 * The script builds binary masks to identify areas with a persistent history of agriculture classes and Forest Plantation 
 * according to MapBiomas Collection 10. It takes the annual MapBiomas Collection 9 maps from 2004 to 2024, remaps all 
 * agriculture classes to a single value of 1, then sums these 20 annual masks (the result is an image where pixel values
 * represent the number of years that pixel was agriculture). It remaps this frequency image so that any pixel with a count
 * of 2 or more gets a value of 1. Also remaps Forest Plantation (9) to 1, sums them up and remaps the frequency image so 
 * that any pixel with a count of 2 or more gets a value of 1. We obtain one mask for agriculture classes and another for
 * Planted Forest in Collection 10.
 *  
 * It iterates through the time series from 1985 to 2024 to apply corrections year by year. For Citrus it identifies pixels 
 * in the current classification that are Forest (3) or Savanna (4) but were classified as Citrus (47) in Collection 7.1,
 * then changes the classification of these conflicting pixels to Mosaic of Uses (21). For agriculture classes and Forest 
 * Plantation it uses the masks produced from Collection 10 and apply only from 2004 onwards. Then identifies pixels in the 
 * current classification that are Forest (3) or Savanna (4) and overlap these masks of persistent agriculture or planted 
 * forest, and changes its classification to Mosaic of Uses (21).
 * 
 * It uses as input data output data from script 09-50.
 * The output data from this script is used as an input in script 10-10.
 * 
 */

// Define the description of the process.
var descricao = 'Removes forest from last years - agriculture data from previous collection';

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

// Define the input version number (from previous step) and output version number.
var vesion_in = '16';
var versao_out = '17';

// Define the collection id.
var col = 11.0;

// Define input and output prefixes for asset naming.
var prefixo_in  = 'MA_col'+col+'_p09e_v';
var prefixo_out = 'MA_col'+col+'_p09f_v';

// Define input and output directories for assets.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define the year and biome.
var ano = 2025;
var bioma = "MATAATLANTICA";
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
var biome_img = biomes_img.mask(biomes_img.eq(2));
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Load the input image (collection 10).
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
    'bands': 'classification_'+ano,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define the years to process.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];

// Create an initial Level 0 classification image from the input `imgCol` image.
// This loop iterates through each year to create a simplified classification level.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano]; // Get the current year from the list.
  
  // Select the classification for the current year.
  var class_ano = imgCol.select('classification_'+ano);
  // Remap the classification to level 0
  // Classes 3, 4, 11, 12, 50, 29 are remapped to  1 (natural classes).
  // Classes 9, 19, 21, 22, 24    are remapped to 10 (non natural classes).
  var class_nivel0_ano = class_ano.remap([3,4,11,12,50,29, 9,19,21,22,24],
                                         [1,1, 1, 1, 1, 1,10,10,10,10,10]).rename('classification_'+ano);

  // Combine the level 0 classifications for all years.
  if (i_ano == 0){ // If this is the first year (1985).
    var class_nivel0 = class_nivel0_ano; } // Initialize the multi-band image with the first year's Level 0 classification.
  else { // For subsequent years.
    class_nivel0 = class_nivel0.addBands(class_nivel0_ano); // Add the current year's Level 0 classification as a new band.
  }
}

var colAnterior = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1')
// Load and process MapBiomas Collection 9 data to create a mask of persistent agriculture areas from 2004-2023.
// Remap all agriculture classes to 1. Sum up all from 2004 to 2023. If the sum result is bigger than 2, remap this result to 1.
var agri_final =  colAnterior.select('classification_2004') .remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
            .add((colAnterior.select('classification_2005')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2006')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2007')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2008')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2009')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2010')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2011')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2012')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2013')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2014')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2015')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2016')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2017')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2018')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2019')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2020')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2021')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2022')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2023')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            .add((colAnterior.select('classification_2024')).remap([18,19,39,20,40,62,41,36,46,47,35,48],[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
            // Sums up the binary agriculture presence bands for each year (2004-2023).
            // Then, remap counts from 2 up to 20 to 1, effectively creating a binary mask (1=agriculture, 0=non agriculture).
            .remap([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
print(agri_final);
//projects/mapbiomas-workspace/COLECAO9/floresta-plantada

// Load and process MapBiomas Collection 9 data to create a mask of persistent planted forest areas from 2004-2023.
var silv_final =  colAnterior.select('classification_2004') .remap([9],[ 1])
            .add((colAnterior.select('classification_2005')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2006')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2007')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2008')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2009')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2010')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2011')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2012')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2013')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2014')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2015')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2016')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2017')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2018')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2019')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2020')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2021')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2022')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2023')).remap([9],[ 1]))
            .add((colAnterior.select('classification_2024')).remap([9],[ 1]))
            // Sums up the binary planted forest presence bands for each year (2004-2023).
            // Then, remap counts from 2 up to 20 to 1, effectively creating a binary mask (1=planted forest, 0=non non planted forest).
            .remap([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
print(silv_final);

// Add the agriculture and planted forest images to the map.
Map.addLayer(agri_final, vis, 'agri_final', true);
Map.addLayer(silv_final, vis, 'silv_final', true);

// Loop through the years and apply corrections with citrus from Collection 7.1.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano]; // Get the current year.
  
  // Select the classification for the current year.
  var class_ano = imgCol.select('classification_'+ano);
  // Select the citrus classification from Collection 7.1 for the current year.
  // Remap citrus class (47) to 1 to create a binary citrus mask for the year.
  var citro_71 = colAnterior.select('classification_'+ano).remap([47],[1]);
  // Adjust the citrus classification for  years 2022, 2023 and 2024, using the 2021 data.
  if (ano == 2022) {var citro_71 = colAnterior.select('classification_2021').remap([47],[1]);}
  if (ano == 2023) {var citro_71 = colAnterior.select('classification_2021').remap([47],[1]);}
  if (ano == 2024) {var citro_71 = colAnterior.select('classification_2021').remap([47],[1]);}
  if (ano == 2025) {var citro_71 = colAnterior.select('classification_2021').remap([47],[1]);}

  // Combine the original classification for the current year with the citrus classification mask.
  // Remap original forest/savanna (3, 4) to 1, add the citrus mask. If sum is 2 (forest/savanna + citrus), remap to 21 (Mosaic of Uses).
  // This converts forest/savanna pixels mapped as citrus in C7.1 into 'Mosaic of Uses'.
  var class_citr = class_ano.remap([3,4],[1,1]).add(citro_71).remap([2],[21]);
  
  // Apply corrections based on the year using the pre-computed persistent agriculture and planted forest masks.
  if (ano < 2005) {        // For years before 2005.
    var class_corr = class_ano;
  }
  else if (ano >=  2005) { // For years from 2005 onwards.
    // Create a mask for class 21.
    var class_ante = class_corr.remap([21],[1]); // Remap original Mosaic (21) to 1, all others to 0.
    // Blend the current classification with agriculture, planted forest, and the mask.
    // Apply agriculture-based correction:
    // 1. Remap original Forest/Savanna (3,4) to 1 for the current year.
    // 2. Add the persistent agriculture mask (`agri_final`).
    // 3. Add the mask of original Mosaic areas (`class_ante`).
    // If the sum is 3 (original Forest/Savanna + persistent agriculture + original Mosaic), remap to 21 (Mosaic).
    var class_agr3 = class_ano.remap([3,4],[1,1]).add(agri_final).add(class_ante).remap([3],[21]);
    // Apply planted forest-based correction (similar problematic logic as agriculture):
    // 1. Remap original Forest/Savanna (3,4) to 1 for the current year.
    // 2. Add the persistent planted forest mask (`silv_final`).
    // 3. Add the mask of original Mosaic areas (`class_ante`).
    // If the sum is 3 (original Forest/Savanna + persistent planted forest + original Mosaic), remap to 21 (Mosaic).
    var class_sil3 = class_ano.remap([3,4],[1,1]).add(silv_final).add(class_ante).remap([3],[21]);
    // Blend the original classification for the year (`class_ano`) with the calculated agriculture correction,
    // then blend the result with the planted forest correction, and finally blend that result with the citrus correction.
    // This applies all three types of corrections sequentially.
    var class_corr = class_ano.blend(class_agr3).blend(class_sil3).blend(class_citr).rename('classification_'+ano);
           
  }
  // Otherwise, blend the current classification with the citrus classification.
  else {class_corr = class_ano.blend(class_citr).rename('classification_'+ano);}

  // Combine the corrected classifications for all years.
  if (i_ano == 0){ var class_final = class_corr;}  
  else {class_final = class_final.addBands(class_corr);}

} // End of the main loop applying year-by-year corrections.

class_final = class_final.clip(regioesCollection)
// Calculate the difference between the corrected classification and the original classification for the last processed year (2024).
// This difference highlights pixels that were changed by the correction process in the last year.
// Select the last year's band from original and final, check for equality, then invert to get difference.
var efeito = imgCol.select('classification_'+ano).neq(class_final.select('classification_'+ano));
Map.addLayer(efeito);

// Add the original and corrected classifications to the map.
Map.addLayer(imgCol, vis2, 'imgCol', false);
Map.addLayer(class_final, vis2, 'class_final', true);

print(class_final)
// Set the metadata for the final classification image.
class_final = class_final
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the final classification image to an asset.
Export.image.toAsset({
    "image": class_final.toInt8(),
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": limite_MA,
    "overwrite": true
});
