//svg js
//var newDiv= new svgDiv('abc');
var svgIndex = 0;
function divAndSvg(id, params) {
    var changes = {
        "pad_x": 80,
        "pad_y": 80,
        "size_x": 300,
        "size_y": 400,
        "min_x": 0,
        "min_y": 0,
        "width": 600,
        "height": 600,
        "begin_0": 0,
        "begin_1": 0,
        "end_0": 0,
        "end_1": 0,
        "start_point": false 
    };
    console.log(dataTest);
    for (k in params) {
        changes[k] = params[k]
    }
    var string = "";
    string += '<div id="' + id + '" class="container"';
    string += dataFields(changes);
    string += '><svg width="" height=""><path class=pointer d="" stroke="red" stroke-width="5" fill="none"/></svg></div>';
    var el = document.getElementById("full")
    var y = document.createElement("div");
    //y.id=id;
    //y.style.class="container";
    y.innerHTML = string;
    //console.log('c',string);
    //var content = document.createTextNode(string);
    //console.log(content);
    el.appendChild(y.firstChild);
    //console.log(y.firstChild);
    //el.innerHTML+=string;
    var x = document.getElementById(id);
    setTimeout(function(){
    allParents(x,x,0,0)    
    },500);
    
    //console.log('x', x)
    var n = svgIndex;
    x.addEventListener('click', function() {
        getMousePosition(n)
    }, false);
    x.addEventListener("mousemove", function(eventa) {
        move(n)
    }, false);

    svgIndex++;
}
function applyViewBox(self, viewBox) {
    var divData = self.dataset;
    console.log(divData);
    divData['min_x'] = viewBox['min_x'] + "";
    divData.min_y = viewBox['min_y'] + "";
    divData.width = viewBox['width'] + "";
    divData['height'] = viewBox['height'] + "";
    console.log(self);
    return self;
    //console.log(viewBox);
    //console.log('viewBox test',self)
}
function dataFields(json) {
    var string = ""
    for ( k in json) {
        string += ' data-' + k + '="' + json[k] + '"';
    }
    return string;
}
var dataTest = {
    "pad_x": 80,
    "pad_y": 80,
    "size_x": 300,
    "size_y": 400,
    "min_x": 0,
    "min_y": 0,
    "width": 600,
    "height": 600,
    "begin_0": 0,
    "begin_1": 0,
    "end_0": 0,
    "end_1": 0,
    "start_point": false

}
/*
            var settings={
                svgSize:{
                    x:700,
                    y:300
                },
                svgPadding:{
                    x:80,
                    y:80
                },
                viewBox:{
                    min_x:0,
                    min_y:0,
                    width:1500,
                    height:3000
                },
                pos:{
                    begin:[0,0],
                    end:[0,0],
                    startPoint:false
                }   
            }
            */
