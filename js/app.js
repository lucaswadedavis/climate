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

////////////////////////////////////////////////
////////////////////////////////////////////////

app.v.init=function(){
  app.v.css();
  app.v.layout();
  app.v.draw();
};

app.v.layout=function(){
  var d="";
  d+="<div id='canvas'></div>";
  $("body").html(d);
};

app.v.draw=function(){
  var c=new Raphael('canvas');
  var b=app.c.bounds();
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
      "border":"0"
    },
    "div":{
      "padding":"0",
      "margin":"0",
      "border":"0"
    },
    "div#canvas":{
     "width":"100%",
     "height":$(document).height()+"px"
    }
  };

  return css;
};
