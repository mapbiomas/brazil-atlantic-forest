/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Evaluate and export feature importance using the Random Forest classifier for each regional domain.
 * 
 * DESCRIPTION:
 * This script calculates the importance of 184 spectral, textural, and spatial bands for 
 * land cover classification across 30 specific regions of the Atlantic Forest. It uses 
 * stable training points (Collection 11 version) as ground truth. For each region, the script 
 * trains a Random Forest classifier with 500 trees. Instead of performing a final 
 * classification, it calls the 'explain()' method to retrieve the importance scores for 
 * every band in the input mosaic. These results are printed to the console, allowing the 
 * user to identify the most relevant features (typically the top 60) to optimize subsequent 
 * classification steps. This feature selection process helps in reducing data redundancy 
 * and improving the accuracy of the machine learning models.
 * 
 * The output data (in the console) from this script is used on scripts 04-XX as an input,
 * as a list of the most important bands, for each region.
 * Each region will use the 60 most important ones (plus slope, lat and long, if they are not on the list).
 */

// Define the geographical boundary of the Atlantic Forest (Mata Atlântica) for data clipping.
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


// Set the number of decision trees to be used in the Random Forest model (500).
var RFtrees = 500;

// Load the official feature collection containing the Atlantic Forest regional boundaries for 2025.
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');
// Add the regions to the map for spatial verification.
Map.addLayer(regioesCollection, {}, 'regioesCollection', false);

// Path to the directory where the extracted training point assets are stored.
var dirsamples = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Define the seed for random operations to ensure reproducibility.
var seed = '1';

// Specify the reference year (2020) for feature importance analysis.
var ano = 2020;

// Version of the training points generated in the previous processing step (03-10).
var versao_pt = '1';

// Full list of years available in the collection (not iterated here, but used as reference).
var anos = [
            1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025
            ];

// Import the modular script used to generate custom Landsat mosaics.
var cloudMos = require('users/yasmingelli-arcplan/MapBiomas_LANDSATcol11_MA:Mata_Atlantica_LANDSAT/passo00/00-01_Mosaicos_mensais_do_Google_v1');

// Import textural cluster data and NDFI statistics to support the classification.
var clusterMos = ee.Image('projects/mapbiomas-workspace/COLECAO_10/MA_clusters_1985_2024_asset_salvo')
                .addBands('projects/nexgenmap/ANCILLARY/MATA_ATLANTICA/MOSAICS/MA_clusters_2025_asset_salvo');

// Generate the annual mosaic for the target analysis year (2020) over the Atlantic Forest.
var mosaicoTotal = cloudMos.getMosaic(ano, limite_MA); 

// Integrate ancillary bands (textural clusters, coordinate features, and temporal NDFI amplitude).
mosaicoTotal = mosaicoTotal
  .addBands(clusterMos.select(
    ['clusters_'+ano, 'clusters_green_text_'+ano, 'amp_ndfi_3anos_'+ano, 'clusters_ndfi_median_'+ano, 'longitude','latitude'],
    ['clusters', 'clusters_green_text', 'amp_ndfi_3anos', 'clusters_ndfi_median', 'longitude','latitude']
  ))
  .set('year', ano);

