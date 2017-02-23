"use strict";

const URL_USERS='http://mockbin.com/bin/b23dd106-4ac5-431f-baea-600457e4e834';
const URL_MESSAGES='http://mockbin.com/bin/a61c099a-74a5-43a4-865b-0f723572a381';
//получение пользователей с сервера
function getUsers() {	
	var request = new XMLHttpRequest();
	request.open('GET', URL_USERS, true);
	request.send();
	request.onload = function() {
	    if (request.status >= 200 && request.status < 400) {
		    // Обработчик успешного ответа
		    var response;
		    response = request.responseText;
  			usersData(response);
  		} else {
	    // Обработчик ответа в случае ошибки
		}
	};
}
//получение сообщений с сервера
function getMessages() {
	var requestMes = new XMLHttpRequest();
	requestMes.open('GET', URL_MESSAGES, true);
	requestMes.send();
	requestMes.onload = function() {
		var responseMes;
		responseMes = requestMes.responseText;
		var requestUs = new XMLHttpRequest();
		requestUs.open('GET', URL_USERS, true);
		requestUs.send();
		requestUs.onload = function() {
			var responseUs;
			responseUs = requestUs.responseText;
			messagesData(responseMes, responseUs);
		}
	}
}

//вывод сообщений на страницу
function messagesData(dataMes, dataUs) {
	var content = document.getElementById("listTabContent").getElementsByTagName('div')[0];
	content.innerHTML = "";
	JSON.parse(dataMes).forEach(
		function (obj1) {					
			JSON.parse(dataUs).forEach(
				function (obj2) {
					if (obj1.user==obj2.user_id){
						
						var p = document.createElement('p');
						p.innerHTML = `<b>${obj2.username}:</b> ${obj1.message}` 
						content.appendChild(p);
					}							
				}
			);
		}
	);	
}
/*вывод списка пользователей онлайн*/
function usersData(date) {
	var ul = document.getElementById('companions');
	ul.innerHTML = "";
	JSON.parse(date).forEach(
		function (obj) {		
			var li = document.createElement('li');
			var a = document.createElement('a');
			li.className = obj.status;
			a.innerHTML = obj.username;
			a.addEventListener('click', function(){newTabAdd(obj.username);});
			li.appendChild(a);
			ul.appendChild(li);
		}
	);		
}
/*добавляем 0 перед одноциферным временем: 07:01*/
function checkTime(i){
	if (i<10) {
		i="0" + i;
	}
	return i;
}
/*Вычисление текущего времени*/
function currentTime() {
	var locTime=new Date();
	var hours=locTime.getHours();
	var minutes=locTime.getMinutes();
	minutes=checkTime(minutes);
	var currentStr='Your local time is: '+hours+"h "+minutes+'m';
	return currentStr;
}
/*Вычисление времени пользователя в чате*/
function onlineTime() {
	var lastTime=new Date();
	var myTime=lastTime-startTime;
	var hours, minutes;
	hours = Math.floor(myTime/(1000*60*60));
	hours = (hours > 24) ? hours%24 : hours;
	minutes = Math.floor(myTime/(1000*60));
	minutes = (minutes > 60) ? minutes%60 : minutes;
	minutes = checkTime(minutes);
	var onlineStr='You are online for: '+hours+'h '+minutes+'m';
	return onlineStr;
}
/*Вывод текущего времени и времени на странице, обновление по таймауту*/
function outputMyTime() {
	document.getElementById('localTime').innerHTML=currentTime();
	document.getElementById('onlineTime').innerHTML=onlineTime();
	setTimeout('outputMyTime()', 10000);
}
/*подсчет символов соответствующих рег. выражению*/
function counter(string, reg) {
	var count = (string.match(reg)!=null) ? string.match(reg).length : 0;
	return count;
}
/*Отправка сообщения*/
function sendMessage() {	
	var input = document.getElementById('messageInput')
	var text = input.value;
	if (text=='') return;
	var author = document.getElementById('myName').value;
	if (!author) {
		author = 'MySelf';
	}
	var content = document.querySelectorAll('.current')[0];
	content.insertAdjacentHTML("beforeEnd", "<p><b>"+author+": </b>"+text+"</p>");
	input.value = "";
	document.getElementById('chars').innerHTML='0';
	document.getElementById('letters').innerHTML='0';
	document.getElementById('spaces').innerHTML='0';
	document.getElementById('puncts').innerHTML='0';
}
/*Добавление вкладки при клике по пользователю*/
function newTabAdd(name) {
	var tabNames = document.getElementById('listTabName');
	var content = document.getElementById('listTabContent');
	var li = document.createElement('li');
	var a1 = document.createElement('a');
	var a2 = document.createElement('a');
	var icon = document.createElement('i');
	li.className = "tab";
	a1.innerHTML = name;
	a1.addEventListener('click', function(){selectTab(li);});
	icon.className = "icon-remove-sign";
	a2.addEventListener('click', function(){deleteTab(li);});
	a2.appendChild(icon);
	li.appendChild(a1);
	li.appendChild(a2);
	tabNames.appendChild(li);
	var div = document.createElement('div');
	div.className = "cont";
	content.appendChild(div);
	/*tabNames.innerHTML += `<li class="tab"><a onclick="selectTab(this.parentNode)">${name}</a><a onclick="deleteTab(this.parentNode)"><i class="icon-remove-sign"></i></a></li>`;
	content.innerHTML += `<div class = "cont"></div>`;*/
}
/*переключение вкладок*/
function selectTab(obj) {
	var tabs = document.querySelectorAll('.tab');
	var conts = document.querySelectorAll('.cont');
	for (var i = 0; i < tabs.length; i++) {
		if (obj == tabs[i]) {
			conts[i].classList.add('current');
			tabs[i].classList.add('active');
		} else {
			conts[i].classList.remove('current');
			tabs[i].classList.remove('active');
		}
	}
}
function deleteTab(obj) {
	var tabs = document.querySelectorAll('.tab');
	var conts = document.querySelectorAll('.cont');
	for (var i = 0; i < tabs.length; i++) {
		if (obj == tabs[i]) {
			if(tabs[i].classList.contains('active')){
				conts[0].classList.add('current');
				tabs[0].classList.add('active');				
			}
			tabs[i].parentNode.removeChild(tabs[i]);
			conts[i].parentNode.removeChild(conts[i]);
		}
	}
}
/*подсчет пользователей онлайн*/
function companionsOnline() {
	var count = document.getElementById('companions').getElementsByTagName('li').length;
	document.getElementById('companionsOnline').innerHTML = 'Online: '+count;
	setTimeout('companionsOnline()', 1000);
}

