<?php
$name = $_FILES['xmlFile']['name'];
$ext = substr($name, strlen($name)-4);
$file = $_FILES['xmlFile']['tmp_name'];
//header("Content-type: text/html; charset=utf-8");
if ($ext==".xml"){
  $content = file_get_contents($file, true);
  $content = preg_replace("/<[\?](.*)[\?]>\s+/","",$content);
  //Encode all tags
  $content = preg_replace("/</","_(_",$content);
  $content = preg_replace("/>/","_)_",$content);
} else {
  $content = "<error>Not an XML file</error>";
}
echo $content;
?>