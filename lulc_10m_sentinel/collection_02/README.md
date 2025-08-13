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

Step01a: build stable pixels from Colleciton S2 beta and save a new asset

Step 01b: apply corrections on the stable samples 

Step 01c: create stable samples for Wetland

Step02a: export balanced training samples for each region

Step02b: export segmented mosaic based on SNIC

Step02c: blend stable Wetland samples with all the stable samples

Step03a:  export balanced trained samples for each region

Step03b:  export Wetland trained samples for each region

# Classification

Step04: classify and export classification and probability for each region

# Post-processing

Step05: merge classification of each region (and agriculture and Wetland separetely) and apply Gap fill filter to remove NODATA

Step06a: spatial filter

Step06b: spatial filter for Fernando de Noronha's area

Step06c: spatial filter for agriculture

Step06c: spatial filter for Wetland

Step07a: corrects Wetland areas

Step07b: corrects Fernando de Noronha's area

Step07c: merge all the themes together

Step08a: temporal filter on first and last year

Step08b: stabilizes natural classes

Step08c: filter minimum areas of transitions

Step08d: stabilizes changing areas withouth forest

Step09a: classify Sandbank Vegetation

Step10a: stabilizes gain and loss in middle years

Step10b: stabilizes changing areas

Step10c: spatial filter
