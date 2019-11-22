//Create the class
var Controller =  {
  initialize: function()
  {
	var ss=$('#serviceSelect'), s=Data.services, i=0;
    //for (o in s){ss.append($('<option>').text(o));}
    for (o in s){ss.append($('<option>', {value:o, text: s[o].title }))};
	ss.selectedIndex=0;
	$('#requestMode_0').click(this.getRequest.bind(this));
	//$('#requestMode_0').bind('click',this.getRequest.bind(this));
	
	$('#requestMode_1').click(this.getDescription.bind(this));	
	//$('#requestMode_1').bind('click',this.getDescription.bind(this));	

	$('#resultMode_0').click(this.setResultXML.bind(this));	
	$('#resultMode_1').click(this.setResultTable.bind(this));
	$('#resultMode_2').click(this.setResultMap.bind(this));
	
    //this.getService();
    //$('#serviceSelect').bind('change', this.getService);
	//$('#serviceSelect').bind('change', this.getService.bind(this));

	$('#serviceSelect').change(this.getPage.bind(this));
	//$('#serviceSelect').bind('change',this.getPage.bind(this));
	
    $('#requestSelect').change(this.getRequest.bind(this));
	//$('#requestSelect').bind('change',this.getRequest.bind(this));
	
	$('#send').click(this.getResult.bind(this));
	$('#download').click(this.getDownload.bind(this))
	$('#upload_target').load(this.showXML);
	this.resultView=$("#resultView_0,#resultView_1,#resultView_2");
	this.bDownload=(Modernizr.adownload&&Modernizr.blobconstructor)//download check
	this.lastSRS=null;
	this.getWelcome();
  },
  getDownload: function(){
    window.URL = window.URL || window.webkitURL;
    o=$('#result');
    var blob = new Blob([o.val()], {type: 'text/plain'});
    var a = document.createElement('a');
    a.setAttribute('href',window.URL.createObjectURL(blob));
    a.setAttribute('download', "WFS_Response.xml");
	$('#downloadExtra').empty().append(a);
    a.click();
  },
  setDownload: function(bOn){
	if (typeof bOn=="undefined") bOn = false;
    o=$('#download').attr("disabled", !bOn);
  },
  showXML: function(){
    var iframe = $('#upload_target'), xmlObject, xmlString="";
    if (top.upload_target.document.location.href.indexOf("html/blank.html")>0) return;
	var header = '<?xml version="1.0" encoding="utf-8"?>\n', content;
	//When waiting for FilReader(HTML5)
    if(window.ActiveXObject) {
      //-- Internet Explorer
      content = iframe[0].contentWindow.document.body.innerHTML;
	  //decode all tags
	  content = content.replace(/_\(_/g,"<").replace(/_\)_/g,">");
	  content = content.replace(/<[\?](.*)\/>/,"");
      var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(content);
	  if (xmlDoc.parseError.errorCode == 0){
        xmlString = xmlDoc.xml;
	  } else {
	    xmlString = "<parsererror>\n<error>\n"+
	     "    Error line/column "+xmlDoc.parseError.line+"/"+xmlDoc.parseError.linepos+": "+xmlDoc.parseError.srcText.trim()+"\n"+
		 "    Reason: "+xmlDoc.parseError.reason+"</error>\n"+
	     content+"\n</parsererror>\n";
	  }
    } else {
	  //-- Other
	  content = iframe[0].contentDocument.documentElement.lastChild.innerHTML;
	  //decode all tags
	  content = content.replace(/_\(_/g,"<").replace(/_\)_/g,">");
      var parser=new DOMParser();
      var xmlObject=parser.parseFromString(content,'text/xml');
	  xmlString = (new XMLSerializer()).serializeToString( xmlObject );
	  xmlString = xmlString.replace(/<[\?](.*)[\?]>/,"");//Opera: remove header
    }
    $('#request')[0].value=header+xmlString;
	iframe[0].src="html/blank.html";
  },
  getPage: function(){	  
	var ss=$('#serviceSelect')[0];
	if (ss.selectedIndex<1) this.getWelcome();
	else this.getService();
  },
  getWelcome: function(){
	$('#welcomePage').attr("class", "divOn");
	$('#workingPage').attr("class", "divOff");
    var rs=$('#welcomeView'),file=Data.welcomeHTML;
	var o=this;
	$("#welcomeView").load(Data.welcomeHTML);

  },
  getService: function(){
	var ss=$('#serviceSelect')[0];
	$('#welcomePage').attr("class", "divOff");
	$('#workingPage').attr("class", "divOn");
	if (ss.selectedIndex==1) {this.getUpload(); return;}
	var service=ss.options[ss.selectedIndex].value, data=Data.services[service], url=data.url, rs=$('#requestSelect')[0];
	if (url!=null)$('#serviceUrl').attr("value",url);
    rs.options.length = 0;
	for (var i=0; i<data.requests.length; i++){
	  rs.options[i] = new Option(data.requests[i][0], data.requests[i].slice(1).join("|"), false, false);
	}
	rs.selectedIndex=0;
	if (data.requests.length>0){
	  $('#requestView').attr("class", "divInline");
	  $('#uploadView').attr("class", "divOff");
	  this.getRequest();
	}else this.getUpload();
  },
  getUpload: function(){
    $('#requestView').attr("class", "divOff");
	$('#uploadView').attr("class", "divInline");		
	$('#requestModeView').attr("class", "divOff");
	$('#request').value="";
	this.setRequestMode(0);
  },
  getRequest: function(){
    var rs=$('#requestSelect')[0],files=rs.options[rs.selectedIndex].value.split("|"),
	  file=files[0];
	$('#requestModeView').attr("class", (typeof files[1]!="undefined"&&files[1].length>0?"divInline":"divOff"));
	this.setRequestMode(0);
	$.get(Data.data+file, function(data)
	  {
        $('#request').val(data);
      },
	  "text"
	);
  },
  getDescription: function(){
    var rs=$('#requestSelect')[0],
	  file=rs.options[rs.selectedIndex].value.split("|")[1], req=$('#requestView_1');
    this.setRequestMode(1);
    this.updateDiv(req,Data.data+file);
  },
  transformXML: function(){
	//if ($('#result').val().length<15) return;
    var rs=$('#requestSelect')[0],idx=rs.options[rs.selectedIndex].value.split("|")[2];
	idx=(typeof idx!="undefined"?idx.split(",")[0]:"");
	if (idx=="") {
		alert("Tabellstil ikke definert");
		this.setResultMode(0)
		return;
	}
	var res=this.resultView[1],service=Data.transform, source=$('#result'), rmv=$('#resultModeView'),
      par="?style="+Data.app+Data.xslt+Data.style[idx]/*+"&clear-stylesheet-cache=yes"*/, resultStatus=this.resultStatus;
	res.innerHTML="<pre>"+Data.getWaitString()+"</pre>";
    $.ajax({
      url: service+par,
      type: 'post',
      contentType: "text/xml; charset=UTF-8",//important!
	  dataType: "text",//important!
      data: source.val(),
      success: function (data, status) {
        //$('#result').val($(data).text());
		res.innerHTML=data;
        //rmv.attr("class", "divInline");
		resultStatus[1]=1;
      }/*
      error: function (xhr, desc, err) {
	    $('#result').val("Description: " + desc + "\nMessage: " + err);
        rmv.attr("class", "divInline");
      }*/
    }); 
  },
  transformXMLClient: function(){
	//if ($('#result').val().length<15) return;
    var rs=$('#requestSelect')[0],idx=rs.options[rs.selectedIndex].value.split("|")[2];
	idx=(typeof idx!="undefined"?idx.split(",")[0]:"");
	if (idx=="") {
		alert("Tabellstil ikke definert");
		this.setResultMode(0)
		return;
	}
	var res=this.resultView[1],service=Data.transform, source=$('#result'), rmv=$('#resultModeView'),
      style=Data.app+Data.xslt+Data.style[idx], resultStatus=this.resultStatus;

    res.innerHTML="<pre>"+Data.getWaitString()+"</pre>";  
	  
	//Start transform
    var xml = Saxon.parseXML(source.val()), xsl = Saxon.requestXML(style), proc = new Saxonce.XSLT20Processor(xsl),
	xmlNew = proc.transformToFragment(xml), data = Saxon.serializeXML(xmlNew);
	  
    res.innerHTML=data;
	resultStatus[1]=1;
  },
  mapXML: function(){
	//if ($('#result').val().length<15) return;
    var rs=$('#requestSelect')[0],idx=rs.options[rs.selectedIndex].value.split("|")[2];
	idx=(typeof idx!="undefined"?idx.split(",")[1]:"");
	if (idx=="" || typeof idx=="undefined") {
		alert("Tabellstil ikke definert");
		this.setResultMode(0)
		return;
	}
	var res=this.resultView[2],service=Data.transform, source=$('#result'), rmv=$('#resultModeView'),
      par="?style="+Data.app+Data.xslt+Data.style[idx]/*+"&clear-stylesheet-cache=yes"*/, resultStatus=this.resultStatus,
	  _this=this;
	res.innerHTML="<pre>"+Data.getWaitString()+"</pre>";
	
    $.ajax({
      url: service+par,
      type: 'post',
      contentType: "text/plain; charset=UTF-8",//important!
	  dataType: "text",//important!
      data: source.val(),
      success: function (data, status) {
        //$('#result').val($(data).text());
		//_this.features=JSON.parse(data)
		if (data.length>0&&data[0]=="{"){_this.features=eval('('+data+')');}
		else {res.innerHTML="<pre>"+Data.getNoGeoString()+"</pre>";return;}
        //rmv.attr("class", "divInline");
		resultStatus[2]=1;
		_this.displayMap(res);
      }/*
      error: function (xhr, desc, err) {
	    $('#result').val("Description: " + desc + "\nMessage: " + err);
        rmv.attr("class", "divInline");
      }*/
    }); 
  },
  mapXMLClient: function(){
	//if ($('#result').val().length<15) return;
    var rs=$('#requestSelect')[0],idx=rs.options[rs.selectedIndex].value.split("|")[2];
	idx=(typeof idx!="undefined"?idx.split(",")[1]:"");
	if (idx=="" || typeof idx=="undefined") {
		alert("Tabellstil ikke definert");
		this.setResultMode(0)
		return;
	}
	var res=this.resultView[2],service=Data.transform, source=$('#result'), rmv=$('#resultModeView'),
      style=Data.app+Data.xslt+Data.style[idx], resultStatus=this.resultStatus,
	  _this=this;
	res.innerHTML="<pre>"+Data.getWaitString()+"</pre>";
	
	//Start transform
    var xml = Saxon.parseXML(source.val()), xsl = Saxon.requestXML(style), proc = new Saxonce.XSLT20Processor(xsl),
	xmlNew = proc.transformToFragment(xml), data = Saxon.serializeXML(xmlNew);
	
	if (data.length>0&&data[0]=="{"){this.features=eval('('+data+')');}
	else {res.innerHTML="<pre>"+Data.getNoGeoString()+"</pre>";return;}
	
	resultStatus[2]=1;
	this.displayMap(res);
  },
  displayMap: function(res){
    
	var f = this.features;

    function getCoord(s){
      xy=s.split(" ");
      for (var i=0; i<xy.length; i++)xy[i]=parseFloat(xy[i]);
      return xy;
    };
	
	function isGrad(f){
      if (f.epsg.length==4) return true;
	  else return false;
	};

    function swapCoord(f){
      var tmp;
      for (var i=0; i<f.envelope.length; i+=2){
        tmp=f.envelope[i];
        f.envelope[i]=f.envelope[i+1];
        f.envelope[i+1]=tmp;
      }
      for (var i=0; i<f.feature.length; i++){
        for (var j=0; j<f.feature[i].length; j+=2){
          tmp=f.feature[i][j];
          f.feature[i][j]=f.feature[i][j+1];
          f.feature[i][j+1]=tmp;
	    }
      }
    };
	
    function checkBbox(f){
		var dX = f.bbox[2] - f.bbox[0], dY = f.bbox[3] - f.bbox[1],
		diag= Math.sqrt((dX*dX) + (dY*dY)), limit= (f.isGrad?0.0145851:1000);
		if (diag<limit){
			var delta=limit/2;
			f.bbox[0]-=delta;
			f.bbox[1]-=delta;
			f.bbox[2]+=delta;
			f.bbox[3]+=delta;
			f.isBbox=false;
		}else f.isBbox=true;
    };
	
	function setBbox(f){
	  var val=999999999, bbox=[val,val,-val,-val];
      for (var i=0; i<f.feature.length; i++){
        for (var j=0; j<f.feature[i].length; j+=2){
		  if (f.feature[i][j]<bbox[0]) bbox[0]=f.feature[i][j];
		  if (f.feature[i][j]>bbox[2]) bbox[2]=f.feature[i][j];
		  if (f.feature[i][j+1]<bbox[1]) bbox[1]=f.feature[i][j+1];
		  if (f.feature[i][j+1]>bbox[3]) bbox[3]=f.feature[i][j+1];
	    }
	  }
	  if (bbox[2]==-val){bbox[2]=bbox[0]; bbox[3]=bbox[1];}
	  f.bbox=bbox;
	  //checking extent vs envelope
	  if (f.bbox[0]>f.envelope[0])f.bbox[0]=f.envelope[0];
	  if (f.bbox[1]>f.envelope[1])f.bbox[1]=f.envelope[1];
	  if (f.bbox[2]<f.envelope[2])f.bbox[2]=f.envelope[2];
	  if (f.bbox[3]<f.envelope[3])f.bbox[3]=f.envelope[3];
    };
	
    f.epsg=f.epsg.split(":").pop();
	if (f.epsg=="" && this.lastSRS!=null) f.epsg=this.lastSRS;//4258,4326
	f.isGrad=isGrad(f);

    f.envelope=getCoord(f.envelope);
    f.feature.pop();
	if (f.feature.length>0){
      for (var i=0; i<f.feature.length; i++){
        f.feature[i]=getCoord(f.feature[i]);
      }
      if (f.isGrad) swapCoord(f);
	  setBbox(f);
      checkBbox(f);
      cMAP.features=f;
	  cMAP.createContent(res);
	} else res.innerHTML="<pre>"+Data.getNoGeoString()+"</pre>";
  },
  resultStatus: [0,0,0],
  resultView: null,
  setResultXML: function(){
    //this.setResultMode(0);
	setTimeout(function(){Controller.setResultMode(0)},0);
  },
  setResultTable: function(){
    //this.setResultMode(1);
	setTimeout(function(){Controller.setResultMode(1)},0);
	if (!this.resultStatus[1]) {setTimeout(function(){Data.useXSLTClient?Controller.transformXMLClient():Controller.transformXML()},1);};
  },
  setResultMap: function(){
	setTimeout(function(){Controller.setResultMode(2)},0);
	if (!this.resultStatus[2]) {setTimeout(function(){Data.useXSLTClient?Controller.mapXMLClient():Controller.mapXML()},1);};

  },
  //testing
  fillText: function(id){
    var container=$(id);
	container.innerHTML=textgen.getSillyText([20,50,70,40]);
  },
  setRequestMode: function(n){
	  $('#requestMode_'+n).attr("checked",true);
	  var requestViews=$("#requestView_0,#requestView_1");//document.getElementsByName("requestView");
  	  for (var i=0; i<requestViews.length;i++){
        requestViews[i].style.display=(i==n?"block":"none");
	  }
  },
  setResultMode: function(n){
    var rd = $('#resultDownload');
    $('#resultMode_'+n).attr("checked",true);
    if (n==0&&this.bDownload)rd.attr("class", "download");
    else rd.attr("class", "divOff");
    for (var i=0; i<this.resultView.length;i++){
      this.resultView[i].style.display=(i==n?"block":"none");
    }
  },
  enableStyles: function(style){
	var styles=(typeof style!="undefined"?style.split(','):[]),
		mode = $("#resultModeDiv_0,#resultModeDiv_1,#resultModeDiv_2"),
		isStyle=false;
	for (var i=1; i<mode.length; i++){
		if (typeof styles[i-1]!="undefined")isStyle=true;
	    mode[i].style.display=(typeof styles[i-1]!="undefined"?"inline":"none");
		
	}
	mode[0].style.display=(isStyle?"inline":"none");
  },
  setLastSRS: function(s){
	var matches=s.match(/srsName.*[>]/);
    if ( matches != null) {
      this.lastSRS=matches[0].replace(/(.*srsName=["])(.*)(["].*[>])/,'$2').split(":").pop().toString();
    } else this.lastSRS=null;
    //alert(this.lastSRS);
  },
  getResult: function(){
	if ($('#serviceUrl').val().length<15) return;
	var service=Data.proxy+$('#serviceUrl').val(), res=$('#result'), rmv=$('#resultModeView'), resultStatus= this.resultStatus, setDownload=this.setDownload,
	rs=$('#requestSelect')[0], style;
	if (rs.selectedIndex>0)style=rs.options[rs.selectedIndex].value.split("|")[2];
	this.enableStyles(style);
	rmv.attr("class", "divOff");
	setDownload(false);
	this.setResultMode(0);
	//$('#resultMode_0').attr("checked",true);
    res.attr("value",Data.getWaitString());
	postObj=$('#request').val();
    this.setLastSRS(postObj);
/*  //contentType could not be set explicitly
    $.post(service,postObj,
      function(data) {			
        $('#result').val(data);
		rmv.attr("class", "divInline");
      }, 
	  "text"
	);
*/
    $.ajax({
      url: service,
      type: 'post',
      contentType: "text/xml; charset=UTF-8",//important!
	  dataType: "text",//important!
      data: $('#request').val(),
      success: function (data, status) {
        //$('#result').val($(data).text());
		$('#result').val(data);
        rmv.attr("class", "divInline");
		resultStatus[0]=1;
		resultStatus[1]=0;
		resultStatus[2]=0;
		setDownload(true);
      }/*
      error: function (xhr, desc, err) {
	    $('#result').val("Description: " + desc + "\nMessage: " + err);
        rmv.attr("class", "divInline");
      }*/
    }); 
  },
  updateDiv: function(div,url){
	$(div).load(url);
  }
};

// Global variable for the instance of the class
var myTest;

// Creating an instance of the class if the page has finished loading
$(document).ready(function(){
  //function(){myTest = new myTestClass();}
  Controller.initialize();
});

//helpers
h={
showObj: function(o){
//object to string including methods
  var s="";
  //for (i in o.document.parentWindow.frameElement) s+=i+":"+o.document.parentWindow.frameElement[i]+"  "; alert(s);
  if (typeof o!="undefined" && o.toString()!="null") for (i in o) s+=i+":"+o[i]+"\n\n";
  this.showWin(s);
},

//displaying string in a new window
showWin: function(s){
  var pattern=new RegExp('^<html>','i');
  if(!pattern.test(s)){
    s=s.replace(new RegExp("[<]","g"),'&lt');s=s.replace(new RegExp("[>]","g"),'&gt');
    s='<html><body><pre>'+s+'</pre></html></body>';
  }
  var W = window.open("",'','Width=600,Height=480,resizable=yes,scrollbars=yes,left=0,top=0',true);
  W.focus();W.document.open();W.document.write(s);W.document.close();
}
}