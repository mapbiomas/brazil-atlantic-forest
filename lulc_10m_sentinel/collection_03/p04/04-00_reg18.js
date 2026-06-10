// Summary: This script performs Random Forest classification for a specific Atlantic Forest region
// across multiple years (2017-2024). It configures the classification parameters, loads the required
// mosaics and training samples, handles class balancing with supplementary data, and applies
// a 100-tree model. The final outputs are exported as a multi-band image asset containing
// the annual land cover classifications.

// Define the region ID (reg_18) 
var regiaoID = 'reg_18'; // old 11

// Define whether to collect data (false)
var coleta = false;   // true or false

// Define the years to process (2016-2023)
var anos = [
  2017,2018,2019,2020,2021,2022,2023,2024
]
 
// If collecting data, only process 2023
if (coleta) {var anos = [2023]}

// Define the number of trees for the Random Forest classifier (100)
var RFtrees = 100;

// If collecting data, use 200 trees
if (coleta) {var RFtrees = 100}

// Define the output version (1) 
var versao_out = 1;


// Load the 250,000 biomes feature collection
var bioma250mil = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/biomas_IBGE_250mil');

// Filter the collection to only include the Atlantic Forest biome
var bioma250mil_MA_vetor = bioma250mil.filterMetadata('Bioma','equals', 'Mata Atlântica');

// Load the biomes raster
var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');

// Mask the biomes raster to only include the Atlantic Forest biome
var bioma250mil_MA = biomes.mask(biomes.eq(2));

// Add the Atlantic Forest biome layer to the map
Map.addLayer(bioma250mil_MA,{},'layer bioma',false)

// Import the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define the visualization parameters for the classification
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load the Atlantic Forest regions feature collection
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Define the visualization parameters for the median composite
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'],gain: [0.08, 0.06, 0.2],gamma: 0.85}

// Define the biome name (MATAATLANTICA)
var bioma = "MATAATLANTICA";

// Define the output directory
var dirout = 'projects/mapbiomas-workspace/COLECAO3_S2/MATA_ATLANTICA/regioes/';

// Filter the regions collection to only include the specified region ID
var limite = regioesCollection.filterMetadata('reg_id', "equals", regiaoID);
//var limite = reg_04_rev

// Load the stable map from collection 6
var mapa_estavel_col9 = ee.Image('projects/mapbiomas-workspace/AMOSTRAS/col10/MATA_ATLANTICA/MA_amostras_estaveis85a23_col9_v2')

// Add the stable map layer to the map
Map.addLayer(mapa_estavel_col9.clip(limite), vis, 'mapa_estavel_col9', false);

// Create a blank image
var blank = ee.Image(0).mask(0);
// Paint the outline of the region on the blank image
var outline = blank.paint(limite, 'AA0000', 2); 
// Define the visualization parameters for the outline
var visPar = {'palette':'000000','opacity': 0.6};
// Add the outline layer to the map
Map.addLayer(outline, visPar, regiaoID, false);

// Define a function to shuffle a feature collection
var shuffle = function (collection, seed) {
    // Add a random column to the collection
    collection = collection.randomColumn('random', seed || 1)
        // Sort the collection by the random column
        .sort('random', true)
        // Map over the collection and set a new ID based on the random column
        .map(function (feature) {
                var rescaled = ee.Number(feature.get('random')).multiply(1000000000).round();
                return feature.set('new_id', rescaled)});
    // Get a list of the new IDs
    var randomIdList = ee.List(collection.reduceColumns(ee.Reducer.toList(), ['new_id']).get('list'));
    // Create a sequential list of IDs
    var sequentialIdList = ee.List.sequence(1, collection.size());
    // Remap the collection using the random and sequential ID lists
    var shuffled = collection.remap(randomIdList, sequentialIdList, 'new_id');
    // Return the shuffled collection
    return shuffled;
};

// Import the external module to create the total mosaic
var mos = require('users/yasmingelli-arcplan/MapBiomas_SENTINELcol3_MA:passo01/01-01_Cria_MosaicoTotal')

// Loop through each year.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  // Assign the current year to a variable
  var ano = anos[i_ano];
  