function applyToSvg(self) {
    //var div = document.getElementById(id);
    //console.log('a', self)
    var divData = self.dataset;
    var svg = self.getElementsByTagName('svg')[0];
    //svg=svg[0];
    //console.log(svg);
    var viewPos = Number(divData.min_x) + ' ' + Number(divData.min_y) + ' ' + Number(divData.width) + ' ' + Number(divData.height);
    console.log('view', viewPos);
    console.log(divData["size_x"]);
    self.style.width = divData["size_x"] + "px";
    self.style.height = divData["size_y"] + "px";
    self.style.top = divData.pad_y + "px";
    self.style.left = divData.pad_x + "px";
    svg.setAttribute("width", divData["size_x"] + 'px');
    svg.setAttribute("height", divData["size_y"] + "px");
    svg.setAttribute("viewBox", viewPos);

}
function svgByDivId(id) {
    var el = document.getElementById(id)
    return el.getElementsByTagName('svg')[0];
}
function init() {
    var names=['t_1.txt','t_2.txt','t_3.txt','t_4.txt']
    //names.forEach(function(a){
    //    div(a);     
    //})
    
    
    divAndSvg('abc', {
        min_x: - 100,
        min_y: 10000,
        size_x: 300,
        size_y: 300,
        width: 1000,
        height: 2000,
        pad_y: 0
    });
    var svg = document.getElementById('abc');
    //console.log('svg',svg);
    applyToSvg(svg);
    prepare(svg);
    uploadPath('1.txt', 'abc', {
        stroke: 'green',
        "fill-opacity":"0.4",
        fill: 'none'
    })
    /*
    uploadPath(names[2], 'abc', {
        stroke: 'blue',
        "fill-opacity":"0.4",
        fill: 'none'
    })
    uploadPath(names[1], 'abc', {
        stroke: 'red',
        "fill-opacity":"0.4",
        fill: 'none'
    })
    */
}
    
    function div(fileName){
          divAndSvg(fileName, {
        min_x: - 100,
        min_y: 10000,
        size_x: 1000,
        size_y: 150,
        width: 1000,
        height: 2000,
        pad_y: 0
    });
    var svg = document.getElementById(fileName);
    //console.log('svg',svg);
    applyToSvg(svg);
    prepare(svg);
    uploadPath(fileName, fileName, {
        stroke: 'green',
        fill: 'none'
    })  
        
    }
    
    //uploadPath('1_test.txt','abc',{stroke:'purple',fill:'none'})
    //  uploadPath('1_test1.txt','abc',{stroke:'orange',fill:'none'})
    //    uploadPath('test.txt','abc',{stroke:'blue',fill:'none'})

    //addElementToSvg(svg, prepareSpriral())



    /*
                    divAndSvg('abc',{"pos-x":1,"pos-y":2});
                    console.log(svgByDivId('abc'));
                    applyToSvg('abc');
                    //var x=posInSvgScale();
                    //changePath();
                    */

function test() {
    divAndSvg('abcd', {
        min_x: - 100,
        min_y: 10000,
        size_x: 1000,
        size_y: 300,
        width: 10000,
        height: 2000
    });
    var svg = document.getElementById('abcd')
    console.log('svg', svg);
    applyToSvg(svg);
    prepare(svg);
    //uploadPath('1.txt','abc',{stroke:'green',fill:'none'})
    //uploadPath('1_test.txt','abc',{stroke:'purple',fill:'none'})
    //uploadPath('1_test1.txt','abc',{stroke:'orange',fill:'none'})
    //uploadPath('test.txt','abc',{stroke:'blue',fill:'none'})
    /*
                    divAndSvg('abcd',{min_y:1000,size_x:700,width:10000,pad_x:900});
                    var svg=document.getElementById('abcd');
                    applyToSvg(svg);
                    prepare(svg);
                        uploadPath('1.txt','abcd',{stroke:'green',fill:'none'})
                        uploadPath('1_average.txt','abcd',{stroke:'purple',fill:'none'})
                        uploadPath('1_detected.txt','abcd',{stroke:'black',fill:'none'})
                        //console.log(document.getElementById('full').getElementsByTagName('div'));
                        */

}
function uploadPath(txtFile, id, style) {
    sendObj1('data', {
        mode: 'data',
        name: txtFile
    }, function(obj) {
        //console.log(obj);
        //changePath('line2',obj['data']);
        var el = document.getElementById(id)
        //console.log(obj.viewBox);
        var x = applyViewBox(el, obj.viewBox);
        console.log('x', x);
        el = document.getElementById(id);
        console.log(el);
        //(el)
        //applyToSvg(el);
        prepare(el);
        createPath(svgByDivId(id), obj.path, style);
    });

}
function createPath(svg, path, style) {
    console.log('b', svg);
    //var svg=self.getElementsByTagName('svg')[0];
    var setstring = "";
    for (k in style) {
        setstring += k + '="' + style[k] + '" ';
    }
    svg.innerHTML += '<path d="' + path + '" ' + setstring + '/>';
    //console.log('<path id="'+id+'" d="'+path+'" '+setstring+'/>');
    //return '<path id="'+id+'" d="'+path+'" '+setstring+'/>';
}
function changePath(self, path) {
    // console.log('path',self)
    self.getElementsByClassName('pointer')[0].setAttribute("d", path);
    // console.log(x);
}
function posInSvgScale(self) {
    //var rect = self.getBoundingClientRect();
    //console.log('main',document.getElementById('mainContent').offsetTop);
     //console.log('main',allParents(self,self,0,0));
    //console.log(rect.top, rect.right)
    var x = event.clientX 
    var y = event.clientY 
    console.log(x,y);
    var params = self.dataset;
    var xPos = (x - params.pad_x) * params.width / params.size_x + 1 * params.min_x;
    var yPos = (y - params.pad_y) * params.height / params.size_y + 1 * params.min_y;
    //console.log(x,xPos);
    //console.log(y,yPos);
    return [xPos, yPos];
}
function allParents(el,self,xx,yy){
    
    if(el.parentElement){
        var x = el.parentElement.offsetTop;
        var y = el.parentElement.offsetLeft;
        //console.log(el.parentElement);
        //console.log('is')
        allParents(el.parentElement,self,xx+x,yy+y)
    }
    else{
        var divData = self.dataset;
        divData.pad_y =yy/2;
        divData.pad_x =xx/2-20;
    //self.style.left = divData.pad_x + "px";
        //console.log(xx,yy)
        //return [xx,yy];
    }
}


