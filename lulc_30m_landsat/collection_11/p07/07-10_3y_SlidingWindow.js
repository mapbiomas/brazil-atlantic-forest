/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Apply a 3-year sliding window temporal filter to the classification results.
 * 
 * DESCRIPTION:
 * This script implements a temporal consistency filter across the full time series (1985–2025) 
 * for the Atlantic Forest biome. The main goal is to eliminate "spectral noise" or transient 
 * classification errors where a pixel changes its class for a single year and then returns 
 * to the previous class (e.g., Forest -> Agriculture -> Forest). 
 * 
 * The process works by:
 * 1. Loading the regionalized classification mosaics.
 * 2. Expanding the time series with "padding" years (1983, 1984, 2026, 2027) to allow 
 *    the window logic to function at the edge years (1985 and 2025).
 * 3. Iteratively applying a 3-year sliding window function for specific target classes 
 *    (Non-vegetated, Forest, Savanna, etc.).
 * 4. Identifying and replacing "one-year outliers" based on the surrounding temporal context.
 * 5. Exporting the consolidated, filtered multi-band image as a new Asset for version 64.
 * 
 * It uses as input data output data from script 06-30.
 * The output data from this script is used as an input in script 07-20.
 */

// Define the descriptive name for the process used in metadata.
var descricao = '3 years sliding window';

// Define the overall geometry for the Atlantic Forest biome.
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
var vesion_in = '6';
var versao_out = '7';

// Identify the current collection version.
var col = 11.0;

// Set the naming prefixes for input and output assets.
var prefixo_in  = 'MA_col'+col+'_p06c_v';
var prefixo_out = 'MA_col'+col+'_p07a_v';

// Define the paths for input and output directories in the MapBiomas repository.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Set specific parameters for the Atlantic Forest biome.
var oneYear = 1986;
var bioma = "MATAATLANTICA";

// Load the biome reference mask and filter it for class 4 (Atlantic Forest).
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biome_2025_buf5k_10m');
var biome_img = biomes_img.mask(biomes_img.eq(4));
Map.addLayer(biome_img, {}, "Bioma Mata Atlantica");

// Import the MapBiomas palettes module for visualization.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define the full temporal range of the analysis as a string list.
var anos = ['1985','1986','1987','1988','1989','1990','1991','1992','1993','1994',
            '1995','1996','1997','1998','1999','2000','2001','2002','2003','2004',
            '2005','2006','2007','2008','2009','2010','2011','2012','2013','2014',
            '2015','2016','2017','2018','2019','2020','2021','2022','2023','2024', '2025'];
            
// Visualization parameters using standard MapBiomas classification colors.
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Specific visualization for a single year's classification band.
var vis2 = {
    'bands': 'classification_'+oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load individual classification image segments (1 to 9) and clip to their respective regions.
var imgCol1 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_1').clip(limite_MA1);
var imgCol2 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_2').clip(limite_MA2);
var imgCol3 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_3').clip(limite_MA3);
var imgCol4 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_4').clip(limite_MA4);
var imgCol5 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_5').clip(limite_MA5);
var imgCol6 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_6').clip(limite_MA6);
var imgCol7 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_7').clip(limite_MA7);
var imgCol8 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_8').clip(limite_MA8);
var imgCol9 =  ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat-ft/MA_col11_p06c_v63_9').clip(limite_MA9);

// Create a unified mosaic of all regional segments.
var imgCol = ee.ImageCollection([imgCol1,imgCol2,imgCol3,imgCol4,imgCol5,imgCol6,imgCol7,imgCol8,imgCol9]).mosaic();
  
// Create a reverse numeric sequence for years from 2025 back to 1985.
var anos = ee.List.sequence(2025, 1985, -1)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });

// 1. Create constant images for padding temporal boundaries to handle the moving window at the edges.
var bordaPassado = ee.Image.constant(0).rename('classification_padding').updateMask(biome_img);
var bordaFuturo  = ee.Image.constant(1).rename('classification_padding').updateMask(biome_img);

// 2. Construct the expanded time series image with padding bands for years 1983, 1984, and future years.
var anoFuturo   = ee.Number(anos.get(0)).add(1);
var anoFuturo2  = ee.Number(anos.get(0)).add(2);
var imgExpandida = bordaPassado.rename('classification_1983')
         .addBands(bordaPassado.rename('classification_1984'))
         .addBands(imgCol) // Core period: 1985 to 2025
         .addBands(bordaFuturo.rename(ee.String('classification_').cat(anoFuturo.format())))
         .addBands(bordaFuturo.rename(ee.String('classification_').cat(anoFuturo2.format())));
        
var y = ee.Number(oneYear);

// Select classification data for a specific anchor year and its temporal neighbors for window analysis.
var class_Ano   = imgExpandida.select(ee.String('classification_').cat(y.format()));
var classPrev   = imgExpandida.select(ee.String('classification_').cat(y.subtract(1).format()));
var classPrev2  = imgExpandida.select(ee.String('classification_').cat(y.subtract(2).format()));
var classNext   = imgExpandida.select(ee.String('classification_').cat(y.add(1).format()));
var classNext2  = ee.Image(imgExpandida.select(ee.String('classification_').cat(y.add(2).format())));

/**
 * 3. TEMPORAL FILTER FUNCTION
 * Implements the 3-year moving window logic to correct transient land cover changes.
 */
