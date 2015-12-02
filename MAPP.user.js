// ==UserScript==
// @name MAPP
// @namespace Mush Analyse Profile Plus
// @description Script Mush para los Perfiles (mejorado por Javiernh)
// @/downloadURL https://raw.github.com/Javiernh/Mush-Analyse-Profile-Plus/release/MAPP.user.js
// @include	http://mush.twinoid.es/u/profile/*
// @include	http://mush.twinoid.com/u/profile/*
// @include	http://mush.vg/u/profile/*
// @include	http://mush.twinoid.es/me*
// @include	http://mush.twinoid.com/me*
// @include	http://mush.vg/me*
// @require	http://code.jquery.com/jquery-latest.js
// @version		2.0
// ==/UserScript==
/* jshint -W043 */

MAPP = {};
MAPP.version = GM_info.script.version;
MAPP.Title = GM_info.script.name;
MAPP.domain = document.domain;
MAPP.URL = document.URL;
MAPP.MushURL = 'http://' + document.domain;
MAPP.Path = location.pathname;

MAPP.TxtVoyage = $('#cdTrips h3 .cornerright').text().toLowerCase();
switch (MAPP.domain) {
	case 'mush.twinoid.es':
		MAPP.TxtFileTab = 'Ficha';
		MAPP.TxtCycles = 'ciclos';
		MAPP.Title1 = 'Estadísticas de viajes';
		MAPP.Title2 = 'Estadísticas de personajes';
		MAPP.Title3 = 'Estadísticas de muertes';
		MAPP.TxtProject = $('#cdTrips > table.summar > tbody > tr:first > th:eq(4)').text().toLowerCase().split(' ')[0];
		break;
	case 'mush.twinoid.com':
		MAPP.TxtFileTab = 'File';
		MAPP.TxtCycles = 'cycles';
		MAPP.Title1 = 'Voyages statistics';
		MAPP.Title2 = 'Characters statistics';
		MAPP.Title3 = 'Deaths statistics';
		MAPP.TxtProject = $('#cdTrips > table.summar > tbody > tr:first > th:eq(4)').text().toLowerCase().split(' ')[1];
		break;
	default:
		MAPP.TxtFileTab = 'Fiche';
		MAPP.TxtCycles = 'cycles';
		MAPP.Title1 = 'Statistiques de voyages';
		MAPP.Title2 = 'Statistiques de personnages';
		MAPP.Title3 = 'Statistiques de morts';
		MAPP.TxtProject = $('#cdTrips > table.summar > tbody > tr:first > th:eq(4)').text().toLowerCase().split(' ')[0];
}	// END SWITCH

MAPP.GenTabProfile = function() {
	var TxtProfileTab = $('#profiletab').text();
	var mappTabAttr = " $(\'#cdTrips\').parent().hide(); $(\'.cdTabTgt\').hide(); $(\'#ProfileData\').show(); $(\'#profile\').show();";
	mappTabAttr += " $(this).addClass(\'active\'); $(this).siblings().removeClass(\'active\'); _tid.onLoad(); return false";
	var ProfileTabAttr = " $('.cdTabTgt').hide(); $('#ProfileData').hide(); $('#cdTrips').parent().show(); $('#profile').show();";
	ProfileTabAttr += " $(this).addClass('active'); $(this).siblings().removeClass('active'); _tid.onLoad(); return false;";

	if (MAPP.Path.search('/u/profile/') != -1) {
		$('#maincontainer').attr('style', 'margin: 70px auto 0px;');
		$('.cdTabTgt').before('<ul class="mtabs mapptabs"></ul>');	// Añadida clase "mapptabs" para colocar bien el menú.
		$('<li id="profiletab" class="cdTab active">' + MAPP.TxtFileTab + '</li>').attr("onclick", ProfileTabAttr).appendTo('ul.mtabs');
	}
	else {
		$('#profiletab').attr('onclick', ProfileTabAttr);
	}
	$('<li id="mapptab" class="newstab active">MAPP v' + MAPP.version + '</li>').attr('onclick', mappTabAttr).appendTo('ul.mtabs');
};	// END FUNCTION - MAPP.GenTabProfile

