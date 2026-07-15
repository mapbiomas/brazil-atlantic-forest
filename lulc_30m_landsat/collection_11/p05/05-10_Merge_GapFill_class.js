/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Merging all classified regions and apply gapfill on NoData.
 * 
 * DESCRIPTION:
 * This script merges a set of classified images, one for each of 30 defined regions,
 * and performs a gap-filling for the entire Atlantic Forest. It loads each regional classification image,
 * applies a mask to remove zero values, and adds it to a list that is used to create a single mosaic where
 * overlapping regions are combined. It first fills gaps in each band by using data from the preceding band, 
 * then repeats the process in reverse.
 * 
 * Uses as input classified images for each of the 30 regions of the Atlantic Forest from scripts 04-XX.
 * The output data from this script (merged gap-filled image) is used as an input in script 05-30.
 * 
 */

var inicioTempo = ee.Date(Date.now())
print('Inicio:', inicioTempo);

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

// Set the connected pixel count flag indicating whether to use 8-connectedness for gap filling.
var VeightConnected = true;

// Define the description of the process.
var descricao = 'Merge and Gap Fill';

// Define the collection id.
var col = 11.0;

// Define input and output directories for assets.
var dircol = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define the output prefix.
var prefixo_out = 'MA_col'+col+'_p05a_v';

// Define the output version.
var versao_out = '1';

// Define the year and biome.
var ano = 1990;
var bioma = "MATAATLANTICA";

// Load regions feature collection.
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Import the palettes module.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define visualization parameters.
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};
var vis2 = {'bands':'classification_'+ano , 'min': 0,'max': 69,'palette': palettes.get('classification9')};

// Initialize an empty list for images.
var img_col = ee.List([]);

// Load a reference image (LULC Collection 9).
var colecao = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1');
Map.addLayer(colecao.select('classification_'+ano), vis, 'LULC Col 10 (LandSat) '+ ano, false);


// Define the list of regions and their last versions.
var lista_regs =[
                ['reg_10','1'],['reg_09','1'],['reg_01','1'],
                ['reg_02','1'],['reg_03','1'],
                ['reg_06','1'],['reg_07','1'],['reg_08','1'],
                ['reg_11','2'],['reg_12','1'],['reg_13','1'],['reg_14','1'],['reg_15','1'],
                ['reg_16','1'],['reg_17','1'],['reg_18','1'],['reg_19','1'],['reg_20','1'],
                ['reg_27','2'],['reg_21','1'],
                ['reg_22','3'],['reg_23','3'],
                ['reg_25','2'],['reg_29','1'],
                ['reg_26','1'],['reg_28','1'],['reg_30','1'],
                ['reg_04','1'],['reg_05','1'],['reg_24','1']
                ];
  
// Define the seed and input version.
var seed = 1;
//var versao_in = '1';

// Loop through the regions and add their CLASSIFICATION IMAGES to the list.
for (var i_reg=0;i_reg<lista_regs.length; i_reg++){
  // Get region ID and version.
  var regiaoList = lista_regs[i_reg];
  var regiaoID   = regiaoList[0];
  var version_reg   = regiaoList[1];
  

  // Load the CLASSIFICATION IMAGE for the current region.
  var img = ee.Image(dircol + regiaoID+'-RF85a25_v'+version_reg);
  // Add the image to the list, applying a mask to only include non-zero values.
  img_col = img_col.add(img.selfMask());
}
print(img_col);

// Create an image collection from the list of images.
var mosaic = ee.ImageCollection.fromImages(img_col).mosaic();

// Mask the image to remove zero values.
var image = mosaic.mask(mosaic.neq(0));
print(image);

// Define the years to process.
var years = [
    1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
    1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
    2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
    2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025
    ];

/**
 * Applies a gap-filling algorithm to an image.
 *
 * This function iteratively fills gaps in a multi-band image by using the values from neighboring bands.
 * It performs two passes: one from the first band to the last, and another in reverse order.
 *
 * @param {ee.Image} image - The input multi-band image.
 * @return {ee.Image} The gap-filled image.
 */
