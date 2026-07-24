/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Perform temporal consistency refinement using a 3-year moving window filter.
 * 
 * DESCRIPTION:
 * This script implements a temporal consistency algorithm designed to remove thematic "spikes" or single-year 
 * classification oscillations in the Atlantic Forest time series (2017-2025). The process works by analyzing 
 * a moving window of three consecutive years (t-1, t, t+1). If the classification of the central year (t) 
 * differs from both the preceding and succeeding years, and those years share a consistent class, the 
 * central year is considered noise and is replaced by the neighboring value. 
 * 
 * To handle the boundaries of the time series (2017 and 2025), the script adds padding bands for 2015, 2016, 2026, 
 * and 2027. The filtering logic is applied iteratively for specific land cover classes (e.g., Forest, Savanna, 
 * Urban, Water) to prioritize thematic stability across the series. The final output is a multi-band image 
 * with reduced temporal noise, conforming to the MapBiomas Collection 4 metadata standards.
 */

// Define the processing description in English
var description = 'Temporal Filter 3-Year Moving Window';
// Define the collection identifier as a float
var collection_id = 4.0;

// Define the target biome identifier for the Atlantic Forest
var bioma = "MATAATLANTICA";
// Set the reference year for visualization
var oneYear = 2025;

// Define the input and output versions as strings in single quotes
var version_in = '14';
var version_out = '15';

// Define the input and output prefixes for asset identification
var prefixo_in = 'MA_S2_p92_v';
var prefixo_out = 'MA_S2_p93_v';

// Define the input and output directory paths for the classification products
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Define visualization parameters for RGB mosaic rendering (SWIR1, NIR, Red)
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'], gain: [0.08, 0.06, 0.2], gamma: 0.85};
// Import the mosaic module from the Atlantic Forest Sentinel-2 collection workspace
var mos = require('users/yasmingelli-arcplan/MapBiomas_SENTINELcol4_MA:passo01/01-01_Cria_MosaicoTotal');

// Load the biome auxiliary raster dataset
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biome_2025_buf5k_30m');

// Mask the biomes raster to isolate the Atlantic Forest (value 4)
var biome_img = biomes_img.mask(biomes_img.eq(4));

// Add the biome mask to the map interface
Map.addLayer(biome_img);

// Define the array of years to process in the time series
var anos_array = [
  2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
];

// Load the Atlantic Forest regional boundaries feature collection
var limite_regioes = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025");

// Loop through each year to visualize the Sentinel-2 mosaics for contextual verification
for (var i_ano=0; i_ano<anos_array.length; i_ano++){
  var ano_val = anos_array[i_ano];
  
  // Retrieve the mosaic for the current year within the regional boundaries
  var mosaicoTotal = mos.getMosaic(ano_val, limite_regioes);
  
  // Display the annual mosaic on the map, clipped to the biome boundary
  Map.addLayer(mosaicoTotal.clip(limite_regioes.geometry()), visParMedian2, 'Img_Year_' + ano_val, false);
}

// Load the classification image from the previous spatial/APP filtering step
var imgCol =  ee.Image(dirout + prefixo_in + version_in);

// Define the standardized geometry for the Atlantic Forest region
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

// Import the MapBiomas palettes module for land cover visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define standard visualization parameters for classification maps
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
// Visualization parameters targeting the reference year
var vis2 = {
    'bands': 'classification_' + oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Create a reverse chronological list of years for the time series
var anos_ee_list = ee.List.sequence(2025, 2017, -1)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });

// Create constant images for temporal padding to avoid index errors at series edges
var bordaPassado = ee.Image.constant(0).rename('classification_padding').updateMask(biome_img);
var bordaFuturo  = ee.Image.constant(1).rename('classification_padding').updateMask(biome_img);

// Define parameters for constructing the expanded image stack
var ultimo = ee.Number(anos_ee_list.get(0));
var anoFuturo   = ee.Number(anos_ee_list.get(0)).add(1);
var anoFuturo2  = ee.Number(anos_ee_list.get(0)).add(2);

// Assemble the expanded multi-band image including years before 2017 and after 2025
var imgExpandida = bordaPassado.rename('classification_2015')
         .addBands(bordaPassado.rename('classification_2016'))
         .addBands(imgCol) 
         .addBands(bordaFuturo.rename(ee.String('classification_').cat(anoFuturo.format())))
         .addBands(bordaFuturo.rename(ee.String('classification_').cat(anoFuturo2.format())));
        
// Set specific temporal variables for the reference year
var y_ref = ee.Number(oneYear);

// Extract the classification bands for the reference year and its neighbors from the expanded stack
var class_Ano_ref   = imgExpandida.select(ee.String('classification_').cat(y_ref.format()));
var classPrev_ref   = imgExpandida.select(ee.String('classification_').cat(y_ref.subtract(1).format()));
var classPrev2_ref  = imgExpandida.select(ee.String('classification_').cat(y_ref.subtract(2).format()));
var classNext_ref   = imgExpandida.select(ee.String('classification_').cat(y_ref.add(1).format()));
var classNext2_ref  = ee.String('classification_').cat(y_ref.add(2).format());

