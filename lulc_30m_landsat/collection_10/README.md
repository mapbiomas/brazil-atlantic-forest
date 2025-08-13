<div class="fluid-row" id="header">
    <img src='./misc/arcplan-logo.jpeg' height='70' width='auto' align='right'>
    <h1 class="title toc-ignore">Atlantic Forest</h1>
    <h4 class="author"><em>Developed by  ArcPlan - mrosa@arcplan.com.br</em></h4>
</div>

# About
This folder contains the scripts to classify and post-process the Atlantic Forest Biome.

We recommend that you read the Atlantic Forest Biome Appendix of the Algorithm Theoretical Basis Document (ATBD).
[Link to ATBD](https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2025/08/MataAtlantica-Appendix-ATBD-Collection-10-v1.docx.pdf)

# How to use
First, you need to copy these scripts (including those in p04 folder) to your Google Earth Engine (GEE) account.

# Pre-processing

Step 01-10: build stable pixels from Colleciton 9 and save a new asset

Step 01-20: apply corrections on the stable samples

Step 02-10: export segmented mosaic based on SNIC

Step 02-20: export balanced training samples for each region

Step 03-10: export trained samples for each year

Step 03-15: correct a lack of stable samples in years 2008 and 2009 in the Brazilian northeast (NE)

Step 03-20: define the feature importance for each region

# Classification

Step 04: classify and export classification and probability for each region and apply corrections in some regions

# Post-processing

Step 05-10: merge classification of each region and apply Gap fill filter to remove NODATA 

Step 05-20: merge probability of each region and apply Gap fill filter to remove NODATA

Step 05-30: remaps agriculture classes to mosaic of uses

Step 06-10: spatial filter

Step 06-20: temporal filter on first and last year

Step 06-30: classify Rocky Outcrop

Step 07-10: temporal filter-3year

Step 07-20: filter regeneration on rare classes

Step 07-30: stabilizes natural classes

Step 08-10: temporal filter-4year

Step 08-20: temporal filter-5year

Step 09-10: temporal filter of rare classes on first and last year

Step 09-20: filter rare classes on the middle years

Step 09-30: reduce recovery of rare classes

Step 09-40: apply HAND filter on wetlands

Step 09-50: filter minimum areas of transitions

Step 09-60: reduce forest in last year

Step 10-10: remove forest regeneration on last years on agriculture

Step 10-20: classify Wooded Sandbank Vegetation and corrects Rocky Outcrop

Step 10-30: spatial filter

Step 10-40: temporal filter-3year
