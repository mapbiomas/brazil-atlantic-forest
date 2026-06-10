// Summary: This script extracts Sentinel-2 multi-spectral band data and derived indices from Google Earth Engine (GEE) using stable 
// sample points across the Atlantic Forest biome. It merges two mosaic image collections, filters them by year and boundary, 
// calculates custom spectral indices, and iteratively samples these properties over specified years and regions. 
// Finally, it exports the generated training samples as GEE asset tables.

// Define the Atlantic Forest boundary
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

// Define the output version
var versao_out = '5';

// Define the version of the points
var versao_pt = '1';

// Define the output directory
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/'

// Import the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define the visualization parameters
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load the regions collection
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025")

// Add the regions collection to the map
Map.addLayer(regioesCollection);

// Import the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define the visualization parameters
var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

// Load the first Sentinel-2 mosaic image collection
var asset1 = ee.ImageCollection('projects/mapbiomas-mosaics/assets/SENTINEL/BRAZIL/mosaics-3');
// Load the second Sentinel-2 mosaic image collection
var asset2 = ee.ImageCollection('projects/nexgenmap/MapBiomas2/SENTINEL/mosaics-3')
// Merge the two mosaic collections into a single collection
var colMos = asset1.merge(asset2)


// Define the color palette for NDVI amplitude
var ndvi_color = '0f330f, 005000, 4B9300, 92df42, bff0bf, FFFFFF, eee4c7, ecb168, f90000';

// Define the visualization parameters for NDVI amplitude
var visParNDFI_amp = {'min':0, 'max':300, 'palette':ndvi_color};

//Map.addLayer(bioma250mil_MA,{},"biome MA",false)

// Define the asset path for the mosaics
//var asset_mosaicosS2 = 'projects/mapbiomas-mosaics/assets/SENTINEL/BRAZIL/mosaics-3';

// Define the biome
var bioma = "MATAATLANTICA";

// Load the stable samples
var stab_pts = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/S2_2024/MATA_ATLANTICA/samples_S2_stable_v' + versao_pt + '_reg');
// Pontos com ID estável
var pts = stab_pts.map(function(f){ return f.set('uid', f.id()); });
// Load the S2 clusters image
//var S2_cluster = ee.Image('projects/mapbiomas-workspace/AMOSTRAS/S2_2024/MATA_ATLANTICA/mosaicos_MA_S2_clusters_2106_2023')

// Define the list of years to process
var anos = [2016,2017,2018,2019,2020,2021,2022,2023,
// 2024,
2025]            


// Import the function to add indices for the Caatinga biome
var addIndexCaatinga = require('users/marcosrosaUSP/MapBiomas_col9_MataAtlan:Mata_Atlantica_SENTINEL2/processa_Bandas_Sentinel2_CAATINGA');

// Create bands for the mosaics from 2024 and 2025
for (var i_ano=0;i_ano<anos.length; i_ano++){
    // Get the current year.
    var ano = anos[i_ano];  
    
// Define the specific spectral bands to select from the mosaic
var bands = 
ee.List([
  'blue_median','blue_median_wet','blue_median_dry','blue_stdDev','green_median','green_median_dry','green_median_wet','green_median_texture',
  'green_min','green_stdDev','red_median','red_median_dry','red_min','red_median_wet','red_stdDev','nir_median','nir_median_dry','nir_median_wet',
  'nir_stdDev','red_edge_1_median','red_edge_1_median_dry','red_edge_1_median_wet','red_edge_1_stdDev','red_edge_2_median','red_edge_2_median_dry',
  'red_edge_2_median_wet','red_edge_2_stdDev','red_edge_3_median','red_edge_3_median_dry','red_edge_3_median_wet','red_edge_3_stdDev','red_edge_4_median',
  'red_edge_4_median_dry','red_edge_4_median_wet','red_edge_4_stdDev','swir1_median','swir1_median_dry','swir1_median_wet','swir1_stdDev','swir2_median',
  'swir2_median_wet','swir2_median_dry','swir2_stdDev'
  ])
  
        // Assign the merged mosaic collection to a local variable
        var mosaicoTotal = colMos
        // Filter the total mosaic by the Atlantic Forest boundary
        mosaicoTotal = mosaicoTotal.filterBounds(limite_MA)
        // Filter the total mosaic to match the current year
        mosaicoTotal = mosaicoTotal.filter(ee.Filter.eq('year', ano))

        // Mosaic the filtered collection and select only the specified bands
        mosaicoTotal = mosaicoTotal.mosaic().select(bands)
        // Apply the custom function to add computed spectral indices
        mosaicoTotal = addIndexCaatinga.get(mosaicoTotal);
      
        // Create a constant image representing the current year
        var img_ano = ee.Image(ano); // Add year band.
        // Append the year band to the total mosaic image
        mosaicoTotal = mosaicoTotal.addBands(img_ano.rename('year'));
        // Print the final mosaic for the current year to the console
        print(mosaicoTotal, 'mosaicoTotal')



// Define the list of regions
var regioes_lista = [
      ['reg_01'],['reg_02'],['reg_03'],['reg_04'],['reg_05'],['reg_06'],['reg_07'],['reg_08'],['reg_09'],['reg_10'],['reg_11'],['reg_12'],['reg_13'],['reg_14'],['reg_15'],
      ['reg_16'],['reg_17'],['reg_18'],['reg_19'],['reg_20'],['reg_21'],['reg_22'],['reg_23'],['reg_24'],['reg_25'],['reg_26'],['reg_27'],['reg_28'],['reg_29'],['reg_30']
      ];
 
// Loop over the list of regions
for (var i_regiao=0;i_regiao<regioes_lista.length; i_regiao++){
  // Get the current region information
  var lista = regioes_lista[i_regiao];
  var regiao = lista[0];

  // Filter the regions collection to get the current region
  var limite = regioesCollection.filterMetadata('reg_id', "equals", regiao);

  // Filter the stable samples for the current region
  var pts_reg = pts.filterMetadata('reg_id', 'equals', regiao)
  
  // Sample the mosaic image using the stable samples for the current region
  var training = mosaicoTotal.sampleRegions({
      'collection': pts_reg,
      'scale': 10,
      'tileScale': 4,
      'geometries': true
  });
  


  // If this is the first region, initialize the training sample collection
  if (i_regiao == 0){ var training_reg = training }  
  // Otherwise, merge the current region's sample into the existing collection
  else {training_reg = training_reg.merge(training); }
}    

// Export the training sample collection to an asset
Export.table.toAsset(training_reg, 'pontos_train_s2_v'+versao_out+'_'+ano, dirout + 'pontos_train_s2_v'+versao_out+'_'+ano);

}
// Print the total size of the final training dataset to the console
print(training_reg.size())