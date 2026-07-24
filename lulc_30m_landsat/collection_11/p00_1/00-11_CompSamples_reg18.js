/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Extraction of complementary training samples for land cover classification, focusing on the region 'reg_18'.
 * 
 * DESCRIPTION:
 * This script automates the process of collecting training samples across multiple years and classes 
 * within the Atlantic Forest biome, specifically configured for the region identified as 'reg_18'. 
 * It utilizes custom Landsat mosaics, cluster data, and auxiliary environmental variables. The 
 * process is organized into multi-year batches to optimize Google Earth Engine processing limits. 
 * For each year, it builds a multi-band image including spectral metrics, temporal statistics 
 * (median, wet/dry seasons), and terrain data. Stratified sampling is performed based on 
 * user-defined geometries for various land cover classes (Forest, Wetland/Varzea, and Agriculture), 
 * and the resulting feature collections are exported as Assets for use in machine learning classifiers.
 */


// Define FeatureCollection variables to store complementary spatial samples
var varzea = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.29306318705524, -20.715530744420164],
                  [-48.2990713352486, -20.716975805941086],
                  [-48.288943314008364, -20.72002644610719]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.342330002240786, -20.682129928421425],
                  [-48.33821012919391, -20.67233310211242],
                  [-48.34370329325641, -20.679560330229503],
                  [-48.34541990702594, -20.684217694919205],
                  [-48.343359970502505, -20.689517280875737]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.678130809399, -20.51657555516171],
                  [-50.678302470775954, -20.51906751699034],
                  [-50.677529994579665, -20.51778134820817]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.71308678646423, -20.546413744784417],
                  [-50.71308678646423, -20.549869651962172],
                  [-50.71368760128357, -20.5512359192937],
                  [-50.71257180233337, -20.550834077228775],
                  [-50.712228479579466, -20.54673522781799]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.73034270533985, -20.55726342346695],
                  [-50.730256874651374, -20.56039763166582],
                  [-50.7290552450127, -20.560719085281118],
                  [-50.72957022914356, -20.557504518688212]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.86189730243336, -20.47247208160627],
                  [-50.86078150348317, -20.473678221636188],
                  [-50.86146814899098, -20.474964760552606],
                  [-50.85975153522145, -20.476010065479834],
                  [-50.86000902728688, -20.47215044266398]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.84078295306813, -20.50310509965867],
                  [-50.839152169987074, -20.498361804449125],
                  [-50.84232790546071, -20.501979585268188]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.92776840768634, -20.348951984365307],
                  [-50.92510765634356, -20.347825341704947],
                  [-50.9242493494588, -20.34685964145674],
                  [-50.92545097909747, -20.346779166163593],
                  [-50.92888420663653, -20.34871056162977]]]),
            {
              "reference": 11,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.55908820100033, -20.033389324838158],
                  [-50.55925986237728, -20.030163797987093],
                  [-50.560289830639, -20.029679963249386],
                  [-50.560289830639, -20.033308687473767]]]),
            {
              "reference": 11,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.372742783951985, -19.955351531820924],
                  [-50.3737727522137, -19.957691156640255],
                  [-50.371712815690266, -19.95696506989152]]]),
            {
              "reference": 11,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.4233594978819, -20.056550305032136],
                  [-50.4237028206358, -20.060017161148682],
                  [-50.42207203755475, -20.063000208588768],
                  [-50.42129956135846, -20.06050090242428]]]),
            {
              "reference": 11,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.41477642903424, -20.067756842573928],
                  [-50.41074238667584, -20.070820360971616],
                  [-50.41048489461041, -20.067756842573928]]]),
            {
              "reference": 11,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.395922559331495, -20.213114358836606],
                  [-50.394463437627394, -20.213275448186298],
                  [-50.39454926831587, -20.212067273998816],
                  [-50.39583672864302, -20.212067273998816]]]),
            {
              "reference": 11,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.81099610187426, -20.124303614703347],
                  [-49.811081932562736, -20.13010602930626],
                  [-49.80996613361254, -20.13050896676759]]]),
            {
              "reference": 11,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.7705698476018, -20.122933568719628],
                  [-49.77211479999438, -20.123336524666797],
                  [-49.770913170355705, -20.124303614703347],
                  [-49.769625710028556, -20.123981252022418]]]),
            {
              "reference": 11,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.81975083209887, -20.145900399940174],
                  [-49.820094154852775, -20.147350823309885],
                  [-49.819321678656486, -20.147350823309885]]]),
            {
              "reference": 11,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.67864074585718, -20.232914136202393],
                  [-49.6741775500564, -20.237746128912786],
                  [-49.66937103150171, -20.236296546872662],
                  [-49.674005888679446, -20.23549121767497]]]),
            {
              "reference": 11,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.93267478992859, -20.675483564673453],
                  [-48.92623748829285, -20.6782941359461],
                  [-48.92563667347351, -20.67668810159022],
                  [-48.92889823963562, -20.67612598555168],
                  [-48.93112983753601, -20.67451992825933]]]),
            {
              "reference": 11,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.91825523426453, -20.677972930434183],
                  [-48.91696777393738, -20.68030165499687],
                  [-48.91576614429871, -20.68030165499687],
                  [-48.91671028187195, -20.678133533275098]]]),
            {
              "reference": 11,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.979538345836794, -20.6624739571264],
                  [-48.98108329822937, -20.663598288186307],
                  [-48.98005332996765, -20.66464230243426]]]),
            {
              "reference": 11,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-47.86298712429159, -20.026498395201116],
                  [-47.86504706081503, -20.0216598679793],
                  [-47.865390383568936, -20.027466082774882]]]),
            {
              "reference": 11,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-47.84908255275839, -19.98343027078149],
                  [-47.840671145287686, -19.981171691971223],
                  [-47.84753760036581, -19.980687706585766]]]),
            {
              "reference": 11,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.01413670923701, -21.514303570107053],
                  [-48.01653996851435, -21.50775567959575],
                  [-48.018428243660836, -21.51126921849064],
                  [-48.01533833887568, -21.523725626595958]]]),
            {
              "reference": 11,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.63848396374115, -20.169164482766643],
                  [-48.63676734997162, -20.17174261956471],
                  [-48.61960121227631, -20.165619475091827]]]),
            {
              "reference": 11,
              "system:index": "23"
            })]),
    agro = /* color: #ff9999 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.29359658266809, -20.069454222866863],
                  [-51.30355294253137, -20.07284017675554],
                  [-51.29823143984582, -20.078160813710067]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.27934868838098, -20.079128182846077],
                  [-51.278662042873165, -20.07541990207201],
                  [-51.28209527041223, -20.075581133494932],
                  [-51.282438593166134, -20.07928941045498]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.190789778709, -20.247833273018628],
                  [-51.19696958827931, -20.243001593977056],
                  [-51.20417936611134, -20.243967941807455],
                  [-51.19868620204884, -20.25330899424231]]]),
            {
              "reference": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.2515579061504, -20.22914994802994],
                  [-51.25396116542775, -20.21851877805953],
                  [-51.25739439296681, -20.23204923188484]]]),
            {
              "reference": 21,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.76529013197554, -20.27345761914623],
                  [-50.76735006849898, -20.264117779090363],
                  [-50.77181326429976, -20.272169398774167]]]),
            {
              "reference": 21,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.60533942108309, -20.306348705078538],
                  [-50.610660923768634, -20.301840843700557],
                  [-50.60877264862215, -20.308441596109763]]]),
            {
              "reference": 21,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.48534811859285, -20.305543739456834],
                  [-50.48689307098543, -20.30232383512469],
                  [-50.488781346131915, -20.304577775187028]]]),
            {
              "reference": 21,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.379948033143634, -20.339187732427064],
                  [-50.387672795106525, -20.338061018575228],
                  [-50.38475455169832, -20.34111922277893]]]),
            {
              "reference": 21,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.32055319671785, -20.34498213106506],
                  [-50.32535971527254, -20.346752598423475],
                  [-50.32741965179598, -20.353029546481327]]]),
            {
              "reference": 21,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.33068121795809, -20.33854389694597],
                  [-50.3339427841202, -20.34015348062021],
                  [-50.3313678634659, -20.344177366468582]]]),
            {
              "reference": 21,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.356430424501056, -20.302162838150668],
                  [-50.355228794862384, -20.299908862941837],
                  [-50.357460392762775, -20.29910386384664],
                  [-50.35831869964754, -20.30135785077019]]]),
            {
              "reference": 21,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.40939569227293, -20.465069192616955],
                  [-50.41094064466551, -20.462817597285312],
                  [-50.41265725843504, -20.46860734713665]]]),
            {
              "reference": 21,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.49797296278074, -20.441586647045312],
                  [-50.492651460095196, -20.442632179174847],
                  [-50.493938920422345, -20.440299828508454]]]),
            {
              "reference": 21,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.47188043348387, -20.433222134031904],
                  [-50.47282457105711, -20.43193524549094],
                  [-50.47299623243406, -20.43442858225925]]]),
            {
              "reference": 21,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.344604131944465, -20.593423648790257],
                  [-50.3521572325304, -20.591334635879697],
                  [-50.35198557115345, -20.594387798942904],
                  [-50.344089147813605, -20.597119524600735]]]),
            {
              "reference": 21,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.24658548570423, -20.60740322921586],
                  [-50.24710046983509, -20.613348179376665],
                  [-50.24366724229603, -20.608849319524715]]]),
            {
              "reference": 21,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.08442976008435, -20.585186309646044],
                  [-50.08408643733044, -20.58068661867555],
                  [-50.087004680738644, -20.5834185897344]]]),
            {
              "reference": 21,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.12700178156872, -20.597559775411582],
                  [-50.12837507258435, -20.59322114197353],
                  [-50.129405040846066, -20.597559775411582]]]),
            {
              "reference": 21,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.98924352656384, -20.53756268185708],
                  [-49.99190427790661, -20.543912214174906],
                  [-49.988642711744504, -20.539973927711763]]]),
            {
              "reference": 21,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.776235775263544, -20.325901855234154],
                  [-50.77984066417956, -20.324292123197036],
                  [-50.78052730968737, -20.327833511565238]]]),
            {
              "reference": 21,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.71684093883776, -20.30272009815795],
                  [-50.71907253673815, -20.298212131159065],
                  [-50.71907253673815, -20.302076110905457]]]),
            {
              "reference": 21,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.96677990368151, -20.2901618637987],
                  [-50.970728115351434, -20.294670065052106],
                  [-50.96712322643542, -20.296119101884305]]]),
            {
              "reference": 21,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.09425261595328, -21.557630025067144],
                  [-48.073138266588046, -21.544218519590267],
                  [-48.11107543089469, -21.538949374705037]]]),
            {
              "reference": 21,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.12875655272086, -21.54453785555651],
                  [-48.12669661619742, -21.528410511176414],
                  [-48.13871291258414, -21.54198314815218]]]),
            {
              "reference": 21,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.524607687974765, -21.6793943311809],
                  [-48.51224806883414, -21.655464496618684],
                  [-48.52563765623648, -21.65291174661591]]]),
            {
              "reference": 21,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.91015914061148, -21.58141642995174],
                  [-48.90466597654898, -21.57726606330545],
                  [-48.92080214598258, -21.570880651687983]]]),
            {
              "reference": 21,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.801218949092714, -20.858726567831066],
                  [-48.80499549938568, -20.85006412985954],
                  [-48.81083198620209, -20.85648079848731]]]),
            {
              "reference": 21,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.52209755016693, -20.966483998458763],
                  [-48.510081253780214, -20.966483998458763],
                  [-48.526560745967714, -20.95430103209442]]]),
            {
              "reference": 21,
              "system:index": "27"
            })]),
    flo = /* color: #99ff99 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.85501263748159, -20.537584065384838],
                  [-49.85338185440054, -20.53501202826357],
                  [-49.85810254226675, -20.53669993250297]]]),
            {
              "reference": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.83104952200651, -20.550363233341436],
                  [-49.83147867544889, -20.551890232271518],
                  [-49.82821710928678, -20.552131335971023]]]),
            {
              "reference": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.250719007751776, -20.483983401511136],
                  [-50.25380891253693, -20.47851585801834],
                  [-50.2546672194217, -20.487521119916625]]]),
            {
              "reference": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.48926270434027, -20.40848219072993],
                  [-50.49166596361761, -20.415078385970773],
                  [-50.487889413324645, -20.41234341248258]]]),
            {
              "reference": 3,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.76181621959948, -20.32413114907197],
                  [-50.763189510615106, -20.328477391647795],
                  [-50.7602712672069, -20.327511570518727]]]),
            {
              "reference": 3,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.20148228534142, -20.204078545941023],
                  [-51.19719075091759, -20.201984247654018],
                  [-51.19993733294884, -20.200695434706894]]]),
            {
              "reference": 3,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-51.18483113177697, -20.20552842825252],
                  [-51.17985295184533, -20.212294367153095],
                  [-51.180367935976186, -20.20649500895855]]]),
            {
              "reference": 3,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.14866927244742, -21.55539486025815],
                  [-48.147810965562655, -21.55204204846055],
                  [-48.15364745237906, -21.553319319235683]]]),
            {
              "reference": 3,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.092879324937655, -21.497268493304663],
                  [-48.08378127195914, -21.49519212160667],
                  [-48.09099104979117, -21.491358742158123]]]),
            {
              "reference": 3,
              "system:index": "8"
            })]);
            
// --- 1. GENERAL CONFIGURATIONS AND PATHS ---

// Unique identifier for the specific geographic region being processed
var regiaoID = 'reg_18';

// Manual definition of a specific year, used as a reference point for individual operations
var ano = 2020; 

// Base directory path for saving the resulting sample assets in the MapBiomas repository
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Import of auxiliary feature collections representing regional boundaries
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Filter the master collection to obtain the specific geometry of region 'reg_18'
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

    // Define the specific subset of band names to be used as features for the sampling process for 'reg_18'
    var bandNames = ee.List([
      'gcvi_max',	'savi_median_wet',	'red_median',	'gcvi_median_wet',	'gcvi_median_dry',	'gcvi_stdDev',	'red_median_wet',	'red_min',	
      'swir2_median',	'gcvi_median',	'swir1_max',	'green_min',	'nir_stdDev',	'gcvi_min',	'wefi_stdDev',	'evi2_median_wet',	'cai_median_wet',	
      'hallheigth_max',	'ndvi_median',	'red_stdDev',	'savi_max',	'ndwi_median_wet',	'evi2_max',	'green_median',	'hallcover_max',	
      'green_median_dry',	'ndvi_median_wet',	'gcvi_amp',	'hallheigth_median_dry',	'hallcover_min',	'cai_max',	'swir2_min',	'swir2_median_wet',	
      'green_median_wet',	'fns_stdDev',	'ndwi_max',	'ndwi_amp',	'green_median_texture',	'ndvi_max',	'evi2_amp',	'hallcover_median_wet',	'blue_median',	
      'red_amp',	'ndvi_stdDev',	'swir2_median_dry',	'red_median_dry',	'hallcover_median',	'hallcover_median_dry',	'swir1_median',	'swir1_stdDev',	
      'evi2_median',	'evi2_median_dry',	'savi_median_dry',	'savi_median',	'npv_stdDev',	'blue_median_dry',	'cai_median',	
      'latitude','longitude','slope',
    ]);
  
    /**
     * OPTIMIZED VERSION: Dynamic processing per land cover class
     */

    // --- 1. CLASS DEFINITIONS (Configuration Dictionary) ---
    // Mapping table defining available class variables, sample quotas, numeric legend references, and class names
    var classConfigs = [
      {variable: typeof flo     !== 'undefined' ? flo     : null, number: 150, ref: 3,  name: 'floresta'},
      {variable: typeof sav     !== 'undefined' ? sav     : null, number: 0, ref: 4,  name: 'savana'},
      {variable: typeof reflo   !== 'undefined' ? reflo   : null, number: 0, ref: 9,  name: 'reflo'},
      {variable: typeof varzea  !== 'undefined' ? varzea  : null, number: 1200, ref: 11, name: 'varzea'},
      {variable: typeof campo   !== 'undefined' ? campo   : null, number: 0, ref: 12, name: 'campo'},
      {variable: typeof agro    !== 'undefined' ? agro    : null, number: 2000, ref: 21, name: 'agro'},
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
    // Function designed to extract raster pixel values using spatial geometries for region 'reg_18'
    var getTrainingSamples = function(classObj) {
      // Filter the class geometries by the current regional limit ('reg_18')
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
    // Iterate through active classes to collect samples for the specific year in region 'reg_18'
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

  // Export the final multi-year batch collection for 'reg_18' as an Earth Engine Asset
  Export.table.toAsset({
    collection: amostras,
    description: 'amostras_complementares_'+batch+'_'+regiaoID,
    assetId: dirout + 'amostras_complementares_'+batch+'_'+regiaoID,
    overwrite: true
  });

} 

// Print the names of classes that were successfully processed to the console for verification in 'reg_18'
print('Classes processadas:', classesAtivas.map(function(i){return i.name}));