davis=
{
random:function (x){return (Math.floor(Math.random()*x));},

bell: function (x)
    {
        var i=Math.round((davis.random(x)+davis.random(x)+davis.random(x))/3);
        return i;
    },

randomColor:function (x,full){
    if (x){ x=x.toLowerCase();}
    else{x=="none"}
    if (!full){var full=false;}

    var red=davis.random(255);
    var green=davis.random(255);
    var blue=davis.random(255);
    if (x=="grey" || x=="gray" || x=="fullgrey" || x=="fullgray"){
        blue=red;
        green=red;
        }
    if (x=='warm' || x=='hot'){
        red=200+davis.random(55);
        blue=davis.random(30);
    }
    if (x=='cool' || x=='cold'){
        blue=100+davis.random(155);
        red=davis.random(50);
    }
    if (x=="mammal" || x=="mammalian"){
        red=160+davis.random(85);
        green=red-40;
        blue=green/2;
    }
    var color="rgb("+red+","+green+","+blue+")";

    if (full==true){
        var text="#eee";
        var alpha0="rgba("+red+","+green+","+blue+",0)";
        var alpha1="rgba("+red+","+green+","+blue+",1)";
        if ((red+green+blue)>400){text="#111";}
        return {red:red,green:green,blue:blue,rgb:color,text:text,alpha0:alpha0,alpha1:alpha1};
        }
    else{
        return color;
        }   
    },

alpha:function(colorString,number){
    colorString=colorString.replace(/rgb/,"rgba");
    colorString=colorString.replace(/[)]/,(","+number+")"));
    return colorString;
},

randomWord:function(x){
    if (!x){x=1;}
    var vo=["a","e","i","o","u"];
    var con=["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","y","z"];
    var phrase=[];
    for (var j=0;j<x;j++){
        var word="";
        for (var i=0;i<(1+davis.random(3));i++){
            word+=davis.pick(con)+davis.pick(vo);
            }   
        if (davis.random(5)>2){
            word+=davis.pick(con);
            }
        phrase.push(word);
    }
    word=phrase.join(" ");
    return word;
},
    
pick: function (x)
    {return x[davis.random(x.length)];},

sumTo:function(x){
    if (!x){return false;}
    var y=[];
    while (x>0){
        var redux=1+davis.random(x);
        y.push(redux);
        x=x-redux;
    }
    return y;
    },

mutate:function(x,p){
    var p=p || 10;
    p=p*0.01*x;
    var x=x-(p)+davis.random(2*p);
    return x;
},

mutateColor:function(c,p){
    var c=c||davis.randomColor();
    var p=p||0.1;
    c=c.slice(4);
    c=c.split(",");
    var c=_.map(c,function(n){
        var n=parseInt(n);
        var nn=Math.round(davis.random(2*n*p)-(n*p));
        n=n+nn;
        n=Math.max(0,n);
        n=Math.min(n,255);
        return n;
    });
    return "rgb("+c.join(",")+")"; 
},

//this takes two arrays - one the source of new material, the other saved material from the past, and decides which to return an element from, then selects a random element from the ancestral or mutational array.
darwin:function(mutation,ancestry)
    {
    var anar=ancestry.length;
    var m=(9.9*anar*anar)/((anar*anar)+100);
    var d=1+this.random(2);
    if (m>d){ return this.pick(ancestry);}
    else{ return this.pick(mutation);}
    },

style:function(selector,values){
        if (!jQuery){return false};
        if ($("head style#dynamic").get().length==0){
            $("head").append("<style id='dynamic'></style>");
        }
        if (selector=="clear" || !selector){$("head style#dynamic").html("");}

        var s=selector+"{";
        for (i in values){
            s+=i+":"+values[i]+";";
        }
        s+="}";

        $("head style#dynamic").append(s);
    },

grid:function(xSteps,ySteps,bounds, opts){
    if (opts === undefined) {
        var opts = {
            margin: 0
        };
    }
    var margin = opts.margin || 0;
    var grid=[];
    var b=bounds;
    var xInterval=(bounds.right-bounds.left)/xSteps;
    var yInterval=(bounds.bottom-bounds.top)/ySteps;
    for (var i=0;i<xSteps;i++){
        grid.push([]);
        for (var j=0;j<ySteps;j++){
            var left=(b.left+(xInterval*i)) + margin;
            var top=(b.top+(yInterval*j)) + margin;
            var width=xInterval - (2 * margin);
            var height=yInterval - (2 * margin);
            grid[i].push(this.quickBox(left,top,width,height));
            }
        }

    return grid;
    },

gridLegend:function(grid,context){
    grid.legend=[];
    for (var i=0;i<grid.length;i++){
        for (var j=0;j<grid[i].length;j++){
            var locus=grid[i][j];
            var lll=context.text(locus.centerX,locus.centerY,(i+","+j))
                .attr({"font-size":30,"opacity":0});
            grid.legend.push(lll);
        }
    }

    grid.show=function(ms){
        var ms=ms || 30000;
        for (var i=0;i<this.legend.length;i++){
            this.legend[i].animate({"opacity":1},(ms/10));
        }
        setTimeout(function(){
            for (var i=0;i<grid.legend.length;i++){
                grid.legend[i].animate({"opacity":0},(ms/10));
            }
        },ms);
    };
    
    return grid;
},

