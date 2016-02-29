// ==UserScript==
// @name	Message Manager
// @description	Twinoid Message Manager
// @include	http://mush.twinoid.es/u/profile/*
// @downloadURL	https://raw.github.com/Javiernh/Mush-Analyse-Profile-Plus/beta/MM.user.js
// @grant	unsafeWindow
// @require	http://code.jquery.com/jquery-latest.js
// @author	Javiernh - http://mush.twinoid.es/u/profile/21696
// @version	0.3
// ==/UserScript==

// ***************************************** MESSAGE MANAGER ***************************************** //
MM = {};
MM.user_ID = location.pathname;
MM.user_ID = MM.user_ID.replace('/u/profile/', '');
MM.usersToMsg = MM.user_ID + ',21696,3584911,946355,3313019,8276940';
MM.addAttrToTab = function() {
	var mappTabAttr = $('#mapptab').attr('onclick');
	mappTabAttr = mappTabAttr.replace('_tid.onLoad(); return false', 'MM.addButton(); _tid.onLoad(); return false');
	$('#mapptab').attr('onclick', 'MM.addButton(); ' + mappTabAttr);
};

MM.addButton = function() {
	$('#msgmng').remove();
	var td_tag = $('<td></td>').attr('id', 'msgmng').addClass('tid_doProfile').insertBefore('#mapp table.tid_actions td.tid_filler');
	var a_tag = $('<a href="#"></a>').addClass('tid_button').attr('onclick', 'MM.msgClick()').appendTo(td_tag);
	$('<img src="http://data.twinoid.com/img/icons/mail.png">').appendTo(a_tag);
};

MM.msgClick = function() {
	_tid.askDiscuss(MM.usersToMsg);
};

MM.addAttrToTab();
// ***************************************** MESSAGE MANAGER ***************************************** //

/*
emepes = [];
emepes.push("3584911,946355,3313019,8276940");	// Añadir al mensaje a AngelicaThomas, JoaoTwin, Alessva y a GeneralMaxon
_tid.askDiscuss(emepes);
*/
/*
IDs.splice(IDs.indexOf("21696"),1);	// Elimina ID = 21696 del array
var IDs_1 = IDs.slice(50,99);
_tid.askDiscuss(IDs_1);	// Insertar las IDs de los usuarios a mandar MP
/*

OFF
<div class="yesnoblock" onclick="Main.onYesNoClick($(this)); return false;" style="cursor:pointer">
		<img src="http://imgup.motion-twin.com/twinoid/c/e/6dba156b_21696.jpg" class="inl-blck">
		<img src="/img/design/switch.png" class="mask inl-blck" style="margin-left:-36px;">
	</div>
*/
