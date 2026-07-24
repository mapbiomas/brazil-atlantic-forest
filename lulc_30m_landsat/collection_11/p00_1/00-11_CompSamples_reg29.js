/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Extraction of complementary training samples for land cover classification, focusing on the region 'reg_29'.
 * 
 * DESCRIPTION:
 * This script automates the process of collecting training samples across multiple years and classes 
 * within the Atlantic Forest biome, specifically configured for the region identified as 'reg_29'. 
 * It utilizes custom Landsat mosaics, cluster data, and auxiliary environmental variables. The 
 * process is organized into multi-year batches to optimize Google Earth Engine processing limits. 
 * For each year, it builds a multi-band image including spectral metrics, temporal statistics 
 * (median, wet/dry seasons), and terrain data. Stratified sampling is performed based on 
 * user-defined geometries for various land cover classes (Forest, Wetland/Varzea, and Agriculture), 
 * and the resulting feature collections are exported as Assets for use in machine learning classifiers.
 */

// Define FeatureCollection variables to store complementary spatial samples
var varzea = /* color: #1bcaad */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.78050623718306, -21.58622328698546],
                  [-51.77672968689009, -21.595481061321713],
                  [-51.77363978210494, -21.593884935568017],
                  [-51.77535639587447, -21.58750025656997]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.864963634644, -21.56866381355524],
                  [-51.863590343628374, -21.5718566033745],
                  [-51.859813793335405, -21.57313369960753],
                  [-51.85638056579634, -21.5718566033745]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.733471019897905, -21.60824943364857],
                  [-51.74377070251509, -21.60505744619858],
                  [-51.747203930054155, -21.610483782955164]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.70085535827681, -21.60617464981754],
                  [-51.69931040588423, -21.610324187720753],
                  [-51.702743633423296, -21.61606950520767],
                  [-51.69742213073775, -21.61192013214014],
                  [-51.69707880798384, -21.60649384926688]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.95991681969885, -21.60120913645946],
                  [-51.97038816369299, -21.610944736965152],
                  [-51.969701518185175, -21.614615367050842],
                  [-51.96455167687658, -21.609987165968946],
                  [-51.95905851281408, -21.607274013719746]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-52.005006002729736, -21.56814248710452],
                  [-52.002259420698486, -21.576603256777638],
                  [-51.999512838667236, -21.566386416408832]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.939603018110596, -21.26088090676821],
                  [-51.96397893363794, -21.302789157549725],
                  [-51.92930333549341, -21.26727988515005]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.808078987722034, -21.149297503376584],
                  [-51.804302437429065, -21.138090159351794],
                  [-51.81563208830797, -21.149297503376584]]]),
            {
              "reference": 11,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.7455942465111, -21.048400922650846],
                  [-51.74834082854235, -21.022765488487128],
                  [-51.75280402434313, -21.051605041705454]]]),
            {
              "reference": 11,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.63133190557086, -20.88753700973058],
                  [-51.62343548223102, -20.91768544792734],
                  [-51.61965893193805, -20.902291257744746]]]),
            {
              "reference": 11,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.45881222173297, -20.971232078348606],
                  [-51.453662380424376, -20.97347612947226],
                  [-51.456408962455626, -20.96962916406339]]]),
            {
              "reference": 11,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.45606563970172, -20.97604071807355],
                  [-51.45846889897906, -20.97347612947226],
                  [-51.45726726934039, -20.978124413907366]]]),
            {
              "reference": 11,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.424222454276915, -20.95383954013201],
                  [-51.41984508916461, -20.953037991927317],
                  [-51.41855762883746, -20.952316594871792],
                  [-51.42542408391559, -20.953037991927317]]]),
            {
              "reference": 11,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.92122764220934, -20.661808091197173],
                  [-50.91873855224352, -20.65803347381692],
                  [-50.91723651519518, -20.657993317808824],
                  [-50.918566890866565, -20.65690910157944],
                  [-50.917279430539416, -20.6533351488684],
                  [-50.91951102843981, -20.655302841095672],
                  [-50.921313472897815, -20.65441939059362],
                  [-50.92024058929186, -20.657350820236267],
                  [-50.92122764220934, -20.66024203792061]]]),
            {
              "reference": 11,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.91465032946907, -20.711918301562903],
                  [-50.9143499220594, -20.709710489435135],
                  [-50.91263330828987, -20.70826535862578],
                  [-50.912976631043776, -20.707141358469837],
                  [-50.91456449878059, -20.70894778322512],
                  [-50.91563738238655, -20.70754278805383],
                  [-50.91555155169807, -20.711958443303857]]]),
            {
              "reference": 11,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.00295280913133, -21.104649398381213],
                  [-50.00192284086961, -21.10160657280753],
                  [-50.00346779326219, -21.09904414500786],
                  [-50.00501274565477, -21.10512983882333]]]),
            {
              "reference": 11,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.94733452299852, -21.11746061129348],
                  [-49.94767784575242, -21.112656536060676],
                  [-49.95008110502977, -21.109293590851173],
                  [-49.949394459521955, -21.11665994289044]]]),
            {
              "reference": 11,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.90786700121571, -21.40405843750656],
                  [-49.900313900629776, -21.40262003345252],
                  [-49.90615038744618, -21.401661089553244]]]),
            {
              "reference": 11,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.87044482103993, -21.394229061069268],
                  [-49.867612408320205, -21.39718593485463],
                  [-49.86649660937001, -21.395827378647965],
                  [-49.86932902208974, -21.391991387112615],
                  [-49.86932902208974, -21.393509812459754]]]),
            {
              "reference": 11,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.717177875252695, -21.903700101027045],
                  [-48.71477461597535, -21.906885455698742],
                  [-48.69589186451051, -21.908796634320215],
                  [-48.703444965096445, -21.90147031038972],
                  [-48.72026778003785, -21.89478072916508]]]),
            {
              "reference": 11,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.611777789803476, -21.850885850489586],
                  [-48.595298297615976, -21.86108250898515],
                  [-48.596328265877695, -21.853753734257975],
                  [-48.60868788501832, -21.847380581043538]]]),
            {
              "reference": 11,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.27336039921567, -21.865866317782093],
                  [-48.26906886479184, -21.86108688484831],
                  [-48.27233043095395, -21.859493704988704],
                  [-48.275935319869966, -21.863157992094283]]]),
            {
              "reference": 11,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-47.85820110587952, -22.28001838042572],
                  [-47.85785778312562, -22.29081945592615],
                  [-47.85648449210999, -22.29701381380641],
                  [-47.85373791007874, -22.29256661030775],
                  [-47.855626185225226, -22.28367177876464]]]),
            {
              "reference": 11,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-47.86991279898547, -22.233868933010466],
                  [-47.87592094717883, -22.21956739698714],
                  [-47.88038414297961, -22.21909065399911],
                  [-47.87557762442492, -22.23243884505619]]]),
            {
              "reference": 11,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.162309239600695, -23.516953356865425],
                  [-49.15801770517687, -23.528443313430586],
                  [-49.157331059669055, -23.53332230662615],
                  [-49.1516662342296, -23.52466590413326],
                  [-49.1542411548839, -23.51490709501682],
                  [-49.15836102793077, -23.516953356865425]]]),
            {
              "reference": 11,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.16848904917101, -23.519314388712516],
                  [-49.16986234018663, -23.53017458978897],
                  [-49.16402585337023, -23.529387648813454],
                  [-49.16574246713976, -23.517897774685142]]]),
            {
              "reference": 11,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.796162698072614, -22.435950375486776],
                  [-49.79702100495738, -22.442614261757253],
                  [-49.79581937531871, -22.443248900898435],
                  [-49.79358777741832, -22.437219711833848]]]),
            {
              "reference": 11,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.924222085279645, -22.452926787990304],
                  [-49.92061719636363, -22.459907139672445],
                  [-49.92233381013316, -22.45356137994012],
                  [-49.923192117017926, -22.45118164515178]]]),
            {
              "reference": 11,
              "system:index": "27"
            })]),
    agro = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.66269780046323, -22.39397889919722],
                  [-51.66115284807065, -22.400327383003784],
                  [-51.6584062660394, -22.400327383003784],
                  [-51.6584062660394, -22.3962009015041]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.19743160689461, -22.17709827874508],
                  [-51.20000652754891, -22.173601068331887],
                  [-51.20172314131844, -22.175985539414857],
                  [-51.19863323653328, -22.178528930654437]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.15464021873731, -21.983342501899088],
                  [-51.15300943565626, -21.983262911703868],
                  [-51.152837774279305, -21.977293519870074],
                  [-51.154125234606454, -21.979044567491595]]]),
            {
              "reference": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.8245141545689, -21.95132544270168],
                  [-50.82863402761578, -21.948141082454317],
                  [-50.82932067312359, -21.94989248941667],
                  [-50.82726073660015, -21.95339523861348]]]),
            {
              "reference": 21,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.7996232549107, -21.954987368806737],
                  [-50.79756331838726, -21.95196230619208],
                  [-50.79893660940289, -21.949733271493454],
                  [-50.80236983694195, -21.954987368806737]]]),
            {
              "reference": 21,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.65601268997615, -21.80910572182158],
                  [-50.652922785190995, -21.81101820931425],
                  [-50.65154949417537, -21.810061968761186],
                  [-50.6558410285992, -21.807830715967906]]]),
            {
              "reference": 21,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.71188846817439, -21.79515972840174],
                  [-50.7151500343365, -21.794043990274773],
                  [-50.715064203648026, -21.795080033109365],
                  [-50.71248928299373, -21.79635515246814]]]),
            {
              "reference": 21,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.95733662360761, -21.470491270837737],
                  [-49.96403141730878, -21.475283666259454],
                  [-49.96300144904706, -21.477679804836686]]]),
            {
              "reference": 21,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.975189406810735, -21.48327064151633],
                  [-49.9789659571037, -21.48614584535136],
                  [-49.97553272956464, -21.486784771824485]]]),
            {
              "reference": 21,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.991153914867375, -21.45515454611215],
                  [-49.9951021265373, -21.453876412870727],
                  [-49.99269886725995, -21.45898887860216]]]),
            {
              "reference": 21,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.2046893651368, -22.37994263717261],
                  [-48.20262942861336, -22.383434691524158],
                  [-48.19713626455086, -22.38026010028072]]]),
            {
              "reference": 21,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.89315729825708, -23.190509483384375],
                  [-48.892813975503174, -23.198714375999778],
                  [-48.881827647378174, -23.195243136721004],
                  [-48.8832009383938, -23.18798479976124]]]),
            {
              "reference": 21,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.15096303959739, -23.112135600371843],
                  [-49.15109178563011, -23.109885740843183],
                  [-49.1533233835305, -23.111464593580777]]]),
            {
              "reference": 21,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.322875112860714, -22.230671076391666],
                  [-49.310858816473996, -22.235438039615737],
                  [-49.30879887995056, -22.21859404410687]]]),
            {
              "reference": 21,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.774339060711284, -22.925874640350866],
                  [-49.776055674480816, -22.913858372756465],
                  [-49.78738532535972, -22.915755749003292]]]),
            {
              "reference": 21,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.760606150555034, -22.91796932105372],
                  [-49.756829600262066, -22.908482329161853],
                  [-49.76300940983238, -22.910063540585238]]]),
            {
              "reference": 21,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.87201438419761, -22.852892957526777],
                  [-49.874417643474956, -22.84435060086637],
                  [-49.88437400333824, -22.848780037975203]]]),
            {
              "reference": 21,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.36071304039762, -21.747507089332554],
                  [-51.3541899080734, -21.7529280658272],
                  [-51.356593167350745, -21.737621252541032]]]),
            {
              "reference": 21,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.4201078768234, -22.691763575112248],
                  [-51.42731765465543, -22.67022306221996],
                  [-51.43761733727262, -22.671490244889256]]]),
            {
              "reference": 21,
              "system:index": "18"
            })]),
    flo = /* color: #98ff00 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.95910695599953, -21.481983943069313],
                  [-49.960480247015155, -21.479747614395272],
                  [-49.9628835062925, -21.479747614395272],
                  [-49.961510215276874, -21.481983943069313]]]),
            {
              "reference": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.53352396439619, -21.57175554843365],
                  [-50.53000490616865, -21.568083831515093],
                  [-50.53343813370771, -21.56760490505958],
                  [-50.536356377115915, -21.57143627239424]]]),
            {
              "reference": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.72511463042251, -21.57462591043207],
                  [-50.713784979543604, -21.576302064896204],
                  [-50.71696071501724, -21.569756970841336],
                  [-50.72262554045669, -21.567362350381085]]]),
            {
              "reference": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.89969019088332, -21.603673095325167],
                  [-50.90947488936965, -21.601279035613842],
                  [-50.90947488936965, -21.607503508466795],
                  [-50.90089182052199, -21.609259080594953]]]),
            {
              "reference": 3,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.36628271819689, -21.240957016833995],
                  [-51.37726904632189, -21.236796969269196],
                  [-51.38413550140002, -21.249596740472597],
                  [-51.374179141536736, -21.262395399818345]]]),
            {
              "reference": 3,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.73492528930447, -20.738834516985833],
                  [-50.74247838989041, -20.733376111364386],
                  [-50.74694158569119, -20.738513439752047],
                  [-50.74316503539822, -20.742687390648967]]]),
            {
              "reference": 3,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.50715885066031, -21.419724007676287],
                  [-49.509562109937654, -21.413012053895994],
                  [-49.51265201472281, -21.416208260824995]]]),
            {
              "reference": 3,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.87252936832847, -22.822753110140457],
                  [-49.8739026593441, -22.81325946708423],
                  [-49.88008246891441, -22.815158248640326]]]),
            {
              "reference": 3,
              "system:index": "7"
            })]);
            
// --- 1. GENERAL CONFIGURATIONS AND PATHS ---

// Unique identifier for the specific geographic region being processed
var regiaoID = 'reg_29';

// Manual definition of a specific year, used as a reference point for individual operations
var ano = 2020; 

// Base directory path for saving the resulting sample assets in the MapBiomas repository
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Import of auxiliary feature collections representing regional boundaries
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Filter the master collection to obtain the specific geometry of region 'reg_29'
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

    // Define the specific subset of band names to be used as features for the sampling process for 'reg_29'
    var bandNames = ee.List([
      'gcvi_median_wet',	'red_min',	'gcvi_max',	'gcvi_median',	'wefi_stdDev',	'gcvi_stdDev',	'cai_min',	'gcvi_amp',	'ndvi_median_wet',	
      'red_median_wet',	'shade_stdDev',	'swir2_median_wet',	'swir1_median',	'ndwi_max',	'swir1_median_wet',	'blue_median',	'hallheigth_median_wet',	
      'nir_max',	'ndvi_median',	'evi2_max',	'cai_median_wet',	'swir1_median_dry',	'blue_median_wet',	'green_max',	'blue_min',	'red_median',	
      'evi2_amp',	'green_min',	'savi_min',	'green_median',	'savi_stdDev',	'swir2_stdDev',	'evi2_median_wet',	'savi_max',	'cai_median',	
      'red_amp',	'shade_min',	'swir2_min',	'evi2_min',	'swir2_median',	'ndwi_median',	'hallcover_median_wet',	'red_median_dry',	'savi_amp',	
      'nir_median_dry',	'hallheigth_max',	'green_median_dry',	'green_median_wet',	'hallheigth_min',	'ndwi_median_wet',	'hallheigth_median_dry',	
      'hallcover_median',	'nir_stdDev',	'blue_amp',	'gcvi_min',	'hallcover_min',	'hallcover_median_dry',	'latitude',	'longitude',	'slope',
    ]);
  
    /**
     * OPTIMIZED VERSION: Dynamic processing per land cover class
     */

    // --- 1. CLASS DEFINITIONS (Configuration Dictionary) ---
    // Mapping table defining available class variables, sample quotas, numeric legend references, and class names
    var classConfigs = [
      {variable: typeof flo     !== 'undefined' ? flo     : null, number: 500, ref: 3,  name: 'floresta'},
      {variable: typeof sav     !== 'undefined' ? sav     : null, number: 0, ref: 4,  name: 'savana'},
      {variable: typeof reflo   !== 'undefined' ? reflo   : null, number: 0, ref: 9,  name: 'reflo'},
      {variable: typeof varzea  !== 'undefined' ? varzea  : null, number: 1200, ref: 11, name: 'varzea'},
      {variable: typeof campo   !== 'undefined' ? campo   : null, number: 0, ref: 12, name: 'campo'},
      {variable: typeof agro    !== 'undefined' ? agro    : null, number: 1500, ref: 21, name: 'agro'},
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
    // Function designed to extract raster pixel values using spatial geometries for region 'reg_29'
    var getTrainingSamples = function(classObj) {
      // Filter the class geometries by the current regional limit ('reg_29')
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
    // Iterate through active classes to collect samples for the specific year in region 'reg_29'
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

  // Export the final multi-year batch collection for 'reg_29' as an Earth Engine Asset
  Export.table.toAsset({
    collection: amostras,
    description: 'amostras_complementares_'+batch+'_'+regiaoID,
    assetId: dirout + 'amostras_complementares_'+batch+'_'+regiaoID,
    overwrite: true
  });

} 

// Print the names of classes that were successfully processed to the console for verification in 'reg_29'
print('Classes processadas:', classesAtivas.map(function(i){return i.name}));