/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: Spectral sampling of stable training points for machine learning classification.
 * 
 * DESCRIPTION:
 * This script performs the extraction of spectral, textural, and spatial features from yearly 
 * Landsat mosaics for a set of stable training points. It uses Collection 9 stable samples 
 * adapted for the current Collection 11 efforts. For every year between 1985 and 2025, the 
 * script constructs a multi-band image containing median spectral bands, a temporal 'year' band, 
 * and calculated coordinate features (Latitude/Longitude). The process is organized into 
 * regional batches (groups of regions) to manage Google Earth Engine's computational 
 * load. In each region, the script samples the mosaic at the exact locations of the training 
 * points using 'sampleRegions'. The resulting tables, containing the original labels and 
 * the extracted band values, are exported as Assets to be used as input for 
 * Random Forest or other classifiers in subsequent steps.
 * 
 * This script uses the stratified sample table from script 02-10 as an input.
 * The output data from this script is used on scripts 04-XX as an input.
 * 
 */

// Define the geographical boundary of the Atlantic Forest (Mata Atlântica) for data clipping.
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

// Variable to track the version of the input point collection.
var versao_pt = '1';
// Variable to define the version of the exported output asset.
var versao_out = '1';

// Identification of the current MapBiomas collection.
var colN = '11'

// Define source and destination directories for assets.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/SAMPLES/MATAATLANTICA/';

// Visualization settings for the Landsat mosaics (SWIR1, NIR, Red).
var vis_mos = {
    bands: ['swir1_median', 'nir_median', 'red_median'],
    gain: [0.08, 0.06, 0.2],
    gamma: 0.85
};

// Import the external MapBiomas palettes module for consistent map styling.
var palettes = require('users/mapbiomas/modules:Palettes.js');