/*Добавляем красивости для сообщения (жирный, курсив, подчеркивание, ссылка*/
function tagAdd(obj, str1, str2) {  
    if(document.selection) {                                                                          // Для IE 
        var s = document.selection.createRange(); 
        if (s.text) { 
        s.text = str1 + s.text + str2 
        } else { 
            obj.value = obj.value + str1 + str2 
        } 
    } 
    else if (typeof(obj.selectionStart) == "number") {                                      // Opera, FireFox, Chrome 
        if (obj.selectionStart != obj.selectionEnd) { 
            var start = obj.selectionStart; 
            var end = obj.selectionEnd; 
            s = obj.value.substr(start,end-start); 
            obj.value = obj.value.substr(0, start) + str1 + s + str2 + obj.value.substr(end) 
        } else { 
            obj.value = obj.value + str1 + str2 
        } 
    } 
} 

var startTime = new Date();
window.onload = function(){	
	outputMyTime();	
	setInterval('getUsers()', 1000);
	document.getElementById('mainChat').addEventListener('click', function(){selectTab(this.parentNode)});
	companionsOnline();
	setInterval('getMessages()', 2000);
};
var msgInput = document.getElementById('messageInput')
document.getElementById('bold').onclick=function(){
	tagAdd(msgInput, '<b>', '</b>');
};
document.getElementById('italic').onclick=function(){
	tagAdd(msgInput, '<i>', '</i>');
};
document.getElementById('underline').onclick=function(){
	tagAdd(msgInput, '<u>', '</u>');
};
document.getElementById('link').onclick=function(){
	tagAdd(msgInput, '<a>', '</a>');
};

document.getElementsByName('sendMessage')[0].onclick = sendMessage;

msgInput.oninput = function () {
	var string=this.value;
	var regLetters=/[a-zA-Z0-9а-яА-ЯёЁ']/g;
	var regSpaces=/\s/g;
	var regPuncts=/[-!;:()\?\.\,\"]/g;
	document.getElementById('chars').innerHTML=string.length;
	document.getElementById('letters').innerHTML=counter(string, regLetters);
	document.getElementById('spaces').innerHTML=counter(string, regSpaces);
	document.getElementById('puncts').innerHTML=counter(string, regPuncts);
}
