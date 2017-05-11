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
var allClasses = ["1a","1b","1c","1d","2a","2b","2c","2d","3a","3b","3c","3d","1ga","1gb","1gc","1gd","2ga","2gb","2gc","2gd","3ga","3gb","3gc","3gd"];

var streamList={}


function sendPulse(senderID){
    var pulse={
        value:[15,24],
        time:['1 January 1970 00:00:00 UTC','1 January 1970 00:00:00 UTC']
    }
    callSendAPI(mesTemp.pulseMessage(senderID,pulse));
}
function streamLoop(){
    console.log(streamList);
    for(k in streamList){
        if(streamList[k].stream==true){
            console.log('Person '+k+' is streaming');
            sendPulse(k);
        }
    }
}


function createMessage(type, id, content, callback){
	var message = {
		recipient: {
		  id: id
		}
	};
	console.log(content);
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
    var buff=[];
        for(var i=0;i<message.length;i++){
            
            if(message.charAt(i)== ' ' ){
                buff[buff.length]=i;
            }
        }
        //console.log(buff);
        //for(var i=0;i<buff.length;i++){
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
	secretToken.messCheck(senderID, tkn, function(res){
		if(res){
			createMessage('text', senderID, 'Konto zostało połączone. (y)', function(messageTS){
				callSendAPI(messageTS);
			});
		}
        else {
			createMessage('text', senderID, 'Wystąpił błąd. Spróbuj jeszcze raz.', function(messageTS){
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
        var pulse={
            value:[15,24,12],
            time:['1 January 1970 00:00:00 UTC','1 January 1970 00:00:00 UTC','1 January 1970 00:00:00 UTC']
        }
        callSendAPI(mesTemp.pulseMessage(senderID,pulse));
    }
    else if(what.AT=="1"){
        text="brak na jutro"
        createMessage('text', senderID, text, function(messageTS){
            callSendAPI(messageTS);
        });
        
    }
    else if(what.AT=="2"){
        streamList[id]={
        "stream":true
    }    
        text="nie skontaktujemy się"
        createMessage('text', senderID, text, function(messageTS){
            callSendAPI(messageTS);
        });
    }
    else if(what.AT=="stream"){
        if(what.param=='start'){
        streamList[senderID]={"stream":true}
        }
        if(what.param=='stop'){
            streamList[senderID]={"stream":false}
        }
    }
    else{
        callSendAPI(mesTemp.helpPageMessage(senderID)); 
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