var window3y = function (img, classe){
                // Map over the sequence of years to apply the filter year-by-year.
                var classWind = ee.ImageCollection(anos.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();  
                    var nomeBanda = ee.String('classification_').cat(anoStr);

                    // Select target, previous, and future year bands for context.
                    var class_Ano   = img.select(nomeBanda);
                    var classPrev   = img.select(ee.String('classification_').cat(ano.subtract(1).format()));
                    var classPrev2  = img.select(ee.String('classification_').cat(ano.subtract(2).format()));
                    var classNext   = img.select(ee.String('classification_').cat(ano.add(1).format()));
                    var classNext2  = img.select(ee.String('classification_').cat(ano.add(2).format()));

                    // mask_3: Logic for middle years. Identifies if current year is 'classe' while past and future are NOT.
                    var mask_3 = classNext.neq(classe)
                            .and(class_Ano.eq(classe))
                            .and(classPrev.neq(classe));
                            
                    // mask_inicio: Specific logic for the first year (1985).
                    var mask_inicio = mask_3
                                .and(classNext.eq(classNext2));

                    // mask_final: Specific logic for the last year (2025).
                    var mask_final = mask_3
                                .and(classPrev.eq(classPrev2));
                                
                    // Determine which class should replace the transient error.
                    var yearReplacement = classPrev.where(ano.eq(1985), classNext);

                    // Consolidate the masking condition based on the position in the time series.
                    var maskReplacement = ee.Image.constant(0)
                                  .where(ano.eq(1985), mask_inicio)                 // Use start mask for 1985.
                                  .where(ano.eq(2025), mask_final)                  // Use end mask for 2025.
                                  .where(ano.neq(1985).and(ano.neq(2025)), mask_3); // Use standard mask for others.
       
                    // Remap valid replacement classes (Forest, Savanna, Wetland, Grassland, Agriculture, etc.).
                    var mask = yearReplacement.remap([3,4,11,12,21,22,29,50],
                                                     [3,4,11,12,21,22,29,50]).updateMask(maskReplacement);
                                             
                    // Replace the error by blending the corrected mask over the original classification band.
                    var class_corr = class_Ano.blend(mask.rename(nomeBanda));
                       
                    return class_corr;
                    
                                                            })).toBands();

        // Separate and rename the first year to maintain consistent structure.
        var class_pri   = img.select(ee.String('classification_1985')).rename('00_classification_1985');

        var class_final = class_pri.addBands(classWind);
                                                            
        // Helper function to strip prefixes (e.g., '0_') from band names created by toBands().
        var corrIndx  = function (img){
              var indxNames = img.bandNames();
              var bandNames = indxNames.map(function(nome){
                  return ee.String(nome).split('_').slice(1).join('_');
                                                          });
              return img.select(indxNames,bandNames);
                                      };
        
        // Finalize corrections and re-attach padding years for the next iteration of the function.
        var corrigidaFinal = corrIndx(classWind);
        print('corrigidaFinal',corrigidaFinal);
                return img.select(ee.String('classification_').cat(anoFuturo2.format()))
                          .addBands(img.select(ee.String('classification_').cat(anoFuturo.format())))
                          .addBands(corrigidaFinal)
                          .addBands(img.select('classification_1984'))
                          .addBands(img.select('classification_1983'));
                
};

// Iteratively apply the temporal window filter for each relevant class in a specific priority order.
var filtered = window3y(imgExpandida,   22); // Non-vegetated
    filtered = window3y(filtered, 50);       // Herbaceous Restoration
    filtered = window3y(filtered, 29);       // Rocky Outcrop
    filtered = window3y(filtered,  3);       // Forest
    filtered = window3y(filtered,  4);       // Savanna
    filtered = window3y(filtered, 21);       // Agriculture/Mosaic
    filtered = window3y(filtered, 12);       // Grassland/Campo
    filtered = window3y(filtered, 11);       // Wetland/Varzea

// Extract the filtered bands and print the list for confirmation.
var bandsFilt = filtered.bandNames();
print(bandsFilt);

// Select the final bands corresponding only to the official mapping period (1985–2025).
filtered = filtered.select([
  'classification_1985','classification_1986','classification_1987','classification_1988','classification_1989',
  'classification_1990','classification_1991','classification_1992','classification_1993','classification_1994',
  'classification_1995','classification_1996','classification_1997','classification_1998','classification_1999',
  'classification_2000','classification_2001','classification_2002','classification_2003','classification_2004',
  'classification_2005','classification_2006','classification_2007','classification_2008','classification_2009',
  'classification_2010','classification_2011','classification_2012','classification_2013','classification_2014',
  'classification_2015','classification_2016','classification_2017','classification_2018','classification_2019',
  'classification_2020','classification_2021','classification_2022','classification_2023','classification_2024','classification_2025'
]);

// Display the original (v63) and filtered (v64) classifications for spatial comparison.
Map.addLayer(imgCol, vis2, 'imgCol'+oneYear, true);
Map.addLayer(filtered, vis2, 'class_final'+oneYear, true);

// Create a visual layer to highlight pixels that were changed by the filter for a specific year.
var efeito = imgCol.select('classification_'+oneYear).neq(filtered.select('classification_'+oneYear));
Map.addLayer(efeito, {}, 'mudancas');

// Highlight changes specifically between the last two years after filtering.
var efeito2 = filtered.select('classification_2024').neq(filtered.select('classification_2025'));
Map.addLayer(efeito2, {}, 'mudancas 2');

// --- EXPORT AND METADATA ---

// Attach official MapBiomas metadata properties to the output image.
filtered = filtered
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the multi-temporal filtered image as a single Asset.
Export.image.toAsset({
    "image": filtered.toInt8(),
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
