var settings1 = {};
var settings2={};
var set=new traslateSettings();
//var z = new translateChanges();
var clssList=[];


var btnEvents ={
    saveBtn:function(){takeValuesFromForm()},
    tommorowBtn:function(){periodSvg('5')},
    todayBtn:function(){periodSvg('6')},
    generateBtn:function(){tokenValidation('generateToken')},
    checkBtn:function(){tokenValidation('checkToken')}
}

function closeMsg(elID){
	var msgArea = document.getElementById('msgArea');
	var toRemove = document.getElementById(elID);
	msgArea.removeChild(toRemove);
}

function copy(elem, msg){
	var succeed = copyToClipboard(elem);
	if(!succeed){
		alert("Copy not supported or blocked. Press Ctrl+c to copy.");
		document.getElementById(msg).innerHTML = "Błąd kopiowania";
	} else {
		document.getElementById(msg).innerHTML = "Skopiowano";
	}
}

function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

function tokenValidation(mode){
    var url = 'postCall';
    var form = {};
    form['mode']=mode;
    if(mode=='checkToken'){
		var str = document.getElementById('tokenCheck').value;
		form['token']= parseInt(str);
    }
    sendObj(url,form,function(obj){
		if(obj>=00000 && obj<=99999){
			document.getElementById('tknField').innerHTML = obj;
			var insert = document.createElement("div");
			insert.id = "msgTOKEN";
			insert.className = "info";
			insert.innerHTML = '<div id="msgBoxData">Twój token to: <span class="tooltip"><span id="tok">' + obj + '</span><span id="copyTooltip" class="tooltiptext">Kliknij aby skopiować</span></span></div><div class="closeButton" onclick="closeMsg('+"'msgTOKEN'"+')">✖</div>';
			var msgArea = document.getElementById('msgArea');
			msgArea.appendChild(insert);
			document.getElementById("tok").addEventListener("click", function() {
				copy(document.getElementById("tok"), "copyTooltip");
			});;
		} else {
			var insert = document.createElement("div");
			insert.id = "msgTOKEN";
			if(obj != "Dziękujemy. Konto zostało połączone."){
				insert.className = "message";
			} else {
				insert.className = "info";
			}
			insert.innerHTML = '<div id="msgBoxData">' + obj + '</div><div class="closeButton" onclick="closeMsg('+"'msgTOKEN'"+')">✖</div>';
			var msgArea = document.getElementById('msgArea');
			msgArea.appendChild(insert);
		}
    })
}

function setValuesToForm(params){
    console.log(params);
    var formList=['deviceList'];
    for(var i=0;i<params.length;i++){
        var sel = document.getElementById(formList[0]);
        console.log(sel)
        var opts = sel.options;
        console.log(opts)
        for(var opt, j = 0; opt = opts[j]; j++) {
            if(opt.value == params[i]) {
                sel.selectedIndex = j;
                break;
            }
        }
    }
}


function takeValuesFromForm(){
    //console.log('hi');
    var form={};
    form['setClass'] = document.getElementById('deviceList').value;
    //form['notification'] = document.getElementById('setNotification').value;
    var url = 'postCall';
    form['mode'] = 'saveSettings';
    //console.log(form);
    //z.setClassName(form.setClass);
    //z.displayData();
    sendObj(url,form,function(obj){
        //var json = JSON.parse(obj); 
        console.log('saveSettings',obj);
    });
    //console.log('param from form',a,b);
}

function getPicture(){
    var url = 'postCall';
    var form = {};
    form['mode']='picture';
    sendObj(url,form,function(obj){
        console.log('res picture:',obj)
        
        document.getElementById('personPictureVer').src=obj;
        document.getElementById('personPictureHor').src=obj;
        
        
    })
    
    
}


