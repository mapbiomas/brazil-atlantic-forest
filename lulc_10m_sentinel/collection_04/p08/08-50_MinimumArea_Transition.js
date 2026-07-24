/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Define the Minimum Mapping Unit (MMU) for land cover transitions to ensure spatio-temporal stability.
 * 
 * DESCRIPTION:
 * This script implements a spatio-temporal filter designed to improve the cartographic and temporal stability 
 * of the classification by enforcing a minimum mapping unit (approximately 0.5 ha, corresponding to ~25 pixels 
 * at 10m resolution) for land cover transitions. It specifically targets transitions between natural vegetation 
 * classes (Forest, Savanna, Wetland, Grassland, etc.) and the "Mosaic of Uses" (class 21).
 * 
 * The algorithm logic proceeds as follows:
 * 1. It iterates through the time series from 2017 to 2024, comparing each year (t) with the subsequent year (t+1).
 * 2. It creates a transition image where values represent specific class changes (e.g., class 3 to 21 becomes 321).
 * 3. It identifies spatially fragmented transition patches using the 'connectedPixelCount' function.
 * 4. Transition patches smaller than the defined threshold (min_pix) are considered noise (salt-and-pepper) and 
 *    are reverted to the original class of the previous year.
 * 5. This process reduces unrealistic year-to-year oscillations in small areas, ensuring that detected 
 *    deforestation or regeneration events meet a minimum spatial size requirement.
 */

// Define the processing description in English
var description = 'Define Minimum Area for Transitions';
// Set the collection ID as a float value for Collection 4.0
var collection_id = 4.0;

// Define the target biome
var bioma = "MATAATLANTICA";

// Define input and output versions as strings in single quotes
var version_in = '9';
var version_out = '10';

// Define the input and output prefixes for asset names
var prefixo_in = 'MA_S2_p84_v';
var prefixo_out = 'MA_S2_p85_v';

// Define the directory paths for input and output assets
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat-ft/'; 

// Load the multi-temporal classification image from the previous filtering step
var imgCol =  ee.Image(dirout + prefixo_in + version_in);

// Define the study area geometry for the Atlantic Forest
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
    
    // Import the shared palettes module for standardized visualization
    var palettes = require('users/mapbiomas/modules:Palettes.js');
    
// Reference year for specific visualization
var oneYear = 2018;