// Generate the total mosaic for the current year and region
var mosaicoTotal = mos.getMosaic(ano,limite);

  // ALL EMBEDDING BANDS + 20 MOST IMPORTANTS FROM SENTINEL2
  var bandNames = ee.List([
                  'A00','A01','A02','A03','A04','A05','A06','A07','A08','A09','A10','A11','A12','A13','A14','A15','A16','A17','A18','A19','A20',
                  'A21','A22','A23','A24','A25','A26','A27','A28','A29','A30','A31','A32','A33','A34','A35','A36','A37','A38','A39','A40','A41',
                  'A42','A43','A44','A45','A46','A47','A48','A49','A50','A51','A52','A53','A54','A55','A56','A57','A58','A59','A60','A61','A62','A63',
                  
                  'longitude','latitude',
                  
                  'cvi_median','swir1_median','osavi_median_wet','red_edge_4_median_wet','blue_median','red_edge_2_median','iia_median_dry','ndvi_median_wet','gcvi_median_dry','green_median_wet','swir2_stdDev','blue_median_wet','spri_median','green_median_texture','mbi_median_dry','cvi_median_wet','osavi_median_dry','nir_median_wet','gemi_median',

  ])
  // Set an identifier for the combination of bands used
  var usedBands = 'emb20s2'
  

  //var BDamostras = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/col9/MATA_ATLANTICA/teste/REGIONs_'+regiaoID+'_'+ano)
  
// Add the current year's clipped mosaic layer to the map for visual check
Map.addLayer(mosaicoTotal.clip(limite.geometry()), visParMedian2, 'Img_Year_'+ano, false);

  
  // Load the training points for the current year and region
  var BDamostras = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/pontos_train_s2_emb_v6_'+ano)
                    .filterMetadata('reg_id', 'equals', regiaoID)
                    
    // Filter the points to only include forest
    var BDflo = BDamostras.filterMetadata("reference", "equals", 3)
    // Filter the points to only include savanna
    var BDsav = BDamostras.filterMetadata("reference", "equals", 4)//.limit(100)
    // Filter the points to only include reforestation
    var BDreflo = BDamostras.filterMetadata("reference", "equals", 9)
    // Filter the points to only include floodplain forest
    var BDvarzea = BDamostras.filterMetadata("reference", "equals", 11)
    // Filter the points to only include grassland
    var BDcampo = BDamostras.filterMetadata("reference", "equals", 12)
    // Filter the points to only include agriculture
    var BDagro = BDamostras.filterMetadata("reference", "equals", 21)
    // BDagro = shuffle(BDagro, 2).limit(2500)
    // Filter the points to only include non-vegetation
    var BDNaoVeg = BDamostras.filterMetadata("reference", "equals", 22)
    // Filter the points to only include afforestation
    var BDAflora = BDamostras.filterMetadata("reference", "equals", 29)
    // Filter the points to only include water
    var BDagua = BDamostras.filterMetadata("reference", "equals", 33)
    // Filter the points to only include herabceous sandbank
    var BDherb = BDamostras.filterMetadata("reference", "equals", 50)
    
  // Complementary samples
  // Merge the training points for different classes
  var amostraTotal = varzea.merge(flo).merge(agro).merge(reflo).merge(agua)
  
  // Reduce the training points to an image
  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()})

  // Rename the band
  amostraTotalimg = amostraTotalimg.select([0],['reference'])

  // Sample the mosaic using the training points for the forest class
  var training_flo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 400, 'region': flo.filterBounds(limite), 'scale': 10, 'seed': 1});
  // var training_nflo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 300, 'region': nao_flo.filterBounds(limite), 'scale': 10, 'seed': 1});
  // var training_sav = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 1500, 'region': sav.filterBounds(limite), 'scale': 10, 'seed': 1});
  // var training_afl = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 1000, 'region': aflora.filterBounds(limite), 'scale': 10, 'seed': 1});

  // Sample the mosaic using the training points for the varzea class
  var training_var = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 1200, 'region': varzea.filterBounds(limite), 'scale': 10, 'seed': 1});
  // var training_agu = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 100, 'region': agua.filterBounds(limite), 'scale': 10, 'seed': 1});
  // var training_cam = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 800, 'region': campo.filterBounds(limite), 'scale': 10, 'seed': 1});
  // var training_nflo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 200, 'region': n_flo.filterBounds(limite), 'scale': 10, 'seed': 1});

  // Sample the mosaic using the training points for the agriculture class
  var training_agr = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 1200, 'region': agro.filterBounds(limite), 'scale': 10, 'seed': 1});
  // Sample the mosaic for the reforestation class
  var training_reflo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 400, 'region': reflo.filterBounds(limite), 'scale': 10, 'seed': 1});

  // Sample the mosaic for the water class
  var training_agua = mosaicoTotal.select(bandNames).addBands(amostraTotalimg).sample({'numPixels': 200, 'region': agua.filterBounds(limite), 'scale': 10, 'seed': 1});

