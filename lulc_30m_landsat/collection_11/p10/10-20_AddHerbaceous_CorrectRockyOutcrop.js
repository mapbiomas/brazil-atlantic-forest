/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Geographically specific refinements for Sandbank Vegetation (Restinga) and Rocky Outcrops.
 * 
 * DESCRIPTION:
 * This script implements post-classification refinements using spatial context, topographic data, 
 * and specific ground-truth geometries. It corrects three main target classes:
 * 
 * 1. Wooded Sandbank Vegetation (49): Identifies Forest (3) pixels in low-elevation areas (< 25m) 
 *    within designated coastal restinga zones.
 * 2. Herbaceous Sandbank Vegetation (50): Restricts the occurrence of this class to specific coastal 
 *    soil types (IBGE) and additional validation geometries, remapping outliers to Mosaic of Uses (21).
 * 3. Rocky Outcrop (29): Applies a spatial "border rule" logic where Non-vegetated (22) pixels 
 *    located at the interface of natural and anthropic areas are converted to Rocky Outcrops, 
 *    supplemented by specific conversion geometries.
 * 
 * The script utilizes the ALOS AW3D30 DEM for terrain analysis and processes the entire time 
 * series (1985–2025). Finally, it calculates connected pixel counts for each classification 
 * band to support future spatial filtering and exports the result as version 76.
 */

// Define the description of the process for metadata purposes.
var descricao = 'Adds Wooded Sandbank Vegetation and Corrects Rocky Outcrop areas';
  
// Define the geometry for the Atlantic Forest region to clip the output.
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
var vesion_in = '18';
var versao_out = '19';

// Define the MapBiomas collection identifier.
var col = 11.0;

// Define prefixes for asset naming convention.
var prefixo_in  = 'MA_col'+col+'_p10a_v';
var prefixo_out = 'MA_col'+col+'_p10b_v';

// Define the input and output directories within the Earth Engine asset environment.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define a default year for map visualization and the biome identifier.
var ano = 2020;
var bioma = "MATAATLANTICA";

// Load the biome raster and mask it specifically for the Atlantic Forest (class 2).
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
var biome_img = biomes_img.mask(biomes_img.eq(2));

// Load the input multi-band classification image from the specified version.
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in);