function getMousePosition(n) {
    var self = document.getElementById('full').getElementsByTagName('div')[n];
    //console.log('pos',self);
    var is = posInSvgScale(self);
    addPos(self, is[0], is[1]);
    var svgEl = point(is[0], is[1]);
    addElementToSvg(self, svgEl);

}
function point(cx, cy) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="1" stroke="black" stroke-width="1" fill="red" />';
}
function move(n) {
    //console.log(self);
    var self = document.getElementById('full').getElementsByTagName('div')[n];
    console.log(n);
    var x = posInSvgScale(self);
    console.log(x);
    var pos = self.dataset;
    if (pos.start_point == "true") {
        var points = "M" + pos.begin_0 + " " + pos.begin_1;
        points += " H" + x[0] + " V" + x[1] + " H" + pos.begin_0 + " Z";
        //console.log(points);
        changePath(self, points);
    }

    //console.log("im here");
}
function addPos(self, posX, posY) {
    //var element=document.getElementById("svgContainer");
    var pos = self.dataset;
    //var x= self.getElementsByTagName('svg')[0];
    if (pos.start_point == "false") {
        pos.begin_0 = posX;
        pos.begin_1 = posY;
        pos.start_point = "true";
    } else {
        pos.end_0 = posX;
        pos.end_1 = posY;
        pos.start_point = "false";
        rescaleViewbox(self);
        grids(self);
        pos.end_0 = "0";
        pos.end_1 = "0";
        pos.begin_0 = "0";
        pos.begin_1 = "0";
        //pos.start_point="false";
    }
}
function deleteGrids(svg) {
    var lowerLev = svg.getElementsByTagName('svg')[0]
    var elements = lowerLev.getElementsByClassName('grid');
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
function grids(svg) {
    deleteGrids(svg);
    var viewBox = svg.dataset;
    var points_x = [],
    points_y = [],
    all = [],
    steps = 10;
    var location_x = viewBox.min_x * 1;
    var location_y = viewBox.min_y * 1;
    console.log(location_x, location_y)
    for (var i = 0; i <= 10; i++) {
        //console.log(points_x[0]);
        points_x[i] = [[location_x, i / steps * viewBox.height * 1 + 5 + viewBox.min_y * 1], [location_x + 5, i / 10 * viewBox.height + 5 * 1 + viewBox.min_y * 1]];
        //points_x[i][0]=location_x;
    }
    for (var i = 0; i <= 10; i++) {
        points_y[i] = [[i / 10 * viewBox.width * 1 + viewBox.min_x * 1 + 5, location_y], [i / 10 * viewBox.width * 1 + viewBox.min_x * 1 + 5, location_y + 5]];
        //points_y[i][1]=location_y;
    }
    //console.log(points_x,points_y);
    var line = [];
    var zeroPos = [location_x + 5, location_y + 5];
    line[0] = [zeroPos, [location_x + 5, viewBox.height * 1 + viewBox.min_y * 1]],
    line[1] = [zeroPos, [viewBox.width * 1 + viewBox.min_x * 1, location_y + 5]];
    //console.log(line_x,line_y);
    all = all.concat(points_x);
    all = all.concat(points_y);
    all = all.concat(line);
    //all=all.concat(line_y);
    addElementToSvg(svg, makeLines(all));
}
//makeLines(x);

function makeLines(tab) {
    var string = ""
    var actual = []
    for (var i = 0; i < tab.length; i++) {
        actual = tab[i];
        //console.log(actual);
        string += '<line x1="' + actual[0][0] + '" y1="' + actual[0][1] + '" x2="' + actual[1][0] + '" y2="' + actual[1][1] + '" stroke-width="1" class="grid" stroke="black"/>'

    }
    return string;
    //console.log(string);
    //svar x = <line x1="20" y1="100" x2="100" y2="100" stroke-width="1" stroke="black"/>
}
function rescaleViewbox(self) {
    var pos = self.dataset;
    console.log('some tst', pos);
    var min_x = Math.min(pos["begin_0"], pos["end_0"]);
    var min_y = Math.min(pos["end_1"], pos["begin_1"]);
    var width = Math.abs(pos["end_0"] - pos["begin_0"]);
    var height = Math.abs(pos["end_1"] - pos["begin_1"]);
    var diff;
    //var set=settings.svgSize;
    if (Number(pos['size_x']) - width < Number(pos['size_y']) - height * 1) {
        diff = width * Number(pos['size_y']) / Number(pos['size_x']) - height * 1;
        min_y -= diff / 2;
        height += diff * 1;
    } else {
        diff = height * Number(pos['size_x']) / Number(pos['size_y']) - width * 1;
        min_x -= diff / 2;
        width += diff * 1;
    }
    console.log(pos['size_x'], pos['size_x'], width, height);
    pos['min_x'] = min_x + "";
    pos['min_y'] = min_y + "";
    pos.width = width;
    pos.height = height + "";
    applyToSvg(self);
}
function prepare(self) {
    var pos = self.dataset;
    var min_x = pos.min_x;
    var min_y = pos.min_y;
    var width = pos.width * 1;
    var height = pos.height * 1;
    var diff;
    //var set=settings.svgSize;
    if (Number(pos['size_x']) - width < Number(pos['size_y']) - height) {
        diff = width * Number(pos['size_y']) / Number(pos['size_x']) - height;
        min_y -= diff / 2;
        height += diff;
    } else {
        diff = height * Number(pos['size_x']) / Number(pos['size_y']) - width;
        min_x -= diff / 2;
        width += diff;
    }
    //console.log(pos['size_x'],pos['sizeX'],width,height);
    pos['min_x'] = min_x + "";
    pos['min_y'] = min_y + "";
    pos.width = width + "";
    pos.height = height + "";
    grids(self);
    applyToSvg(self);
}
function addElementToSvg(elem, whatToAdd) {
    //console.log(whatToAdd);
    elem.getElementsByTagName('svg')[0].innerHTML += whatToAdd;
    //var elem=document.getElementById("svg");
    //elem          
}
function sendObj1(url, json_obj, callback) {
    var http = new XMLHttpRequest();
    //var url = "get_data";
    var string_obj = JSON.stringify(json_obj);
    // console.log(string_obj);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function() {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            //console.log('resText',http.responseText);
            var res = JSON.parse(http.responseText);
            //console.log(res);
            //console.log('resText',res);
            callback(res);
        } else {
            console.log(http.status);
        }
    }
    http.send(string_obj);
}

