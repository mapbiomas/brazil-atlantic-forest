/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Extract training data from Google Satellite Embedding (V1) for the Atlantic Forest biome.
 * 
 * DESCRIPTION:
 * This script automates the extraction of high-dimensional feature vectors (embeddings) from the 
 * "GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL" collection to support land use and land cover classification 
 * in the Atlantic Forest (Mata Atlântica). The process iterates through a time series from 2017 to 2025. 
 * For each year, it generates a spatial mosaic of embeddings constrained to the biome's boundary. 
 * The sampling is performed using a stable set of ground truth points, and the execution is subdivided 
 * into 30 geographic regions to optimize processing efficiency and avoid computational limits. 
 * For every region, the pixel values (embeddings) are sampled at a 10-meter resolution and 
 * consolidated into a yearly dataset, which is then exported as a Google Earth Engine Asset 
 * for machine learning model training.
 */

// Define the geographic boundary of the Atlantic Forest using a detailed polygon geometry
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

// Define the output version of the processed samples as a string
var versao_out = '1';

// Define the input version of the ground truth points as a string
var versao_pt = '1';

// Define the destination path for the output table assets
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/';

// Import the specialized palettes module for standardized visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for classification layers
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load the regional division boundaries for the Atlantic Forest 2025
var regioesCollection = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025");

// Add the regional boundaries to the map to assist in spatial navigation
Map.addLayer(regioesCollection);

// Import the palettes module again to ensure availability for additional visualization objects
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters for secondary classification layers
var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

// Set the string identifying the target biome
var bioma = "MATAATLANTICA";

// Load the feature collection of stable samples based on the defined point version
var stab_pts = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/S2_2024/MATA_ATLANTICA/samples_S2_stable_v' + versao_pt + '_reg');

// Map a function to assign a unique identifier to each point feature
var pts = stab_pts.map(function(f){ return f.set('uid', f.id()); });

// Define the yearly temporal series from 2017 to 2025 for the sampling process
var anos = [
            2017, 2018, 2019,
            2020, 2021, 2022, 2023,
            2024, 2025
            ];

// Define hex colors representing the range of NDVI amplitude values
var ndvi_color = '0f330f, 005000, 4B9300, 92df42, bff0bf, FFFFFF, eee4c7, ecb168, f90000';

// Define the visualization settings for displaying vegetation index amplitude
var visParNDFI_amp = {'min':0, 'max':300, 'palette':ndvi_color};


// Start the temporal loop to process each year in the series
for (var i_ano=0; i_ano<anos.length; i_ano++){
    // Get the current year being processed
    var ano = anos[i_ano];
    
        // Load the annual image collection of Google Satellite Embeddings V1
        var mosEMB = ee.ImageCollection("GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL");
        
        // Filter the collection by the spatial boundary of the Atlantic Forest
        mosEMB = mosEMB.filterBounds(limite_MA);
        // Filter the collection by the current loop year
        mosEMB = mosEMB.filterDate(ano + '-01-01', ano + '-12-31');
        // Mosaic the resulting images into a single continuous representation
        mosEMB = mosEMB.mosaic();
        
        // Create an image containing the current year value
        var img_ano = ee.Image(ano); 
        // Add the year image as a new band to the mosaic for data traceability
        mosEMB = mosEMB.addBands(img_ano.rename('year'));
        
        

// Define the list of regional segments used to subdivide the biome
var regioes_lista = [
      ['reg_01'],['reg_02'],['reg_03'],['reg_04'],['reg_05'],['reg_06'],['reg_07'],['reg_08'],['reg_09'],['reg_10'],['reg_11'],['reg_12'],['reg_13'],['reg_14'],['reg_15'],
      ['reg_16'],['reg_17'],['reg_18'],['reg_19'],['reg_20'],['reg_21'],['reg_22'],['reg_23'],['reg_24'],['reg_25'],['reg_26'],['reg_27'],['reg_28'],['reg_29'],['reg_30']
      ];
 
// Start the spatial loop to sample data across each region segment
for (var i_regiao=0; i_regiao<regioes_lista.length; i_regiao++){
  // Extract the region ID from the nested list
  var lista = regioes_lista[i_regiao];
  var regiao = lista[0];

  // Filter the region boundary collection to isolate the current segment
  var limite = regioesCollection.filterMetadata('reg_id', "equals", regiao);

  // Filter the ground truth points that are located within the current region
  var pts_reg = pts.filterMetadata('reg_id', 'equals', regiao);
  
  // Sample the pixel values from the embedding mosaic at each point location
  var training = mosEMB.sampleRegions({
      'collection': pts_reg,
      'scale': 10,
      'tileScale': 4,
      'geometries': true
  });
  


  // Check if this is the first region to initialize the consolidated yearly collection
  if (i_regiao === 0){ 
      // Initialize the training variable with the results of the first region
      var training_reg = training; 
  }  
  // Merge the samples from subsequent regions into the master collection
  else {
      // Append regional sampled features to the accumulated collection
      training_reg = training_reg.merge(training); 
  }
}    


// Export the consolidated regional samples for the year to a permanent Earth Engine Asset
Export.table.toAsset(training_reg, 'pontos_train_emb_v' + versao_out + '_' + ano, dirout + 'pontos_train_emb_v' + versao_out + '_' + ano);


}

// Print the final count of features in the processed collection to the console
print(training_reg.size());