// If collecting data, print the size of each training set
if (coleta) {
// print('BDflo',BDflo.size())
// print('BDsav',BDsav.size())
// print('BDvar',BDvarzea.size())
// print('BDcam',BDcampo.size())
// print('BDOut',BDOutroNFlo.size())
// print('BDAfl',BDAflora.size())
// print('BDagr',BDagro.size())
// print('BDNao',BDNaoVeg.size())
// print('BDagu',BDagua.size())
print('training_flo',training_flo.size())
//print('training_cam',training_cam.size())
//print('training_var',training_var.size())
//print('training_afl',training_afl.size())
//print('training_cam',training_cam.size())
print('training_agr',training_agr.size())
}

  // Merge the training points for all classes
  var training = BDflo.merge(BDreflo).merge(BDcampo)//.merge(BDsav).merge(BDOutroNFlo).merge(BDAflora)
                      .merge(BDagro).merge(BDNaoVeg).merge(BDagua)
                      //complementares
                      // .merge(training_afl)
                      .merge(training_var).merge(training_agr).merge(training_flo)
                      .merge(training_reflo)
                      .merge(training_agua)//.merge(training_agr)

  // Train a Random Forest classifier
  var classifierRF = ee.Classifier.smileRandomForest({numberOfTrees: RFtrees, variablesPerSplit:1}).train(training, 'reference', bandNames);

  // If collecting data, print the classifier explanation
  // if (coleta) {print(classifierRF.explain())}

  // Classify the mosaic using the Random Forest classifier
  var classifiedRF = mosaicoTotal.classify(classifierRF)//.mask(mosaicoTotal.select('blue_median'));

  // Rename the classification band and clip the image to the region
  classifiedRF = classifiedRF.select(['classification'],['classification_'+ano]).clip(limite.geometry()).toInt8()

  // If collecting data, add the classified images to the map
  if (coleta) {  
    Map.addLayer(classifiedRF, vis, 'RF'+ano+"_"+regiaoID+'_'+usedBands, true);
  }
  
  // Loads the FeatureCollection of a generic half-degree Grid.
  if (coleta) {
  // Load grid feature collection
  var gridbr = ee.FeatureCollection ('projects/ee-mapbiomas-arcplan-fp/assets/grid_meio_grau');
  // Create mask image
  var blank = ee.Image(0).mask(0);
  // Paint the grid outline to visually verify data boundaries
  var outline_gridbr = blank.paint(gridbr, '000000', 1.5); 
  // Set visual parameters for the black boundary lines
  var visPar_gridbr = {'palette':'000000','opacity': 0.6};
  // Display the grid layout mapped onto the specific region
  Map.addLayer(outline_gridbr.clip(limite.geometry()), visPar_gridbr, 'Grid', false);
  }

  // If this is the first year, initialize the classified image for the entire period
  if (i_ano == 0){ var classified_RF = classifiedRF;}  
  // Otherwise, add the current year's classification to the image
  else {classified_RF = classified_RF.addBands(classifiedRF);}
}

// If collecting data, do nothing
if (coleta) {}
// Otherwise, export the classified image to an asset
   else 
   {
     // Set the metadata for the classified image
     classified_RF = classified_RF
     .set('territory', 'BRAZIL')
     .set('biome', 'MATA ATÂNTICA')
     .set('source', 'arcplan')
     .set('version', '1')
     .set('collection_id',versao_out)
     .set('bands',usedBands)
     .set('classifier','RF')

    // Export the classified image to an asset
    Export.image.toAsset({
       "image": classified_RF.toInt8(),
       "description": regiaoID+'_v'+versao_out,
       "assetId": dirout + regiaoID+'_v'+versao_out,
       "scale": 10,
       "pyramidingPolicy": {
           '.default': 'mode'
       },
       "maxPixels": 1e13,
       "region": limite
     });    
}