function sendMessage(){
	var url = 'postCall';
	var form = {};
	form['mode']='message';
	var el = document.getElementById('messageArea');
	var infB = document.getElementById('infoBox');
	var infBData = document.getElementById('infoBoxData');
	var msg = el.value;
	if(msg.length > 3){
		form['param']=msg;
		sendObj(url,form,function(responseText){
			var insert = document.createElement("div");
				insert.id = "infoMSG";
				insert.className = "info";
				insert.innerHTML = '<div id="msgBoxData">' + responseText + '</div><div class="closeButton" onclick="closeMsg('+"'infoMSG'"+')">✖</div>';
			var msgArea = document.getElementById('msgArea');
			msgArea.appendChild(insert);
			document.getElementById('messageArea').value='';
		})
	} else {
		var insert = document.createElement("div");
			insert.id = "infoMSG";
			insert.className = "message";
			insert.innerHTML = '<div id="msgBoxData">Proszę nie wysyłaj pustych wiadomości.</div><div class="closeButton" onclick="closeMsg('+"'infoMSG'"+')">✖</div>';
		var msgArea = document.getElementById('msgArea');
		msgArea.appendChild(insert);
	}
}
var xx;
function onLoadFunc(){
    console.log('sendForm');
    var url='postCall';
    var form={};
    form['mode']='getSettings';
    sendObj(url,form,function(obj){
        //console.log(JSON.parse(obj));
        //console.log('obj',obj);
        settings1 = obj;
        console.log('hi',settings1);
        set.saveData(settings1.event);
        set.addChangeClick();
        set.addClicks();
        //z.setFields(settings1['fields']);
        //z.setClassName(settings1.formValues[0]);
    
    getPicture();
    applyDeviceList(settings1['formValues']);
    });
    
    
    init();
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register('/service-worker.js', {
			scope: './'
		});
        
    }
	document.getElementById("tokenCheck").addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
		if (key === 13) { // 13 is enter
			tokenValidation('checkToken');
		}
	});
    //console.log(settings1);
}

function applyDeviceList(set){
    //var id='elementsList';
    var id='deviceList';
    var el=document.getElementById(id);
    var ul=el.getElementsByTagName('ul');
    var string="";
    sendObj('hr',{mode:'device'},function(obj){
        var li=obj;
        console.log('hr',li);
        for(var i=0;i<li.length;i++){
            //string+='<li>'+li[i]+'</li>'
            string+='<option value="'+li[i]+'">'+li[i]+'</option>'
        }
        //string+="</ul>"
        //console.log(string);
        el.innerHTML=string;
        setValuesToForm(set);
        
    })
    
    
}


/* #####################jakieś śmieci#################### */
function sendObj (url,json_obj,callback){
    var http = new XMLHttpRequest();
    //var url = "get_data";
    var string_obj = JSON.stringify(json_obj);
       // console.log(string_obj);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log('resText',http.responseText);
            var res=JSON.parse(http.responseText);
            console.log(res);
            if(res['err'] == true){
                //console.log(res.message)
				var resMsg = res.message;
				var insert = document.createElement("div");
					insert.id = "msgLOGIN";
					insert.className = "message";
					insert.innerHTML = '<div id="msgBoxData"><a class="msgLink" href="/login">' + resMsg + '</a></div><div class="closeButton" onclick="closeMsg('+"'msgLOGIN'"+')">✖</div>';
				var msgArea = document.getElementById('msgArea');
				msgArea.appendChild(insert);
            }
            //console.log('resText',res);
            callback(res.params);
        }
        else{console.log(http.status);}
    }
    http.send(string_obj);
}

function btnClicked(type){
    console.log('hello',type);
    var idList={today:'todayBtn',tommorow:'tommorowBtn'};
    for (k in idList){
        if(k==type){
            document.getElementById(idList[k]).className='btn btnClicked';
        }
        else{ document.getElementById(idList[k]).className='btn';}
    }
    
}
function homePosition(id){
        var el;
        for(var i=0; i<settings1.events.length;i++){
            el = document.getElementById(settings1.events[i]);
            if(settings1.events[i]==id){
                el.style.display='block';
            }
            else{
                el.style.display='none';
            }
        }
}
function traslateSettings(){
    this.formId = 'setClass';
    this.saveData = function(data){
        console.log(data);
        this.changeDisplayEvents = data['changeDisplayEvents'];
        this.btnEvents=btnEvents;
    }
    this.addChangeClick=function(){
        for(k in this.changeDisplayEvents){
            this.changeDisplayOnClick(this.changeDisplayEvents[k]);
        }
    }
    
    this.changeDisplayOnClick=function(key){
        console.log(key[0]);
        var key1 =key[0];
        for(var i=0;i<key1.length;i++){
        var el = document.getElementById(key1[i]);
        //console.log(el);
        el.addEventListener('click',function(){ homePosition(key[1])},false);
        }
    }
    this.addClicks=function(){
        for(k in this.btnEvents){
            var el = document.getElementById(k);
            //console.log(el);
            el.addEventListener('click',this.btnEvents[k],false);
            //console.log(this.btnEvents[k]);
        }
    }
}

