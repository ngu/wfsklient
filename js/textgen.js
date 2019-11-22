/* 
This script and many more are available free online at
The JavaScript Source :: http://javascript.internet.com
Created by: Will Munslow :: http://subterrane.com
Modified by: Sverre Iversen and Rune Nordvik
*/

/*
Filnavn:
 textgen.js

Programmerere:
 Sverre Iversen og Rune Nordvik

Objekter:
  textgen: Genererer tekst i fem ulike språk organisert i avsnitt.
   
Egenskaper og metoder:
  textgen.getSillyText(aN): genererer tekst i avsnitt med ulikt språk
  textgen.objectTag=function(lang,mode,n): genererer tekst i angitt språk
*/

textgen=new Object();

//textgen.getSillyText(aN): genererer tekst i avsnitt med ulikt språk
//Parameter aN (mixed): tall eller tabell med numre som angir avsnittslengde i antall ord 
//Retur (string): htmlstreng med generert tekst
textgen.getSillyText=function(aN){
  aN=(typeof aN=="number"?[aN]:aN);
  aResult=[];
  n=Math.floor(Math.random()*5);
  aLang=["latin","silly","spanish","italian","portuguese"];
  for (i=0;i<aN.length;i++){
    aResult[i]=this.objectTag(aLang[(i+n)%5],"words",aN[i]);
  }
  return aResult.join('<br/><br/>');
}

//textgen.objectTag=function(lang,mode,n): genererer tekst i angitt språk
//Parameter lang (string): språk
//Parameter mode (string): modus: "words" eller "characters"
//Parameter n (number): tall som angir avsnittslengde i antall tegn eller ord
//Retur (string): tekststreng i angitt språk
textgen.objectTag=function(lang,mode,n) {
  var lorem = new Array();
  var sOutput;
  switch(lang) {
    case "latin": {
  				lorem[0] = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.";
      break;
    }
  		case "silly": {
  				lorem[0] = "Epsum factorial non deposit quid pro quo hic escorol. Olypian quarrels et gorilla congolium sic ad nauseum. Souvlaki ignitus carborundum e pluribus unum. Defacto lingo est igpay atinlay. Marquee selectus non provisio incongruous feline nolo contendre. Gratuitous octopus niacin, sodium glutimate. Quote meon an estimate et non interruptus stadium. Sic tempus fugit esperanto hiccup estrogen. Glorious baklava ex librus hup hey ad infinitum. Non sequitur condominium facile et geranium incognito. Epsum factorial non deposit quid pro quo hic escorol. Marquee selectus non provisio incongruous feline nolo contendre Olypian quarrels et gorilla congolium sic ad nauseum. Souvlaki ignitus carborundum e pluribus unum.";
   			break;
  		}
  		case "spanish": {
   			lorem[0] = "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc., li tot Europa usa li sam vocabularium. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilit? de un nov lingua franca: on refusa continuar payar custosi traductores. It solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles.";
   			break;
  		}
  		case "italian": {
   			lorem[0] = "Ma quande lingues coalesce, li grammatica del resultant lingue es plu simplic e regulari quam ti del coalescent lingues. Li nov lingua franca va esser plu simplic e regulari quam li existent Europan lingues. It va esser tam simplic quam Occidental: in fact, it va esser Occidental. A un Angleso it va semblar un simplificat Angles, quam un skeptic Cambridge amico dit me que Occidental es.";
   			break;
  		}
  		case "portuguese": {
   			lorem[0] = "O conteúdo mostra um exemplo de texto sem significado para o nosso projeto. Estas frases de palavras sem sentido que só deverá preencher esta página. A razão para isto é a gota e adicionar esta auto-contido e bastante foco na programação e concepção da tarefa. Esperamos que este texto parece provocativo para os utilizadores desta solução. Queremos que esta a promover o idioma Português.";
   			break;
  		}
 	}

  if ("characters" == mode) {
    var outputString = '';
    var numOfChars = n;
    numOfChars = parseInt( numOfChars );
    var tempString = lorem.join( "\n\n" );
    while (
      outputString.length < numOfChars ) outputString += tempString;
      sOutput = outputString.substring(0, numOfChars ); // changed
    } else if("words" == mode) {
      var numOfWords = n;
      numOfWords = parseInt( numOfWords );
      var list = new Array();
      var wordList = new Array();
      wordList = lorem[0].split( ' ' );
      var iParagraphCount = 0;
      var iWordCount = 0;

      while( list.length < numOfWords ) {
      	 if( iWordCount > wordList.length ) {
        		iWordCount = 0;
        		iParagraphCount++;
      		  if( iParagraphCount + 1 > lorem.length ) iParagraphCount = 0;
        		wordList = lorem[ iParagraphCount ].split( ' ' );
        		wordList[0] = "\n\n" + wordList[ 0 ];
      	 }
       	list.push( wordList[ iWordCount ] );
       	iWordCount++;
      }
    sOutput = list.join(' '); // changed
  } else {
    var numOfParagraphs = n;
    numOfParagraphs = parseInt( numOfParagraphs );
    var list = new Array();
 			var iParagraphCount = 0;

    while(list.length < numOfParagraphs) {
      if(iParagraphCount +1 > lorem.length) {
        iParagraphCount = 0;
      }
      list.push( lorem[iParagraphCount] );
        iParagraphCount++;
    }
    sOutput = list.join( "\n\n" ); // changed
  }
  return sOutput;
}
