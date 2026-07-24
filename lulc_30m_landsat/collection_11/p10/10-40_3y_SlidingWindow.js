/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Application of a 3-year moving window temporal consistency filter.
 * 
 * DESCRIPTION:
 * This script addresses temporal classification noise (transient errors) by analyzing three 
 * consecutive years in the time series (1985–2025). It identifies instances where a pixel 
 * switches to a different class for only one year and then reverts to the previous class 
 * (e.g., Forest -> Grassland -> Forest).
 * 
 * Logic:
 * 1. Preparation: The script loads the classification results and adds "temporal padding" bands 
 *    (years 1984 and 2026) to allow the window filter to work on the edge years (1985 and 2025).
 * 2. Temporal Analysis: For every target year, it compares the current class with the 
 *    preceding and succeeding years.
 * 3. Masking: A 'mask_3' is created where a pixel is classified as 'Class X' in year T, 
 *    but as 'NOT Class X' in years T-1 and T+1.
 * 4. Correction: For pixels identified by the mask, the classification of the middle year 
 *    is replaced by the classification of the previous year (or the subsequent year for 
 *    the start of the series).
 * 5. Iteration: The filter is applied iteratively for multiple thematic classes (Forest, 
 *    Savanna, Grassland, etc.) to ensure overall temporal stability.
 * 6. Export: The final filtered multi-band image is exported.
 */

// Define the descriptive name for the post-classification step.
var descricao = '3 years sliding window';

// Define the geographical extent for clipping and exporting the Atlantic Forest biome.
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
var vesion_in = '20';
var versao_out = '21';

// Identification number of the current MapBiomas collection.
var col = 11.0;

// Set naming conventions for assets to maintain processing pipeline trace.
var prefixo_in  = 'MA_col'+col+'_p10c_v';
var prefixo_out = 'MA_col'+col+'_p10d_v';

// Define the specific GEE project directory paths for data access and storage.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define parameters for map visualization and biome filtering.
var oneYear = 2025;
var bioma = "MATAATLANTICA";

// Load the biome reference map and mask it specifically for the Atlantic Forest (class ID 4).
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biome_2025_buf5k_10m');
var biome_img = biomes_img.eq(4).selfMask();

// Load the multi-temporal classification image from the previous spatial filtering step.
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in);

// Import the external MapBiomas palettes module for consistent thematic colors.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Configure standard visualization parameters for land cover classes.
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Year-specific visualization parameters for viewing results in the map canvas.
var vis2 = {
    'bands': 'classification_'+oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Generate a sequence of integers representing the years from 2025 down to 1985.
var anos = ee.List.sequence(2025, 1985, -1)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });

// 1. Create padding images for the temporal edges to allow the 3-year window to process 1985 and 2025.
var bordaPassado = ee.Image.constant(0).rename('classification_padding').updateMask(biome_img);
var bordaFuturo  = ee.Image.constant(1).rename('classification_padding').updateMask(biome_img);

// 2. Build the expanded temporal image stack containing classification bands plus padding for context.
var anoFuturo = ee.Number(anos.get(0)).add(1);
var imgExpandida = bordaFuturo.rename(ee.String('classification_').cat(anoFuturo.format()))
                  .addBands(imgCol) // Official series bands (1985 to 2025)
                  .addBands(bordaPassado.rename('classification_1984'));

/**
 * CORE LOGIC: Moving Window function
 * Processes the multi-band classification image to remove single-year spikes for a target class.
 */
var window3y = function (img, classe){
                // Map over the list of years to apply filtering logic to each band.
                var classWind = ee.ImageCollection(anos.map(function(ano){
                    ano = ee.Number(ano);
                    var anoStr = ano.format();  
                    var nomeBanda = ee.String('classification_').cat(anoStr);

                    // Select the current year (Ano), previous year (Prev), and following year (Next).
                    var class_Ano = img.select(nomeBanda);
                    var classPrev = img.select(ee.String('classification_').cat(ano.subtract(1).format()));
                    var classNext = img.select(ee.String('classification_').cat(ano.add(1).format()));
                    
                    // Logical handling for the start of the series (1985): replace with next year if 1984 is empty.
                    var classReplacement = ee.Image(ee.Algorithms.If(
                                              ano.eq(1985),       
                                              classNext,          
                                              classPrev           
                      )
                    );

                    // mask_3: Logic identifying where current class differs from its temporal neighbors.
                    // Condition: (Next != Class) AND (Center == Class) AND (Prev != Class).
                    var mask_3 = classNext.neq(classe)
                            .and(class_Ano.eq(classe))
                            .and(classPrev.neq(classe));
       
                    // Remap the replacement data to ensure only official thematic classes are used, then mask.
                    mask_3 = classReplacement.remap([3,4,11,12,21,22,29,50],
                                                    [3,4,11,12,21,22,29,50]).updateMask(mask_3);
                                             
                    // Blend the identified spikes with the replacement classification.
                    var class_corr = class_Ano.blend(mask_3.rename(nomeBanda));
                       
                    return class_corr;
                    
                                                            })).toBands();

        // Initialize band collection starting with the 1985 band.
        var class_pri   = img.select(ee.String('classification_1985')).rename('00_classification_1985');

        var class_final = class_pri.addBands(classWind);
                                                            
        /**
         * Helper function to clean band names by removing prefixes added during toBands conversion.
         */
        var corrIndx  = function (img){
              var indxNames = img.bandNames();
              var bandNames = indxNames.map(function(nome){
                  return ee.String(nome).split('_').slice(1).join('_');
                                                          });
              return img.select(indxNames,bandNames);
                                      };

        // Finalize renaming and re-attach the padding bands to maintain recursion compatibility.
        var corrigidaFinal = corrIndx(classWind);
        print('corrigidaFinal',corrigidaFinal);
                return img.select(ee.String('classification_').cat(anoFuturo.format()))
                          .addBands(corrigidaFinal)
                          .addBands(img.select('classification_1984'));
                
};

// Sequentially apply the temporal filter for specific target classes to maximize consistency.
var filtered = window3y(imgExpandida,   22); // Non-vegetated
    filtered = window3y(filtered, 50);       // Herbaceous Restoration
    filtered = window3y(filtered, 29);       // Rocky Outcrop
    filtered = window3y(filtered,  3);       // Forest Formation
    filtered = window3y(filtered,  4);       // Savanna Formation
    filtered = window3y(filtered, 21);       // Mosaic of Uses
    filtered = window3y(filtered, 12);       // Grassland Formation
    filtered = window3y(filtered, 11);       // Wetland

// Extract and verify band names after processing.
var bandsFilt = filtered.bandNames();
print(bandsFilt);

// Select only the classification bands for the official mapping interval (1985–2025).
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

// Add original and filtered classification layers to the map for comparison.
Map.addLayer(imgCol, vis2, 'imgCol'+oneYear, true);
Map.addLayer(filtered, vis2, 'class_final'+oneYear, true);

// Create a diagnostic layer to highlight pixels that were changed by the moving window filter.
var efeito = imgCol.select('classification_2017').neq(filtered.select('classification_2017'));
Map.addLayer(efeito, {}, 'mudancas');

// --- METADATA AND EXPORT ---

// Attach MapBiomas metadata attributes for documentation and asset traceability.
filtered = filtered
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the filtered multi-temporal classification image as a Google Earth Engine Asset.
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