/**
 * This script generates annual land use classifications for Fernando de Noronha using Sentinel-2 imagery and Random Forest.
 * It creates cloud-masked median composites, extracts training points from specific classes, and runs the classification algorithm.
 * Finally, it compiles single-year bands into a multi-band image, calculates connected pixels, and exports the asset.
 */

// Define variables
var coleta = false;   // true or false

// Define the years to process (2022-2024)
var anos = [
  2022, 2023, 2024, 2025
]
 
// If collecting data, process only 2022
if (coleta) {var anos = [2022]}

// Define the number of trees for the Random Forest classifier (100)
var RFtrees = 100;

// If collecting data, use 100 trees
if (coleta) {var RFtrees = 100}

// Set the output version number
var versao_out = 1;

// Define the output directory
var dirout = 'projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/regioes/';

// Load the collections
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED');
var csPlus = ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED');

// Variables that need to be defined in the Earth Engine environment (assuming they already exist)
// var limite; 
// var forest;
// var urban;
// var agua;
// var beach;
// var grassland;
// var aflora;
// var agricultura;

// Define the region of interest
var ROI = limite;

// Define the QA band for cloud masking
var QA_BAND = 'cs_cdf';

// Define the threshold for cloud masking
var CLEAR_THRESHOLD = 0.60;

// Define the sensor or bands source text description
var usedBands = 'S2_SR_HARMONIZED' 

// Initialize a list to store the classified images for each year
var classifiedImages = ee.List([]);
 
// Loop through each year
for (var i_ano=0;i_ano<anos.length; i_ano++){
  // Get the current year from the list
  var ano = anos[i_ano];
  
  // 1. Create a Clean Median Composite
  var composite = s2
    // Filter the collection by bounds and date
    .filterBounds(ROI)
    .filterDate(ano+'-01-01', ano+'-12-31')
    // Link the Sentinel-2 collection with the Cloud Score+ collection
    .linkCollection(csPlus, [QA_BAND])
    // Map the collection and mask cloudy pixels
    .map(function(img) {
      return img.updateMask(img.select(QA_BAND).gte(CLEAR_THRESHOLD));
    });

  // Print the size of the composite
  print('composite '+ano, composite.size());

  // Calculate the median composite and clip it to the region of interest
  var mosaicoTotal = composite.median().clip(limite);

  // Print the median composite
  print('mosaicoTotal '+ano,mosaicoTotal);

  // Define visualization parameters for Sentinel-2
  var s2Viz = {bands: ['B4', 'B3', 'B2'], min: 0, max: 2500};
  
  // Import the palettes module (assuming the module exists)
  var palettes = require('users/mapbiomas/modules:Palettes.js');

  // Define the visualization parameters for the classification
  var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
  };

  // Add the median composite to the map
  Map.addLayer(mosaicoTotal, s2Viz, 'median composite '+ano, false);

  // Define the band names for the Sentinel-2 image
  var bandNames = ee.List(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']);

  // 2. Prepare and Train the Random Forest
  // Merge the training samples
  var amostraTotal = forest.merge(urban).merge(agua).merge(beach).merge(grassland).merge(aflora).merge(agricultura);

  // Reduce the training samples to an image
  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});

  // Select the reference band
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  // Sample the training data for each class
  var train_flo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 35, 'region': forest, 'scale': 10, 'seed': 1});
  var train_urb = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 10, 'region': urban, 'scale': 10, 'seed': 1});
  var train_agu = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 55, 'region': agua, 'scale': 10, 'seed': 1});
  var train_bea = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 30, 'region': beach, 'scale': 10, 'seed': 1});
  var train_gra = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 30, 'region': grassland, 'scale': 10, 'seed': 1});
  var train_afl = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 10, 'region': aflora, 'scale': 10, 'seed': 1});
  var train_agr = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 10, 'region': agricultura, 'scale': 10, 'seed': 1});

  // Merge the training samples for all classes
  var training = train_flo.merge(train_urb).merge(train_agu).merge(train_bea)
                          .merge(train_gra).merge(train_afl).merge(train_agr);

  // Train the Random Forest classifier
  var classifierRF = ee.Classifier.smileRandomForest({numberOfTrees: RFtrees, variablesPerSplit:1}).train(training, 'reference', bandNames);

  // 3. Classify and Store
  // Classify the image using the classifier
  var classifiedRF_year = mosaicoTotal.classify(classifierRF)
    .mask(mosaicoTotal.select('B2')); // Apply the mask

  // Select and rename the classification band for the year
  classifiedRF_year = classifiedRF_year.select([0],['classification_'+ano])
    .clip(limite).toInt8();

  // Add the classified image for the year to the list
  classifiedImages = classifiedImages.add(classifiedRF_year);

  // Add the classified image to the map
  Map.addLayer(classifiedRF_year, vis, 'RF '+ano, false);

} // End of Loop


// Check if collection mode is active
if (coleta) {}
// Otherwise, prepare for export
else {
  // 1. Convert the list of single-band images into a multi-band image
  // This solves the error "The number of names (3) must match the number of bands (1)"
  var imageAllBands = ee.Image(classifiedImages.iterate(function(image, previous) {
    // The first iteration uses ee.Image().select() as a base and adds the first band
    // Subsequent iterations add the following bands
    return ee.Image(previous).addBands(image);
  }, ee.Image().select()));
   
  // Get the classification band names
  var bandNamesClassification = imageAllBands.bandNames();

  // 2. Add the connected pixel count bands
  var connectedBands = imageAllBands
    .connectedPixelCount(100, true)
    .rename(bandNamesClassification.map(
      function (band) {
        return ee.String(band).cat('_conn')
      }
    ));

  // Merge the classification bands and the connected count bands
  var imageConnected = imageAllBands.addBands(connectedBands);

  // Print the final multi-band image
  print('imageConnected (Final)', imageConnected);

  // 3. Set the metadata and export
  imageConnected = imageConnected
    .set('territory', 'BRAZIL')
    .set('biome', 'MATA ATÂNTICA')
    .set('source', 'arcplan')
    .set('version', '1')
    .set('collection_id',versao_out)
    .set('bands',usedBands)
    .set('classifier','RF')

  // Export the classified image to an asset
  Export.image.toAsset({
    "image": imageConnected.toInt8(),
    "description": 'FNoronha'+'_v'+versao_out,
    "assetId": dirout + 'FNoronha'+'_v'+versao_out,
    "scale": 10,
    "pyramidingPolicy": {
      '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": limite
  });    
}
