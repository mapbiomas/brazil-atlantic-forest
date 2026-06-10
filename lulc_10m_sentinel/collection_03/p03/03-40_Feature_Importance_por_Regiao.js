// Summary: This script shows the feature importance results from a Random Forest
// classifier for each region in the console. You can organize this data
// per region in a spreadsheet. This console output serves as input for
// scripts 04-XX, providing a list of the most important bands per region.
// Each region will utilize the top 60 most important bands, in addition
// to slope, latitude, and longitude if they are not already included.

// Define a geometry for the Atlantic Forest region.
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

//var regiaoID = 'reg_01';

// Import a module containing monthly Landsat mosaics.
var mos = ee.ImageCollection('projects/nexgenmap/MapBiomas2/SENTINEL/mosaics-3')


// Set the number of trees for the Random Forest classifier.
var RFtrees = 200;

// Load a feature collection with regions of the Atlantic Forest.
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');
// Add the regions collection to the map as a hidden layer.
Map.addLayer(regioesCollection, {}, 'regioesCollection', false);

// Define the path to training data.
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/';
// The number of the seed.
var seed = '1';
// Get the year of analisys.
var ano = 2024;
// The training data version from script 03-10.
var versao_pt = '3';

// Define the list of years in the analisys.
var anos = [
            //2017,2018,2019,2020,2021,2022,2023,
            2024
            //,2025
            ];

// Band names list used in the analisys (expect MINs and MAXs and LAT and LONG - the last two will always be added)
var bandNames = ee.List([
'afvi_median','afvi_median_dry','afvi_median_wet','avi_median','avi_median_dry','avi_median_wet','awei_median','awei_median_dry','awei_median_wet','blue_median','blue_median_dry','blue_median_wet','blue_stdDev','brba_median','brba_median_dry','brba_median_wet','brightness_median','brightness_median_dry','brightness_median_wet','bsi_median','bsi_median_1','bsi_median_2','co2flux_median','cvi_median','cvi_median_dry','cvi_median_wet','dswi5_median','dswi5_median_dry','dswi5_median_wet','evi_median','evi_median_dry','evi_median_wet','gcvi_median','gcvi_median_dry','gcvi_median_wet','gemi_median','gemi_median_dry','gemi_median_wet','gli_median','gli_median_dry','gli_median_wet','green_median','green_median_dry','green_median_texture','green_median_wet','green_stdDev','gvmi_median','gvmi_median_1','gvmi_median_dry','gvmi_median_dry_1','gvmi_median_wet','gvmi_median_wet_1','iia_median','iia_median_dry','iia_median_wet','lai_median','lswi_median','lswi_median_dry','lswi_median_wet','mbi_median','mbi_median_dry','mbi_median_wet','msi_median','msi_median_dry','msi_median_wet','nddi_median','nddi_median_dry','nddi_median_wet','ndvi_median','ndvi_median_dry','ndvi_median_wet','ndwi_median','ndwi_median_dry','ndwi_median_wet','nir_median','nir_median_contrast','nir_median_dry','nir_median_dry_contrast','nir_median_wet','nir_stdDev','osavi_median','osavi_median_dry','osavi_median_wet','ratio_median','ratio_median_dry','ratio_median_wet','red_edge_1_median','red_edge_1_median_dry','red_edge_1_median_wet','red_edge_1_stdDev','red_edge_2_median','red_edge_2_median_dry','red_edge_2_median_wet','red_edge_2_stdDev','red_edge_3_median','red_edge_3_median_dry','red_edge_3_median_wet','red_edge_3_stdDev','red_edge_4_median','red_edge_4_median_dry','red_edge_4_median_wet','red_edge_4_stdDev','red_median','red_median_contrast','red_median_dry','red_median_dry_contrast','red_median_wet','red_stdDev','reference','ri_median','ri_median_dry','ri_median_wet','rvi_median','rvi_median_1','rvi_median_wet','shape_median','shape_median_dry','shape_median_wet','spri_median','spri_median_1','spri_median_wet','swir1_median','swir1_median_dry','swir1_median_wet','swir1_stdDev','swir2_median','swir2_median_dry','swir2_median_wet','swir2_stdDev','ui_median','ui_median_dry','ui_median_wet','wetness_median','wetness_median_dry','wetness_median_wet'
]);

// The list of regions.
var regioes_lista = [
    ['reg_01'],['reg_02'],['reg_03'],['reg_04'],['reg_05'],['reg_06'],['reg_07'],['reg_08'],['reg_09'],['reg_10'],
    ['reg_11'],['reg_12'],['reg_13'],['reg_14'],['reg_15'],['reg_16'],['reg_17'],['reg_18'],['reg_19'],['reg_20'],
    ['reg_21'],['reg_22'],['reg_23'],['reg_24'],['reg_25'],['reg_26'],['reg_27'],['reg_28'],['reg_29'],['reg_30']
    ];

// Loop through each region.
for (var i_regiao=0;i_regiao<regioes_lista.length; i_regiao++){
  // Get the current region ID.
  var lista = regioes_lista[i_regiao];
  var regiao = lista[0];
  // Filter the regions feature collection to get the geometry for the current region.
  var limite = regioesCollection.filter(ee.Filter.eq('reg_id',regiao));

  // Load the training data for the current region.
  var BDamostras = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/pontos_train_s2_emb_v6_'+ano)
                     .filter(ee.Filter.eq('reg_id',regiao));

  // Train a Random Forest classifier.
  var classifier = ee.Classifier.smileRandomForest({numberOfTrees: RFtrees, variablesPerSplit:1}).train(BDamostras, 'reference', bandNames);
  
  // This print shows the results of feature importance from this Random Forest classifier in the console.
  // To use this information in the next scripts we copy and paste it on a spreadsheet.
  // In the spreadsheet is possible to order by importance for each region.
  print(regiao,classifier.explain());

}