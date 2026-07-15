/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Correct false forest/savanna pixels by identifying them as commercial forest plantations.
 * 
 * DESCRIPTION:
 * This script identifies and reclassifies pixels incorrectly labeled as Forest (3) or Savanna (4) 
 * into Mosaic of Uses (21). The logic targets specific cases where natural forest regrowth is 
 * confused with commercial forestry. A pixel is corrected if it satisfies five cumulative conditions:
 * 
 * 1. Current State: The pixel is currently classified as natural vegetation (Forest/Savanna).
 * 2. Historical Context: The pixel was classified as an anthropic area (Mosaic of Uses) in the previous year.
 * 3. Topography: It is located on higher/steeper terrain according to the HAND (Height Above Nearest Drainage) model (>= 5m).
 * 4. External Reference: It is identified as a forest plantation in the Sentinel-2 LULC Collection (10m).
 * 5. Classification Confidence: It has a low average classification probability (uncertainty <= 70%) 
 *    in recent years (2017-2024).
 * 
 * The correction employs a mathematical sum of masks: 
 * Current Forest(1) + Previous Anthropic(1) + Combined HAND/S2(2) + Low Probability(1) = 5.
 * If the sum equals exactly 5, the pixel is remapped to class 21. 
 * The script processes the entire time series (1985-2025) and exports a multi-band filtered asset.
 */

// Define the description of the process for metadata.
var descricao = 'Removes forest from last years - between 21 and agriculture';

// Define the geometry for the Atlantic Forest region to clip the analysis.
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
var vesion_in = '17';
var versao_out = '18';

// Define the MapBiomas collection identifier.
var col = 11.0;

// Define the naming prefixes for input and output assets based on the processing phase.
var prefixo_in  = 'MA_col'+col+'_p09f_v';
var prefixo_out = 'MA_col'+col+'_p10a_v';

// Define the paths for input and output directories in the Earth Engine repository.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define reference variables for the target year and biome name.
var ano = 2020;
var bioma = "MATAATLANTICA";

// Load biome reference image and mask it to isolate the Atlantic Forest (class ID 2).
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
var biome_img = biomes_img.mask(biomes_img.eq(2));

// Import the official MapBiomas visualization palettes.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Standard visualization parameters for thematic classification maps.
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Year-specific visualization parameters for map rendering of the results.
var vis2 = {
    'bands': 'classification_'+ano,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Visualization parameters for the HAND topographic dataset.
var vis_hand = { 'min': 0, 'max': 60, 'palette': 'blue,white,green,orange,red,brown' };

// Define the full temporal range of the classification from 1985 to 2025.
var anos = [1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 
            1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 
            2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 
            2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
            
// Define the range of years used for calculating classification probability averages.
var anos_filtro = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Load the multi-band input classification image.
var imgCol = ee.Image(dirout + prefixo_in + vesion_in);

// Load the global HAND topographic image collection (Height Above Nearest Drainage).
var hand30_100 = ee.ImageCollection('users/gena/global-hand/hand-100').mosaic();

// Load the Sentinel-2 MapBiomas 10m dataset and reproject to Landsat's 30m resolution.
var colS2 = ee.Image('projects/mapbiomas-public/assets/brazil/lulc_10m/collection3/mapbiomas_10m_collection3_integration_v1')
              .reproject({ crs: 'EPSG:4326', scale: 30 });

// Load the multi-band probability image derived from the Random Forest classifier.
var prob = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/MA_col11_p05a_v16_prob');

// Condition A: Terrain mask identifying areas >= 5 meters above the nearest drainage.
var hand30_100_7 = hand30_100.gte(5);

// Condition B: Identify Forest Plantation pixels (ID 9) from the Sentinel-2 2021 layer.
var maskS2_9 = colS2.select('classification_2021').remap([9], [1]);

// Combine S2 Plantation reference and HAND topography. Resulting values: 0, 1, or 2.
// A value of 2 indicates a high-confidence topographical and spectral match for plantations.
var mask_S2_9 = maskS2_9.add(hand30_100_7);

// Condition C: Calculate mean probability for recent years to identify classification uncertainty.
var nomes_bandas = anos_filtro.map(function(ano) { return 'prob_' + ano; });
var media_prob = prob.select(nomes_bandas).reduce(ee.Reducer.mean());
// Mask pixels where classification confidence is relatively low (<= 70%).
var mask_prob = media_prob.lte(70);

// Initialize variables for cumulative temporal processing.
var image;
var class_corr;
var class_corr_s2;

// Iterate through each year to apply the five-condition reclassification logic.
for (var i_ano = 0; i_ano < anos.length; i_ano++) {
  var ano = anos[i_ano];
  var class_ano = imgCol.select('classification_' + ano);

  // Set the base year for the recursive logic.
  if (ano == 1985) {
    class_corr = class_ano;
  } else {
    // Condition 1: Check if the previously corrected year was Mosaic of Uses (21).
    var class_ante = class_corr.remap([21], [1], 0);
    // Condition 2: Check if current year is Forest (3) or Savanna (4).
    var mask_atual = class_ano.remap([3, 4], [1, 1], 0);

    // Sum of all binary masks:
    // Current Forest/Savanna (1) + Prev Mosaic (1) + HAND/S2 logic (2) + Low Probability (1) = 5.
    var soma_condicoes = mask_atual.add(class_ante).add(mask_S2_9).add(mask_prob);

    // Identify pixels that meet all 5 criteria simultaneously.
    class_corr_s2 = soma_condicoes.remap([5], [21]).selfMask();
    
    // Update classification for the current year by blending the correction mask over natural classes.
    class_corr = class_ano.blend(class_corr_s2).rename('classification_' + ano);
  }

  // Accumulate the corrected year band into the final image.
  if (i_ano == 0) { image = class_corr; } 
  else { image = image.addBands(class_corr); }
}

// Compare original image vs. corrected image.
Map.addLayer(imgCol, vis2, 'imgCol', true);
Map.addLayer(image, vis2, 'class_final', true);

// Assign standard MapBiomas metadata properties.
image = image
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the multi-temporal classification image as a single multi-band Asset.
Export.image.toAsset({
    "image": image.toInt8(),
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