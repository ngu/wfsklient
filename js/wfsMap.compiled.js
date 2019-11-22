var cMAP={url:["http://wms.geonorge.no/skwms1/wms.europa?VERSION=1.1.1&service=wms&REQUEST=GetMap&FORMAT=image/png&BGCOLOR=0xfcfdfe&TRANSPARENT=TRUE&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&LAYERS=Europa_WMS","http://wms.geonorge.no/skwms1/wms.topo4?VERSION=1.1.1&service=wms&REQUEST=GetMap&FORMAT=image/png&BGCOLOR=0xfcfdfe&TRANSPARENT=TRUE&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&LAYERS=topo4_WMS"],features:null,featuresMap:null,imgUrl:"http://geo.ngu.no/kart/images/",imgLoad:{name:"loading.gif",
dim:[32,32]},imgTop:{name:"dot.gif"},load:{max:4,delay:1E3,error:"* Feil ved opptegning av kartet *\nPr\u00f8v p\u00e5 nytt for fullstendig kart!",draw:{}},map:{div:null,canvas:null,bleed:20,dim:[330,300],epsg:null,fact:null,xyReverse:!1,bbox:null,click:!1,getEPSG:function(){return"&SRS=EPSG:"+this.epsg},getDim:function(){return"&WIDTH="+this.dim[0]+"&HEIGHT="+this.dim[1]},getBbox:function(){return"&BBOX="+this.bbox.join(",")},calcFactors:function(){this.fact=[this.dim[0]/(this.bbox[2]-this.bbox[0]),
this.dim[1]/(this.bbox[3]-this.bbox[1])]}},refresh:!1,template:null,udef:void 0,zoom:function(b){if(b){b*=2;var a=cMAP.map,c=a.bbox,d=[(c[2]+c[0])/2,(c[3]+c[1])/2];b=[(c[2]-c[0])/b,(c[3]-c[1])/b];c=[d[0]-b[0],d[1]-b[1],d[0]+b[0],d[1]+b[1]];a.bbox=c;this.refreshMap()}},pan:function(b){var a=cMAP.map.bbox;b=[(a[2]-a[0])*b[0],(a[3]-a[1])*b[1]];a[0]+=b[0];a[2]+=b[0];a[1]+=b[1];a[3]+=b[1];this.refreshMap()},panTo:function(b){var a=this.map,c=a.div;b="undefined"!=typeof event?[event.clientX+document.body.scrollLeft,
event.clientY+document.body.scrollTop]:[b.pageX,b.pageY];b[0]-=c.offsetLeft;b[1]-=c.offsetTop;this.pan([(b[0]-a.dim[0]/2)/a.dim[0],(a.dim[1]/2-b[1])/a.dim[1]])},setParams:function(b){var a=this.map,c=this.features;a.epsg=c.epsg;a.div=b;a.click&&(a.div.onclick=function(a){cMAP.panTo(a)});a.div.style.overflow="hidden";a.bbox=[c.bbox[0],c.bbox[1],c.bbox[2],c.bbox[3]];a.div.clientWidth&&(a.dim[0]=a.div.clientWidth);a.div.clientHeight&&(a.dim[1]=a.div.clientHeight);this.setBbox()},setBbox:function(){this.setBboxBleed();
this.setBboxImage()},setBboxImage:function(){var b=this.map.bbox,a=0,a=b[2]-b[0],c=b[3]-b[1],d=1*this.map.dim[0]/this.map.dim[1],f=a/c;f<d?(a=(a*(d/f)-a)/2,b[0]-=a,b[2]+=a):f>d&&(a=(c*(f/d)-c)/2,b[1]-=a,b[3]+=a)},setBboxBleed:function(){var b=this.map.bbox,a=this.map.bleed;if(a&&0<a){var c=[this.map.dim[0]/(this.map.dim[0]-2*a),this.map.dim[1]/(this.map.dim[1]-2*a)],a=[b[2]-b[0],b[3]-b[1]],c=[a[0]*c[0],a[1]*c[1]],a=[(c[0]-a[0])/2,(c[1]-a[1])/2];b[0]-=a[0];b[2]+=a[0];b[1]-=a[1];b[3]+=a[1]}},refreshMap:function(){var b=
cMAP.map;this.refresh=!0;this.createContent(b.div)},createContent:function(b){this.refresh||this.setParams(b);this.createMap();this.refresh=!1},createMap:function(){for(var b=this.map.div,a=this.map.canvas;b.hasChildNodes();)b.removeChild(b.lastChild);this.load.draw={isDrawing:!0,count:0};for(a=0;a<this.url.length;a++){var c=this.createMapDiv("map_"+a);c.appendChild(this.createImage(a));b.appendChild(c)}a=this.createCanvas(b);this.drawGeometry(a);this.createLoad(b);this.imgTop&&this.createTop(b)},
createMapDiv:function(b){var a=document.createElement("div"),c=this.map.dim;a.className="mapDiv";a.id=b;a.style.position="absolute";a.width=c[0];a.height=c[1];return a},createImage:function(b){var a=document.createElement("img"),c=this.map.dim,d=this.url[b]+this.map.getEPSG()+this.map.getDim()+this.map.getBbox();a.id="img_"+b;a.onerror=function(){cMAP.wmsRetry(this)};a.onload=function(){cMAP.wmsLoad()};a.width=c[0];a.height=c[1];a.src=d;return a},createCanvas:function(b){var a=document.createElement("canvas"),
c=this.map.dim;a.style.position="absolute";a.width=c[0];a.height=c[1];a.getContext||G_vmlCanvasManager.initElement(a);b.appendChild(a);return a},createLoad:function(b){var a=this.imgLoad.dim,c=[Math.round(this.map.dim[0]/2-this.imgLoad.dim[0]/2),Math.round(this.map.dim[1]/2-this.imgLoad.dim[1]/2)],d=document.createElement("div");d.id="img_load";d.style.position="absolute";d.width=a[0];d.height=a[1];d.style.left=""+c[0]+"px";d.style.top=""+c[1]+"px";c=document.createElement("img");c.src=this.imgUrl+
this.imgLoad.name;c.onerror=function(){alert("Loading image not found!")};c.width=a[0];c.height=a[1];d.appendChild(c);b.appendChild(d)},createTop:function(b){var a=document.createElement("div"),c=this.map.dim;oImg=document.createElement("img");oImg.src=this.imgUrl+this.imgTop.name;oImg.onerror=function(){alert("Wrap image not found!")};oImg.width=c[0];oImg.height=c[1];a.appendChild(oImg);b.appendChild(a)},transformFeatures:function(){var b=this.map.bbox,a=this.map.fact,c=c=this.features,d=c.feature,
f,g=this.featuresMap={envelope:null,feature:[]};f=[];for(var e=0;e<c.bbox.length;e+=2)f[e]=Math.round(a[0]*(c.bbox[e]-b[0])),f[e+1]=Math.round(a[1]*(b[3]-c.bbox[e+1]));g.envelope=f;f=[];for(e=0;e<c.envelope.length;e+=2)f[e]=Math.round(a[0]*(c.envelope[e]-b[0])),f[e+1]=Math.round(a[1]*(b[3]-c.envelope[e+1]));g.envelope=f;for(e=0;e<d.length;e++){f=[];for(c=0;c<d[e].length;c+=2)f[c]=Math.round(a[0]*(d[e][c]-b[0])),f[c+1]=Math.round(a[1]*(b[3]-d[e][c+1]));g.feature[e]=f}},drawGeometry:function(b){b=b.getContext("2d");
b.fillStyle="rgba(255, 255, 255, 0.65) ";b.fillRect(0,0,this.map.dim[0],this.map.dim[1]);b.fill();this.map.calcFactors();this.transformFeatures();for(var a=this.featuresMap.feature,c=this.featuresMap.envelope,d=0;d<a.length;d++)3>a[d].length?this.drawPoint(b,a[d]):this.drawLine(b,a[d]);this.drawEnvelope(b,c)},drawEnvelope:function(b,a){b.lineWidth=1;b.strokeStyle="gray";b.setLineDash&&b.setLineDash([10,10]);b.strokeRect(a[0],a[3],a[2]-a[0],a[1]-a[3]);b.setLineDash&&b.setLineDash([1,0])},drawPoint:function(b,
a){b.beginPath();b.arc(a[0],a[1],4,0,2*Math.PI);b.fillStyle="red";b.fill();b.strokeStyle="black";b.stroke()},drawLine:function(b,a){var c=[a[0],a[1]];b.beginPath();b.lineWidth=1.5;b.moveTo(c[0],c[1]);for(var d=2;d<a.length-2;d+=2)4<Math.abs(a[d]-c[0])+Math.abs(a[d+1]-c[1])&&(c[0]=a[d],c[1]=a[d+1],b.lineTo(c[0],c[1]));b.lineTo(a[a.length-2],a[a.length-1]);b.strokeStyle="black";b.stroke()},wmsLoad:function(){var b=cMAP,a=b.load.draw;a.count++;a.count==this.url.length&&b.wmsDone(a)},wmsRetry:function(b){var a=
cMAP,c=a.load,d=a.load.draw;d[b.id]="undefined"==typeof d[b.id]?1:d[b.id]+1;d[b.id]>c.max?a.wmsError(d):setTimeout(function(){b.src+="&"},c.delay)},wmsError:function(b){b.isDrawing&&(this.wmsDone(b),alert(this.load.error))},wmsDone:function(b){b.isDrawing&&(b.isDrawing=!1,setTimeout(function(){document.getElementById("img_load").style.visibility="hidden"},100))}};