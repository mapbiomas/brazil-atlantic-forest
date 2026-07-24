

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

var agro_compl = 
    /* color: #e53def */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.32465548588633, -16.20510753626736],
                  [-39.32877535893321, -16.197854395943075],
                  [-39.339075041550394, -16.2011513109807]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.197368532221944, -19.448896828635633],
                  [-40.19672480205837, -19.453388552966235],
                  [-40.184880167048604, -19.45087967723018]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.21754049697338, -17.408815624028932],
                  [-40.21479391494213, -17.4166777736712],
                  [-40.20998739638744, -17.413401919106768]]]),
            {
              "reference": 21,
              "system:index": "2"
            })]),
    varzea_compl2 = 
    /* color: #f4861d */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.654946425285466, -20.758159269203144],
                  [-40.66009626659406, -20.766505971361845],
                  [-40.655976393547185, -20.768432067929663]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.68533048900617, -20.76538246002327],
                  [-40.68687544139875, -20.760727590681757],
                  [-40.68910703929914, -20.762172220648267]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.70285892572262, -20.75735673373077],
                  [-40.70337390985348, -20.76104862075652],
                  [-40.69719410028317, -20.757838289326006]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.64038248292179, -20.764754349308284],
                  [-40.64523191682071, -20.76784415313981],
                  [-40.64222784272403, -20.77097401987109]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.6697875019358, -20.754600065476772],
                  [-40.67047414744361, -20.741115640314423],
                  [-40.67562398875221, -20.739510271534467]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.676975447167145, -20.705055921109246],
                  [-40.6745721878898, -20.70216555695816],
                  [-40.68178196572183, -20.69831165237421]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.41313191079019, -20.535107925860814],
                  [-40.413818556298004, -20.548610629668907],
                  [-40.40866871498941, -20.548610629668907]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.4024889054191, -20.567255259678415],
                  [-40.408325392235504, -20.575933880051533],
                  [-40.40420551918863, -20.57721955962543]]]),
            {
              "reference": 11,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.413818556298004, -20.589432975315347],
                  [-40.416565138329254, -20.59682483080279],
                  [-40.41210194252847, -20.5955393164582]]]),
            {
              "reference": 11,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.73799493658543, -20.630410240457387],
                  [-40.736621645569805, -20.626875829247144],
                  [-40.73868158209324, -20.627357799245043]]]),
            {
              "reference": 11,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.765117434144024, -20.6689621192862],
                  [-40.767349032044415, -20.671853115993592],
                  [-40.76443078863621, -20.67105006687314]]]),
            {
              "reference": 11,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.855754641175274, -20.635551055689188],
                  [-40.85609796392918, -20.63667558586865],
                  [-40.853008059144024, -20.636032998212443]]]),
            {
              "reference": 11,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.75104120123387, -20.65868257424022],
                  [-40.750869539856915, -20.65691570739317],
                  [-40.75430276739598, -20.65675508211572]]]),
            {
              "reference": 11,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.36703463681246, -20.461841282186725],
                  [-40.36514636166598, -20.458544222777224],
                  [-40.367721282320275, -20.461037127882193]]]),
            {
              "reference": 11,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.337594710665, -20.394215078097275],
                  [-40.338023864107384, -20.39260605812272],
                  [-40.34042712338473, -20.393571472123284]]]),
            {
              "reference": 11,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.32820501127005, -20.366377752108455],
                  [-40.330093286416535, -20.365734029956812],
                  [-40.33077993192435, -20.37056188064867]]]),
            {
              "reference": 11,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.34190662694335, -20.387179532487746],
                  [-40.336756785634755, -20.384604974962645],
                  [-40.33984669041991, -20.382674028607212]]]),
            {
              "reference": 11,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.345078880920994, -20.177140026201265],
                  [-40.34645217193662, -20.18358495862618],
                  [-40.341302330628025, -20.182295993457867]]]),
            {
              "reference": 11,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.39097885139565, -19.53824162829355],
                  [-40.39209465034585, -19.53953583794377],
                  [-40.3882322693644, -19.53913139854254]]]),
            {
              "reference": 11,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.79304319788465, -19.152785387941133],
                  [-39.79304319788465, -19.168351956984477],
                  [-39.772443832650275, -19.163163263922634]]]),
            {
              "reference": 11,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.91457945276746, -19.194945303520907],
                  [-39.91011625696668, -19.19753916992484],
                  [-39.91011625696668, -19.194945303520907]]]),
            {
              "reference": 11,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.90463692446072, -19.30709415626749],
                  [-39.903950278952905, -19.313574313659718],
                  [-39.89159065981228, -19.310334267064682]]]),
            {
              "reference": 11,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.89914376039822, -19.28181908965125],
                  [-39.89708382387478, -19.270152358242782],
                  [-39.90189034242947, -19.272745037017472]]]),
            {
              "reference": 11,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.73108727236111, -19.33106945547264],
                  [-39.73280388613064, -19.336900753074232],
                  [-39.730400626853296, -19.335928884601437]]]),
            {
              "reference": 11,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.70138985414822, -19.291540731034033],
                  [-39.69915825624783, -19.295753263016728],
                  [-39.69950157900173, -19.293484990037086]]]),
            {
              "reference": 11,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.706782393111446, -19.332195515794275],
                  [-39.70369248832629, -19.33899862917005],
                  [-39.70386414970324, -19.335111170519625]]]),
            {
              "reference": 11,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.740425625228895, -19.11529192625723],
                  [-39.74179891624452, -19.102964552979174],
                  [-39.74935201683046, -19.10555986581808]]]),
            {
              "reference": 11,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.81252340354921, -18.953669118194764],
                  [-39.80565694847108, -18.977695802876717],
                  [-39.79947713890077, -18.972501137446763]]]),
            {
              "reference": 11,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.224833562634764, -18.02697195315464],
                  [-40.22637851502734, -18.028604292402616],
                  [-40.21522052552539, -18.032685074300574]]]),
            {
              "reference": 11,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.18123157288867, -18.03921412852476],
                  [-40.18792636658984, -18.041172797547535],
                  [-40.17968662049609, -18.04100957596191]]]),
            {
              "reference": 11,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.25367267396289, -18.007056196040168],
                  [-40.251784398816405, -18.010321228539237],
                  [-40.248007848523436, -18.010484478576387]]]),
            {
              "reference": 11,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.40223224427539, -17.509091308903063],
                  [-39.411845281384764, -17.513020262536596],
                  [-39.400858953259764, -17.517603934326885]]]),
            {
              "reference": 11,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.38849933411914, -17.25942598435105],
                  [-39.406352117322264, -17.243687873495407],
                  [-39.41321857240039, -17.25090134094304]]]),
            {
              "reference": 11,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.30950943839244, -17.302723362240737],
                  [-39.3239289940565, -17.298789885136678],
                  [-39.33697525870494, -17.308623420164956]]]),
            {
              "reference": 11,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.33242709483596, -16.557245234935245],
                  [-39.33792025889846, -16.56053607728307],
                  [-39.32693393077346, -16.56514316214421]]]),
            {
              "reference": 11,
              "system:index": "34"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.18749882906354, -16.014709325093975],
                  [-39.18887212007917, -16.034508265206288],
                  [-39.168959400352605, -16.018009284887203]]]),
            {
              "reference": 11,
              "system:index": "35"
            })]),
    camp_compl = 
    /* color: #2a52ff */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.89103718422769, -20.72737385886325],
                  [-40.8913805069816, -20.729782098745062],
                  [-40.887947279442535, -20.729782098745062]]]),
            {
              "reference": 12,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.49964924477457, -20.573523206564744],
                  [-40.50308247231363, -20.57480890644475],
                  [-40.49999256752847, -20.580273010109178]]]),
            {
              "reference": 12,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.14475269936441, -20.522086092082873],
                  [-41.146125990380035, -20.525944457501748],
                  [-41.14303608559488, -20.527552081050263]]]),
            {
              "reference": 12,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.09703083657144, -20.612731933349586],
                  [-41.09153767250894, -20.613053276697926],
                  [-41.09325428627847, -20.610803859024347]]]),
            {
              "reference": 12,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.335640150536285, -20.63104742203876],
                  [-41.338386732567535, -20.623335905871585],
                  [-41.3418199601066, -20.623978547140204]]]),
            {
              "reference": 12,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.98072412359715, -20.59899918589499],
                  [-40.98364236700535, -20.596588871983833],
                  [-40.98415735113621, -20.597874377478796]]]),
            {
              "reference": 12,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.083230152286525, -19.99981640467673],
                  [-41.08460344330215, -20.00239732939561],
                  [-41.073960437931056, -20.00175210218319]]]),
            {
              "reference": 12,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.10554613129043, -20.01691471726751],
                  [-41.10588945404434, -20.020140515972972],
                  [-41.101426258243556, -20.01885020443109]]]),
            {
              "reference": 12,
              "system:index": "7"
            })]),
    herb_compl = 
    /* color: #50df86 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.43888111733316, -20.58284618817169],
                  [-40.43682118080972, -20.5879886085111],
                  [-40.427551466454254, -20.57481080940439]]]),
            {
              "reference": 50,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.40660877846597, -20.563558420116458],
                  [-40.40351887368082, -20.560022458870623],
                  [-40.40592213295816, -20.55937954803165]]]),
            {
              "reference": 50,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.73297554750759, -19.403780887195538],
                  [-39.73846871157009, -19.42709441949002],
                  [-39.72610909242947, -19.40896196106737]]]),
            {
              "reference": 50,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.81870321311952, -18.918593551274412],
                  [-39.81664327659608, -18.93678004701647],
                  [-39.80977682151796, -18.920542199064023]]]),
            {
              "reference": 50,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-39.161906316541014, -17.70379968777106],
                  [-39.15778644349414, -17.68024957591623],
                  [-39.170146062634764, -17.684829006127053]]]),
            {
              "reference": 50,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-38.90940739839948, -15.937474713555444],
                  [-38.899794361290105, -15.9064404631041],
                  [-38.91146733492292, -15.907100816220085]]]),
            {
              "reference": 50,
              "system:index": "5"
            })]),
    flo_compl = 
    /* color: #f433e0 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.34241464483738, -20.595144340021395],
                  [-41.34001138556004, -20.59691192402988],
                  [-41.33932474005223, -20.596108479293658]]]),
            {
              "reference": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.39805324864745, -20.351534188868555],
                  [-41.39689453435302, -20.350528275129477],
                  [-41.39762409520507, -20.350246618108667]]]),
            {
              "reference": 3,
              "system:index": "1"
            })]),
    varzea_compl = /* color: #98ff00 */ee.FeatureCollection([]);

