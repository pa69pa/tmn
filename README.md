# tmn
the legend of the earth

### Requirements
* [Leaflet](http://leafletjs.com) version > 1.0.0
* [jQuery](http://jquery.com)

Include after Leaflet & jQuery:
```
<link rel="stylesheet" href="lib/tmn.css">
<script src="https://pa69pa.github.io/ee/lib/can.min.js"></script>
<script src="lib/tmn.js"></script>
```

# Example
* [view map into div with legend](https://pa69pa.github.io/tmn/legend.html)
* [view full-window maps with preset runlay](https://pa69pa.github.io/tmn/fullWin.html)

and see using it on site [www.greendom.space](http://greendom.space)

# API
The script *tmn.js* will set global variable **tmn**

## icons & hits
Two objects-arrays of predefined settings. Show all zoo or one:
```
console.log( tmn.icons() )
console.log( tmn.hits() )
console.log( tmn.icons().x )
```
— see run it [here](https://pa69pa.github.io/tmn)

Before init you can change this set. Ex:
```
tmn.icons( { x:'<img src="/img/x.png">', play:'>'} )
```
object **icons**

|key|value|desc|
|--|------|----|
|x<br>play|"&amp;#xE5CD;"<br>"&amp;#xE037;"|codes of symbols *Material Icons font* from *Google* for buttons «close» and «play» — see chapter [can.js](#canjs)|
|circle<br>rectangle<br>polygon<br>anyline|svg image tags|for paint icons in map legends|
|legend_select_color|'rgba(96, 152, 205, 0.9)'|color for selected item into map legend = string as output command *$('div').css('background-color')*|

object **hits**

|key|value|desc|
|--|------|----|
|zoomHiddenLegendIcon|12|with map zoom<12 icon over objects will hide — about it see chapter [markers](#markers)|
|zooLegIcon|[[13,3],[14,2]]|zoom<14 => size icon becomes half as much; zoom<13 => three times less (enumerate the zoom in ascending order)|

## init

First way of init is (second way see in chapter [fullWin](#fullWin)):

1. As usual create map through `Leaflet` into &lt;div#mapid>
```
var myMap = L.map('mapid').setView([51.505, -0.09], 13);
```
2. And after make *tmn.init()* by giving him **myMap**
```
var myGeo = tmn.init(myMap,{...}).nav(baselay, overlay, runlay).agrLegend(group);
```
 — what is *.nav* see in chapter [runlay](#runlay)<br>
 — what is *.agrLegend* see in chapter [legend](#legend)

second argument for *tmn.init()* can be array-object (not required) — see in chapter [fullWin](#fullWin)

object **myGeo** as a result has properties:
* myGeo.map = L.Map — in this example *myMap*
* myGeo.div = jQuery object $(div) where map is created — in this example $('#mapid')
* myGeo.isBase = true/false — whether the map is fullWin ...and others

## markers

The `Leaflet` object *L.Path* is extended by method `.setMarker(L.Marker)`. The goal is to equip objects *L.Polyline*, *L.Polygon*, *L.Rectangle*, *L.Circle* with the ability to have markers\pictures to identify the object on the map and use the same markers in the map legend. Two step:

1. As usual create *L.Marker* with *L.Icon* through `Leaflet` and add to *L.FeatureGroup*
```
var group = L.featureGroup();

var mark = L.marker([51.5, -0.11], {
  icon: L.icon({
    iconUrl:'img/cafe.svg', iconSize:[44,44], iconAnchor:[44,44]
  })
}).addTo(group);
```

2. And after during creation *L.Path* make *setMarker()* and add to the same *L.FeatureGroup*. Additional property `legendItem` is item on legend map.
```
L.circle([51.5,-0.11], 500, {
		 color: 'red'
		,fillColor: '#f03'
		,fillOpacity: 0.5
		,legendItem: 'Cafe'
	}).addTo(group).bindPopup("I am a cafe").setMarker(mark);
```

Property *legendItem* can contain html:
```
   legendItem: 'Lorem <i>ipsum><i><br>dolor sit amet'
```

You can set the marker coordinates to zero:
```
var mark = L.marker([0,0], {...})
```
then function `.setMarker(mark)` try set coordinates of the marker on center *L.Path*

## runlay

`Leaflet` allows users to control which layers they see on your map through *L.control.layers()* ([see tutorial](http://leafletjs.com/examples/layers-control/)). Here this functional is extended with *runlay*.

1. As usual make base and over layers with *L.TileLayer* and *L.LayerGroup*, respectively:
```
var grayscale = L.tileLayer(mapUrl, {id: 'MapID', attribution: mapAttribution}),
    streets   = L.tileLayer(mapUrl, {id: 'MapID', attribution: mapAttribution});

var baselay = {
    "Grayscale": grayscale,
    "Streets": streets
};

var overlay = {
    "Group": group // this L.FeatureGroup created in chapter «markers»
};
```
2. And can create third object for run functionals and make **.nav()**
```
var runlay = {
     "go to Group": group
    ,"start Func": myFunc // any JavaScript function
};

myGeo.nav(baselay, overlay, runlay, arr);
```
not required argument *arr* is options array {...} for *L.control.layers*, ex: { position: 'topleft' }

You will have same control with two additional items:
* "go to Group" — will run myMap.flyToBounds(b) — where b = bounds of the *group* (therefore it is better to use L.FeatureGroup instead of L.LayerGroup)
* "start Func" —  the specified function will be performed — context *this* of function is *myGeo* object ([see init](#init))

## legend

function `agrLegend()` for create Aggregation Legend — inside it create *L.Control* object
```
myGeo.agrLegend( {
   "Groups":group
  ,"Lines":lines  // another L.FeatureGroup
}, { ... } )
```
first argument is:

* along *L.FeatureGroup* overlay for create legend or
* array { "name" : featureGroup ... } if into legend needed the &lt;H4> name of block items or
* array [ ... ] of L.FeatureGroup's (without block names)

second argument is not required = options array {...} for *L.control*, ex: { position: 'bottomleft' }, with:

* default options: `position: 'bottomright'`
* adding options: `classAgrLegend: 'string'` for .addClass() to div-container into *L.control*

In the legend there will be objects added to these *L.FeatureGroup* with `legendItem` property. Objects can be with .setMarker() or without [marker](#markers)

You can create several objects with the same `legendItem`, then in the legend there will be one item for all of them.

It is possible to add a group to the map and add objects to the group after the legend was generated, that is, execute `group.addTo(myMap);` and `L.rectangle([[51.49,-0.06],[51.52,-0.04]]).addTo(group);` after `myGeo.agrLegend(...)`

One remark: if you create object with marker then first you do `.setMarker(m)` and then `.addTo(group)`, ex:
```
 L.polygon([[51.509, -0.08],[51.503, -0.06],[51.51, -0.047]],{
	legendItem: 'Cafe'
 }).setMarker(mark)
   .addTo(group); /// addTo() group AFTER setMarker() !!!!! [when do it after .agrLegend()]
```

## fullWin

Another way for *tmn.init()* with two array-object as arguments is:
```
var myBigGeo = tmn.init(
	 { center:[50.15238872281402,86.29184584424449], zoom:12 }  // for L.map()
	,{ funcBefore:showMap, funcOnClose:hideMap, anim:'left' }   // for tmn.init()
);
```
It's create div with style="width:100%;height:100vh" as container and *L.Map* inside. Next you can access the object *L.Map* as `myBigGeo.map`

In first argument-array not needed set key *layers* — create *L.Map* without tile and over layers on load page — will addLayer when show full-win map.

Second argument for *tmn.init()* can be (not required) array-object with:

|key|default|desc|
|---|-------|----|
|funcBefore|none|function run on start show full-win map|
|funcOnClose|none|function run on close full-win map|
|anim|'fade'|animation action for show full-win map — on default full-win map manifested from the transparent — with value 'left' or right' full-win map will appear to be pulled out on the left or right|
|close|null|icon for button close full-win map — default = null (without icon)<br> = '[X]' for icon based on *tmn.icons().x*<br> = 'string' for jQuery selector for $('string').click( ... )|

Function *.show()* for show full-win map. You can set jQuery click function on any number of tag:
```
 $('h2').click({
	layers: [grayscale] // leayers for show — first in array is TileLayer, other is Overlays
	,run: myFunc // JavaScript function for call on click OR L.LayerGroup or L.FeatureGroup for flyToBounds
 },myBigGeo.show);

 $('#showMeGroup').click({
	layers: [streets, group]
	,run: group
 },myBigGeo.show);
```

## can.js
Service function scripts. It is in [ee](https://github.com/pa69pa/ee) git-repository. It needed for localisation, work with cookies, fonts and other.

If object **tmn.icons()** has value begining with `&`, then *can.js* load in background [Material Icons font](https://material.io/icons/). Not all font. Only this characters.

If you replace all lines starting with `&` in the array **tmn.icons()**, then this font and style `.mico` be loaded will not.

If, on the contrary, you wanted at the same time to add some more number of icons for your own needs, then you list the code of their glyphs after the query in the src script:
```
<script src="can.js?&#xE0CD;&#xE315;&#xE314;&#xE5D8;&#xE5D2;"></script>
```
further on this html-page:
```
<i class="mico">&#xE0CD;</i>
<span class="mico">&#xE5D2;</span>
```

# Contributions
* License `MIT`
* Browser and device compatibility testing is very limited
* Bug reports and pull requests are welcome!
