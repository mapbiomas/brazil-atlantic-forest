/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Correcting Wetland (11) class.
 * 
 * DESCRIPTION:
 * This script integrates topographic principles to ensure the Wetland class is placed in geographically plausible locations
 * and operates on the ecological principle that wetlands typically form in low-lying areas.
 * The script uses HAND (Height Above Nearest Drainage) data to enforce this rule,
 * removing any Wetland classifications that appear in topographically high or steep areas.
 *  
 * It loads two different HAND (Height Above Nearest Drainage) datasets:
 * hand-100: This dataset defines a drainage line based on a flow accumulation of 100 cells.
 * It is used to identify very fine, local-scale depressions and small streams.
 * hand-1000: This dataset uses a 1000-cell threshold, defining larger rivers and wider floodplains.
 * The script creates a definition of low-lying areas using both datasets.
 * It can identify a wetland if it's in a small, local depression (captured by hand-100)
 * OR in a broad river valley (captured by hand-1000).
 * Then creates a binary mask identifying all areas that are less than 5 meters
 * above the nearest fine-scale drainage line (hand-100),
 * and creates a mask for areas less than 7 meters above the nearest major drainage line (hand-1000).
 * It combines the two masks. A pixel gets a value of 1 (permissible for wetlands)
 * if it meets either the hand-100 condition OR the hand-1000 condition.
 * 
 * For each year (from 1985 to 2025), it first isolates only the pixels classified as Wetland (11).
 * Then, if a pixel is class 11 (Wetland) and is in a permissible low-lying area (mask = 1),
 * the math is 11 + 1 = 12, a remap function then converts 12 back to 11, keeping the wetland classification;
 * but if a pixel is class 11 (Wetland) but is in a high/steep area (mask = 0),
 * the math is 11 + 0 = 11, a remap function then converts 11 to 21 (Mosaic of Uses), removing the wetland classification.
 * The corrected wetland map is then blended back onto the original map for that year.
 * 
 * The final part of the script calculates the size (in pixels) of the contiguous patch it belongs to.
 * This creates a new set of bands (_conn).
 * This is useful for subsequent analysis, as it allows users to filter out small patches of land cover.
 * The final exported image contains both the corrected classification bands and these new _conn (connectedness) bands.
 * 
 * It uses as input data output data from script 09-30.
 * The output data from this script is used as an input in script 09-50.
 *
 */

// Define the description of the process.
var descricao = 'Masks Wetland with HAND data';

// Define the geometry for the Atlantic Forest region.
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

// Define the input version number (from previous step) and output version number.
var vesion_in = '14';
var versao_out = '15';

// Define the collection id.
var col = 11.0;

// Define input and output prefixes for asset naming.
var prefixo_in  = 'MA_col'+col+'_p09c_v';
var prefixo_out = 'MA_col'+col+'_p09d_v';

// Define input and output directories for assets.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define the year and biome.
var ano = 2020;
var bioma = "MATAATLANTICA";
var biomes_img = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
var biome_img = biomes_img.mask(biomes_img.eq(2));

// Load the input image (collection 10).
var imgCol =  ee.Image(dirout+prefixo_in+vesion_in);

// Import the palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters.
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
var vis2 = {
    'bands': 'classification_'+ano,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};
// Define the visualization parameters for HAND.
var vis_hand = {
    'min': 0,
    'max': 60,
    'palette': 'blue,white,green,orange,red,brown'
};

// Define the list of years to process.
var anos = ee.List.sequence(1985,2025)                                                           
                  .map(function(y){                                                     
                        return ee.Number(y).int(); });
                        
// Function to rename bands in an image, removing a prefix.
var corrIndx  = function (img){
                  // Get the names of all bands in the image.
                  var indxNames = img.bandNames();                              //bandNames creates an ee.List from bands of an ee.Image
                  // Create a new list of band names by removing the prefix from each original band name.
                  var bandNames = indxNames.map(function(nome){                 // Map over the band names.
                          return ee.String(nome).split('_').slice(1).join('_'); // Split the band name, remove the prefix, and rejoin.
                                      });
                                      
                  // Return the image with renamed bands.
                    return img.select(indxNames,bandNames); // Select the bands and rename them.
                              };

// Load the HAND images.
var hand30_100 = ee.ImageCollection('users/gena/global-hand/hand-100').mosaic();
// var hand30_1000 =  ee.Image("users/gena/GlobalHAND/30m/hand-1000");
var hand30_1000 =  ee.Image("projects/nexgenmap/MapBiomas2/ANCILARY/HAND_30_1000_South_America");

// Add the HAND images to the map.
Map.addLayer(hand30_100 ,vis_hand,'hand_100' ,false);
Map.addLayer(hand30_1000,vis_hand,'hand_1000',false);

// Create masks for HAND values less than 5 and 7.
var hand30_100_7  =  hand30_100 .lt(5);//.selfMask(); // Creates a mask (1 where HAND < 5, 0 otherwise)
var hand30_1000_7 =  hand30_1000.lt(7);//.selfMask(); // Creates a mask (1 where HAND < 7, 0 otherwise)

