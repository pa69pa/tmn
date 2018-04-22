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

## Example
* [view map into div with legend](https://pa69pa.github.io/tmn/legend.html)
* [view full-window maps with preset runlay](https://pa69pa.github.io/tmn/fullWin.html)

and see using it on site [www.greendom.space](http://greendom.space)

## API
The script *tmn.js* will set global variable **tmn**

### icons & hits
Two arrays of predefined settings. Show all zoo or one:
```
console.log( tmn.icons() )
console.log( tmn.hits() )
console.log( tmn.icons().x )
```
Before init we can change this set. Ex:
```
tmn.icons( { x:'<img src="/img/x.png">', play:'>'} )
```
**icons**
|x<br>play|"&#xE5CD;"<br>"&#xE037;"|codes of symbols from *Material Icons* from *Google* — see next chapter **can.js**|
|circle|svg image tags|for paint icons in map legends|
|legend_select_color|'rgba(96, 152, 205, 0.9)'|color vfor selected item into map legend|


### init

### can.js
Service function scripts. Is in [ee](https://github.com/pa69pa/ee) git-repository. Needed for localisation, work with cookies, fonts and other.

## Contributions
* License `MIT`
* Browser and device compatibility testing is very limited
* Bug reports and pull requests are welcome!
