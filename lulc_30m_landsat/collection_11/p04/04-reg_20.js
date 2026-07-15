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

var varzea_compl = /* color: #ed4bf3 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.765099331097936, -22.311159143678747],
                  [-41.768532558637, -22.31830541458439],
                  [-41.762352749066686, -22.31798781031262]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.74886951594848, -22.281554253884522],
                  [-41.7502428069641, -22.27885388429167],
                  [-41.75213108211059, -22.2829838402045]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.797086706125775, -22.28907430100748],
                  [-41.798073759043255, -22.292171552943323],
                  [-41.79674338337187, -22.292409800249285]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.831175736762965, -22.350897181345182],
                  [-41.83203404364773, -22.352484820780617],
                  [-41.82825749335476, -22.352643583729254]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.77366917548367, -22.34200606625779],
                  [-41.77590077338406, -22.34232361584819],
                  [-41.77607243476101, -22.346610464519735]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.78517048773953, -22.36089900775779],
                  [-41.78585713324734, -22.362327781480577],
                  [-41.78208058295437, -22.364550289247973]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.76457112250515, -22.322634173756242],
                  [-41.76594441352078, -22.321681388325505],
                  [-41.768519334175075, -22.324063339704633]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.839930466987575, -22.320729422661042],
                  [-41.83924382147976, -22.31660058246408],
                  [-41.84284871039578, -22.321047020693914]]]),
            {
              "reference": 11,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.62865756257058, -22.218257954856096],
                  [-41.62522433503152, -22.214443929980174],
                  [-41.63312075837136, -22.215715283127043]]]),
            {
              "reference": 11,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.55462587307191, -22.17050252483051],
                  [-41.5579732699225, -22.16907179123702],
                  [-41.559346560938124, -22.1701051002926]]]),
            {
              "reference": 11,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.634963397485976, -22.20539201838857],
                  [-41.6323026461432, -22.203325911689955],
                  [-41.635220889551405, -22.203405377894548]]]),
            {
              "reference": 11,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.49551986917237, -22.10284420304674],
                  [-41.50195717080811, -22.09751606230246],
                  [-41.50315880044678, -22.09870894711273]]]),
            {
              "reference": 11,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.48779510720948, -22.08439366397246],
                  [-41.48753761514405, -22.0870182412193],
                  [-41.484361879670416, -22.08630245226277]]]),
            {
              "reference": 11,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.55268310769776, -22.163149486577392],
                  [-41.55096649392823, -22.159651929239182],
                  [-41.555086366975104, -22.159333965169118]]]),
            {
              "reference": 11,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.43900036081055, -22.11556707299279],
                  [-41.43762706979493, -22.118747669668846],
                  [-41.42938732370118, -22.112386404565274]]]),
            {
              "reference": 11,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.439687006318366, -21.95963010097165],
                  [-41.44415020211915, -21.966953430855416],
                  [-41.43865703805665, -21.966953430855416]]]),
            {
              "reference": 11,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.39368175729493, -21.93861323308216],
                  [-41.39608501657227, -21.94370851662784],
                  [-41.383038751923834, -21.945619200895994]]]),
            {
              "reference": 11,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.56190990670899, -21.93733938367649],
                  [-41.55916332467774, -21.934791650645714],
                  [-41.56499981149415, -21.932243871992597]]]),
            {
              "reference": 11,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.71949505075196, -21.924361392925363],
                  [-41.72243475183228, -21.933677003098417],
                  [-41.715117685639655, -21.92627233702901]]]),
            {
              "reference": 11,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.36896251901368, -21.949440492412503],
                  [-41.3703358100293, -21.94084244209325],
                  [-41.37617229684571, -21.942434712854034]]]),
            {
              "reference": 11,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.64767902933482, -21.85791696947657],
                  [-41.6521422251356, -21.852499965227874],
                  [-41.655232129920755, -21.85536781659496]]]),
            {
              "reference": 11,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.54399555765513, -21.791943009713048],
                  [-41.547085462440286, -21.787479904903694],
                  [-41.55395191751841, -21.792899371232682]]]),
            {
              "reference": 11,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.46091145120982, -21.78461069271198],
                  [-41.46159809671763, -21.78014735960799],
                  [-41.466747938026224, -21.782379043527886]]]),
            {
              "reference": 11,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.055517221486696, -21.62999673497577],
                  [-41.06066706279529, -21.625528604932285],
                  [-41.06787684062732, -21.633507311656054]]]),
            {
              "reference": 11,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.04315760234607, -21.608293095236608],
                  [-41.04315760234607, -21.61371931061053],
                  [-41.03217127422107, -21.614038493410128]]]),
            {
              "reference": 11,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.093205773481515, -21.615899021526015],
                  [-41.08633931840339, -21.62483573884846],
                  [-41.08359273637214, -21.621963282816544]]]),
            {
              "reference": 11,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.065739953169015, -21.62164411751156],
                  [-41.05990346635261, -21.617494904421985],
                  [-41.06368001664558, -21.61366475588075]]]),
            {
              "reference": 11,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.11552175248542, -21.56322501088074],
                  [-41.11826833451667, -21.571845705447053],
                  [-41.1144917842237, -21.57120715306209]]]),
            {
              "reference": 11,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.28409322465339, -21.587808600479985],
                  [-41.28134664262214, -21.592277895824676],
                  [-41.27688344682136, -21.59100096837528]]]),
            {
              "reference": 11,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.95184164410506, -21.15445601047931],
                  [-40.95252828961287, -21.171745075149033],
                  [-40.942228606995684, -21.179428455465377]]]),
            {
              "reference": 11,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.047285369691, -21.20695728930223],
                  [-41.05140524273787, -21.214638838998965],
                  [-41.03423910504256, -21.217199266740245],
                  [-41.02805929547225, -21.210157983580647]]]),
            {
              "reference": 11,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.21002035504256, -21.13588402551126],
                  [-41.20727377301131, -21.119231301498285],
                  [-41.21345358258162, -21.12243389366588]]]),
            {
              "reference": 11,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.94978170758162, -21.12179338076439],
                  [-40.9539015806285, -21.13268172384678],
                  [-40.95115499859725, -21.14420968601067],
                  [-40.944975189026934, -21.129479353001276]]]),
            {
              "reference": 11,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.84094839459334, -20.94426076519191],
                  [-40.836828521546465, -20.952597145594567],
                  [-40.83476858502303, -20.946505220978036]]]),
            {
              "reference": 11,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.854337981995684, -20.924379830952795],
                  [-40.85296469098006, -20.91700397474522],
                  [-40.857084564026934, -20.920210913348527]]]),
            {
              "reference": 11,
              "system:index": "34"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-40.859831146058184, -20.914759306897523],
                  [-40.86360769635115, -20.90289285998098],
                  [-40.8718474424449, -20.908345127859207]]]),
            {
              "reference": 11,
              "system:index": "35"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.0256560361949, -20.934641517799598],
                  [-41.034582427796465, -20.92309732940921],
                  [-41.040075591858965, -20.92726616671699]]]),
            {
              "reference": 11,
              "system:index": "36"
            })]),
    herb_compl = /* color: #f18733 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.67814502864379, -22.279806135353454],
                  [-41.67814502864379, -22.28171227102849],
                  [-41.67282352595824, -22.277582277560743]]]),
            {
              "reference": 50,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.70955906062621, -22.303789781807613],
                  [-41.710760690264884, -22.301883947221146],
                  [-41.71264896541137, -22.302995687223387]]]),
            {
              "reference": 50,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.49141306682492, -22.2029490116972],
                  [-41.494502971610075, -22.19913457073571],
                  [-41.50411600871945, -22.2029490116972]]]),
            {
              "reference": 50,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.507464630441675, -22.18011304183639],
                  [-41.51089785798074, -22.176933831427633],
                  [-41.51853556438351, -22.180060811741296]]]),
            {
              "reference": 50,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.43845675690652, -22.158492993265526],
                  [-41.441546661691675, -22.162944451458028],
                  [-41.43536685212136, -22.161990579417957]]]),
            {
              "reference": 50,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.413251154267584, -22.174714418143513],
                  [-41.413766138398444, -22.17678094571862],
                  [-41.40741466745118, -22.17630405743625]]]),
            {
              "reference": 50,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.04659082988513, -21.690940984656628],
                  [-41.04384424785388, -21.6810512601977],
                  [-41.04899408916248, -21.682646422958893]]]),
            {
              "reference": 50,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.1723327885033, -21.587144872752905],
                  [-41.17301943401111, -21.599913980505818],
                  [-41.17018702129138, -21.585947711159324]]]),
            {
              "reference": 50,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.17045300478053, -21.63315193995932],
                  [-41.165646486225846, -21.645916985557523],
                  [-41.16701977724147, -21.63059879546217]]]),
            {
              "reference": 50,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.02763073915553, -21.87915629819103],
                  [-41.03587048524928, -21.858127554239275],
                  [-41.04411023134303, -21.862588455729895]]]),
            {
              "reference": 50,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.09354870790553, -21.57361859831535],
                  [-41.09492199892116, -21.587665866917437],
                  [-41.08668225282741, -21.588304346756647]]]),
            {
              "reference": 50,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.146420412007096, -21.559893075176713],
                  [-41.15260022157741, -21.58671194633213],
                  [-41.14298718446803, -21.58288098294463]]]),
            {
              "reference": 50,
              "system:index": "11"
            })]);
            
// Region ID.
var regiaoID = 'reg_20';
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
if (coleta) {var RFtrees = 10}

// Output version and parameters, output directory.
var versao_out = '3';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';
var batch = '4'

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
'cai_median_wet',	'evi2_median_dry',	'cai_median',	'wefi_stdDev',	'savi_median_dry',	'green_median',	'green_min',	'cai_median_dry',	
'blue_median_wet',	'ndvi_median_wet',	'blue_min',	'evi2_median',	'cai_max',	'ndvi_max',	'blue_median',	'savi_median_wet',	
'ndvi_median_dry',	'hallcover_median_dry',	'red_median_dry',	'ndvi_stdDev',	'ndvi_min',	'red_median',	'swir1_max',	
'evi2_amp',	'evi2_min',	'swir1_median_wet',	'swir1_median',	'savi_stdDev',	'swir2_median_wet',	'blue_max',	'ndwi_max',	'gcvi_median_wet',	
'nir_max',	'nir_amp',	'cai_min',	'gcvi_max',	'sefi_stdDev',	'red_median_wet',	'evi2_median_wet',	'gcvi_amp',	'green_amp',	'savi_max',	
'evi2_stdDev',	'ndwi_stdDev',	'hallcover_min',	'gvs_stdDev',	'gcvi_min',	'evi2_max',	'blue_median_dry',	'shade_stdDev',	
'wefi_max',	'hallheigth_median',	'ndwi_median',	'red_stdDev',	'swir1_amp',	'gcvi_median_dry',	'swir2_min',	'red_min',

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
                                         
  var flo      = complementares.filter(ee.Filter.eq('reference', 3)).sort('random').limit(200)
  var sav      = complementares.filter(ee.Filter.eq('reference', 4)).sort('random')
  var reflo    = complementares.filter(ee.Filter.eq('reference', 9)).sort('random')
  var varzea   = complementares.filter(ee.Filter.eq('reference', 11)).sort('random').limit(700)
  var campo    = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')
  var herb     = complementares.filter(ee.Filter.eq('reference', 50)).sort('random').limit(400)
  var agro     = complementares.filter(ee.Filter.eq('reference', 21)).sort('random').limit(400)
  var naoVeg   = complementares.filter(ee.Filter.eq('reference', 22)).sort('random')
  var aflora   = complementares.filter(ee.Filter.eq('reference', 12)).sort('random')
  var agua     = complementares.filter(ee.Filter.eq('reference', 33)).sort('random').limit(100)

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


var amostraTotal = herb_compl.merge(varzea_compl);
var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

var training_varzea = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 400, 'region': varzea_compl.filterBounds(limite), 'scale': 30, 'seed': 1})
var training_herb = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 300, 'region': herb_compl.filterBounds(limite), 'scale': 30, 'seed': 1});                                 
  // Merge training data.
  var training = BDflo.merge(BDreflo).merge(BDcampo)
                      //.merge(BDsav).merge(BDOutroNFlo)
                      //.merge(BDAflora)
                      .merge(BDagro).merge(BDnaoVeg)
                      .merge(BDagua)
                      // complementary samples
                      .merge(flo).merge(varzea).merge(herb).merge(agro).merge(agua)
                      // .merge(training_varzea).merge (training_herb);

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
  "region": limite,
  "overwrite":  true
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
  "overwrite":  true
}); 
//}
