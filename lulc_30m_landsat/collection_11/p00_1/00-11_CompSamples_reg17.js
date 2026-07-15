/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Extraction of complementary training samples for land cover classification, focusing on the region 'reg_17'.
 * 
 * DESCRIPTION:
 * This script automates the process of collecting training samples across multiple years and classes 
 * within the Atlantic Forest biome, specifically configured for the region identified as 'reg_17'. 
 * It utilizes custom Landsat mosaics, cluster data, and auxiliary environmental variables. The 
 * process is organized into multi-year batches to optimize Google Earth Engine processing limits. 
 * For each year, it builds a multi-band image including spectral metrics, temporal statistics 
 * (median, wet/dry seasons), and terrain data. Stratified sampling is performed based on 
 * user-defined geometries for the specific classes of interest in this region: Forest (600 samples), 
 * Wetland/Varzea (1200 samples), and Agriculture (200 samples). The resulting feature collections 
 * are exported as Assets for use in machine learning classifiers.
 */

// Define FeatureCollection variables to store complementary spatial samples
var varzea = /* color: #ffc82d */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.98359395434208, -22.685500152072414],
                  [-42.98359395434208, -22.69167686869919],
                  [-42.97998906542607, -22.687242331101757]]]),
            {
              "reference": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.0201578276331, -22.680115095076907],
                  [-43.01535130907841, -22.680907028489923],
                  [-43.01243306567021, -22.677580877416172],
                  [-43.01809789110966, -22.677264096915238]]]),
            {
              "reference": 11,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.96705955399438, -22.731843527774334],
                  [-42.96362632645532, -22.737543192396373],
                  [-42.96242469681665, -22.731526872773927]]]),
            {
              "reference": 11,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.97581428421899, -22.74213441610501],
                  [-42.978732527627194, -22.743875874414027],
                  [-42.978217543496335, -22.745775621808804],
                  [-42.973239363564694, -22.744667439037705]]]),
            {
              "reference": 11,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.91704419281699, -22.66854000070204],
                  [-42.9287171664498, -22.678994035874194],
                  [-42.92597058441855, -22.682478537166464],
                  [-42.91567090180136, -22.67012399664464]]]),
            {
              "reference": 11,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.83136744528152, -22.53528777894981],
                  [-42.82896418600418, -22.534653561718446],
                  [-42.8303374770198, -22.525615649700057]]]),
            {
              "reference": 11,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.802049072645914, -22.48748789978298],
                  [-42.80840054359318, -22.492563287504062],
                  [-42.80119076576115, -22.489549798493353]]]),
            {
              "reference": 11,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.58035460234999, -22.584341005216274],
                  [-42.587049396051164, -22.587986400868303],
                  [-42.58018294097304, -22.58608446734786],
                  [-42.57589140654921, -22.582756020493257]]]),
            {
              "reference": 11,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.39427845082065, -22.540824349607636],
                  [-42.396681710097994, -22.535750733640484],
                  [-42.396681710097994, -22.54129999154514]]]),
            {
              "reference": 11,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.26628132980249, -22.577306105347354],
                  [-42.260616504363036, -22.575404024375434],
                  [-42.26507970016382, -22.571124246203468]]]),
            {
              "reference": 11,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.309539996794676, -22.58459717250291],
                  [-42.30353184860132, -22.58364618562595],
                  [-42.302330218962645, -22.581902692633857],
                  [-42.30490513961694, -22.581902692633857]]]),
            {
              "reference": 11,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.33940907638452, -22.697559306506804],
                  [-42.341812335661864, -22.702468594925314],
                  [-42.33563252609155, -22.699618061782342]]]),
            {
              "reference": 11,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.3574335209646, -22.641644362713382],
                  [-42.35108205001733, -22.643070239236927],
                  [-42.35297032516382, -22.639743170991267]]]),
            {
              "reference": 11,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.35571690719507, -22.73081233385591],
                  [-42.35537358444116, -22.739520124685832],
                  [-42.35314198654077, -22.73698700636918]]]),
            {
              "reference": 11,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.56436339159378, -22.791411200037995],
                  [-42.556981952384795, -22.791569458214106],
                  [-42.560758502677764, -22.79014512801694]]]),
            {
              "reference": 11,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.440374581144816, -22.91165190739608],
                  [-42.450159279631144, -22.908647625122395],
                  [-42.44106122665263, -22.914814237861982]]]),
            {
              "reference": 11,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.457884041594035, -22.923352161568815],
                  [-42.45307752303935, -22.923826474890134],
                  [-42.45633908920146, -22.920822462478075]]]),
            {
              "reference": 11,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.537534920500285, -22.874647162180917],
                  [-42.54216977767802, -22.873223701248516],
                  [-42.53890821151591, -22.8776521973742]]]),
            {
              "reference": 11,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.07439078824442, -22.606859071640816],
                  [-42.076279063390906, -22.613039326736665],
                  [-42.072845835851844, -22.610979272552907]]]),
            {
              "reference": 11,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.11110972972596, -22.603674283777938],
                  [-42.11334132762635, -22.608586930580888],
                  [-42.10956477733338, -22.606209865319073]]]),
            {
              "reference": 11,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.2450056037494, -22.62728507811294],
                  [-42.244318958241585, -22.633464415256043],
                  [-42.24225902171815, -22.629027996205693]]]),
            {
              "reference": 11,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.036485770709184, -22.360485628701944],
                  [-42.03734407759395, -22.37128047694871],
                  [-42.03408251143184, -22.37350284181255],
                  [-42.03288088179317, -22.360803136182703]]]),
            {
              "reference": 11,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.949623216428655, -22.30195524498574],
                  [-41.96627436999311, -22.315295534128545],
                  [-41.96404277209272, -22.320377213769802],
                  [-41.95030986193647, -22.308149109149088]]]),
            {
              "reference": 11,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.96868878972012, -22.205450666491448],
                  [-41.96319562565762, -22.201636293504436],
                  [-41.9650839008041, -22.19623242103046]]]),
            {
              "reference": 11,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-44.084402965269746, -22.93024293018815],
                  [-44.0900677907092, -22.932614359548072],
                  [-44.082171367369355, -22.933879104894036]]]),
            {
              "reference": 11,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.80136258381479, -22.89908746392535],
                  [-43.79020459431284, -22.900510653630025],
                  [-43.794839451490574, -22.896241039719605]]]),
            {
              "reference": 11,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.74497182148569, -22.93165895285038],
                  [-43.74617345112436, -22.927232219897693],
                  [-43.75346905964487, -22.930710379397496]]]),
            {
              "reference": 11,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.70913977315051, -22.94865844881265],
                  [-43.71592039754016, -22.94589210505717],
                  [-43.705534884234496, -22.95466517195022]]]),
            {
              "reference": 11,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.69738096882922, -22.95577164449252],
                  [-43.697810122271605, -22.951898951000615],
                  [-43.69909758259875, -22.95490227397118]]]),
            {
              "reference": 11,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.59146940815303, -23.026504668181943],
                  [-43.58983862507198, -23.029901283236914],
                  [-43.58820784199092, -23.02761055224763]]]),
            {
              "reference": 11,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.60580313312862, -23.01315435202168],
                  [-43.61266958820674, -23.010468329916847],
                  [-43.60717642414424, -23.01426034557866]]]),
            {
              "reference": 11,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.572157503245805, -23.00699222192656],
                  [-43.572672487376664, -23.003990056594823],
                  [-43.57747900593135, -23.011100339929357]]]),
            {
              "reference": 11,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.627345419229016, -22.78480726868021],
                  [-43.62648711234425, -22.790029944423278],
                  [-43.62442717582081, -22.786389918812784]]]),
            {
              "reference": 11,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.58872028104223, -22.56035934285139],
                  [-43.586832005895744, -22.56146901436863],
                  [-43.583570439733634, -22.55734733229783]]]),
            {
              "reference": 11,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.58940692655004, -22.5479938276863],
                  [-43.59146686307348, -22.55132311387641],
                  [-43.58597369901098, -22.548152366945395]]]),
            {
              "reference": 11,
              "system:index": "34"
            })]),
    agro = /* color: #009999 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.96261436173943, -17.99155338973359],
                  [-48.9634726686242, -17.98983907276506],
                  [-48.96587592790154, -17.98967580361363],
                  [-48.9634726686242, -17.99294115793627]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.930599514937676, -17.99604318856042],
                  [-48.92725211808709, -17.99677787203375],
                  [-48.928625409102715, -17.994573812433195],
                  [-48.93017036149529, -17.994492180067233]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.93815261552361, -18.00118590860289],
                  [-48.94055587480096, -17.99759418341482],
                  [-48.94081336686639, -18.001512425446883]]]),
            {
              "reference": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.87973353702327, -17.987471655283194],
                  [-48.87750193912288, -17.985430752652128],
                  [-48.88127848941585, -17.986002207767882]]]),
            {
              "reference": 21,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.801198457067215, -18.011062775594187],
                  [-48.80179927188655, -18.007961009207516],
                  [-48.80265757877132, -18.010899526092743]]]),
            {
              "reference": 21,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.78592059451839, -17.998410491017566],
                  [-48.78592059451839, -18.00053287310098],
                  [-48.78463313419124, -18.001838941686227],
                  [-48.78463313419124, -17.99906353437925]]]),
            {
              "reference": 21,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.783002351110184, -17.99979820527051],
                  [-48.78188655215999, -18.00175731268308],
                  [-48.78137156802913, -17.9995533153135]]]),
            {
              "reference": 21,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.72486654117227, -18.006083597770488],
                  [-48.725724848057034, -18.003634770194147],
                  [-48.72812810733438, -18.0077977568329]]]),
            {
              "reference": 21,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.73774114444375, -17.985594025731153],
                  [-48.73405042483926, -17.984859295686057],
                  [-48.73456540897012, -17.982818362846366],
                  [-48.73774114444375, -17.984696021927334]]]),
            {
              "reference": 21,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.70366636111856, -18.025591375401806],
                  [-48.70727125003457, -18.026162700340254],
                  [-48.7086445410502, -18.02567299336366],
                  [-48.7101036627543, -18.026244318037268],
                  [-48.70787206485391, -18.027631813097504],
                  [-48.70366636111856, -18.027142110207205]]]),
            {
              "reference": 21,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.678517969394925, -18.07023074667662],
                  [-48.68066373660684, -18.06990435732005],
                  [-48.68014875247598, -18.071862684359626],
                  [-48.67843213870645, -18.072597051368742]]]),
            {
              "reference": 21,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.72397714283807, -18.08801814517051],
                  [-48.72526460316522, -18.085570458267384],
                  [-48.72852616932733, -18.08720225333067],
                  [-48.72432046559198, -18.089731505682114]]]),
            {
              "reference": 21,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.77504640248163, -18.13272321209055],
                  [-48.77641969349725, -18.131336547588283],
                  [-48.77753549244745, -18.134273000587363]]]),
            {
              "reference": 21,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.819077545670105, -18.15311406754604],
                  [-48.81890588429315, -18.15123820817831],
                  [-48.820536667374206, -18.150096370878963],
                  [-48.821566635635925, -18.152135360822896]]]),
            {
              "reference": 21,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.796332413223816, -18.11983496556798],
                  [-48.79504495289667, -18.11844819895633],
                  [-48.796589905289245, -18.117714023950885]]]),
            {
              "reference": 21,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.853401597452574, -18.180766154484466],
                  [-48.84971087784808, -18.18043997118004],
                  [-48.85048335404437, -18.17954296394843],
                  [-48.854603227091246, -18.179053685332853]]]),
            {
              "reference": 21,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.87915080399554, -18.16910472261492],
                  [-48.87975161881488, -18.166413512311703],
                  [-48.88189738602679, -18.1661688547727],
                  [-48.88069575638812, -18.168615414736173]]]),
            {
              "reference": 21,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.83494799943011, -18.205717368766255],
                  [-48.835634644937926, -18.204494353277347],
                  [-48.836922105265074, -18.206125038687894],
                  [-48.8357204756264, -18.20702190915732]]]),
            {
              "reference": 21,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.82207339615863, -18.20742957602602],
                  [-48.81932681412738, -18.20783724194063],
                  [-48.81949847550433, -18.20661424133457],
                  [-48.82198756547015, -18.206125038687894]]]),
            {
              "reference": 21,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.058258159111475, -18.312393444521742],
                  [-49.06057558770034, -18.310030392076097],
                  [-49.06357966179702, -18.310030392076097],
                  [-49.06306467766616, -18.312393444521742],
                  [-49.06031809563491, -18.312393444521742]]]),
            {
              "reference": 21,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.17617438056489, -18.36848296177903],
                  [-49.179264285350044, -18.366690885891643],
                  [-49.182697512889106, -18.369297535575356],
                  [-49.180980899119575, -18.371904145881064]]]),
            {
              "reference": 21,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.32998297431489, -18.412627313721725],
                  [-49.327837207102974, -18.40896262282499],
                  [-49.33144209601899, -18.41124288410863]]]),
            {
              "reference": 21,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.299598910594185, -18.405705054310427],
                  [-49.30328963019868, -18.409532690977713],
                  [-49.2991697571518, -18.41132432145294]]]),
            {
              "reference": 21,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.29127333381196, -18.41425604018576],
                  [-49.29101584174653, -18.41205725581788],
                  [-49.29273245551606, -18.41344167888046]]]),
            {
              "reference": 21,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.36268550598789, -18.421366461366524],
                  [-49.361827199103125, -18.419004900553734],
                  [-49.36689120972324, -18.42112216347543]]]),
            {
              "reference": 21,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.43450755872032, -18.42246400438088],
                  [-49.43570918835899, -18.419288124998783],
                  [-49.43742580212852, -18.4214053844348],
                  [-49.43596668042442, -18.42197541136915]]]),
            {
              "reference": 21,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.45011286234884, -18.453459416769668],
                  [-49.44556383585958, -18.45248240557926],
                  [-49.447709603071495, -18.45077262261977]]]),
            {
              "reference": 21,
              "system:index": "26"
            })]),
    flo = /* color: #ff00ff */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.95002566094253, -18.2553452488138],
                  [-48.948652369926904, -18.257138477638566],
                  [-48.94702158684585, -18.255834313056603],
                  [-48.94856653923843, -18.25355200147609]]]),
            {
              "reference": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-48.9402409624562, -18.260887896260698],
                  [-48.93826685662124, -18.25836112304031],
                  [-48.94101343865249, -18.25852414177689]]]),
            {
              "reference": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.11911211724136, -18.281834245015933],
                  [-49.119197947929834, -18.27759627732893],
                  [-49.121172053764795, -18.278981778157334],
                  [-49.12100039238784, -18.281915743379706]]]),
            {
              "reference": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-49.04143534417007, -18.322008290768107],
                  [-49.04117785210464, -18.320786094186133],
                  [-49.04263697380874, -18.31964536958762],
                  [-49.04332361931655, -18.320704614107047],
                  [-49.042293651054834, -18.321356453665373]]]),
            {
              "reference": 3,
              "system:index": "3"
            })]);
            
