// On 16 August 2018, severe floods affected the south Indian state Kerala
// due to unusually high rainfall during the monsoon season.
// It was the worst flood in Kerala in nearly a century.
// https://en.wikipedia.org/wiki/2018_Kerala_floods

// Select images by predefined dates
var beforeStart = '2018-07-15'
var beforeEnd = '2018-08-10'
var afterStart = '2018-08-10'
var afterEnd = '2018-08-23'

var admin2 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");
var ernakulam = admin2.filter(ee.Filter.eq('ADM2_NAME', 'Ernakulam'))
var geometry = ernakulam.geometry()
Map.addLayer(geometry, {color: 'grey'}, 'Ernakulam District')

var collection= ee.ImageCollection('COPERNICUS/S1_GRD')
  .filter(ee.Filter.eq('instrumentMode','IW'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING')) 
  .filter(ee.Filter.eq('resolution_meters',10))
  .filterBounds(geometry)
  .select(['VV', 'VH'])


var beforeCollection = collection.filterDate(beforeStart, beforeEnd)
var afterCollection = collection.filterDate(afterStart,afterEnd)
var before = beforeCollection.mosaic().clip(geometry);
var after = afterCollection.mosaic().clip(geometry);

//function to add RGB-band
var addRatioBand= function(image) {
  var ratioBand=image.select('VV').divide(image.select('VH')).rename('VV/VH')
  return image.addBands(ratioBand)
}

var beforeRgb =addRatioBand(before)
var afterRgb= addRatioBand(after)
print(beforeRgb)

//visualization 
var visParams = {
  min: [-25, -25, 0],
  max: [0 ,0 ,2]
}

//visualize the image
Map.addLayer(beforeRgb ,visParams ,'Before')
Map.addLayer(afterRgb ,visParams ,'After')  //produces Rgb image and the "blue colour is water"