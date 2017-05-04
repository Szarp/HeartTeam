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
const testFolder = __dirname+'/img';
const btnNames = ['mazur','radzik','gumis'];

/*
getImg("uk3_147.png",function(a){
    console.log(a);
})
*/
function getImg(name,callback){
    //var path='some/path';
    var x=base64_encode('/Users/bartek/gitrepo/HeartTeam/charts/img/'+name);
    setImmediate(function() {
        callback(x);
    });       // Or put the next step in a function and invoke it
};
    

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
//var base64str = base64_encode('kitten.jpg');

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
    fs.readdir(testFolder, function(err, files){
    fileList=files;
 
    });
    res.sendFile( __dirname + '/photoRename.htm');
    
});
app.post('/data',function(req,res){
     var reqCookie=req.cookies.cookieName;
    //var userId=cookie.findIfSessionExist(reqCookie);
    //console.log('user session: ',userId);
    //console.log('seesionList: ',sessionList);
    //console.log('Mode: '+req.body['mode']);
    //console.log('user session: ',userId);

        if(req.body['mode']=='folder'){
            console.log('hey');
            res.send({data:fileList});
        }
        if(req.body['mode']=='img'){
            console.log('hey');
            getImg(req.body['params'],function(a){
                
                res.send({data:a});
            })
            //res.send({data:fileList});
        }
        if(req.body['mode']=='names'){
            //console.log('hey');
            //getImg(req.body['params'],function(a){
                
                res.send({data:btnNames});
            //})
            //res.send({data:fileList});
        }
        if(req.body['mode']=='rename'){
            console.log(req.body.params)
            rename(req.body.params[0],req.body.params[1],function(){
                
                
            })
            //console.log('hey');
            //getImg(req.body['params'],function(a){
                
                res.send({data:''});
            //})
            //res.send({data:fileList});
        }
});
var index=0;
var last=0;
var dPath="";
app.get('/test',function(req,res){
    ///*
  

   
    
   
    res.send('ok');
    
});
app.listen(3000,function(){
    console.log('ok');
});
// Console will print the message

function rename(name,rename,callback){
    fs.rename('/Users/bartek/gitrepo/HeartTeam/charts/img/'+name,'/Users/bartek/gitrepo/HeartTeam/charts/img/'+rename, function(err) {
        if ( err ) console.log('ERROR: ' + err);
        setImmediate(function() {
                callback();
        });
    });
    
}
function sendNextImg(){}
//prepareSpriral();
