//Canvas Map object
var cMAP={
  url:[ 
  "http://wms.geonorge.no/skwms1/wms.europa?VERSION=1.1.1&service=wms&REQUEST=GetMap&FORMAT=image/png&BGCOLOR=0xfcfdfe&TRANSPARENT=TRUE&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&LAYERS=Europa_WMS",
  "http://wms.geonorge.no/skwms1/wms.topo4?VERSION=1.1.1&service=wms&REQUEST=GetMap&FORMAT=image/png&BGCOLOR=0xfcfdfe&TRANSPARENT=TRUE&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&LAYERS=topo4_WMS"
  ],
  features: null, //defined in separate js
  featuresMap: null,
  imgUrl: "http://geo.ngu.no/kart/images/",
  //Animated gif when loading
  imgLoad: {//name, dimention(width, height)
    name: "loading.gif",
    dim: [32,32]
  },
  //Transparent top layer
  imgTop: {//name
    name: "dot.gif"
  },
  //Loading logic
  load: {//max retries, delay request, error message, temp object when loading
    max: 4,
    delay: 1000,
    error: "* Feil ved opptegning av kartet *\nPrøv på nytt for fullstendig kart!",
    draw: {}
  },
  //map
  map: {//container, bleed in pixels, dimension(width, height), envelope, methodes... 
    div: null,
    canvas: null,
    bleed: 20,
    dim: [330,300],//default width, height
	epsg: null,
	fact: null,
	xyReverse: false,
    bbox: null,
	click: false,
	getEPSG: function (){return "&SRS=EPSG:"+this.epsg},
    getDim: function (){return "&WIDTH="+this.dim[0]+"&HEIGHT="+this.dim[1]},
    getBbox: function (){return "&BBOX="+this.bbox.join(",")},
	calcFactors: function(){
	  this.fact=[
	    this.dim[0]/(this.bbox[2]-this.bbox[0]),
	    this.dim[1]/(this.bbox[3]-this.bbox[1])
	  ]
	}
  },
  refresh: false,
  template: null,//template value string
  udef: undefined
};

cMAP.zoom=function(fact){
  if(!fact)return; else fact*=2;
  var m=cMAP.map,env=m.bbox,cent=[(env[2]+env[0])/2,(env[3]+env[1])/2],diff=[(env[2]-env[0])/fact,(env[3]-env[1])/fact];
  env=[cent[0]-diff[0],cent[1]-diff[1],cent[0]+diff[0],cent[1]+diff[1]];
  m.bbox=env;
  this.refreshMap();	  
};

cMAP.pan=function(fact){
  var env=cMAP.map.bbox,diff=[(env[2]-env[0])*fact[0],(env[3]-env[1])*fact[1]];
  env[0]+=diff[0];env[2]+=diff[0];
  env[1]+=diff[1];env[3]+=diff[1];
  this.refreshMap();	
};

cMAP.panTo=function(e){
  var pos,m=this.map,d=m.div;
  if (typeof event!="undefined") pos=[event.clientX+document.body.scrollLeft,event.clientY+document.body.scrollTop];
  else pos=[e.pageX,e.pageY];
  pos[0]-=d.offsetLeft; pos[1]-=d.offsetTop;
  this.pan([(pos[0]-m.dim[0]/2)/m.dim[0],(m.dim[1]/2-pos[1])/m.dim[1]]);
};

cMAP.setParams=function(div){
  var m=this.map, f=this.features;
  m.epsg=f.epsg;
  m.div=div;
  if(m.click)m.div.onclick=function(e){cMAP.panTo(e);};
  m.div.style.overflow="hidden";
  m.bbox=[f.bbox[0],f.bbox[1],f.bbox[2],f.bbox[3]];
  if (m.div.clientWidth)m.dim[0]=m.div.clientWidth;
  if (m.div.clientHeight)m.dim[1]=m.div.clientHeight;
  this.setBbox();
}; 

cMAP.setBbox=function(){
  this.setBboxBleed();
  this.setBboxImage();
};

cMAP.setBboxImage=function(){
  var bbox=this.map.bbox,
  delta=0.0,dX=bbox[2]-bbox[0],dY=bbox[3]-bbox[1],
  faktI=(1.0*this.map.dim[0])/this.map.dim[1], faktM=dX/dY;
  if (faktM<faktI){
    delta=(dX*(faktI/faktM)-dX)/2.0;
    bbox[0]-=delta;bbox[2]+=delta;
  }else if (faktM>faktI){
    delta=(dY*(faktM/faktI)-dY)/2.0;
    bbox[1]-=delta;bbox[3]+=delta;    
  }
};

