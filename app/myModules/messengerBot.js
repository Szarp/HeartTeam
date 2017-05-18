var config = require('./config');
var manageUsers = require('./manageUsers.js');
var request = require('request');
var facebook = require('./facebookComunication.js');
var callFunc = require('./postCallFunctions.js');
var secretToken = require('./secretTokenGenerator.js');
var mesTemp = require('./textTemplates.js')
var mongo = require('./mongoFunctions.js');
var adm1 = config.adm1;
var adm2 = config.adm2;

var streamList={}


//console.log(pulseInput());



//console.log(mesTemp.hrHelpPageMessage('1'));
function pulseInput(){
    var time=manyTimes(2);
    var value=[];
    for (var i=0;i<time.length;i++){
        value[i]=pulseValue();
    }
    return {
        value:value,
        time:time
    } 
}

function manyTimes(times){
    //var times=2;
    var x = new Date();
    var time=[];
    var y;
    for(var i=0;i<times;i++){
        y = new Date(times-i*3*1000) 
        time[times-1-i]=pulseTime(y);
        //console.log(pulseTime(y));
    }
    return time;
}

function pulseTime(y){
    //var y = new Date();
    //console.log(y.toUTCString());
    return ""+y.getHours()+":"+y.getMinutes()+":"+y.getSeconds();
}

function pulseValue(){
    return Math.floor(Math.random()*(70-50+1)+50);
}


function sendPulse(pulse,senderID){
    callSendAPI(mesTemp.pulseMessage(senderID,pulse));
}
function streamLoop(){
    //console.log(streamList);
    for(k in streamList){
        if(streamList[k].stream==true){
            console.log('Person '+k+' is streaming');
            sendPulse(pulseInput(),k);
        }
    }
}


function createMessage(type, id, content, callback){
	var message = {
		recipient: {
		  id: id
		}
	};
	//console.log(content);
	if(type == 'text'){
		message['message']={text: content};
	}else{
		message['message']={
			attachment:{
				type: 'template',
				payload:{
					template_type: 'button',
					text: content['text'],
					buttons: content['buttons']
				}
			}
		}
	}
	setImmediate(function(){
		callback(message);
	});
}

function createButtons(tab, callback){
	var buttons=[];
	for(var i = 0; i < tab.length; i++){
		var btn = tab[i];
		var singleBTN={};
		singleBTN['type']=btn[0];
		singleBTN['title']=btn[2];
		if(btn[0]=='web_url'){
			singleBTN['url']=btn[1];
		} else if(btn[0]=='postback'){
			singleBTN['payload']=btn[1];
		}
		console.log(singleBTN);
		console.log(JSON.stringify(singleBTN));
		buttons.push(singleBTN);
	}
	setImmediate(function(){
		console.log(buttons);
		callback(buttons);
	});
}
//commandAndParam("Ala ma kota","");
function commandAndParam(message,callback){
    message=message+' ';
    message = message.toLowerCase() 
    var buff=[];
        for(var i=0;i<message.length;i++){
            
            if(message.charAt(i)== ' ' ){
                buff[buff.length]=i;
            }
        }
        if(buff.length==2){
            var AT=message.slice(0,buff[0]);
            var param=message.slice(buff[0]+1,buff[1]);
            console.log(AT,param);
            return{AT:AT,param:param} 
        }
        else if(buff.length==1){
            var AT=message.slice(0,buff[0]);
            return{AT:AT,param:""}
        }
        else{
             return{AT:"",param:""}
        }
}


function connectToken(senderId,tkn){
    tkn = parseInt(tkn);
	console.log("Token received: " + tkn);
	secretToken.messCheck(senderId, tkn, function(res){
		if(res){
			createMessage('text', senderId, 'Konto zostało połączone. (y)', function(messageTS){
				callSendAPI(messageTS);
			});
		}
        else {
			createMessage('text', senderId, 'Wystąpił błąd. Spróbuj jeszcze raz.', function(messageTS){
		          callSendAPI(messageTS);
            });
        }
    });
}

function receivedPostback(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfPostback = event.timestamp;
    
	// The 'payload' param is a developer-defined field which is set in a postback 
	// button for Structured Messages. 
	var payload = event.postback.payload;
    if (payload == "More options")
        callSendAPI(mesTemp.moreCommands(senderID));

}

//prepare new database
function receivedMessage(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message.text;
    facebook.messengerSavePerson(senderID, function(res){
		//console.log('saving done');
		if(res==='saved'){
			facebook.messengerUserInfo(senderID, function(userData){
				var txt = 'Nowa osoba: ' + userData['first_name'] + ' ' + userData['last_name'];
				createMessage('text', adm1, txt, function(messageTS){
					callSendAPI(messageTS);
				});
			});
		}
	});
    var what = commandAndParam(message);
    var text=""
    if(what.AT=="0"){
        //device list
        mongo.findByParam({'personal.id':senderID},{"personal.settings":1},'person',function(doc){
            //console.log(doc)
            if(doc.length != 0){
                console.log(doc);
                var set = doc[0];
                var device = set.personal.settings.setClass;
                
                text="Your device: "+device;
            }
            else{
                text='Connect accounts or see default device: 00000000'
            }
          
        
        createMessage('text', senderID, text, function(messageTS){
            callSendAPI(messageTS);
        });
        })
        
    }
    else if(what.AT =='4'){
        //console.log(what.param)
        if (what.param == ''){
            secretToken.messRequest(senderID, function(token){
					var txt = 'Wygenerowany token wipsz na domek.emadar.eu:9001 po zalogowaniu i kliknięciu własnego zdjęcia profilowego w polu "Sprawdź token"\nTwój token to: ' + token;
					createMessage('text', senderID, txt, function(messageTS){
						callSendAPI(messageTS);
					});
            })
        }
        else {
            connectToken(senderID,what.param);
        }
    }
    else if(what.AT=="stream"){
        if(what.param=='start'){
        streamList[senderID]={"stream":true}
        }
        else if(what.param=='stop'){
            streamList[senderID]={"stream":false}
        }
        else{
            text='Did you mean "stream start" or "stream stop"?';
            createMessage('text', senderID, text, function(messageTS){
                callSendAPI(messageTS);
            });
        }
    }
    else{
        callSendAPI(mesTemp.hrHelpPageMessage(senderID)); 
    }
        //console.log(what)
}

function callSendAPI(messageData){
  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages',
    qs: { access_token: config.pageToken },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}
exports.receivedPostback=receivedPostback;
//exports.oneMesSend=oneMesSend;
exports.receivedMessage=receivedMessage;
//exports.notification=substitutionNotification;
exports.createMessage=createMessage;
exports.callSendAPI=callSendAPI;
exports.streamLoop=streamLoop;
