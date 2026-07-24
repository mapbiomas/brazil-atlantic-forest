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

var sombra = 
    /* color: #0b4a8b */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.56854070431764, -16.461279252551243],
                  [-40.56939901120241, -16.462349313573117],
                  [-40.567682397432876, -16.463007809728296]]]),
            {
              "reference": 27,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.49077881933961, -16.490002880844187],
                  [-40.491379634158946, -16.488603768815473],
                  [-40.49198044897828, -16.489591378356156]]]),
            {
              "reference": 27,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.45811493008693, -16.431767212910643],
                  [-40.45880157559474, -16.432425812835334],
                  [-40.45811493008693, -16.432590462467648]]]),
            {
              "reference": 27,
              "system:index": "2"
            })]),
    var_compl = 
    /* color: #ff0000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.508785959027584, -16.74769030544517],
                  [-40.50578189654666, -16.749025912771422],
                  [-40.502262826703365, -16.749046435718657],
                  [-40.508785959027584, -16.74658073712781],
                  [-40.5129487474187, -16.748019065186302]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.54230283855375, -16.756936456777133],
                  [-40.5445344403095, -16.75611459344387],
                  [-40.54916930549461, -16.757758316561013]]]),
            {
              "reference": 11,
              "system:index": "1"
            })]),
    reflo_compl = 
    /* color: #00ffff */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.694959604416375, -17.361743403508637],
                  [-40.69491668907214, -17.357524463415004],
                  [-40.696461641464715, -17.358446084832153]]]),
            {
              "reference": 9,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.72917497371156, -17.363571359280673],
                  [-40.751748444780894, -17.365455495950105],
                  [-40.735268952593394, -17.373647169235593]]]),
            {
              "reference": 9,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.79647023908199, -17.458563290078242],
                  [-40.79595525495113, -17.451357986845565],
                  [-40.806083276191366, -17.45463315999822]]]),
            {
              "reference": 9,
              "system:index": "2"
            })]),
    sav_compl = 
    /* color: #f410d7 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.94721674705553, -16.65671269341346],
                  [-40.95064997459459, -16.648160668318287],
                  [-40.9623229482274, -16.652765652351967]]]),
            {
              "reference": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.776242015610215, -16.565910201857907],
                  [-40.76731562400865, -16.559328644535896],
                  [-40.77761530662584, -16.561303135340488]]]),
            {
              "reference": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.00764155174303, -16.598814613644723],
                  [-41.00764155174303, -16.590260007974944],
                  [-41.015194652328965, -16.591576125928576]]]),
            {
              "reference": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.96094965721178, -16.724457532281175],
                  [-40.963009593735215, -16.716566166296637],
                  [-40.96918940330553, -16.716566166296637]]]),
            {
              "reference": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.971249339828965, -16.76785419905582],
                  [-40.973995921860215, -16.75930715211805],
                  [-40.98360895896959, -16.75864967106254]]]),
            {
              "reference": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.77143549705553, -16.53563317234964],
                  [-40.773495433578965, -16.5415573120751],
                  [-40.76388239646959, -16.5402408522998]]]),
            {
              "reference": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.028927562485215, -16.6198704771401],
                  [-41.02137446189928, -16.610000826167816],
                  [-41.03030085350084, -16.60934283140037]]]),
            {
              "reference": 4,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.6107604482274, -16.670526691362998],
                  [-40.600460765610215, -16.676446673103854],
                  [-40.597714183578965, -16.671184476158608]]]),
            {
              "reference": 4,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.538767537348704, -16.655118331828852],
                  [-40.54288741039558, -16.663670046240114],
                  [-40.533274373286204, -16.66761686251093]]]),
            {
              "reference": 4,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.383211442917585, -16.644491946022193],
                  [-40.37977821537852, -16.639228870860713],
                  [-40.39351112553477, -16.63988676315846]]]),
            {
              "reference": 4,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.619959777343816, -17.28637200654291],
                  [-40.619959777343816, -17.27719294708996],
                  [-40.630259459961, -17.280471235127543]]]),
            {
              "reference": 4,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.784754699218816, -17.084654548767293],
                  [-40.78544134472663, -17.073496349379134],
                  [-40.79162115429694, -17.07415273252893]]]),
            {
              "reference": 4,
              "system:index": "11"
            })]);
            
// Region ID.
var regiaoID = 'reg_11';
// Flag to indicate whether to perform a data collection run.
var coleta = false; //true or false

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
  var anos = [2020];
}

// Number of trees for the Random Forest classifier.  
// The number of trees is reduced to 10 if `coleta` is true.
var RFtrees = 100;
if (coleta) {var RFtrees = 100}

// Output version and parameters, output directory.
var versao_out = '4';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';
var batch = '3'

// Import palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
var vis2 = {'bands': 'classification_'+anos,'min': 0,'max': 69,'palette': palettes.get('classification9')};
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

var img_col = ee.List([]);

// Define the list of regions and their last versions.
var lista_regs =[
                ['reg_10','2'],['reg_09','2'],['reg_01','2'],
                ['reg_02','2'],['reg_03','4'],
                ['reg_06','2'],['reg_07','2'],['reg_08','2'],
                /*['reg_11','3'],*/['reg_12','2'],['reg_13','2'],['reg_14','2'],['reg_15','2'],
                ['reg_16','3'],['reg_17','2'],['reg_18','2'],['reg_19','2'],['reg_20','3'],
                ['reg_27','3'],['reg_21','2'],
                ['reg_22','4'],['reg_23','4'],
                ['reg_25','2'],['reg_29','2'],
                ['reg_26','2'],['reg_28','2'],['reg_30','2'],
                ['reg_04','3']/*,['reg_05','2']*/,['reg_24','2']
                ];
  
