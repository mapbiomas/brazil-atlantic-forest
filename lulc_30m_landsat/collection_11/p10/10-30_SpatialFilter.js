/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Apply spatial filters for noise reduction and high-confidence forest preservation.
 * 
 * DESCRIPTION:
 * This script implements a dual-stage spatial post-processing pipeline for each year of 
 * the classification time series (1985–2025):
 * 
 * 1. General Spatial Filter (Noise Removal):
 *    Identifies small, isolated "salt-and-pepper" noise patches (6 pixels or smaller). 
 *    These patches are replaced by the most frequent class in their 3x3 neighborhood 
 *    using a focal mode filter. This smooths the map while preserving significant land features.
 * 
 * 2. High-Confidence Forest Refinement:
 *    Prevents the general filter from accidentally removing small but high-confidence 
 *    forest patches. It identifies pixels classified as Forest (3) with a probability 
 *    greater than 60%. If these high-confidence pixels form a patch of at least 
 *    3 connected pixels, they are forcibly re-inserted into the classification.
 * 
 * The output is a consolidated multi-temporal Asset (version 77) containing the 
 * spatially refined thematic classification for all years.
 */

// Define the descriptive name for the process used in metadata.
var descricao = 'Spatial filter';

// Define the overall geometry for the Atlantic Forest region to clip results.
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
var vesion_in = '19';
var versao_out = '20';

// Identify the current collection version.
var col = 11.0;

// Set naming prefixes for tracking processing steps in Asset IDs.
var prefixo_in  = 'MA_col'+col+'_p10b_v';
var prefixo_out = 'MA_col'+col+'_p10c_v';

// Define source and destination directory paths.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define parameters for map visualization.
var ano = 2020;
var bioma = "MATAATLANTICA";
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
var biome_img = biomes_img.mask(biomes_img.eq(2));

// Load the input classification image from the specified version.
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in);

// Import MapBiomas color palettes.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Standard classification visualization parameters.
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Specific visualization parameters for the selected year's classification band.
var vis2 = {
    'bands': 'classification_'+ano,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Thresholds for spatial filtering (patch sizes in pixels).
var min_connect_pixel = 6;       // Threshold for general noise patches.
var min_connect_pixel_agric = 6; // Specific threshold for agricultural noise.

// Load input data and the corresponding classification probability map.
var class4GAP     = ee.Image(dirout+prefixo_in+vesion_in);
var class4GAPprob = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/MA_col11_p05a_v16_prob');

// Print image metadata to console for inspection.
print(class4GAP);
print(class4GAPprob);

// Add the original layers to the map view.
Map.addLayer(class4GAP, vis2, 'class4GAP');
Map.addLayer(imgCol   , vis2, 'imgCol');

// Full list of years to be processed.
var anos = ['1985','1986','1987','1988','1989','1990','1991','1992','1993','1994',
            '1995','1996','1997','1998','1999','2000','2001','2002','2003','2004',
            '2005','2006','2007','2008','2009','2010','2011','2012','2013','2014',
            '2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];

// --- Annual Spatial Refinement Loop ---
for (var i_ano=0; i_ano<anos.length; i_ano++){
  
  // Extract specific year ID.
  var ano = anos[i_ano]; 
  
  // 1. Pre-processing: Fill data gaps and ensure consistency.
  // Unmask the band and remap 0 to class 21 (Mosaic of Uses) to ensure no empty pixels enter the filter.
  var unmasked = class4GAP.select('classification_'+ano).unmask().remap([0],[21]).rename('classification_'+ano);
  
  // Blend the original layer with the filled data.
  var class_in = class4GAP.blend(unmasked);
  
  // 2. Focal Mode Noise Removal.
  // Calculate the mode in a 3x3 square neighborhood.
  var moda = class_in.select('classification_'+ano).focal_mode(3, 'square', 'pixels');

  // Apply the mode filter only to pixels belonging to small patches (<= 6 connected pixels).
  // Larger objects remain unchanged to preserve feature edges.
  moda = moda.mask(class_in.select('classification_'+ano+'_conn').lte(min_connect_pixel));

  // Blend the corrected patches onto the input classification.
  var class_out = class_in.select('classification_'+ano).blend(moda);
  
  // 3. Forest Class Reinforcement (Confidence Logic).
  // Create a mask where classification probability exceeds 60%.
  var class4GAPprob_ano = class4GAPprob.select('prob_'+ano).gt(60);

  // Identify areas already classified as Forest (ID 3) in the input.
  var flo_ano = class_in.select('classification_'+ano).remap([3],[1]);

  // Combined rule: High probability AND already Forest.
  // Value 2 indicates a high-confidence forest pixel.
  var flo_90_ano = flo_ano.add(class4GAPprob_ano).remap([2],[1]);

  // Perform a connectivity check on the high-confidence forest mask.
  // Reproject ensures consistent scale for connectivity counting.
  var flo_90_ano_con = flo_90_ano.connectedPixelCount(10, true).reproject('epsg:4326', null, 30);
  
  // Identify high-confidence patches that are 3 pixels or larger.
  // Remap them back to thematic Forest ID (3).
  var flo_3pix = flo_90_ano_con.gte(3).remap([1],[3]).select(['remapped'],['classification_'+ano]);
  
  // Blend the high-confidence forest patches back into the filtered image.
  // This prevents small forest fragments from being incorrectly reclassified by the mode filter.
  var class_out2 = class_out.blend(flo_3pix);
  
  // Accumulate yearly filtered results into a final multi-band image.
  if (i_ano == 0){ var class_outTotal = class_out2; }  
  else {class_outTotal = class_outTotal.addBands(class_out2); }
}

// Consolidate final processing output.
var class_final = class_outTotal;
print(class_final);

// Add the consolidated filtered result and intermediate steps to the map.
Map.addLayer(class_final, vis2, 'class_final');
Map.addLayer(class_in, vis2, 'class_in');
Map.addLayer(unmasked, vis, 'unmasked');

// --- Export and Metadata Section ---

// Attach standard MapBiomas metadata properties for biome, collection, and versioning.
class_final = class_final
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the final spatially filtered thematic classification image as an Earth Engine Asset.
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