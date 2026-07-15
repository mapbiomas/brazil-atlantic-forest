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

var agro_compl = /* color: #00fff1 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.05848575549786, -21.487381967376024],
                  [-45.05779910999005, -21.480992602657928],
                  [-45.063635596806456, -21.48482625514174]]]),
            {
              "reference": 18,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.10929752307599, -21.58893513872316],
                  [-45.11341739612286, -21.58574272528173],
                  [-45.1154773326463, -21.589892849030978]]]),
            {
              "reference": 18,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.39022970405771, -21.717038298903585],
                  [-45.38542318550302, -21.714167678956404],
                  [-45.3840498944874, -21.710978034061426],
                  [-45.393319608842866, -21.714167678956404]]]),
            {
              "reference": 18,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.40099670504194, -21.74141199895027],
                  [-45.399172802911814, -21.741033304084958],
                  [-45.40322830294233, -21.738262821814857],
                  [-45.40395786379438, -21.740973510067594]]]),
            {
              "reference": 18,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.41327049349409, -21.74065460822149],
                  [-45.4075627527104, -21.745517784462034],
                  [-45.40681173418623, -21.742029867377163]]]),
            {
              "reference": 18,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.53201244226688, -21.720962524575153],
                  [-45.52909419885868, -21.721600414936628],
                  [-45.530982474005164, -21.717294600094966]]]),
            {
              "reference": 18,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.491500357305945, -21.744722029829763],
                  [-45.49081371179813, -21.74791092614783],
                  [-45.48841045252079, -21.746157041933824]]]),
            {
              "reference": 18,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.60565517297977, -21.705173836761034],
                  [-45.60119197717899, -21.706449754661612],
                  [-45.60119197717899, -21.70357892348049]]]),
            {
              "reference": 18,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.54626033655399, -21.67805790843858],
                  [-45.543170431768836, -21.68507663829564],
                  [-45.54179714075321, -21.67965310433082]]]),
            {
              "reference": 18,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.392108420050086, -21.771825391219558],
                  [-45.389361838018836, -21.766086282992195],
                  [-45.394855002081336, -21.764492045523266]]]),
            {
              "reference": 18,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.529437521612586, -21.69464708257822],
                  [-45.52257106653446, -21.6936900667639],
                  [-45.52737758508915, -21.692095026275112]]]),
            {
              "reference": 18,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.526690939581336, -21.711234346048922],
                  [-45.522227743780554, -21.718251458976663],
                  [-45.52051113001102, -21.711553313152052]]]),
            {
              "reference": 18,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.37871883264774, -21.76162237344888],
                  [-45.38318202844852, -21.768318185692713],
                  [-45.37871883264774, -21.769274704793755]]]),
            {
              "reference": 18,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.89782283655399, -21.626044859407425],
                  [-45.891986349737586, -21.630512973488596],
                  [-45.88889644495243, -21.62891723431941]]]),
            {
              "reference": 18,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-45.72581813684696, -21.685714687695004],
                  [-45.72650478235477, -21.68220538103469],
                  [-45.72925136438602, -21.684438586070826]]]),
            {
              "reference": 18,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-46.75119358101485, -21.488936712323785],
                  [-46.75325351753829, -21.48606156361696],
                  [-46.754626808553915, -21.490533992618516]]]),
            {
              "reference": 18,
              "system:index": "15"
            })]);
            
// Region ID.
var regiaoID = 'agric_SE';
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

// Define the geometry for the region needing agriculture correction.
var agric_SE = 
    /* color: #0b4a8b */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-48.40556778449581, -24.36599731473524],
          [-48.50169272779935, -24.68582947247846],
          [-48.4152122384805, -24.731992462594896],
          [-48.3506346988925, -24.80056845139384],
          [-48.42753576657546, -24.902747682102454],
          [-48.424788549166315, -24.999863647098522],
          [-47.96886388770847, -25.027666354727415],
          [-47.710700377712364, -24.99737038441274],
          [-47.018587040754056, -24.458524987462372],
          [-47.04526550479658, -24.282560526775406],
          [-46.90872971653059, -23.977608892046955],
          [-46.75268748306781, -23.962782168094527],
          [-46.540468850577334, -23.88749253850744],
          [-46.304501211302544, -23.781718166675493],
          [-45.90900609077073, -23.630832241143594],
          [-45.79948591615602, -23.56357427011748],
          [-45.77928616691829, -23.516429125558428],
          [-45.78285024380543, -23.4750259712273],
          [-45.747432579509976, -23.466513375157195],
          [-45.72194741035477, -23.444447451079533],
          [-45.683382335772976, -23.422979386467873],
          [-45.47085067666693, -23.188357161307515],
          [-45.03287525796909, -22.737095771189047],
          [-44.90104341877857, -22.623060092419742],
          [-44.079839226887565, -22.645873656798504],
          [-43.656878226612456, -21.801781796909946],
          [-42.987077599151164, -21.571128013572686],
          [-42.720308833024646, -21.170542497109842],
          [-41.60798349555509, -21.129560513017243],
          [-40.95431404470018, -20.973206880953832],
          [-40.6206095758008, -20.84685355268958],
          [-40.42423322238386, -20.64715964822262],
          [-40.26081268815607, -20.35904007386697],
          [-40.14545639890078, -20.083281641094477],
          [-40.05207991656128, -19.812201476171033],
          [-40.02324212978501, -19.557484285015946],
          [-39.99577387420374, -19.424140653852067],
          [-39.95868828574264, -19.32827870903325],
          [-39.88864957357225, -19.14675485780577],
          [-39.84516133245232, -18.959402123050488],
          [-39.79390182964916, -18.695149258843553],
          [-39.77467623625617, -18.561120509500245],
          [-39.771930389954036, -18.390497333041015],
          [-39.74583889551104, -18.25622259706443],
          [-39.86806083845191, -18.1844820743315],
          [-40.0656911525181, -18.086135084940672],
          [-40.23335224636099, -17.970337569763203],
          [-40.2882832257472, -17.96249759945782],
          [-40.53822195960544, -17.891938794352182],
          [-40.887037516277076, -17.97816997817267],
          [-40.78541315973956, -18.111354356361918],
          [-40.77991955867559, -18.163554579394187],
          [-40.996899728186904, -18.17399205955945],
          [-41.1225551052455, -18.256172993424943],
          [-41.169756567946415, -18.429696682771255],
          [-41.193622592269655, -18.49629692154112],
          [-41.248210659727704, -18.609237006660436],
          [-41.267479385858934, -18.641824669187788],
          [-41.24409089771025, -18.70551818908911],
          [-41.16306571786757, -18.741929178109167],
          [-41.20250464338218, -18.969296212684394],
          [-41.246833289064575, -19.02129262709047],
          [-41.370431990409486, -18.9758398916617],
          [-41.53659162411731, -18.952459074039517],
          [-41.63408633851574, -19.08619290781743],
          [-41.69450304603584, -19.18609393981196],
          [-42.12570646896338, -19.478948956975376],
          [-42.40997370469365, -19.932734098300134],
          [-42.517089344836904, -20.179117758389943],
          [-42.971641608828584, -20.37491501458994],
          [-43.35066710380248, -20.418667253549277],
          [-43.53192485829789, -20.56788519887991],
          [-43.661007491088995, -20.701551489457405],
          [-44.23777470648298, -20.544751073833282],
          [-44.57284904842615, -20.490733573207375],
          [-44.699188427154056, -20.547323489566395],
          [-45.10567134440307, -20.799150600359624],
          [-45.20729100690302, -21.263151907704607],
          [-45.27320639404048, -21.56231225054021],
          [-45.451729101656035, -21.633815465320176],
          [-45.94747561884635, -21.444128882793176],
          [-45.959448805107215, -21.42544324456514],
          [-46.004379669840624, -21.437432497763965],
          [-46.02831819277486, -21.420499970531598],
          [-46.058338813689026, -21.4173070018675],
          [-46.07717562236543, -21.408358040736434],
          [-46.13789834598984, -21.41536877566065],
          [-46.15331318648502, -21.412776847947036],
          [-46.15723678196478, -21.387005341562865],
          [-46.16187746279547, -21.3714684454833],
          [-46.180249214395175, -21.36360382432072],
          [-46.19639115635083, -21.356825637387598],
          [-46.231416845829166, -21.35221642543525],
          [-46.26164319813118, -21.36345275790181],
          [-46.28878838386392, -21.36381556042449],
          [-46.304948104658614, -21.36929124914028],
          [-46.32799466728106, -21.359775610514973],
          [-46.34500996214127, -21.355016174780495],
          [-46.36202459700632, -21.354092010948108],
          [-46.369773546988675, -21.332628338945955],
          [-46.382437013288495, -21.339973409992012],
          [-46.39647464191748, -21.342200842698414],
          [-46.415318854171524, -21.332274952735325],
          [-46.42729560063151, -21.33258109541738],
          [-46.440266525811744, -21.351737216868557],
          [-46.463920067895465, -21.34980305347163],
          [-46.48070838576395, -21.360656681600954],
          [-46.500291761695934, -21.35809397458601],
          [-46.517814065916944, -21.351051985643377],
          [-46.53241122927899, -21.35584375002195],
          [-46.54426105978224, -21.34272798345629],
          [-46.56109274799036, -21.33568031880038],
          [-46.59543796419033, -21.31390331719735],
          [-46.62565654170799, -21.304913497569398],
          [-46.638274529028244, -21.308428680380135],
          [-46.64814598272769, -21.30554599754636],
          [-46.666515548350034, -21.304896594065955],
          [-46.67166798123384, -21.29847929166983],
          [-46.6957033913468, -21.290758341558934],
          [-46.70669585796475, -21.294506832738787],
          [-46.702283630694765, -21.336632897455253],
          [-46.715037429319764, -21.355732084394706],
          [-46.72544218162075, -21.396490788378408],
          [-46.74076432614986, -21.405116225426077],
          [-46.75334906960813, -21.465522843148666],
          [-46.77418197960985, -21.478636608911778],
          [-46.80038107684512, -21.508701291715383],
          [-46.82710914690317, -21.550420495252066],
          [-46.82919758972961, -21.556913166377353],
          [-46.83403291692054, -21.563086457471993],
          [-46.83992848853619, -21.590439362538607],
          [-46.850203586596386, -21.59769001997754],
          [-46.854642983690496, -21.605898008054442],
          [-46.877642406185515, -21.621346499826295],
          [-46.89085934754286, -21.61987656832659],
          [-46.90118967625195, -21.632232304644894],
          [-46.90877521252228, -21.64873638075953],
          [-46.914817622734404, -21.658539050920222],
          [-46.92601173197172, -21.679828076315957],
          [-46.970809519980584, -21.736579622492375],
          [-47.00276463762362, -21.75696939393339],
          [-47.05960487940866, -21.77337949710336],
          [-47.062797869212375, -21.788277443735264],
          [-47.058043289683944, -21.797161497734784],
          [-47.0582407375801, -21.802878947203272],
          [-47.067537121676885, -21.82580908253822],
          [-47.04602527373226, -21.944410483771613],
          [-47.02791423313907, -22.058551204497878],
          [-47.002478357649466, -22.09613158432366],
          [-47.00041992826405, -22.11997945307982],
          [-46.99470749841984, -22.146253412017284],
          [-46.98041569455403, -22.208443727358507],
          [-46.97723985590047, -22.22726695803532],
          [-46.97578397331358, -22.253711713891132],
          [-46.97192667660094, -22.26712363338267],
          [-46.973464242361864, -22.276993405683715],
          [-46.964713074227426, -22.30813659810654],
          [-46.95470606755147, -22.345881012181803],
          [-46.96859031705426, -22.359989363044672],
          [-46.97142079078753, -22.40053781535196],
          [-46.9848534713297, -22.4373153746125],
          [-46.980435179924825, -22.456321624579225],
          [-46.980753721763065, -22.488913684349868],
          [-46.98208307611104, -22.498897293274428],
          [-46.988185283927116, -22.513790892811215],
          [-46.99009707367954, -22.52518493523611],
          [-46.9966822206363, -22.546074818152462],
          [-46.99749988255476, -22.55741680963169],
          [-46.99983053925118, -22.569959746851325],
          [-47.00312460136616, -22.576659228349353],
          [-47.00353971066679, -22.587528294802595],
          [-47.00643659893512, -22.59532180320856],
          [-47.00500043723474, -22.628055641786613],
          [-47.00192602483632, -22.635104352746126],
          [-47.0042761629383, -22.642582827378746],
          [-47.000041578291324, -22.672757045276438],
          [-47.0102040937733, -22.688385603168886],
          [-47.01117271795333, -22.69424008483499],
          [-47.0128553644268, -22.72759569609523],
          [-47.01829087557951, -22.741097592430478],
          [-47.019573612269156, -22.775703038202337],
          [-47.02970551625835, -22.789189588422364],
          [-47.03101101857091, -22.80526782785498],
          [-47.03472513119109, -22.821956164557232],
          [-47.03152669212819, -22.831905808240215],
          [-47.037848904045454, -22.84418613590456],
          [-47.074406135312216, -22.926324236088234],
          [-47.09104508756235, -22.951469870534773],
          [-47.10134052719066, -22.97663027662409],
          [-47.11061544827297, -23.002734935977607],
          [-47.116798402960065, -23.016357929272438],
          [-47.13229365076728, -23.03487566311102],
          [-47.13508622068512, -23.04628565932785],
          [-47.15714336333932, -23.06721608893488],
          [-47.17345060473823, -23.082843462812868],
          [-47.1881386558375, -23.095020458344905],
          [-47.20663389325371, -23.110017144763635],
          [-47.22167786537839, -23.121683715432994],
          [-47.23614422260749, -23.132187223724106],
          [-47.249298078296235, -23.146434302250718],
          [-47.260681009508964, -23.159239124634734],
          [-47.26588443180168, -23.16793904724342],
          [-47.271110997255995, -23.176927884105517],
          [-47.280598202928346, -23.190664293067986],
          [-47.29059966119987, -23.206289915072066],
          [-47.297213127446526, -23.21796940529039],
          [-47.30056373247494, -23.22522237638452],
          [-47.303954593982645, -23.23137053966241],
          [-47.30556365536739, -23.24343431080125],
          [-47.303449613170145, -23.2497806063241],
          [-47.30316523981945, -23.26068131547249],
          [-47.2908660248797, -23.279149503474816],
          [-47.301047898813465, -23.297415414544215],
          [-47.302733969069315, -23.31102989241981],
          [-47.298981800283585, -23.31965596662469],
          [-47.29935011659891, -23.323435406386263],
          [-47.30375269812591, -23.33336253430458],
          [-47.30775254761557, -23.355383881288557],
          [-47.30537549222967, -23.359460345211158],
          [-47.30602574728466, -23.361425020810987],
          [-47.307534339919336, -23.363232100074242],
          [-47.31080917373961, -23.36905243208627],
          [-47.32113065844593, -23.371922674314117],
          [-47.325873580534676, -23.375737879822154],
          [-47.326262381129595, -23.383045964663275],
          [-47.334634178418234, -23.40154064208865],
          [-47.34120428741815, -23.412472201547107],
          [-47.3457151113674, -23.41710236349759],
          [-47.39203795196864, -23.44938378458789],
          [-47.422503085508794, -23.469455685822638],
          [-47.44001268478795, -23.478895244747836],
          [-47.4878610941822, -23.53438583269246],
          [-47.49965330639278, -23.536901557368864],
          [-47.50457970090505, -23.535325823007074],
          [-47.51134341953427, -23.52713801437502],
          [-47.516290047855826, -23.524926830040567],
          [-47.52261256349642, -23.52570601081466],
          [-47.53212550023934, -23.521688341094716],
          [-47.53614662948064, -23.514837357960992],
          [-47.55347559510836, -23.509206705893433],
          [-47.55883803655898, -23.508607982974002],
          [-47.57965203861664, -23.516194140711562],
          [-47.592914741006865, -23.51890022958847],
          [-47.60023322125176, -23.51741986887386],
          [-47.60532072607052, -23.51751366208359],
          [-47.61146805163014, -23.522448987832018],
          [-47.619503275378264, -23.52832802300427],
          [-47.63213997198614, -23.53316036644027],
          [-47.64695560786053, -23.543051874749064],
          [-47.657308202280866, -23.544444575151044],
          [-47.66891555343532, -23.546914950241575],
          [-47.677339705590974, -23.547289708467844],
          [-47.686959071767454, -23.544801806560276],
          [-47.69383185677899, -23.54420229942273],
          [-47.69900707456027, -23.542905896500066],
          [-47.70455102283046, -23.542044161962732],
          [-47.70825745390348, -23.540950100337227],
          [-47.71258021806874, -23.537502966934788],
          [-47.718479019067615, -23.536903687282475],
          [-47.72300447501041, -23.535045038181472],
          [-47.72732721255281, -23.53584685812508],
          [-47.737829820419364, -23.53822236006173],
          [-47.74694728974017, -23.54316992842565],
          [-47.754348156448664, -23.54497012417325],
          [-47.75850675981667, -23.5469968635851],
          [-47.76184579429694, -23.551364481600586],
          [-47.76937271308746, -23.55226969476673],
          [-47.78427985357209, -23.553803058912802],
          [-47.793838438470445, -23.555924184115565],
          [-47.80128284999107, -23.557019560229236],
          [-47.81308193933951, -23.55952482616609],
          [-47.82466420032825, -23.556352796432538],
          [-47.83581320878335, -23.55882060823011],
          [-47.84781238708843, -23.561867025127594],
          [-47.88176770098254, -23.568274232073065],
          [-47.90367392751575, -23.57259153629719],
          [-47.92723183013886, -23.57996637745357],
          [-47.94653954608565, -23.582759533427232],
          [-47.951854443251435, -23.594325140849072],
          [-47.96161807471314, -23.59635074537861],
          [-47.98337422093032, -23.59269116609797],
          [-48.02985332789372, -23.59814559445994],
          [-48.082334949719126, -23.6183791343358],
          [-48.11819833319473, -23.63855828378914],
          [-48.11227290717986, -23.663744298383968],
          [-48.10497266113888, -23.668804134134838],
          [-48.116766367065836, -23.748521118051034],
          [-48.13364791661662, -23.76827044836381],
          [-48.09917360507591, -23.78757223328524],
          [-48.08563339414576, -23.81315330783149],
          [-48.06170774283822, -23.83567503365081],
          [-48.02129236322576, -23.854421573743327],
          [-48.01792570847358, -23.864137718999284],
          [-48.007691512348096, -23.875109447318966],
          [-48.00939744360967, -23.890471141464428],
          [-48.00802676716816, -23.90331530910575],
          [-48.01490222624742, -23.91142490820207],
          [-48.022479201562, -23.923877566967196],
          [-48.024591112239406, -23.93434756540071],
          [-48.02195097930037, -23.94399335726488],
          [-48.02285358491765, -23.9519905494971],
          [-48.020359838122225, -23.96877374726719],
          [-48.01722425685775, -23.9715194052631],
          [-48.017372829005026, -23.97571573139138],
          [-48.01401388263148, -23.9770298875728],
          [-48.01205818235964, -23.983553684358693],
          [-48.01662573398951, -23.98882274298416],
          [-48.01444639683521, -23.992241497151298],
          [-48.013983580748345, -23.997855849580766],
          [-48.01437904304507, -24.00394059731385],
          [-48.01546121172215, -24.00845718004094],
          [-48.01329328429442, -24.012220504286994],
          [-48.01549764124682, -24.01959011942353],
          [-48.01564218771781, -24.026018944352277],
          [-48.01269646422583, -24.03385954612419],
          [-48.00744657851603, -24.039818139752157],
          [-48.00241793855268, -24.04232721181563],
          [-47.99801508019246, -24.051106373328487],
          [-47.99323851017715, -24.055809485711386],
          [-47.99351086394689, -24.059963696111364],
          [-47.99755988150463, -24.062550398260306],
          [-47.997604637027436, -24.071881130623986],
          [-47.99387247029048, -24.088421446204293],
          [-48.22018934375054, -24.233753619617467]]]);

