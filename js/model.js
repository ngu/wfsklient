Data={};
Data.app=function () {var a=document.location.href.split("/"); a.pop(); return a.join("/")+"/";}();
Data.host="http://"+location.host+"/";
Data.data="data/";
Data.xslt="xslt/";
Data.isEng=(typeof lang!="undefined"?("nor"!= lang):false);
Data.useXSLTClient=(document.location.search.match(/.*xslt[=]client/)!=null?true:false);
Data.skWFS="http://wfs.geonorge.no/skwms1/";
//Data.proxy="http://iversen-sw7.ngu.no:8082/8081_requester/kurer?";
//Data.proxy="http://iversen-sw7.ngu.no/ngu_requester/kurer?";
Data.proxy=Data.host+"requester/kurer?";
Data.transform=Data.host+"requester/transform";
Data.style=[
  /*00*/"GetFeature2HTML_ND.xslt",
  /*01*/"GetFeature2XYjson_ND.xslt"
];

Data.getLang=function(){return(Data.isEng?"_eng":"")};

Data.welcomeHTML="html/welcome"+Data.getLang()+".html";

Data.simple=(Data.isEng?"Simple query":"Enkel spørring");
Data.advanced=(Data.isEng?"Advanced query":"Avansert spørring");

Data.simpleQuery="GetFeature: "+(Data.isEng?"Simple query":"Enkel spørring");
Data.advancedQuery="GetFeature: "+(Data.isEng?"Advanced query":"Avansert spørring");

Data.getWaitString=function(){return(Data.isEng?"Waiting...":"Venter på svar...")};
Data.getNoGeoString=function(){return(Data.isEng?"No geometry found.":"Ingen geometri funnet.")};

