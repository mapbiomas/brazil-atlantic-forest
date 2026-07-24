/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Extraction of complementary training samples for land cover classification, focusing on the region 'reg_15'.
 * 
 * DESCRIPTION:
 * This script automates the process of collecting training samples across multiple years and classes 
 * within the Atlantic Forest biome, specifically configured for the region identified as 'reg_15'. 
 * It utilizes custom Landsat mosaics, cluster data, and auxiliary environmental variables. The 
 * process is organized into multi-year batches to optimize Google Earth Engine processing limits. 
 * For each year, it builds a multi-band image including spectral metrics, temporal statistics 
 * (median, wet/dry seasons), and terrain data. Stratified sampling is performed based on 
 * user-defined geometries for the specific classes of interest in this region: Wetland/Varzea 
 * (600 samples) and Agriculture (500 samples). The resulting feature collections are exported 
 * as Assets for use in machine learning classifiers.
 */

// Define FeatureCollection variables to store complementary spatial samples
var varzea = /* color: #0b4a8b */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.74662801066815, -25.94554481245618],
                  [-49.72379704753338, -25.936591611029993],
                  [-49.72551366130291, -25.934584765623963],
                  [-49.73203679362713, -25.938444053369196],
                  [-49.74353810588299, -25.942611942119665]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.64370695690094, -25.902933838626115],
                  [-49.650916734732974, -25.90895588892433],
                  [-49.65126005748688, -25.912198404050407],
                  [-49.64302031139313, -25.90571328465645]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.5947834644693, -25.853356059518976],
                  [-49.592723527945864, -25.858453800110752],
                  [-49.58826033214508, -25.860152998127276],
                  [-49.59135023693024, -25.857990378230884],
                  [-49.592723527945864, -25.85644562551102],
                  [-49.593238512076724, -25.853047098479486]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.479336479127326, -25.908175376313],
                  [-49.47598908227674, -25.909796655747975],
                  [-49.47847817224256, -25.90539598829269]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.3747467528651, -25.8109713515088],
                  [-49.37680668938854, -25.812516697936857],
                  [-49.37654919732311, -25.813212097252357],
                  [-49.37543339837291, -25.81259396472907],
                  [-49.37448926079967, -25.81189856178478]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.200897092994005, -25.84035151081994],
                  [-49.205875272925645, -25.84066050502491],
                  [-49.199867124732286, -25.84266894768564]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.21308505075768, -25.834325962529036],
                  [-49.21119677561119, -25.84066050502491],
                  [-49.21068179148033, -25.837261524385486]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.115238065894395, -25.84884855737565],
                  [-49.111976499732286, -25.853792012654807],
                  [-49.11214816110924, -25.85101134448894]]]),
            {
              "reference": 11,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.34341509138304, -25.63154289492514],
                  [-49.337235281812724, -25.629530881549808],
                  [-49.3387802342053, -25.62829270262422]]]),
            {
              "reference": 11,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.391651938306865, -25.631388125869],
                  [-49.39422685896116, -25.63572158361635],
                  [-49.388905356275615, -25.632161969143844]]]),
            {
              "reference": 11,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.24752722870322, -25.583134256164772],
                  [-49.24546729217978, -25.58561153676646],
                  [-49.24529563080283, -25.58266976034289]]]),
            {
              "reference": 11,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.23053275238486, -25.573534309504808],
                  [-49.23070441376181, -25.571366473067783],
                  [-49.232936011662204, -25.57477305556033]]]),
            {
              "reference": 11,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.134200373733705, -25.43027992729637],
                  [-49.130938807571596, -25.429659810319084],
                  [-49.133170405471986, -25.42872962886975]]]),
            {
              "reference": 11,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.46601619231077, -25.467820776915136],
                  [-49.466874499195534, -25.472315127864483],
                  [-49.46498622404905, -25.47479469788076],
                  [-49.46447123991819, -25.46735583447406]]]),
            {
              "reference": 11,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.59689502816849, -25.61303989880281],
                  [-49.58642368417435, -25.61830274248403],
                  [-49.59346180062943, -25.61303989880281]]]),
            {
              "reference": 11,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.89930907089486, -25.580965815600717],
                  [-49.89656248886361, -25.582978646466163],
                  [-49.89724913437142, -25.580501311362916]]]),
            {
              "reference": 11,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.087479738775194, -25.660509486054515],
                  [-50.08885302979082, -25.664377708173003],
                  [-50.0849048181209, -25.664841886395095]]]),
            {
              "reference": 11,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.153397707525194, -25.689595439558808],
                  [-50.15545764404863, -25.69454553310202],
                  [-50.152367739263475, -25.696092395138145]]]),
            {
              "reference": 11,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.178557883863455, -25.773619006955503],
                  [-50.17890120661736, -25.783666563843763],
                  [-50.17495299494744, -25.78042052313301]]]),
            {
              "reference": 11,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.48761084178784, -26.00523456453321],
                  [-50.48692419628003, -26.009091534895628],
                  [-50.48211767772534, -26.002766037025076]]]),
            {
              "reference": 11,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.6202072784614, -26.058882907350412],
                  [-50.622610537738744, -26.060579213939242],
                  [-50.61797568056101, -26.05980816853432]]]),
            {
              "reference": 11,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.40279880069249, -25.154016048785426],
                  [-50.403828768954206, -25.163027899044195],
                  [-50.39970889590733, -25.164892336663154]]]),
            {
              "reference": 11,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.40623202823155, -25.17499087838358],
                  [-50.41224017642491, -25.181515645072746],
                  [-50.40314212344639, -25.177010486350976]]]),
            {
              "reference": 11,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.4254581024503, -25.180738905450436],
                  [-50.421853213534284, -25.188661417289154],
                  [-50.422883181796, -25.182137033205944]]]),
            {
              "reference": 11,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.4575795989935, -25.256073803745508],
                  [-50.46084116515561, -25.259489305267536],
                  [-50.458609567255216, -25.266320020108925]]]),
            {
              "reference": 11,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.5703611236517, -25.284326425872084],
                  [-50.57619761046811, -25.284326425872084],
                  [-50.56915949401303, -25.28991407739924]]]),
            {
              "reference": 11,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.54959009704037, -25.392590916503508],
                  [-50.54770182189389, -25.396777930990417],
                  [-50.54718683776303, -25.39104013353736]]]),
            {
              "reference": 11,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.42788218078061, -25.37196387373206],
                  [-50.42685221251889, -25.381579926046008],
                  [-50.426165567011076, -25.373980206192545]]]),
            {
              "reference": 11,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.43200205382748, -25.509182336314424],
                  [-50.429942117304044, -25.50685840602088],
                  [-50.43097208556576, -25.504999229404593],
                  [-50.429427133173185, -25.503914696420026],
                  [-50.431143746942716, -25.5026752181599]]]),
            {
              "reference": 11,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.301948836927224, -25.84243037035703],
                  [-50.30933027613621, -25.847837557398307],
                  [-50.31036024439793, -25.852626573770156],
                  [-50.3034937893198, -25.847683069770348]]]),
            {
              "reference": 11,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.42090279828221, -25.932270537467847],
                  [-50.41712624798924, -25.930109238657884],
                  [-50.418671200381816, -25.928411047497313]]]),
            {
              "reference": 11,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.40040558737677, -24.621366337925785],
                  [-50.39800232809942, -24.63197756384256],
                  [-50.39491242331427, -24.630729231081723]]]),
            {
              "reference": 11,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.08409240076427, -25.360224839840114],
                  [-50.083749078010364, -25.35557118451603],
                  [-50.08855559656505, -25.354950683605086]]]),
            {
              "reference": 11,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.466727438105885, -25.969952626136823],
                  [-50.45883101476604, -25.97828602487863],
                  [-50.458487692012135, -25.973656431809445]]]),
            {
              "reference": 11,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.27814319860324, -26.26373239934019],
                  [-50.28260639440402, -26.273584154657236],
                  [-50.278486521357145, -26.274815565283365],
                  [-50.27230671178683, -26.265579667144443]]]),
            {
              "reference": 11,
              "system:index": "34"
            })]),
    agro = /* color: #00ff00 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.54665635689521, -23.854959175784394],
                  [-50.54790090187812, -23.85397794259334],
                  [-50.54824422463203, -23.854959175784394],
                  [-50.547557579124216, -23.855626410109842]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.5454118119123, -23.85295745219229],
                  [-50.54472516640449, -23.851819203417712],
                  [-50.546870933616404, -23.851976203843105],
                  [-50.54644178017402, -23.85303595173924]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.60829244137586, -23.848063263122572],
                  [-50.61005197048963, -23.84892678813408],
                  [-50.60829244137586, -23.84931929760104]]]),
            {
              "reference": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.609833065400515, -23.880923715466526],
                  [-50.61103469503919, -23.880413577432854],
                  [-50.61142093313733, -23.87951102060098],
                  [-50.612107578645144, -23.880217369961365],
                  [-50.61176425589124, -23.88111992186711],
                  [-50.61039096487561, -23.88166929820611]]]),
            {
              "reference": 21,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.618845287690554, -23.936477474060098],
                  [-50.61571246756116, -23.936987390849858],
                  [-50.61639911306897, -23.93561453336515]]]),
            {
              "reference": 21,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.60763816869603, -23.929588569773838],
                  [-50.606736946467024, -23.92868635622176],
                  [-50.60665111577855, -23.927980271653166],
                  [-50.60858230626927, -23.928215633605046]]]),
            {
              "reference": 21,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.64896564519749, -23.93331503721145],
                  [-50.648922729853254, -23.931471429922805],
                  [-50.649866867426496, -23.932412849700125]]]),
            {
              "reference": 21,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.66064270521134, -23.994250198956745],
                  [-50.65935524488419, -23.995583225609845],
                  [-50.65875443006485, -23.993936543620368]]]),
            {
              "reference": 21,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.68154247785538, -24.00044473523653],
                  [-50.68051250959366, -24.001307241956663],
                  [-50.68004044080704, -24.00005268481632],
                  [-50.68124207044571, -23.998523676765192]]]),
            {
              "reference": 21,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.32838764946234, -24.45924612074729],
                  [-50.33345166008246, -24.457917939448134],
                  [-50.32795849601996, -24.461199303099015]]]),
            {
              "reference": 21,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.29645863334906, -24.450417358708886],
                  [-50.3014368132807, -24.448854681520814],
                  [-50.29817524711859, -24.451901884088343]]]),
            {
              "reference": 21,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.33345166008246, -24.43814982184312],
                  [-50.33370915214789, -24.4362744243869],
                  [-50.33516827385199, -24.436821418193],
                  [-50.33542576591742, -24.440650308393078]]]),
            {
              "reference": 21,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.873576444878495, -24.49759065678499],
                  [-50.87786797930232, -24.497043926903125],
                  [-50.8779538099908, -24.500324270534634]]]),
            {
              "reference": 21,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.91159943987361, -24.521332060548133],
                  [-50.915290159478104, -24.522191040405854],
                  [-50.91082696367732, -24.52437750807957]]]),
            {
              "reference": 21,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.81892398068123, -24.555237985583815],
                  [-50.82175639340095, -24.552739776668595],
                  [-50.82312968441658, -24.554457300643662],
                  [-50.82132723995857, -24.55555025819908]]]),
            {
              "reference": 21,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.824245483366774, -24.560468449312754],
                  [-50.82776454159431, -24.560624579204603],
                  [-50.827936202971266, -24.561561354472655],
                  [-50.82364466854744, -24.561405225747393]]]),
            {
              "reference": 21,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.85797694393806, -24.599807030512203],
                  [-50.85909274288826, -24.59824621114796],
                  [-50.863641769377516, -24.598324252578468],
                  [-50.861152679411695, -24.599807030512203]]]),
            {
              "reference": 21,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.849175320497686, -24.621303895361656],
                  [-50.85200773321741, -24.62083573206082],
                  [-50.85106359564417, -24.622864427036394]]]),
            {
              "reference": 21,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.915865765443975, -24.642837511699295],
                  [-50.91732488714808, -24.641667301828416],
                  [-50.91904150091761, -24.642993538853705],
                  [-50.916895733705694, -24.643773671701982]]]),
            {
              "reference": 21,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.92670268060106, -24.685336153352768],
                  [-50.924814405454576, -24.685648101198577],
                  [-50.92429942132372, -24.68447829275156],
                  [-50.925930200270095, -24.68451729058684]]]),
            {
              "reference": 21,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.861842137345, -24.79535447274916],
                  [-50.86064050770633, -24.797302409569877],
                  [-50.85806558705203, -24.797302409569877],
                  [-50.85789392567508, -24.795744062560928]]]),
            {
              "reference": 21,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.850512486466094, -24.804314728774],
                  [-50.85162828541629, -24.80556132177977],
                  [-50.847765904434844, -24.805483410084154]]]),
            {
              "reference": 21,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.88481303804478, -24.93724280265871],
                  [-50.88386890047154, -24.93521923969132],
                  [-50.88687297456822, -24.935764048374462]]]),
            {
              "reference": 21,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.855029789143416, -24.938643711400818],
                  [-50.853828159504744, -24.939577641713594],
                  [-50.852025715046736, -24.93942198715307],
                  [-50.85348483675084, -24.938410227716517]]]),
            {
              "reference": 21,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.851768222981306, -24.9236998637957],
                  [-50.85211154573521, -24.922298785200447],
                  [-50.853570667439314, -24.923232839366197],
                  [-50.85374232881627, -24.924945253626095]]]),
            {
              "reference": 21,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.82962390535435, -24.971249251815685],
                  [-50.82764979951939, -24.968837204555193],
                  [-50.829108921223494, -24.968059114707017]]]),
            {
              "reference": 21,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.88833209627232, -25.008279908926802],
                  [-50.88781711214146, -25.006568653877846],
                  [-50.88970538728795, -25.006179728950897]]]),
            {
              "reference": 21,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.59060639304083, -24.797582847021523],
                  [-50.58717316550177, -24.801011133759463],
                  [-50.58442658347052, -24.79851784371337]]]),
            {
              "reference": 21,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.18960193669829, -25.671919891747432],
                  [-49.1847954181436, -25.679964882761823],
                  [-49.18136219060454, -25.676870719716657],
                  [-49.18376544988188, -25.67253875648972]]]),
            {
              "reference": 21,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.74338153874907, -25.72141891326965],
                  [-49.7396049884561, -25.72760484368893],
                  [-49.73891834294829, -25.72327472618119]]]),
            {
              "reference": 21,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-50.570446052909226, -25.63013909640098],
                  [-50.56838611638579, -25.636948816336307],
                  [-50.56701282537016, -25.631067717441628]]]),
            {
              "reference": 21,
              "system:index": "30"
            })]),
    table = ee.FeatureCollection("projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_comp_2020");
    
// --- 1. GENERAL CONFIGURATIONS AND PATHS ---

// Unique identifier for the specific geographic region being processed
var regiaoID = 'reg_15';

// Manual definition of a specific year, used as a reference point for individual operations
var ano = 2020; 

// Base directory path for saving the resulting sample assets in the MapBiomas repository
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Import of auxiliary feature collections representing regional boundaries
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Filter the master collection to obtain the specific geometry of region 'reg_15'
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

    // Define the specific subset of band names to be used as features for the sampling process for 'reg_15'
    var bandNames = ee.List([
      'swir1_median',	'ndvi_median_dry',	'nir_median',	'cai_min',	'evi2_median',	'green_median_wet',	'gcvi_max',	'swir2_min',	
      'shade_median',	'green_max',	'evi2_median_dry',	'nir_median_wet',	'red_stdDev',	'red_median_wet',	'gcvi_median',	'soil_stdDev',	
      'green_min',	'savi_median_dry',	'savi_median',	'hallheigth_median_wet',	'hallcover_median_wet',	'green_median',	'ndvi_max',	'gcvi_min',	
      'ndvi_min',	'gcvi_median_dry',	'hallheigth_median_dry',	'ndvi_median',	'swir1_max',	'ndwi_median',	'green_median_texture',	
      'ndvi_median_wet',	'blue_median',	'swir2_median',	'ndwi_median_dry',	'red_max',	'nir_min',	'cai_max',	'gvs_median',	'swir2_max',
      'red_median',	'swir1_median_dry',	'swir1_min',	'ndfi_median',	'wefi_min',	'hallcover_median_dry',	'savi_min',	'ndfi_amp',	'ndvi_amp',	
      'evi2_max',	'swir1_amp',	'evi2_min',	'swir2_median_wet',	'evi2_amp',	'cai_median_dry',	'blue_min',	'nir_max', 'latitude', 'longitude', 'slope',
    ]);
  
    /**
     * OPTIMIZED VERSION: Dynamic processing per land cover class
     */

    // --- 1. CLASS DEFINITIONS (Configuration Dictionary) ---
    // Mapping table defining available class variables, sample quotas, numeric legend references, and class names
    var classConfigs = [
      {variable: typeof flo     !== 'undefined' ? flo     : null, number: 0, ref: 3,  name: 'floresta'},
      {variable: typeof sav     !== 'undefined' ? sav     : null, number: 0, ref: 4,  name: 'savana'},
      {variable: typeof reflo   !== 'undefined' ? reflo   : null, number: 0, ref: 9,  name: 'reflo'},
      {variable: typeof varzea  !== 'undefined' ? varzea  : null, number: 600, ref: 11, name: 'varzea'},
      {variable: typeof campo   !== 'undefined' ? campo   : null, number: 0, ref: 12, name: 'campo'},
      {variable: typeof agro    !== 'undefined' ? agro    : null, number: 500, ref: 21, name: 'agro'},
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
    // Function designed to extract raster pixel values using spatial geometries for region 'reg_15'
    var getTrainingSamples = function(classObj) {
      // Filter the class geometries by the current regional limit ('reg_15')
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
    // Iterate through active classes to collect samples for the specific year in region 'reg_15'
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

  // Export the final multi-year batch collection for 'reg_15' as an Earth Engine Asset
  Export.table.toAsset({
    collection: amostras,
    description: 'amostras_complementares_'+batch+'_'+regiaoID,
    assetId: dirout + 'amostras_complementares_'+batch+'_'+regiaoID,
    overwrite: true
  });

} 

// Print the names of classes that were successfully processed to the console for verification in 'reg_15'
print('Classes processadas:', classesAtivas.map(function(i){return i.name}));