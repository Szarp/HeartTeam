var readline=require('readline')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname+'/data/10s_hr.txt')
});
var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('/Users/bartek/gitrepo/substitutions/myModules/userSession.js'),
    cookieParser = require('cookie-parser'),
    fs = require('fs'),
    svg = require('/Users/bartek/gitrepo/substitutions/myModules/svgCreator');
var app = express();
//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // for parsing
app.use(cookieParser());
var cookie = new session.sessionCreator();
var fileList = {};
var sessionList = [];
const testFolder = '/Users/bartek/gitrepo/HeartTeam/charts/data/';
fs.readdir(testFolder, function(err, files){
    fileList=files;
 
});
    app.use(function (req, res, next) {
    //check if client sent cookie
    var cookie = req.cookies.cookieName;
    if (cookie === undefined){
        // no: set a new cookie
        var randomNumber=Math.random().toString();
        randomNumber=randomNumber.substring(2,randomNumber.length);
        res.cookie('cookieName',randomNumber, { maxAge: 1000*60*120, httpOnly: false });
        console.log('cookie created successfully');
    } 
    else{
    // yes, cookie was already present 
        console.log('cookie exists', cookie);
    } 
    next(); // <-- important!
});

app.get('/index', function (req, res) {
    res.sendFile( __dirname + '/svgTest.htm');
    
});
app.post('/data',function(req,res){
     var reqCookie=req.cookies.cookieName;
    //var userId=cookie.findIfSessionExist(reqCookie);
    //console.log('user session: ',userId);
    //console.log('seesionList: ',sessionList);
    //console.log('Mode: '+req.body['mode']);
    //console.log('user session: ',userId);
        if(req.body['mode']=='data'){
            console.log(req.body.name);
            var pointer=0;
            for(var i=0;i<fileList.length;i++){
                if(req.body.name==fileList[i]) 
                pointer=1;
            }
            if(pointer==1){
                svg.svgToSend(req.body['name'],function(path){
                        console.log(path);
                
                        res.send(path);
                });
            }
            else{res.send('err');}
            
        }
        if(req.body['mode']=='folder'){
            res.send({data:fileList});
        }
});
var index=0;
var last=0;
var dPath="";
app.get('/test',function(req,res){
    ///*


        
   //*/
    /*
    readAndRewrite('1.txt',function(tab){
        var i=2;
        var last;
        do{
            //last=
            tab[i]=tab[i]*0.01+tab[i-1]*0.99;
            tab[i-2]=Math.floor(tab[i-2]);
            i++;
        }while(i<tab.length);
        //saveTable('1_average.txt',tab,function(){ })
    })
    */
    cleanPath('1.txt','1_test1.txt',function(clearData){})
    //cleanPath('2.txt','2_test1.txt',function(clearData){})
    //cleanPath('3.txt','3_test1.txt',function(clearData){})
    //cleanPath('outputHR.txt','outputHR_test1.txt',function(clearData){})

   
    

    
    /*
    readAndRewrite('1_test2.txt',function(tab){
        var i=0;
        var begIndex=0;
        var buff;
        var tabPointer=0;
        var saved=[];
        do{
            //begIndex=i;
            if(tab[i]>0){
                saved[tabPointer]=[i,0];
                //console.log(begIndex);
                do{
                    i++;
                }while(tab[i] != 0)
                    //console.log(i-saved[tabPointer][0]);
                if(i-saved[tabPointer][0]>1){
                    saved[tabPointer][1]=i-1;  
                    tabPointer++;
                }
            }
           
            //tab[i]=tab[i]/2+tab[i+1]/2;
            //i=begIndex;
            i++;
        }while(i+1<tab.length);
        console.log(saved);
        var points;
        var diff;
        var actual;
        for(i=0;i<saved.length;i++){
            actual=saved[i];
            diff=tab[actual[0]]-tab[actual[1]];
            points=actual[1]-actual[0];
            console.log(points*diff);
        }
        //console.log(i);
        //saveTable('test.txt',tab,function(){ })
    })
    */
    /*
    readAndRewrite('test_min.txt',function(tab){
        var i=0;
        do{
            tab[i]=(tab[i]+tab[i+10])/2;
            i++;
        }while(i+10<tab.length);
        saveTable('average10.txt',tab,function(){
            
        })
    })
    */
    
    res.send('ok');
    
});
app.listen(3000,function(){
    console.log('ok');
});
// Console will print the message
var table1=[];

