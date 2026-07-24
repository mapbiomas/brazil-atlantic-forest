/**
 * PROJECT: MapBiomas - Atlantic Forest (Collection 11)
 * OBJECTIVE: This script corrects rare classes in a land cover classification of the Atlantic Forest biome.
 * 
 * DESCRIPTION:
 * The script applies several targeted corrections to specific land cover classes:
 * savanna (4), herbaceous sandbank vegetation (50), wetland (11) and rock outcrop (29).
 * 
 * Savanna (class 4)
 * If a pixel is classified as savanna in any of the years 2023, 2024, or 2025,
 * it retains that classification for all previous years. This aims to correct inconsistencies
 * in savanna mapping across different years.
 * 
 * Herbaceous Sandbank Vegetation (class 50)
 * If a pixel is classified as herbaceous sandbank vegetation in 2023, 2024, or 2025,
 * it is assigned class 50 for all prior years. 
 * 
 * Wetland (class 11)
 * This correction is applied in three stages:
 * Beginning of the series (1985)
 * If a pixel is as wetland in 1985 and not wetland (other class) on the three subsequent years (1986, 1987, 1988),
 * this pixel is remapped to mosaic of uses (class 21) on the 1985 classification.
 * This creates a 1985's correction layer that is applied to the same year.
 * Beginning of the series (1986)
 * If a pixel is not wetland in 1985 but is in 1986, and changes on the two subsequent years (1987, 1988),
 * this pixel is remapped to mosaic of uses (class 21) on the 1986 classification.
 * This creates a 1986's correction layer that is applied to the same year.
 * End of the series (2025)
 * If a pixel is wetland in 2025 but not in the four preceding years (2024, 2023, 2022, 2021),
 * it creates a 2025's correction layer by bringing the classified values
 * from the previous year (2024) to the 2025 classification.
 * 
 * Rock Outcrop (class 29)
 * If a pixel is classified as rock outcrop in 2022, 2023, 2024, or 2025,
 * this classification is applied to all earlier years.
 * 
 * The script creates a new image (class_corrigido6) incorporating all the corrections.
 * 
 * It uses as input data output data from script 07-10.
 * The output data from this script is used as an input in script 07-30.
 * 
 */

// Define the description of the process.
var descricao = 'Corrects rare classes regeneration';

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
var vesion_in = '7';
var versao_out = '8';

// Define the collection id.
var col = 11.0;

// Define input and output prefixes for asset naming.
var prefixo_in  = 'MA_col'+col+'_p07a_v';
var prefixo_out = 'MA_col'+col+'_p07b_v';

// Define input and output directories for assets.
var dirin = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat/';
var dirout = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-'+col+'/GENERAL/classification-mat-ft/';

// Define the year and biome.
var oneYear = 2025;
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
    'bands': 'classification_'+oneYear,
    'min': 0,
    'max': 69,
    'palette': palettes.get('classification9')
};

// Create a list of years, excluding boundary years to avoid errors. Boundary years don't have one year before or one year after.
// Define years for processing.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];

var ultimo =  anos[anos.length-1]
var penul  =  anos[anos.length-2]
var antpen =  anos[anos.length-3]
var quarto =  anos[anos.length-4]
var quinto =  anos[anos.length-5]

// 2. Montar a imagem com os sinalizadores
var Num_ultimo =  ee.Number(ultimo)
var Num_penul =   ee.Number(penul)
var Num_antpen =  ee.Number(antpen)
var Num_quarto =  ee.Number(quarto)
var Num_quinto =  ee.Number(quinto)

// *** Savanna *** //

// Create a mask for savanna (class 4) based on the presence of class 4 in 2023, 2024, and 2025.
var mask4 =      imgCol.select(ee.String('classification_').cat(Num_antpen.format())).eq(4)
            .add(imgCol.select(ee.String('classification_').cat(Num_penul.format())) .eq(4))
            .add(imgCol.select(ee.String('classification_').cat(Num_ultimo.format())).eq(4))
            .remap([3],[4]);

