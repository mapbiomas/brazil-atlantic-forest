/**
 * This script remaps agricultural classification sub-classes into a unified category.
 * It loops across annual bands, applies a structural remap, and computes connectivity metrics.
 * The multi-band result with tracking suffixes is appended with metadata and saved as an asset.
 */

// Define metadata description string
var description = 'Remapeia Agricultura (9 e 19) para 21'
// Define database collection identifier number
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define the input and output versions
var vesion_in   = '12';
var version_out  = '13';

// Define the input and output prefixes for the asset names
var prefixo_in = 'MA_S2_p72_merge_v';
var prefixo_out = 'MA_S2_p73_remap_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Output directory


// Load the classification image
var classMERGE = ee.Image(dirout+prefixo_in+vesion_in)//MA_S2_p72_merge_v12

// Print source image metadata configuration to logs
print(classMERGE);

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Load the biomes image
//var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41');
//var bioma250mil_MA = biomes.mask(biomes.eq(2));
//Map.addLayer(bioma250mil_MA,{'palette': 'ccffcc'}, 'bioma250mil_MA', false);

// Import the palettes module
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Define the palettes for visualization
var vis = {'min': 0,'max': 69,'palette': palettes.get('classification9')};


// Define the years to process
var anos = ['2017','2018','2019','2020','2021','2022','2023','2024'];

//var anos = ['2022'];

// Loop through the years and blend the classification image with the agriculture images
for (var i_ano=0;i_ano<anos.length; i_ano++){  
  // Set loop index year value
  var ano = anos[i_ano]; 
  
  // Add the original classification image to the map
  Map.addLayer(classMERGE.select('classification_'+ano), vis, 'class_orig_'+ano, false);

  // Remap the classification image for the current year
  var class_ano = classMERGE.select('classification_'+ano).remap(
       [3,4,11,12, 9,19,21,41,22,29,33,50],
       [3,4,11,12,21,21,21,21,22,29,33,50]).rename('classification_'+ano);

  
  // Combine the blended images for all years
  if (i_ano == 0){ 
    var image = class_ano;
    }  
  else {
    // Append current remapped year band to previous results
    image = image.addBands(class_ano); 

  }
}

//print(class_outTotal);
// Add the final blended image to the map
Map.addLayer(image, vis, 'class_final');

// Define chronological list of assessment years
var years = [
    2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
    ];

// Create a list of band names
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Generate a histogram dictionary of band names and image band names
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

//print(bandsOccurrence);

// Create a dictionary of bands with masked bands
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                // If the band occurs twice, select the band from the original image
                image.select([key]).byte(),
                // If the band occurs once, create a masked band
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Convert the dictionary to an image
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            // Add the band from the dictionary to the image
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        // Initialize the image with an empty selection
        ee.Image().select()
    )
);

// Create baseline image populated with constant year values
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);
    
// Add connected pixels bands
var imageFilledConnected = image.addBands(
    image
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_conn');
            }
        ))
);

//print(imageFilledConnected);

// Set the metadata for the output image
imageFilledConnected = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': imageFilledConnected,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});