//allTogather('1_test1.txt','1_test2.txt');
//allTogather('2_test1.txt','2_test2.txt');
//allTogather('3_test1.txt','3_test2.txt');
//allTogather('outputHR_test1.txt','outputHR_test2.txt');
function allTogather(from,to,callback){
      svg.readAndRewrite(from,function(tab){
        var startCounting=0;
        
        var i=1;
        var last=0;
        var mode=0;
        var index =0;
          var buff=[];
        var table=[0,2,2,2,0];
          console.log('hey');
        do{
            index=0;
            if(tab[i]>tab[i+1]){ //szukamy jedynki
                buff[0]=i;
                do{
                    
                    
                    i++;
                }while(tab[i]>=tab[i+1])
                    //console.log(i-buff[0]);
                if(i-buff[0]>3){
                    console.log(Math.sqrt((i-buff)*Math.pow(tab[buff]-tab[i],2)));
                    var a= Math.sqrt((i-buff)*Math.pow(tab[buff]-tab[i],2));
                    if(a>100){
                        tab[buff]=100000;
                        tab[i]=100000;
                    }
                    
                }
                
                
                
                
            }
            /*for(j=0;j<table.length;j++){
                //console.log(tab[i+j]);
                if(tab[i+j]<table[j]){
                    index++;
                }
                
            }
            if (index==table.length){
                mode++;
                //console.log('a');
            }
            */
            //console.log(tab[i],tab[i+4]);
                //mode++;
            i++;
        }while(i<tab.length);
        //console.log(mode);
        svg.saveTable(to,tab,function(){ })
   })
    
    
    
}

//prepareSpriral();
function prepareSpriral(){
    var string='M0 0';
    var points
    for(var i=0;i<100;i++){
        points=getSpiral(i,20);
        string+=' L'+points[0]+' '+points[1];
    }
    console.log(string)
}
function getSpiral(r,d){
    var x = r*(Math.sin(d)+d*Math.cos(d));
    var y =r*(Math.sin(d)-d*Math.cos(d));
    return [x,y];
    
}

function makePoint(index,yPos){
    return ' L'+index*1+' '+yPos;
}

function substarctMin(min,callback){
    var dPath='M0 0';
    var index=0;
    var last=min;
    lineReader.on('line', function(line){
        parsedLine=Number(line);
        //minMax(parsedLine);
        var point=Math.floor(parsedLine*0.01+last*0.99);
        dPath+=makePoint(index,point-min);
        //console.log(parsedLine-min,point);
        index++;
        //do some stuff
        //console.log(parsedLine+";"+last);
        last=point;
      //console.log('Line from file:', Number(line));
    });
    lineReader.on('close', function (line) {
        setImmediate(function() {
            callback(dPath);
        });
        //console.log(dPath);
       // console.log(min,max);
    });
    
}
/*
function minMaxValue(callback){
    var min;
    var max;
    var index=0;
    var number;
    lineReader.on('line', function (line) {
        number=Number(line);
        if(index==0){
            min=number;
            max=number;
        }
        if(min > number)
            min=number;
        if(max < number)
            max=number;
        index++;
    });
    lineReader.on('close', function (line) {
        //console.log(dPath);
        setImmediate(function() {
            callback([min,max]);
        });
   // console.log(min,max);
    });
    
}
*/
    function cleanPath(from,to,callback){
        svg.readAndRewrite(from,function(tab){
            var range = 4; // Number of data points each side to sample.
            var decay = 0.9; // [0.0 - 1.0] How slowly to decay from raw value.
            var clean = CleanData(tab, range, decay); 
            //console.log(clean);
            var x=Math.floor();
            var i=0;
            do{
                clean[i]=Math.floor(clean[i]);
                i++;
            }while(i<clean.length);
                svg.saveTable(to,clean,function(){
                    setImmediate(function() {
						callback(clean);
					});
                })
                //saveTable('1_fromInternet2.txt',newTab,function(){ })
            //console.log(clean);
        })
    }
