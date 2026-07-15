/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Extraction of complementary training samples for land cover classification, focusing on the region 'reg_28'.
 * 
 * DESCRIPTION:
 * This script automates the process of collecting training samples across multiple years and classes 
 * within the Atlantic Forest biome, specifically configured for the region identified as 'reg_28'. 
 * It utilizes custom Landsat mosaics, cluster data, and auxiliary environmental variables. The 
 * process is organized into multi-year batches to optimize Google Earth Engine processing limits. 
 * For each year, it builds a multi-band image including spectral metrics, temporal statistics 
 * (median, wet/dry seasons), and terrain data. Stratified sampling is performed based on 
 * user-defined geometries for the specific classes of interest in this region: Wetland/Varzea 
 * (1000 samples) and Grassland/Campo (1000 samples). The resulting feature collections are 
 * exported as Assets for use in machine learning classifiers.
 */

// Define FeatureCollection variables to store complementary spatial samples
var varzea = /* color: #00ffff */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.00819608497745, -23.930324741564768],
                  [-49.004076211930574, -23.93565941024725],
                  [-49.00390455055362, -23.933776611178907],
                  [-49.00519201088077, -23.931579977557778]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.99411985206729, -23.946563414670347],
                  [-48.99841138649112, -23.94232743606429],
                  [-49.00115796852237, -23.940523180724707],
                  [-48.99815389442569, -23.944602330752247],
                  [-48.994549005509676, -23.94891667602331]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.005022667402315, -23.873123034783436],
                  [-49.0028769001904, -23.87594854853973],
                  [-49.00322022294431, -23.88152090878753],
                  [-49.00116028642087, -23.882148765324786],
                  [-49.00459351395993, -23.883718393340327],
                  [-49.00416436051755, -23.887799337070025],
                  [-49.00244774674802, -23.884424719735485],
                  [-48.99944367265134, -23.881677873207426],
                  [-48.999014519208956, -23.87955883747498],
                  [-49.00013031815915, -23.877204312634777],
                  [-49.00047364091306, -23.873986392752105]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.04876940161516, -23.791318047183587],
                  [-49.04945604712297, -23.785427648776608],
                  [-49.05134432226946, -23.781107853634257],
                  [-49.052889274662036, -23.78322849827614],
                  [-49.052889274662036, -23.787783840172345],
                  [-49.05331842810442, -23.794695088531665]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.136849627644054, -23.78916122228426],
                  [-49.13487552180909, -23.787590449410946],
                  [-49.13513301387452, -23.78578403714004],
                  [-49.136077151447765, -23.787197753226625]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.83227679646183, -24.002295426632482],
                  [-49.83116099751163, -24.000648830522255],
                  [-49.83141848957706, -23.998453336267424],
                  [-49.833049272658116, -24.001589745165244]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.9361619896413, -24.19829825598464],
                  [-49.9390802330495, -24.197985099830024],
                  [-49.937277788591494, -24.200255464524542]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.82908066070625, -24.707102891700305],
                  [-49.843500216370316, -24.710845560359434],
                  [-49.84461601532051, -24.714977959648117],
                  [-49.85242660797188, -24.711001502445587],
                  [-49.85242660797188, -24.713730457335867],
                  [-49.84521683013985, -24.71677122231971],
                  [-49.82933815277168, -24.711079473415406]]]),
            {
              "reference": 11,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.94368035047712, -24.74641908639136],
                  [-49.94385201185408, -24.741975925416988],
                  [-49.94204956739607, -24.73932554326209],
                  [-49.937929694349194, -24.737922376897014],
                  [-49.937157218152905, -24.73612941905617],
                  [-49.941362921888256, -24.7384680545871],
                  [-49.945396964246655, -24.740416883932586],
                  [-49.94694191663923, -24.743846749392933]]]),
            {
              "reference": 11,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.97881911945988, -24.78072287082538],
                  [-49.97881911945988, -24.77090364588737],
                  [-49.981909024245034, -24.769968441101764],
                  [-49.9882604951923, -24.77698230529082],
                  [-49.98345397663761, -24.778462959294345],
                  [-49.98147987080265, -24.77970981212416]]]),
            {
              "reference": 11,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.084811841594025, -24.754266574985497],
                  [-50.07897535477762, -24.757306349036053],
                  [-50.08172193680887, -24.75278563248277]]]),
            {
              "reference": 11,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.79330865820404, -24.51605457197791],
                  [-49.79777185400482, -24.513399394642253],
                  [-49.79725686987396, -24.510275584763257],
                  [-49.7963985629892, -24.50324672862167],
                  [-49.79880182226654, -24.507307893450406],
                  [-49.79948846777435, -24.512930828111184],
                  [-49.79554025610443, -24.519178238176313]]]),
            {
              "reference": 11,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.78266565283295, -24.559778827595352],
                  [-49.773224277100525, -24.55618776667013],
                  [-49.77030603369232, -24.55322116051094],
                  [-49.7799190708017, -24.556343901892404]]]),
            {
              "reference": 11,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.58180002751349, -24.616387016875077],
                  [-49.581370874071105, -24.620834655702556],
                  [-49.579139276170714, -24.620444518276],
                  [-49.57931093754767, -24.616152926238726]]]),
            {
              "reference": 11,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.70596624529592, -24.74972360182215],
                  [-49.70064474261037, -24.74847644792991],
                  [-49.704077970149434, -24.74691748796678],
                  [-49.706309568049825, -24.748320552813478]]]),
            {
              "reference": 11,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.90983448140008, -24.94001531845717],
                  [-49.91258106343133, -24.941416195676478],
                  [-49.914040185135434, -24.94631914049991],
                  [-49.91215190998895, -24.94343965687174],
                  [-49.90983448140008, -24.941649673664404]]]),
            {
              "reference": 11,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.92849622346085, -24.955307542086686],
                  [-49.92918286896866, -24.953751186406315],
                  [-49.9312428054921, -24.955463176572692],
                  [-49.9312428054921, -24.957175142934293]]]),
            {
              "reference": 11,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.59803482132339, -25.611291001619183],
                  [-49.595631562046044, -25.614077282623896],
                  [-49.58876510696792, -25.61624434516281],
                  [-49.59254165726089, -25.611291001619183]]]),
            {
              "reference": 11,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.684723816684716, -25.599371177487004],
                  [-49.68420883255386, -25.59627492486099],
                  [-49.6891870124855, -25.597668248462348],
                  [-49.68867202835464, -25.600764465016145]]]),
            {
              "reference": 11,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.54680955330044, -25.529567542766966],
                  [-49.547238706742824, -25.536537879608346],
                  [-49.54466378608853, -25.53452426835039],
                  [-49.54380547920376, -25.530729293702823]]]),
            {
              "reference": 11,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.0844045347367, -25.283424787996783],
                  [-50.07607895795447, -25.26821254176474],
                  [-50.080027169624394, -25.2688334871035],
                  [-50.08818108502967, -25.281484556585575]]]),
            {
              "reference": 11,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.273237906655645, -25.232017033243714],
                  [-50.27066298600135, -25.240091480604942],
                  [-50.26877471085486, -25.234035695363854]]]),
            {
              "reference": 11,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.379809871094174, -25.124243999015277],
                  [-50.370540156738706, -25.122068094590176],
                  [-50.370540156738706, -25.116939023709737],
                  [-50.38289977587933, -25.121290976476352]]]),
            {
              "reference": 11,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.38674371475641, -24.86742008036821],
                  [-50.38107888931696, -24.86897752552803],
                  [-50.382452180332585, -24.866641350429845],
                  [-50.38588540787165, -24.865551120274937]]]),
            {
              "reference": 11,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.34039514297907, -24.844990694782954],
                  [-50.337991883701726, -24.84576956105176],
                  [-50.327005555576726, -24.8465484224181],
                  [-50.33507364029352, -24.8448349209409],
                  [-50.34056680435602, -24.843432947538435]]]),
            {
              "reference": 11,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.95653329224186, -24.759910660013603],
                  [-49.95618996948795, -24.756793007412274],
                  [-49.962369779058264, -24.760222420970685]]]),
            {
              "reference": 11,
              "system:index": "25"
            })]),
    campo = /* color: #bf04c2 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.23440478745647, -24.56075727561832],
                  [-50.218268618022876, -24.580428065202007],
                  [-50.21758197251506, -24.57012470336836]]]),
            {
              "reference": 12,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.25328753892131, -24.560132755545293],
                  [-50.25466082993694, -24.568875753451003],
                  [-50.24985431138225, -24.567626791086848]]]),
            {
              "reference": 12,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.05734841973843, -24.478980073478386],
                  [-50.052541901183744, -24.48382315089921],
                  [-50.0527135625607, -24.478823842071105]]]),
            {
              "reference": 12,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.09236734063687, -24.447261122477617],
                  [-50.095457245422025, -24.44522958747712],
                  [-50.096487213683744, -24.449448892779525]]]),
            {
              "reference": 12,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.0061933294064, -24.43335226611199],
                  [-50.00224511773648, -24.4371031200522],
                  [-49.99864022882046, -24.43975990742093],
                  [-49.998811890197416, -24.438040816104266],
                  [-50.004305054259916, -24.43397741618303]]]),
            {
              "reference": 12,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.0252477422482, -24.421942733028356],
                  [-50.02644937188687, -24.419754485472772],
                  [-50.027307678771635, -24.422411638281726]]]),
            {
              "reference": 12,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.15700732624318, -24.56180347331585],
                  [-50.15760814106252, -24.564535689255212],
                  [-50.15477572834279, -24.562818303330527]]]),
            {
              "reference": 12,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.161070330704135, -24.537118394588727],
                  [-50.15892456349222, -24.53946075854635],
                  [-50.15677879628031, -24.537274553546]]]),
            {
              "reference": 12,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.18122396749958, -24.391685314678753],
                  [-49.1825972585152, -24.387620422287018],
                  [-49.18465719503864, -24.3926233481998]]]),
            {
              "reference": 12,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.19994912476139, -24.672742829178297],
                  [-50.196515897222326, -24.68210187029035],
                  [-50.19342599243717, -24.678670303442676],
                  [-50.19548592896061, -24.674302718141455]]]),
            {
              "reference": 12,
              "system:index": "9"
            })]);
            
// --- 1. GENERAL CONFIGURATIONS AND PATHS ---

// Unique identifier for the specific geographic region being processed
var regiaoID = 'reg_28';

// Manual definition of a specific year, used as a reference point for individual operations
var ano = 2020; 

// Base directory path for saving the resulting sample assets in the MapBiomas repository
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Import of auxiliary feature collections representing regional boundaries
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Filter the master collection to obtain the specific geometry of region 'reg_28'
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

    // Define the specific subset of band names to be used as features for the sampling process for 'reg_28'
    var bandNames = ee.List([
      'red_median',	'green_min',	'ndwi_median',	'evi2_median_dry',	'swir2_max',	'savi_median',	'green_max',	'blue_max',	'swir2_median',	
      'gcvi_median',	'swir2_amp',	'cai_median',	'hallcover_median',	'red_median_wet',	'gvs_stdDev',	'cai_median_dry',	'green_median_wet',	
      'nir_median_wet',	'green_median',	'gcvi_stdDev',	'evi2_min',	'cai_median_wet',	'ndvi_median_dry',	'swir2_median_wet',	'cai_max',	
      'ndvi_stdDev',	'evi2_stdDev',	'gcvi_median_dry',	'ndwi_amp',	'cai_min',	'swir2_median_dry',	'ndwi_max',	'evi2_median',	
      'ndwi_min',	'gcvi_min',	'gcvi_max',	'gvs_median',	'swir2_min',	'red_median_dry',	'ndvi_min',	'savi_max',	'red_min',	'red_stdDev',	
      'savi_median_wet',	'ndwi_median_wet',	'gcvi_median_wet',	'wefi_max',	'hallheigth_stdDev',	'savi_min',	'savi_median_dry',	'ndvi_median',	
      'ndvi_median_wet',	'fns_median_dry',	'green_median_texture',	'blue_median_wet',	'nir_min',	'green_median_dry',	'latitude', 'longitude', 'slope',
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
      {variable: typeof varzea  !== 'undefined' ? varzea  : null, number: 1000, ref: 11, name: 'varzea'},
      {variable: typeof campo   !== 'undefined' ? campo   : null, number: 1000, ref: 12, name: 'campo'},
      {variable: typeof agro    !== 'undefined' ? agro    : null, number: 0, ref: 21, name: 'agro'},
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
    // Function designed to extract raster pixel values using spatial geometries for region 'reg_28'
    var getTrainingSamples = function(classObj) {
      // Filter the class geometries by the current regional limit ('reg_28')
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
    // Iterate through active classes to collect samples for the specific year in region 'reg_28'
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

  // Export the final multi-year batch collection for 'reg_28' as an Earth Engine Asset
  Export.table.toAsset({
    collection: amostras,
    description: 'amostras_complementares_'+batch+'_'+regiaoID,
    assetId: dirout + 'amostras_complementares_'+batch+'_'+regiaoID,
    overwrite: true
  });

} 

// Print the names of classes that were successfully processed to the console for verification in 'reg_28'
print('Classes processadas:', classesAtivas.map(function(i){return i.name}));