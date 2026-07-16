<div class="fluid-row" id="header">
    <img src='./misc/arcplan-logo.jpeg' height='70' width='auto' align='right'>
    <h1 class="title toc-ignore">Atlantic Forest</h1>
    <h4 class="author"><em>Developed by  ArcPlan - mrosa@arcplan.com.br</em></h4>
</div>

# About
This folder contains the scripts to classify and post-process the Atlantic Forest Biome.

We recommend that you read the Atlantic Forest Biome Appendix of the Algorithm Theoretical Basis Document (ATBD).
[Link to ATBD](ADICIONAR LINK)

# How to use
First, you need to copy these scripts (including those in p04 folder) to your Google Earth Engine (GEE) account. If any input is missing is because we used the ready-to-use from the previous collection.

# Pre-processing

Step 03-10: export trained samples for embeddings bands for each year

Step 03-20: join trained samples from embeddings and sentinel

Step 03-30: runs the feature importance per region

# Classification

Step 04-XX: classify and export classification and probability for each region and apply corrections in some regions

# Post-processing

Step 05-00: merge classification of each theme (agriculture and atlantic forest's regions) and apply Gap fill filter to remove NODATA 

Step 06-00: applies spatial filter for each theme of region (fernando de noronha, agriculture and atlantic forest's regions)

Step 07-10: corrects fernando de noronha's classification

Step 07-20: merge all themes together

Step 07-30: applies a remapping to the classification to remove agiculture classes (keeping all as mosaic of use - class 21)

Step 08-10: filters temporal anomalies in the first and last years of the time series data

Step 08-20: improves temporal consistency across natural land cover classes using a mode filter

Step 08-30: temporal filter-3year

Step 08-40: filter regeneration on rare classes

Step 08-50: filter minimum areas of transitions

Step 08-60: stabilizes natural classes (except forest - class 3)

Step 08-70: stabilizes natural classes

Step 09-10: add wooded sandbank vegetation

Step 09-20: spatial filter

Step 09-30: temporal filter-3year