// Define years to process.  The `if` statement allows for processing a single year if `coleta` is true.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,
            2025];
if (coleta) {
  var anos = [2020];
}

// Number of trees for the Random Forest classifier.  
// The number of trees is reduced to 10 if `coleta` is true.
var RFtrees = 100;
if (coleta) {var RFtrees = 10}

// Output version and parameters, output directory.
var versao_out = '1';
var col = 11;
var nome_out = 'RF85a25_v';
var versao_pt = '1';
var v_comp_in = '2';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-mat/';

// Import palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
var visParMedian2 = {bands: ['swir1_median', 'nir_median', 'red_median'],gain: [0.08, 0.06, 0.2],gamma: 0.85};

// Load regions
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');
var limite = agric_SE;

// Directory for training samples.
var dirsamples = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/'; 

// Load Collection 9 if `coleta` is true.
var remap_in =  [3,4,5,6,49,11,12,13,32,29,50,15,18,19,39,20,40,62,41,36,46,47,48, 9,21,22,23,24,30,25,33,31];
var remap_out = [3,4,3,3, 3,11,12,12,12,12,50,21,18,18,18,18,18,18,18,18,18,18,18, 9,21,22,22,22,22,22,33,33];

//if (coleta) {
//var colecao = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1')
//                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos).clip(limite);
//Map.addLayer(colecao.select('classification_'+anos), vis, 'LULC Col 10 (LandSat) '+ anos, false);
//}
//
//if (coleta) {
//var colBruta = ee.Image('projects/mapbiomas-workspace/COLECAO_10/classificacao-ma/regioes/agric_SE-RF85a24_v1')
//                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos).clip(limite);
//Map.addLayer(colBruta.select('classification_'+anos), vis, 'Bruta Col 10 (LandSat) '+ anos, false);
//}
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