// Import the official MapBiomas visualization palettes.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Standard classification visualization parameters.
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Year-specific visualization parameters for the map view.
var vis2 = {
    'bands': 'classification_'+ano,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load MapBiomas Collection 10.1 public data for reference comparison.
var col10 = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1');
Map.addLayer(col10, vis2, 'col10');

// Print collection metadata for debugging.
print(col10)

// Duplicate the 2024 classification band to use as a placeholder for 2025 in reference data.
var col10_2025 = col10.select('classification_2024').rename('classification_2025');
col10 = col10.addBands(col10_2025);

// Print updated reference collection metadata.
print(col10)
    
// Add the working classification image to the map.
Map.addLayer(imgCol, vis2, 'imgCol');

// Load global terrain elevation data from JAXA (ALOS AW3D30).
var terrain = ee.Image("JAXA/ALOS/AW3D30_V1_1").select("AVE");

// Calculate terrain slope from the elevation data.
var slope = ee.Terrain.slope(terrain);

// Create a binary mask for flat coastal areas (elevation < 25m) using imported restinga geometries.
var plan = terrain.lt(25).clip(restinga).selfMask();

// Load coastal soil feature collection from IBGE.
var solo_costeiro = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/RESTINGA/SolosIBGE_SCostMarinhoBR');
// Map over features to set a standard reference property.
solo_costeiro = solo_costeiro.map(function altera(feat) {return feat.set('reference',1)});

// Combine IBGE coastal soils with manual 'ad_restinga' geometries for a comprehensive refinement mask.
var vet_corr_rest = solo_costeiro.merge(ad_restinga);

// Convert the combined vector refinements into a raster image for pixel-wise logical operations.
var img_corr_rest = vet_corr_rest.reduceToImage({properties: ['reference'], reducer: ee.Reducer.first()});
Map.addLayer(img_corr_rest, {}, 'Area de restinga mantinda');

// List of strings representing the years in the classification time series.
var anos = ['1985','1986','1987','1988','1989','1990','1991','1992','1993','1994',
            '1995','1996','1997','1998','1999','2000','2001','2002','2003','2004',
            '2005','2006','2007','2008','2009','2010','2011','2012','2013','2014',
            '2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
            
// Define logical groups for natural classes (Targeting Rocky Outcrop ID 29).
var classesNaturais = [29];

// Define logical groups for anthropic classes (Targeting Non-vegetated ID 22).
var classesAntropicas = [22];

/**
 * Spatial refinement function for Rocky Outcrops.
 * Identifies Non-vegetated (22) pixels acting as borders between Natural and Anthropic areas.
 */
var extrairBorda = function(bandName) {
  // Select the classification band for the current year.
  var imgAno = imgCol.select([bandName]);
  var intAno = col10.select([bandName]);

  // Rule A: The current pixel must be class 22 (Non-vegetated).
  var is22 = imgAno.eq(22);

  // Rule B: Create binary masks for Natural and Anthropic context classes.
  var mascaraNatural = imgAno.remap(
    classesNaturais, 
    ee.List.repeat(1, classesNaturais.length), 
    0
  );
  
  var mascaraAntropica = imgAno.remap(
    classesAntropicas, 
    ee.List.repeat(1, classesAntropicas.length), 
    0
  );

  // Rule C: Expand masks using focal maximum to find neighbors within 4 pixels.
  var pertoNatural = mascaraNatural.focalMax({radius: 4, kernelType: 'octagon', units: 'pixels'});
  var pertoAntropica = mascaraAntropica.focalMax({radius: 4, kernelType: 'octagon', units: 'pixels'});

  // Rule D: Intersection rule. Pixel is class 22 AND near Natural classes AND near Anthropic classes.
  var pixelBorda = is22.and(pertoNatural).and(pertoAntropica);

  // Apply the correction: change class 22 to 29 (Rocky Outcrop) if the pixel matches the border rule and isn't a specific urban/infra ID (24).
  var imgCorrigida = imgAno.where(pixelBorda.and(intAno.neq(24)), 29);

  return imgCorrigida.rename([bandName]).set('system:index', bandName);
};

// Retrieve band names from input and map the border refinement function.
var bandNames = imgCol.bandNames();
var listaImagensBorda = bandNames.map(extrairBorda);

// Reassemble the refined images into a single multi-band image for Rocky Outcrops.
var corrAflora = ee.ImageCollection.fromImages(listaImagensBorda).toBands().rename(bandNames).selfMask();
Map.addLayer(corrAflora.reproject({crs: 'EPSG:4326',scale: 30}), vis2, 'Coleção MapBiomas Corrigida (22->29)');

// Iterate through the time series to apply final remapping and Restinga refinements.
for (var i_ano=0; i_ano<anos.length; i_ano++){  
  var ano = anos[i_ano]; 
  
  // Apply specific class remapping: 
  // 19 (Temporary Crop) -> 41 (Other Temporary Crops)
  // 22 (Non-vegetated) -> 25 (Other Non-vegetated)
  var imgAno2 = corrAflora.select('classification_'+ano).remap([3,4,9,11,12,50,19,21,22,29,33,49],
                                                               [3,4,9,11,12,50,41,21,25,29,33,49]).rename('classification_'+ano);
  
  // Correction logic for Wooded Restinga (49):
  // If classified as Forest (3) AND located in the coastal lowlands mask (plan), convert to Wooded Sandbank (49).
  var restinga_abor = imgAno2.mask(imgAno2.eq(3).and(plan.eq(1))).remap([3],[49]).rename('classification_'+ano);
  
  // Correction logic for Herbaceous Restinga (50):
  // Retain Herbaceous Sandbank (50) only if it overlaps with coastal soil maps or manual restringe geometries.
  var restinga_herb = imgAno2.mask(imgAno2.eq(50).and(img_corr_rest.eq(1))).rename('classification_'+ano);

  // Secondary remapping for base blending:
  // Remap class 50 to 21 (Mosaic of Uses) to ensure only valid restinga areas survive the blend.
  imgAno2 = corrAflora.select('classification_'+ano).remap([3,4,9,11,12,50,19,21,22,29,33,49],
                                                           [3,4,9,11,12,21,41,21,25,29,33,49]).rename('classification_'+ano);

  // Consolidate corrections using spatial blending (last blend has priority).
  var class_out = imgAno2.blend(restinga_abor)   // Overlay Wooded Restinga.
                         .blend(restinga_herb);  // Overlay Herbaceous Restinga.

  // Accumulate yearly bands into the final total image.
  if (i_ano == 0){ var class_outTotal = class_out; }  
  else { class_outTotal = class_outTotal.addBands(class_out); }
}

// Display the finalized classification image on the map.
Map.addLayer(class_outTotal.reproject({crs: 'EPSG:4326',scale: 30}), vis2, 'imgCol Final');
Map.addLayer(plan, {'palette': 'yellow'}, 'plan', false);

// Ensure the image object is ready for band validation.
var image = class_outTotal;

// Full list of years for property and band management.
var years = [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994,
    1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004,
    2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014,
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Map numerical years to standard classification band names.
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Check band occurrences to handle missing data or duplicates.
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

// Log band occurrences for verification.
print(bandsOccurrence);

// Create a validated dictionary of bands, filling missing years with masked pixels if necessary.
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                image.select([key]).byte(),
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Reconstruct the image band by band using the validated dictionary.
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);

// Create an image where pixel values represent the year of the layer.
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);
        
/**
 * Spatial consistency analysis.
 * Calculate the count of connected pixels for each class per year to aid in post-processing filtering.
 */
var imageFilledConnected = image.addBands(
    image
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn');
            }
        ))
);

// Attach MapBiomas standard metadata to the final refined image.
imageFilledConnected = imageFilledConnected
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the finalized, refined classification image as an Earth Engine Asset.
Export.image.toAsset({
    "image": imageFilledConnected.toInt8(),
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