// Region ID.
var regiaoID = 'reg_03';
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
var anos = [
            1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025
            ];
if (coleta) {
  var anos = [2022];
}

// Number of trees for the Random Forest classifier.  
// The number of trees is reduced to 10 if `coleta` is true.
var RFtrees = 100;
if (coleta) {var RFtrees = 100}

// Output version and parameters, output directory.
var versao_out = '5';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';
var batch = '1'

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

var mos = require('users/marcosrosaUSP/MapBiomas_col10_MA:Mata_Atlantica_LANDSAT/passo01/old_mosaicos_mensais_do_Google_v3');

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
        ['clusters_'+ano, 'clusters_green_text_'+ano, 'amp_ndfi_3anos_'+ano, 'clusters_ndfi_median_'+ano,'latitude','longitude'],
        ['clusters', 'clusters_green_text', 'amp_ndfi_3anos', 'clusters_ndfi_median', 'latitude','longitude']
      ))
      .set('year', ano);
// print(mosaicoTotal)
  // Add mosaic to the map if `coleta` is true.
  if (coleta) {    
    Map.addLayer(mosaicoTotal.clip(limite), visParMedian2, 'Img_Year_'+ano, false);
  }
  
  // Define bands to use for classification.
  var bandNames = ee.List([
    
    // BAND IMPORTANCE MOSAICO MIN MAX PERCENTIL
// 'gcvi_median_wet', 'savi_median_wet',	'cai_min',	'savi_max',	'slope',	'gcvi_median',	'gcvi_max',	'longitude',	'gcvi_min',
// 'cai_median',	'savi_median',	'ndwi_median',	'swir2_median',	'latitude',	'ndwi_median_wet',	'red_max',	'evi2_median_wet',	
// 'red_median_wet',	'cai_median_wet',	'gv_stdDev',	'hallcover_median',	'green_min',	'swir2_median_wet',	'evi2_max',	'ndvi_max',	
// 'swir1_median',	'gvs_stdDev',	'cai_max',	'ndvi_median',	'wefi_median_wet',	'gcvi_median_dry',	'green_median',	'ndvi_median_wet',	
// 'blue_min',	'blue_median',	'red_median',	'blue_median_wet',	'hallheigth_median_dry',	'gcvi_amp',	'savi_min',	'blue_max',	'nir_max',	
// 'red_min',	'gcvi_stdDev',	'ndvi_min',	'savi_stdDev',	'blue_amp',	'hallheigth_median',	'hallcover_median_dry',	'ndwi_max',	'evi2_min',	
// 'shade_median_wet',	'gv_max',	'hallheigth_min',	'red_median_dry',	'hallheigth_median_wet',	'wefi_median',	'swir1_median_wet',	
// 'ndvi_median_dry',	'green_median_wet',


// BAND IMPORTANCE MOSAICO AMPLITUDE COM MIN MAX ABSOLUTO
// 'gcvi_median_wet',	'cai_min',	'longitude',	'savi_max',	'savi_median_wet',	'gcvi_median',	'hallcover_median',	'slope',	'ndvi_median',	
// 'gcvi_min',	'cai_median',	'gcvi_median_dry',	'cai_median_wet',	'blue_median',	'ndvi_max',	'green_median',	'gcvi_max',	'ndwi_median',	
// 'latitude',	'evi2_max',	'evi2_min',	'evi2_amp',	'swir2_median',	'gv_stdDev',	'green_median_wet',	'red_median_wet',	'gv_median',	'green_max',	
// 'cai_max',	'red_min',	'blue_min',	'ndwi_median_wet',	'wefi_stdDev',	'swir2_median_wet',	'hallheigth_median_dry',	'swir1_median_dry',	
// 'wefi_median_wet',	'red_median',	'evi2_median',	'hallheigth_median_wet',	'savi_median_dry',	'gcvi_amp',	'evi2_median_wet',	'swir1_median_wet',	
// 'ndvi_median_dry',	'evi2_stdDev',	'gcvi_stdDev',	'savi_median',	'blue_median_wet',	'shade_min',	'evi2_median_dry',	'hallcover_max',	
// 'shade_median_wet',	'swir1_min',	'shade_median',	'blue_max',	'swir1_median',	'gvs_stdDev',	'ndvi_min',	'wefi_median',

// BAND IMPORTANCE MOSAICO AMPLITUDE COM MIN MAX ABSOLUTO sem banda de min e max
'gcvi_median_wet','savi_median_wet',	'gcvi_median',	'hallcover_median',	'ndvi_median','cai_median',	'gcvi_median_dry',	
'cai_median_wet',	'blue_median','green_median','ndwi_median',	'evi2_amp',	'swir2_median',	'gv_stdDev',	'green_median_wet',	
'red_median_wet',	'gv_median',	'ndwi_median_wet',	'wefi_stdDev',	'swir2_median_wet',	'hallheigth_median_dry',	'swir1_median_dry',	
'wefi_median_wet',	'red_median',	'evi2_median',	'hallheigth_median_wet',	'savi_median_dry',	'gcvi_amp',	'evi2_median_wet',	'swir1_median_wet',	
'ndvi_median_dry',	'evi2_stdDev',	'gcvi_stdDev',	'savi_median',	'blue_median_wet','evi2_median_dry','shade_median_wet','shade_median',
'swir1_median',	'gvs_stdDev','wefi_median',	'npv_stdDev',	'cai_median_dry',	'hallcover_median_wet',	'red_stdDev','wefi_median_dry',	
'hallcover_min','swir2_median_dry','gv_median_dry','savi_stdDev',	'hallcover_median_dry','nir_amp',	'nir_median',	'hallheigth_median',	
'ndwi_median_dry',	'ndfi_median_dry',	'nir_median_dry',

'latitude','longitude','slope',

// BAND IMPORTANCE COL 10
  // 'blue_median','blue_median_wet','cai_median','cai_median_dry','cai_median_wet','evi2_median','evi2_median_dry',
  // 'evi2_median_wet','evi2_stdDev','fns_stdDev','gcvi_amp','gcvi_median','gcvi_median_dry','gcvi_median_wet',
  // 'gcvi_stdDev','green_median','green_median_dry','green_median_wet','gv_median_wet','gv_stdDev','gvs_stdDev',
  // 'hallcover_median_wet','hallcover_stdDev','hallheigth_median','latitude','longitude','ndfi_stdDev','ndvi_amp',
  // 'ndvi_median','ndvi_median_dry','ndvi_median_wet','ndvi_stdDev','ndwi_median','ndwi_median_dry','ndwi_median_wet',
  // 'ndwi_stdDev','nir_median','nir_median_dry','nir_median_wet','red_amp','red_median','red_median_dry',
  // 'red_median_wet','savi_median','savi_median_dry','savi_median_wet','savi_stdDev','sefi_stdDev','shade_median_dry',
  // 'shade_median_wet','slope','soil_stdDev','swir1_median_dry','swir1_median_wet','swir2_median','swir2_median_dry',
  // 'swir2_median_wet','wefi_median','wefi_median_dry','wefi_median_wet'

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
  var BDaflora   = BDamostras.filter(ee.Filter.eq('reference', 29))
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
                                         
  var flo      = complementares.filter(ee.Filter.eq('reference', 3)).sort('random').limit(250)
  var sav      = complementares.filter(ee.Filter.eq('reference', 4)).sort('random')
  var reflo    = complementares.filter(ee.Filter.eq('reference', 9)).sort('random')
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random').limit(500)
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random').limit(350)
  var agro     = complementares.filter(ee.Filter.eq('reference', 21)).sort('random')
  var naoVeg   = complementares.filter(ee.Filter.eq('reference', 22)).sort('random')
  var aflora   = complementares.filter(ee.Filter.eq('reference', 29)).sort('random').limit(400)
  var agua     = complementares.filter(ee.Filter.eq('reference', 33)).sort('random').limit(200)

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

var amostraTotal = agro_compl.merge(varzea_compl).merge(camp_compl).merge(herb_compl).merge(flo_compl)

  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  var training_agro = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 400, 'region': agro_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_varzea = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 200, 'region': varzea_compl.filterBounds(limite), 'scale': 30, 'seed': 1}); 
  var training_camp = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 400, 'region': camp_compl.filterBounds(limite), 'scale': 30, 'seed': 1}); 
  var training_herb = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 400, 'region': herb_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  var training_flo = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 300, 'region': flo_compl.filterBounds(limite), 'scale': 30, 'seed': 1}); 
                                 

  // Remap rocky outcrop (aflora - class 29) to grassland (campo - class 12) reference values.
  var aflora12 = aflora.map(function(feature) {
    var refAflora = feature.get('reference');
    var refCampo = ee.Algorithms.If(ee.Algorithms.IsEqual(refAflora, 29), 12, refAflora);
    return feature.set('reference', refCampo);
  });
  aflora = aflora12;

  // Merge training data.
  var training = BDflo.merge(BDreflo).merge(BDcampo)//.merge(BDsav).merge(BDOutroNFlo).merge(BDAflora)
                      .merge(BDagro).merge(BDnaoVeg).merge(BDagua)
                      // complementary samples
                      .merge(varzea).merge(aflora).merge(herb).merge(flo)
                      // .merge(varzea_compl)

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

// Map.addLayer(classified85a24, vis2, 'RF'+ano+"_ImgCol_"+regiaoID, false);
// print(classified85a24)
//print(classified85a24_prob)

// Set metadata for the classified image.
classified85a24 = classified85a24
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col);


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
// Map.addLayer(classified85a24_prob, {"opacity":1,"bands":['prob_'+ano],
//                                     "min":17.397846221924828,"max":96.64131927490234,
//                                     "palette":["ff1203","fffd03","39ff03","018610","02521a"]}, 'Probabilidade', false);

// Set metadata for the probability image.
classified85a24_prob = classified85a24_prob
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col);

//Map.setCenter(-41.288, -20.5423, 11)

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

