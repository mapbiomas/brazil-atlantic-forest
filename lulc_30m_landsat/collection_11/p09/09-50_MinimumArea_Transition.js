/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Correcting small patches and temporal transition.
 * 
 * DESCRIPTION:
 * This script performs a spatio-temporal filter that improves the cartographic and temporal stability
 * of the land cover map by enforcing a minimum mapping unit (6 pixels ~ 0.5 ha) for transitions.
 * It iterates through years, checks transitions between consecutive years and
 * identifies year-to-year changes that happen in very small, fragmented patches and reverts them.
 * This is done for some classes (3, 4, 11, 12, 29, 50) transitioning to/from Mosaic of Uses (21).
 * 
 * The script iterates through the time series, comparing each year (ano) to the next (ano + 1).
 * Two variables are defined: (a) the class of the current and (b) the class of the next year.
 * Another transition variable is the current (a) multiplied by 100 and the sum with the next year (b): (a)*100 + (b).
 * The result of the sum will define the transitions that will be reversed or kept alongside with the minimum mapping unit.
 *  
 * The script targets transitions between natural classes (3, 4, 11, 12, 29, 50) and Mosaic of Uses (21).
 * It targets small patches of deforestation and regeneration, then creates a binary mask where the value is 1
 * only for the deforestation/regeneration patches that are smaller than 6 pixels.
 * The script then uses this error mask (= 1) to correct the map of the subsequent year (ano + 1)
 * based on the transition from current year (ano). It reduces salt-and-pepper pixels and improves thematic stability in the time series.
 * 
 * It uses as input data output data from script 09-40.
 * The output data from this script is used as an input in script 09-60.
 * 
 */

// Define the description of the process.
var descricao = 'Minimum area of transition';

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
var vesion_in = '15';
var versao_out = '16';

// Define the collection id.
var col = 11.0;

// Define input and output prefixes for asset naming.
var prefixo_in  = 'MA_col'+col+'_p09d_v';
var prefixo_out = 'MA_col'+col+'_p09e_v';

// Define input and output directories for assets.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define the year and biome.
var ano = 2020;
var bioma = "MATAATLANTICA";
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
var biome_img = biomes_img.mask(biomes_img.eq(2));

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

// Define the minimum number of connected pixels required for a transition to be considered valid.
var min_pix = 6; // ~0.5 ha

// Define the years to process. The last year is intentionally excluded from this list.
var anos = [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994,
    1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004,
    2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014,
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
    ];

//var class_corrigido = imgCol.select('classification_1985')

