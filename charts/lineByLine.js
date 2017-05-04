var readline=require('readline')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname+'/data/10s_hr.txt')
});
var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('/Users/bartek/gitrepo/substitutions/myModules/userSession.js'),
    cookieParser = require('cookie-parser'),
    fs = require('fs');
var app = express();
//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // for parsing
app.use(cookieParser());
var cookie = new session.sessionCreator();
var fileList = {};
var sessionList = [];
const testFolder = __dirname+'/data';
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
                preparePath(req.body['name'],function(path){
                
                        res.send({data:path});
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
    readAndRewrite('1_test3.txt',function(tab){
        var i=1;
        var last=0;
        var mode=0;
        var index =0;
        var table=[0,2,2,2,0];
        do{
            index=0;
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
            if(tab[i]+tab[i+4]==0){
                for(var j=0;j<5;j++){
                    tab[i+j]=0;
                }
            }
                //mode++;
            i++;
        }while(i+4<tab.length);
        //console.log(mode);
        //saveTable('1_detected.txt',tab,function(){ })
   })
    readAndRewrite('1_fromInternet.txt',function(tab){
        //readAndRewrite('1_test.txt',function(tab1){
            var i=0;
            //var pointer;
            do{
                if(tab[i]>tab[i+1])
                    tab[i]=1;
                else
                    tab[i]=0;
            //last=tab[i]-tab[i+10];
            //last/=2;
            //tab[i]=last;
            i++;
        }while(i+1<tab.length);
        //saveTable('1_test3.txt',tab,function(){ })
        //})
    })
        
   //*/
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
    cleanPath('1.txt','somebin.txt',function(clearData){
        
        
        
    })
    readAndRewrite('1.txt',function(tab){
    var range = 5; // Number of data points each side to sample.
    var decay = 0.8; // [0.0 - 1.0] How slowly to decay from raw value.
        //var  noisy = //read from file
        var clean = CleanData(tab, range, decay); 
        //var low = lowpass(tab)
        /*
        var high = highpass(tab)
        var newTab=[];
        for(var i=0;i<tab.length;i++){
            newTab[i]=tab[i]-high[i];
          
          
        }
        //console.log(low);
        //var inv = invert(clean);
        newTab=newTab.slice(2);
        */
        //saveTable('1_fromInternet.txt',clean,function(){ })
        //saveTable('1_fromInternet2.txt',newTab,function(){ })
    //console.log(clean);
    })
   
    
    readAndRewrite('1_fromInternet.txt',function(tab){
        readAndRewrite('1_detected.txt',function(tab1){
            var i=0;
            var last;
            do{
                if(tab1[i]==0){
                    tab[i]=0
                }
                //last=
                i++;
            }while(i<tab.length);
            saveTable('1_test2.txt',tab,function(){ })


        })
        
    })
    
    
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
function saveTable(destination,table,callback){
    var stream = fs.createWriteStream(__dirname+'/data/'+destination);
    stream.once('open',function(fd){
        for(var i=0;i<table.length;i++){
            stream.write(table[i]+'\n');
        }
        stream.end();
        setImmediate(function() {
                callback();
        });
    })
    
}
function allTogather(from,to,callback){
      readAndRewrite(from,function(tab){
        var startCounting=0;
        
        var i=1;
        var last=0;
        var mode=0;
        var index =0;
          var buff=[]
        var table=[0,2,2,2,0];
        do{
            index=0;
            if(tab[i]<tab[i+1]){ //szukamy jedynki
                buff[0]=i;
                do{
                    
                    
                    i++;
                }while(tab[i]<tab[i+1])
                if(i-buff[0]>4){
                    
                    
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
            if(tab[i]+tab[i+4]==0){
                for(var j=0;j<5;j++){
                    tab[i+j]=0;
                }
            }
                //mode++;
            i++;
        }while(i+4<tab.length);
        //console.log(mode);
        //saveTable('1_detected.txt',tab,function(){ })
   })
    
    
    
}
    
function preparePath(destination,callback){
    var somePath="M0 0";
    //var min=10108;
    var index1=0;
    var file = readline.createInterface({
        input: fs.createReadStream(__dirname+'/data/'+destination)
    });
    file.on('line',function(line){
        index1++;
        parsedLine=Number(line);
        somePath+=makePoint(index1,parsedLine);
    })
    file.on('close', function (line) {
            //console.log(dPath);
            setImmediate(function() {
                callback(somePath);
            });
       // console.log(
    
    
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
function readAndRewrite(from,callback){
    var file = readline.createInterface({
        input: fs.createReadStream(__dirname+'/data/'+from)
    });
    var table=[];
    last=0;

        file.on('line', function(line){
            table[table.length]=parsedLine=Number(line);
        });    
        file.on('close', function (line) {
            //console.log(dPath);
            //stream.end();
            setImmediate(function() {
                callback(table);
            });
       // console.log(min,max);
           // console.log(fd);
          //stream.write("My first row\n");
          //stream.write("My second row\n");
          //stream.end();
    });
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


var invert = function (h) {
    var cnt;
    for (cnt = 0; cnt < h.length; cnt++) {
      h[cnt] = -h[cnt]
    }
    h[(h.length - 1) / 2]++
    return h
  }
 
//high pass
function lowpass(data){
    var cutoff=0.8;
    var RC = 1.0/(cutoff*2*3.14);
    var dt = 1.0/100;
    var alpha = dt/(RC+dt);
    var filteredArray=new Array(data.length);
        filteredArray[0] = data[0];
    for(var i=1; i<data.length; i++){
        filteredArray[i] = filteredArray[i-1] + (alpha*(data[i] - filteredArray[i-1]));
    }
    return filteredArray;
}

    function highpass(data){
        var cutoff=100;
        var RC = 1.0/(cutoff*2*3.14);
        var dt = 1.0/100;
        var alpha = dt/(RC+dt);
        var filteredArray=new Array(data.length);
            filteredArray[0] = data[0];
        for(var i=1; i<data.length; i++){
            filteredArray[i] = alpha * (filteredArray[i-1] + data[i] - data[i-1]);
        }
         return filteredArray;

    }
    function cleanPath(from,to,callback){
        readAndRewrite(from,function(tab){
            var range = 5; // Number of data points each side to sample.
            var decay = 0.8; // [0.0 - 1.0] How slowly to decay from raw value.
                var clean = CleanData(tab, range, decay); 
                saveTable(to,clean,function(){
                    setImmediate(function() {
						callback(clean);
					});
                })
                //saveTable('1_fromInternet2.txt',newTab,function(){ })
            //console.log(clean);
        })
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