var s1 = ee.ImageCollection("COPERNICUS/S1_GRD");

// On 16 August 2018, severe floods affected the south Indian state Kerala
// due to unusually high rainfall during the monsoon season.
// It was the worst flood in Kerala in nearly a century.
// https://en.wikipedia.org/wiki/2018_Kerala_floods

// Select images by predefined dates-befor-after period(to select region by dates)
var beforeStart = '2018-07-15'
var beforeEnd = '2018-08-10'
var afterStart = '2018-08-10'
var afterEnd = '2018-08-23'

var admin2 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");
var ernakulam = admin2.filter(ee.Filter.eq('ADM2_NAME', 'Ernakulam'))
var geometry = ernakulam.geometry()
Map.addLayer(geometry, {color: 'grey'}, 'Ernakulam District')

var filtered= s1 //take data from sentinel

print(filtered.first())//used to print properties so we can take them and filter furthermore

var collection= ee.ImageCollection('COPERNICUS/S1_GRD')
  .filter(ee.Filter.eq('instrumentMode','IW')) //setting IW mode in instrument
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH')) //VV band
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV')) //VH band
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING')) //Data collected while gowing down--both ASCEND and DESc works because there is time difference
  .filter(ee.Filter.eq('resolution_meters',10))  //setting resolution
  .filterBounds(geometry) //filter it to region
  .select(['VV', 'VH']) //selecting two bands

//the images colected before and after the flood
var beforeCollection = collection.filterDate(beforeStart, beforeEnd)
var afterCollection = collection.filterDate(afterStart,afterEnd)

//Mosaic combines all images in a collection and gives one average image
var before = beforeCollection.mosaic().clip(geometry);
var after = afterCollection.mosaic().clip(geometry);
