// Summary: This script merges two Earth Engine Feature Collections containing training samples for the Atlantic Forest biome. 
// It performs an inner join between Sentinel-2 spectral training points and satellite embedding training points using a unique identifier ('uid'). 
// The script loops over specified years, merges the properties of both collections while avoiding name collisions, and exports the combined 
// datasets as new Google Earth Engine assets.

// Define the output directory
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/'

// Define the output version
var versao_out = '6'

// Define the list of years to be processed
var anos = [
            2016,2017,2018,2019,2020,2021,2022,2023,
            2024, 2025
            ]   

// Loop through each year
for (var i_ano=0;i_ano<anos.length; i_ano++){
    // Get the current year.
    var ano = anos[i_ano];  
// var pts_s2 = ee.FeatureCollection("projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/pontos_train_s2_v3_2024");

// Load the Sentinel-2 training samples for the current year
var pts_s2 = ee.FeatureCollection("projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/pontos_train_s2_v5_"+ano);
// Print the first feature of the Sentinel-2 samples to the console
print(pts_s2.limit(1))

//var pts_emb = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/pontos_train_emb_v3_2024')

// Load the embedding training samples for the current year
var pts_emb = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/S2_EMBEDDING/MATA_ATLANTICA/pontos_train_emb_v4_'+ano)
// Print the first feature of the embedding samples to the console
print(pts_emb.limit(1))

// inner join por uid
// Define an inner join algorithm
var join = ee.Join.inner();
// Define the join condition based on the 'uid' field
var onUid = ee.Filter.equals({leftField: 'uid', rightField: 'uid'});
// Apply the inner join to pair the Sentinel-2 and embedding collections
var paired = join.apply(pts_s2, pts_emb, onUid);

// copie propriedades de s2 para s1 (evite colisão de nomes)
// Create a new FeatureCollection from the paired results, merging their properties
var merged = ee.FeatureCollection(paired.map(function(p){
  // Extract the primary feature (Sentinel-2)
  var a = ee.Feature(p.get('primary'));
  // Extract the secondary feature (embeddings)
  var b = ee.Feature(p.get('secondary'));
  // inclua explicitamente só as bandas do grupo 2
  // Define a list of properties to exclude from the copy operation to avoid collision
  var grp2 = [
'reference','reg_id','system:index','uid','year'
  ];
  // Return the primary feature with all properties from the secondary feature added, except the excluded ones
  return a.copyProperties(b, null, grp2);
}));



// Add the embedding points layer to the map
Map.addLayer(pts_emb, {}, 'pts embeddings')
// Add the Sentinel-2 points layer to the map
Map.addLayer(pts_s2, {}, 'pts sentinel')
// Add the merged points layer to the map
Map.addLayer(merged, {}, 'pts merged')

// Print the total number of embedding points
print(pts_emb.size(),'pts embeddings')
// Print the total number of Sentinel-2 points
print(pts_s2.size(),'pts sentinel')
// Print the first feature of the merged collection to check its properties
print(merged.limit(1),'pts merged')


// Export the training sample collection to an asset
Export.table.toAsset(merged, 'pontos_train_s2_emb_v'+versao_out+'_'+ano, dirout + 'pontos_train_s2_emb_v'+versao_out+'_'+ano);
}