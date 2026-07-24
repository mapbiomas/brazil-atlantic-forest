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

var aflora_compl = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.830641607642185, -18.83877702155599],
                  [-43.82557759702207, -18.840564134065],
                  [-43.83184323728086, -18.826754134069247],
                  [-43.83398900449277, -18.827241565160183]]]),
            {
              "reference": 12,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.726786474585545, -18.888890185818738],
                  [-43.72687230527402, -18.88263701095358],
                  [-43.73708615720273, -18.880769134219555]]]),
            {
              "reference": 12,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.877387766253925, -19.032489716055025],
                  [-42.87833190382717, -19.034274756799874],
                  [-42.87502742232082, -19.036790008920796]]]),
            {
              "reference": 12,
              "system:index": "2"
            })]),
    reflo_compl = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.3357729210498, -19.01270325987385],
                  [-43.33439963003418, -19.0146102342893],
                  [-43.330966402495115, -19.010917987408597]]]),
            {
              "reference": 9,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.90805656301765, -18.88227090872459],
                  [-42.910459822294996, -18.88227090872459],
                  [-42.91260558950691, -18.89031067966891]]]),
            {
              "reference": 9,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.90335167201076, -18.652678611896945],
                  [-42.90893062398486, -18.656988611880585],
                  [-42.908072323678944, -18.658614998517056],
                  [-42.90137753121261, -18.65495562464481],
                  [-42.90086260112821, -18.653898434320443]]]),
            {
              "reference": 9,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.681995972038614, -18.663532357919046],
                  [-42.68263970220219, -18.65588836809372],
                  [-42.68637333715092, -18.65657959410162]]]),
            {
              "reference": 9,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.9062450344737, -18.577102672268353],
                  [-42.909592431324285, -18.578770514368554],
                  [-42.90877703978376, -18.580926481194094]]]),
            {
              "reference": 9,
              "system:index": "4"
            })]),
    var_compl = 
    /* color: #0b4a8b */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.25839648597773, -18.38521750214949],
                  [-43.2581389939123, -18.383751401881035],
                  [-43.259168962174016, -18.384647353526674]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.252270645414654, -18.406852884593775],
                  [-43.252270645414654, -18.404755806232927],
                  [-43.25267834118492, -18.40489832693044]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.23352029562919, -18.37289370761],
                  [-43.23849847556083, -18.375174446238123],
                  [-43.23806932211845, -18.375744626183234],
                  [-43.23283365012138, -18.37387117071456]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.22133233786552, -18.37199769489879],
                  [-43.21609666586845, -18.3716718709409],
                  [-43.21609666586845, -18.37093876478578],
                  [-43.2217614913079, -18.371183133850284]]]),
            {
              "reference": 11,
              "system:index": "3"
            })]),
    sav_compl = /* color: #f42ee4 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.991173999022365, -15.951759426374585],
                  [-40.99254726735055, -15.959021431775472],
                  [-40.967141802234444, -15.962322256389506]]]),
            {
              "reference": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.03935994317347, -15.705352263995614],
                  [-41.04141987969691, -15.715928159116823],
                  [-41.03112019707972, -15.714606202258604]]]),
            {
              "reference": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.092577633912676, -16.17720760196213],
                  [-42.087856946046465, -16.17020074176081],
                  [-42.0979849672867, -16.160308280843115]]]),
            {
              "reference": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.107541063223955, -16.37259077840769],
                  [-42.11097429076302, -16.382472547474237],
                  [-42.08762834349739, -16.383131314267885]]]),
            {
              "reference": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.08091525266483, -16.054057967014376],
                  [-42.077825347879674, -16.061976215476644],
                  [-42.07542208860233, -16.05966675888027]]]),
            {
              "reference": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.714246551492955, -15.952742641819983],
                  [-41.71630648801639, -15.96990715613652],
                  [-41.70669345090702, -15.963965759931448]]]),
            {
              "reference": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.2485006584945, -16.143793840104205],
                  [-42.25193388603356, -16.15170850927443],
                  [-42.24678404472497, -16.150719192940684]]]),
            {
              "reference": 4,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.21485502861169, -16.0610006548205],
                  [-42.21622831962731, -16.066939163537203],
                  [-42.20970518730309, -16.064959680325046]]]),
            {
              "reference": 4,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.40848906181481, -16.053411816655526],
                  [-42.41260893486169, -16.066608765248546],
                  [-42.40745909355309, -16.06726858970494]]]),
            {
              "reference": 4,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.384456469041375, -16.03295481787859],
                  [-42.38308317802575, -16.042193722567625],
                  [-42.370723558885125, -16.033284786133798]]]),
            {
              "reference": 4,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.391948511803314, -16.028666179415776],
                  [-42.395381739342376, -16.03988503503368],
                  [-42.38611202498691, -16.03988503503368]]]),
            {
              "reference": 4,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.08742122908847, -16.02008662866563],
                  [-42.088794520104095, -16.02503641451411],
                  [-42.066821863854095, -16.017776686582504]]]),
            {
              "reference": 4,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.74596934938114, -15.33873846610891],
                  [-41.746655994888954, -15.34966425529537],
                  [-41.74150615358036, -15.340725015753609]]]),
            {
              "reference": 4,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.33355541628302, -17.174082354493095],
                  [-42.33183880251349, -17.16850602093614],
                  [-42.33870525759161, -17.173754339514552]]]),
            {
              "reference": 4,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.12721844118536, -17.167357931446425],
                  [-42.132883266624816, -17.159157085574886],
                  [-42.13803310793341, -17.16145335896058]]]),
            {
              "reference": 4,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.24101283997745, -16.360825879135334],
                  [-42.242901115123935, -16.36362593341894],
                  [-42.23122814149112, -16.36510829883265]]]),
            {
              "reference": 4,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.144539146129794, -16.341389101372442],
                  [-42.14814403504581, -16.337765081443617],
                  [-42.1529505536005, -16.34484833042771]]]),
            {
              "reference": 4,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.20256069153995, -16.437401099524465],
                  [-42.20427730530948, -16.43328491878962],
                  [-42.20650890320987, -16.435754637698263]]]),
            {
              "reference": 4,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.22453334778995, -16.418630607554288],
                  [-42.22384670228214, -16.422747098706726],
                  [-42.22110012025089, -16.421100512705205]]]),
            {
              "reference": 4,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.21146766881647, -16.455283663565325],
                  [-42.20992271642389, -16.451003228125376],
                  [-42.21284095983209, -16.451003228125376]]]),
            {
              "reference": 4,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.69479575820987, -15.237247252885316],
                  [-41.70080390640323, -15.227806315386443],
                  [-41.71470847793643, -15.237744132597202]]]),
            {
              "reference": 4,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.720599449430686, -15.283114921411999],
                  [-41.7102997668135, -15.276160001038996],
                  [-41.72626427487014, -15.27135765953533]]]),
            {
              "reference": 4,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.66633522615467, -15.938785905242431],
                  [-41.66418945894276, -15.93441171550856],
                  [-41.6706267605785, -15.93787806238487]]]),
            {
              "reference": 4,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.442085185546865, -15.680880844096043],
                  [-41.4383086352539, -15.66633634761171],
                  [-41.45547477294921, -15.67261705272498]]]),
            {
              "reference": 4,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.41908256103515, -15.744666039769875],
                  [-41.41324607421874, -15.741692044902027],
                  [-41.42251578857421, -15.737396197720386]]]),
            {
              "reference": 4,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.16433707763671, -15.73210887659273],
                  [-41.17189017822265, -15.728473763585068],
                  [-41.17978660156249, -15.736074380326375]]]),
            {
              "reference": 4,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.36930076171874, -15.639889156118928],
                  [-41.371704020996084, -15.632284955725162],
                  [-41.382690349121084, -15.641542205780079]]]),
            {
              "reference": 4,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.45616141845702, -15.541343329212847],
                  [-41.46165458251952, -15.532743130507274],
                  [-41.46714774658202, -15.539358699829437]]]),
            {
              "reference": 4,
              "system:index": "27"
            })]);

// Region ID.
var regiaoID = 'reg_23';
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
  var anos = [2000];
}

// Number of trees for the Random Forest classifier.  
// The number of trees is reduced to 10 if `coleta` is true.
var RFtrees = 100;
if (coleta) {var RFtrees = 10}

// Output version and parameters, output directory.
var versao_out = '4';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';
var batch = '5'

// Import palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'],gain: [0.08, 0.06, 0.2],gamma: 0.85};

// Load regions
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');
var limite = regioesCollection.filterMetadata('reg_id', "equals", regiaoID);

// Directory for training samples.
var dirsamples = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/'; 

// Load Collection 9 if `coleta` is true.
var remap_in =  [3,4,5,6,49,11,12,13,32,29,50,15,18,19,39,20,40,62,41,36,46,47,48,9,21,22,23,24,30,25,33,31];
var remap_out = [3,4,3,3, 3,11,12,12,12,12,50,21,21,21,21,21,21,21,21,21,21,21,21,9,21,22,22,22,22,22,33,33];

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
'swir1_median_dry',	'gcvi_max',	'green_median_wet',	'gcvi_amp',	'gcvi_median_dry',	'swir1_max',	'swir2_median',	'swir2_min',	
'cai_median_wet',	'green_min',	'red_median_wet',	'gcvi_median_wet',	'green_max',	'gcvi_median',	'blue_median',	'blue_median_wet',	
'green_median_dry',	'gcvi_stdDev',	'evi2_median',	'red_median_dry',	'cai_median',	'green_median_texture',	'red_median',	'hallcover_min',	
'hallheigth_median',	'hallcover_max',	'hallheigth_min',	'hallcover_median',	'savi_median',	'hallheigth_max',	'gv_min',	'evi2_median_wet',	
'nir_median_wet',	'nir_max',	'swir1_stdDev',	'nir_median',	'red_max',	'green_median',	'nir_min',	'gcvi_min',	'ndvi_median',	
'swir1_median',	'hallheigth_median_wet',	'red_min',	'evi2_min',	'cai_median_dry',	'swir2_median_dry',	'ndvi_median_wet',	'cai_min',	
'evi2_amp',	'swir2_median_wet',	'hallcover_median_wet',	/*'amp_ndfi_3anos',*/	'gv_median',	'blue_amp',	'soil_stdDev',	'ndwi_max',

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
                     
  var flo      = complementares.filter(ee.Filter.eq('reference', 3)).sort('random').limit(1000)
  var sav      = complementares.filter(ee.Filter.eq('reference', 4)).sort('random').limit(4000)
  var reflo    = complementares.filter(ee.Filter.eq('reference', 9)).sort('random')
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random')
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')//.limit(500)
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random')
  var agro     = complementares.filter(ee.Filter.eq('reference', 21)).sort('random').limit(500)
  var naoVeg   = complementares.filter(ee.Filter.eq('reference', 22)).sort('random')
  var aflora   = complementares.filter(ee.Filter.eq('reference', 29)).sort('random').limit(1000)
  var agua     = complementares.filter(ee.Filter.eq('reference', 33)).sort('random')

  // Remap rocky outcrop (aflora - class 29) to grassland (campo - class 12) reference values.
  var aflora12 = aflora.map(function(feature) {
    var refAflora = feature.get('reference');
    var refCampo = ee.Algorithms.If(ee.Algorithms.IsEqual(refAflora, 29), 12, refAflora);
    return feature.set('reference', refCampo);
  });
  aflora = aflora12;

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

var amostraTotal = aflora_compl.merge(reflo_compl).merge(var_compl).merge(sav_compl)

  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  var training_aflora = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 300, 'region': aflora_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_reflo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 400, 'region': reflo_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_var = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 400, 'region': var_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_sav = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 700, 'region': sav_compl.filterBounds(limite), 'scale': 30, 'seed': 1});                               
                                 
  // Merge training data.
  var training = BDflo.merge(BDreflo).merge(BDcampo)
                      //.merge(BDsav)//.merge(BDOutroNFlo)
                      .merge(BDaflora)
                      .merge(BDagro).merge(BDnaoVeg)
                      .merge(BDagua)
                      // complementary samples
                      .merge(flo).merge(sav).merge(agro).merge(aflora).merge(campo)
                      .merge(training_aflora)
                      .merge(training_reflo)
                      .merge(training_sav)
                      .merge(training_var);

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

//Map.setCenter(-42.1476, -16.1408, 12)

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