// Standard classification visualization parameters using the MapBiomas legend.
var vis = {
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Load the administrative/processing regions for the Atlantic Forest.
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_Regioes2025');
// Add the regions layer to the map for spatial verification.
Map.addLayer(regioesCollection, {}, 'regioesCollection', false);

// Palette string for NDVI amplitude mapping.
var ndvi_color = '0f330f, 005000, 4B9300, 92df42, bff0bf, FFFFFF, eee4c7, ecb168, f90000';

// Visualization settings for the NDFI amplitude layer.
var visParNDFI_amp = {'min':0, 'max':300, 'palette':ndvi_color};

// Import the Landsat mosaic generation script.
var mos = require('users/marcosrosaUSP/MapBiomas_col10_MA:Mata_Atlantica_LANDSAT/passo01/old_mosaicos_mensais_do_Google_v3');

// Load multi-temporal cluster assets providing textural and segmentation data.
var mosaicos_MA_clusters = ee.Image('projects/mapbiomas-workspace/COLECAO_10/MA_clusters_1985_2024_asset_salvo')
                             .addBands('projects/nexgenmap/ANCILLARY/MATA_ATLANTICA/MOSAICS/MA_clusters_2025_asset_salvo');
// Print the cluster image metadata to the console.
print(mosaicos_MA_clusters);

// Seed values for reproducibility in random operations (currently using 1).
var lista_seeds = [1];
var seed = 1;

// Load the stratified training point collection and add a random column for data splitting.
var pts = ee.FeatureCollection(dirin+'MA_amostras_estratificadas_col'+colN+'_v'+versao_out);
    pts = pts.randomColumn('random', 1).map(function(feature) {
  // Ensure the class_name property is initialized as empty.
  return feature.set('class_name', ''); 
});

// Display a subset of points for the region 'reg_21' on the map.
Map.addLayer(pts.filter(ee.Filter.eq('reg_id', 'reg_21')).filterBounds(geometry), {}, 'pts estrato')

// Define the full temporal range of years to be processed.
var anos = [
            1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,
            2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025
            ];

// Start the annual processing loop.
for (var i_ano=0; i_ano<anos.length; i_ano++){
    // Identify the current year in the iteration.
    var ano = anos[i_ano];
    
    // Retrieve the yearly Landsat mosaic for the Atlantic Forest region.
    var mosaicoTotal = mos.getMosaic(ano, limite_MA); 
    // Create a constant image for the year and add it as a new band.
    var img_ano = ee.Image(ano); 
    mosaicoTotal = mosaicoTotal.addBands(img_ano.rename('ano'));

    // Generate a pixel-level longitude and latitude image to use as spatial features.
    var ll = ee.Image.pixelLonLat().clip(limite_MA);                 

    // Rescale and cast coordinates to Int16 to optimize storage and provide useful gradients for the classifier.
    var long = ll.select('longitude').add(34.8).multiply(-1).multiply(1000).toInt16();
    var lati = ll.select('latitude').add(5).multiply(-1).multiply(1000).toInt16();

    // Attach the spatial coordinate bands to the main mosaic image.
    mosaicoTotal = mosaicoTotal.addBands(long.rename('longitude'));
    mosaicoTotal = mosaicoTotal.addBands(lati.rename('latitude' ));
    
    // Add the prepared multi-band image for the current year to the map view.
    Map.addLayer(mosaicoTotal, vis_mos, 'ImgYear'+ano, false)

    // Configuration of processing batches. Note: Several batches are commented out for manual control.
    
    // Example: Batch 1 containing regions 01 to 05.
    // var regioes_lista = [['reg_01'],['reg_02'],['reg_03'],['reg_04'],['reg_05']]
    // var batch = 'b1'
    
    // Example: Batch 2 containing regions 06 to 10.
    // var regioes_lista = [['reg_06'],['reg_07'],['reg_08'],['reg_09'],['reg_10']]
    // var batch = 'b2'
    
    // Example: Batch 3 containing regions 11 to 15.
    // var regioes_lista = [['reg_11'],['reg_12'],['reg_13'],['reg_14'],['reg_15']]
    // var batch = 'b3'
    
    // Example: Batch 4 containing regions 16 to 20.
    // var regioes_lista = [['reg_16'],['reg_17'],['reg_18'],['reg_19'],['reg_20']]
    // var batch = 'b4'
    
    // Example: Batch 5 containing regions 21 to 25.
    // var regioes_lista = [['reg_21'],['reg_22'],['reg_23'],['reg_24'],['reg_25']]
    // var batch = 'b5'
    
    // Active Batch 6: regions 26 to 30.
    var regioes_lista = [
        ['reg_26'],['reg_27'],['reg_28'],['reg_29'],['reg_30']]
    var batch = 'b6'

    
    // Start the regional loop within the current year and batch.
    for (var i_regiao=0; i_regiao<regioes_lista.length; i_regiao++){
      // Extract the region ID from the current list element.
      var lista = regioes_lista[i_regiao]; 
      var regiao = lista[0];
      // Define spatial limits by filtering the regional boundary collection.
      var limite = regioesCollection.filter(ee.Filter.eq('reg_id',regiao));
      
      // Select training points that belong to the current region.
      var pts_reg = pts.filter(ee.Filter.eq('reg_id',regiao));
  
      // Extract band values from the mosaic for each point location.
      var training = mosaicoTotal.sampleRegions({
          'collection': pts_reg,
          'scale': 30, // Sample at the Landsat pixel resolution.
          'tileScale': 4, // Increase parallelization to handle dense point datasets.
          'geometries': true // Preserve the vector geometry in the resulting points.
      });
        
      // Aggregate the sampled points from different regions into a single collection for the batch.
      if (i_regiao == 0){ 
          var training_reg = training; // Initialize with the first region.
      }  
      else {
          training_reg = training_reg.merge(training); // Merge subsequent regions.
      }
  
    }    

  // Start the export process to save the sampled data as a Google Earth Engine Asset.
  Export.table.toAsset({
    collection: training_reg, 
    description: 'pontos_train_'+batch+'_v'+versao_out+'_'+ano,
    assetId: dirout + 'pontos_train_'+batch+'_v'+versao_out+'_'+ano,
    overwrite: true // Overwrite existing assets with the same ID.
  });
  
} // End of year loop.