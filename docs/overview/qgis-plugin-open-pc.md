# Accessing Planetary Computer data in QGIS

[QGIS][qgis-home] is a popular open-source desktop GIS application used for
mapping, analysis, and visualization of spatial data. While much of the
Planetary Computer is designed to support [cloud-native][cnative] workflows,
it's easy to use our data in a traditional desktop clients, like QGIS, as well.

## Native STAC browser in QGIS

Since the Open Planetary Computer metadata API is built on the [STAC](https://stacspec.org/) standard, the easiest way to search for and add data to QGIS is by using the native STAC browser within QGIS. This is fully supported from [QGIS 4.0.0](https://qgis.org/download/) onward.

A STAC catalog in QGIS is a browsable data source. It exposes hierarchical STAC metadata (catalog → collection → item → asset) instead of a single static file. When you expand nodes, QGIS issues live API requests to the Open Planetary Computer STAC endpoint so you always see the latest collections and items available.

### Create the STAC connection

Create the STAC connection inside QGIS by following these steps:

1.  Locate STAC in the Browser panel on the left side of the screen.
2.  Right-click STAC and select New STAC Connection to open the configuration dialog.
```{image} images/qgis-plugin-new-stac-connection.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```

### Configure STAC connection

1.  In the "Name" field, name this connection. For example, “Microsoft Open Planetary Computer”
2.  Enter the URL for Open Planetary Computer: https://planetarycomputer.microsoft.com/api/stac/v1
3.  Before creating the connection, you must enter an authentication configuration. If you do not see Open Planetary Computer in the list of options, click the plus (+) icon to add a new authentication.
```{image} images/qgis-plugin-establish-connection.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
4.  In the resulting screen, enter a name for the authentication connection.
5.  In the dropdown, select Microsoft Planetary Computer
```{image} images/qgis-plugin-select-pc.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
6.  By default Open Planetary Computer should be selected. If for whatever reason it is not, switch from Planetary Computer Pro to Open Planetary Computer. (If you would like to set up a Planetary Computer Pro connection, see the tutorial [here](https://learn.microsoft.com/en-us/azure/planetary-computer/configure-qgis).)
```{image} images/pc-pro.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
7.  Click Save to create the new authentication.

Once these settings are complete, click OK to create the STAC connection.

## Using the QGIS STAC connection

To browse the collections, expand your STAC connection in the data layer browser. You will see many collections to choose from. Continue to expand the collections until you locate a STAC Item. To visualize this item, select the item and drag it to the map view. If the data is a Cloud Optimized GeoTIFF (COG) or Cloud Optimized Point Cloud (COPC), it automatically imports and projects onto the map.

```{image} images/find-open-pc.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```

### STAC search and filtering

To more effectively search for data or run a STAC filter in your catalog, the STAC API is exposed through the Layer manager.

1.  On the Layer menu, select Add Layer > Add Layer from STAC Catalog.
```{image} images/add-layer-from-stac.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
2.  If necessary, select your Open Planetary Computer STAC connection, and click Connect.
```{image} images/select-open-pc.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
3.  You will need to choose a filter to be able to STAC items. Click Filters and narrow down to a spatial selection, temporal selection, or specific collection.
```{image} images/select-sentinel-2.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
4.  With “Show Footprints” selected you can see the area covered by a specific STAC item before adding it to your canvas. 
```{image} images/qgis-plugin-show-footprints.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
5.  Select an item that matches your needs and click “Add.” Alternatively, add specific layers by right clicking on the STAC item and selecting “Add Layer.”
```{image} images/qgis-plugin-add-layer.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```

Depending on your selection, you will now see the layers available in your Layers panel.

```{image} images/qgis-plugin-layers-panel.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```

## Using Open Planetary Computer data

Streaming raster imagery through the Open Planetary Computer makes raster calculations easier to perform.

### Generating an NDVI calculation virtually

Follow the steps below to quickly generate an NDVI calculation using the same Sentinel-2A imagery from above.

1.  Open the Processing Toolbox using Ctrl+Alt+T (Ctrl+Shift+T on Mac) or by accessing Processing > Toolbox from the toolbar.
2.  In the Processing Toolbox, expand the Raster analysis options and locate the Raster calculator (virtual). We are able to use this virtual calculator because of our STAC connection, none of these layers are downloaded to your computer at this point.
```{image} images/qgis-plugin-find-raster-calculator.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
3.  In the resulting dialog box, click on the ellipses under “Input layers” to select the necessary inputs.
```{image} images/qgis-plugin-input-layers.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
4.  For an NDVI calculation, we will need Band 4 and Band 8. For other calculations, you might need different bands. Select the necessary bands and select “OK.”
```{image} images/qgis-plugin-select-bands.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
5.  To enter in the NDVI calculation, you can copy the formula into the Expression box or open up the Expression editor to input it manually.
```{image} images/qgis-plugin-raster-calculator.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
6.  To input manually, double click on a layer to add it to the expression, and click on the appropriate operators to build a formula.
```{image} images/qgis-plugin-band-calc.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
7.  Provide a layer name and click “Run.”
8.  QGIS will calculate the NDVI layer virtually, without needing to download the imagery. This improves speed and reduces the load on your computer. The resulting image will likely be a gray-scale, with min/max values somewhere between -1 and +1. To edit the colormap, right click on the layer name and select “Properties.”
```{image} images/qgis-plugin-layer-properties.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
9.  Navigate to the Symbology tab and select a Render type of “Singleband pseudocolor.” 
```{image} images/qgis-plugin-find-symbology.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
10.  If it’s not already selected, select the RdYlGn colormap. This is standard for NDVI. 
```{image} images/qgis-plugin-select-colormap.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```
11.  Finally, adjust the min/max values to be -1 and +1 and click Apply. The map layer should quickly re-render with the new colormap and values.
```{image} images/qgis-plugin-apply-rendering.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```

You can use the Identify Features (Ctrl+Shift+i) tool within QGIS to verify that the values are as expected.

```{image} images/qgis-plugin-final.png
:height: 500
:name: Working with data in QGIS
:class: no-scaled-link
```

[qgis-home]: https://qgis.org/en/site/about/index.html
[cnative]: https://en.wikipedia.org/wiki/Cloud_native_computing
[plugin-url]: https://stac-utils.github.io/qgis-stac-plugin/
[kartoza]: https://kartoza.com/
[user-guide]: https://stac-utils.github.io/qgis-stac-plugin/user-guide/
[pc-catalog]: https://planetarycomputer.microsoft.com/catalog
[cql2]: https://github.com/radiantearth/stac-api-spec/tree/master/fragments/filter#example-1
[stac-ql]: https://github.com/radiantearth/stac-api-spec/tree/master/fragments/query#stac-api---query-fragment