// Define visualization parameters for classification layers
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
// Visualization parameters for the specified reference year band
var vis2 = {
    'bands': 'classification_' + oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Define the threshold for minimum mapping unit (~0.5 ha)
var min_pix = 25; 

// Define the years to process transitions; the last year (2025) is the target of the final transition check
var anos = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Iterate through the chronological list of years to analyze transitions
for (var i_ano=0; i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification bands for the current year (t) and the next year (t+1)
  var class_ano_atual = imgCol.select('classification_' + ano);
  var class_ano_segui = imgCol.select('classification_' + (ano + 1));
  
  // Create a transition band where values represent a change from class A to class B
  // Multiplying by 100 allows encoding both classes into a single 3- or 4-digit code
  var transicao = (class_ano_atual.multiply(100)).add(class_ano_segui);

  // --- Filter small patches of transitions between natural classes and Mosaic of Uses (21) ---

  // Check for small patches of Forest (3) transitioning to Mosaic (21) (Deforestation)
  var erro_desma_0321 = transicao.eq(321).and(transicao.eq(321).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lt(min_pix));
  // Check for small patches of Mosaic (21) transitioning to Forest (3) (Regeneration)
  var erro_regen_2103 = transicao.eq(2103).and(transicao.eq(2103).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lt(min_pix));
  // Revert 3->21 transitions back to 3 if the area is smaller than the threshold
  var class_ano_segui_corr = class_ano_segui.blend(erro_desma_0321.remap([1],[3]));
  // Revert 21->3 transitions back to 21 if the area is smaller than the threshold
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2103.remap([1],[21]));

  // Check for small patches of Savanna (4) transitioning to Mosaic (21)
  var erro_desma_0421 = transicao.eq(421).and(transicao.eq(421).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Check for small patches of Mosaic (21) transitioning to Savanna (4)
  var erro_regen_2104 = transicao.eq(2104).and(transicao.eq(2104).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Revert 4->21 transitions back to 4 for small isolated patches
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_0421.remap([1],[4]));
  // Revert 21->4 transitions back to 21 for small isolated patches
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2104.remap([1],[21]));
  
  // Check for small patches of Wetland (11) transitioning to Mosaic (21)
  var erro_desma_1121 = transicao.eq(1121).and(transicao.eq(1121).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Check for small patches of Mosaic (21) transitioning to Wetland (11)
  var erro_regen_2111 = transicao.eq(2111).and(transicao.eq(2111).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Revert 11->21 small transition patches back to 11
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_1121.remap([1],[11]));
  // Revert 21->11 small transition patches back to 21
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2111.remap([1],[21]));

  // Check for small patches of Grassland (12) transitioning to Mosaic (21)
  var erro_desma_1221 = transicao.eq(1221).and(transicao.eq(1221).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Check for small patches of Mosaic (21) transitioning to Grassland (12)
  var erro_regen_2112 = transicao.eq(2112).and(transicao.eq(2112).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Revert 12->21 small patches to Grassland
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_1221.remap([1],[12]));
  // Revert 21->12 small patches back to Mosaic
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2112.remap([1],[21])).rename('classification_'+ (ano + 1));
  
  // Check for small patches of Rocky Outcrop (29) transitioning to Mosaic (21)
  var erro_desma_2921 = transicao.eq(2921).and(transicao.eq(2921).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Check for small patches of Mosaic (21) transitioning to Rocky Outcrop (29)
  var erro_regen_2129 = transicao.eq(2129).and(transicao.eq(2129).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Revert small 29->21 patches back to Rocky Outcrop
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_2921.remap([1],[29]));
  // Revert small 21->29 patches back to Mosaic
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2129.remap([1],[21])).rename('classification_'+ (ano + 1));

  // Check for small patches of Sandbank Vegetation (50) transitioning to Mosaic (21)
  var erro_desma_5021 = transicao.eq(5021).and(transicao.eq(5021).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Check for small patches of Mosaic (21) transitioning to Sandbank Vegetation (50)
  var erro_regen_2150 = transicao.eq(2150).and(transicao.eq(2150).connectedPixelCount(51,true).reproject('epsg:4326', null, 10).lte(min_pix));
  // Revert small 50->21 patches back to Sandbank Vegetation
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_5021.remap([1],[50]));
  // Revert small 21->50 patches back to Mosaic
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2150.remap([1],[21])).rename('classification_'+ (ano + 1));

  // Handle unmasking for potentially empty pixels, defaulting them to Forest (3) if they were 0
  var unmasked = class_ano_segui_corr.unmask().remap([0],[3]).rename('classification_'+ (ano + 1));
  
  // Blend the corrections into the output for the current year
  var class_out = class_ano_segui_corr.blend(unmasked);

  // If processing the first interval (2017 to 2018), start the output stack with 2017
  if (i_ano == 0){ 
    var class_outTotal = imgCol.select('classification_2017') 
                               .blend(imgCol.select('classification_2017').unmask() 
                               .remap([0],[3]).rename('classification_2017')) 
                               .addBands(class_out); } 
  // For subsequent years, append the corrected year band to the stack
  else {           
    class_outTotal = class_outTotal.addBands(class_out); } 
  
}

// Log the final consolidated classification to the console
print('class_outTotal', class_outTotal);

// Result verification block for the year 2020
// Create a binary mask showing pixels that were changed in 2020 during this process
var mask = imgCol.select('classification_2020')   
                 .neq(class_outTotal              
                 .select('classification_2020')); 


// Isolate the differences specifically for 2020 to visualize change intensity
var diferencas_2020 = imgCol.select('classification_2020') 
                            .neq(class_outTotal.select('classification_2020')); 
                            
// Reproject the difference layer to force 10m visualization
var diferencas_2020_reproj = diferencas_2020.reproject({
    crs: imgCol.projection().crs(),
    scale: 10
});

// Display various original and processed layers for validation on the map
Map.addLayer(mask, vis, 'mask', false);
Map.addLayer(imgCol.select('classification_2017'), vis, 'imgCol Original 2017', false);
Map.addLayer(imgCol.select('classification_2018'), vis, 'imgCol Original 2018', false);
Map.addLayer(imgCol.select('classification_2019'), vis, 'imgCol Original 2019', false);
Map.addLayer(imgCol, vis2, 'imgCol Original', true);
Map.addLayer(class_outTotal, vis2, 'class_outTotal', true);

// Add the layer highlighting pixels changed in 2020, using magenta for high visibility
Map.addLayer(diferencas_2020_reproj.updateMask(diferencas_2020),
             {palette: ['FF00FF']}, 
             '*** ALTERED PIXELS (2020) ***',
             true);

// Apply MapBiomas Collection 4 metadata properties to the final multi-band classification
class_outTotal = class_outTotal
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the final spatio-temporally filtered classification as a Google Earth Engine Asset
Export.image.toAsset({
    'image': class_outTotal,
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