// Combine the masks.
// Adds the two masks. Sum will be 0 (neither low), 1 (one low), or 2 (both low).
// Remaps 0->0, 1->1, 2->1, resulting in a mask where 1 means low HAND in at least one layer.
var hand_join = hand30_100_7.add(hand30_1000_7).remap([0,1,2],[0,1,1]);

// Add the masks to the map.
// Map.addLayer(hand30_100,vis_hand,'hand_1000',false);
Map.addLayer(hand30_100_7, {    'min': 0,    'max': 1,'palette': 'white, blue'} ,'hand_100- 7', false);
Map.addLayer(hand30_1000_7,{    'min': 0,    'max': 1,'palette': 'white, blue'} ,'hand_1000- 7',false);

// Add the classification image to the map.
Map.addLayer(imgCol, vis2, 'imgCol', true);

// Apply corrections to the classification for each year, creating a new image collection
// which is then converted back to a multi-band image.
var image = ee.ImageCollection(anos
    .map(function (ano) {
                    ano = ee.Number(ano);
                    var anoStr = ano.format();  
                    var nomeBanda = ee.String('classification_').cat(anoStr);
                    var class_ano = imgCol.select(nomeBanda);
        
        // Mask the classification image for the current year to include only class 11.
        var class_umido_ano = imgCol.select(nomeBanda).mask(imgCol.select(nomeBanda).eq(11));

        // Apply the combined HAND mask (hand_join) to the isolated Wetland class (class_umido_ano) and remap values.
        // If a pixel is class 11 (Wetland) AND hand_join is 1 (low HAND), 
        // its value in class_umido_ano.add(hand_join) will be 11+1=12. Remapping 12 to 11 keeps it Wetland.
        // If a pixel is class 11 (Wetland) AND hand_join is 0 (NOT low HAND),
        // its value will be 11+0=11. Remapping 11 to 21 changes it to Mosaic of Uses.
        // Areas not originally class 11 are masked and are not affected by this calculation until the blending step.
        var varzea_hand = class_umido_ano.add(hand_join).remap([11,12],[100,11]);
        // Map.addLayer(class_corrigido_ano, vis, 'class_corrigido_ano', true);

        // Apply a focal mode filter to the classification image.
        var moda = class_ano.focalMode(3, 'square', 'pixels')
        // Filter the mode image by masking just the pixels with less than 6 connected pixels.

        var varzea_out = varzea_hand.eq(100).selfMask()
        var mask = moda.updateMask(varzea_out)

            mask = mask.remap([3,4,11,12,21,22,29,33,50],[3,4,21,12,21,22,29,33,50])
                                            .rename(nomeBanda)

        // Blend the original and filtered classifications.
        var class_out = class_ano.blend(mask.reproject({crs: 'EPSG:4326',scale: 30}));

 
      return class_out; // Return the corrected image for the current year.
// Convert the ImageCollection resulting from the map operation back into a multi-band Earth Engine Image.
//Each band corresponds to a year's corrected classification.
})).toBands();

// Apply the `corrIndx` function to clean up band names of potentially added prefixes.
image = corrIndx(image);
print(image);
// Add the corrected classification image to the map.
Map.addLayer(image, vis2, 'class_corrigido', true);

// Define the years to process.
var years = [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994,
    1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004,
    2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014,
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
    ];

// Create a list of band names.
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a frequency histogram dictionary of band names and image band names
// This is a check to ensure all expected bands exist in the image produced by the previous steps
// and to count how many times each band name appears across both lists.
var bandsOccurrence = ee.Dictionary(
    // Concatenate the two lists of band names and then reduce them using a frequency histogram reducer.
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

//print(bandsOccurrence);

// Create a dictionary of bands with masked bands
// Create a dictionary where (a) keys are the standard band names and
// (b) values are either the actual band from `image` (if it exists) or a masked band (if it somehow went missing).
// This step ensures that the final exported image has a band for every year.
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If( // 'If' decides whether to select the existing band or create a new masked one.
                ee.Number(value).eq(2),
                // If the band occurs twice, select the band from the original image.
                image.select([key]).byte(),
                // If the band occurs once, create a masked band.
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Convert the dictionary into a single multi-band image in the correct order.
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            // Add the band from the dictionary to the image.
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        // Initialize the image with an empty selection.
        ee.Image().select()
    )
);

// Generate an image where the pixel value represents the year for the corresponding classification band.
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);
    
// Add connected pixel count bands to the final image.
// These bands contain the size of the connected component for each pixel's classification value in each year.
var imageFilledConnected = image.addBands(
    image
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn');
            }
        ))
);

// Set the metadata for the final classification image.
imageFilledConnected = imageFilledConnected
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the final classification image to an asset.
Export.image.toAsset({
    "image": imageFilledConnected.toInt8(),
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": limite_MA,
    "overwrite": true
});