MAPP.IconDay = function(icon_day) {
	var iconday = 'slow_cycle';		// Icono de reloj para los que no llegan a 5 días de duración.
	var daytoicon = parseInt(icon_day/5)*5;
	if (daytoicon == 25) { daytoicon = 20; }		// Corrección de ausencia del icono de 25 días.
	if (daytoicon !== 0) { iconday = 'day'+ daytoicon; }
	return iconday;
};	// END FUNCTION - MAPP.IconDay

MAPP.Voyages = {};
	MAPP.Voyages.totalDay = 0;
	MAPP.Voyages.maxDay = 0;
	MAPP.Voyages.totalResearch = 0;
	MAPP.Voyages.maxResearch = 0;
	MAPP.Voyages.totalProjects = 0;
	MAPP.Voyages.maxProjects = 0;
	MAPP.Voyages.totalPlanets = 0;
	MAPP.Voyages.maxPlanets = 0;
	MAPP.Voyages.totalExplo = 0;
	MAPP.Voyages.maxExplo = 0;
	MAPP.Voyages.totalGlory = 0;
	MAPP.Voyages.maxGlory = 0;
	MAPP.Voyages.allDeaths = [];
	MAPP.Voyages.allCharacters = [];
	MAPP.Voyages.quantity = 0 ;
	MAPP.Voyages.links = [];
	MAPP.Voyages.TxtCharacter = $('#cdTrips > table.summar > tbody > tr:first > th:eq(0)').text();
	MAPP.Voyages.TxtDays = $('#cdTrips > table.summar > tbody > tr:first > th:eq(1)').text().toLowerCase();
	MAPP.Voyages.TxtGlory = $('#cdTrips > table.summar > tbody > tr:first > th:eq(7)').text().toLowerCase();
	MAPP.Voyages.TxtResearch = $('#cdTrips > table.summar > tbody > tr:first > th:eq(3)').text().toLowerCase();
	MAPP.Voyages.TxtPlanets = $('#cdTrips > table.summar > tbody > tr:first > th:eq(5)').text().toLowerCase().split(' ')[0];
	MAPP.Voyages.TxtExplor = $('#cdTrips > table.summar > tbody > tr:first > th:eq(2)').text().toLowerCase();

MAPP.Voyages.data = function() {
	MAPP.Voyages.links = [];
    charac_in_ship = [];	// Added new array
    icon_char_ship = [];	// Added new array
	$('#cdTrips > table.summar > tbody > tr.cdTripEntry').each(function(index,elem) {
	// 0:character, 1:days, 2:explorations, 3:research, 4:projects, 5:scanned, 6:titles, 7:glory, 8:death, 9:ship
		MAPP.Voyages.quantity++;
	// ------------------ 0: CHARACTER ------------------ //
		var character = $(this).children('td:eq(0)').children('span.charname').text();
		if(MAPP.Voyages.allCharacters[character] > 0) {
			MAPP.Voyages.allCharacters[character]++;
		}
		else {
			MAPP.Voyages.allCharacters[character] = 1;
		}
	// ------------------ 1: DAYS ------------------ //
		var day = $(this).children('td:eq(1)').text();
		if (MAPP.Voyages.maxDay < parseInt(day)) {
			MAPP.Voyages.maxDay = parseInt(day);
		}
		MAPP.Voyages.totalDay += parseInt(day);
	// ------------------ 2: EXPLORATIONS ------------------ //
		var explo = $(this).children('td:eq(2)').text();
		if (MAPP.Voyages.maxExplo < parseInt(explo)) {
			MAPP.Voyages.maxExplo = parseInt(explo);
		}
		MAPP.Voyages.totalExplo += parseInt(explo);
	// ------------------ 3: RESEARCH ------------------ //
		var research = $(this).children('td:eq(3)').text();
		if (MAPP.Voyages.maxResearch < parseInt(research)) {
			MAPP.Voyages.maxResearch = parseInt(research);
		}
		MAPP.Voyages.totalResearch += parseInt(research);
	// ------------------ 4: PROJECTS ------------------ //
		var projects = $(this).children('td:eq(4)').text();
		if (MAPP.Voyages.maxProjects < parseInt(projects)) {
			MAPP.Voyages.maxProjects = parseInt(projects);
		}
		MAPP.Voyages.totalProjects += parseInt(projects);
	// ------------------ 5: SCANNED ------------------ //
		var scanned = $(this).children('td:eq(5)').text();
		if (MAPP.Voyages.maxPlanets < parseInt(scanned)) {
			MAPP.Voyages.maxPlanets = parseInt(scanned);
		}
		MAPP.Voyages.totalPlanets += parseInt(scanned);
	// ------------------ 7: GLORY ------------------ //
		var glory = $(this).children('td:eq(7)').text();
		if (MAPP.Voyages.maxGlory < parseInt(glory)) {
			MAPP.Voyages.maxGlory = parseInt(glory);
		}
		MAPP.Voyages.totalGlory += parseInt(glory);
	// ------------------ 8: DEATH ------------------ //
		var death = $(this).children('td:eq(8)').text();
		if (MAPP.Voyages.allDeaths[death] > 0) {
			MAPP.Voyages.allDeaths[death]++;
		}
		else {
			MAPP.Voyages.allDeaths[death] = 1;
		}
	// ----------------------------------------------------- //
	});	// END EACH FUNCTION - Extracting voyages data
// ------------------ SORTING CHARACTERS ------------------ //
	MAPP.Voyages.allCharSorted = [];
	var i = 0;
	for(var character in MAPP.Voyages.allCharacters) {
		var char = "http://mush.twinoid.es/img/icons/ui/" + character.toLowerCase().replace(" ", "") + ".png";
		MAPP.Voyages.allCharSorted[i] = [MAPP.Voyages.allCharacters[character], character];		// [#voyages, character]
		i++;
	}
	MAPP.Voyages.allCharSorted.sort(function(a,b){return b[0] - a[0];});
// ------------------ SORTING DEATHS ------------------ //
	MAPP.Voyages.allDeathSorted = [];
	var j = 0;
	for(var death in MAPP.Voyages.allDeaths) {
		MAPP.Voyages.allDeathSorted[j] = [death, MAPP.Voyages.allDeaths[death]];
		j++;
	}
	MAPP.Voyages.allDeathSorted.sort(function(a,b){return b[1] - a[1];});
// ------------------------------------------------------- //
};	// END FUNCTION - MAPP.Voyages.data

