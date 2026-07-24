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

var agro_compl = /* color: #00fff1 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.40975125246429, -8.842411071455563],
                  [-36.407347993186946, -8.836304659124362],
                  [-36.41524441652679, -8.839697122914377]]]),
            {
              "reference": 18,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.171038072003505, -8.459507915783272],
                  [-35.173784654034755, -8.454074478618365],
                  [-35.175501267804286, -8.458149563674509]]]),
            {
              "reference": 18,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.33532232194718, -8.328644135010066],
                  [-35.33669561296281, -8.324567690991836],
                  [-35.34218877702531, -8.327285325053902]]]),
            {
              "reference": 18,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.1440915480214, -8.226040769373519],
                  [-35.13928502946671, -8.23011823332182],
                  [-35.14065832048234, -8.224341813679585]]]),
            {
              "reference": 18,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.07920354753312, -8.064609904228172],
                  [-35.07714361100968, -8.058831096067259],
                  [-35.08195012956437, -8.060190823061086]]]),
            {
              "reference": 18,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-34.9964534959972, -7.853460644564456],
                  [-35.00297662832142, -7.846998643898189],
                  [-35.007096501368295, -7.849379392676098]]]),
            {
              "reference": 18,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.30114979104857, -7.7759776120094015],
                  [-35.29599994973998, -7.772235771717634],
                  [-35.30114979104857, -7.769854583255648]]]),
            {
              "reference": 18,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-34.99009937600951, -7.275301620969842],
                  [-34.994219249056385, -7.274961062135676],
                  [-34.994219249056385, -7.281091081602225]]]),
            {
              "reference": 18,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.00760883645873, -7.161348342957265],
                  [-35.00829548196654, -7.155216700714466],
                  [-35.013445323275135, -7.158623178801484]]]),
            {
              "reference": 18,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.12544458901104, -6.789496600677842],
                  [-35.12819117104229, -6.787110189067941],
                  [-35.13162439858135, -6.7898375156561945]]]),
            {
              "reference": 18,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.55647864794122, -5.5623201677405945],
                  [-35.54926887010919, -5.560953341471896],
                  [-35.55373206590997, -5.557877970761101]]]),
            {
              "reference": 18,
              "system:index": "10"
            })]),
    mosa_compl = /* color: #876fc2 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.51763257897053, -8.066984156276023],
                  [-35.519692515493965, -8.073782608439524],
                  [-35.515229319693184, -8.072083006122606]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-36.03500448990881, -8.045231158573188],
                  [-36.033287876139276, -8.041491760249526],
                  [-36.03912436295568, -8.041491760249526]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.83072745133459, -8.126469542243376],
                  [-35.828324192057245, -8.12239101834851],
                  [-35.83519064713537, -8.121031501174679]]]),
            {
              "reference": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.396568547875766, -6.9927314235847025],
                  [-35.38455894701384, -6.996800696494355],
                  [-35.38833549730681, -6.990326097346857]]]),
            {
              "reference": 21,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-35.888170511650074, -7.017171669881779],
                  [-35.893663675712574, -7.01035659754585],
                  [-35.899156839775074, -7.015808663393719]]]),
            {
              "reference": 21,
              "system:index": "4"
            })]);
            
// Region ID.
var regiaoID = 'agric_NE';
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

// Define the geometry for the region needing agriculture correction.
var agric_NE = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-35.66799570888529, -5.186646318560072],
          [-35.90969492763529, -6.8691244024268325],
          [-36.10744883388529, -8.371803124961009],
          [-36.70895029872902, -9.043742576158127],
          [-36.68502957012847, -9.308809509300037],
          [-36.4436249757405, -9.28129992017843],
          [-36.34674938486622, -8.899750598897096],
          [-35.48122813076029, -8.676022026819764],
          [-34.89208628505717, -8.340552752876322],
          [-34.97252314790597, -8.22811816013183],
          [-34.98801141655913, -8.057727642981407],
          [-34.94084356082082, -7.8093060155034],
          [-34.8566586940426, -7.6369687212239326],
          [-34.787056044821384, -7.62049175227953],
          [-34.75660770236852, -7.503277155332525],
          [-34.76246259696461, -7.255050550971928],
          [-34.887735202061364, -7.2160502625807945],
          [-34.93303564140051, -7.183759403876047],
          [-34.93267997205557, -7.1659081621721095],
          [-34.97626611638365, -7.156058198270739],
          [-34.99251634340583, -7.129890291747445],
          [-34.9185881066225, -7.108802160985567],
          [-34.86939034261591, -7.045800891829901],
          [-34.82935348313298, -6.904662186678003],
          [-34.85638071865092, -6.8323102772138835],
          [-34.93561681499501, -6.519076064207218],
          [-35.02161845069963, -6.370872950351048],
          [-34.99915321736858, -6.320098072181882],
          [-35.05495333360197, -6.252934207510511],
          [-35.0662989159249, -6.227808198926116],
          [-35.01208326916088, -6.113404410172602],
          [-35.06153287357494, -5.8149532385300615],
          [-35.31643320888529, -4.945891543819747]]]);

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
if (coleta) {var RFtrees = 10}

// Output version and parameters, output directory.
var versao_out = '1';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';

// Import palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'],gain: [0.08, 0.06, 0.2],gamma: 0.85};

// Load regions
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');
var limite = agric_NE;


// Directory for training samples.
var dirsamples = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/'; 

// Load Collection 9 if `coleta` is true.
var remap_in =  [3,4,5,6,49,11,12,13,32,29,50,15,18,19,39,20,40,62,41,36,46,47,48, 9,21,22,23,24,30,25,33,31];
var remap_out = [3,4,3,3, 3,11,12,12,12,12,50,15,18,18,18,18,18,18,18,18,18,18,18, 9,21,22,22,22,22,22,33,33];
if (coleta) {
// Load GEDI data and clip to geometry.
var GEDI = ee.Image('users/potapovpeter/GEDI_V27/GEDI_SAM_v27').rename('GEDI').clip(limite);

// Define visualization parameters for GEDI.
var imageVisGEDI = {"min": 0,"max": 15,"palette":["c9f5f1","#ffbeee","#daffe0","#c0debf","08ff04","#037e07","0b240a"]};
// Add the GEDI layer to the map.
Map.addLayer(GEDI, imageVisGEDI,'GEDI', false);
}

// Importa seu script de mosaico original
var cloudMos = require('users/yasmingelli-arcplan/MapBiomas_LANDSATcol11_MA:Mata_Atlantica_LANDSAT/passo00/00-01_Mosaicos_mensais_do_Google_v1');

// Dados de clusters para apoio à classificação
var clusterMos = ee.Image('projects/mapbiomas-workspace/COLECAO_10/MA_clusters_1985_2024_asset_salvo')
                .addBands('projects/nexgenmap/ANCILLARY/MATA_ATLANTICA/MOSAICS/MA_clusters_2025_asset_salvo');

// Loop through each year.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
// Obtenção do mosaico para o ano específico
var mosaicoTotal = cloudMos.getMosaic(ano, limite_MA); 

// Adiciona bandas auxiliares (clusters, amplitude NDFI, textura, etc)
mosaicoTotal = mosaicoTotal
  .addBands(clusterMos.select(
    ['clusters_'+ano, 'clusters_green_text_'+ano, 'amp_ndfi_3anos_'+ano, 'clusters_ndfi_median_'+ano, 'longitude','latitude'],
    ['clusters', 'clusters_green_text', 'amp_ndfi_3anos', 'clusters_ndfi_median', 'longitude','latitude']
  ))
  .set('year', ano);
print(mosaicoTotal)
  // Add mosaic to the map if `coleta` is true.
  if (coleta) {    
    Map.addLayer(mosaicoTotal.clip(limite), visParMedian2, 'Img_Year_'+ano, false);
  }
  
  // Define bands to use for classification. Using the list of most important bands (feature importance) for the reg_27
  var bandNames = ee.List([
'green_median',		'red_median',	'red_median_wet',	'gcvi_min',	'green_min',	'savi_median',	'gcvi_max',	'gcvi_median',	
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
  var BDamostras = ee.FeatureCollection(dirsamples + 'pontos_train_b5_v'+versao_pt+'_'+ano)
                     .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b6_v'+versao_pt+'_'+ano))
                     .filterBounds(limite);
                    
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
  var complementares = ee.FeatureCollection(dirsamples + 'amostras_comp_2020_v'+v_comp_in)
                     .filter(ee.Filter.eq('reg_id', regiaoID))
                     /*INSERIDO*/
                     //.merge(mosa_compl)
                     
                     print(complementares.aggregate_array('class_name').distinct())
                    // print(complementares)

  var num_agric = 1000;
  if (ano >= 1990) { num_agric = 1100 }
  if (ano >= 1995) { num_agric = 1200 }
  if (ano >= 2000) { num_agric = 1250 }
  if (ano >= 2005) { num_agric = 1300 }
  if (ano >= 2010) { num_agric = 1350 }
  if (ano >= 2015) { num_agric = 1400 }
  if (ano >= 2018) { num_agric = 1450 }
  if (ano >= 2020) { num_agric = 1500 }

    
  var flo      = complementares.filter(ee.Filter.eq('reference', 3)).sort('random')
  var sav      = complementares.filter(ee.Filter.eq('reference', 4)).sort('random')
  var reflo    = complementares.filter(ee.Filter.eq('reference', 9)).sort('random')
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random')
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random')
  var agro     = complementares.filter(ee.Filter.eq('reference', 18)).sort('random').limit(num_agric)
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

