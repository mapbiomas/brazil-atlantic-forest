/**
 * These scripts classify each region according to the list of most important bands (feature importance),
 * with stable samples, using Random Forest, with 100 trees.
 * 
 * In this step it is possible to change the balance of each class and collect additional samples.
 * In addition to the regions, there are two scripts that classify agricultural areas in the northeast (NE) and southeast (SE) of Brazil.
 * These data are used by the agriculture team (Remap) and then transformed into mosaic of uses (class 21) in the Atlantic Forest data.
 * 
 * This script has 7 Geometry imports, used as complementary samples:
 * aflora, flo, agro, sav, sombra, agua, campo
 * 
 * Data from scripts 03-10 e 03-20 are used as input.
 * The output data from each region, plus the agricultural areas will be used as an input in script 05-10.
 * 
 */ 

var sav_compl = /* color: #e438f3 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-38.11551317734474, -11.365222472204467],
                  [-38.11997637314552, -11.3763297431233],
                  [-38.11002001328224, -11.372290785620761]]]),
            {
              "reference": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-38.17369109456897, -11.310874326777776],
                  [-38.17781096761585, -11.320637142343823],
                  [-38.17197448079944, -11.31626074894496]]]),
            {
              "reference": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.8625228703823, -13.27405611374242],
                  [-39.86423948415183, -13.276395153735566],
                  [-39.85771635182761, -13.278734171197854]]]),
            {
              "reference": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.0053451360073, -13.284414548353146],
                  [-40.00980833180808, -13.284414548353146],
                  [-40.005410304839494, -13.291160598027313]]]),
            {
              "reference": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.15061964106983, -13.881592665889743],
                  [-40.151992932085456, -13.888258480753926],
                  [-40.144783154253425, -13.884925597284491]]]),
            {
              "reference": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-38.58734975521348, -11.675156183469062],
                  [-38.60520206157411, -11.689276671319337],
                  [-38.581856738050476, -11.68927667121098]]]),
            {
              "reference": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-38.64228122601611, -11.71617178720906],
                  [-38.649147681094234, -11.703397039279489],
                  [-38.65670078168017, -11.708103594039871]]]),
            {
              "reference": 4,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.86988340642209, -13.423819466629512],
                  [-39.87194334294553, -13.41647260850531],
                  [-39.88361631657834, -13.418476319376172]]]),
            {
              "reference": 4,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.94741638362379, -13.017655834563687],
                  [-39.95634277522535, -13.015648828842039],
                  [-39.959776002764414, -13.02501471646809]]]),
            {
              "reference": 4,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.96664245784254, -13.029028559908385],
                  [-39.97419555842848, -13.031035457229722],
                  [-39.97419555842848, -13.042407568012543]]]),
            {
              "reference": 4,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.20216186702223, -13.169471955346177],
                  [-40.201475221514414, -13.180169114079895],
                  [-40.19666870295973, -13.171477708216713]]]),
            {
              "reference": 4,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.21888549983473, -12.370236667630218],
                  [-39.21888549983473, -12.364870979447083],
                  [-39.226438600420664, -12.365541696495214]]]),
            {
              "reference": 4,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.26283081233473, -12.285043390792099],
                  [-39.25459106624098, -12.28101782730432],
                  [-39.26420410335035, -12.27766314403073]]]),
            {
              "reference": 4,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-37.161008912920664, -10.209011976373237],
                  [-37.1630688494441, -10.194820398464486],
                  [-37.169248659014414, -10.209011976373237]]]),
            {
              "reference": 4,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-37.63960593249302, -10.85046793799746],
                  [-37.635486059446144, -10.837654642334707],
                  [-37.64441245104771, -10.838329039999287]]]),
            {
              "reference": 4,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-37.60870688464146, -10.847770447688845],
                  [-37.60733359362583, -10.83428263121867],
                  [-37.613513403196144, -10.837654642334707]]]),
            {
              "reference": 4,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-37.61831992175083, -10.868675360598681],
                  [-37.60939353014927, -10.87609288106253],
                  [-37.61008017565708, -10.861932000174974]]]),
            {
              "reference": 4,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-37.98729692939879, -11.310328610634599],
                  [-37.9769972467816, -11.307635356435446],
                  [-37.98317705635191, -11.300902110197534]]]),
            {
              "reference": 4,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.98684580286359, -12.98767836286541],
                  [-39.99165232141828, -12.96760515142578],
                  [-39.99783213098859, -12.986340199201548]]]),
            {
              "reference": 4,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-37.08723821128705, -10.209211316914297],
                  [-37.0735053011308, -10.1902890843578],
                  [-37.085178274763614, -10.189613269549335]]]),
            {
              "reference": 4,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.47231560058593, -15.091066219410418],
                  [-41.468195727539054, -15.103993649915168],
                  [-41.461672595214836, -15.098690183874634]]]),
            {
              "reference": 4,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.92368583984374, -15.116257407617848],
                  [-40.92574577636718, -15.12454332903543],
                  [-40.923342517089836, -15.12719475549766],
                  [-40.91956596679687, -15.123880467237935]]]),
            {
              "reference": 4,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.58011894531249, -15.046311351612305],
                  [-41.57565574951171, -15.059904565728969],
                  [-41.56775932617187, -15.053273837925955]]]),
            {
              "reference": 4,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.32020918691377, -12.184404195756311],
                  [-39.33016554677705, -12.194471670303898],
                  [-39.326388996484084, -12.201518675054222]]]),
            {
              "reference": 4,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.07885329091768, -12.060207361727429],
                  [-39.07061354482393, -12.057857135488259],
                  [-39.07713667714815, -12.050134818585931]]]),
            {
              "reference": 4,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.21412245595674, -11.984654087282474],
                  [-39.21343581044893, -11.976929669787324],
                  [-39.22613875234346, -11.975922120780584]]]),
            {
              "reference": 4,
              "system:index": "25"
            })]);
            
// Region ID.
var regiaoID = 'reg_22';
// Flag to indicate whether to perform a data collection run.
var coleta = true; //true or false

// Visualization parameters for the classification probability image.
var imageVisParam = {"opacity":1,"bands":["prob_2020"],
                     "min":17.397846221923828,"max":96.64131927490234,
                     "palette":["ff1203","fffd03","39ff03","018610","02521a"]};

// Define a polygon geometry for the Atlantic Forest region.
var limite_MA = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-48.593359954293625, -30.678347823900353],
          [-47.275000579293625, -25.525376684152373],
          [-40.595313079293625, -23.284530667538736],
          [-33.915625579293625, -6.580343714417967],
          [-35.453711516793625, -4.217995607905081],
          [-44.198828704293625, -17.856203449528717],
          [-50.483008391793625, -17.52126295946964],
          [-55.712500579293625, -21.74193426005608],
          [-55.492774016793625, -29.72888025446976]]]);

// Define years to process.  The `if` statement allows for processing a single year if `coleta` is true.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
if (coleta) {
  var anos = [2000];
}

// Number of trees for the Random Forest classifier.  
// The number of trees is reduced to 10 if `coleta` is true.
var RFtrees = 100;
if (coleta) {var RFtrees = 10}

// Output version and parameters, output directory.
var versao_out = '5';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';
var batch = '5'

// Import palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
var vis2 = {'bands':'classification_'+anos,'min': 0,'max': 69,'palette': palettes.get('classification9')};
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'],gain: [0.08, 0.06, 0.2],gamma: 0.85};

// Load regions
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');
var limite = regioesCollection.filterMetadata('reg_id', "equals", regiaoID);


// Directory for training samples.
var dirsamples = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/'; 

// Load Collection 9 if `coleta` is true.
var remap_in =  [3,4,5,6,49,11,12,13,32,29,50,15,18,19,39,20,40,62,41,36,46,47,48, 9,21,22,23,24,30,25,33,31];
var remap_out = [3,4,3,3, 3,11,12,12,12,12,50,21,21,21,21,21,21,21,21,21,21,21,21, 9,21,22,22,22,22,22,33,33];

if (coleta) {
var colecao = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1')
                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos).clip(limite);
Map.addLayer(colecao.select('classification_'+anos), vis, 'LULC Col 10 (LandSat) '+ anos, false);
}

if (coleta) {
var colBruta = ee.Image('projects/mapbiomas-workspace/COLECAO_10/classificacao-ma/regioes/' + regiaoID + '-RF85a24_v3_seed_1')
                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos).clip(limite);
Map.addLayer(colBruta.select('classification_'+anos), vis, 'Bruta Col 10 (LandSat) '+ anos, false);
}
if (coleta) {
// Load GEDI data and clip to geometry.
var GEDI = ee.Image('users/potapovpeter/GEDI_V27/GEDI_SAM_v27').rename('GEDI').clip(limite);

// Define visualization parameters for GEDI.
var imageVisGEDI = {"min": 0,"max": 15,"palette":["c9f5f1","#ffbeee","#daffe0","#c0debf","08ff04","#037e07","0b240a"]};
// Add the GEDI layer to the map.
Map.addLayer(GEDI, imageVisGEDI,'GEDI', false);
}

var v3 = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/reg_22-RF85a25_v4')
Map.addLayer(v3, vis2, 'v3')
// Importa seu script de mosaico original
var cloudMos = require('users/yasmingelli-arcplan/MapBiomas_LANDSATcol11_MA:Mata_Atlantica_LANDSAT/passo00/00-01_Mosaicos_mensais_do_Google_v1');

// Dados de clusters para apoio à classificação
var clusterMos = ee.Image('projects/mapbiomas-workspace/COLECAO_10/MA_clusters_1985_2024_asset_salvo')
                .addBands('projects/nexgenmap/ANCILLARY/MATA_ATLANTICA/MOSAICS/MA_clusters_2025_asset_salvo');

var exportMos = ee.ImageCollection('projects/mapbiomas-mosaics/assets/LANDSAT/LULC/BRAZIL/MA-mosaics-32days-grids')

// Loop through each year.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
// Obtenção do mosaico para o ano específico
var projLandsat = ee.Projection('EPSG:4326').atScale(30);
var mosaicoTotal = cloudMos.getMosaic(ano, limite_MA)
                           .reproject({crs: projLandsat}); 

// Adiciona bandas auxiliares (clusters, amplitude NDFI, textura, etc)
mosaicoTotal = mosaicoTotal
  .addBands(exportMos.filter(ee.Filter.eq("year", ano)).mosaic())
  .addBands(clusterMos.select(
    ['clusters_'+ano, 'clusters_green_text_'+ano, 'amp_ndfi_3anos_'+ano, 'clusters_ndfi_median_'+ano],
    ['clusters', 'clusters_green_text', 'amp_ndfi_3anos', 'clusters_ndfi_median']
  ))
  .set('year', ano);
print(mosaicoTotal)
  // Add mosaic to the map if `coleta` is true.
  if (coleta) {    
    Map.addLayer(mosaicoTotal.clip(limite), visParMedian2, 'Img_Year_'+ano, false);
  }
  
  // Define bands to use for classification.
  var bandNames = ee.List([
'green_median',	'red_median',	'red_min',	'gcvi_median_wet',	'swir1_median_dry',	'gcvi_median_dry',	'red_median_dry',	'green_min',	
'hallcover_min',	'hallheigth_median_wet',	'gcvi_max',	'nir_median',	'green_max',	'swir1_median',	'hallcover_median_dry',	'swir2_max',		'evi2_median',	'red_median_wet',	'gcvi_median',	'green_median_wet',	'ndvi_max',	'gcvi_min',	'hallheigth_min',	
'hallcover_median',	'nir_min',	'swir1_max',	'nir_max',	'gvs_min',	'cai_max',	'swir2_median_dry',	'ndwi_max',	'green_median_dry',	
'hallheigth_median',	'blue_max',	'evi2_min',	'ndvi_median',	'evi2_max',	'shade_median_dry',	'swir1_median_wet',	'hallheigth_median_dry',	
'evi2_median_dry',	'savi_min',	'cai_median',	'swir2_min',	'gcvi_stdDev',	'cai_median_wet',	'hallcover_median_wet',	'nir_median_dry',	
'savi_median',	'ndwi_median',	'gvs_median',	'blue_min',	'swir2_median',	'swir1_min',	'hallcover_max',	'swir2_median_wet',	
'ndwi_median_wet',

'latitude','longitude','slope',

  ]);
  
  // Filter and mosaic the image collection.
  var mosaicoTotal = ee.ImageCollection(mosaicoTotal)
                       .filterMetadata('year', 'equals', ano)
                       .filterBounds(limite)
                       .mosaic()
                       .select(bandNames);
  //print('pos bandNames',mosaicoTotal)                    
                       
  // Load training data.
  var BDamostras = ee.FeatureCollection(dirsamples + 'pontos_train_b'+batch+'_v'+versao_pt+'_'+ano)
                     .filterMetadata('reg_id', 'equals', regiaoID);
                    
  // Filter training data by class.
  var BDflo      = BDamostras.filter(ee.Filter.eq('reference', 3))
  var BDsav      = BDamostras.filter(ee.Filter.eq('reference', 4))
  var BDreflo    = BDamostras.filter(ee.Filter.eq('reference', 9))
  var BDvarzea   = BDamostras.filter(ee.Filter.eq('reference', 11))
  var BDcampo    = BDamostras.filter(ee.Filter.eq('reference', 12))
  var BDherb     = BDamostras.filter(ee.Filter.eq('reference', 50))
  var BDagro     = BDamostras.filter(ee.Filter.eq('reference', 21))
  var BDnaoVeg   = BDamostras.filter(ee.Filter.eq('reference', 22))
  var BDaflora   = BDamostras.filter(ee.Filter.eq('reference', 12))
  var BDagua     = BDamostras.filter(ee.Filter.eq('reference', 33))

//print('BDflo   ', BDflo.size())
//print('BDsav   ', BDsav.size())
//print('BDreflo ', BDreflo.size())
//print('BDvarzea', BDvarzea.size())
//print('BDcampo ', BDcampo.size())
//print('BDherb  ', BDherb.size())
//print('BDagro  ', BDagro.size())
//print('BDnaoVeg', BDnaoVeg.size())
//print('BDaflora', BDaflora.size())
//print('BDagua  ', BDagua.size())

  // Complementary samples.
  // Merge complementary samples into a single feature collection.
var batch1 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b1_'+regiaoID)
var batch2 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b2_'+regiaoID)
var batch3 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b3_'+regiaoID)
var batch4 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b4_'+regiaoID)
var batch5 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b5_'+regiaoID)
var batch6 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b6_'+regiaoID)
var batch7 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b7_'+regiaoID)
var batch8 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b8_'+regiaoID)
  var complementares =  ee.FeatureCollection([batch1, batch2, batch3, batch4, batch5, batch6, batch7, batch8]).flatten()
                          .filter(ee.Filter.eq('ano', ano))
                          .filter(ee.Filter.eq('reg_id', regiaoID));
                                         
  var flo      = complementares.filter(ee.Filter.eq('reference', 3)).sort('random').limit(800)
  var sav      = complementares.filter(ee.Filter.eq('reference', 4)).sort('random').limit(1300)
  var reflo    = complementares.filter(ee.Filter.eq('reference', 9)).sort('random')
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random')
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random').limit(800)
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random')
  var agro     = complementares.filter(ee.Filter.eq('reference', 21)).sort('random').limit(600)
  var naoVeg   = complementares.filter(ee.Filter.eq('reference', 22)).sort('random')
  var aflora   = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')
  var agua     = complementares.filter(ee.Filter.eq('reference', 33)).sort('random')

//print('COMP. flo   ', flo.size())
//print('COMP. sav   ', sav.size())
//print('COMP. reflo ', reflo.size())
//print('COMP. varzea', varzea.size())
//print('COMP. campo ', campo.size())
//print('COMP. herb  ', herb.size())
//print('COMP. agro  ', agro.size())
//print('COMP. naoVeg', naoVeg.size())
//print('COMP. aflora', aflora.size())
//print('COMP. agua  ', agua.size())

//var amostraTotal = sav
var amostraTotal = sav_compl

  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  var training_sav = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 450, 'region': sav_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  //print('GI sav', sav_compl.size())

  // Merge training data.
  var training = BDflo.merge(BDreflo).merge(BDcampo)
                      //.merge(BDsav).merge(BDOutroNFlo)
                      //.merge(BDAflora)
                      .merge(BDagro).merge(BDnaoVeg)
                      .merge(BDagua)
                      // complementary samples
                      .merge(flo).merge(sav).merge(campo).merge(agro)//.merge(training_sav)//.merge(training_camp);
                      
                      
  // Train the classifier.
  var classifier = ee.Classifier.smileRandomForest({numberOfTrees: RFtrees, variablesPerSplit:1}).train(training, 'reference', bandNames);
  // Classify the image.
  var classified = mosaicoTotal.classify(classifier).mask(mosaicoTotal.select('green_median'));
  classified = classified.select(['classification'],['classification_'+ano]).clip(limite.geometry()).toInt8();
  // Get classification probabilities.
  var classifier_prob = classifier.setOutputMode('MULTIPROBABILITY');
  var classified_prob = mosaicoTotal.classify(classifier_prob);
  var max_prob = classified_prob.arrayReduce(ee.Reducer.max(), [0]);
  var img_max_prop = max_prob.arrayFlatten([['prob_'+ano]]).multiply(100);
  
// Add classified image to the map if `coleta` is true.
if (coleta) {  Map.addLayer(classified, vis, 'RF'+ano+"_"+regiaoID, false);}

  // Create a mosaic of classified images for all years.
  // Builds up multi-band images (classified85a24 and classified85a24_prob)
  // where each band represents the classification or probability results for a specific year
  if (i_ano == 0){  // first year
    var classified85a24 = classified;
    var classified85a24_prob = img_max_prop;
  }
  else { // other years
    classified85a24 = classified85a24.addBands(classified);
    classified85a24_prob = classified85a24_prob.addBands(img_max_prop);
  }
  
}

//print(classified85a21)
//print(classified85a24_prob)

// Set metadata for the classified image.
classified85a24 = classified85a24
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col);


//Map.setCenter(-44.1903, -21.9473, 10)

//if (coleta = false) {
// Export the classified image to an asset.
Export.image.toAsset({
  "image": classified85a24.toInt8(),
  "description":      regiaoID+'-'+nome_out+versao_out,
  "assetId": dirout + regiaoID+'-'+nome_out+versao_out,
  "scale": 30,
  "pyramidingPolicy": {
      '.default': 'mode'
  },
  "maxPixels": 1e13,
  "region": limite
});  
//}  

// Add probability image to the map.
Map.addLayer(classified85a24_prob, {"opacity":1,"bands":['prob_'+ano],
                                    "min":17.397846221924828,"max":96.64131927490234,
                                    "palette":["ff1203","fffd03","39ff03","018610","02521a"]}, 'Probabilidade', false);

// Set metadata for the probability image.
classified85a24_prob = classified85a24_prob
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col);

//if (coleta = false) {
// Export the probability image to an asset.
Export.image.toAsset({
  "image": classified85a24_prob.toInt8(),
  "description": regiaoID+'-'+nome_out+versao_out+'_prob',
  "assetId": dirout + regiaoID+'-'+nome_out+versao_out+'_prob',
  "scale": 30,
  "pyramidingPolicy": {
      '.default': 'mode'
  },
  "maxPixels": 1e13,
  "region": limite
});
//}