/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Evaluate the importance of spectral features for regional classification using Random Forest.
 * 
 * DESCRIPTION:
 * This script calculates and displays the feature importance results from a Random Forest classifier for each of the 30 
 * geographic regions of the Atlantic Forest. It utilizes stable training samples (incorporating Sentinel-2 embeddings, 
 * spectral bands, and indices) to determine which variables are most effective for land cover discrimination. 
 * The script iterates through the regions, trains a classifier with 200 trees, and uses the 'explain' method 
 * to output the contribution of each variable to the console. These results are used to refine the feature 
 * selection for subsequent classification steps, typically selecting the top 60 most important bands per region.
 */

// Define the geographic boundary for the Atlantic Forest biome using a polygon geometry
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

// Import the Sentinel-2 mosaic collection from the NexGenMap project
var mos = ee.ImageCollection('projects/nexgenmap/MapBiomas2/SENTINEL/mosaics-3');

// Set the number of trees to be used in the Random Forest classification process
var RFtrees = 200;

// Load the auxiliary feature collection containing the geographic regions for the Atlantic Forest 2025
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Add the regions collection to the map interface for visual reference
Map.addLayer(regioesCollection, {}, 'regioesCollection', false);

// Define the base path for the training data assets
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/COLECAO_04/';

// Define the seed value for randomization purposes
var seed = '1';

// Set the reference year for the feature importance analysis
var ano = 2024;

// Define the training data version identifier as a string in single quotes
var versao_pt = '1';

// Define the list of years included in the temporal series from 2017 to 2025
var anos = [
            2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
            ];

// Define the full list of spectral bands and calculated indices to be evaluated for feature importance
var bandNames = ee.List([
'afvi_median','afvi_median_dry','afvi_median_wet','avi_median','avi_median_dry','avi_median_wet','awei_median','awei_median_dry','awei_median_wet','blue_median','blue_median_dry','blue_median_wet','blue_stdDev','brba_median','brba_median_dry','brba_median_wet','brightness_median','brightness_median_dry','brightness_median_wet','bsi_median','bsi_median_1','bsi_median_2','co2flux_median','cvi_median','cvi_median_dry','cvi_median_wet','dswi5_median','dswi5_median_dry','dswi5_median_wet','evi_median','evi_median_dry','evi_median_wet','gcvi_median','gcvi_median_dry','gcvi_median_wet','gemi_median','gemi_median_dry','gemi_median_wet','gli_median','gli_median_dry','gli_median_wet','green_median','green_median_dry','green_median_texture','green_median_wet','green_stdDev','gvmi_median','gvmi_median_1','gvmi_median_dry','gvmi_median_dry_1','gvmi_median_wet','gvmi_median_wet_1','iia_median','iia_median_dry','iia_median_wet','lai_median','lswi_median','lswi_median_dry','lswi_median_wet','mbi_median','mbi_median_dry','mbi_median_wet','msi_median','msi_median_dry','msi_median_wet','nddi_median','nddi_median_dry','nddi_median_wet','ndvi_median','ndvi_median_dry','ndvi_median_wet','ndwi_median','ndwi_median_dry','ndwi_median_wet','nir_median','nir_median_contrast','nir_median_dry','nir_median_dry_contrast','nir_median_wet','nir_stdDev','osavi_median','osavi_median_dry','osavi_median_wet','ratio_median','ratio_median_dry','ratio_median_wet','red_edge_1_median','red_edge_1_median_dry','red_edge_1_median_wet','red_edge_1_stdDev','red_edge_2_median','red_edge_2_median_dry','red_edge_2_median_wet','red_edge_2_stdDev','red_edge_3_median','red_edge_3_median_dry','red_edge_3_median_wet','red_edge_3_stdDev','red_edge_4_median','red_edge_4_median_dry','red_edge_4_median_wet','red_edge_4_stdDev','red_median','red_median_contrast','red_median_dry','red_median_dry_contrast','red_median_wet','red_stdDev','reference','ri_median','ri_median_dry','ri_median_wet','rvi_median','rvi_median_1','rvi_median_wet','shape_median','shape_median_dry','shape_median_wet','spri_median','spri_median_1','spri_median_wet','swir1_median','swir1_median_dry','swir1_median_wet','swir1_stdDev','swir2_median','swir2_median_dry','swir2_median_wet','swir2_stdDev','ui_median','ui_median_dry','ui_median_wet','wetness_median','wetness_median_dry','wetness_median_wet'
]);

// Define the list of region identifiers for the spatial loop
var regioes_lista = [
    ['reg_01'],['reg_02'],['reg_03'],['reg_04'],['reg_05'],['reg_06'],['reg_07'],['reg_08'],['reg_09'],['reg_10'],
    ['reg_11'],['reg_12'],['reg_13'],['reg_14'],['reg_15'],['reg_16'],['reg_17'],['reg_18'],['reg_19'],['reg_20'],
    ['reg_21'],['reg_22'],['reg_23'],['reg_24'],['reg_25'],['reg_26'],['reg_27'],['reg_28'],['reg_29'],['reg_30']
    ];

// Iterate through each region in the list to calculate feature importance
for (var i_regiao=0; i_regiao<regioes_lista.length; i_regiao++){
  
  // Extract the region ID from the current list entry
  var lista = regioes_lista[i_regiao];
  var regiao = lista[0];
  
  // Filter the regional feature collection to isolate the current region's geometry
  var limite = regioesCollection.filter(ee.Filter.eq('reg_id', regiao));

  // Load the comprehensive training dataset for the current year and filter it by region
  var BDamostras = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/COLECAO_04/pontos_train_ALL_v'+versao_pt+'_'+ano)
                     .filter(ee.Filter.eq('reg_id', regiao));

  // Train the Random Forest classifier using the specified parameters and training data
  var classifier = ee.Classifier.smileRandomForest({
    numberOfTrees: RFtrees, 
    variablesPerSplit: 1
  }).train(BDamostras, 'reference', bandNames);
  
  // Output the region ID and the classifier importance metrics to the console for review
  print(regiao, classifier.explain());

}