// Loop through each year.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
// Obtenção do mosaico para o ano específico
var mosaicoTotal = cloudMos.getMosaic(ano, limite_MA); 

// Adiciona bandas auxiliares (clusters, amplitude NDFI, textura, etc)
mosaicoTotal = mosaicoTotal
  .addBands(clusterMos.select(
    ['clusters_'+ano, 'clusters_green_text_'+ano, 'amp_ndfi_3anos_'+ano, 'clusters_ndfi_median_'+ano, 'longitude','latitude'],
    ['clusters', 'clusters_green_text', 'amp_ndfi_3anos', 'clusters_ndfi_median', 'longitude','latitude']
  ))
  .set('year', ano);
print(mosaicoTotal)
  // Add mosaic to the map if `coleta` is true.
  if (coleta) {    
    Map.addLayer(mosaicoTotal.clip(limite), visParMedian2, 'Img_Year_'+ano, false);
  }
  
  // Define bands to use for classification. Using the list of most important bands (feature importance) for the reg_30
  var bandNames = ee.List([
'cai_median',	'gcvi_amp',	'red_min',	'ndvi_median',	'gcvi_median_dry',	'red_median',	'cai_median_dry',	'gcvi_median_wet',	
'hallcover_median_dry',	'evi2_median',	'green_median_dry',	'cai_max',	'swir2_median',	'swir2_median_dry',	'gcvi_median',	
'hallheigth_median_dry',	'blue_max',	'hallcover_median',	'nir_max',	'red_median_dry',	'swir1_median_wet',	'nir_median',	'nir_amp',	
'gcvi_max',	'red_median_wet',	'swir1_median_dry',	'swir2_min',	'savi_median_wet',	'nir_median_dry',	'swir1_max',	'green_max',	
'ndfi_stdDev',	'ndvi_max',	'swir2_amp',	'evi2_median_dry',	'gv_median_dry',	'evi2_median_wet',	'gcvi_min',	'swir2_stdDev',	
'savi_min',	'blue_median',	'savi_stdDev',	'gv_max',	'soil_stdDev',	'npv_stdDev',	'swir2_max',	'blue_median_dry',	'gvs_median_dry',	
'hallheigth_min',	'hallheigth_median',	'savi_median_dry',	'soil_median_dry',	'sefi_stdDev',	'green_median_wet',	'green_median',	
'hallcover_max',	'swir1_amp',

'latitude','longitude','slope',

  ])
  

  // Filter and mosaic the image collection.
  var mosaicoTotal = ee.ImageCollection(mosaicoTotal)
                       .filterMetadata('year', 'equals', ano)
                       .filterBounds(limite)
                       .mosaic()
                       .select(bandNames);
  //print('pos bandNames',mosaicoTotal)                    
                       
  // Load training data.
  var BDamostras = ee.FeatureCollection(dirsamples + 'pontos_train_b1_v'+versao_pt+'_'+ano)
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b2_v'+versao_pt+'_'+ano))
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b3_v'+versao_pt+'_'+ano))
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b4_v'+versao_pt+'_'+ano))
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b5_v'+versao_pt+'_'+ano))
            .merge(ee.FeatureCollection(dirsamples + 'pontos_train_b6_v'+versao_pt+'_'+ano))
            .filterBounds(limite);
                    
  // Filter training data by class.
  var BDflo      = BDamostras.filter(ee.Filter.eq('reference', 3)).limit(1500)
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