cMAP.setBboxBleed=function(){
  var bbox=this.map.bbox, bleed=this.map.bleed;
  if (!bleed||!(bleed>0))return;
  //new factor
  var fact=[
    (this.map.dim[0])/(this.map.dim[0]-(bleed*2)),
    (this.map.dim[1])/(this.map.dim[1]-(bleed*2))
  ],
  //start diff
  diff0=[bbox[2]-bbox[0],bbox[3]-bbox[1]],
  //new diff
  diff2=[diff0[0]*fact[0],diff0[1]*fact[1]],
  //new delta
  delta=[(diff2[0]-diff0[0])/2,(diff2[1]-diff0[1])/2];
  bbox[0]-=delta[0];bbox[2]+=delta[0];
  bbox[1]-=delta[1];bbox[3]+=delta[1];    
};

cMAP.refreshMap=function(){
  var m=cMAP.map;
  this.refresh=true;
  this.createContent(m.div);
};

cMAP.createContent=function(div){
  if (!this.refresh){
    this.setParams(div);
  }
  this.createMap();
  this.refresh=false;
};

cMAP.createMap=function(){
  var t=this, div=t.map.div, canv=t.map.canvas;
	
  while(div.hasChildNodes())div.removeChild(div.lastChild);
  this.load.draw={isDrawing: true, count:0};
  for (var i=0; i<this.url.length; i++){
    var mapDiv=this.createMapDiv("map_"+i);
    mapDiv.appendChild(this.createImage(i));
    div.appendChild(mapDiv);
  }
  canv=this.createCanvas(div);
  this.drawGeometry(canv);  
 
  this.createLoad(div);
  if (this.imgTop)this.createTop(div);

};

cMAP.createMapDiv=function(id){
  var mapDiv=document.createElement("div"),
  dim=this.map.dim;
  mapDiv.className="mapDiv";
  mapDiv.id=id;
  mapDiv.style.position="absolute";
  mapDiv.width=dim[0];
  mapDiv.height=dim[1];
  return mapDiv;
};

cMAP.createImage=function(n){
  var oImg=document.createElement("img"),
  dim=this.map.dim,
  sImg=this.url[n]+this.map.getEPSG()+this.map.getDim()+this.map.getBbox();
  oImg.id="img_"+n;
  oImg.onerror=function(){cMAP.wmsRetry(this)};
  oImg.onload=function(){cMAP.wmsLoad()};
  oImg.width=dim[0];
  oImg.height=dim[1];
  oImg.src=sImg;
  return oImg;
};

cMAP.createCanvas=function(div){
  var canv=document.createElement("canvas"),
  dim=this.map.dim;
  canv.style.position="absolute";
  canv.width=dim[0];
  canv.height=dim[1];
  if(!canv.getContext)G_vmlCanvasManager.initElement(canv);
  div.appendChild(canv);
  return canv;
};

cMAP.createLoad=function(div){
  var dim=this.imgLoad.dim,
  offset=[
    Math.round((this.map.dim[0]/2.0)-(this.imgLoad.dim[0]/2.0)),
	Math.round((this.map.dim[1]/2.0)-(this.imgLoad.dim[1]/2.0))
  ],
  mapDiv=document.createElement("div");
  mapDiv.id="img_load";
  mapDiv.style.position="absolute";
  mapDiv.width=dim[0];
  mapDiv.height=dim[1];
  mapDiv.style.left=''+offset[0]+'px';
  mapDiv.style.top=''+offset[1]+'px';
  var oImg=document.createElement("img");
  oImg.src=this.imgUrl+this.imgLoad.name;
  oImg.onerror=function(){alert("Loading image not found!");};
  oImg.width=dim[0];
  oImg.height=dim[1];
  mapDiv.appendChild(oImg);
  div.appendChild(mapDiv);
};

cMAP.createTop=function(div){
  var mapDiv=document.createElement("div"),
  dim=this.map.dim;  
  oImg=document.createElement("img");
  oImg.src=this.imgUrl+this.imgTop.name;
  oImg.onerror=function(){alert("Wrap image not found!");};
  oImg.width=dim[0];
  oImg.height=dim[1];
  mapDiv.appendChild(oImg);
  div.appendChild(mapDiv);
};