//var amostraTotal = agro
var amostraTotal = agro_compl

  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  var training_agr = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 600, 'region': agro_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  print('GI agro', agro_compl.size())
  
  // Merge training data.
  var training = BDflo.merge(BDagro).merge(BDnaoVeg)
                      .merge(BDagua)
                      // complementary samples
                      .merge(agro)
                      .merge(training_agr)

  // Train the classifier.
  var classifier = ee.Classifier.smileRandomForest({numberOfTrees: RFtrees, variablesPerSplit:1}).train(training, 'reference', bandNames);
  // Classify the image.
  var classified = mosaicoTotal.classify(classifier).mask(mosaicoTotal.select('green_median'));
  classified = classified.select(['classification'],['classification_'+ano]).clip(limite).toInt8();
  // Get classification probabilities.
  var classifier_prob = classifier.setOutputMode('MULTIPROBABILITY');
  var classified_prob = mosaicoTotal.classify(classifier_prob);
  var max_prob = classified_prob.arrayReduce(ee.Reducer.max(), [0]);
  var img_max_prop = max_prob.arrayFlatten([['prob_'+ano]]).multiply(100);
  
// Add classified image to the map if `coleta` is true.
if (coleta) {  Map.addLayer(classified, vis, 'RF'+ano+"_"+regiaoID, true);}


if (coleta) {
var colecao = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1')
                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos).clip(limite);
Map.addLayer(colecao.select('classification_'+anos), vis, 'LULC Col 10 (LandSat) '+ anos, false);
}

if (coleta) {
var colBruta = ee.Image('projects/mapbiomas-workspace/COLECAO_10/classificacao-ma/regioes/agric_NE-RF85a24_v2')
                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos)//.clip(limite);
Map.addLayer(colBruta.select('classification_'+anos), vis, 'Bruta Col 10 (LandSat) '+ anos, false);
}


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
