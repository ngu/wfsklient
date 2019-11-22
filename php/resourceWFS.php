<?php
  $lang=urldecode((isset($_GET['lang']))?strtolower($_GET['lang']):'nor');

  function setTxt($key){
    global $lText, $lang;  
    echo $lText[$key][$lang];
  };
  function getTxt($key){
    global $lText, $lang;  
    return $lText[$key][$lang];
  };  
  function checkLanguage(&$lang){
	global $languages;
	for ($i=0;$i<count($languages);$i++){
      if ($languages[$i] == $lang){
		return;
	  }
	}
	$lang="nor";
  };
  
  function setFlag(){
    global $lang;
	$lang2 = ($lang=="nor"?"eng":"nor");
    echo "<img align=\"right\" title=\"" . getTxt("language_version") . "\" src=\"html/flag_$lang2.gif\" " .
	  "onclick=\"document.location='" . getTxt("url_par") . "'\" />";
  };
  
  function display($s){
	echo "<script>alert('" . $s . "');</script>";  
  };

  $languages = array("eng", "nor");
  $lText = array(
    "main_title" => array(
	  "nor" => "WFS-klient", 
      "eng" => "WFS Client"
	),
    "choose_service" => array(
	  "nor" => "&lt;Velg tjeneste&gt;", 
      "eng" => "&lt;Choose Service&gt;"
	),
    "request" => array(
	  "nor" => "Forespørsel", 
      "eng" => "Request"
	),
	"description" => array(
	  "nor" => "Beskrivelse", 
      "eng" => "Description"
	),
    "response" => array(
	  "nor" => "Respons", 
      "eng" => "Response"
	),
	"table" => array(
	  "nor" => "Tabell", 
      "eng" => "Table"
	),
	"map" => array(
	  "nor" => "Kart", 
      "eng" => "Map"
	),
	"user_defined" => array(
	  "nor" => "* Egendefinert: Last opp fil *", 
      "eng" => "* User defined: Upload file *"
	),
	"download" => array(
	  "nor" => "Lagre", 
      "eng" => "Save"
	),
	"lFile" => array(
	  "nor" => "", 
      "eng" => "_eng"
	),
	"language_version" => array(
	  "nor" => "English version", 
      "eng" => "Norsk versjon"
	),
	"url_par" => array(
	  "nor" => "?lang=eng", 
      "eng" => "."
	)
  );	
  
  checkLanguage($lang);   
  echo "<script>var lang='" . $lang . "';</script>\n";  
?>