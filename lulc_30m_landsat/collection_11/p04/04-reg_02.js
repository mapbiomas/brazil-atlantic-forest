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

var camp_compl = /* color: #e73ced */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.970397155641514, -13.883369754639169],
                  [-39.969624679445225, -13.88903566605366],
                  [-39.966878097413975, -13.888619059638529]]]),
            {
              "reference": 12,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.955634277223545, -13.871287569329226],
                  [-39.958123367189366, -13.872954115067001],
                  [-39.95443264758487, -13.873870710119885]]]),
            {
              "reference": 12,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.98026184419611, -13.89320768775332],
                  [-39.97803024629572, -13.892207849103372],
                  [-39.98069099763849, -13.89129132654997]]]),
            {
              "reference": 12,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.9264460025213, -13.895207352106022],
                  [-39.92421440462091, -13.89320768775332],
                  [-39.92472938875177, -13.891874568594396]]]),
            {
              "reference": 12,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.96850303987482, -13.921534655029546],
                  [-39.96970466951349, -13.920201699051878],
                  [-39.97142128328302, -13.921368035952687]]]),
            {
              "reference": 12,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.04820208566831, -14.155301077912245],
                  [-40.049736309224826, -14.153594967978036],
                  [-40.05106668489621, -14.155415511656656]]]),
            {
              "reference": 12,
              "system:index": "5"
            })]),
    varzea_compl = /* color: #ed9d42 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-38.92657579669094, -15.786748792346755],
                  [-38.92726244219875, -15.79500794757491],
                  [-38.92331423052883, -15.796329381163561]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.08353240857046, -15.664815557121951],
                  [-39.08404738769712, -15.660022268368778],
                  [-39.089025519302126, -15.665807257998651]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.29174274320579, -15.601573877786002],
                  [-39.291571081828835, -15.60054052178205],
                  [-39.29423183317161, -15.600375184338517]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.20703401539154, -15.636912726032149],
                  [-39.207956695292665, -15.63850380971022],
                  [-39.206991100047304, -15.63860712640455]]]),
            {
              "reference": 11,
              "system:index": "3"
            })]),
    herb_compl = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-38.97710233356395, -15.600013400179549],
                  [-38.97899060871043, -15.615389239484923],
                  [-38.97555738117137, -15.615719890033027]]]),
            {
              "reference": 50,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-38.89762311603465, -15.792376023430286],
                  [-38.89642148639598, -15.798983191012534],
                  [-38.89350324298778, -15.798487660920758]]]),
            {
              "reference": 50,
              "system:index": "1"
            })]);

// Region ID.
var regiaoID = 'reg_02';
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
  var anos = [1990];
}

// Number of trees for the Random Forest classifier.  
// The number of trees is reduced to 10 if `coleta` is true.
var RFtrees = 100;
if (coleta) {var RFtrees = 100}

// Output version and parameters, output directory.
var versao_out = '3';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';
var batch = '1'

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
var colBruta = ee.Image('projects/mapbiomas-workspace/COLECAO_10/classificacao-ma/regioes/' + regiaoID + '-RF85a24_v4_seed_1')
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
'gcvi_median',	'gcvi_median_wet',	'gcvi_max',	'gcvi_median_dry',	'savi_median',	'gcvi_min',	'evi2_median_wet',
'green_median_dry',	'ndwi_median_wet',	'green_median',	'evi2_median',	'blue_median',	'savi_min',	'ndvi_max',
'ndvi_median_wet',	'ndvi_median',	'green_median_wet',	'red_median_wet',	'cai_min',	'ndwi_max',	'green_min',	'ndvi_median_dry',
'green_max',	'wefi_median_dry',	'cai_median_wet',	'hallcover_median_wet',	'swir2_max',	'hallheigth_median_dry',	
'savi_max',	'blue_max',	'swir2_median_wet',	'evi2_min',	'swir1_median',	'red_min',	'swir1_median_wet',	'gv_median',	
'nir_median_dry',	'swir2_median',	'blue_median_wet',	'ndwi_median_dry',	'hallheigth_median',	'ndwi_min',	'nir_min',	
'cai_median_dry',	'savi_median_wet',	'swir2_min',	'evi2_max',	'nir_median',	'shade_median',	'hallheigth_median_wet',
'hallcover_min',	'shade_median_dry',	'cai_median',	'swir1_max',	'swir1_min',	'wefi_median',	'hallheigth_min',

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
// print('BDvarzea', BDvarzea.size())
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
  var sav      = complementares.filter(ee.Filter.eq('reference', 4)).sort('random').limit(1000)
  var reflo    = complementares.filter(ee.Filter.eq('reference', 9)).sort('random')
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random').limit(800)
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random').limit(200)
  var agro     = complementares.filter(ee.Filter.eq('reference', 21)).sort('random').limit(500)
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

//var amostraTotal = camp
var amostraTotal = camp_compl.merge(varzea_compl).merge(herb_compl)

  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  var training_camp = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 400, 'region': camp_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_varzea = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 600, 'region': varzea_compl.filterBounds(limite), 'scale': 30, 'seed': 1});                                
  var training_herb = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 200, 'region': herb_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
                                 
  // print('GI camp', camp_compl.size())


  // Merge training data.
  var training = BDflo.merge(BDreflo).merge(BDcampo)//.merge(BDsav).merge(BDOutroNFlo).merge(BDAflora)
                      .merge(BDagro).merge(BDnaoVeg).merge(BDagua)
                      // complementary samples
                      .merge(flo).merge(sav)
                      .merge(varzea).merge(herb).merge(agro).merge(training_varzea).merge(training_herb)//.merge(training_camp);

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

var img_col = ee.List([]);
// Define the list of regions and their last versions.
var lista_regs =[
                ['reg_10','2'],['reg_09','2'],['reg_01','2'],
                ['reg_02','2'],['reg_03','4'],
                ['reg_06','2'],['reg_07','2'],/*['reg_08','3'],*/
                ['reg_11','4'],['reg_12','2'],['reg_13','2'],['reg_14','2'],['reg_15','2'],
                ['reg_16','3'],['reg_17','2'],['reg_18','2'],['reg_19','2'],['reg_20','3'],
                ['reg_27','4'],['reg_21','2'],
                ['reg_22','5'],['reg_23','4'],
                ['reg_25','2'],['reg_29','2'],
                ['reg_26','2'],['reg_28','2'],['reg_30','2'],
                ['reg_04','3'],['reg_05','2'],['reg_24','3']
                ];
  
// Define the seed and input version.
var seed = 1;
//var versao_in = '1';

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
// print(img_col);

// Create an image collection from the list of images.
var mosaic = ee.ImageCollection.fromImages(img_col).mosaic();

// Mask the image to remove zero values.
var image = mosaic.mask(mosaic.neq(0));
// print(image);

// Map.addLayer(image, vis2, 'merged')
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
