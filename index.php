<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<!--[if gt IE 11]>
  <meta http-equiv="X-UA-Compatible" content="IE=8" />
<![endif]-->
<!--[if lt IE 9]>
  <script src="js/excanvas.compiled.js"></script>
<![endif]-->
<?php include 'php/resourceWFS.php'?>
<title></title>
<link href="css/layout.css" rel="stylesheet" type="text/css"/>
<script src="js/model.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="js/modernizr.custom.64196.js"></script>
<!--[if lt IE 10]>
  <script type="text/javascript" src="js/augment.js"></script>
<![endif]-->
<script type="text/javascript" src="js/controller.js"></script>
<script src="js/wfsMap.compiled.js"></script>
<!-- "Lorem ipsum" text -->
<!-- script type="text/javascript" src="js/textgen.js"></script -->
<script>var s=document.location.href.split('?');document.title=s[0];</script>
</head>

<body>
<table class="tableMain0">
  <tr> 
    <!-- opacity:0.3;filter:alpha(opacity=30); -->
    <td width="100%">
    <div style="position:relative;width:100%;height:100%;">
      <div style="position:relative;top:5px;right:5px;z-index:2">
        <?php setFlag()?>
      </div>
      <div style="position:absolute;z-index:0;margin:0px;opacity:0.1;filter:alpha(opacity=10);"><img src="img/ndlogo1c.png"/></div>
        <div align="center" style="position:relative;z-index:1;"><span id="titleMain" class="title1"><?php setTxt("main_title")?></span> <br/>
          <br/>
          <select id="serviceSelect">
            <option><?php setTxt("choose_service")?></option>
            <option><?php setTxt("user_defined")?></option>
          </select>
          <br/>
        </div>
      </div>
    </div>
    </td>
  </tr>
  <tr>
    <td><hr/></td>
  </tr>
    <tr>
  
    <td>
  
  <div id="welcomePage" class="divOff">
    <div id="welcomeView" class="divOn"></div>
  </div>
    <div id="workingPage" class="divOff">
  
  <table class="tableMain">
    <tr>
      <td><div id="requestView" class="divOn"> <span id="titleRequest" class="title2"><?php setTxt("request")?>: </span>
          <select id="requestSelect">
          </select>
        </div>
        <div id="uploadView" class="divOff">
          <form class="form" name="frmFileUpload" method="post" enctype="multipart/form-data" target="upload_target" action="php/xmlUpload.php">
            <span id="titleRequest" class="title2"><?php setTxt("request")?>: </span>
            <input type="file" id="xmlFile" name="xmlFile" accept="text/xml" size="20" onChange="this.form.submit()"/>
            <input type="submit" name="btnSubmit" value="OK" />
            <div class="divOff"><!-- divOff -->
              <iframe id="upload_target" name="upload_target" src="html/blank.html" style="width:0;height:0;border:0px solid #fff;"></iframe>
            </div>
          </form>
        </div>
        <div id="requestModeView" class="divOff">
          <input id="requestMode_0" type="radio" name="requestMode" class="radio"/>
          <label for="requestMode_0">XML</label>
          <input id="requestMode_1" type="radio" name="requestMode" class="radio"/>
          <label for="requestMode_1"><?php setTxt("description")?></label>
        </div>
        <div id="requestView_0" name="requestView" class="divRequest divOn">
          <textarea id="request" class="textArea"></textarea>
        </div>
        <div id="requestView_1" name="requestView" class="divDescription divOff"></div></td>
    </tr>
    <tr>
      <td valign="top" align="center" class="title2"><span id="titleUrl" class="title2">Url: </span>
        <input id="serviceUrl" type="text" class="input"/>
        &nbsp;
        <input type="button" id="send" value="Send"/></td>
    </tr>
    <tr>
      <td valign="top"><span id="titleResponse" class="title2"><?php setTxt("response")?>: </span>
        <div id="resultModeView" class="divOff">
          <div id="resultModeDiv_0">
            <input id="resultMode_0" type="radio" name="resultMode" class="radio" selected/>
            <label for="resultMode_0">GML</label>
          </div>
          <div id="resultModeDiv_1">
            <input id="resultMode_1" type="radio" name="resultMode" class="radio"/>
            <label for="resultMode_1"><?php setTxt("table")?></label>
          </div>
          <div id="resultModeDiv_2">
            <input id="resultMode_2" type="radio" name="resultMode" class="radio"/>
            <label for="resultMode_2"><?php setTxt("map")?></label>
          </div>      
        </div>
        <div id="resultView" name="resultView" class="divResult divOn">
          <div id="resultView_0" name="resultView" class="divResult divOn">
            <textarea id="result" class="textArea2" readonly></textarea>
          </div>
          <div id="resultView_1" name="resultView" class="htmlResult divOff"></div>
          <div id="resultView_2" name="resultView" class="canvasResult divOff"></div>
          <div id="resultDownload" class="divOff">
            <button id="download" name="download" type="button"><?php setTxt("download")?></button>
            <div id="downloadExtra" class="divOff"></div>
          </div>
        </div>
      </td>
    
      </tr>
    
  </table>
    </div>
  
    </td>
  
    </tr>
  
</table>

<iframe name="Stat" src="/kart/common94/netstat.htm" height="0" width="0" scrolling="no" frameborder="0" MARGINWIDTH="0" MARGINHEIGHT="0" FRAMESPACING="0" BORDER="0" NORESIZE></iframe>
<!- Client based XSLT 2.0 -->
<script>
if (Data.useXSLTClient)document.write('<script type="text\/javascript" language="javascript" src="js\/Saxonce\/Saxonce.nocache.js"><\/script>');
</script>
</body>
</html>