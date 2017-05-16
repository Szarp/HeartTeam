var express = require('express'),
	fs= require('fs'),
	https =require('https'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	request= require('request'),
	//compression = require('compression'),
	//helmet = require('helmet'),
	mongo=require(__dirname+'/myModules/mongoFunctions.js'),
	setTime = require(__dirname+'/myModules/setTime.js'),
	mangeUsers = require(__dirname+'/myModules/manageUsers.js'),
	session = require(__dirname + '/myModules/userSession.js'),
	link = require(__dirname+'/myModules/fbLinks.js'),
	config = require(__dirname+'/myModules/config'),
	messenger = require(__dirname+'/myModules/messengerBot.js'),
	madar = require(__dirname+'/myModules/madarComunication.js'),
    svg = require(__dirname+'/myModules/svgCreator.js');

var app = express();
var cookie = new session.sessionCreator();
var sessionList = {};//cookies
var fileList = {};
var deviceList= [ '00000000',
'hx711 00190000',
'T - mmax zewą 00002200',
'T - mmax 2 00210001',
'T - Biurko A1 00170302',
'T - WC A5 0017031F',
'T - temp A8 00170383',
'T - Podloga A9 001703FA',
'T - Okno u E_R temp2 0017024C',
'T - Sufit A4 00170485',
'K - mc6553 00230000',
'test 00130020',
'T - Zielona antena 00170312',
'T - Antena WiFi 001701ED',
'P - Monitor 1 00220030',
'P - Komputer2 00220031',
'K - Drzwi lazienki 00230002'
];
const testFolder = '/Users/bartek/gitrepo/HeartTeam/charts/data/';

//set up certificates for HTTPS
var opts = {
	// Specify the key file for the server
	key: fs.readFileSync('cert/wsskey.pem'),
	// Specify the certificate file
	cert: fs.readFileSync('cert/wsscert.pem'),
	// Specify the Certificate Authority certificate
	ca: fs.readFileSync('cert/cacert.pem'),
};

//set up express app
var time = new setTime();
//app.all('*', setCookie);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // for parsing
app.use(cookieParser());
//app.use(compression()); //use gzip compression
//app.use(helmet()); //Set http headers to protect from eg. clickjacking
fs.readdir(testFolder, function(err, files){
    fileList=files;
 
});

//setting cookie on first login
app.use(function (req, res, next) {
    var disabled=['/webhook','/dataflow','/login'];
    if (disabled.indexOf(req.path) != -1) 
        return next();
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
app.get('/login', function (req, res) {
    console.log('Asking for login');
    var login=link.loginAttempt('');
    //check cookie or something
    console.log(login);
    res.redirect(login);
});

app.get('/', function (req, res){
    res.sendFile( __dirname + '/public/substitutionPage.htm');
});

app.get('/index', function (req, res) {
    res.sendFile( __dirname + '/public/substitutionPage.htm');
});

app.post('/login', function (req, res) {
   console.log('Asking for login');
    var login=link.loginAttempt('');
    //check cookie or something
    console.log(login);
    res.redirect(login);
});

function MeasureForm(){
    var x =new Date().getTime();
return  {
        name:'bartek',
        pass:'6eaiLmzne6LMWNPY7YL66Q==',
        report:'measure',
        mac:'001703FA',
        fromtime:x-60*60*1000*15,
        tilltime:x,
        param:3,
        raster:4
    };
}

app.post('/data',function(req,res){
    //var reqCookie=req.cookies.cookieName;
    console.log(req.body);
    if(req.body['mode']=='data'){
        //console.log(req.body.name);
        var pointer=0;
        for(var i=0;i<fileList.length;i++){
        if(req.body.name==fileList[i]) 
            pointer=1;
        }
        if(pointer==1){
            svg.svgToSend(req.body['name'],function(path){
                //console.log(path);    
                res.send(path);
            });
        }
        else{res.send('err');}    
    }
    if(req.body['mode']=='folder'){
        res.send({data:fileList});
    }
    if(req.body['mode']=='pulse'){
        svg.pulseToSend(function(path){
            res.send(path);
        })
    }
});
app.post('/dataflow', function (req, res) {
    //console.log('ok');
    var x = req.body.connection;
    //console.log(req.body.time)
    for(var i=0;i<x.length;i++){
        deviceList[i]=x[i].name +' '+x[i].MAC
        //console.log(x[i].name,x[i].MAC)
    }
    //console.log(req.body.connection)
    res.sendStatus(200);
});

setInterval(function(){
    messenger.streamLoop();
}, 1000*12); //now running once per 10 minutes

app.post('/postCall',function(req,res){
    var reqCookie=req.cookies.cookieName;
    var userId=cookie.findIfSessionExist(reqCookie);
    console.log('user session: ',userId);
    console.log('Mode: '+req.body['mode']);
    console.log('user session: ',userId);
	mangeUsers.postCall(userId,req.body,function(resText){
		if(userId == '0000' && req.body['mode'] == 'getSettings'){
			res.send(JSON.stringify({err:true,message:"Please log in using your Facebook account",params:resText}));
		}
		else{
			res.send(JSON.stringify({err:false,message:"",params:resText}));
		}
	})
})
app.post('/hr',function(req,res){
    var reqCookie=req.cookies.cookieName;
    var userId=cookie.findIfSessionExist(reqCookie);
    //console.log('user session: ',userId);
    console.log('hr: '+req.body['mode']);
    //console.log('user session: ',userId);
	if(req.body['mode'] == 'device'){
        //console.log('im here');
        res.send(JSON.stringify({err:false,message:"",params:deviceList}))
    }
    else if(req.body['mode'] == 'dataPeriod'){
        var rast = req.body['raster'];
        //var MAC = req.body['params'].raster;
        var par = MeasureForm()
        par.raster=rast;
        //console.log('im here');
        madar.values('0017009E',par,function(q){
            //console.log(q);
            svg.svgFromTab(q,function(x){
                res.send(x);
                //console.log(x);
            })
            
            
        })
        //res.send(JSON.stringify({err:false,message:"",params:deviceList}))
    }
    //else
    else{
        //res.send('no');
        //res.send(JSON.stringify({err:false,message:"",params:deviceList}))
    }
})

app.get('/redirect', function(req, res){
	var reqCookie=req.cookies.cookieName;
	console.log('redirect');
    console.log('if declined',req.query['error']);
	if(req.query['error']){
		console.log('im here');
		res.redirect('/index');
	}
	else{
		mangeUsers.redirect(req,function(id){
			console.log('idd',id);
			if(id == undefined){
				res.send('Problem logging in. Try again.');
			}
			else{
				cookie.addNewSession(id,reqCookie);
				res.redirect('/index');
			}
		});
	}
});

app.get('/deredirect', function(req, res){
	console.log('deredirect');
	console.log('deredirect',req.body);
});



setTimeout(function(){
	cookie.deleteOld();
},1000*60*60*24*30); //remove cookies (session) after 30 days


app.get('/webhook', function(req, res) {
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.webhookToken) {
		console.log("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
});

app.post('/webhook', function (req, res) {
var data = req.body;
// Make sure this is a page subscription
if (data.object === 'page') {
	// Iterate over each entry - there may be multiple if batched
	data.entry.forEach(function(entry) {
		var pageID = entry.id;
		var timeOfEvent = entry.time;
		// Iterate over each messaging event
		entry.messaging.forEach(function(event) {
			if (event.message) {
                //console.log(event);
                //messenger.oneMesSend(event);
				messenger.receivedMessage(event);
			} else if (event.postback) {
				messenger.receivedPostback(event);
			} else {
				//console.log("Webhook received unknown event: ", event);
			}
		});
	});
	//send 200 within 20s to inform Facebook that message was received successfully
	res.sendStatus(200);
	}
});


https.createServer(opts, app).listen(9001);
console.log('Started');


