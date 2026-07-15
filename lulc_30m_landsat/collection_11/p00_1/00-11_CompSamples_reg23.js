/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Extraction of complementary training samples for land cover classification, focusing on the region 'reg_23'.
 * 
 * DESCRIPTION:
 * This script automates the process of collecting training samples across multiple years and classes 
 * within the Atlantic Forest biome, specifically configured for the region identified as 'reg_23'. 
 * It utilizes custom Landsat mosaics, cluster data, and auxiliary environmental variables. The 
 * process is organized into multi-year batches to optimize Google Earth Engine processing limits. 
 * For each year, it builds a multi-band image including spectral metrics, temporal statistics 
 * (median, wet/dry seasons), and terrain data. Stratified sampling is performed based on 
 * user-defined geometries for various land cover classes (Forest, Savanna, Grassland/Campo, 
 * Agriculture, and Rocky Outcrop), and the resulting feature collections are exported as Assets 
 * for use in machine learning classifiers.
 */

// Define FeatureCollection variables to store complementary spatial samples
var aflora = /* color: #0000ff */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.51525345394807, -18.773016391715252],
                  [-43.52692642758088, -18.75091097844091],
                  [-43.53791275570588, -18.770740968246542]]]),
            {
              "reference": 12,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.59009781429963, -18.691081821089004],
                  [-43.59593430111604, -18.70311438444067],
                  [-43.58082809994416, -18.70343957698565]]]),
            {
              "reference": 12,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.66047897885041, -18.650424948908956],
                  [-43.6652854974051, -18.641967095276545],
                  [-43.66871872494416, -18.657255984616572]]]),
            {
              "reference": 12,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.60211411068635, -18.78276785864776],
                  [-43.59009781429963, -18.766190029176883],
                  [-43.606233983733226, -18.774641675388022]]]),
            {
              "reference": 12,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.5773948724051, -18.837040701919282],
                  [-43.573274999358226, -18.814618716055392],
                  [-43.58632126400666, -18.81884337686581],
                  [-43.58632126400666, -18.83281649853933]]]),
            {
              "reference": 12,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.57361832211213, -18.965990115006377],
                  [-43.55610886166291, -18.96826288983761],
                  [-43.570528417326976, -18.956574003529138]]]),
            {
              "reference": 12,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.396178215159594, -19.007084772435867],
                  [-43.402873008860766, -18.9839551145459],
                  [-43.40355965436858, -18.99604786295046]]]),
            {
              "reference": 12,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.38974091352385, -19.044409036813498],
                  [-43.38605019391936, -19.051142924853686],
                  [-43.38562104047698, -19.04302977302069]]]),
            {
              "reference": 12,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.343203947208316, -19.100002064724965],
                  [-43.333247587345035, -19.105436051668836],
                  [-43.33616583075324, -19.10097532923879]]]),
            {
              "reference": 12,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-43.367923185489566, -19.08767355210836],
                  [-43.36654989447394, -19.092540179942276],
                  [-43.362430021427066, -19.095703411311764]]]),
            {
              "reference": 12,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.795713276714714, -18.950918302305713],
                  [-42.79056343540612, -18.95773715008708],
                  [-42.79116425022546, -18.954895997382252],
                  [-42.795713276714714, -18.9484017523665]]]),
            {
              "reference": 12,
              "system:index": "10"
            })]),
    sav = /* color: #f5b020 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.512042474151244, -15.433082251914058],
                  [-41.525517892242064, -15.427456141400832],
                  [-41.52568955361902, -15.44466494034182]]]),
            {
              "reference": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.65602612328437, -15.787124969207081],
                  [-41.66383671593574, -15.778452510038987],
                  [-41.662120102166206, -15.790841623824736]]]),
            {
              "reference": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.868690101828264, -15.867154052018199],
                  [-41.86448439809291, -15.877969172262393],
                  [-41.85753211232631, -15.880115615631054],
                  [-41.86096533986537, -15.869135491521707]]]),
            {
              "reference": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.19835247921746, -16.31197181984589],
                  [-42.19869580197137, -16.320209217893673],
                  [-42.19397511410516, -16.311230437018867]]]),
            {
              "reference": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.06612023928741, -16.68500201742205],
                  [-42.0727292023001, -16.6836043230133],
                  [-42.073673339873345, -16.691003765476207]]]),
            {
              "reference": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.04153457475334, -16.71640638661796],
                  [-42.04840134385709, -16.70859622402517],
                  [-42.0494311878693, -16.720763291512192]]]),
            {
              "reference": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.439633534003406, -16.625077538524607],
                  [-42.441178486395984, -16.62343267655387],
                  [-42.44152180914989, -16.627051354277878]]]),
            {
              "reference": 4,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.44083516364208, -16.65912301279523],
                  [-42.43894688849559, -16.65566939978237],
                  [-42.4422084546577, -16.65714952727188]]]),
            {
              "reference": 4,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.322942246771404, -17.23342463484997],
                  [-42.324658860540936, -17.23063738293079],
                  [-42.32500218329484, -17.232932769920218]]]),
            {
              "reference": 4,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.9285879992518, -17.265534234840207],
                  [-41.92549809446665, -17.265370308536127],
                  [-41.92738636961313, -17.261436033511124]]]),
            {
              "reference": 4,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.91236385763917, -15.620303533418864],
                  [-41.916483730686046, -15.62757754781564],
                  [-41.910303921115734, -15.627246916400608]]]),
            {
              "reference": 4,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.16664357143712, -16.337652510588036],
                  [-42.17106385189366, -16.341791303007867],
                  [-42.155528497279406, -16.34310910906157]]]),
            {
              "reference": 4,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.318799716684765, -16.489161970074225],
                  [-42.31910012409443, -16.494429147531935],
                  [-42.30888627216572, -16.492906618778356]]]),
            {
              "reference": 4,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.93682336102359, -16.89422736956182],
                  [-41.94489144574039, -16.889299716285958],
                  [-41.96428918133609, -16.893734610025604]]]),
            {
              "reference": 4,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.019177411814354, -17.044415297641482],
                  [-42.02604386689248, -17.028658956642985],
                  [-42.03222367646279, -17.054918787100977]]]),
            {
              "reference": 4,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.87440190694615, -17.02707517602021],
                  [-41.88332829854771, -17.001468075059986],
                  [-41.88882146261021, -17.00672109918815]]]),
            {
              "reference": 4,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.865475515344585, -16.92725339752217],
                  [-41.87577519796177, -16.938420310633173],
                  [-41.85929570577427, -16.94301825869908]]]),
            {
              "reference": 4,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.955412879885934, -17.055685588820417],
                  [-41.95871734541752, -17.05818826391861],
                  [-41.94730191904486, -17.06499865251535]]]),
            {
              "reference": 4,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.11513055942719, -16.146019264967645],
                  [-42.11616052768891, -16.14012434595034],
                  [-42.12697519443696, -16.144957780272552]]]),
            {
              "reference": 4,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.41029114224449, -17.199694106157217],
                  [-42.415655560274274, -17.204408605373622],
                  [-42.400678105135114, -17.218387414203846]]]),
            {
              "reference": 4,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.18904408889616, -16.55661310383934],
                  [-42.20552358108366, -16.5381832880788],
                  [-42.20827016311491, -16.548056622710877]]]),
            {
              "reference": 4,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.198657126005536, -16.71187993094981],
                  [-42.209643454130536, -16.687545567569746],
                  [-42.22543630081022, -16.710564639242783]]]),
            {
              "reference": 4,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.68525666065933, -15.60617183642949],
                  [-41.68971985646011, -15.618406101552774],
                  [-41.66671723194839, -15.612785043361868]]]),
            {
              "reference": 4,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.672736348880726, -15.475619224524882],
                  [-41.66792983032604, -15.459240250621809],
                  [-41.67883032776256, -15.465444559832665]]]),
            {
              "reference": 4,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.78899398605215, -15.437792393561775],
                  [-41.79422965804922, -15.43258009113161],
                  [-41.80315604965078, -15.440522594960076]]]),
            {
              "reference": 4,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.114379089956046, -15.238441006334508],
                  [-42.1134349523828, -15.227343783299562],
                  [-42.117898148183585, -15.231070527947589]]]),
            {
              "reference": 4,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.66628371045117, -16.63461237885195],
                  [-41.65632735058789, -16.64119135864933],
                  [-41.64774428174023, -16.61750597526097]]]),
            {
              "reference": 4,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.5794237774487, -16.722753048255168],
                  [-41.589380137311984, -16.705654523295333],
                  [-41.59967981992917, -16.719136180383092]]]),
            {
              "reference": 4,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.200046854269246, -18.156217930113467],
                  [-42.20219262148116, -18.149040747672608],
                  [-42.2042525580046, -18.150875850776384]]]),
            {
              "reference": 4,
              "system:index": "28"
            })]),
    campo = 
    /* color: #009999 */
    /* shown: false */
    ee.FeatureCollection([]),
    agro = 
    /* color: #2860ff */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.127216881333716, -16.962224216402056],
                  [-41.1250711141218, -16.96247050670911],
                  [-41.12412697654856, -16.961485343543476],
                  [-41.12678772789133, -16.96066437029218]]]),
            {
              "reference": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.135971611558325, -16.970433719263415],
                  [-41.13665825706614, -16.967149961183814],
                  [-41.139233177720435, -16.966493202676993],
                  [-41.13957650047434, -16.967560434084213],
                  [-41.13760239463938, -16.96821718885859]]]),
            {
              "reference": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.11304460932632, -16.99168815401879],
                  [-41.11244379450699, -16.991113565592247],
                  [-41.11192881037613, -16.989143534763077],
                  [-41.11407457758804, -16.990292721928622]]]),
            {
              "reference": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.29945701708301, -17.06678685780563],
                  [-41.30211776842578, -17.06883812124378],
                  [-41.297053757805664, -17.06900222134478]]]),
            {
              "reference": 21,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.250361863274414, -17.074417443711376],
                  [-41.254310074944335, -17.072284193057538],
                  [-41.25568336595996, -17.073679013553335]]]),
            {
              "reference": 21,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.23422569384082, -17.073925157264135],
                  [-41.237830582756835, -17.074171300650146],
                  [-41.23551315416797, -17.076468623257117]]]),
            {
              "reference": 21,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.204099122185546, -17.091810730685594],
                  [-41.203669968743164, -17.09377967977569],
                  [-41.20418495287402, -17.095174339458776],
                  [-41.20306915392383, -17.096897139946886],
                  [-41.203154984612304, -17.092220930128466]]]),
            {
              "reference": 21,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.167191926140625, -17.098948072134235],
                  [-41.16976684679492, -17.09681510218969],
                  [-41.169938508171875, -17.09952232909985]]]),
            {
              "reference": 21,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.51935524095996, -17.130651561307747],
                  [-41.51540702929004, -17.131963922424525],
                  [-41.51429123033984, -17.129257167469273]]]),
            {
              "reference": 21,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.51386207689746, -17.11826569702397],
                  [-41.516007844109375, -17.117937583444032],
                  [-41.515492859978515, -17.119988283823968]]]),
            {
              "reference": 21,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.50363186949524, -17.24078012259092],
                  [-41.50612095946106, -17.23840285798077],
                  [-41.50629262083801, -17.241517888142912]]]),
            {
              "reference": 21,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.55701855772766, -17.265206791827364],
                  [-41.55925015562805, -17.264960901879846],
                  [-41.560108462512815, -17.266846049762428],
                  [-41.557361880481565, -17.267419786595756]]]),
            {
              "reference": 21,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.595814028919065, -17.274529958730678],
                  [-41.59512738341125, -17.272399009419523],
                  [-41.597788134754026, -17.272808809277944]]]),
            {
              "reference": 21,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.7238734161261, -17.283463285644036],
                  [-41.71820859068664, -17.283053509487868],
                  [-41.72361592406067, -17.281332439674657]]]),
            {
              "reference": 21,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.04796879326171, -17.563270935218842],
                  [-42.044363904345694, -17.563761912340215],
                  [-42.0461663488037, -17.560816029637767]]]),
            {
              "reference": 21,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.668342125022406, -17.314864326737123],
                  [-41.669372093284125, -17.313225496384813],
                  [-41.66971541603803, -17.31666702324631]]]),
            {
              "reference": 21,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.791938316428656, -17.34190291685475],
                  [-41.78987837990522, -17.340100468063763],
                  [-41.79262496193647, -17.339445027750095]]]),
            {
              "reference": 21,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.86759484629192, -15.298829275188158],
                  [-41.86793816904583, -15.31505530809199],
                  [-41.86347497324505, -15.31008828874506]]]),
            {
              "reference": 21,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.8442488990263, -15.251379428826722],
                  [-41.84699548105755, -15.26230977628153],
                  [-41.84150231699505, -15.26230977628153]]]),
            {
              "reference": 21,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.91634667734661, -15.388795322885995],
                  [-41.920466550393485, -15.384492100154203],
                  [-41.92458642344036, -15.396077497160586]]]),
            {
              "reference": 21,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.39364485670854, -17.359861686588502],
                  [-42.39433150221635, -17.35035859672313],
                  [-42.39982466627885, -17.352324793659783]]]),
            {
              "reference": 21,
              "system:index": "20"
            })]),
    flo = /* color: #f31ae6 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.22758821280886, -17.660969984014177],
                  [-42.22355417045046, -17.661624265609323],
                  [-42.22578576835085, -17.659375162660098]]]),
            {
              "reference": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.51236621241562, -15.363693493081781],
                  [-41.49794665675156, -15.365348754487862],
                  [-41.50446978907578, -15.359720812101012]]]),
            {
              "reference": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.6328777549522, -15.104995819739402],
                  [-41.62257807233501, -15.07516224177949],
                  [-41.63253443219829, -15.09128118116721],
                  [-41.63281334753598, -15.096926558896634],
                  [-41.635323924031056, -15.100914557257864]]]),
            {
              "reference": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.98982841832256, -15.313436524408775],
                  [-41.98502189976787, -15.315588879494827],
                  [-41.98879845006084, -15.311780851584487]]]),
            {
              "reference": 3,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.24147144135582, -16.2846296767773],
                  [-42.241986433546614, -16.287430865689828],
                  [-42.239754800724334, -16.287760414696187]]]),
            {
              "reference": 3,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.228268118860456, -16.603260338771243],
                  [-42.22586484826755, -16.60309583374404],
                  [-42.22912642978544, -16.600628241444685]]]),
            {
              "reference": 3,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.49371633454282, -15.316876550657275],
                  [-41.49371633452835, -15.323498944357672],
                  [-41.482730102082606, -15.320850012054786]]]),
            {
              "reference": 3,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.57027734140911, -15.273328684102372],
                  [-41.571650632424735, -15.280283698355069],
                  [-41.566157468362235, -15.278958951514527]]]),
            {
              "reference": 3,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.52804864267864, -15.384250161357805],
                  [-41.532168515725516, -15.375974473481383],
                  [-41.535945066018485, -15.378953758993873]]]),
            {
              "reference": 3,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.58778680185833, -15.428513175701339],
                  [-41.58675683359661, -15.43513207971019],
                  [-41.57645715097942, -15.430829816113222]]]),
            {
              "reference": 3,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.901240476174735, -15.532405564505883],
                  [-41.905703671975516, -15.537698045620457],
                  [-41.902957089944266, -15.539351918096603]]]),
            {
              "reference": 3,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.65599002231084, -15.735468672274804],
                  [-41.65403733696622, -15.732442876473266],
                  [-41.657234587948786, -15.733609814674919]]]),
            {
              "reference": 3,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.06316096803176, -17.031835519937953],
                  [-42.07002733871036, -17.041683100363926],
                  [-42.06178769391743, -17.043652554188483]]]),
            {
              "reference": 3,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.963339750654846, -16.926186001094973],
                  [-41.95578689706254, -16.9150187275446],
                  [-41.96402637377385, -16.913704887092468]]]),
            {
              "reference": 3,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.05835890951898, -17.064328036089595],
                  [-42.04668196028637, -17.076422100712637],
                  [-42.03981316557151, -17.07379569080986]]]),
            {
              "reference": 3,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.163554822428175, -15.941192625946503],
                  [-42.1615056147408, -15.939067467395425],
                  [-42.16587225101704, -15.940749026748984]]]),
            {
              "reference": 3,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.74117816611703, -15.154368457590836],
                  [-41.7349125446821, -15.154161421125862],
                  [-41.72916186973031, -15.155693988260238],
                  [-41.733968388285, -15.151717371335886],
                  [-41.73516999533792, -15.153167212708146]]]),
            {
              "reference": 3,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-41.790655288585725, -15.8427880129837],
                  [-41.79183546055228, -15.839691600843299],
                  [-41.794421110042634, -15.843923352204344]]]),
            {
              "reference": 3,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.37220181050813, -16.454089498868736],
                  [-42.372588048606275, -16.455694647690855],
                  [-42.36391914907014, -16.45363676218425]]]),
            {
              "reference": 3,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.00454303648148, -15.177419135352304],
                  [-42.00698921110306, -15.175348202882798],
                  [-42.008662909528354, -15.17530678402632]]]),
            {
              "reference": 3,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.03459954614087, -17.23567768718955],
                  [-42.03447080010815, -17.237645109809336],
                  [-42.025673154539305, -17.237235231825355]]]),
            {
              "reference": 3,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-42.038812110247505, -17.224938033119784],
                  [-42.03748173457612, -17.219773148838627],
                  [-42.04035706264008, -17.22014207393043]]]),
            {
              "reference": 3,
              "system:index": "21"
            })]);
            
// --- 1. GENERAL CONFIGURATIONS AND PATHS ---

// Unique identifier for the specific geographic region being processed
var regiaoID = 'reg_23';

// Manual definition of a specific year, used as a reference point for individual operations
var ano = 2020; 

// Base directory path for saving the resulting sample assets in the MapBiomas repository
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Import of auxiliary feature collections representing regional boundaries
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

// Filter the master collection to obtain the specific geometry of region 'reg_23'
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

    // Define the specific subset of band names to be used as features for the sampling process for 'reg_23'
    var bandNames = ee.List([
      'swir1_median_dry',	'gcvi_max',	'green_median_wet',	'gcvi_amp',	'gcvi_median_dry',	'swir1_max',	'swir2_median',	'swir2_min',	
      'cai_median_wet',	'green_min',	'red_median_wet',	'gcvi_median_wet',	'green_max',	'gcvi_median',	'blue_median',	'blue_median_wet',	
      'green_median_dry',	'gcvi_stdDev',	'evi2_median',	'red_median_dry',	'cai_median',	'green_median_texture',	'red_median',	'hallcover_min',	
      'hallheigth_median',	'hallcover_max',	'hallheigth_min',	'hallcover_median',	'savi_median',	'hallheigth_max',	'gv_min',	'evi2_median_wet',	
      'nir_median_wet',	'nir_max',	'swir1_stdDev',	'nir_median',	'red_max',	'green_median',	'nir_min',	'gcvi_min',	'ndvi_median',	
      'swir1_median',	'hallheigth_median_wet',	'red_min',	'evi2_min',	'cai_median_dry',	'swir2_median_dry',	'ndvi_median_wet',	'cai_min',	
      'evi2_amp',	'swir2_median_wet',	'hallcover_median_wet',	'gv_median',	'blue_amp',	'soil_stdDev',	'ndwi_max', 'latitude', 'longitude', 'slope',
    ]);
  
    /**
     * OPTIMIZED VERSION: Dynamic processing per land cover class
     */

    // --- 1. CLASS DEFINITIONS (Configuration Dictionary) ---
    // Mapping table defining available class variables, sample quotas, numeric legend references, and class names
    var classConfigs = [
      {variable: typeof flo     !== 'undefined' ? flo     : null, number: 1000, ref: 3,  name: 'floresta'},
      {variable: typeof sav     !== 'undefined' ? sav     : null, number: 4000, ref: 4,  name: 'savana'},
      {variable: typeof reflo   !== 'undefined' ? reflo   : null, number: 0, ref: 9,  name: 'reflo'},
      {variable: typeof varzea  !== 'undefined' ? varzea  : null, number: 0, ref: 11, name: 'varzea'},
      {variable: typeof campo   !== 'undefined' ? campo   : null, number: 500, ref: 12, name: 'campo'},
      {variable: typeof agro    !== 'undefined' ? agro    : null, number: 500, ref: 21, name: 'agro'},
      {variable: typeof nveg    !== 'undefined' ? nveg    : null, number: 0, ref: 22, name: 'nao vegetada'},
      {variable: typeof aflora  !== 'undefined' ? aflora  : null, number: 1000, ref: 29, name: 'afloramento'},
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
    // Function designed to extract raster pixel values using spatial geometries for region 'reg_23'
    var getTrainingSamples = function(classObj) {
      // Filter the class geometries by the current regional limit ('reg_23')
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
    // Iterate through active classes to collect samples for the specific year in region 'reg_23'
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

  // Export the final multi-year batch collection for 'reg_23' as an Earth Engine Asset
  Export.table.toAsset({
    collection: amostras,
    description: 'amostras_complementares_'+batch+'_'+regiaoID,
    assetId: dirout + 'amostras_complementares_'+batch+'_'+regiaoID,
    overwrite: true
  });

} 

// Print the names of classes that were successfully processed to the console for verification in 'reg_23'
print('Classes processadas:', classesAtivas.map(function(i){return i.name}));