MAPP.DisplayData = function() {
	$('<div id="ProfileData" class="awards twinstyle bgtablesummar"></div>').hide().prependTo('#profile > div.column2 > div.data');
	$('<h3>Total' + MAPP.TxtVoyage + ' : ' + MAPP.Voyages.quantity + '</h3>').appendTo('#ProfileData');
// ------------------------------ VOYAGES ------------------------------ //
	$('<ul id="ships-stats"><h4 class="ul_title">' + MAPP.Title1 + '</h4></ul>').appendTo('#ProfileData');
	// ------------------------- DAYS ------------------------- //
		$('<li id="p_days" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/'+ MAPP.IconDay(MAPP.Voyages.maxDay) +'.png" style="width:26px; height:26px;"></br>').appendTo('#p_days');
			$('<strong class="li_title">' + MAPP.Voyages.TxtDays + '</strong>').appendTo('#p_days');
			$('<p style="padding-top: 3px;">max: ' + MAPP.Voyages.maxDay + '</p>').appendTo('#p_days');
			$('<p>med: <em>' + (MAPP.Voyages.totalDay/MAPP.Voyages.quantity).toFixed(1) + '</em></p>').appendTo('#p_days');
	// ------------------------- GLORY ------------------------- //
		$('<li id="p_glory" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/triumph.png" style="width:26px; height:26px;"></br>').appendTo('#p_glory');
			$('<strong class="li_title">' + MAPP.Voyages.TxtGlory + '</strong>').appendTo('#p_glory');
			$('<p style="padding-top: 3px;">max: ' + MAPP.Voyages.maxGlory + '</p>').appendTo('#p_glory');
			$('<p>med: <em>' + (MAPP.Voyages.totalGlory/MAPP.Voyages.quantity).toFixed(1) + '</em></p>').appendTo('#p_glory');
	// ------------------------- RESEARCH ------------------------- //
		$('<li id="p_research" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/microsc.png" style="width:26px; height:26px;"></br>').appendTo('#p_research');
			$('<strong class="li_title">' + MAPP.Voyages.TxtResearch + '</strong>').appendTo('#p_research');
			$('<p style="padding-top: 3px;">max: ' + MAPP.Voyages.maxResearch + '</p>').appendTo('#p_research');
			$('<p>med: <em>' + (MAPP.Voyages.totalResearch/MAPP.Voyages.quantity).toFixed(1) + '</em></p>').appendTo('#p_research');
	// ------------------------- PROJECTS ------------------------- //
		$('<li id="p_projects" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/conceptor.png" style="width:26px; height:26px;"></br>').appendTo('#p_projects');
			$('<strong class="li_title">' + MAPP.TxtProject + '</strong>').appendTo('#p_projects');
			$('<p style="padding-top: 3px;">max: ' + MAPP.Voyages.maxProjects + '</p>').appendTo('#p_projects');
			$('<p>med: <em>' + (MAPP.Voyages.totalProjects/MAPP.Voyages.quantity).toFixed(1) + '</em></p>').appendTo('#p_projects');
	// ------------------------- PLANETS ------------------------- //
		$('<li id="p_scanned" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/planet.png" style="width:26px; height:26px;"></br>').appendTo('#p_scanned');
			$('<strong class="li_title">' + MAPP.Voyages.TxtPlanets + '</strong>').appendTo('#p_scanned');
			$('<p style="padding-top: 3px;">max: ' + MAPP.Voyages.maxPlanets + '</p>').appendTo('#p_scanned');
			$('<p>med: <em>' + (MAPP.Voyages.totalPlanets/MAPP.Voyages.quantity).toFixed(1) + '</em></p>').appendTo('#p_scanned');
	// ------------------------- EXPLORATIONS ------------------------- //
		$('<li id="p_explorations" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/survival.png" style="width:26px; height:26px;"></br>').appendTo('#p_explorations');
			$('<strong class="li_title">' + MAPP.Voyages.TxtExplor + '</strong>').appendTo('#p_explorations');
			$('<p style="padding-top: 3px;">max: ' + MAPP.Voyages.maxExplo + '</p>').appendTo('#p_explorations');
			$('<p>med: <em>' + (MAPP.Voyages.totalExplo/MAPP.Voyages.quantity).toFixed(1) + '</em></p>').appendTo('#p_explorations');
// ------------------------------ CHARACTERS ------------------------------ //
	$('<ul id="char-stats"><h4 class="ul_title">' + MAPP.Title2 + '</h4></ul>').appendTo('#ProfileData');
	for (var character in MAPP.Voyages.allCharSorted) {
		var char = MAPP.Voyages.allCharSorted[character][1].toLowerCase().replace(' ', '');
		$('<li class="charstats ' + char + '">').appendTo('#char-stats');
			$('<div class="bodychar ' + MAPP.Voyages.allCharSorted[character][1].toLowerCase().replace(' ', '_') + '"></div>')
				.appendTo('#char-stats > li.' + char);
			$('<div><strong class="li_title character">' + MAPP.Voyages.allCharSorted[character][1] + '</strong></div>').appendTo('#char-stats > li.' + char + ' > div');
			$('<p>' + MAPP.TxtCycles + ': ---</p>').appendTo('#char-stats > li.' + char);
			$('<p>' + MAPP.TxtVoyage + ': ' + MAPP.Voyages.allCharSorted[character][0] + '</p>').appendTo('#char-stats > li.' + char);
			$('<p><em>' + (100 * MAPP.Voyages.allCharSorted[character][0] / MAPP.Voyages.quantity).toFixed(2) + '%</em></p>').appendTo('#char-stats > li.' + char);
		}
// ------------------------------ DEATHS ------------------------------ //
	$('<ul id="dies-stats"><h4 class="ul_title">' + MAPP.Title3 + '</h4></ul>').appendTo('#ProfileData');
	for(var death in MAPP.Voyages.allDeathSorted) {
		var deathID = MAPP.Voyages.allDeathSorted[death][0].replace(/(\s|\u0027|\u002E)/g, '');
		$('<li id="' + deathID + '" class="diestats ' + death + '">').appendTo('#dies-stats');
			$('<p class="stroke">' + MAPP.Voyages.allDeathSorted[death][1] + '</p>').appendTo('#dies-stats > li.' + death);
			$('<p class="li_title death_text"><strong>' + MAPP.Voyages.allDeathSorted[death][0] + '</strong></p>').appendTo('#' + deathID);
	}
};	// END FUNCTION - MAPP.DisplayData