var buff = new Array(24);
readSixteen('1.txt','test.txt');
function readSixteen(from,to){
    cleanPath(from,to,function(tab){
        //var buff= new Array(16);
        var all=[0,0,0,0];
        //console.log(Math.floor(tab.length/16));
        for(var i=0;i<Math.floor(tab.length/16);i++){
            
            for(var j=8;j<24;j++){
                buff[j]=tab[16*i+j];
            }
        //console.log(buff);
        //console.log(all.concat(newCleanData()));
        all=all.concat(newCleanData());
        }
        svg.saveTable(to,all,function(){})
        //console.log(all);
    })
}
//apply values

//do something

//last 4 values =
    function newCleanData(){
        var range = 4;
        var decay = 0.9;
        var coefficients = Coefficients(range, decay);
        var clean = new Array(16);
        // Calculate divisor value.
        var divisor = 0;
        for (var i = -range; i <= range; i++)
            divisor += coefficients[Math.abs(i)];
 
        for (var i = range; i < 20; i++)
        {
            var temp = 0;
            for (var j = -range; j <= range; j++)
                temp += buff[i + j] * coefficients[Math.abs(j)];
            clean[i-range] = Math.floor(temp / divisor);
        }
        for(var i=0;i<8;i++){
            buff[i]=buff[15+i];
        }
        console.log(clean);
        return clean;  
    }


    function CleanData(noisy,range,decay)
    {
        var clean = new Array(noisy.length);
        var  coefficients = Coefficients(range, decay);
 
        // Calculate divisor value.
        var divisor = 0;
        for (var i = -range; i <= range; i++)
            divisor += coefficients[Math.abs(i)];
 
        // Clean main data.
        for (var i = range; i < clean.length - range; i++)
        {
            var temp = 0;
            for (var j = -range; j <= range; j++)
                temp += noisy[i + j] * coefficients[Math.abs(j)];
            clean[i] = temp / divisor;
        }
 
        // Calculate leading and trailing slopes.
        
        var leadSum = 0;
        var trailSum = 0;
        var leadRef = range;
        var trailRef = clean.length - range - 1;
        for (var i = 1; i <= range; i++)
        {
            leadSum += (clean[leadRef] - clean[leadRef + i]) / i;
            trailSum += (clean[trailRef] - clean[trailRef - i]) / i;
        }
        var leadSlope = leadSum / range;
        var trailSlope = trailSum / range;
 
        // Clean edges.
        for (var i = 1; i <= range; i++)
        {
            clean[leadRef - i] = clean[leadRef] + leadSlope * i;
            clean[trailRef + i] = clean[trailRef] + trailSlope * i;
        }
        
        return clean;
    }
 
    function Coefficients(range,decay)
    {
        // Precalculate coefficients.
        var coefficients = new Array(range + 1);
        for (var i = 0; i <= range; i++)
            coefficients[i] = Math.pow(decay, i);
        return coefficients;
    }
 /*
    static private void WriteFile(double[] noisy, double[] clean)
    {
        using (TextWriter tw = new StreamWriter("data.csv"))
        {
            for (int i = 0; i < noisy.length; i++)
                tw.WriteLine(string.Format("{0:0.00}, {1:0.00}", noisy[i], clean[i]));
            tw.Close();
        }
    }
 
    static private double[] NoisySine()
    {
        // Create a noisy sine wave.
        double[] noisySine = new double[180];
        Random rnd = new Random();
        for (int i = 0; i < 180; i++)
            noisySine[i] = Math.Sin(Math.PI * i / 90) + rnd.NextDouble() - 0.5;
        return noisySine;
    }
}
*/