// Loop through each year in the list. This loop will process transitions from the current year to the next year.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification bands for the current year and the subsequent year from the input image.
  var class_ano_atual = imgCol.select('classification_'+ano);
  var class_ano_segui = imgCol.select('classification_'+ (ano + 1));
  //var class_final = imgCol.select('classification_2024');
  
  // Calculate a value representing the transition from the current year's class to the next year's class.
  // This is done by multiplying the current year's class by 100 and adding the next year's class
  // (e.g., 3 to 21 transition becomes 3*100 + 21 = 321).
  var transicao = (class_ano_atual.multiply(100)).add(class_ano_segui);
  //var conectedtransicao = transicao.connectedPixelCount(10,true).reproject('epsg:4326', null, 30);

  // --- Filter small patches of transitions from some classes to Mosaic of Uses (21) or vice versa ---

  // Check for transitions (lost) from class 3 (Forest Formation) to 21 (Mosaic of Uses) and filter small patches.
  var erro_desma_0321 = transicao.eq(321).and(transicao.eq(321).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lt(min_pix));
  // Check for transitions (gain) from class 21 (Mosaic of Uses) to 3 (Forest Formation) and filter small patches.
  var erro_regen_2103 = transicao.eq(2103).and(transicao.eq(2103).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lt(min_pix));
  // Correct the classification by blending. Small patches of 3->21 transitions revert to 3.
  var class_ano_segui_corr = class_ano_segui.blend(erro_desma_0321.remap([1],[3]));
  // Correct the classification by blending. Small patches of 21->3 transitions revert to 21.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2103.remap([1],[21]));

  // Check for transitions (lost) from class 4 (Savanna Formation) to 21 (Mosaic of Uses) and filter small patches.
  var erro_desma_0421 = transicao.eq(421).and(transicao.eq(421).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Check for transitions (gain) from class 21 (Mosaic of Uses) to 4 (Savanna Formation) and filter small patches.
  var erro_regen_2104 = transicao.eq(2104).and(transicao.eq(2104).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Correct the classification by blending. Small patches of 4->21 transitions revert to 4.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_0421.remap([1],[4]));
  // Correct the classification by blending. Small patches of 21->4 transitions revert to 21.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2104.remap([1],[21]));
  
  // Check for transitions (lost) from class 11 (Wetland) to 21 (Mosaic of Uses) and filter small patches.
  var erro_desma_1121 = transicao.eq(1121).and(transicao.eq(1121).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Check for transitions (gain) from class 21 (Mosaic of Uses) to 11 (Wetland) and filter small patches.
  var erro_regen_2111 = transicao.eq(2111).and(transicao.eq(2111).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Correct the classification by blending. Small patches of 11->21 transitions revert to 11.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_1121.remap([1],[11]));
  // Correct the classification by blending. Small patches of 21->11 transitions revert to 21.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2111.remap([1],[21]));

  // Check for transitions (lost) from class 12 (Grassland) to 21 (Mosaic of Uses) and filter small patches.
  var erro_desma_1221 = transicao.eq(1221).and(transicao.eq(1221).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Check for transitions (gain) from class 21 (Mosaic of Uses) to 12 (Grassland) and filter small patches.
  var erro_regen_2112 = transicao.eq(2112).and(transicao.eq(2112).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Correct the classification by blending. Small patches of 12->21 transitions revert to 12.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_1221.remap([1],[12]));
  // Correct the classification by blending. Small patches of 21->12 transitions revert to 21, and the band is renamed.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2112.remap([1],[21])).rename('classification_'+ (ano + 1));
  
  // Check for transitions (lost) from class 29 (Rocky Outcrop) to 21 (Mosaic of Uses) and filter small patches.
  var erro_desma_2921 = transicao.eq(2921).and(transicao.eq(2921).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Check for transitions (gain) from class 21 (Mosaic of Uses) to 29 (Rocky Outcrop) and filter small patches.
  var erro_regen_2129 = transicao.eq(2129).and(transicao.eq(2129).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Correct the classification by blending. Small patches of 29->21 transitions revert to 29.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_2921.remap([1],[29]));
  // Correct the classification by blending. Small patches of 21->29 transitions revert to 21, and the band is renamed.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2129.remap([1],[21])).rename('classification_'+ (ano + 1));

  // Check for transitions (lost) from class 50 (Herbaceous Sandbank Vegetation) to 21 (Mosaic of Uses) and filter small patches.
  var erro_desma_5021 = transicao.eq(5021).and(transicao.eq(5021).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Check for transitions (gain) from class 21 (Mosaic of Uses) to 50 (Herbaceous Sandbank Vegetation) and filter small patches.
  var erro_regen_2150 = transicao.eq(2150).and(transicao.eq(2150).connectedPixelCount(10,true).reproject('epsg:4326', null, 30).lte(min_pix));
  // Correct the classification by blending. Small patches of 50->21 transitions revert to 50.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_desma_5021.remap([1],[50]));
  // Correct the classification by blending. Small patches of 21->50 transitions revert to 21, and the band is renamed.
  class_ano_segui_corr = class_ano_segui_corr.blend(erro_regen_2150.remap([1],[21])).rename('classification_'+ (ano + 1));

  //class_corrigido = class_corrigido.addBands(class_ano_segui_corr);
  // Select the classification for the current year
  //var class_corr_ano = class_ano_segui_corr // class_corrigido.select('classification_'+ano)

  // Unmask pixels and set any masked or zero values to 21 (Native Forest),
  // then rename the band to the next year's classification.
  var unmasked = class_ano_segui_corr.unmask().remap([0],[21]).rename('classification_'+ (ano + 1));
  
  // Blend the corrected classifications with the unmasked and remapped version. Masked pixels become 21.
  var class_out = class_ano_segui_corr.blend(unmasked);

  // Combine the corrected classifications for all years into a single multi-band image collection.
  if (i_ano == 0){ // For the first year (1985).
    var class_outTotal = imgCol.select('classification_1985') // Start with the original classification for 1985.
                               .blend(imgCol.select('classification_1985').unmask() // Ensure 1985 is unmasked and filled if needed.
                               .remap([0],[21]).rename('classification_1985')) // Remap 0 to 21 for 1985.
                               .addBands(class_out); } // Add the corrected band for the next year (1986) to the collection.
  else {           // For subsequent years.
    class_outTotal = class_outTotal.addBands(class_out); } // Add the corrected band for the 'next year' (ano + 1) to the accumulated image collection.
  
}

print('class_outTotal', class_outTotal);

//class_outTotal = class_outTotal.addBands(class_final)

// Checking the results
// Create a binary mask indicating pixels where the classification in 2020 differs between the original input and the final corrected image.
var mask = imgCol.select('classification_2020')   // Select the 2020 band from the original image.
                 .neq(class_outTotal              // Compare it with the 2020 band from the corrected image.
                 .select('classification_2020')); // The result is 1 where they are different, 0 where they are the same.


// Calculate the difference between the original and corrected 2020 classification bands.
// Altered pixels = 1, non altered pixels = 0. (redundant variable as 'mask' is the same).
var diferencas_2020 = imgCol.select('classification_2020') // Select the 2020 band from the original image.
                            .neq(class_outTotal.select('classification_2020')); // Compare it with the 2020 band from the corrected image.
                            
// Reproject the difference layer for display purposes, forcing a 30m scale. (use carefully!)
var diferencas_2020_reproj = diferencas_2020.reproject({
    crs: imgCol.projection().crs(),
    scale: 30
});

// Create a layer that ONLY SHOWS THE PIXELS WHERE A DIFFERENCE OCCURRED between the original and corrected 2020 bands.
// A strong, noticeable color (like magenta or yellow) is used for visualization.

// Add the mask (differences) layer with the standard visualization.
Map.addLayer(mask, vis, 'mask', false);
// Add the original 2017 band for comparison.
Map.addLayer(imgCol.select('classification_2017'), vis, 'imgCol Original 2017', false);
// Add the original 2018 band for comparison.
Map.addLayer(imgCol.select('classification_2018'), vis, 'imgCol Original 2018', false);
// Add the original 2019 band for comparison.
Map.addLayer(imgCol.select('classification_2019'), vis, 'imgCol Original 2019', false);
// Add the original image with 2024 as the visible band.
Map.addLayer(imgCol, vis2, 'imgCol Original', true);
// Add the corrected image with 2024 as the visible band.
Map.addLayer(class_outTotal, vis2, 'class_outTotal', true);
// Map.addLayer(class_outTotal.select('classification_2017'),vis, 'class_outTotal 2017', true)
// Map.addLayer(class_outTotal.select('classification_2018'),vis, 'class_outTotal 2018', true)
// Map.addLayer(class_outTotal.select('classification_2019'),vis, 'class_outTotal 2019', true)
// Map.addLayer(class_outTotal.select('classification_2020'),vis, 'class_outTotal 2020', true)

// Add the layer showing only the pixels that were changed in the 2020 classification, highlighted in magenta.
Map.addLayer(diferencas_2020_reproj.updateMask(diferencas_2020),
             {palette: ['FF00FF']}, // Magenta.
             '*** ALTERED PIXELS (2020) ***',
             true);

// Adicionei um print para ver a imagem corrigida antes da exportação
print('Imagem Corrigida Final:', class_outTotal);

// Set the metadata for the final classification image.
class_outTotal = class_outTotal
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the final classification image to an asset.
Export.image.toAsset({
    "image": class_outTotal.toInt8(),
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": limite_MA,
    "overwrite":true
});