MAPP.Stats = {};
	MAPP.Stats.cycles = [];
//	MAPP.Stats.maxDay = 0;

MAPP.Stats.data = function() {
	$('.tid_scrollContent:eq(1) > table tr').each(function() {
		var c = $(this).children('td:eq(1)').children().text().search(/(ciclos|cycles)/i);
		if (c !== -1) {
			var charname = $(this).children('td:eq(0)').children().attr('src').replace(MAPP.MushURL + '/img/icons/ui/', '').replace('.png', '');
			var cycles = $(this).children('td:eq(2)').text().replace('x', '');
			MAPP.Stats.cycles[charname] = cycles;
			$('#char-stats > li.' + charname + ' > p:first').replaceWith('<p>' + MAPP.TxtCycles + ': ' + MAPP.Stats.cycles[charname] + '</p>');
		}
	});
};	// END FUNCTION - MAPP.Stats.data

MAPP.LinksDisplay = function() {
	$('<div class="links"><ul class= shiplist></ul></div>').prependTo('li.stats');
	$('<div class="links"><ul class= shiplist></ul></div>').prependTo('li.charstats');
	$('<div class="links"><ul class= shiplist></ul></div>').prependTo('li.diestats');
	$('#cdTrips > table.summar > tbody > tr.cdTripEntry').each(function (index,elem) {
	// ---------------------- LINKS : 1 : DAYS ---------------------- //
		var link = $(this).children('td:eq(9)').find("a").attr('href');
		if ( parseInt($(this).children('td:eq(1)').text()) == MAPP.Voyages.maxDay ) {
			$('<li><a class="ship" href="' + link + '"><img class="icon_char_ship" src="/img/icons/ui/' + 
				$(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","") + '.png"> : #' + link.replace("/theEnd/", "") + '</a></li>')
				.appendTo('#p_days > div ul.shiplist');
		}
	// ---------------------- LINKS : 7 : GLORY ---------------------- //
		if ( parseInt($(this).children('td:eq(7)').text()) == MAPP.Voyages.maxGlory ) {
			$('<li><a class="ship" href="' + link + '"><img class="icon_char_ship" src="/img/icons/ui/' + 
				$(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","") + '.png"> : #' + link.replace("/theEnd/", "") + '</a></li>')
				.appendTo('#p_glory > div ul.shiplist');
		}
	// ---------------------- LINKS : 3 : RESEARCH ---------------------- //
		if ( parseInt($(this).children('td:eq(3)').text()) == MAPP.Voyages.maxResearch ) {
			$('<li><a class="ship" href="' + link + '"><img class="icon_char_ship" src="/img/icons/ui/' + 
				$(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","") + '.png"> : #' + link.replace("/theEnd/", "") + '</a></li>')
				.appendTo('#p_research > div ul.shiplist');
		}
	// ---------------------- LINKS : 4 : PROJECTS ---------------------- //
		if ( parseInt($(this).children('td:eq(4)').text()) == MAPP.Voyages.maxProjects ) {
			$('<li><a class="ship" href="' + link + '"><img class="icon_char_ship" src="/img/icons/ui/' + 
				$(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","") + '.png"> : #' + link.replace("/theEnd/", "") + '</a></li>')
				.appendTo('#p_projects > div ul.shiplist');
		}
	// ---------------------- LINKS : 5 : SCANNED ---------------------- //
		if ( parseInt($(this).children('td:eq(5)').text()) == MAPP.Voyages.maxPlanets ) {
			$('<li><a class="ship" href="' + link + '"><img class="icon_char_ship" src="/img/icons/ui/' + 
				$(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","") + '.png"> : #' + link.replace("/theEnd/", "") + '</a></li>')
				.appendTo('#p_scanned > div ul.shiplist');
		}
	// ---------------------- LINKS : 2 : EXPLORATIONS ---------------------- //
		if ( parseInt($(this).children('td:eq(2)').text()) == MAPP.Voyages.maxExplo ) {
			$('<li><a class="ship" href="' + link + '"><img class="icon_char_ship" src="/img/icons/ui/' + 
				$(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","") + '.png"> : #' + link.replace("/theEnd/", "") + '</a></li>')
				.appendTo('#p_explorations > div ul.shiplist');
		}
	// ---------------------- LINKS : 8 : DEATHS ---------------------- //
		$('<li><a class="ship" href="' + link + '"><img class="icon_char_ship" src="/img/icons/ui/' + 
			$(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","") + '.png"> : #' + link.replace("/theEnd/", "") + '</a></li>')
			.appendTo('#' + $(this).children('td:eq(8)').text().replace(/(\s|\u0027|\u002E)/g, '') + ' > div ul.shiplist');
	// ---------------------- LINKS : 0 : CHARACTERS ---------------------- //
		$('<li><a class="ship" href="' + link + '"><img class="icon_char_ship" src="/img/icons/ui/' + 
		MAPP.IconDay($(this).children('td:eq(1)').text()) + '.png" style="width:16px; height:16px;"> : #' + link.replace("/theEnd/", "") + '</a></li>')
			.appendTo('li.' + $(this).children('td:eq(0)').text().trim().toLowerCase().replace(/(\s|\u0027|\u002E)/g, '') + ' > div ul.shiplist');
	});
	
};	// END FUNCTION - MAPP.LinksDisplay

MAPP.css = function() {
	$("<style>").attr("type", "text/css").html("\
		#mapptab { \
			text-transform : none! important; \
		} \
		h4.ul_title { \
			margin-bottom : 4px; \
			margin-top : 2px; \
		} \
		.nshipinput	{ width : 35px; height : 16px; padding-right : 3px; text-align : right; background : transparent; cursor : pointer; \
					border: 1px inset; border-color : #4e5162; font-size : 15px; color : #FEB500; } \
		.nshipinput:hover { border : 1px inset; border-color : white; color : white; } \
		.nshipinput:focus { background-color : #FE7D00; border : 1px inset; border-color : #FEB500; color : white; } \
		.bodychar { \
			position : relative; \
			opacity : 1; \
			width : 28px; \
			height : 44px; \
			background : url('http://mush.twinoid.es/img/art/char.png') no-repeat; \
			z-index : 4; \
		}\
		#profile #ProfileData > ul, ul.tabletitle { \
			padding : 0px 0px 15px 0px; \
		} \
		#ProfileData ul li.stats { \
			border-width : 1px; \
			border-color : yellow orange orange orange; \
			-moz-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			-webkit-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			background-color : #FCF5C2; \
			color : #090a61; \
			font-size : 100%; \
			width : 80px; \
			padding : 9px 9px 9px 9px; \
			margin : 4px 4px 4px 4px; \
			font-variant : small-caps; \
		} \
		#ProfileData ul li.charstats > div { \
			margin : 0 26px; \
		} \
		#ProfileData ul li.charstats > div > div { \
			width : 80px; \
			position : relative; \
			left : -26px; \
			top : 16px; \
		} \
		#ProfileData ul li.charstats { \
			border-width : 1px; \
			border-color : #A6EEFB #01c3df #01c3df #01c3df; \
			-moz-box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			-webkit-box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			background-color : #c2f3fc; \
			color : #090a61; \
			font-size : 100%; \
			width : 80px; \
			margin : 4px 4px 4px 4px; \
			font-variant : small-caps; \
			padding : 6px 9px 6px 9px; \
			height : 95px; \
		} \
		#profile #ProfileData #dies-stats > li { \
			height : 80px; \
			vertical-align : bottom; \
		} \
		#ProfileData ul li.diestats { \
			border-width : 1px; \
			border-color : #FBA6B0 #DF011C #DF0125 #DF011C; \
			-moz-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			-webkit-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			background-color : #FCC2C9; \
			color : #090a61; \
			font-size : 100%; \
			width : 80px; \
			margin : 4px 4px 4px 4px; \
			font-variant : small-caps; \
			padding : 5px 9px 9px 9px; \
		} \
		#ProfileData ul li.diestats:hover, \
		#ProfileData ul li.charstats:hover, \
		#ProfileData ul li.stats:hover { \
			background-color : #ECFFA2; \
			border-color : #BCFFA2 #40E000 #49E000 #40E000; \
			-moz-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			-webkit-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
		} \
		.li_title { \
			color : #fff; \
			text-shadow : \
				-1px -1px 2px black, \
				1px -1px 2px black, \
				1px 0 2px black, \
				-1px 0 2px black, \
				-1px 1px 2px black, \
				1px 1px 2px black; \
			font-weight : 900; \
			font-size : 13px; \
		} \
		.death_text { \
			font-size : 12px; \
			width : 76px; \
			padding : 0 2px; \
		} \
		.stroke { \
			color : #ff4059; \
			text-shadow : \
				-1px -1px 5px blue, \
				-1px 0px 5px blue, \
				-1px 1px 5px blue, \
				0px 1px 5px blue, \
				0px -1px 5px blue, \
				1px 1px 5px blue, \
				1px 0px 5px blue, \
				1px -1px 5px blue; \
			font-weight : 600; \
			font-size : 21px; \
		}\
		#ProfileData ul li.diestats div ul.shiplist, \
		#ProfileData ul li.charstats div ul.shiplist, \
		#ProfileData ul li.stats div ul.shiplist { \
			display : none; \
		}\
		#ProfileData ul li.diestats div ul.shiplist a.ship, \
		#ProfileData ul li.charstats div ul.shiplist a.ship, \
		#ProfileData ul li.stats div ul.shiplist a.ship { \
			display : block; \
			width : 85px; \
			height : 18px; \
			font-size : 13px; \
			text-decoration : none! important; \
			font-variant : normal; \
			color : #090a61; \
			text-shadow : 1px 1px 5px #FFF; \
		}\
		#ProfileData ul li.diestats div ul.shiplist a.ship img.icon_char_ship, \
		#ProfileData ul li.charstats div ul.shiplist a.ship img.icon_char_ship, \
		#ProfileData ul li.stats div ul.shiplist a.ship img.icon_char_ship { \
			position : relative; \
			top : -3px; \
		}\
		#ProfileData ul li.diestats div ul.shiplist a.ship:hover, \
		#ProfileData ul li.charstats div ul.shiplist a.ship:hover, \
		#ProfileData ul li.stats div ul.shiplist a.ship:hover { \
			color : #ff4059; \
			text-shadow : 1px 1px 0px #000; \
		}\
		#ProfileData ul li.diestats:hover > div ul.shiplist, \
		#ProfileData ul li.charstats:hover > div ul.shiplist, \
		#ProfileData ul li.stats:hover > div ul.shiplist { \
			display : block; \
			position : relative; \
			width : 102px; \
			left : 85px; \
			top : 0px; \
			text-align : right; \
			z-index : 50; \
			max-height : 100px; \
			overflow-x : hidden; \
			overflow-y : auto; \
			padding : 0px; \
			border : 0px; \
		}\
		#ProfileData ul li.charstats:hover > div ul.shiplist { \
			left : 60px; \
		} \
		#ProfileData ul li.diestats div ul.shiplist li, \
		#ProfileData ul li.charstats div ul.shiplist li, \
		#ProfileData ul li.stats div ul.shiplist li{ \
			text-align : left; \
			margin : 0px; \
			display : block! important; \
			width : 85px; \
			height : auto; \
			padding : 0px 5px 0 5px! important; \
			border-width : 1px; \
		}\
		#ProfileData ul li.diestats div ul.shiplist li { \
			border-color : #FBA6B0 #DF011C #DF0125 #DF011C; \
			-moz-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			-webkit-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			background-color : #FCC2C9; \
		}\
		#ProfileData ul li.charstats div ul.shiplist li { \
			border-color : #A6EEFB #01c3df #01c3df #01c3df; \
			-moz-box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			-webkit-box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			background-color : #c2f3fc; \
		}\
		#ProfileData ul li.stats div ul.shiplist li { \
			border-color : yellow orange orange orange; \
			-moz-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			-webkit-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			background-color : #FCF5C2; \
		}\
		#ProfileData ul li.diestats div ul.shiplist li:hover, \
		#ProfileData ul li.charstats div ul.shiplist li:hover, \
		#ProfileData ul li.stats div ul.shiplist li:hover { \
			background-color : #ECFFA2; \
			border-color : #BCFFA2 #40E000 #49E000 #40E000; \
			-moz-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			-webkit-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
		}\
		div.links { \
			height : 0px; \
		} \
		div.links > ul::-webkit-scrollbar { \
			width : 3px; \
		} \
		div.links > ul::-webkit-scrollbar-button { \
			width : 0px; \
			height : 0px; \
		} \
		div.links > ul::-webkit-scrollbar-thumb { \
			background : #1A1B57; \
		} \
		div.links > ul::-webkit-scrollbar-track { \
			background : #576077; \
		} \
	").appendTo("head");
};	// END FUNCTION - MAPP.css

MAPP.init = function() {
	MAPP.GenTabProfile();
	MAPP.Voyages.data();
	MAPP.css();
	MAPP.DisplayData();
	MAPP.LinksDisplay();
	$(window).load(function() {
		MAPP.Stats.data();	// Extract and display cycles when document is ready
	});
};	// END FUNCTION - MAPP.init

MAPP.init();