// Loop through years to correct savanna classifications.
for (var i_ano=0;i_ano<anos.length; i_ano++){ 
  var ano = anos[i_ano];
  
  // Select the classification for the current year.
  var class_ano = imgCol.select('classification_'+ano);
  // Create a copy of the classification with class 3 remapped to 3.
  var class_ano_3 = imgCol.select('classification_'+ano).remap([3],[3]); // Preserve class 3
  
  // Apply the savanna correction for years before antpen.
  if (ano < antpen) {var class_out = class_ano.blend(mask4).blend(class_ano_3);}
  // Otherwise, use the original classification.
  else {var class_out = class_ano;}

  // Combine the corrected classifications for all years.
  if (i_ano == 0){ var class_corrigido1 = class_out; }  
  else {class_corrigido1 = class_corrigido1.addBands(class_out); }
}


// *** Herbaceous Sandbank Vegetation *** //

// Create a mask for herbaceous sandbank vegetation (class 50) based on the presence of class 5 in 2023, 2024, and 2025.
var mask13 =     imgCol.select(ee.String('classification_').cat(Num_antpen.format())).eq(50)
            .add(imgCol.select(ee.String('classification_').cat(Num_penul.format())) .eq(50))
            .add(imgCol.select(ee.String('classification_').cat(Num_ultimo.format())).eq(50))
            .remap([3],[50]);

// Define years for processing.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];

// Loop through years to correct herbaceous sandbank vegetation classifications.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification for the current year.
  var class_ano = class_corrigido1.select('classification_'+ano);
  
  // Apply the restinga correction for years before antpen.
  if (ano < antpen) {var class_out = class_ano.blend(mask13);}
  // Otherwise, use the original classification.
  else if (ano >= antpen) {var class_out = class_ano;}

  // Combine the corrected classifications for all years.
  if (i_ano == 0){ var class_corrigido2 = class_out; }  
  else {class_corrigido2 = class_corrigido2.addBands(class_out); }
}


// *** Wetland *** //

// Correct wetland (class 11) at the beginning of the time series (1985).
var mask11a =    imgCol.select('classification_1985').eq(11)   // this year
            .add(imgCol.select('classification_1986').neq(11))
            .add(imgCol.select('classification_1987').neq(11))
            .add(imgCol.select('classification_1988').neq(11))
            .remap([4],[1]);

// Select the classification for 1985.
var class_ano85  = class_corrigido2.select('classification_1985');
// Apply the wetland correction for 1985.
var corrige_varzea85 = class_ano85.mask(mask11a).remap([3,4,11,12,21,22,29,33,50],
                                                       [3,4,21,12,21,22,29,33,50]);

// Define years for processing.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
            
// Loop through years to correct wetland classifications at the beginning of time series (1985).
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification for the current year.
  var class_ano = class_corrigido2.select('classification_'+ano);
  
  // Apply the wetland correction for 1985.
  if (ano == 1985) {var class_out = class_ano.blend(corrige_varzea85);}
  // Otherwise, use the original classification
  else {var class_out = class_ano;}

  // Combine the corrected classifications for all years.
  if (i_ano == 0){ var class_corrigido3 = class_out; }  
  else {class_corrigido3 = class_corrigido3.addBands(class_out); }
}
//Map.addLayer(class_corrigido3, vis2, 'class_corrigido3', true);

// Correct wetland (class 11) at the beginning of the time series (1986).
var mask11b = class_corrigido3.select('classification_1985').neq(11)
                   .add(imgCol.select('classification_1986').eq(11))   // this year
                   .add(imgCol.select('classification_1987').neq(11))
                   .add(imgCol.select('classification_1988').neq(11))
                   .remap([4],[1]);

// Select the classification for 1986.
var class_ano86  = class_corrigido3.select('classification_1986');
// Apply the wetland correction for 1986.
var corrige_varzea86 = class_ano86.mask(mask11b).remap([3,4,11,12,21,22,29,33,50],
                                                       [3,4,21,12,21,22,29,33,50]);

// Define years for processing.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
            
