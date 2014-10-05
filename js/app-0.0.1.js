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

app.m.app_name="X2";

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
  app.v.CSS();
  app.v.LAYOUT();
  app.v.DRAW();
};

app.v.LAYOUT=function(){
  var d="";
  d+="<div id='canvas'></div>";
  $("body").html(d);
};

app.v.DRAW=function(){
  var c=new Raphael('canvas');
  var b=app.c.bounds();

  var internal=function(x,y,grid){
    var b=true;
    var max_x=grid[x].length-2;
    var max_y=grid.length-2;

    if (x<2 || x>max_x || y<2 || y>max_y){
      b=false;
    }
    return b;
  };

  var live=function(x,y,grid){
    var b=false;
    var count=0;

    if (grid[y-1][x-1].data("live") ){count++;}
    if (grid[y-1][x].data("live") ){count++;}
    if (grid[y-1][x+1].data("live") ){count++;}
    if (grid[y][x-1].data("live") ){count++;}
    if (grid[y][x+1].data("live") ){count++;}
    if (grid[y+1][x-1].data("live") ){count++;}
    if (grid[y+1][x].data("live") ){count++;}
    if (grid[y+1][x+1].data("live") ){count++;}

    if (count>2 && count<5){
      b=true;
    }
    return b;
  };

  var increment=function(g,next_grid){
    var grid=g;
    for (var i=0;i<g.length;i++){
      for (var j=0;j<g[i].length;j++){
        if (internal(j,i,grid) ){
          if (live(j,i,grid) ){
            next_grid[i][j]=true;
            //grid[i][j].data("live",true);
            //grid[i][j].attr({"fill":"#111"});
          }
          else{
            next_grid[i][j]=false;
            //grid[i][j].data("live",false);
            //grid[i][j].attr({"fill":"#fff"});
          }
        }
        else{
          next_grid[i][j]=false;
          //grid[i][j].data("live",false);
          //grid[i][j].attr({"fill":"#fff"});
        }
      };
    };


    for (var i=0;i<g.length;i++){
      for (var j=0;j<g[i].length;j++){
        if (next_grid[i][j]){
          grid[i][j].data("live",true);
          grid[i][j].attr({"fill":"#111"});
        }
        else{
          grid[i][j].data("live",false);
          grid[i][j].attr({"fill":"#fff"});
        }
        next_grid[i][j]=false;
      };
    };

  };

  var grid=[];
  var next_grid=[];
  var circle_radius=20;
  var max_rows=Math.floor(b.bottom/circle_radius);
  var max_columns=Math.floor(b.right/circle_radius);
  
  for (var i=0;i<35;i++){
    var row=[];
    var next_row=[];
    var y=i*2*circle_radius;
    for (var j=0;j<35;j++){
      var x=j*2*circle_radius;
      var cell=c.circle(x,y,circle_radius)
        .attr({"cursor":"pointer","fill":"#fff"});
      cell.data("live",false);
      cell.click(function(){
        if (this.data("live")){
          this.data("live",false);
          this.animate({"fill":"#fff"},100);
        }
        else{
          this.data("live",true);
          this.attr({"fill":"#111"});
        }
      });
      row.push(cell);
      next_row.push(false);
    }
    next_grid.push(next_row);
    grid.push(row);
  };
  
  var increment_button=c.circle(60,b.bottom-60,50)
    .attr({"fill":"#dfe","opacity":0.8,"cursor":"pointer"})
    .click(function(){
      increment(grid,next_grid);
    });

};

////////////////////////////////////////////////
////////////////////////////////////////////////

app.v.CSS=function(){
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