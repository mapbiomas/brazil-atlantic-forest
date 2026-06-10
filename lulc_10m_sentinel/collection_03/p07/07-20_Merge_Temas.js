/**
 * This script merges land use, Fernando de Noronha, and agricultural classifications into a unified asset.
 * It applies a conditional filter to conditionally integrate the Noronha maps starting from the year 2022.
 * The combined yearly layers are compiled into a final multi-band image mosaic for asset exportation.
 */

// Description string for metadata
var description = 'Merge entre Areas de Agricultura, FN e Regioes'
// Collection database identifier number
var collection_id = 3.0

// Define the biome for processing
var bioma = "MATAATLANTICA";

// Define the input and output versions
var vesion_in = '11';
var versao_out = '12';

// Define the input and output prefixes for the asset names
var prefixo_out = 'MA_S2_p72_merge_v';

// Define the output directory for the asset
var dir_in = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Input directory
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat/'; // Output directory

// Load the input images
var class_uso = ee.Image(dirout+'MA_S2_p60_v'+vesion_in);
var class_nor = ee.Image(dirout+'FNoronha_p71_v'+'4'); // This only has 2022, 2023, 2024
var class_agr = ee.Image(dirout+'MA_S2_p60_agric_v'+'2');

// Load the palettes for visualization
var palettes = require('users/mapbiomas/modules:Palettes.js');
var pal = palettes.get('classification9');

// Define the visualization parameters for the images
var vis = {
      bands: 'classification_2023',
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
    };
var vis2 = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Add the input images to the map for visualization
Map.addLayer(class_uso, vis, 'class_uso', false);
Map.addLayer(class_nor, vis, 'class_nor', false);
Map.addLayer(class_agr, vis, 'class_agr', false);

// Define the years to process
var anos = ['2017','2018','2019','2020','2021', '2022','2023','2024'];
//var anos = ['2023']

// Loop through each year
for (var i_ano=0;i_ano<anos.length; i_ano++){  
    // Get the current year string
    var ano = anos[i_ano];  
    
    // 1. Convert the year string to ee.Number
    var anoNum = ee.Number.parse(ano); 
    
    // 2. Define the predicate condition: year >= 2022
    var condicao = anoNum.gte(2022); // ee.Bool

    // 3. Select bands that always exist
    var bandName = 'classification_' + ano;
    var class_uso_ano = class_uso.select(bandName).toInt8();
    var class_agr_ano = class_agr.select(bandName).toInt8();

    // 4. Create the remapping of class 19
    var class__21_ano = class_uso_ano.eq(21);
    var class_agr__19 = class_agr_ano.eq(19).mask(class__21_ano).remap([1],[19]).rename(bandName).toInt8();

    // 5. Define the Image Collections for True and False conditions.
    var class_nor_ano = class_nor.select(bandName).rename(bandName).toInt8();
    
    // If TRUE (year >= 2022): Include class_nor
    var imgColTrue = ee.ImageCollection.fromImages([
        class_uso_ano,
        class_nor_ano, // Additional layer for years >= 2022
        class_agr__19
    ]);
    
    // If FALSE (year < 2022): Do not include class_nor
    var imgColFalse = ee.ImageCollection.fromImages([
        class_uso_ano,
        class_agr__19
    ]);

    // 6. Use ee.Algorithms.If to choose the collection for mosaicking
    var img_col = ee.ImageCollection(ee.Algorithms.If(
        condicao,      // Condition: year >= 2022
        imgColTrue,    // True value: Collection with class_nor
        imgColFalse    // False value: Collection without class_nor
    )).mosaic(); // Mosaic the result of the IF statement

    // 7. Combine the images for each year
    if (i_ano == 0){ var class_outTotal = img_col }  
    // Append the current year band to the total collection image
    else {class_outTotal = class_outTotal.addBands(img_col); }
}

// Print the final output image to the console for debugging
print('class_outTotal', class_outTotal)

// Add the final output image to the map for visualization
Map.addLayer(class_outTotal, vis, 'class_outTotal');
// Map.addLayer(class_out2, vis, 'class_out2');

// Set the metadata for the output image
class_outTotal = class_outTotal
.set('territory', bioma)
.set('biome', bioma)
.set('source', 'arcplan')
.set('version', version_out)
.set('collection_id', collection_id)
.set('description', description)

// Export the output image to an asset
Export.image.toAsset({
    'image': class_outTotal,
    'description': prefixo_out+versao_out,
    'assetId': dirout+prefixo_out+versao_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
});
