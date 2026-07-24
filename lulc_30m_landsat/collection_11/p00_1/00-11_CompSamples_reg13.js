/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Extraction of complementary training samples for land cover classification, focusing on the region 'reg_13'.
 * 
 * DESCRIPTION:
 * This script automates the process of collecting training samples across multiple years and classes 
 * within the Atlantic Forest biome, specifically configured for the region identified as 'reg_13'. 
 * It utilizes custom Landsat mosaics, cluster data, and auxiliary environmental variables. The 
 * process is organized into multi-year batches to optimize Google Earth Engine processing limits. 
 * For each year, it builds a multi-band image including spectral metrics, temporal statistics 
 * (median, wet/dry seasons), and terrain data. Stratified sampling is performed based on 
 * user-defined geometries for the specific classes of interest in this region: Wetland/Varzea 
 * (300 samples) and Agriculture (800 samples). The resulting feature collections are exported 
 * as Assets for use in machine learning classifiers.
 */

// Define FeatureCollection variables to store complementary spatial samples
var varzea = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.817921029204676, -25.88887186386031],
                  [-52.814916955107996, -25.88713446984438],
                  [-52.81225620376522, -25.886671160455354],
                  [-52.81414447891171, -25.886400895805483],
                  [-52.81633316146786, -25.88728890590336]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.505051855530894, -25.641673347370265],
                  [-52.50711179205433, -25.643336960884163],
                  [-52.503292326417125, -25.642485812680906]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-53.500737335806576, -24.842404604027838],
                  [-53.500994827872006, -24.834771295686938],
                  [-53.50193896544525, -24.83695228896029],
                  [-53.50168147337982, -24.841469938502605]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-53.538116812025926, -24.727172001493475],
                  [-53.53768765858354, -24.731381816950407],
                  [-53.53657185963335, -24.728653249102155]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-53.40153059297885, -24.695908944172],
                  [-53.402903883994476, -24.700977569862918],
                  [-53.403676360190765, -24.705266245901864],
                  [-53.407452910483734, -24.71049043354728],
                  [-53.40110143953647, -24.705656118219043],
                  [-53.401702254355804, -24.703472817522986],
                  [-53.39998564058627, -24.70105554710893],
                  [-53.39981397920932, -24.699106101314833]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-53.62200853566154, -24.53501329778091],
                  [-53.62441179493889, -24.54461687325328],
                  [-53.62329599598869, -24.54383612220707],
                  [-53.620721075334394, -24.53649682491202]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-53.70536689734124, -24.567389422306526],
                  [-53.704079437014094, -24.564891455508963],
                  [-53.70674018835687, -24.566452690591422]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-53.86658405501782, -24.65449187344702],
                  [-53.865124933313716, -24.654569879767436],
                  [-53.86049007613598, -24.651995645456584],
                  [-53.86383747298657, -24.652073653336807],
                  [-53.86426662642895, -24.65371180756188],
                  [-53.86581157882153, -24.652931736802255]]]),
            {
              "reference": 11,
              "system:index": "7"
            })]),
    agro = /* color: #bf04c2 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.99713538224399, -24.582610752905584],
                  [-52.00056860978305, -24.58183023845786],
                  [-51.99756453568637, -24.583781515457066]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.030695181438325, -24.565906682186174],
                  [-52.031725149700044, -24.567311783254528],
                  [-52.028721075603364, -24.5674679046231]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.03764746720493, -24.55981772888035],
                  [-52.03953574235141, -24.560286120403685],
                  [-52.03764746720493, -24.56091063971276]]]),
            {
              "reference": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.911605776717415, -24.636232434676632],
                  [-51.90903085606312, -24.636076399077055],
                  [-51.90894502537464, -24.6343599946202]]]),
            {
              "reference": 21,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.84043588368671, -24.695688000089337],
                  [-51.83846177785175, -24.69584396115443],
                  [-51.8400925609328, -24.693660488478034]]]),
            {
              "reference": 21,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.86833085744159, -24.7461312157645],
                  [-51.86618509022968, -24.746832754605126],
                  [-51.8620652171828, -24.746287113626803],
                  [-51.86266603200214, -24.745429672964626],
                  [-51.865498444721865, -24.746209164720096],
                  [-51.867730042622256, -24.745507622360133]]]),
            {
              "reference": 21,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.93373384206073, -24.777930329980812],
                  [-51.936909577534365, -24.777151037257696],
                  [-51.937167069599795, -24.777774471827605],
                  [-51.93536462514179, -24.77863168924847]]]),
            {
              "reference": 21,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.011324784443545, -24.788294457892786],
                  [-52.01175393788593, -24.78689184461293],
                  [-52.01269807545917, -24.787593153234933],
                  [-52.012097260639834, -24.78938536836993]]]),
            {
              "reference": 21,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.976134202168154, -24.80769564776704],
                  [-51.969611069843936, -24.804267545859798],
                  [-51.97716417042987, -24.805825785751455]]]),
            {
              "reference": 21,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.977850815937686, -24.814162036446294],
                  [-51.97553338734882, -24.819381646253362],
                  [-51.97604837147968, -24.814863190846346]]]),
            {
              "reference": 21,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.907433714457014, -24.85692519162151],
                  [-51.90219804245994, -24.854043621789014],
                  [-51.90794869858787, -24.854666669603393]]]),
            {
              "reference": 21,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.92957803208397, -24.857548224920322],
                  [-51.93198129136131, -24.85801549783466],
                  [-51.930350508280256, -24.8592615503081]]]),
            {
              "reference": 21,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.82307231893543, -24.875017606774104],
                  [-51.82058322896961, -24.87439466150952],
                  [-51.82152736654285, -24.873304499740357],
                  [-51.823930625820196, -24.873849581827045]]]),
            {
              "reference": 21,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.71013308127515, -24.94749721508374],
                  [-51.710562234717536, -24.944773406991303],
                  [-51.711334710913825, -24.946952458283945]]]),
            {
              "reference": 21,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.70129252036207, -24.965239404738398],
                  [-51.70000506003492, -24.966484374660883],
                  [-51.69974756796949, -24.964227857402605]]]),
            {
              "reference": 21,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.63894082236699, -25.03158651702435],
                  [-51.63739586997441, -25.033375191268426],
                  [-51.6352501027625, -25.03244197317713]]]),
            {
              "reference": 21,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.63250352073125, -25.002575247350467],
                  [-51.63173104453496, -25.005064418641282],
                  [-51.630100261453904, -25.005531132643338]]]),
            {
              "reference": 21,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.46730383830637, -24.995261260894274],
                  [-51.4661022086677, -24.995261260894274],
                  [-51.46730383830637, -24.992771891007216],
                  [-51.46807631450266, -24.994561130709823]]]),
            {
              "reference": 21,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.46738966899485, -24.982502707318726],
                  [-51.46412810283274, -24.982813907305488],
                  [-51.46532973247141, -24.981335700354194]]]),
            {
              "reference": 21,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.43082579570383, -24.983202906181443],
                  [-51.427735890918676, -24.984681090686927],
                  [-51.42807921367258, -24.982502707318726]]]),
            {
              "reference": 21,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.0667291545833, -25.276114619615928],
                  [-51.06466921805986, -25.27487280026619],
                  [-51.0652700328792, -25.27370858308404]]]),
            {
              "reference": 21,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.09050425529131, -25.290084211477858],
                  [-51.09024676322588, -25.2875232400767],
                  [-51.09170588492998, -25.288764929934295]]]),
            {
              "reference": 21,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.047935441597865, -25.34069084039674],
                  [-51.04905124054806, -25.33921696421616],
                  [-51.0499953781213, -25.34100112783115]]]),
            {
              "reference": 21,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.11093516693966, -25.36202124785354],
                  [-51.111535981759, -25.36465820049196],
                  [-51.110076860054896, -25.364813313561367]]]),
            {
              "reference": 21,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.83065076959583, -24.412791756257636],
                  [-51.82859083307239, -24.408727543082996],
                  [-51.837173901920046, -24.412166501208624]]]),
            {
              "reference": 21,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.22537275445911, -24.86326753136592],
                  [-51.22880598199817, -24.868874430447725],
                  [-51.22365614068958, -24.869185917384716],
                  [-51.221252881412234, -24.86607101269384],
                  [-51.221939526920046, -24.863579032430536]]]),
            {
              "reference": 21,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.258394491017455, -25.229048614372964],
                  [-52.26354433232605, -25.228738040413038],
                  [-52.26423097783386, -25.236502151427015],
                  [-52.258394491017455, -25.235881040792528]]]),
            {
              "reference": 21,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.816461091633784, -26.104922321279407],
                  [-50.811997895833, -26.101839277404835],
                  [-50.816461091633784, -26.099681098330326]]]),
            {
              "reference": 21,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.846673493977534, -26.13266605740822],
                  [-50.84873343050097, -26.129275509685097],
                  [-50.85148001253222, -26.130816679942733]]]),
            {
              "reference": 21,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.82676077425097, -26.14591907215186],
                  [-50.82435751497363, -26.14900095297345],
                  [-50.82332754671191, -26.14530268622204]]]),
            {
              "reference": 21,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.78727865755175, -26.15670529895676],
                  [-50.787965303059565, -26.160095050021493],
                  [-50.7845320755205, -26.15978689490408]]]),
            {
              "reference": 21,
              "system:index": "30"
            })]);
            
// --- 1. GENERAL CONFIGURATIONS AND PATHS ---

// Unique identifier for the specific geographic region being processed
var regiaoID = 'reg_13';

// Manual definition of a specific year, used as a reference point for individual operations
var ano = 2020; 

// Base directory path for saving the resulting sample assets in the MapBiomas repository
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Import of auxiliary feature collections representing regional boundaries
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Filter the master collection to obtain the specific geometry of region 'reg_13'
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

    // Define the specific subset of band names to be used as features for the sampling process for 'reg_13'
    var bandNames = ee.List([
      'swir1_max',	'green_min',	'swir2_median',	'hallcover_min',	'hallheigth_min',	'gcvi_min',	'cai_median_wet',	
      'ndfi_median_dry',	'evi2_median_wet',	'red_median',	'ndvi_max',	'ndvi_median',	'hallcover_median_dry',	
      'hallcover_median',	'red_median_wet',	'ndwi_median_wet',	'gcvi_median_wet',	'savi_median_dry',	'hallheigth_median',	
      'ndwi_max',	'swir2_median_wet',	'cai_median_dry',	'blue_max',	'swir1_median',	'ndwi_min',	'cai_median',
      'savi_median_wet',	'cai_min',	'blue_amp',	'swir2_max',	'fns_stdDev',	'nir_median',	'cai_max',	
      'hallheigth_median_wet',	'gcvi_median',	'gv_stdDev',	'nir_min',	'hallcover_median_wet',	'evi2_max',	'ndwi_stdDev',	
      'green_median',	'blue_min',	'swir1_median_dry',	'savi_amp',	'swir2_min',	'green_max',	'hallcover_max',	
      'ndvi_median_dry',	'savi_max',	'gv_amp',	'nir_max',	'gvs_min',	'savi_min',	'green_median_wet',	
      'ndfi_stdDev',	'swir1_min',	'ndwi_median_dry', 'latitude', 'longitude', 'slope',
    ]);
  
    /**
     * OPTIMIZED VERSION: Dynamic processing per land cover class
     */

    // --- 1. CLASS DEFINITIONS (Configuration Dictionary) ---
    // Mapping table defining available class variables, sample quotas, numeric legend references, and class names
    var classConfigs = [
      {variable: typeof flo     !== 'undefined' ? flo     : null, number: 0, ref: 3,  name: 'floresta'},
      {variable: typeof sav     !== 'undefined' ? sav     : null, number: 0, ref: 4,  name: 'savana'},
      {variable: typeof reflo   !== 'undefined' ? reflo   : null, number: 0, ref: 9,  name: 'reflo'},
      {variable: typeof varzea  !== 'undefined' ? varzea  : null, number: 300, ref: 11, name: 'varzea'},
      {variable: typeof campo   !== 'undefined' ? campo   : null, number: 0, ref: 12, name: 'campo'},
      {variable: typeof agro    !== 'undefined' ? agro    : null, number: 800, ref: 21, name: 'agro'},
      {variable: typeof nveg    !== 'undefined' ? nveg    : null, number: 0, ref: 22, name: 'nao vegetada'},
      {variable: typeof aflora  !== 'undefined' ? aflora  : null, number: 0, ref: 29, name: 'afloramento'},
      {variable: typeof agua    !== 'undefined' ? agua    : null, number: 0, ref: 33, name: 'agua'},
      {variable: typeof herb    !== 'undefined' ? herb    : null, number: 0, ref: 50, name: 'rest herbacea'},
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
    // Function designed to extract raster pixel values using spatial geometries for region 'reg_13'
    var getTrainingSamples = function(classObj) {
      // Filter the class geometries by the current regional limit ('reg_13')
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
    // Iterate through active classes to collect samples for the specific year in region 'reg_13'
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

  // Export the final multi-year batch collection for 'reg_13' as an Earth Engine Asset
  Export.table.toAsset({
    collection: amostras,
    description: 'amostras_complementares_'+batch+'_'+regiaoID,
    assetId: dirout + 'amostras_complementares_'+batch+'_'+regiaoID,
    overwrite: true
  });

} 

// Print the names of classes that were successfully processed to the console for verification in 'reg_13'
print('Classes processadas:', classesAtivas.map(function(i){return i.name}));