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
    readAndRewrite('average.txt',function(tab){
        var i=1;
        var last=0;;
        var mode=0;
        var a,b =0;
        do{
            last=0;
            a=Math.floor(tab[i]);
            b=Math.floor(tab[i-1]);
            if(mode==0){//looking for biggest
                if(a>b){
                    mode=1;
                }
            }
            else{
                if(a<b){
                    console.log(i);
                    mode=0;
                    last=300;
                }
            }

            tab[i-2]=last;
            i++;
        }while(i<tab.length);
        saveTable('higher_point.txt',tab,function(){ })
   })
   //*/
        
   
    /*
    readAndRewrite('test_min.txt',function(tab){
        var i=1;
        var last;
        do{
            //last=
            tab[i]=tab[i]*0.005+tab[i-1]*0.995;
            i++;
        }while(i+1<tab.length);
        saveTable('average.txt',tab,function(){ })
    })
    */
    /*
    readAndRewrite('test_min.txt',function(tab){
        var i=0;
        do{
            tab[i]=tab[i]/2+tab[i+1]/2;
            i++;
        }while(i+1<tab.length);
        saveTable('test.txt',tab,function(){ })
    })
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