Data.services={/*
  "Kartverket: Primærdata kyst": {
	title: (Data.isEng?"Mapping Authority: Coast 'best of'":"Kartverket: Primærdata kyst"),
    name: "wfs.kystkontur",
    url: Data.skWFS+"wfs.kystkontur",
    requests: [
      ["GetCapabilities", "Kartverket_Primaerdata_kyst_GetCapabilities.xml", "Kartverket_Primaerdata_kyst_GetCapabilities_Beskrivelse"+Data.getLang()+".html"],
      ["DescribeFeatureType", "Kartverket_Primaerdata_kyst_DescribeFeatureType.xml"],
      [Data.simpleQuery, "Kartverket_Primaerdata_kyst_GetFeature1.xml", "Kartverket_Primaerdata_kyst_GetFeature1_Beskrivelse"+Data.getLang()+".html","0,1"],
	  ["GetPropertyValue", "Kartverket_Primaerdata_kyst_GetPropertyValue1.xml", "Kartverket_Primaerdata_kyst_GetPropertyValue1_Beskrivelse"+Data.getLang()+".html","0,1"]
		//"Kartverket_Primaerdata_kyst_GetFeature1_Beskrivelse.html","0,1"]
    ]
  },*/
  "Kartverket: Planomriss": {
	title: (Data.isEng?"Mapping Authority: Plan outlines":"Kartverket: Planomriss"),
    name: "wfs.planomriss",
    url: Data.skWFS+"wfs.planomriss",
    requests: [
      ["GetCapabilities", "Kartverket_Planomriss_GetCapabilities.xml", "Kartverket_Planomriss_GetCapabilities_Beskrivelse"+Data.getLang()+".html"],
      ["DescribeFeatureType", "Kartverket_Planomriss_DescribeFeatureType.xml"],
      [Data.simpleQuery, "Kartverket_Planomriss_GetFeature1.xml", "Kartverket_Planomriss_GetFeature1_Beskrivelse"+Data.getLang()+".html","0,1"],
      [Data.advancedQuery, "Kartverket_Planomriss_GetFeature2.xml", "Kartverket_Planomriss_GetFeature2_Beskrivelse"+Data.getLang()+".html","0,1"]
    ]
  },
  "Kartverket: Stedsnavn": {
	title: (Data.isEng?"Mapping Authority: Place Names":"Kartverket: Stedsnavn"),
    name: "wfs.stedsnavn",
    url: Data.skWFS+"wfs.stedsnavn50",
    requests: [
      ["GetCapabilities", "Kartverket_Stedsnavn_GetCapabilities.xml", "Kartverket_Stedsnavn_GetCapabilities_Beskrivelse"+Data.getLang()+".html"],
      ["DescribeFeatureType", "Kartverket_Stedsnavn_DescribeFeatureType.xml"],
      [Data.simpleQuery, "Kartverket_Stedsnavn_GetFeature1.xml", "Kartverket_Stedsnavn_GetFeature1_Beskrivelse"+Data.getLang()+".html","0,1"],
      [Data.advancedQuery, "Kartverket_Stedsnavn_GetFeature2.xml", "Kartverket_Stedsnavn_GetFeature2_Beskrivelse"+Data.getLang()+".html","0,1"],
	  ["GetPropertyValue: "+Data.simple, "Kartverket_Stedsnavn_GetPropertyValue1.xml", "Kartverket_Stedsnavn_GetPropertyValue1_Beskrivelse"+Data.getLang()+".html","0,1"],
	  ["GetPropertyValue: "+Data.advanced, "Kartverket_Stedsnavn_GetPropertyValue2.xml", "Kartverket_Stedsnavn_GetPropertyValue2_Beskrivelse"+Data.getLang()+".html","0,1"]
    ]
  },		
  "Kartverket: INSPIRE": {
	title: (Data.isEng?"Mapping Authority: Place Names (INSPIRE)":"Kartverket: Stedsnavn (INSPIRE)"),
    name: "wfs.exmlsgn",
    //url: Data.skWFS+"wfs.exmlsgn",
	url: Data.skWFS+"wfs.inspire-gn",
    requests: [
      ["GetCapabilities", "Kartverket_Stedsnavn_GetCapabilities.xml", "Kartverket_Stedsnavn_GetCapabilities_Beskrivelse"+Data.getLang()+".html"],
      ["DescribeFeatureType", "Kartverket_INSPIRE_DescribeFeatureType.xml"],
      [Data.simpleQuery, "Kartverket_INSPIRE_GetFeature1.xml", "Kartverket_INSPIRE_GetFeature1_Beskrivelse"+Data.getLang()+".html","0,1"],
      [Data.advancedQuery, "Kartverket_INSPIRE_GetFeature2.xml", "Kartverket_INSPIRE_GetFeature2_Beskrivelse"+Data.getLang()+".html","0,1"]
    ]
  },/*
  "OGC: Point of interrest": {
	title: (Data.isEng?"OGC: Point of interrest":"OGC: Interessepunkt"),
    name: "openpoiwfs",
    url: "http://openpois.net/openpoiwfs",
    requests: [
      ["GetCapabilities", "OGC_Stedsnavn_GetCapabilities.xml", "OGC_Openpois_Beskrivelse"+Data.getLang()+".html"],
      [Data.simpleQuery, "OGC_Stedsnavn_GetFeature1.xml",,"0,1"]
    ]
  },*/		
  "NGU: GeoTreat": {
   	title: (Data.isEng?"Geological Survey: GeoTreat":"NGU: GeoTreat"),
    name: "GeoTreatWMS",
    url: "http://geo.ngu.no/mapserver/GeotreatWMS2",
    requests: [
	  ["GetCapabilities", "NGU_GetCapabilities_110.xml"],
      ["DescribeFeatureType", "NGU_GeoTreat_DescribeFeatureType.xml"],
      [Data.simpleQuery+" 1", "NGU_GeoTreat_GetFeature1.xml",,"0,1"],
      [Data.simpleQuery+" 2", "NGU_GeoTreat_GetFeature2.xml",,"0,1"]  
	]
  },
  "NGU: Grus og Pukk": {
   	title: (Data.isEng?"Geological Survey: Sand, gravel and hard rock aggregate":"NGU: Grus og Pukk"),
    name: "GrusPukkWFS",
    url: "http://geo.ngu.no/mapserver/GrusPukkWFS2",
    requests: [
	  ["GetCapabilities", "NGU_GetCapabilities_110.xml"],
      ["DescribeFeatureType", "NGU_GrusPukk_DescribeFeatureType.xml"],
      [Data.simpleQuery+" 1", "NGU_GrusPukk_GetFeature1.xml",,"0,1"],
      [Data.simpleQuery+" 2", "NGU_GrusPukk_GetFeature2.xml",,"0,1"],		
      [Data.advancedQuery+" 1", "NGU_GrusPukk_GetFeature3.xml",,"0,1"],
	  [Data.advancedQuery+" 2", "NGU_GrusPukk_GetFeature4.xml",,"0,1"]
    ]
  },
  "NGU: EGDI": {
   	title: (Data.isEng?"NGU: EGDI":"NGU: EGDI"),
    name: "NGU_EGDI",
    url: "http://geo.ngu.no/egdi/wfs",
    requests: [
	  ["GetCapabilities", "NGU_WFS-2-0-0_GetCapabilities.xml"],
      ["DescribeFeatureType", "NGU_WFS-2-0-0_DescribeFeatureType.xml"],
      [Data.simpleQuery, "NGU_EGDI_GetFeature1.xml",,"0,1"],
      [Data.advancedQuery+" 1", "NGU_EGDI_GetFeature2.xml",,"0,1"],
      [Data.advancedQuery+" 2", "NGU_EGDI_GetFeature3.xml",,"0,1"]	  
    ]
  },
  "SGU: EGDI": {
   	title: (Data.isEng?"SGU: EGDI":"SGU: EGDI"),
    name: "SGU_EGDI",
    url: "http://resource.sgu.se/service/bedrock1m_gsml_gu/wfs",
    requests: [
	  ["GetCapabilities", "SGU_WFS-2-0-0_GetCapabilities.xml"],
      ["DescribeFeatureType", "SGU_WFS-2-0-0_DescribeFeatureType.xml"],
      [Data.simpleQuery, "SGU_EGDI_GetFeature1.xml",,"0,1"],
      [Data.advancedQuery+" 1", "SGU_EGDI_GetFeature2.xml",,"0,1"],
      [Data.advancedQuery+" 2", "SGU_EGDI_GetFeature3.xml",,"0,1"]	  
    ]
  },
  "GEUS: M4EU": {
   	title: (Data.isEng?"GEUS: M4EU":"GEUS: M4EU"),
    name: "GEUS_M4EU",
    url: "http://data.geus.dk/m4eu/services/m4eu",
    requests: [
	  ["GetCapabilities", "GEUS_WFS-2-0-0_GetCapabilities.xml"],
      ["DescribeFeatureType", "GEUS_WFS-2-0-0_DescribeFeatureType.xml"],
      [Data.simpleQuery, "GEUS_M4EU_GetFeature1.xml",,"0,1"],
      [Data.advancedQuery+" 1", "GEUS_M4EU_GetFeature2.xml",,"0,1"] 
    ]
  },
  "GEUS: MAP": {
   	title: (Data.isEng?"GEUS: MAP":"GEUS: MAP"),
    name: "GEUS_MAP",
    url: "http://data.geus.dk/geusmap/ows/25832.jsp",
    requests: [
	  ["GetCapabilities", "GEUS_GetCapabilities_110.xml"],
      ["DescribeFeatureType", "GEUS_MAP_DescribeFeatureType1.xml"],
      [Data.simpleQuery, "GEUS_MAP_GetFeature1.xml",,"0,1"],
      [Data.advancedQuery+" 1", "GEUS_MAP_GetFeature2.xml",,"0,1"],
      [Data.advancedQuery+" 1", "GEUS_MAP_GetFeature3.xml",,"0,1"] 	  
    ]
  },  
  "GTK: EGDI": {
   	title: (Data.isEng?"GTK: EGDI":"GTK: EGDI"),
    name: "GTK_EGDI",
    url: "http://gtkdata.gtk.fi:8081/geoserver/wfs",
    requests: [
	  ["GetCapabilities", "GTK_WFS-2-0-0_GetCapabilities.xml"],
      ["DescribeFeatureType", "GTK_WFS-2-0-0_DescribeFeatureType.xml"],
      [Data.simpleQuery, "GTK_EGDI_GetFeature1.xml",,"0,1"],
      [Data.advancedQuery+" 1", "GTK_EGDI_GetFeature2.xml",,"0,1"],
      [Data.advancedQuery+" 2", "GTK_EGDI_GetFeature3.xml",,"0,1"]  
    ]
  }
  
};