// --- 1. GENERAL CONFIGURATIONS AND PATHS ---

// Unique identifier for the specific geographic region being processed
var regiaoID = 'reg_17';

// Manual definition of a specific year, used as a reference point for individual operations
var ano = 2020; 

// Base directory path for saving the resulting sample assets in the MapBiomas repository
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Import of auxiliary feature collections representing regional boundaries for the Atlantic Forest
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Filter the master collection to obtain the specific geometry of region 'reg_17'
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

    // Define the specific subset of band names to be used as features for the sampling process for 'reg_17'
    var bandNames = ee.List([
      'red_min',	'hallheigth_median_dry',	'evi2_min',	'evi2_max',	'red_median_dry',	'green_median_wet',	'ndvi_max',	'gcvi_median_dry',	
      'hallheigth_max',	'swir2_median',	'red_median',	'gv_max',	'hallcover_median',	'green_min',	'savi_median_wet',	'swir2_amp',	'gvs_stdDev',	
      'gcvi_median',	'shade_median_dry',	'fns_stdDev',	'ndvi_stdDev',	'hallcover_max',	'swir2_median_dry',	'ndvi_median_wet',	'red_max',	
      'gcvi_stdDev',	'savi_median',	'evi2_median',	'fns_median_dry',	'ndvi_min',	'red_stdDev',	'shade_max',	'ndwi_amp',	'red_amp',	
      'hallcover_stdDev',	'wefi_median',	'green_median_dry',	'savi_min',	'hallcover_median_wet',	'wefi_median_wet',	'ndvi_median',	
      'green_max',	'savi_stdDev',	'gvs_median',	'swir1_min',	'wefi_amp',	'blue_median_dry',	'hallheigth_median',	'swir1_median',	
      'gcvi_amp',	'red_median_wet',	'gcvi_median_wet',	'evi2_stdDev',	'green_median',	'swir2_stdDev',	'sefi_median',	'gv_stdDev', 'latitude', 'longitude', 'slope',
    ]);
  
    /**
     * OPTIMIZED VERSION: Dynamic processing per land cover class
     */

    // --- 1. CLASS DEFINITIONS (Configuration Dictionary) ---
    // Mapping table defining available class variables, sample quotas, numeric legend references, and class names
    var classConfigs = [
      {variable: typeof flo     !== 'undefined' ? flo     : null, number: 600, ref: 3,  name: 'floresta'},
      {variable: typeof sav     !== 'undefined' ? sav     : null, number: 0, ref: 4,  name: 'savana'},
      {variable: typeof reflo   !== 'undefined' ? reflo   : null, number: 0, ref: 9,  name: 'reflo'},
      {variable: typeof varzea  !== 'undefined' ? varzea  : null, number: 1200, ref: 11, name: 'varzea'},
      {variable: typeof campo   !== 'undefined' ? campo   : null, number: 0, ref: 12, name: 'campo'},
      {variable: typeof agro    !== 'undefined' ? agro    : null, number: 200, ref: 21, name: 'agro'},
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
    // Function designed to extract raster pixel values using spatial geometries for region 'reg_17'
    var getTrainingSamples = function(classObj) {
      // Filter the class geometries by the current regional limit ('reg_17')
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
    // Iterate through active classes to collect samples for the specific year in region 'reg_17'
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

  // Export the final multi-year batch collection for 'reg_17' as an Earth Engine Asset
  Export.table.toAsset({
    collection: amostras,
    description: 'amostras_complementares_'+batch+'_'+regiaoID,
    assetId: dirout + 'amostras_complementares_'+batch+'_'+regiaoID,
    overwrite: true
  });

} 

// Print the names of classes that were successfully processed to the console for verification in 'reg_17'
print('Classes processadas:', classesAtivas.map(function(i){return i.name}));