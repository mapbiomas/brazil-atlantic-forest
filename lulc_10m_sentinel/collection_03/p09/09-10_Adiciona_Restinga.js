/**
 * This script makes geographically specific corrections and refinements using
 * imported vector geometries and topographic data to correct specific ecological zones (Sandbank Vegetation)
 * and geological features (Rocky Outcrops).
 * It adds Wooded Sandbank Vegetation and restricts Herbaceous Sandbank Vegetation to coastal areas,
 * and adds Rocky Outcrop, all based on geometry imports in the script.
 * 
 * It loads some datasets to provide geographic context:
 * (a) a Digital Elevation Model (DEM) (ALOS AW3D30), used to derive elevation and slope,
 * (b) a map of coastal soil types, an indicator for a specific types of coastal vegetation,
 * and (c) 3 geometry imports (restinga, ad_restinga, convert22to29) used to delineate areas that require specific classification changes.
 * 
 * The script iterates through every year from 1985 to 2024, remaps Temporary Crop (19)
 * to Other Temporary Crops (41) and Non vegetated area (22) to Other non Vegetated Areas (25),
 * then makes corrections in three classes: Wooded Sandbank Vegetation (49), Herbaceous Sandbank Vegetation (50) and Rocky Outcrop (29).
 * For Wooded Sandbank Vegetation (49), it identifies all pixels that are classified
 * as Forest (3) AND are also located in very low-elevation areas (< 25 meters)
 * WITHIN the specific restinga geometry and changes its value to 49 (Wooded Sandbank Vegetation).
 * For Herbaceous Sandbank Vegetation (50), it creates an image that preserves pixels classified
 * as Herbaceous Sandbank Vegetation (50 ONLY if they fall WITHIN the areas defined by the coastal soils map
 * or the ad_restinga geometry, then creates a new base map where all original instances of class 50 are remapped to 21 (Mosaic of Uses),
 * and blend them retrieving only the class 50 within the limits of the geometry import.
 * And for Rocky Outcrop (29), it identifies pixels inside the convert22to29 geometry that were classified
 * as Other non Vegetated Areas (25) and changes these pixel values from 25 to 29 (Rocky Outcrop).
 * 
 * It uses as input data output data from script 10-10.
 * The output data from this script is used as an input in script 10-30.
 * 
 */

var description = 'Adiciona restinga arborea'
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define input and output version numbers
var vesion_in = '21';
var version_out = '22';

// Define input and output prefixes for asset names
var prefixo_in = 'MA_S2_p87_v';
var prefixo_out = 'MA_S2_p91_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft/'; // Output directory


var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Load the collection 10 image.
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in).clip(regioesCollection);

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
// Define the visualization parameters for HAND.
var vis_hand = {
    'min': 0,
    'max': 60,
    'palette': 'blue,white,green,orange,red,brown'
};

// Load MapBiomas Collection 9 integrated asset.
var col9 = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1');
// Map.addLayer(col9, vis2, 'col9');
  
// Add the classification image to the map.
Map.addLayer(imgCol, vis2, 'imgCol');

// Load global terrain data from JAXA's ALOS AW3D30 product.
var terrain = ee.Image("JAXA/ALOS/AW3D30_V1_1").select("AVE");
//Map.addLayer(terrain,{},'relevo',false);

// Calculate the slope from the terrain elevation data.
var slope = ee.Terrain.slope(terrain);
//Map.addLayer(slope,{},'slope',false);

// Create a binary mask for areas with elevation less than 25 meters, clipped by the imported `restinga` geometry.
var plan = terrain.lt(25).clip(restinga).selfMask();

// Load a feature collection representing coastal soils from IBGE data.
var solo_costeiro = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/RESTINGA/SolosIBGE_SCostMarinhoBR');
    // Set the 'reference' property to 1 for each feature.
    solo_costeiro = solo_costeiro.map(function altera(feat) {return feat.set('reference',1)});
    
    // Merge the coastal soil feature collection with the imported `ad_restinga` feature collection to include Wooded Sandbank areas.
    var vet_corr_rest = solo_costeiro.merge(ad_restinga);

// Convert the merged feature collection (`vet_corr_rest`) into an image.
// This creates a binary image where pixels within the combined
// coastal soil/restinga areas have a value of 1 (from the 'reference' property).
var img_corr_rest = vet_corr_rest.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
Map.addLayer(img_corr_rest, {}, 'img_corr_rest');

// Define the years to process.
var anos = ['2017','2018','2019','2020','2021','2022','2023','2024'];

