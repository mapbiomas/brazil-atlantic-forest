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

var campo_compl = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.9224704650252, -27.655675303977944],
                  [-50.92264212640215, -27.652178107846638],
                  [-50.93139685662676, -27.655675303977944]]]),
            {
              "reference": 12,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.712365556845185, -27.710530753651607],
                  [-50.71253721822214, -27.70825113152881],
                  [-50.720605302938935, -27.70946693592247]]]),
            {
              "reference": 12,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.387063819250564, -27.527467747958323],
                  [-50.3807123483033, -27.534165553196445],
                  [-50.37659247525642, -27.53203447761773]]]),
            {
              "reference": 12,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.02867264820882, -27.686925768915756],
                  [-50.0305609233553, -27.682973538967545],
                  [-50.036225748794756, -27.691485856490882]]]),
            {
              "reference": 12,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.92310090138265, -27.84596001863622],
                  [-49.91726441456624, -27.843076082044853],
                  [-49.92825074269124, -27.843379657928498]]]),
            {
              "reference": 12,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.49656529499837, -28.128559923341925],
                  [-49.49261708332845, -28.12507797060264],
                  [-49.49725194050618, -28.12401822340482]]]),
            {
              "reference": 12,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.777151436193925, -27.669201345738767],
                  [-49.78006967960213, -27.678018774027585],
                  [-49.77509149967049, -27.67619453690521]]]),
            {
              "reference": 12,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.233162303462436, -27.468800836072724],
                  [-50.23075904418509, -27.461489778880445],
                  [-50.23608054687064, -27.462099052167215]]]),
            {
              "reference": 12,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.80347960187372, -27.414123879793415],
                  [-50.799531390203796, -27.41275241408251],
                  [-50.80571119977411, -27.41153331915715]]]),
            {
              "reference": 12,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.713700701727234, -27.385929218876687],
                  [-50.71112578107294, -27.384252553086114],
                  [-50.714559008612, -27.381966149684843]]]),
            {
              "reference": 12,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.18178487373379, -27.153108110809953],
                  [-51.19002461982754, -27.150969693856457],
                  [-51.189166312942774, -27.154635526429583]]]),
            {
              "reference": 12,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.453419616726535, -27.18506367660189],
                  [-51.45530789187302, -27.176817631858825],
                  [-51.459427764919894, -27.184605578993445]]]),
            {
              "reference": 12,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.60362332156052, -27.217889105650045],
                  [-51.595726898220676, -27.214530668504594],
                  [-51.6051682739531, -27.211630118589675]]]),
            {
              "reference": 12,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.68827129141526, -27.386206632711392],
                  [-51.67951656119065, -27.385749363890657],
                  [-51.67977405325608, -27.380566851800964],
                  [-51.68964458243089, -27.381405215806904]]]),
            {
              "reference": 12,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.60227759569174, -27.351627277173684],
                  [-50.60227759569174, -27.341563783410503],
                  [-50.6166971513558, -27.349187726265814]]]),
            {
              "reference": 12,
              "system:index": "14"
            })]);
            
// Region ID.
var regiaoID = 'reg_08';
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
if (coleta) {var RFtrees = 50}

// Output version and parameters, output directory.
var versao_out = '3';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';
var batch = '2'

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
                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos)//.clip(limite);
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
print(mosaicoTotal)
  // Add mosaic to the map if `coleta` is true.
  if (coleta) {    
    Map.addLayer(mosaicoTotal.clip(limite), visParMedian2, 'Img_Year_'+ano, false);
  }
  
  // Define bands to use for classification.
  var bandNames = ee.List([
'green_median_wet',	'gcvi_max',	'green_median',	'ndwi_median_dry',	'ndwi_median_wet',	'evi2_median_wet',	
'blue_median_wet',	'hallcover_median_dry',	'green_max',	'evi2_median_dry',	'cai_max',	'swir1_median_dry',	
'hallheigth_median',	'gcvi_median',	'nir_median_dry',	'swir1_median_wet',	'hallheigth_min',	'red_median',	
'gcvi_median_dry',	'evi2_amp',	'swir2_min',	'ndwi_median',	'swir2_max',	'swir1_median',	'savi_median',	
'savi_min',	'cai_median',	'cai_min',	'gcvi_amp',	'ndvi_median',	'ndvi_min',	'hallcover_min',	'red_median_wet',	
'wefi_max',	'green_median_dry',	'gv_stdDev',	'hallcover_median_wet',	'blue_median_dry',	'green_min',	'ndwi_min',	
'ndvi_amp',	'red_min',	'cai_median_dry',	'cai_median_wet',	'nir_median_wet',	'gcvi_median_wet',	'swir2_stdDev',	
'hallcover_median',	'evi2_max',	'swir1_max',	'swir2_median_dry',	'ndwi_max',	'nir_amp',	'wefi_amp',	
'ndvi_median_dry',	'ndfi_median',	'swir1_min',

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
                                         
  var flo      = complementares.filter(ee.Filter.eq('reference',  3)).sort('random')              // flo   
  var sav      = complementares.filter(ee.Filter.eq('reference',  4)).sort('random')              // sav   
  var reflo    = complementares.filter(ee.Filter.eq('reference',  9)).sort('random').limit(500)   // reflo 
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random')              // varzea
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')//.limit(800)   // campo 
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random')              // herb  
  var agro     = complementares.filter(ee.Filter.eq('reference', 21)).sort('random').limit(800)   // agro  
  var naoVeg   = complementares.filter(ee.Filter.eq('reference', 22)).sort('random')              // naoVeg
  var aflora   = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')              // aflora
  var agua     = complementares.filter(ee.Filter.eq('reference', 33)).sort('random')              // agua   

//print('COMP. flo   ', flo.size())
//print('COMP. sav   ', sav.size())
//print('COMP. reflo ', reflo.size())
//print('COMP. varzea', varzea.size())
print('COMP. campo ', campo.size())
//print('COMP. herb  ', herb.size())
//print('COMP. agro  ', agro.size())
//print('COMP. naoVeg', naoVeg.size())
//print('COMP. aflora', aflora.size())
//print('COMP. agua  ', agua.size())
var amostraTotal = campo_compl

  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  var training_campo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 1200, 'region': campo_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  // Merge training data.
  var training = BDflo.merge(BDreflo).merge(BDcampo)//.merge(BDsav).merge(BDOutroNFlo).merge(BDAflora)
                      .merge(BDagro).merge(BDnaoVeg).merge(BDagua)
                      // complementary samples
                      .merge(reflo)
                      .merge(campo)
                      .merge(agro)
                      .merge(training_campo);

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
                ['reg_06','2'],['reg_07','2'],/*['reg_08','2'],*/
                ['reg_11','3'],['reg_12','2'],['reg_13','2'],['reg_14','2'],['reg_15','2'],
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
// Add classified image to the map if `coleta` is true.
if (coleta) {  Map.addLayer(classified, vis, 'RF'+ano+"_"+regiaoID, false);}
Map.addLayer(image, vis2, "merged")
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


//Map.setCenter(-53.26575, -26.35827, 11)

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
