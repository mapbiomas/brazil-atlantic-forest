/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Improve temporal consistency using a 3-year moving window filter.
 * 
 * DESCRIPTION:
 * This script applies a 3-year temporal filter to a multi-temporal land cover classification 
 * stack (2017-2025). The primary goal is to remove single-year classification "spikes" or 
 * "noise" where a pixel changes class for just one year before returning to its previous 
 * state (e.g., Forest -> Pasture -> Forest). 
 * 
 * The algorithm logic is as follows:
 * 1. It adds padding bands (future and past boundaries) to handle edge cases at the start 
 *    (2017) and end (2025) of the series.
 * 2. It identifies pixels in the central year (t) that differ from both the previous (t-1) 
 *    and following (t+1) years.
 * 3. For the first year (2017), it looks forward to verify consistency; for the last year 
 *    (2025), it looks backward.
 * 4. The function 'window3y' is called iteratively for a prioritized list of classes 
 *    (Urban, Water, Forest, etc.) to stabilize the temporal profile.
 * 5. The final product is a multi-band image where temporal transitions are smoother 
 *    and more representative of actual land dynamics.
 */

// Define the processing description translated to English
var description = 'Temporal Filter - 3-Year Moving Window';
// Define the collection identifier as a float 4.0
var collection_id = 4.0;

// Define the biome for processing
var bioma = "MATAATLANTICA";
// Reference year for specific visualization tasks
var oneYear = 2023;

// Define the input and output versions as strings in single quotes
var version_in = '7';
var version_out = '8';

// Define input and output prefixes for asset identification
var prefixo_in = 'MA_S2_p82_v';
var prefixo_out = 'MA_S2_p83_v';

// Define the input and output directories for the classification assets
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Set visualization parameters for RGB mosaic rendering
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'], gain: [0.08, 0.06, 0.2], gamma: 0.85};
// Import the mosaic module from the Atlantic Forest Sentinel collection 4 project
var mos = require('users/yasmingelli-arcplan/MapBiomas_SENTINELcol4_MA:passo01/01-01_Cria_MosaicoTotal');

// Load the biomes raster auxiliary data
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biome_2025_buf5k_30m');

// Mask the biomes image to isolate the Atlantic Forest (ID 4)
var biome_img = biomes_img.mask(biomes_img.eq(4));

// Display the biome mask on the map
Map.addLayer(biome_img);

// Define the years of interest for the mosaic visualization loop
var anos = [
  2017,2018,2019,2020,2021,2022,2023,2024,2025
];

// Load the Atlantic Forest region boundaries
var limite = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025");

// Loop through each year to visualize the Sentinel-2 mosaics
for (var i_ano=0; i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Retrieve the mosaic for the current year within the biome boundaries
  var mosaicoTotal = mos.getMosaic(ano, limite);

  // Add the mosaic to the map for visual context during the analysis
  Map.addLayer(mosaicoTotal.clip(limite.geometry()), visParMedian2, 'Img_Year_' + ano, false);
}

// Load the input classification image from the previous stabilization step
var imgCol = ee.Image(dirout + prefixo_in + version_in);

// Define the study area geometry for export and regional constraints
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

// Import the palettes module for standardized MapBiomas colors
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define standard visualization parameters for classification results
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
// Define specific visualization for a single reference year band
var vis2 = {
    'bands': 'classification_' + oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Create a chronological list of years in descending order to setup processing
var anos_list = ee.List.sequence(2025, 2017, -1)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });

// Create constant images to act as spatial/temporal padding for the series edges
var bordaPassado = ee.Image.constant(0).rename('classification_padding').updateMask(biome_img);
var bordaFuturo  = ee.Image.constant(1).rename('classification_padding').updateMask(biome_img);

// Define boundary parameters for the expanded image stack
var ultimo = ee.Number(anos_list.get(0));
var anoFuturo   = ee.Number(anos_list.get(0)).add(1);
var anoFuturo2  = ee.Number(anos_list.get(0)).add(2);

// Assemble an expanded image including padding years before 2017 and after 2025
var imgExpandida = bordaPassado.rename('classification_2015')
         .addBands(bordaPassado.rename('classification_2016'))
         .addBands(imgCol) 
         .addBands(bordaFuturo.rename(ee.String('classification_').cat(anoFuturo.format())))
         .addBands(bordaFuturo.rename(ee.String('classification_').cat(anoFuturo2.format())));
        
// Define temporal iteration for specific years using the reference oneYear
var y = ee.Number(oneYear);

// Extract temporal neighbors for the reference year from the expanded image
var class_Ano   = imgExpandida.select(ee.String('classification_').cat(y.format()));
var classPrev   = imgExpandida.select(ee.String('classification_').cat(y.subtract(1).format()));
var classPrev2  = imgExpandida.select(ee.String('classification_').cat(y.subtract(2).format()));
var classNext   = imgExpandida.select(ee.String('classification_').cat(y.add(1).format()));
var classNext2  = imgExpandida.select(ee.String('classification_').cat(y.add(2).format()));