var applyGapFill = function (image) {
    // Performs a single pass of gap filling, from the first band to the last (from t0 until tn).
    var imageFilledt0tn = bandNames.slice(1)
        .iterate(
            function (bandName, previousImage) {
                // Select the current band.
                var currentImage = image.select(ee.String(bandName));
                // Cast the previous image to an ee.Image.
                previousImage = ee.Image(previousImage);
                // Unmask the current band using the last band of the previous image.
                currentImage = currentImage.unmask(
                  previousImage.select([0]));
                // Add the current band to the previous image.
                return currentImage.addBands(previousImage);
            },
            // Initialize the iteration with the first band.
            ee.Image(imageAllBands.select([bandNames.get(0)]))
        );

    // Cast the image to an ee.Image.
    imageFilledt0tn = ee.Image(imageFilledt0tn);

    // Performs a single pass of gap filling, from the last band to the first (from tn until t0).
    // Reverse the band names list.
    var bandNamesReversed = bandNames.reverse();

    // Iterate through the reversed band names list.
    var imageFilledtnt0 = bandNamesReversed.slice(1)
        .iterate(
            function (bandName, previousImage) {
                // Select the current band from the image filled from t0 to tn.
                var currentImage = imageFilledt0tn.select(ee.String(bandName));
                // Cast the previous image to an ee.Image.
                previousImage = ee.Image(previousImage);
                // Unmask the current image using the last band of the previous image.
                currentImage = currentImage.unmask(
                    previousImage.select(previousImage.bandNames().length().subtract(1)));
                // Add the current band to the previous image.
                return previousImage.addBands(currentImage);
            },
            // Initialize the iteration with the last band.
            ee.Image(imageFilledt0tn.select([bandNamesReversed.get(0)]))
        );

    // Cast the image to an ee.Image and select the original band names.
    imageFilledtnt0 = ee.Image(imageFilledtnt0).select(bandNames);

    // Return the image filled from tn to t0.
    return imageFilledtnt0;
};

// Create a list of band names based on the years.
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a histogram dictionary of band names and image band names.
// Analyze band occurrences to identify bands present in both the input and output images.
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

print(bandsOccurrence);

// Create a dictionary of bands with masked bands.
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                // If the band occurs twice, select the band from the original image.
                image.select([key]).byte(),
                // If the band occurs once, create a masked band.
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Convert the dictionary to an image.
// Combine all bands into a single image.
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

// Create an image representing the year for each pixel.
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);

// Apply the gap fill function to the images.
var imageFilledtnt0 = applyGapFill(imageAllBands);
var imageFilledYear = applyGapFill(imagePixelYear);

// Add the original and filtered images to the map.
Map.addLayer(image, vis2, 'merged',false);
Map.addLayer(imageFilledtnt0, vis2, 'filled'); //.mask(bioma250mil_MA)
//print(imageFilledtnt0);

var fimTempo = ee.Date(Date.now())
print('Fim:', fimTempo);

var tempo = fimTempo.difference(inicioTempo, 'second').divide(1000);
print('Tempo total (ms):', tempo);

var classified85a25 = imageFilledtnt0

// Define the years to process.
var anos = ['1985','1986','1987','1988','1989','1990','1991','1992','1993','1994',
            '1995','1996','1997','1998','1999','2000','2001','2002','2003','2004',
            '2005','2006','2007','2008','2009','2010','2011','2012','2013','2014',
            '2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
            
// Loop through the years and blend the classification image with the agriculture images.
for (var i_ano=0;i_ano<anos.length; i_ano++){  
  var ano = anos[i_ano]; 
  
  // Add the original classification image to the map.
  Map.addLayer(classified85a25.select('classification_'+ano), vis, 'class_orig_'+ano, false);

  // Remap the classification values for the current year. (9, 19 and 41 > 21).
  var class_ano = classified85a25.select('classification_'+ano).remap(
       [3,4,11,12,13, 9,18,21,41,22,33,50],
       [3,4,11,12,13,21,21,21,21,22,33,50]).rename('classification_'+ano);

  // Combine the blended images for all years. Build the final image by adding bands for each year.
  if (i_ano == 0){ 
    var image = class_ano;
    }  
  else {
    image = image.addBands(class_ano); 

  }
}

//print(class_outTotal);

// Add the final blendedv remapped image to the map.
Map.addLayer(image, vis2, 'remapped');

// Define the years to process.
var years = [
    1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
    1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
    2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
    2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025
    ];

// Create a list of band names.
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a histogram dictionary of band names and image band names.
// Count the occurrences of each band.
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);
//print(bandsOccurrence);

// Create a dictionary of bands with masked bands.
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                // If the band occurs twice, select the band from the original image.
                image.select([key]).byte(),
                // If the band occurs once, create a masked band.
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Convert the dictionary to an image.
// Combine all bands into a single image.
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

// Create an image with year information for each pixel.
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);
    
// Add connected pixels bands.
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
var class_final = imageFilledConnected
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);
//print(classified85a25);

// Export the final classification image to an asset.
Export.image.toAsset({
  "image": class_final.toInt8(),
  "description": prefixo_out + versao_out,
  "assetId": dirout + prefixo_out + versao_out,
  "scale": 30,
  "pyramidingPolicy": {
      '.default': 'mode'
  },
  "maxPixels": 1e13,
  "region": limite_MA,
  // "overwrite": true
});