// Detailed list of the 184 band names used for the Random Forest importance calculation.
var bandNames = ee.List([
'amp_ndfi_3anos','blue_amp','blue_max','blue_median','blue_median_dry','blue_median_wet','blue_min','blue_stdDev','cai_amp','cai_max',
'cai_median','cai_median_dry','cai_median_wet','cai_min','cai_stdDev','cloud_amp','cloud_max','cloud_median','cloud_median_dry',
'cloud_median_wet','cloud_min','cloud_stdDev','clusters','clusters_green_text','clusters_ndfi_median','evi2_amp','evi2_max','evi2_median',
'evi2_median_dry','evi2_median_wet','evi2_min','evi2_stdDev','fns_amp','fns_max','fns_median','fns_median_dry','fns_median_wet','fns_min',
'fns_stdDev','gcvi_amp','gcvi_max','gcvi_median','gcvi_median_dry','gcvi_median_wet','gcvi_min','gcvi_stdDev','green_amp','green_max','green_median',
'green_median_dry','green_median_texture','green_median_wet','green_min','green_stdDev','gv_amp','gv_max','gv_median','gv_median_dry','gv_median_wet',
'gv_min','gv_stdDev','gvs_amp','gvs_max','gvs_median','gvs_median_dry','gvs_median_wet','gvs_min','gvs_stdDev','hallcover_amp','hallcover_max',
'hallcover_median','hallcover_median_dry','hallcover_median_wet','hallcover_min','hallcover_stdDev','hallheigth_amp','hallheigth_max',
'hallheigth_median','hallheigth_median_dry','hallheigth_median_wet','hallheigth_min','hallheigth_stdDev','latitude','longitude','ndfi_amp',
'ndfi_max','ndfi_median','ndfi_median_dry','ndfi_median_wet','ndfi_min','ndfi_stdDev','ndvi_amp','ndvi_max','ndvi_median','ndvi_median_dry',
'ndvi_median_wet','ndvi_min','ndvi_stdDev','ndwi_amp','ndwi_max','ndwi_median','ndwi_median_dry','ndwi_median_wet','ndwi_min','ndwi_stdDev',
'nir_amp','nir_max','nir_median','nir_median_dry','nir_median_wet','nir_min','nir_stdDev','npv_amp','npv_max','npv_median','npv_median_dry',
'npv_median_wet','npv_min','npv_stdDev','pri_amp','pri_max','pri_median','pri_median_dry','pri_median_wet','pri_min','pri_stdDev','random',
'red_amp','red_max','red_median','red_median_dry','red_median_wet','red_min','red_stdDev','reference','savi_amp','savi_max','savi_median',
'savi_median_dry','savi_median_wet','savi_min','savi_stdDev','sefi_amp','sefi_max','sefi_median','sefi_median_dry','sefi_median_wet','sefi_min',
'sefi_stdDev','shade_amp','shade_max','shade_median','shade_median_dry','shade_median_wet','shade_min','shade_stdDev','slope','soil_amp','soil_max',
'soil_median','soil_median_dry','soil_median_wet','soil_min','soil_stdDev','swir1_amp','swir1_max','swir1_median','swir1_median_dry',
'swir1_median_wet','swir1_min','swir1_stdDev','swir2_amp','swir2_max','swir2_median','swir2_median_dry','swir2_median_wet','swir2_min',
'swir2_stdDev','wefi_amp','wefi_max','wefi_median','wefi_median_dry','wefi_median_wet','wefi_min','wefi_stdDev',
]);

// Definition of the regional processing list (regions 01 to 30).
var regioes_lista = [
    ['reg_01'],['reg_02'],['reg_03'],['reg_04'],['reg_05'],
    ['reg_06'],['reg_07'],['reg_08'],['reg_09'],['reg_10'],
    ['reg_11'],['reg_12'],['reg_13'],['reg_14'],['reg_15'],
    ['reg_16'],['reg_17'],['reg_18'],['reg_19'],['reg_20'],
    ['reg_21'],['reg_22'],['reg_23'],['reg_24'],['reg_25'],
    ['reg_26'],['reg_27'],['reg_28'],['reg_29'],['reg_30']
    ];

// Iterate through each regional domain in the Atlantic Forest.
for (var i_regiao=0; i_regiao<regioes_lista.length; i_regiao++){
  // Extract the current region identifier from the array.
  var lista = regioes_lista[i_regiao];
  var regiao = lista[0];
  // Filter the boundary collection to isolate the current region's geometry.
  var limite = regioesCollection.filter(ee.Filter.eq('reg_id',regiao));

  // Merge the six temporal point batches (b1 to b6) into a single feature collection for the current region.
  var BDamostras = ee.FeatureCollection(dirsamples + 'pontos_train_b1_v'+versao_pt+'_'+ano)
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b2_v'+versao_pt+'_'+ano))
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b3_v'+versao_pt+'_'+ano))
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b4_v'+versao_pt+'_'+ano))
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b5_v'+versao_pt+'_'+ano))
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b6_v'+versao_pt+'_'+ano))
            .filter(ee.Filter.eq('reg_id',regiao));

  // Initialize and train the Random Forest model using 'reference' as the class label and 1 variable per split for importance calculation.
  var classifier = ee.Classifier.smileRandomForest({numberOfTrees: RFtrees, variablesPerSplit:1}).train(BDamostras, 'reference', bandNames);
  
  // Output the classification metadata (including variable importance) to the Earth Engine console.
  // This information should be exported to a spreadsheet to assist in selecting the best bands for final mapping.
  print(regiao, classifier.explain());

}