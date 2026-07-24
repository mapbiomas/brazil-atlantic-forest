/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 4)
 * OBJECTIVE: Standardize agricultural classes by remapping specific crop categories into Mosaic of Agriculture and Pasture.
 * 
 * DESCRIPTION:
 * This script processes the multi-temporal merged classification of the Atlantic Forest for the 2017-2025 period.
 * Its primary purpose is to simplify the thematic legend by remapping specific agricultural classes—Rice (9) and 
 * Temporary Crops (19)—into the "Mosaic of Agriculture and Pasture" (21) category. 
 * The workflow includes:
 * 1. Iterating through each year to apply the remapping logic.
 * 2. Reconstructing the multi-band temporal stack to ensure all years are present.
 * 3. Calculating the spatial connectivity (connected pixel count) for the remapped classes to support future spatial filters.
 * 4. Assigning standardized Collection 4 metadata and exporting the final consolidated product as an Earth Engine Asset.
 */

// Define the processing description in English
var description = 'Remap Agriculture (9 and 19) to 21';
// Define the collection identifier as a float 4.0
var collection_id = 4.0;

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define the input and output versions as strings in single quotes
var version_in = '4';
var version_out = '5';

// Define the input and output prefixes for the asset names
var prefixo_in = 'MA_S2_p72_merge_v';
var prefixo_out = 'MA_S2_p73_remap_v';

// Define the input and output directories for the classification assets
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat/'; 
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/GENERAL/classification-mat/'; 


// Load the multi-temporal classification image resulting from the previous merge step
var classMERGE = ee.Image(dirout + prefixo_in + version_in);
// Log the loaded image structure to the console
print(classMERGE);

////*************************************************************
// Do not Change from these lines
////*************************************************************

// Add the standardized geometry for the Atlantic Forest study area
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-56.05851880152852, -30.04613371617718],
          [-49.20305005152852, -30.841736663987348],
          [-41.46867505152852, -23.861579784474333],
          [-34.17375317652852, -8.163484389272043],
          [-32.251145754653514, -3.695273154047937],
          [-35.66789380152852, -4.582835761516412],
          [-49.07121411402852, -16.947367124654484],
          [-56.10246411402852, -21.01873071079243]]]);

// Import the MapBiomas palettes module for map visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');

//Define one year for visualization and processing checks
var oneYear = 2023;

// Define visualization parameters for the 2023 reference year
var vis = {
      bands: 'classification_' + oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
    };
// Define general visualization parameters for classification layers
var vis2 = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};


// Define the time series range covering the years from 2017 to 2025
var anos = ['2017','2018','2019','2020','2021','2022','2023','2024','2025'];

// Iterate through the years to perform the thematic remapping
for (var i_ano=0; i_ano<anos.length; i_ano++){  
  // Select the current year from the array
  var ano = anos[i_ano]; 
  
  // Add the original classification band to the map for visual comparison
  Map.addLayer(classMERGE.select('classification_' + ano), vis, 'class_orig_' + ano, false);

  // Apply the remapping logic: convert Rice (9) and Temporary Crop (19) into Mosaic (21)
  // Input values: [Forest, Savanna, Wetland, Grassland, Rice, TempCrop, Mosaic, OtherAgri, Pasture, Urban, Bare, Outcrop, Water, OtherNonVeg]
  // Output values: Standardizing 9 and 19 to 21
  var class_ano = classMERGE.select('classification_' + ano).remap(
       [3,4,11,12, 9,19,21,41,22,23,25,29,33,50],
       [3,4,11,12,21,21,21,21,22,23,25,29,33,50]).rename('classification_' + ano);

  
  // Initialize the combined image or append the processed band to the multi-band stack
  if (i_ano == 0){ 
    var image = class_ano;
    }  
  else {
    image = image.addBands(class_ano); 
  }
}

// Display the final multi-temporal remapped image on the map
Map.addLayer(image, vis2, 'class_final');

// Define the years for the temporal consistency check and band naming
var years = [
    2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
    ];

// Generate a list of band names formatted as 'classification_YYYY'
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// Create a histogram dictionary to identify missing or duplicate bands in the stack
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

// Iterate through the occurrence dictionary to build a consistent image stack
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                // If value is 2, the band exists in the target list and the image
                ee.Number(value).eq(2),
                image.select([key]).byte(),
                // If value is 1, the band is missing; create an empty masked band as a placeholder
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// Concatenate all individual year bands into a final chronological image stack
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            // Append each band from the dictionary to the growing image stack
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        // Start the iteration with an empty image selection
        ee.Image().select()
    )
);

// Create a temporal metadata image where each pixel stores the year value
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);
    
// Calculate the number of connected pixels of the same class for each year
// This band is used for spatial filtering of small isolated pixel patches
var imageFilledConnected = image.addBands(
    image
        .connectedPixelCount(100, true)
        .rename(bandNames.map(
            function (band) {
                // Rename each connectivity band with the suffix '_conn'
                return ee.String(band).cat('_conn');
            }
        ))
);

// Apply standardized MapBiomas Collection 4 metadata properties to the final output
imageFilledConnected = imageFilledConnected
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description);

// Export the remapped and processed multi-band classification to a Earth Engine Asset
Export.image.toAsset({
    'image': imageFilledConnected,
    'description': prefixo_out + version_out,
    'assetId': dirout + prefixo_out + version_out,
    // Use mode pyramiding policy suitable for categorical/classification data
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13,
    'overwrite': true
});