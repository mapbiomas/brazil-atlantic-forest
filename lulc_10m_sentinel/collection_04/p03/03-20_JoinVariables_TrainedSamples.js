/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Extract spectral bands and vegetation indices for training points based on Sentinel-2 mosaics.
 * 
 * DESCRIPTION:
 * This script processes Sentinel-2 mosaics for the Atlantic Forest biome to generate a comprehensive training dataset 
 * for Collection 4. It integrates previously extracted embedding-based points with a wide range of spectral bands 
 * and calculated indices for the period of 2017 to 2025. For each year, the script filters two separate Sentinel-2 
 * mosaic collections, merges them, and selects specific median and seasonal bands. It then applies a specialized 
 * module to calculate vegetation indices. The sampling process is divided into 30 geographic regions to optimize 
 * performance, where pixel values are extracted at point locations and consolidated into a single table for export 
 * as a Google Earth Engine Asset.
 */

// Define the geographic boundary for the Atlantic Forest using a polygon with coordinates
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

// Set the output version identifier as a string
var versao_out = '1';

// Set the input points version identifier as a string
var versao_pt = '1';

// Define the base directory path for exporting the generated table assets
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/COLECAO_04/'

// Import the MapBiomas shared palettes module for map visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization settings for land cover classification maps
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load the auxiliary feature collection containing the geographic regions for the Atlantic Forest
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Add the loaded regions to the current map view for visual reference
Map.addLayer(regioesCollection);

// Re-import palettes module to ensure availability for different visualization objects
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define alternative visualization settings for classification results
var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

// Load the primary and secondary Sentinel-2 mosaic collections and merge them into a single collection
var asset1 = ee.ImageCollection('projects/mapbiomas-mosaics/assets/SENTINEL/BRAZIL/mosaics-3');
var asset2 = ee.ImageCollection('projects/nexgenmap/MapBiomas2/SENTINEL/mosaics-3')
var colMos = asset1.merge(asset2)

// Define a color palette for visualizing the amplitude of the NDVI signal
var ndvi_color = '0f330f, 005000, 4B9300, 92df42, bff0bf, FFFFFF, eee4c7, ecb168, f90000'; 

// Set the visualization parameters for indices related to vegetation amplitude
var visParNDFI_amp = {'min':0, 'max':300, 'palette':ndvi_color};

// Set the biome name variable for the current workflow
var bioma = "MATAATLANTICA";

// Define the time series array covering the processing period from 2017 to 2025
var anos = [
2017,2018,2019,2020,2021,2022,2023,2024,2025
]            

// Import the external module responsible for processing Sentinel-2 bands and calculating indices
var addIndexCaatinga = require('users/marcosrosaUSP/MapBiomas_col9_MataAtlan:Mata_Atlantica_SENTINEL2/processa_Bandas_Sentinel2_CAATINGA');

// Iterate through each year defined in the time series array
for (var i_ano=0;i_ano<anos.length; i_ano++){
    // Get the year value for the current loop iteration
    var ano = anos[i_ano];  

// Load the embedding-based training points for the specific year being processed
var pts_emb = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/COLECAO_04/pontos_train_emb_v'+ versao_pt +'_'+ ano);

// Define a list of spectral bands and seasonal medians to be extracted from the mosaics
var bands = 
ee.List([
  'blue_median','blue_median_wet','blue_median_dry','blue_stdDev','green_median','green_median_dry','green_median_wet','green_median_texture',
  'green_min','green_stdDev','red_median','red_median_dry','red_min','red_median_wet','red_stdDev','nir_median','nir_median_dry','nir_median_wet',
  'nir_stdDev','red_edge_1_median','red_edge_1_median_dry','red_edge_1_median_wet','red_edge_1_stdDev','red_edge_2_median','red_edge_2_median_dry',
  'red_edge_2_median_wet','red_edge_2_stdDev','red_edge_3_median','red_edge_3_median_dry','red_edge_3_median_wet','red_edge_3_stdDev','red_edge_4_median',
  'red_edge_4_median_dry','red_edge_4_median_wet','red_edge_4_stdDev','swir1_median','swir1_median_dry','swir1_median_wet','swir1_stdDev','swir2_median',
  'swir2_median_wet','swir2_median_dry','swir2_stdDev'
  ])
  
        // Filter the merged mosaic collection by the Atlantic Forest boundary
        var mosaicoTotal = colMos
        mosaicoTotal = mosaicoTotal.filterBounds(limite_MA)
        // Filter the collection to select images matching the current processing year
        mosaicoTotal = mosaicoTotal.filter(ee.Filter.eq('year', ano))

        // Create a spatial mosaic of the filtered collection and select the required bands
        mosaicoTotal = mosaicoTotal.mosaic().select(bands)
        // Apply the external indexing module to calculate spectral indices on the mosaic
        mosaicoTotal = addIndexCaatinga.get(mosaicoTotal);
      
        // Create an image with the year value and add it as a new band to the mosaic
        var img_ano = ee.Image(ano); 
        mosaicoTotal = mosaicoTotal.addBands(img_ano.rename('year'));
        // Log the final processed mosaic for the year to the console
        print(mosaicoTotal, 'mosaicoTotal')

// Define the list of sub-regions to process the sampling tasks in segments
var regioes_lista = [
      ['reg_01'],['reg_02'],['reg_03'],['reg_04'],['reg_05'],['reg_06'],['reg_07'],['reg_08'],['reg_09'],['reg_10'],['reg_11'],['reg_12'],['reg_13'],['reg_14'],['reg_15'],
      ['reg_16'],['reg_17'],['reg_18'],['reg_19'],['reg_20'],['reg_21'],['reg_22'],['reg_23'],['reg_24'],['reg_25'],['reg_26'],['reg_27'],['reg_28'],['reg_29'],['reg_30']
      ];
 
// Iterate through each region in the list to extract regional training data
for (var i_regiao=0;i_regiao<regioes_lista.length; i_regiao++){
  // Extract the current region's metadata from the list
  var lista = regioes_lista[i_regiao];
  var regiao = lista[0];

  // Filter the full regional feature collection for the specific region geometry
  var limite = regioesCollection.filterMetadata('reg_id', "equals", regiao);

  // Filter the year's embedding points to keep only those within the current region
  var pts_reg = pts_emb.filterMetadata('reg_id', 'equals', regiao)
  
  // Sample the processed spectral and index bands at the locations of the filtered points
  var training = mosaicoTotal.sampleRegions({
      'collection': pts_reg,
      'scale': 10,
      'tileScale': 4,
      'geometries': true
  });
  
  // Initialize the training collection with the first region's data or merge with existing samples
  if (i_regiao == 0){ var training_reg = training }  
  // Merge the samples from the current region into the master collection for the year
  else {training_reg = training_reg.merge(training); }
}    

// Export the complete consolidated training table for the current year to an Earth Engine Asset
Export.table.toAsset(training_reg, 'pontos_train_ALL_v'+versao_out+'_'+ano, dirout + 'pontos_train_ALL_v'+versao_out+'_'+ano);

}
// Print the total number of features in the final training collection to the console
print(training_reg.size())