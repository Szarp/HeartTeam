// Facebook Templates
var callFunc = require('./postCallFunctions.js'),
    mongoFunc = require('./mongoFunctions.js');

//listMsgCreator('1b',"dzis","");

function listMsgCreator(className,day,callback){
    byClass(day,className,function(changes){
        console.log(elementsForListMsg(changes,day,className));  
    })   
}
function deflautList(id,title,subtitle){
    var elements=[];
    for(var i=0;i<title.length;i++){
        elements[i]={
            "title":title[i],
            "subtitle":subtitle[i]
        }
    }
    return{
        "recipient":{"id":id},
        "message": {
            "attachment": {"type": "template",
                "payload": {
                "template_type": "list",
                "top_element_style": "compact",
                "elements": elements 
                }
            }
        }   
    }
}
function moreCommands(id){
    var title = ["4","4 token"];
    var sub =  ['"4" - generuje token; do wpisania na stronie aplikacji',
'"4 12345" - łączy konta jeżeli wpisliśmy poprawny kod z aplikacji'];
    return deflautList(id,title,sub);
}

function hrHelpPageMessage(id){
    return{
        "recipient":{"id":id},
        "message": {
            "attachment": {"type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": [{
                        "title": "HeartTeam - Help Page",
                        "subtitle": "Help page with basic commands",
                    },{
                        "title": '0',
                        "subtitle": '"0" - choosen sensor default(00A00000)',            
                    },{
                        "title": "stream start/stop",
                        "subtitle": '"stream start" - starts streaming actual data for choosen sensor', 
                    }],
                    "buttons": [{
                        "title": "More commands",
                        "type": "postback",
                        "payload": "More options"                        
                    }] 
                }
            }
        }   
    
    }
}
    
function pulseMessage(id,pulse){
    
   return deflautList(id,pulse.value,pulse.time);
    
    
}
function byClass(day,className,callback){
    callFunc.getChanges({param:'today'},function(x){
        var elem,
            tab=[];
        //console.log(x.substitutions);
        for (k in x.substitution){
            elem=x.substitution[k];
            //console.log(elem.classes.indexOf(className));
            if(elem.classes.indexOf(className) > -1)
                tab[tab.length]=elem;
            //if(elem.)
        }
        console.log(tab);
        setImmediate(function(){
            callback(tab);
        }); 
        //console.log(x);
    })
}
function elementsForListMsg(allChanges,day,className){
    var elements=[];
    elements[0]={
        "title": "Zastępstwa dla klasy "+className,
        "subtitle": day,
    }
    for(var i=0;i<allChanges.length;i++){
        elements[i+1]={"subtitle": allChanges[i]};
    }
    return elements;
}
function listMsg(id,elements){
    return{
        "recipient":{"id":id},
        "message": {
            "attachment": {"type": "template",
                "payload": {
                "template_type": "list",
                "elements":elements
                }
            }   
        }   
    }
}
exports.pulseMessage=pulseMessage;
//exports.helpPageMessage=helpPageMessage;
exports.moreCommands=moreCommands;
exports.hrHelpPageMessage=hrHelpPageMessage;

