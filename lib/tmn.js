/*
 * Terra MadNess v0.1.7
 * [Leaflet](http://leafletjs.com/) with map legend and other little things
 * needs to [jQuery](http://jquery.com/)
 * https://github.com/pa69pa/tmn
 * (c) pa69pa 2018
 */
var tmn=(function($){// this is rootTMN
 var ico={
  x:"&#xE5CD;"
 ,play:"&#xE037;"
 ,circle:'<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" height="1em" width="1em" style="stroke:#ff0000;stroke-opacity:1;fill:#000080;fill-opacity:0.6;stroke-dasharray:none"><circle r="4.5" cy="5" cx="5" style="stroke-width:1;stroke-miterlimit:4" /></svg>'
 ,rectangle:'<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" height="1em" width="1em" style="stroke:#ff0000;stroke-opacity:1;fill:#000080;fill-opacity:0.6;stroke-dasharray:none"><rect y="0" x="0" height="10" width="10" style="stroke-width:2;stroke-miterlimit:4" /></svg>'
 ,polygon:'<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" height="1em" width="1em" style="stroke:#ff0000;stroke-opacity:1;fill:#000080;fill-opacity:0.6;stroke-dasharray:none"><path d="M 0,10 H 10 v -10 z" style="stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4" /></svg>'
 ,anyline:'<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" height="1em" width="1em" style="stroke:#ff0000;stroke-opacity:1;fill:#000080;fill-opacity:0.6;stroke-dasharray:none"><path d="M 0,10 10,0" style="stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dashoffset:0" /></svg>'
 ,legend_select_color:'rgba(96, 152, 205, 0.9)' // !!!!! rgba = $('div').css('background-color')
 };
 if(typeof setMNFontIcons !== 'undefined')setMNFontIcons(ico);
 var hit={
  zoomHiddenLegendIcon:12// with zoom<12 icon over objects hide
 ,zooLegIcon:[[13,3],[14,2]]
	//zoom<14 => size icon becomes half as much; zoom<13 => three times less
	//перечисляем zoom в порядке возрастания!
 };
 var li=[];//набираем все маркеры объектов легенды - работа с зумом карты



/** расширяем L.Path методом setMarker(m)
* m = маркер L.marker
* this = сам объект L.circle, L.polygon...
*/
L.Path.include({
 setMarker:function(m){//console.log('setMarker this=',this,' m=',m)
	this._marker=m;
	m._master=this;
	if(this.options.zoomHidden==null || this.options.zoomHidden)li.push(m);
//console.log('LI=',li)

	if(this instanceof L.Polyline && m._latlng.lat==0 && m._latlng.lng==0){
	 var b=this.getBounds();
	 var t=b._northEast.lat-(b._northEast.lat-b._southWest.lat)/2;
	 var g=b._northEast.lng-(b._northEast.lng-b._southWest.lng)/2;
	 m.setLatLng([t,g]);//console.log('BTG=',b,t,g)
	}
	return this
 }
})


/*****************************
* функция инициализации ВСЕГО
* по готовности документа ===> внутри $( document ).ready(function() {...

*  Для боооолльшого окна:   mapWin = tmn.init()  ИЛИ

  mapWin = tmn.init(
	 { center:[50.15238872281402,86.29184584424449], zoom:12 } // for L.map()
	,{ funcBefore:showMap, funcOnClose:hideMap, anim:'left' }   // for tmn.init()
  );
  //////  myMap is mapWin.map

* Для внутреннего DIV#mapid:

  var myMap = L.map('mapid').setView([51.505, -0.09], 13);

  var divMap = tmn.init(myMap,{...}).nav(baselay, overlay, runlay).agrLegend("my Points");

*/
function init(ma,ar){//console.log('TMN INIT map=',ma,'IS',(ma instanceof L.Map),' arr=',ar)
 var b=false,o,l,c,m;

 if(ma==null || !(ma instanceof L.Map)){//console.log('создаём objectTMN — BASE')
	b=true;
	o=$('<div id="tmn-base" />');
	$("body").prepend(o);
	o.css('left','-'+o.width()+'px');

	l=$('<div style="width:100%;height:100vh" />');
	l.appendTo(o);
	l=l[0];

	m = L.map(l,ma);

 }else{//console.log('у нас objectTMN — существующий настранице DIV')
	m=ma;
	l=ma.getContainer();
	o=$(l);
 }

 o.addClass('tmn-base');//console.log('INIT o=',o)

 m.on('zoomend',function(){//console.log('zoomend',m.getZoom())
  if (m.getZoom() < hit.zoomHiddenLegendIcon){
//console.log('LI',li)
	$.each(li,function(i,v){if(v._layerToAdd)v._layerToAdd.removeLayer(v)});
  }else{
	var s,a,r,n;
	$.each(hit.zooLegIcon,function(j,w){
		if(m.getZoom()<w[0]){r=w[1];return false}
	});//console.log('RRR',r)
	$.each(li,function(i,v){
	 if(v._layerToAdd){
		v._layerToAdd.addLayer(v);

		n=$(v._icon);
		s=v.options.icon.options.iconSize;
		a=v.options.icon.options.iconAnchor;
		if(r!=undefined) a={'width':(s[0]/r)+'px','height':(s[1]/r)+'px'
			,'margin-left':'-'+(a[0]/r)+'px','margin-top':'-'+(a[1]/r)+'px'};
		else a={'width':s[0]+'px','height':s[1]+'px'
			,'margin-left':'-'+a[0]+'px','margin-top':'-'+a[1]+'px'};
//console.log('SSS',s,'AAA',a)
		n.css(a)
	 }
	});
  }
 });

 if(b){
	if(ar==null)ar={};
	if(ar.anim==null)ar.anim=='fade';
//	$('<img src="'+ico.wait+'">').css(ico.wait_css).appendTo(o);

	if(ar.close=='[X]'){
		c=$('<div class="tmn-back x"><i class="mico">'+ico.x+'</i></div>')
		c.appendTo(o);
	}else if(ar.close!=null)c=$(ar.close);
 }

 o.tmn={/// this is ObjectTMN
 div:o
,container:l
,map:m
,control:null
,legend:{}
,initArr:ar
,isBase:b
,fiBase:true
,fiRunlay:true
/*******
* function nav() for adding control-menu on map
* bas,ove = arrays {} for base and overlay layers control for leflet's L.control.layers()
* run = array {} for adding menu
* arr = options array {} for L.control, ex: {position:'topleft'}
*      context this = o.tmn
*/
,nav:function(bas,ove,run,arr){//console.log('NAV this=',this)//o.tmn
	this.control = L.control.layers(bas,ove,arr).addTo(this.map);
	if(run!=null)$.each(run,addRunlay.bind(this));
	return this
  }
/*******
* function agrLegend() for create Aggregation Legend
* ola = along L.FeatureGroup overlay for create legend
	or array {"name":featureGroup ... } if into legend needed the name <H4> of block items
	or array [] of L.FeatureGroup's without names
* arr = options array {} for L.control, ex: {position:'bottomleft'}
*      context this = o.tmn
*/
,agrLegend:function(ola,arr={}){//console.log('agrLegend this=',this)//o.tmn
	if(arr.position==null)arr.position='bottomright';
	var leg = L.control(arr);

	var div = L.DomUtil.create('div', 'tmn-legend');
	L.DomEvent.disableScrollPropagation(div);
	L.DomEvent.disableClickPropagation(div);
	L.DomEvent.on(div, 'doubleclick', function(e){L.DomEvent.preventDefault(e)});
	if(arr.classAgrLegend)L.DomUtil.addClass(div,arr.classAgrLegend);
	this.legend.div=$('<div/>')
	$(div).attr('onmousedown',"return false").attr('onselectstart',"return false")
		.append(this.legend.div);

	leg.onAdd=addLeg.bind(this,div);
	this.legend.control=leg;///////////leg.addTo(this.map);

	if(ola instanceof L.FeatureGroup)agrLeg.call(this,null,ola);
	else{
	 if($.isArray(ola))$.each(ola,agrLeg.bind(this,null,ola));
	 else $.each(ola,agrLeg.bind(this))
	}
	return this
  }
/*******
* function show() — show BaseMAP — into div on full window only!
— ex:  $('myItem').click({layers:[topo]},myMap.show);
*      context this = DOM on click
*/
,show:function(e){//console.log('SHOW this=',this,' arr=',e.data)
	if(!o.tmn.isBase)return;
	if(o.tmn.fiBase)showFirst(o);
	showBase.call(o,e.data)
  }
 }/// End objectTMN


//// Продолжаем tmn.init() ////

 if(c!=null)c.click(close.bind(o.tmn));


 ///////////////////if(typeof setMNLangs !== 'undefined')Lg=setMNLangs('lib/langs/tmn',['ru','en']);
 if(typeof getMNFontIcons !== 'undefined')getMNFontIcons();

 $('head').append("<style>\
@keyframes tmnShadowPulse{\
 20% {box-shadow: inset 0 0 7px 4px "+ico.legend_select_color+"}\
 50% {box-shadow: 0px 0px 0px 0px hsla(0, 0%, 0%, 0)}\
 70% {box-shadow: inset 0 0 7px 4px "+ico.legend_select_color+"}\
100% {box-shadow: 0px 0px 0px 0px hsla(0, 0%, 0%, 0)}\
}\
.tmn-shadow-pulse{\
animation-name: tmnShadowPulse;\
animation-duration: 1.4s;\
animation-iteration-count: 1;\
animation-timing-function: linear;\
}</style>");

 return o.tmn;
};/////// End инициализации ВСЕГО function tmn.init(div)


/** экшн добавления легенды на карту
*/
function addLeg(div){//console.log('ADD LEG this=',this,'arr',arr)
 return div;
}
/**
* разбор L.FeatureGroup для добавления к легенде
* nam = имя блока в легенде
* ola = L.FeatureGroup's overlay for create legend
* i = индекс по массиву если ola=[]
* this = o.tmn
*/
function agrLeg(nam,ola,i){
 if(i!=null)ola=ola[i];//console.log('AGR LEG this=',this,' ola=',ola,' nam=',nam,' i=',i)

 //console.log('ola._leaflet_id',""+ola._leaflet_id)
 var d=$('<div id="tmn-leg-'+ola._leaflet_id+'">')
	.data('mnScrollParent',this.legend.div.parent());
 d.appendTo(this.legend.div);//console.log('agrLeg DIV',d)

 ola.on('layeradd',addObj.bind(this));// когда будем добавлять объект ПОСЛЕ .agrLegend()

 if(nam!=null)$('<h4>'+nam+'</h4>').appendTo(d);

 if($.inArray(""+ola._leaflet_id,Object.keys(this.map._layers))<0)d.css('display','none');
 else this.legend.control.addTo(this.map);

 ola.on('add',addLay.bind(this));
 ola.on('remove',remLay.bind(this));

 var t={};
 $.each(ola._layers,function(k,v){
  if(v.options.legendItem){
   if(t[v.options.legendItem]!=null) t[v.options.legendItem].obj.push(v);
   else newItem(t,v.options.legendItem,v)
  }
 });
//console.log('TTT',t)
 legItem(t,d,ola,this.map)
}
/** экшн когда будем добавлять объект ПОСЛЕ .agrLegend()
* e.target = куда добавляем, e.layer = что добавляем
* this = o.tmn
*/
function addObj(e){if(e.layer instanceof L.Marker)return;//console.log('ADD OBJ this=',this,'e',e)
 if(e.layer.options.legendItem){
//console.log('(this.legend.div)',this.legend.div)
  var d=$("#tmn-leg-"+e.target._leaflet_id,this.legend.div);
//console.log('DDD',d)
  var l=[];
  $('span',d).each(function(){l.push($(this).html())});
  var i=$.inArray(e.layer.options.legendItem,l);
//console.log('LLL',l,'Item',e.layer.options.legendItem,'i',i)
  if(i<0){//такого пункта в меню ещё нет
	var t={};
	newItem(t,e.layer.options.legendItem,e.layer);
	legItem(t,d,e.target,this.map)
  }else{//такой пункт в меню уже есть
	var m = $($('label',d).get(i));
	var o = m.data('obj');
	o.push(e.layer);
	m.data('obj',o);
	legObj(e.layer,m,e.target)
  }
 }
}
/** full array t for new legeng item —> n = name, v = object
*/
function newItem(t,n,v){
	t[n]={};
	t[n].obj=[];
	t[n].obj.push(v);
	t[n].ico=legIcon(v);
}
/** create Legend Items
* t = array { "itemName": {ico:"icon",obj=[...] } ,  ... }
* d = $(div) into legend for add item
* l = layer where add objects&markers
* map = mymap
*/
function legItem(t,d,l,map){//console.log('array',t,'div',d,'_layerToAdd',l)
 var timer = 0,delay = 200,prevent = false;

 $.each(t,function(k,v){
  var a = $('<label> <span>'+k+'</span></label>')
	.data('obj',v.obj)
	.data('mnScrollParent',d.parent().parent())
	.on('cssanimationend animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',function(){$(this).removeClass('tmn-shadow-pulse')})
	.on("click",function() {
		var th=$(this);
		timer = setTimeout(function(){
			if(!prevent){//console.log('OneClick');
				legClk.call(th,true,map)
			}
			prevent = false;
		}, delay);
	})
	.on("dblclick",function(){
		clearTimeout(timer);
		prevent = true;//console.log('DblClick');
		legClk.call($(this),false,map)
	})
	.prepend(v.ico).appendTo(d);

  $.each(v.obj,function(i,o){legObj(o,a,l)});
 })
}
/** set new Object for Legend item
* o = object for Legend
* a = $('label') legend item
* l = layer where contains objects&markers
*/
function legObj(o,a,l){//console.log('LEG OBJ o=',o)
	o.on('click',objClk)._leg=a;
	if(o._marker){
		o._marker._layerToAdd=l;
		o._marker.on('click',objClk);
	}
}
/** create (or get from marker) Icon for LegendItem
* v = object for Legend
* return string = icon
*/
function legIcon(v){//console.log('LEG ICON v=',v)
	var m='';
	if(v._marker)m=$('<img src="'+v._marker.options.icon.options.iconUrl+'"/>');
	else{
	 if(v instanceof L.Circle)m=$(ico.circle);
	 else{ if(v instanceof L.Rectangle)m=$(ico.rectangle);
		else{ if(v instanceof L.Polygon)m=$(ico.polygon);
			else m=$(ico.anyline)}};
	 var o=v.options;
	 if(o.color==undefined)o=v.options.style;
//console.log(o)
	 if(o.color)m.css('stroke',o.color);
	 if(o.opacity)m.css('stroke-opacity',o.opacity);
	 if(o.fillColor)m.css('fill',o.fillColor);
	 if(o.fillOpacity)m.css('fill-opacity',o.fillOpacity);
	 if(o.dashArray)m.css('stroke-dasharray',[3,2])
	};
	return m;
}
/** экшн add overlay to map
* this = o.tmn
*/
function addLay(e){//console.log('ADD LAY this=',this,'id',e.target._leaflet_id)
	this.legend.control.addTo(this.map);
	$('#tmn-leg-'+e.target._leaflet_id,this.legend.div).show('fast',setMNScrollView);
}
/** экшн remove overlay to map
* this = o.tmn
*/
function remLay(e){//console.log('REM LAY this=',this,'id',e.target._leaflet_id)
	$('#tmn-leg-'+e.target._leaflet_id,this.legend.div).hide();
	if($('.tmn-legend div:visible').length==0)this.legend.control.remove();
}
/** экшн клик на объекте, свзанном с пунктом меню пункт меню
* this = круг, полигон и пр.
*/
function objClk(e){//console.log('OBJ CLK this=',this,'e',e,' item label=',this._leg)
 L.DomEvent.stopPropagation(e);

 var o=this;
 var l=this._leg;
 if(l==null){//клик НЕ на объекте, а на его маркере-картинке
  o=this._master;
  l=this._master._leg;
 }

 if(objPul(o))l.click();//объект уже моргает
 else l.addClass('tmn-shadow-pulse').scrollView()//объект ещё спокоен
}
/** тест на то моргает ли объект или нет
* o = object
* return true/false - моргат иль не моргат
*/
function objPul(o){
 var v=o._path;
 if(v==null)$.each(o._layers,function(k,w){
	if(w._path){
	 v=w._path;
	 return false
	}
 });
//console.log('OBJ PUL v=',v,$(v).hasClass('tmn-beacon'))
 return $(v).hasClass('tmn-beacon')
}

/** экшн клик на пункт меню
* this = $('label') inside legendItem
* dc =false if doubleclick and =true if oneclick
* map = map
*/
function legClk(dc,map){//console.log('LEG CLK this=',this,'dc',dc,' objs=',this.data('obj'))
 var c=!(this.css('background-color')==ico.legend_select_color);//console.log('CCC',c)
 if(c){
	$('.tmn-legend label').filter(function(){
		return $(this).css('background-color')==ico.legend_select_color
	}).click();
	this.css('background-color',ico.legend_select_color);
 }else  this.css('background-color','transparent');

 var vb,mb,b=null;
 if(dc)mb=map.getBounds();

 $.each(this.data('obj'),function(i,v){
  if(c){
	vb=v.getBounds();
	if(mb==undefined){mb=vb;b=vb}
	else if(!mb.contains(vb)){b=mb.extend(vb._northEast);b=mb.extend(vb._southWest)};
	objBea(v,true);
  }else objBea(v,false);

  if(v._marker){
   if(c)$(v._marker._icon).addClass('tmn-beacon');
   else $(v._marker._icon).removeClass('tmn-beacon');
  }
 });
 if(b!=null)map.flyToBounds(b)
}
/** моргать иль не моргать
* o = object
* i = true/false
*/
function objBea(o,i){
 var v=o._path;
 if(v==null)$.each(o._layers,function(k,w){objBea(w,i)});
//console.log('OBJ BEA v=',v)
 if(i)$(v).addClass('tmn-beacon');
 else $(v).removeClass('tmn-beacon');
}



/**
* добавить менюшки по анимации путей
* k = name for menu item
* v = play data
* this = o.tmn
*/
function addRunlay(k,v){//console.log('ADD RUN this=',this,' k=',k,' v=',v)
 var c=$('form',this.control.getContainer())
 if(this.fiRunlay){
	this.fiRunlay=false;	
	$('<div class="leaflet-control-layers-separator"></div>').appendTo(c);
 };
 $('<span class="tmn-run"><i class="mico">'+ico.play+'</i>&nbsp;'+k+'</span>')
	.click(v,runPlay.bind(this))
	.appendTo(c);
}
/**
* выполнить нечто по меню addRunlay
* e.data = L.LayerGroup or L.FeatureGroup for fly to it's bounds
* this = o.tmn
*/
function runPlay(e){//console.log('RUN PLAY this=',this,' e.data=',e.data)
 if(e.preventDefault)e.preventDefault();
 if(typeof e.data == 'function')e.data.call(this);
 else{
	this.map.addLayer(e.data);
	var b;
	if(e.data instanceof L.FeatureGroup)b=e.data.getBounds();
	else{
		try{
			var g=L.featureGroup();
			e.data.eachLayer(function(layer){g.addLayer(layer)});
			b=g.getBounds();//console.log('BBB',b)
			g=null;
		}catch(er){console.log('Not possible create FeatureGroup — ',er)}
	};
	if(b!=null)this.map.flyToBounds(b);
 }
}
/**
* убрать боооoooooльшое окно с картами
* this = o.tmn
*/
function close(){//console.log('CLOSE BASE this=',this)
 tmn.runBase=false;
 var func=this.initArr.funcOnClose;
 if(func!=undefined)func();

 switch (this.initArr.anim){
	case 'left':
		this.div.animate({left:'-'+this.div.width()+'px',opacity:0},1000);
		break;
	case 'right':
		this.div.animate({right:'-'+this.div.width()+'px',opacity:0},1000);
		break;
	default:
		this.div.fadeOut()
 }
}
/**
* показ боооoooooльшого окна с картами
* a = массив из $('h2').click({layers:[imag]},fullWin.show);
* this = это самое окно $(div)
*/
function showBase(a){//console.log('SHOW BASE this=',this,' a=',a)
// if(!tmn.runBase){
 tmn.runBase=true;
 var func=this.tmn.initArr.funcBefore;
 if(func!=undefined)func();

 var c = this.tmn.control._layers;//console.log('CCCC',c)
 var l = a.layers.length;

 for(i=0; i<c.length; i++){//console.log('CCCC ['+i+']',c[i].layer._leaflet_id,)
	for(j=0; j<l; j++){
//console.log('C['+i+']=',c[i].layer._leaflet_id,' a['+j+']=',a.layers[j]._leaflet_id)
		if(c[i].layer._leaflet_id==a.layers[j]._leaflet_id)break;
	}
//console.log('JJJ=',j)
	if(j==l)this.tmn.map.removeLayer(c[i].layer);
 };
 for(j=0; j<l; j++){
	this.tmn.map.addLayer(a.layers[j]);
//console.log('Addd',a.layers[j]._leaflet_id)
 };

 switch (this.tmn.initArr.anim){
	case 'left':
		this.animate({left:'0px',opacity:1},1000);
		break;
	case 'right':
		this.animate({right:'0px',opacity:1},1000);
		break;
	default:
		this.fadeIn();
 };

 if(a.run!=null)this.tmn.map.whenReady(runPlay.bind(this.tmn,{data:a.run}))
// }
};
/**
* предпоказ бооольшого окна с картами — в первый и единственный раз
* o = это самое окно $(div)
*/
function showFirst(o){//console.log('SHOW FIRST o=',o)
 o.tmn.fiBase=false;

 switch (o.tmn.initArr.anim){
	case 'left':
		o.css({left:'-'+o.width()+'px',display:'block'});
		break;
	case 'right':
		o.css({right:'-'+o.width()+'px',display:'block'});
		break;
	default:
		o.css({left:0,opacity:1});
 }
};
//function temp(x,y,z,a,s,d,f){console.log("temp=",x,y,z,a,s,d,f)}
return{/////////////////// Begin ROOT TMN return
 id:'tmn root'
,runBase:false
,init:init
,close:close
,icons:MNLoc.arr.bind(ico)
,hits:MNLoc.arr.bind(hit)
}/////////////////////////// End ROOT TMN return
})(jQuery)