// Loop through years to correct wetland classifications at the beginning of time series (1986).
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification for the current year.
  var class_ano = class_corrigido3.select('classification_'+ano);
  
  // Apply the wetland correction for 1985 and 1986.
  if      (ano == 1985) {var class_out = class_ano;}
  else if (ano == 1986) {var class_out = class_ano.blend(corrige_varzea86);}
  // Otherwise, use the original classification.
  else if (ano >= 1987) {var class_out = class_ano;}

  // Combine the corrected classifications for all years.
  if (i_ano == 0){ var class_corrigido4 = class_out; }  
  else {class_corrigido4 = class_corrigido4.addBands(class_out); }
}

//Map.addLayer(class_corrigido4, vis2, 'class_corrigido4', true);

// Correct wetland (class 11) at the end of the time series.
var mask11_ult =       imgCol.select(ee.String('classification_').cat(Num_quinto.format())).neq(11)
                  .add(imgCol.select(ee.String('classification_').cat(Num_quarto.format())).neq(11))
                  .add(imgCol.select(ee.String('classification_').cat(Num_antpen.format())).neq(11))
                  .add(imgCol.select(ee.String('classification_').cat(Num_penul.format())) .neq(11))
                  .add(imgCol.select(ee.String('classification_').cat(Num_ultimo.format())).eq(11))
            .remap([5],[1]);
            
// Select the classification for 2024.
var class_pen  = class_corrigido4.select(ee.String('classification_').cat(Num_penul.format()));
// Apply the wetland correction for 2025.
var corrigeVarzea_ult = class_pen.mask(mask11_ult);
  
//Map.addLayer(mask11_ult, vis, 'mask11_ult', true);
//Map.addLayer(corrigeVarzea_ult, vis, 'corrigeVarzea_ult', true);

// Define years for processing.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
  
// Loop through years to correct wetland classifications at the end of time series.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification for the current year.
  var class_ano = class_corrigido4.select('classification_'+ano);
  
  // Apply the wetland correction for last year.
  if (ano == ultimo) { var class_out = class_ano.blend(corrigeVarzea_ult); }
  // Otherwise, use the original classification.
  else { var class_out = class_ano; }

  // Combine the corrected classifications for all years.
  if (i_ano == 0){ var class_corrigido5 = class_out; }  
  else           { class_corrigido5 = class_corrigido5.addBands(class_out); }
}

// *** Rock Outcrop *** //

// Correct rock outcrop (class 29).
var mask29 =     imgCol.select(ee.String('classification_').cat(Num_quarto.format())) .eq(29)
            .add(imgCol.select(ee.String('classification_').cat(Num_antpen.format())) .eq(29))
            .add(imgCol.select(ee.String('classification_').cat(Num_penul.format()))  .eq(29))
            .add(imgCol.select(ee.String('classification_').cat(Num_ultimo.format())) .eq(29))
            .remap([4],[29]);

// Define years for processing.
var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,
            1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
            2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];

// Loop through years to correct rock outcrop classifications.
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  
  // Select the classification for the current year.
  var class_ano = class_corrigido5.select('classification_'+ano);
  
  // Apply the rock outcrop correction for years before 2021.
  if (ano < quarto) {var class_out = class_ano.blend(mask29);}
  // Otherwise, use the original classification.
  else if (ano >= quarto) {var class_out = class_ano;}

  // Combine the corrected classifications for all years.
  if (i_ano == 0){ var class_corrigido6 = class_out; }
  else {class_corrigido6 = class_corrigido6.addBands(class_out); }
}

print(class_corrigido6);

// Add the original and corrected images to the map.
Map.addLayer(imgCol, vis2, 'class_original'+oneYear, true);
Map.addLayer(class_corrigido6, vis2, 'class_corrigido6'+oneYear, true);

// Show the difference between original and corrected classifications.
var efeito = imgCol.select('classification_'+oneYear).neq(class_corrigido6.select('classification_'+oneYear));
Map.addLayer(efeito, {}, 'mudancas');

// Set the metadata for the final classification image.
class_corrigido6 = class_corrigido6
.set('territory', 'BRAZIL')
.set('biome', 'MATAATLANTICA')
.set('source', 'arcplan')
.set('version', versao_out)
.set('collection_id', col)
.set('description', descricao);

// Export the final classification image to an asset.
Export.image.toAsset({
    "image": class_corrigido6.toInt8(),
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