// Loop through the years and apply corrections.
for (var i_ano=0;i_ano<anos.length; i_ano++){  
  var ano = anos[i_ano]; 
  
  // Select the classification band for the current year from the input image (`imgCol`).
  // Apply an initial remapping to specific classes within this year's band.
  // This changes class 19 (Temporary Crop) to 41 (Other Temporary Crops), 
  // and class 22 (Non vegetated area) to 25 (Other non Vegetated Areas).
  var imgCol_ano = imgCol.select('classification_'+ano).remap([3,4,9,11,12,50,19,21,22,29,33,49],
                                                              [3,4,9,11,12,50,41,21,25,29,33,49]).rename('classification_'+ano);
  
//var mask_sav = imgCol_integracao.select('classification_'+ano).eq(21).clip(converter21para4).remap([1],[4]).rename('classification_'+ano);

  // Create corrections specifically for Restinga vegetation (Wooded and Herbaceous).

  // Identify areas classified as original Forest Formation (3) AND in the low-elevation mask (`plan`).
  // Clip the result to the 'restinga' geometry, then remap these pixels from 3 to 49 (Wooded Sandbank Vegetation).
  var restinga_abor = imgCol_ano.mask(imgCol_ano.eq(3).and(plan.eq(1))).remap([3],[49]).rename('classification_'+ano);
  // Identify areas classified as Herbaceous Sandbank Vegetation (50) AND within the rasterized coastal soil/additional restinga mask (`img_corr_rest`).
  // This mask retains original class 50 where it overlaps with coastal/restinga criteria.
  var restinga_herb = imgCol_ano.mask(imgCol_ano.eq(50).and(img_corr_rest.eq(1))).rename('classification_'+ano);

  // Re-select the classification band for the current year from `imgCol`.
  // Apply a SECOND remapping.
  // Class 50 (Herbaceous Sandbank Veg) is remapped to 21 (Mosaic of Uses).
  // Class 22 (Non vegetated area) still remapped to 25 (Other non Vegetated Areas).
  // Class 19 (Temporary Crop) still remapped to 41 (Other Temporary Crops).
  imgCol_ano = imgCol.select('classification_'+ano).remap([3,4,9,11,12,50,19,21,22,29,33,49],
                                                          [3,4,9,11,12,21,41,21,25,29,33,49]).rename('classification_'+ano);

  // Load the `convert22to29` geometry. Assumes `convert22to29` is an imported geometry defining areas for 22 to 29 correction.
  // Rasterize the `convert22to29` geometry to an image, using the 'reference' property (value = 100).
  var img_corr_aflora = convert22to29.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  // Create a correction image for 'Rocky Outcrop' (class 29).
  // It adds `imgCol_ano` (the classification band *after* the second remapping,
  // where 22->25) to `img_corr_aflora` (which has value 100 in the polygon).
  // It then checks where this sum is exactly 125. If true (1), it remaps that pixel to 29 (Rocky Outcrop).
  var corrige_aflora = imgCol_ano.add(img_corr_aflora).eq(125).remap([ 1],[29]).clip(convert22to29);

  // Blend the original classification with the corrected classifications.
  var class_out = imgCol_ano.blend(restinga_abor)   // Blend with wooded restinga correction.
                            .blend(restinga_herb)   // Blend the result with herbaceous restinga correction.
                            // .blend(corrige_aflora); // Blend the result with rocky outcrop correction.
                            //.blend(mask_sav);

  // Combine the corrected classifications for all years.
  if (i_ano == 0){ var class_outTotal = class_out; }  
  else {class_outTotal = class_outTotal.addBands(class_out); }
}

// Add the final classification image to the map.
Map.addLayer(class_outTotal, vis2, 'imgCol Final');
Map.addLayer(plan,{'palette': 'yellow'},'plan',false);
//Map.addLayer(class_out2, vis, 'class_out2');

// Define the final classification image.
var image = class_outTotal;

// Define the years to process.
var years = [
    2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Create a list of band names.
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a histogram dictionary of band names and image band names.
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

print(bandsOccurrence);

// Create a dictionary of bands with masked bands.
// Create a dictionary where keys are band names and values are Image objects.
// This is a step towards ensuring all expected bands are present and in the correct order.
var bandsDictionary = bandsOccurrence.map(
    function (key, value) { // For each key-value pair (band name and its occurrence count):
        // If count is 2, select that band from the constructed `image`.
        // If count is 1, create a dummy masked band with the correct name and type.
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                // If the band occurs twice, select the band from the original image.
                image.select([key]).byte(),
                // If the band occurs once, create a masked band.
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Convert the dictionary to an single multi-band image.
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            // Add the band from the dictionary to the image
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band))); // Add the band retrieved from the dictionary to the current image.
        },
        // Initialize the image with an empty selection.
        ee.Image().select()
    )
);

// Generate an image where each pixel's value is the year it represents.
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);
        
// Add connected pixels count bands to the final multi-band classification image.
// For each classification band ('classification_YYYY'), a new band 'classification_YYYY_conn' is created
// indicating the number of connected pixels with the same class value for each pixel.
var imageFilledConnected = image.addBands(
    image
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn');
            }
        ))
);

print(imageFilledConnected);

// Set the metadata for the final classification image.
imageFilledConnected = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': imageFilledConnected,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});
