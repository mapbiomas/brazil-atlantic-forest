/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Extraction of complementary training samples for land cover classification, focusing on the region 'reg_07'.
 * 
 * DESCRIPTION:
 * This script automates the process of collecting training samples across multiple years and classes 
 * within the Atlantic Forest biome, specifically configured for the region identified as 'reg_07'. 
 * It utilizes custom Landsat mosaics, cluster data, and auxiliary environmental variables. The 
 * process is organized into multi-year batches to optimize Google Earth Engine processing limits. 
 * For each year, it builds a multi-band image including spectral metrics, temporal statistics 
 * (median, wet/dry seasons), and terrain data. Stratified sampling is performed based on 
 * user-defined geometries for the specific classes of interest in this region: Wetland/Varzea 
 * (300 samples) and Agriculture (400 samples). The resulting feature collections are exported 
 * as Assets for use in machine learning classifiers.
 */

// Define FeatureCollection variables to store complementary spatial samples
var varzea = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.95444276767843, -28.731228877190368],
                  [-52.95538690525167, -28.729272005733222],
                  [-52.95671728092306, -28.730814926668238],
                  [-52.955301074563195, -28.73168045770834]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-53.01333320325552, -28.717902265196198],
                  [-53.01590812390982, -28.718128084482693],
                  [-53.01462066358267, -28.72023570764139]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.93466937726675, -28.621884956833664],
                  [-52.93509853070913, -28.623768494542695],
                  [-52.93213737195669, -28.623806164952203],
                  [-52.93110740369497, -28.623015083514062],
                  [-52.92913329786001, -28.62286440065954],
                  [-52.92921912854849, -28.621357560219757],
                  [-52.93162238782583, -28.62256303430168],
                  [-52.93218028730093, -28.620717146484235],
                  [-52.93501270002066, -28.620491117174378]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.93548476880728, -28.62245002169446],
                  [-52.93625724500357, -28.621884956833664],
                  [-52.937287213265286, -28.62015207229728],
                  [-52.93771636670767, -28.62211098314292],
                  [-52.936300160347805, -28.623542471801816]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.91939151471792, -28.606777762308596],
                  [-52.91917693799673, -28.605534430081388],
                  [-52.92252433484732, -28.605270691050666],
                  [-52.921108128487454, -28.607154526745166]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.92462718671499, -28.61333327070964],
                  [-52.92303931897818, -28.61393605553992],
                  [-52.92175185865103, -28.61563136932708],
                  [-52.920335652291165, -28.614049077310447],
                  [-52.92265308088003, -28.61333327070964]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.920850636422024, -28.60952811162464],
                  [-52.92325389569937, -28.6111481466998],
                  [-52.922610165535794, -28.612240714387113]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.917677312693996, -28.591921055930364],
                  [-52.91557446082632, -28.59244860033771],
                  [-52.915960698924465, -28.59139350887562],
                  [-52.91729107459585, -28.590752912464332]]]),
            {
              "reference": 11,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.93003693183462, -28.569825487096782],
                  [-52.93033733924429, -28.568167124791792],
                  [-52.93179646094839, -28.570315452775915]]]),
            {
              "reference": 11,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.88057141028627, -28.263042853682062],
                  [-52.881515547859514, -28.260699283449316],
                  [-52.88391880713686, -28.263647637634755]]]),
            {
              "reference": 11,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.87567906104311, -28.25140009372727],
                  [-52.877481505501116, -28.25064402638895],
                  [-52.87782482825502, -28.252912212320545]]]),
            {
              "reference": 11,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.8559380026935, -28.24527579413685],
                  [-52.85791210852846, -28.243763567257197],
                  [-52.85748295508608, -28.24527579413685]]]),
            {
              "reference": 11,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.839801833259905, -28.245351404918008],
                  [-52.840831801521624, -28.24527579413685],
                  [-52.84117512427553, -28.24693921893971]]]),
            {
              "reference": 11,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.92397796209953, -28.261716980989334],
                  [-52.92414962347648, -28.26080978733961],
                  [-52.925265422426676, -28.260280587478015],
                  [-52.924578776918864, -28.26156578258394]]]),
            {
              "reference": 11,
              "system:index": "13"
            })]),
    agro = /* color: #98ff00 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.70994858603312, -28.70472344696838],
                  [-52.71046357016398, -28.702540227026688],
                  [-52.712351845310465, -28.70479872960218]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.67922119955851, -28.6816844172487],
                  [-52.68050865988566, -28.67987722010617],
                  [-52.680680321262614, -28.681835015603014]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.46393824581603, -28.177130299574745],
                  [-52.467113981289664, -28.17750859423252],
                  [-52.46548319820861, -28.179778334081167]]]),
            {
              "reference": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.41421124310086, -28.206064458470543],
                  [-52.40863224834988, -28.204551675987172],
                  [-52.4082030949075, -28.202660667759577],
                  [-52.41283795208523, -28.204249116919936]]]),
            {
              "reference": 21,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.29068718074992, -28.0314643683181],
                  [-52.287597275964764, -28.03108555835116],
                  [-52.28798351406291, -28.028888434248387],
                  [-52.2902151119633, -28.03025217173029]]]),
            {
              "reference": 21,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.19027001841227, -27.961390575490878],
                  [-52.19061334116618, -27.959722717615573],
                  [-52.19207246287028, -27.960329214370297],
                  [-52.191643309427896, -27.961163141843638]]]),
            {
              "reference": 21,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.12546252507204, -27.901869867683477],
                  [-52.12623500126833, -27.902780098675535],
                  [-52.12533377903932, -27.903538618652963]]]),
            {
              "reference": 21,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.14619285364476, -27.872023386331605],
                  [-52.14726573725072, -27.873958151319073],
                  [-52.14529163141576, -27.873996087542043]]]),
            {
              "reference": 21,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.13035646703226, -27.777762140128836],
                  [-52.131386435293976, -27.778369656233128],
                  [-52.13087145116312, -27.779660616688428],
                  [-52.13001314427835, -27.779736555061575]]]),
            {
              "reference": 21,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.14353831979841, -27.76338877365301],
                  [-52.14482578012556, -27.764224217778228],
                  [-52.14345248910993, -27.765287501026258]]]),
            {
              "reference": 21,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.093423322281275, -27.747873578217835],
                  [-52.09179253920022, -27.748329340752313],
                  [-52.09213586195413, -27.746506279171008]]]),
            {
              "reference": 21,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.045297932763006, -27.72367567483822],
                  [-52.04572708620539, -27.72230807213349],
                  [-52.046842885155584, -27.723827629635352]]]),
            {
              "reference": 21,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.78157260978479, -27.630642030548167],
                  [-51.78208759391565, -27.62775238933978],
                  [-51.78307464683313, -27.63037588257374]]]),
            {
              "reference": 21,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.723161279271075, -27.611469622053885],
                  [-51.72110134274764, -27.611469622053885],
                  [-51.72101551205916, -27.610404839857402],
                  [-51.7230754485826, -27.61032878359019]]]),
            {
              "reference": 21,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-53.10670729185633, -27.94881936278266],
                  [-53.112887101426644, -27.95245865972559],
                  [-53.101900773301644, -27.960646629356237],
                  [-53.09881086851649, -27.954278262200297]]]),
            {
              "reference": 21,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.972492709227346, -28.01492316290935],
                  [-52.96768619067266, -28.010679763198777],
                  [-52.971806063719534, -28.007648661047618],
                  [-52.977299227782034, -28.011892180176297]]]),
            {
              "reference": 21,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.18891879760818, -27.326530501667122],
                  [-52.1954419299324, -27.332935517617408],
                  [-52.19063541137771, -27.33476545420713]]]),
            {
              "reference": 21,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.1020581408699, -28.128207256797108],
                  [-52.10137149536209, -28.134262577270217],
                  [-52.09828159057693, -28.13002388886492]]]),
            {
              "reference": 21,
              "system:index": "17"
            })]);
            
// --- 1. GENERAL CONFIGURATIONS AND PATHS ---

// Unique identifier for the specific geographic region being processed
var regiaoID = 'reg_07';

// Manual definition of a specific year, used as a reference point for individual operations
var ano = 2020; 

// Base directory path for saving the resulting sample assets in the MapBiomas repository
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Import of auxiliary feature collections representing regional boundaries
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Filter the master collection to obtain the specific geometry of region 'reg_07'
var limite = regioesCollection.filterMetadata('reg_id', "equals", regiaoID);

// Loading previously exported complementary samples for potential merging or reference
var amostras_exportadas = ee.FeatureCollection(dirout + 'amostras_complementares_'+regiaoID);

// Coordinate-based polygon defining the overall boundary of the Atlantic Forest biome for clipping mosaics
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

// Visualization parameters for RGB rendering using SWIR, NIR, and Red bands to inspect the mosaic
var visParMedian2 = {
  bands: ['swir1_median', 'nir_median', 'red_median'],
  gain: [0.08, 0.06, 0.2],
  gamma: 0.85
};

// Configuration list grouping years into batches to manage Google Earth Engine's memory and time limits
var dicExp = [
  {batch: 'b1', anos: [1985,1986,1987,1988,1989]},
  {batch: 'b2', anos: [1990,1991,1992,1993,1994]},
  {batch: 'b3', anos: [1995,1996,1997,1998,1999]},
  {batch: 'b4', anos: [2000,2001,2002,2003,2004]},
  {batch: 'b5', anos: [2005,2006,2007,2008,2009]},
  {batch: 'b6', anos: [2010,2011,2012,2013,2014]},
  {batch: 'b7', anos: [2015,2016,2017,2018,2019]},
  {batch: 'b8', anos: [2020,2021,2022,2023,2024,2025]},
  ];
  
// --- 2. DATA IMPORT (MOSAICS AND CLUSTERS) ---

// Import the external script for generating custom cloud-free monthly Landsat mosaics
var cloudMos = require('users/yasmingelli-arcplan/MapBiomas_LANDSATcol11_MA:Mata_Atlantica_LANDSAT/passo00/00-01_Mosaicos_mensais_do_Google_v1');

// Load the cluster asset containing statistical and textural segmentation data across time
var clusterMos = ee.Image('projects/mapbiomas-workspace/COLECAO_10/MA_clusters_1985_2024_asset_salvo')
                .addBands('projects/nexgenmap/ANCILLARY/MATA_ATLANTICA/MOSAICS/MA_clusters_2025_asset_salvo');
                
// Load the collection of standardized MapBiomas mosaics for the Atlantic Forest region
var exportMos = ee.ImageCollection('projects/mapbiomas-mosaics/assets/LANDSAT/LULC/BRAZIL/MA-mosaics-32days-grids');

// Loop through each processing batch defined in the dictionary
for (var i = 0; i < dicExp.length; i++) {
  var config = dicExp[i]; 
 
  var batch = config.batch;
  var anos = config.anos;

  // Inner loop to process every individual year within the current batch
  for (var i_ano=0; i_ano<anos.length; i_ano++){
    var ano = anos[i_ano];
    
    // Set the projection to WGS84 (EPSG:4326) with a 30-meter pixel resolution
    var projLandsat = ee.Projection('EPSG:4326').atScale(30);
    
    // Obtain the Landsat mosaic for the specific year and reproject to a standard scale
    var mosaicoTotal = cloudMos.getMosaic(ano, limite_MA)
                               .reproject({crs: projLandsat}); 

    // Merge additional data layers: standard mosaics and cluster-based temporal/textural metrics
    mosaicoTotal = mosaicoTotal
      .addBands(exportMos.filter(ee.Filter.eq("year", ano)).mosaic())
      .addBands(clusterMos.select(
        ['clusters_'+ano, 'clusters_green_text_'+ano, 'amp_ndfi_3anos_'+ano, 'clusters_ndfi_median_'+ano],
        ['clusters', 'clusters_green_text', 'amp_ndfi_3anos', 'clusters_ndfi_median']
      ))
      .set('year', ano);

    // Define the specific subset of band names to be used as features for the sampling process for 'reg_07'
    var bandNames = ee.List([
      'shade_stdDev',	'gcvi_median',	'green_median',	'gcvi_amp',	'ndwi_stdDev',	'hallcover_min',	'blue_median',	
      'wefi_stdDev',	'gv_stdDev',	'blue_median_wet',	'swir2_median',	'ndvi_max',	'ndwi_median',	'swir1_median',	
      'evi2_max',	'gcvi_median_dry',	'ndvi_amp',	'ndwi_min',	'hallheigth_min',	'gcvi_median_wet',	'cai_median',	
      'hallcover_median',	'savi_median',	'swir2_min',	'evi2_median_dry',	'swir2_median_wet',	'evi2_min',	'savi_amp',	
      'swir2_median_dry',	'ndwi_max',	'ndwi_amp',	'green_stdDev',	'ndvi_median_dry',	'swir2_max',	'gvs_min',	
      'hallheigth_max',	'hallheigth_median_dry',	'swir1_median_wet',	'ndfi_stdDev',	'wefi_amp',	'ndvi_min',	'fns_stdDev',	
      'blue_max',	'nir_median',	'ndwi_median_dry',	'red_median_dry',	'swir1_max',	'green_max',	'blue_min',	'gv_median',	
      'swir1_stdDev',	'gcvi_min',	'savi_max',	'nir_amp',	'ndwi_median_wet',	'nir_median_wet',	'cai_max', 'latitude', 'longitude', 'slope',
    ]);
  
    /**
     * OPTIMIZED VERSION: Dynamic processing per land cover class
     */

    // --- 1. CLASS DEFINITIONS (Configuration Dictionary) ---
    // Mapping table defining available class variables, sample quotas, numeric legend references, and class names
    var classConfigs = [
      {variable: typeof flo     !== 'undefined' ? flo     : null, number:   0, ref: 3,  name: 'floresta'},
      {variable: typeof sav     !== 'undefined' ? sav     : null, number:   0, ref: 4,  name: 'savana'},
      {variable: typeof reflo   !== 'undefined' ? reflo   : null, number:   0, ref: 9,  name: 'reflo'},
      {variable: typeof varzea  !== 'undefined' ? varzea  : null, number: 300, ref: 11, name: 'varzea'},
      {variable: typeof campo   !== 'undefined' ? campo   : null, number:   0, ref: 12, name: 'campo'},
      {variable: typeof agro    !== 'undefined' ? agro    : null, number: 400, ref: 21, name: 'agro'},
      {variable: typeof nveg    !== 'undefined' ? nveg    : null, number:   0, ref: 22, name: 'nao vegetada'},
      {variable: typeof aflora  !== 'undefined' ? aflora  : null, number:   0, ref: 29, name: 'afloramento'},
      {variable: typeof agua    !== 'undefined' ? agua    : null, number:   0, ref: 33, name: 'agua'},
      {variable: typeof herb    !== 'undefined' ? herb    : null, number:   0, ref: 50, name: 'rest herbacea'},
    ];

    // --- 2. FILTERING AND CREATION OF REFERENCE IMAGE ---

    // Filter the configuration list to include only classes that exist and have samples requested
    var classesAtivas = classConfigs.filter(function(item) {
      return item.variable !== null && item.number > 0;
    });

    // Create a list of FeatureCollections where each point is labeled with its class reference and year
    var listaCollections = classesAtivas.map(function(item) {
      // Ensure each feature has the correct reference property before merging
      return item.variable.map(function(f) {
        return f.set('reference', item.ref).set('ano', ano);
      });
    });

    // Flatten the list of collections into a single master FeatureCollection of samples
    var amostraTotal = ee.FeatureCollection(listaCollections).flatten();

    // Convert the unified FeatureCollection into a raster image where pixels represent the class label
    var amostraTotalimg = amostraTotal.reduceToImage({
      properties: ['reference'],
      reducer: ee.Reducer.first()
    }).rename('reference');


    // --- 3. SAMPLING FUNCTION ---
    // Function designed to extract raster pixel values using spatial geometries for region 'reg_07'
    var getTrainingSamples = function(classObj) {
      // Filter the class geometries by the current regional limit ('reg_07')
      var regionClip = classObj.variable.filterBounds(limite);
      
      // Select classification bands and perform random sampling on the mosaic using the current year as seed
      var samples = mosaicoTotal.select(bandNames)
        .addBands(amostraTotalimg) 
        .sample({
          'numPixels': classObj.number,
          'region': regionClip,
          'scale': 30,
          'seed': ano, // Use current year as seed to ensure spatial variation across time
          'geometries': true
        });

      // Map metadata attributes and generate a uniform random column for dataset training/testing splits
      return samples.map(function(f) {
        return f.set({
          'class_name': classObj.name,
          'reference': classObj.ref,
          'reg_id': regiaoID,
          'ano': ano
        });
      }).randomColumn('random', 1);
    };

    // --- 4. PROCESSING AND EXPORT ---
    // Iterate through active classes to collect samples for the specific year in region 'reg_07'
    var listaAmostras = classesAtivas.map(function(item) {
      return getTrainingSamples(item);
    });

    // Flatten all class samples for the current year into a unified annual collection
    var amostrasComplementaresFinal = ee.FeatureCollection(listaAmostras).flatten();

    // Aggregate samples cumulatively across years within the active processing batch
    if (i_ano == 0){  
      // Initialize batch storage with the first year's feature collection
      var amostras = amostrasComplementaresFinal;
    }
    else { 
      // Merge subsequent years' samples into the accumulating batch collection
      amostras = amostras.merge(amostrasComplementaresFinal);
    }
    
  } 

  // Export the final multi-year batch collection for 'reg_07' as an Earth Engine Asset
  Export.table.toAsset({
    collection: amostras,
    description: 'amostras_complementares_'+batch+'_'+regiaoID,
    assetId: dirout + 'amostras_complementares_'+batch+'_'+regiaoID,
    overwrite: true
  });

} 

// Print the names of classes that were successfully processed to the console for verification in 'reg_07'
print('Classes processadas:', classesAtivas.map(function(i){return i.name}));