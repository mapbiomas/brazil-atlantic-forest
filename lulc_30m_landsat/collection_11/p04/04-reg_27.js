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

var sav_compl = /* color: #dd31f1 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.542293411016466, -9.093729930761459],
                  [-36.5495031888485, -9.100171016579706],
                  [-36.539546828985216, -9.099493013006558]]]),
            {
              "reference": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.7692297513485, -9.135086461181396],
                  [-36.768543105840685, -9.126951128840743],
                  [-36.77643952918053, -9.131696761936434]]]),
            {
              "reference": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.75549684119225, -9.04524857158561],
                  [-36.75687013220787, -9.039484618311516],
                  [-36.758586745977404, -9.04389235558822]]]),
            {
              "reference": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.84528705690801, -9.2455249144594],
                  [-36.84631702516973, -9.253657523357504],
                  [-36.83704731081426, -9.247896944805891]]]),
            {
              "reference": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.63929340456426, -9.33226302295747],
                  [-36.64409992311895, -9.326164952560125],
                  [-36.65130970095098, -9.3288752192331]]]),
            {
              "reference": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.44531604860723, -9.327181305030134],
                  [-36.43982288454473, -9.316001265068095],
                  [-36.45286914919317, -9.318372818615774]]]),
            {
              "reference": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.49406787966192, -9.25636835120499],
                  [-36.49132129763067, -9.246202639046874],
                  [-36.49372455690801, -9.2455249144594]]]),
            {
              "reference": 4,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.649978954633, -8.932807324290991],
                  [-36.65100892098237, -8.940947042151492],
                  [-36.64482908647956, -8.938233817909268]]]),
            {
              "reference": 4,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.54629547975957, -8.973843213529255],
                  [-36.548698739036915, -8.979608213913336],
                  [-36.54560883425176, -8.981642898049937]]]),
            {
              "reference": 4,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.50681336306035, -8.860898629476845],
                  [-36.50681336306035, -8.867343853106352],
                  [-36.5040667810291, -8.865986973318307]]]),
            {
              "reference": 4,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.34579499147832, -8.908387093746228],
                  [-36.34613831423223, -8.905673633091542],
                  [-36.351974801048634, -8.902960152300116]]]),
            {
              "reference": 4,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.30390961550176, -8.849364789347199],
                  [-36.298759774193165, -8.843936974762176],
                  [-36.30287964724004, -8.841562280720135]]]),
            {
              "reference": 4,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.40105628298224, -7.4020667256655335],
                  [-35.40483283327521, -7.408194993301787],
                  [-35.40071296022833, -7.409897274745585]]]),
            {
              "reference": 4,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.50748633669318, -7.45245216932316],
                  [-35.50920295046271, -7.458239316156336],
                  [-35.50370978640021, -7.457558479322955]]]),
            {
              "reference": 4,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.568941109642395, -7.467770157019028],
                  [-35.57031440065802, -7.46232355134701],
                  [-35.57374762819708, -7.463004380765856]]]),
            {
              "reference": 4,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.38698005007208, -7.404108727343157],
                  [-35.379426949486145, -7.399001796234477],
                  [-35.385950081810364, -7.39593760919291]]]),
            {
              "reference": 4,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.369470589622864, -7.401725500184486],
                  [-35.37359046266974, -7.4020659619956914],
                  [-35.36912726686896, -7.406151483226297]]]),
            {
              "reference": 4,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.42474555300177, -7.369380431372007],
                  [-35.42131232546271, -7.363932608176164],
                  [-35.42955207155646, -7.366997016964273]]]),
            {
              "reference": 4,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.21051215456427, -7.344864700118731],
                  [-35.21428870485724, -7.337033000788917],
                  [-35.2177219323963, -7.339076066082829]]]),
            {
              "reference": 4,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.369470589622864, -7.357803727063378],
                  [-35.36981391237677, -7.3533772602724445],
                  [-35.37256049440802, -7.356101245060482]]]),
            {
              "reference": 4,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.0928400346146, -7.549517445665339],
                  [-35.09198172772984, -7.545433265688],
                  [-35.09592993939976, -7.54526309068527]]]),
            {
              "reference": 4,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.05970938886265, -7.532499774779926],
                  [-35.05902274335484, -7.534541930605701],
                  [-35.05541785443882, -7.535052468058]]]),
            {
              "reference": 4,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.100442203215835, -7.546636940763504],
                  [-35.1038754307549, -7.551401800388577],
                  [-35.09700897567677, -7.55480523939037]]]),
            {
              "reference": 4,
              "system:index": "22"
            })]);
            
// Region ID.
var regiaoID = 'reg_27';
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
var batch = '6'

// Import palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'],gain: [0.08, 0.06, 0.2],gamma: 0.85};
var vis2 = {'bands': 'classification_'+anos,'min': 0,'max': 69,'palette': palettes.get('classification9')};
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
//var GEDI = ee.Image('users/potapovpeter/GEDI_V27/GEDI_SAM_v27').rename('GEDI').clip(limite);
var GEDI = ee.Image('users/potapovpeter/GEDI_V27/GEDI_SAM_v27').rename('GEDI').gte(7);

// Define visualization parameters for GEDI.
//var imageVisGEDI = {"min": 0,"max": 15,"palette":["c9f5f1","#ffbeee","#daffe0","#c0debf","08ff04","#037e07","0b240a"]};
var imageVisGEDI = {"min": 0,"max": 15,"palette":["c9f5f1","#ffbeee","#daffe0","#c0debf","08ff04","#037e07","0b240a"]};

// Add the GEDI layer to the map.
//Map.addLayer(GEDI, imageVisGEDI,'GEDI', false);
Map.addLayer(GEDI.clip(limite), {},'GEDI', false);
}

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
'green_median',	'red_median',	'red_median_wet',	'gcvi_min',	'green_min',	'savi_median',	'gcvi_max',	'gcvi_median',	
'evi2_max',	'savi_median_wet',	'gcvi_median_wet',	'green_median_dry',	'ndvi_max',	'ndwi_median_dry',	'evi2_min',	'nir_median',	
	'cai_min',	'swir1_min',	'savi_max',		'cai_median_wet',	'evi2_median',	'hallheigth_median_dry',	'swir1_median_dry',	
'red_max',	'green_median_wet',	'hallcover_median_dry',	'green_max',	'shade_median',	'swir1_median',	'cai_max',	'swir2_median',	
'hallheigth_median',	'hallheigth_min',	'red_min',	'gv_median',	'swir1_max',	'blue_median',	'hallcover_stdDev',	'red_median_dry',	
'cai_median',	'ndvi_median',	'nir_median_wet',	'cai_median_dry',	'ndvi_min',	'blue_max',	'savi_stdDev',	'ndwi_min',	'swir1_median_wet',	
'wefi_median',	'swir2_median_dry',	'hallcover_median',	'ndvi_median_wet',	'hallcover_median_wet',	'green_median_texture',	'evi2_median_wet',	
'savi_min',	'ndvi_median_dry',

'latitude','longitude','slope',

  ])

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
                           
  var flo      = complementares.filter(ee.Filter.eq('reference', 3)).sort('random').limit(1200)
  var sav      = complementares.filter(ee.Filter.eq('reference', 4)).sort('random').limit(2000)
  var reflo    = complementares.filter(ee.Filter.eq('reference', 9)).sort('random')
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random').limit(1200)
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random').limit(450)
  var agro     = complementares.filter(ee.Filter.eq('reference', 21)).sort('random').limit(400)
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


var amostraTotal =sav_compl
var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);
var training_sav = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 400, 'region': sav_compl.filterBounds(limite), 'scale': 30, 'seed': 1});

  // Merge training data.
  var training = BDflo.merge(BDreflo).merge(BDcampo)
                      //.merge(BDsav).merge(BDOutroNFlo)
                      //.merge(BDAflora)
                      .merge(BDagro).merge(BDnaoVeg)
                      .merge(BDagua)
                      // complementary samples
                      .merge(flo).merge(sav).merge(varzea).merge(herb).merge(agro)//.merge(training_sav);

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

// var reg21 = ee.Image('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/reg_21-RF85a25_v2')
// Map.addLayer(reg21, vis2, 'reg21_v2')  
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
  "region": limite,
  "overwrite":true
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
  "region": limite,
  "overwrite":true
}); 
//}
