$(document).ready(function(){
  app.c.init();
});

////////////////////////////////////////////////
////////////////////////////////////////////////

var app={};
app.m={};
app.v={};
app.c={};

////////////////////////////////////////////////
////////////////////////////////////////////////

app.m.app_name="Climate";

app.m.variables = [
  //{id:'planetRadius', name:'Planetary Radius', min:1737, max:24622}, /* in km */
  //{id:'planetDensity', name: 'Planetary Density', min:2.328, max:11.34},
  {id:'meanSurfacePressure', name: 'Mean Atmospheric Surface Pressure', min:0, max:9200000, units: 'Pa'},
  //{id: 'molecularMassOfAir', name: 'Molecular Mass of Air', min:0, max:100}, /* in kg per mol */
  {id:'solarInput', name: 'Solar Input', min:0, max:9126, units: 'Watts per Square Meter'} 
];


////////////////////////////////////////////////
////////////////////////////////////////////////

app.c.init=function(){
  app.v.init();
};

app.c.get_point=function(x,y,r,theta){
  theta+=90; 
  theta=theta*(Math.PI/180); 
  var x2=x+(r*Math.sin(theta)); 
  var y2=y+(r*Math.cos(theta)); 
  var circle={x:x2,y:y2}; 
  return circle; 
};

app.c.bounds=function(){
  var b={};
  b.right=$(document).width();
  b.left=0;
  b.top=0;
  b.bottom=$(document).height();
  b.centerX=b.right/2;
  b.centerY=b.bottom/2;

  return b;
}

app.c.calculateMeanSurfaceTemperature = function(solarInput, meanSurfacePressure) {
  var nte = Math.exp(
    (0.233001 * Math.pow(meanSurfacePressure, 0.0651203)) + (0.0015393 * Math.pow(meanSurfacePressure, 0.385232))
    );

  return 25.3966 * Math.pow((solarInput + 0.0001325), 0.25) * nte;
}

////////////////////////////////////////////////
////////////////////////////////////////////////

app.v.init=function(){
  app.v.css();
  app.v.layout();
  app.v.draw();
};

app.v.layout=function(){
  var d="";
  d+="<div id='canvas'></div><div id='controls'></div>";
  $("body").html(d);
};

app.v.sliders = function(bounds, context) {
  var d = '';
  
  d += '<h3>Average Surface Temperature <span id="mean-surface-temperature"></span></h3>';

  for (var i = 0; i < app.m.variables.length; i++) {
    d += '<h3>' + app.m.variables[i].name + ': <span id="' + app.m.variables[i].id + '"></span></h3>';
    d += '<div id="' + app.m.variables[i].id + '"></div>';
  }

  $('#controls').html(d);

  _.each(app.m.variables, function(x) {
    $('div#' + x.id).slider({
      value: x.min,
      min: x.min, 
      max: x.max,
      slide: function(event, ui) {
        $('span#' + x.id).text(ui.value + ' ' + x.units);
        app.m[x.id] = ui.value;
        var meanSurfaceTemperature = app.c.calculateMeanSurfaceTemperature(app.m.solarInput, app.m.meanSurfacePressure);
        tempF = ((meanSurfaceTemperature * 9) / 5) -459.67;
        if (!_.isNaN(meanSurfaceTemperature)) {
          $('span#mean-surface-temperature').text(Math.floor(tempF) + ' degrees F');
        }
      }
    });
  });
};


app.v.draw=function(){
  var c = new Raphael('canvas');
  var b = app.c.bounds();
  var planetRadius = Math.min(b.centerX, b.centerY)/2;
  var planet = c.circle(b.centerX, b.centerY, planetRadius)
    .attr({stroke:'#fff', 'fill-opacity': 0});
  var b = app.c.bounds();
  app.v.sliders(b, c);
};

////////////////////////////////////////////////
////////////////////////////////////////////////

app.v.css=function(){
  if ($("head style#synthetic").length<1){
    $("head").append("<style type='text/css' id='synthetic'></style>");
  }
  
  $("style#synthetic").html(app.v.css_transform(app.v.css_config() ) );

};

app.v.css_transform=function(x){
  var css="";

  for (var tag in x){
    css+=" "+tag+"{ ";
    for (property in x[tag]){
      css+=" "+property+": "+x[tag][property]+"; ";
    }
    css+=" } ";
  }
  return css;
};

app.v.css_config=function(){
  var css={
    "body":{
      "padding":"0",
      "margin":"0",
      "border":"0",
      "background": "#333"
    },
    "div":{
      "padding":"0",
      "margin":"0",
      "border":"0"
    },
    "div#canvas":{
     "width":"100%",
     "height":$(document).height()+"px"
    },
    "div#controls":{
      'z-index':20,
      'position':'absolute',
      'top':'10px',
      'left':'10px',
      'width':'500px'
    },
    'div#controls h3':{
      'color':'#fff',
      'margin-left':'20px'
    },
    'div#controls div':{
      'margin':'20px'
    }
  };

  return css;
};