// Define the 3-year moving window filtering function
var window3y = function (img, classe){
                // Map over the years sequence to evaluate every year in the stack
                var classWind = ee.ImageCollection(anos_list.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();  
                    var nomeBanda = ee.String('classification_').cat(anoStr);

                    // Select the current year and its neighbors (two before and two after)
                    var class_Ano_current   = img.select(nomeBanda);
                    var classPrev_current   = img.select(ee.String('classification_').cat(ano.subtract(1).format()));
                    var classPrev2_current  = img.select(ee.String('classification_').cat(ano.subtract(2).format()));
                    var classNext_current   = img.select(ee.String('classification_').cat(ano.add(1).format()));
                    var classNext2_current  = img.select(ee.String('classification_').cat(ano.add(2).format()));

                    // Core logic: identify isolated pixels of the target class surrounded by different classes
                    var mask_3 = classNext_current.neq(classe)
                            .and(class_Ano_current.eq(classe))
                            .and(classPrev_current.neq(classe));
                            
                    // Logic to stabilize transitions at the very beginning of the series
                    var mask_inicio = mask_3
                                .and(classNext_current.eq(classNext2_current));

                    // Logic to stabilize transitions at the very end of the series
                    var mask_final = mask_3
                                .and(classPrev_current.eq(classPrev2_current));
                                
                    // Select which year to use for replacement based on the iteration year
                    var yearReplacement = classPrev_current.where(ano.eq(2017), classNext_current);

                    // Select which mask to apply based on whether the year is at the boundary or intermediate
                    var maskReplacement = ee.Image.constant(0)
                                  .where(ano.eq(2017), mask_inicio)                 
                                  .where(ano.eq(ultimo), mask_final)                  
                                  .where(ano.neq(2017).and(ano.neq(ultimo)), mask_3);
       
                    // Remap valid classes into the replacement band and update with the calculated mask
                    var mask = yearReplacement.remap([3,4,11,12,29,50,21,22,23,24,25],
                                                     [3,4,11,12,29,50,21,22,23,24,25]).updateMask(maskReplacement);
                                             
                    // Blend the filtered replacement into the original classification band
                    var class_corr = class_Ano_current.blend(mask.rename(nomeBanda));
                       
                    return class_corr;
                    
                                                            })).toBands();

        // Retrieve the first year band for reconstruction purposes
        var class_pri   = img.select(ee.String('classification_2017')).rename('00_classification_2017');

        // Concatenate the processed bands into a single image stack
        var class_final_reconst = class_pri.addBands(classWind);
                                                            
        // Internal function to strip indices from band names after toBands conversion
        var corrIndx_internal  = function (img_to_corr){
              var indxNames = img_to_corr.bandNames();
              var bandNames_clean = indxNames.map(function(nome){
                  return ee.String(nome).split('_').slice(1).join('_');
                                                          });
              return img_to_corr.select(indxNames, bandNames_clean);
                                      };
        
        // Finalize the band cleanup for the current window iteration
        var corrigidaFinal = corrIndx_internal(classWind);
        
        // Rebuild the expanded image structure with the filtered classification
        return img.select(ee.String('classification_').cat(anoFuturo2.format()))
                  .addBands(img.select(ee.String('classification_').cat(anoFuturo.format())))
                  .addBands(corrigidaFinal)
                  .addBands(img.select('classification_2016'))
                  .addBands(img.select('classification_2015'));
                
};

// Iteratively apply the temporal window filter for a specific priority sequence of classes
var filtered = window3y(imgExpandida, 22);
    filtered = window3y(filtered, 23);
    filtered = window3y(filtered, 24);
    filtered = window3y(filtered, 25);
    filtered = window3y(filtered, 50);
    filtered = window3y(filtered, 29);
    filtered = window3y(filtered,  3);
    filtered = window3y(filtered,  4);
    filtered = window3y(filtered, 21);
    filtered = window3y(filtered, 12);
    filtered = window3y(filtered, 11);

// Log the band names of the filtered result to the console for verification
var bandsFilt = filtered.bandNames();
print(bandsFilt);

// Select only the core classification bands for the 2017-2025 period
filtered = filtered.select(
[
'classification_2017','classification_2018','classification_2019','classification_2020','classification_2021','classification_2022','classification_2023','classification_2024','classification_2025'
]
);

// Log the final filtered image structure
print(filtered);

// Add the original and filtered images to the map for visual comparison
Map.addLayer(imgCol, vis2, 'Original Input', false);
Map.addLayer(filtered, vis2, 'Filtered Result', false);

// Generate a binary mask showing where classification changes occurred for the reference year
var efeito = imgCol.select('classification_' + oneYear).neq(filtered.select('classification_' + oneYear));
Map.addLayer(efeito, {min: 0, max: 1, palette: 'black, cyan'}, 'Filter Changes');

// Apply standardized MapBiomas Collection 4 metadata properties to the output image
filtered = filtered
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the multi-temporal filtered classification as a Google Earth Engine Asset
Export.image.toAsset({
    'image': filtered,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    // Set categorical pyramiding policy
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});