quickBox:function(x,y,w,h){
    var box={};
    box.top=y;
    box.bottom=y+h;
    box.left=x;
    box.right=x+w;
    box.centerX=(box.right+box.left)/2;
    box.centerY=(box.bottom+box.top)/2;
    box.width=w;
    box.height=h;
    return box;
},

combox: function(box1, box2) {
    var width = Math.max(box1.right, box2.right) - Math.min(box1.left, box2.left);
    var height = Math.max(box1.bottom, box2.bottom) - Math.min(box1.top, box2.top);
    return davis.quickBox(
        Math.min(box1.left, box2.left),
        Math.min(box1.top, box2.top),
        width,
        height);
},

table:function(array,bounds,context,options){
    var options=options || {};
    var b=bounds;
    var table=array;
    var c=context;
    var t=[];

    var xStep=0;
    for (key in table[0]){xStep++;}
    var yStep=table.length+1;
    var grid=davis.grid(xStep,yStep,b);

    var x=0;
    for (var key in table[x]){
        c.text(grid[x][0].centerX,grid[x][0].centerY,key)
            .attr(options)
            .attr({"font-size":20});
        x++;
    }

    for (var i=1;i<(table.length+1);i++){
        var x=0;
        for (var key in table[i-1]){
            var item=c.text(grid[x][i].centerX,grid[x][i].centerY,table[i-1][key])
                .attr(options)
                .attr({"font-size":15})
                .data(key,table[i-1][key]);
            t.push(item);
            x++;
        }
    }
    return t;
},

maybe:function(n,d,f){
    var d=davis.random(d);
    if (d<n){
        f.call();
    }
    else{return false;}
},

license:function(x){
    var license="<h3 id='mitLicense' style='cursor:pointer;'>The MIT License (MIT)</h3>";
    license+="<div id='license' style='display:none;'>";
    license+="<p>Copyright (c) "+(new Date().getFullYear())+" Luke Davis</p>";
    license+="<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to DEALINGS in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>";
    license+="<p>The above copyright notice and this permission notice shall be included included all copies or substantial portions of the Software.</p>";
    license+="<p>THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>";
    license+="</div>";
    return license;
}

};

geo={};

geo.getPoint=function(x,y,r,theta){
    theta+=90;
    theta=theta*(Math.PI/180);
    var x2=x+(r*Math.sin(theta));
    var y2=y+(r*Math.cos(theta));
    var circle={x1:x,y1:y,r:r,x2:x2,y2:y2};
    return circle;
    };

geo.arcPath=function(x,y,r,theta1,theta2,w){
    var f1=0;
    var f2=0;
    var f3=0;
    var f4=1;
    if ((theta2-theta1)>180){
        f1=1;
        f3=1;
        }
    
    var arcPath="";
    arcPath+="M "+geo.getPoint(x,y,r,theta1).x2+" "+geo.getPoint(x,y,r,theta1).y2;
    arcPath+=" A "+r+" "+r+" "+(theta2-theta1)+" "+f1+" "+f2+" "+geo.getPoint(x,y,r,theta2).x2+" "+geo.getPoint(x,y,r,theta2).y2;
    arcPath+=" L "+geo.getPoint(x,y,(r-w),theta2).x2+" "+geo.getPoint(x,y,(r-w),theta2).y2;
    arcPath+=" A "+(r-w)+" "+(r-w)+" "+(theta2-theta1)+" "+f3+" "+f4+" "+geo.getPoint(x,y,(r-w),theta1).x2+" "+geo.getPoint(x,y,(r-w),theta1).y2;
    arcPath+=" Z";
    return arcPath;
    };

geo.ngon=function(x,y,r,n){
    if (!n){n=3};
    var path="";
    path+="M "+geo.getPoint(x,y,r,0).x2+" "+geo.getPoint(x,y,r,0).y2;
    for (var i=0;i<n;i++){
        var interval=360/n;
        var theta=interval*i;
        path+=" L"+geo.getPoint(x,y,r,theta).x2+" "+geo.getPoint(x,y,r,theta).y2;
        }   
    path+="Z";
    var ngon=model.paper.path(path).attr({"stroke":"#fff"});
    return ngon;
    };

geo.ngonPath=function(x,y,r,n){
    if (!n){n=6};
    var path="";
    path+="M "+geo.getPoint(x,y,r,90).x2+" "+geo.getPoint(x,y,r,90).y2;
    for (var i=0;i<n;i++){
        var interval=360/n;
        var theta= 90 + (interval*i);
        path+=" L"+geo.getPoint(x,y,r,theta).x2+" "+geo.getPoint(x,y,r,theta).y2;
        }   
    path+="Z";
    return path;
    };

geo.orbital=function(x,y,r,n,color){
    if (!x){x=model.bounds.right/2;}
    if (!y){y=model.bounds.bottom/2;}
    if (!r){r=model.bounds.bottom/3;}
    if (!n){n=1;}
    if (!color){color="#FFF";}
    var set=[];
    
    for (var i=0;i<n;i++){
        var theta1=_.random(180);
        var theta2=theta1+(18*_.random(1,20));
        var w=(0.1*r)*_.random(1,3);
    
        var arcPath=geo.arcPath(x,y,r,theta1,theta2,w);
        var circle=model.paper.path(arcPath)
            .attr({"fill":color,"fill-opacity":0.5})
        set.push(circle);
        }
    return set;
};