var batch1 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b1_agric_SE')
var batch2 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b2_agric_SE')
var batch3 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b3_agric_SE')
var batch4 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b4_agric_SE')
var batch5 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b5_agric_SE')
var batch6 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b6_agric_SE')
var batch7 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b7_agric_SE')
var batch8 = ee.FeatureCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/amostras_complementares_b8_agric_SE')
 // Complementary samples.
  var complementares =  ee.FeatureCollection([batch1, batch2, batch3, batch4, batch5, batch6, batch7, batch8]).flatten()
                          .filter(ee.Filter.eq('ano', ano))
                          .filter(ee.Filter.eq('reg_id', regiaoID));

  var num_agric = 3500;
  if (ano >= 1990) { num_agric = 3650 }
  if (ano >= 1995) { num_agric = 3700 }
  if (ano >= 2000) { num_agric = 3750 }
  if (ano >= 2005) { num_agric = 3800 }
  if (ano >= 2010) { num_agric = 3850 }
  if (ano >= 2015) { num_agric = 3900 }
  if (ano >= 2018) { num_agric = 3950 }
  if (ano >= 2020) { num_agric = 4000 }
  if (ano >= 2023) { num_agric = 4050 }

    
  var flo        = complementares.filter(ee.Filter.eq('reference', 3)) //.sort('random').limit(700)
  var sav        = complementares.filter(ee.Filter.eq('reference', 4)) //.sort('random')
  var reflo      = complementares.filter(ee.Filter.eq('reference', 9)) //.sort('random').limit(1000)
  var varzea     = complementares.filter(ee.Filter.eq('reference', 11))//.sort('random')
  var campo      = complementares.filter(ee.Filter.eq('reference', 12))//.sort('random').limit(4500)
  var herb       = complementares.filter(ee.Filter.eq('reference', 50))//.sort('random')
  var agro_1985  = complementares.filter(ee.Filter.and(ee.Filter.eq('reference', 19),(ee.Filter.eq('class_name', 'agro_1985'))))//.sort('random')
  var agro_2000  = complementares.filter(ee.Filter.and(ee.Filter.eq('reference', 19),(ee.Filter.eq('class_name', 'agro_2000'))))//.sort('random')
  var naoVeg     = complementares.filter(ee.Filter.eq('reference', 22))//.sort('random')
  var aflora     = complementares.filter(ee.Filter.eq('reference', 12))//.sort('random')
  var agua       = complementares.filter(ee.Filter.eq('reference', 33))//.sort('random')
  
  Map.addLayer(complementares)

  var agro = agro_1985
    if (ano >= 2000) {
      agro = agro.merge(agro_2000);
    }

    agro = agro.limit(num_agric)

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

