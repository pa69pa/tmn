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
console.log( tmn.icons().x ) —— see run it [here](https://pa69pa.github.io/tmn)
```
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

## can.js
Service function scripts. It is in [ee](https://github.com/pa69pa/ee) git-repository. It needed for localisation, work with cookies, fonts and other.

# Contributions
* License `MIT`
* Browser and device compatibility testing is very limited
* Bug reports and pull requests are welcome!