// Define the seed and input version.
var seed = 1;
//var versao_in = '1';
var vis2 = {'bands': 'classification_'+anos,'min': 0,'max': 69,'palette': palettes.get('classification9')};
// Loop through the regions and add their CLASSIFICATION IMAGES to the list.
for (var i_reg=0;i_reg<lista_regs.length; i_reg++){
  // Get region ID and version.
  var regiaoList = lista_regs[i_reg];
  var regiaoID_list   = regiaoList[0];
  var version_reg   = regiaoList[1];
  
  //print(regiaoID_list);
  //print(version_reg);
  //if (regiaoID_list == 'reg_01') {var versao_in = '20'}
  //else {var versao_in = '1'}

  // Load the CLASSIFICATION IMAGE for the current region.
  var img = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/' + regiaoID_list+'-RF85a25_v'+version_reg);
  // Add the image to the list, applying a mask to only include non-zero values.
  img_col = img_col.add(img.selfMask());
}
print(img_col);

// Create an image collection from the list of images.
var mosaic = ee.ImageCollection.fromImages(img_col).mosaic();

// Mask the image to remove zero values.
var image = mosaic.mask(mosaic.neq(0));


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
// print(mosaicoTotal)
  // Add mosaic to the map if `coleta` is true.
  if (coleta) {    
    Map.addLayer(mosaicoTotal.clip(limite), visParMedian2, 'Img_Year_'+ano, false);
  }
  
  // Define bands to use for classification.
  var bandNames = ee.List([
'green_median_wet',	'gcvi_max',	'ndvi_median_wet',	'gcvi_min',	'cai_median_dry',	'ndvi_median',	'red_median',	
'evi2_max',	'red_median_wet',	'hallcover_min',	'gcvi_median',	'evi2_median',	'green_median',	'red_min',	
'ndvi_max',	'gcvi_median_wet',	'savi_median_wet',	'hallheigth_max',	'red_max',	'red_median_dry',	'cai_median',	
'ndwi_median_dry',	'cai_max',	'evi2_median_wet',	'evi2_median_dry',	'hallcover_median_wet',	'savi_max',	
'blue_median_dry',	'ndvi_median_dry',	'ndvi_min',	'cai_min',	'gcvi_median_dry',	'swir1_max',	'hallheigth_min',	
'savi_min',	'green_median_dry',	'hallcover_max',	'hallheigth_median_dry',	'savi_median',	'green_max',	
'fns_median_dry',	'wefi_median_wet',	'swir2_median',	'savi_median_dry',	'swir1_median_dry',	'wefi_median',	
'hallheigth_median_wet',	'wefi_max',	'cai_median_wet',	'gvs_stdDev',	'hallcover_median',	'nir_median',	
'blue_max',	'swir2_median_wet',	'evi2_min',	'ndwi_min',	'nir_min',

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

// print('BDflo   ', BDflo.size())
// print('BDsav   ', BDsav.size())
// print('BDreflo ', BDreflo.size())
// print('BDvarzea', BDvarzea.size())
// print('BDcampo ', BDcampo.size())
// print('BDherb  ', BDherb.size())
// print('BDagro  ', BDagro.size())
// print('BDnaoVeg', BDnaoVeg.size())
// print('BDaflora', BDaflora.size())
// print('BDagua  ', BDagua.size())

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
                                         
  var flo      = complementares.filter(ee.Filter.eq('reference',  3)).sort('random').limit(1200)  // flo   
  var sav      = complementares.filter(ee.Filter.eq('reference',  4)).sort('random').limit(2500)  // sav   
  // Map.addLayer(sav, {}, 'amostras savana')
  var reflo    = complementares.filter(ee.Filter.eq('reference',  9)).sort('random')              // reflo
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random').limit(1000)   // varzea
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')              // campo 
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random')              // herb  
  var agro     = complementares.filter(ee.Filter.eq('reference', 21)).sort('random').limit(3000)  // agro  
  var naoVeg   = complementares.filter(ee.Filter.eq('reference', 22)).sort('random')              // naoVeg
  var aflora   = complementares.filter(ee.Filter.eq('reference', 29)).sort('random').limit(800)   // aflora
  var agua     = complementares.filter(ee.Filter.eq('reference', 33)).sort('random')              // agua   

var v3 = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/reg_11-RF85a25_v3')
// Map.addLayer(v3, vis2, 'reg11_v3')
// print('COMP. flo   ', flo.size())
// print('COMP. sav   ', sav.size())
// print('COMP. reflo ', reflo.size())
// print('COMP. varzea', varzea.size())
// print('COMP. campo ', campo.size())
// print('COMP. herb  ', herb.size())
// print('COMP. agro  ', agro.size())
// print('COMP. naoVeg', naoVeg.size())
// print('COMP. aflora', aflora.size())
// print('COMP. agua  ', agua.size())

  // Remap rocky outcrop (aflora - class 29) to grassland (campo - class 12) reference values.
  var aflora12 = aflora.map(function(feature) {
    var refAflora = feature.get('reference');
    var refCampo = ee.Algorithms.If(ee.Algorithms.IsEqual(refAflora, 29), 12, refAflora);
    return feature.set('reference', refCampo);
  });
  aflora = aflora12;

var amostraTotal = sombra.merge(var_compl).merge(reflo_compl).merge(sav_compl)

  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  var training_sombra = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 300, 'region': sombra.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_var = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 50, 'region': var_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_reflo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 300, 'region': reflo_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_sav = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 450, 'region': sav_compl.filterBounds(limite), 'scale': 30, 'seed': 1});                               
  // Merge training data.
  var training = BDflo.merge(BDreflo).merge(BDcampo)//.merge(BDsav).merge(BDOutroNFlo).merge(BDAflora)
                      .merge(BDagro).merge(BDnaoVeg).merge(BDagua)
                      // complementary samples
                      .merge(flo).merge(sav)
                      .merge(varzea).merge(agro)
                      .merge(aflora)
                      // .merge(training_sav)
                      // .merge(training_sombra)
                      // .merge(training_reflo)
                      // .merge(training_var);

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
// Map.addLayer(image, vis2, 'image merged')
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