//var amostraTotal = agro
var amostraTotal = agro_compl

  var amostraTotalimg = amostraTotal.reduceToImage({properties: ['reference'],reducer: ee.Reducer.first()});
  amostraTotalimg = amostraTotalimg.select([0],['reference']);

  var training_agr = mosaicoTotal.select(bandNames).addBands(amostraTotalimg)
                                 .sample({'numPixels': 600, 'region': agro_compl.filterBounds(limite), 'scale': 30, 'seed': 1});
  print('GI agro', agro_compl.size())
  
  // Merge training data.
  var training = BDflo.merge(BDagro).merge(BDnaoVeg)
                      .merge(BDagua)
                      // complementary samples
                      .merge(agro)
                      .merge(training_agr)

  // Train the classifier.
  var classifier = ee.Classifier.smileRandomForest({numberOfTrees: RFtrees, variablesPerSplit:1}).train(training, 'reference', bandNames);
  // Classify the image.
  var classified = mosaicoTotal.classify(classifier).mask(mosaicoTotal.select('green_median'));
  classified = classified.select(['classification'],['classification_'+ano]).clip(limite).toInt8();
  // Get classification probabilities.
  var classifier_prob = classifier.setOutputMode('MULTIPROBABILITY');
  var classified_prob = mosaicoTotal.classify(classifier_prob);
  var max_prob = classified_prob.arrayReduce(ee.Reducer.max(), [0]);
  var img_max_prop = max_prob.arrayFlatten([['prob_'+ano]]).multiply(100);
  
// Add classified image to the map if `coleta` is true.
if (coleta) {  Map.addLayer(classified, vis, 'RF'+ano+"_"+regiaoID, true);}

if (coleta) {
var colecao = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1')
                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos).clip(limite);
Map.addLayer(colecao.select('classification_'+anos), vis, 'LULC Col 10 (LandSat) '+ anos, false);
}

if (coleta) {
var colBruta = ee.Image('projects/mapbiomas-workspace/COLECAO_10/classificacao-ma/regioes/agric_SE-RF85a24_v1')
                .select('classification_'+anos).remap(remap_in,remap_out).rename('classification_'+anos).clip(limite);
Map.addLayer(colBruta.select('classification_'+anos), vis, 'Bruta Col 10 (LandSat) '+ anos, false);
}

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