// Define the core function to apply the 3-year moving window temporal filter
var window3y = function (img, classe){
                // Map over the series to process every year individually
                var classWind = ee.ImageCollection(anos_ee_list.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();  
                    var nomeBanda = ee.String('classification_').cat(anoStr);

                    // Select the current year band and its immediate temporal neighbors
                    var class_Ano_curr   = img.select(nomeBanda);
                    var classPrev_curr   = img.select(ee.String('classification_').cat(ano.subtract(1).format()));
                    var classPrev2_curr  = img.select(ee.String('classification_').cat(ano.subtract(2).format()));
                    var classNext_curr   = img.select(ee.String('classification_').cat(ano.add(1).format()));
                    var classNext2_curr  = img.select(ee.String('classification_').cat(ano.add(2).format()));

                    // Create a mask identifying pixels where the current year differs from its neighbors (noise detection)
                    var mask_3 = classNext_curr.neq(classe)
                            .and(class_Ano_curr.eq(classe))
                            .and(classPrev_curr.neq(classe));
                            
                    // Logic to prioritize the neighbor value for replacement based on chronological position
                    var yearReplacement = classPrev_curr.where(ano.eq(2017), classNext_curr);
                    
                    // Remap valid classes into the replacement band and apply the noise detection mask
                    var mask = yearReplacement.remap([3,4,11,12,29,49,50,21,22,23,24,25],
                                                     [3,4,11,12,29,49,50,21,22,23,24,25]).updateMask(mask_3);
                                             
                    // Blend the original year classification with the corrected noise patches
                    var class_corr = class_Ano_curr.blend(mask.rename(nomeBanda));
                       
                    return class_corr;
                    
                                                            })).toBands();

        // Retrieve the first year band for rebuilding the final stack
        var class_pri   = img.select(ee.String('classification_2017')).rename('00_classification_2017');

        // Merge the processed collection bands into a single image stack
        var class_final_rebuilt = class_pri.addBands(classWind);
                                                            
        // Internal function to clean up index prefixes from band names after toBands conversion
        var corrIndx_internal  = function (img_internal){
              var indxNames = img_internal.bandNames();
              var bandNames_clean = indxNames.map(function(nome){
                  return ee.String(nome).split('_').slice(1).join('_');
                                                          });
              return img_internal.select(indxNames, bandNames_clean);
                                      };
        
        // Execute band name correction and re-assemble the expanded stack structure
        var corrigidaFinal = corrIndx_internal(classWind);
        
                return img.select(ee.String('classification_').cat(anoFuturo2.format()))
                          .addBands(img.select(ee.String('classification_').cat(anoFuturo.format())))
                          .addBands(corrigidaFinal)
                          .addBands(img.select('classification_2016'))
                          .addBands(img.select('classification_2015'));
                
};

// Iteratively apply the 3-year temporal filter for a prioritized sequence of land cover classes
var filtered = window3y(imgExpandida, 22);
    filtered = window3y(filtered, 23);
    filtered = window3y(filtered, 24);
    filtered = window3y(filtered, 25);
    filtered = window3y(filtered, 50);
    filtered = window3y(filtered, 29);
    filtered = window3y(filtered,  3);
    filtered = window3y(filtered, 49);
    filtered = window3y(filtered,  4);
    filtered = window3y(filtered, 21);
    filtered = window3y(filtered, 12);
    filtered = window3y(filtered, 11);

// Log the band names of the filtered image to the console
var bandsFilt_list = filtered.bandNames();
print(bandsFilt_list);

// Select only the classification bands corresponding to the 2017-2025 temporal range
filtered = filtered.select(
[
'classification_2017','classification_2018','classification_2019','classification_2020','classification_2021','classification_2022','classification_2023','classification_2024','classification_2025'
]
);

// Log the final processed multi-temporal image structure
print(filtered);

// Add the original and temporally filtered images to the map for comparison
Map.addLayer(imgCol, vis2, 'imgCol Original', false);
Map.addLayer(filtered, vis2, 'class_final Filtered', false);

// Generate a mask visualizing where classification changes occurred for the reference year
var efeito_mask = imgCol.select('classification_' + oneYear).neq(filtered.select('classification_' + oneYear));
Map.addLayer(efeito_mask, {min: 0, max: 1, palette: 'black, red'}, 'Filter Corrections');

// Apply standardized MapBiomas Collection 4 metadata properties to the output classification
filtered = filtered
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the multi-temporal filtered land cover classification as a Google Earth Engine Asset
Export.image.toAsset({
    'image': filtered,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    // Ensure categorical data uses mode pyramiding policy
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});