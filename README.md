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

Before init we can change this set. Ex:
```
tmn.icons( { x:'<img src="/img/x.png">', play:'>'} )
```
object **icons**

|key|value|desc|
|--|------|----|
|x<br>play|"&amp;#xE5CD;"<br>"&amp;#xE037;"|codes of symbols *Material Icons font* from *Google* for buttons «close» and «play» — see chapter **can.js**|
|circle<br>rectangle<br>polygon<br>anyline|svg image tags|for paint icons in map legends|
|legend_select_color|'rgba(96, 152, 205, 0.9)'|color for selected item into map legend = string as output command *$('div').css('background-color')*|

object **hits**

|key|value|desc|
|--|------|----|
|zoomHiddenLegendIcon|12|with map zoom<12 icon over objects will hide — about it see chapter **markers**|
|zooLegIcon|[[13,3],[14,2]]|zoom<14 => size icon becomes half as much; zoom<13 => three times less (enumerate the zoom in ascending order)|

## init

First way of init is (second way see in chapter **fullWin**):

1. As usual create map with Leaflet into &lt;div#mapid>
```
var myMap = L.map('mapid').setView([51.505, -0.09], 13);
```
2. And after make *tmn.init()* by giving him **myMap**
```
var myGeo = tmn.init(myMap,{...}).nav(baselay, overlay, runlay).agrLegend("my Points");
```
 — what is *.nav* see in chapter **runlay**<br>
 — what is *.agrLegend* see in chapter **legend**

second argument for *tmn.init()* can be array-object (not required) — see in chapter **fullWin**

## markers



## fullWin

second argument for *tmn.init()* can be array-object with:

|key|default|desc|
|---|-------|----|
|funcBefore|none|function run on start show full-win map|
|funcOnClose|none|function run on close full-win map|
|anim|'hide'|animation action for show full-win map — on default full-win map manifested from the transparent — with value 'left' or right' full-win map will appear to be pulled out on the left or right|


## can.js
Service function scripts. It is in [ee](https://github.com/pa69pa/ee) git-repository. It needed for localisation, work with cookies, fonts and other.

If object **tmn.icons()** has value begining with `&`, then *can.js* load in background [Material Icons font](https://material.io/icons/). Not all font. Only this characters.

If you replace all lines starting with `&` in the array **icons**, then this font and style `.mico` be loaded will not.

If, on the contrary, you wanted at the same time to add some more number of icons for your own needs, then we list the code of their glyphs after the query in the src script:
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
