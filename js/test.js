// Create the class
var myTestClass = Class.create({
  initialize: function(url)
  {
    // Is called when the page has finished loading by the Event.observe code below
    //alert('Works!');
    //alert('Works @ '+url);
    //alert('Works @ ' + this.toUppercase(url));
	//alert($('demoLink').getAttribute('href'));
	
	//This will show an alert box with http://www.dzone.com in it. Likewise you can set specific attributes easily:
	//$('demoLink').setAttribute('href', 'http://www.saschakimmel.com/');
    //alert($('demoLink').readAttribute('href'));
	
	//$$('#list li.highlight')[0].update('I was Item 2');
	$('list').down('li.highlight').update('I was Item 2');
	
	//$$('#list li').each(
	//  function(el) {
    //   el.update('<strong>'+el.innerHTML+'</strong>');
    //  }
	//);
	
	//$$('#list li').each(
	//  function(el) {
    //    var oldContent = el.innerHTML;
    //    var strongEl = new Element('strong');
    //    el.update('');
    //    el.appendChild(strongEl);
    //    strongEl.update(oldContent);
    //  }
	//);
	
	//$$('#list li').each(
	//  function(el) {
    //    el.update('<strong>'+this.toUppercase(el.innerHTML)+'</strong>');
    //  }.bind(this)
	//);
	
	//$('demoLink').observe('click', function() { alert('This link has been disabled!'); });
	//$('demoLink').observe('click', function(e) { alert('This link has been disabled!'); Event.stop(e); });
	//$('demoLink').observe('click', this.showDisabledMessage.bindAsEventListener(this));
	
/*	$('demoLink').observe(
	  'mouseover',
	  function(e){
	    Event.element(e).setStyle({
          'color': 'red',
          'fontSize':'30px'
        });
	  }
	);
	
    $('demoLink').observe(
      'mouseout',
	  function(e){
        Event.element(e).setStyle({
          'color': 'blue',
          'fontSize':'12px'
        });
	  }
	);*/
	$('demoLink').observe('click', this.loadContent.bindAsEventListener(this));
  },
  loadContent: function(e){
    Event.stop(e);
    new Ajax.Updater(
	  'container',
	  //'http://iversen-ws/myweb/WFS/ajax.html',
	  'ajax.html',
	  {
        onComplete:function() {
          $('container').show();
        }
      }
    );
  },
  toUppercase:function(str){
    return str.toUpperCase();
  },
  showDisabledMessage:function(e){
    Event.stop(e);
    alert('This link has been disabled!');
  }
});

// Global variable for the instance of the class
var myTest;

// Creating an instance of the class if the page has finished loading
Event.observe(
  window, 
  'load',
  //function(){myTest = new myTestClass();}
  function(){myTest = new myTestClass(location.href);}
);