cMAP.transformFeatures=function(){
  var bbox=this.map.bbox, fact=this.map.fact, f=f=this.features, ff=f.feature,  p;
  this.featuresMap={envelope: null, feature:[]};
  var fM=this.featuresMap;

  //bbox
  p=[];
  for (var i=0; i<f.bbox.length; i+=2){
    p[i]=Math.round(fact[0]*(f.bbox[i]-bbox[0]));
    p[i+1]=Math.round(fact[1]*(bbox[3]-f.bbox[i+1]));
  }
  fM.envelope=p;

  //envelope
  p=[];
  for (var i=0; i<f.envelope.length; i+=2){
    p[i]=Math.round(fact[0]*(f.envelope[i]-bbox[0]));
    p[i+1]=Math.round(fact[1]*(bbox[3]-f.envelope[i+1]));
  }
  fM.envelope=p;

  //features
  for (var i=0; i<ff.length; i++){
	p=[];
    for (var j=0; j<ff[i].length; j+=2){
      p[j]=Math.round(fact[0]*(ff[i][j]-bbox[0]));
      p[j+1]=Math.round(fact[1]*(bbox[3]-ff[i][j+1]));
	}
	fM.feature[i]=p;
  }
};

cMAP.drawGeometry=function(canv){
  var c = canv.getContext("2d");
	
  //background transparent rectangle
  c.fillStyle = 'rgba(255, 255, 255, 0.65) ';
  c.fillRect(0,0,this.map.dim[0],this.map.dim[1]);
  c.fill();

  //transform features
  this.map.calcFactors();
  this.transformFeatures();

  //then assign variables to geometry
  var feat=this.featuresMap.feature, env=this.featuresMap.envelope;
  
  //draw features
  for(var i=0; i<feat.length; i++){
    if (feat[i].length<3) this.drawPoint(c, feat[i]);
	else this.drawLine(c, feat[i]);
  }
  
  //draw envelope on top in WFS response
  this.drawEnvelope(c, env);

};


cMAP.drawEnvelope=function(c, env){
  c.lineWidth = 1.0;
  c.strokeStyle="gray";
  if (c.setLineDash) c.setLineDash([10,10]);
  c.strokeRect(env[0],env[3],env[2]-env[0],env[1]-env[3]);
  if (c.setLineDash) c.setLineDash([1,0]);
};

cMAP.drawPoint=function(c, p){
  c.beginPath();
  c.arc(p[0],p[1],4,0,Math.PI*2);
  c.fillStyle="red";
  c.fill();
  c.strokeStyle="black";
  c.stroke();	
};

cMAP.drawLine=function(c, p){
  var xP=[p[0],p[1]];
  c.beginPath();
  c.lineWidth = 1.5;
  c.moveTo(xP[0],xP[1]);
  for (var i=2; i<p.length-2; i+=2){
	//if (!(p[i]==p[i-2]&&p[i+1]==p[i-1]))
	if ((Math.abs(p[i]-xP[0])+Math.abs(p[i+1]-xP[1]))>4){
      xP[0]=p[i]; xP[1]=p[i+1];
      c.lineTo(xP[0],xP[1]);
	}
  }
  c.lineTo(p[p.length-2],p[p.length-1]);
  c.strokeStyle="black";
  c.stroke();
};

cMAP.wmsLoad=function(){
  var im=cMAP,draw=im.load.draw;
  draw.count++;
  if (draw.count==this.url.length){
    im.wmsDone(draw);
  }
};

cMAP.wmsRetry=function(o){
  var m=cMAP,load=m.load,draw=m.load.draw;
  if (typeof draw[o.id]=="undefined")draw[o.id]=1;
  else draw[o.id]+=1;
  if (draw[o.id]>load.max) m.wmsError(draw);//draw[o.id]=im.udef;
  else setTimeout(function(){o.src=o.src+"&"},load.delay);
};

cMAP.wmsError=function(o){
  if(o.isDrawing){
    this.wmsDone(o);
    alert(this.load.error);
  }
};

cMAP.wmsDone=function(o){
  if(o.isDrawing){
    o.isDrawing=false;
    setTimeout(function(){document.getElementById("img_load").style.visibility="hidden"},100);
  }
};

