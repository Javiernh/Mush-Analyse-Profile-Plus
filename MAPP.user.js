// ==UserScript==
// @name MAPP Beta
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
// @version		1.4b
// ==/UserScript==
/* jshint -W043 */

Profile = {};
Profile.version = GM_info.script.version;
Profile.Title = GM_info.script.name;
Profile.domain = document.domain;
Profile.MushURL = 'http://' + document.domain;
Profile.Stats = {};
	Profile.Stats.cycles = [];
//	Profile.Stats.maxDay = 0;
// **************** Conseguir una visualización más rápida **************** //

Profile.Stats.data = function() {
	$('.tid_scrollContent:eq(1) > table tr').each(function() {
		var c = $(this).children('td:eq(1)').children().text().search(/(ciclos|cycles)/i);
		if (c !== -1) {
			var charname = $(this).children('td:eq(0)').children().attr('src').replace(Profile.MushURL + '/img/icons/ui/', '').replace('.png', '');
			var cycles = $(this).children('td:eq(2)').text().replace('x', '');
			Profile.Stats.cycles[charname] = cycles;
			$('#char-stats > li.' + charname + ' strong').after('<p>' + Profile.Cycles + ': ' + Profile.Stats.cycles[charname] + '</p>');
		}
	});
}	// END FUNCTION - Profile.Stats.data

// **************** Conseguir una visualización más rápida **************** //
Profile.Voyages = {};
	Profile.Voyages.totalDay = 0;
	Profile.Voyages.maxDay = 0;
	Profile.Voyages.totalResearch = 0;
	Profile.Voyages.maxResearch = 0;
	Profile.Voyages.totalProjects = 0;
	Profile.Voyages.maxProjects = 0;
	Profile.Voyages.totalPlanets = 0;
	Profile.Voyages.maxPlanets = 0;
	Profile.Voyages.totalExplo = 0;
	Profile.Voyages.maxExplo = 0;
	Profile.Voyages.totalGlory = 0;
	Profile.Voyages.maxGlory = 0;
	Profile.Voyages.allDeaths = [];
	Profile.Voyages.allCharacters = [];
	Profile.Voyages.quantity = 0 ;
	Profile.Voyages.links = [];
	Profile.Voyages.TxtVoyage = $('#cdTrips h3 .cornerright').text().toLowerCase();
	Profile.Voyages.TxtCharacter = $('#cdTrips > table.summar > tbody > tr:first > th:eq(0)').text();
	Profile.Voyages.TxtDays = $('#cdTrips > table.summar > tbody > tr:first > th:eq(1)').text().toLowerCase();
	Profile.Voyages.TxtGlory = $('#cdTrips > table.summar > tbody > tr:first > th:eq(7)').text().toLowerCase();
	Profile.Voyages.TxtResearch = $('#cdTrips > table.summar > tbody > tr:first > th:eq(3)').text().toLowerCase();
	Profile.Voyages.TxtPlanets = $('#cdTrips > table.summar > tbody > tr:first > th:eq(5)').text().toLowerCase().split(' ')[0];
	Profile.Voyages.TxtExplor = $('#cdTrips > table.summar > tbody > tr:first > th:eq(2)').text().toLowerCase();
	Profile.Voyages.number = 0;

switch (Profile.domain) {
	case 'mush.twinoid.es':
		Profile.Cycles = 'ciclos';
		Profile.Title1 = 'Estadísticas de viajes';
		Profile.Title2 = 'Estadísticas de personajes';
		Profile.Title3 = 'Estadísticas de muertes';
		Profile.Voyages.TxtProject = $('#cdTrips > table.summar > tbody > tr:first > th:eq(4)').text().toLowerCase().split(' ')[0];
		break;
	case 'mush.twinoid.com':
		Profile.Cycles = 'cycles';
		Profile.Title1 = 'Voyages statistics';
		Profile.Title2 = 'Characters statistics';
		Profile.Title3 = 'Deaths statistics';
		Profile.Voyages.TxtProject = $('#cdTrips > table.summar > tbody > tr:first > th:eq(4)').text().toLowerCase().split(' ')[1];
		break;
	default:
		Profile.Cycles = 'cycles';
		Profile.Title1 = 'Statistiques de voyages';
		Profile.Title2 = 'Statistiques de personnages';
		Profile.Title3 = 'Statistiques de morts';
		Profile.Voyages.TxtProject = $('#cdTrips > table.summar > tbody > tr:first > th:eq(4)').text().toLowerCase().split(' ')[0];
}

Profile.DisplayData = function() {
	iconday = 'slow_cycle';		// Icono de reloj para los que no llegan a 5 días de duración.
	var daytoicon = parseInt(Profile.Voyages.maxDay/5)*5;
	if (daytoicon == 25) { daytoicon = 20; }		// Corrección de ausencia del icono de 25 días.
	if (daytoicon !== 0) { iconday = 'day'+ daytoicon; }
	$('<div id="ProfileData" class="awards twinstyle bgtablesummar"></div>').prependTo('#profile > div.column2 > div.data');
//	$('<h3><div class="cornerright">' + Profile.Title + ' v' + Profile.version + ' </div></h3>').appendTo('#ProfileData');
	$('<h3>' + Profile.Title + ' v' + Profile.version + '</h3>').appendTo('#ProfileData');
// ------------------------------ VOYAGES ------------------------------ //
	$('<ul id="ships-stats"><h4 class="ul_title">' + Profile.Title1 + '</h4></ul>').appendTo('#ProfileData');
	// ------------------------- DAYS ------------------------- //
		$('<li id="p_days" class="stats"></li>').appendTo('#ships-stats');
//			.appendTo('#p_days');
			$('<img src="/img/icons/ui/'+ iconday +'.png" style="width:26px; height:26px;"></br>').appendTo('#p_days');
			$('<strong class="li_title">' + Profile.Voyages.TxtDays + '</strong>').appendTo('#p_days');
			$('<p style="padding-top: 3px;">max: ' + Profile.Voyages.maxDay + '</p>').appendTo('#p_days');
			$('<p>med: <em>' + (Profile.Voyages.totalDay/Profile.Voyages.number).toFixed(1) + '</em></p>').appendTo('#p_days');
	// ------------------------- GLORY ------------------------- //
		$('<li id="p_glory" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/triumph.png" style="width:26px; height:26px;"></br>').appendTo('#p_glory');
			$('<strong class="li_title">' + Profile.Voyages.TxtGlory + '</strong>').appendTo('#p_glory');
			$('<p style="padding-top: 3px;">max: ' + Profile.Voyages.maxGlory + '</p>').appendTo('#p_glory');
			$('<p>med: <em>' + (Profile.Voyages.totalGlory/Profile.Voyages.number).toFixed(1) + '</em></p>').appendTo('#p_glory');
	// ------------------------- RESEARCH ------------------------- //
		$('<li id="p_research" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/microsc.png" style="width:26px; height:26px;"></br>').appendTo('#p_research');
			$('<strong class="li_title">' + Profile.Voyages.TxtResearch + '</strong>').appendTo('#p_research');
			$('<p style="padding-top: 3px;">max: ' + Profile.Voyages.maxResearch + '</p>').appendTo('#p_research');
			$('<p>med: <em>' + (Profile.Voyages.totalResearch/Profile.Voyages.number).toFixed(1) + '</em></p>').appendTo('#p_research');
	// ------------------------- PROJECTS ------------------------- //
		$('<li id="p_projects" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/conceptor.png" style="width:26px; height:26px;"></br>').appendTo('#p_projects');
			$('<strong class="li_title">' + Profile.Voyages.TxtProject + '</strong>').appendTo('#p_projects');
			$('<p style="padding-top: 3px;">max: ' + Profile.Voyages.maxProjects + '</p>').appendTo('#p_projects');
			$('<p>med: <em>' + (Profile.Voyages.totalProjects/Profile.Voyages.number).toFixed(1) + '</em></p>').appendTo('#p_projects');
	// ------------------------- PLANETS ------------------------- //
		$('<li id="p_scanned" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/planet.png" style="width:26px; height:26px;"></br>').appendTo('#p_scanned');
			$('<strong class="li_title">' + Profile.Voyages.TxtPlanets + '</strong>').appendTo('#p_scanned');
			$('<p style="padding-top: 3px;">max: ' + Profile.Voyages.maxPlanets + '</p>').appendTo('#p_scanned');
			$('<p>med: <em>' + (Profile.Voyages.totalPlanets/Profile.Voyages.number).toFixed(1) + '</em></p>').appendTo('#p_scanned');
	// ------------------------- EXPLORATIONS ------------------------- //
		$('<li id="p_explorations" class="stats"></li>').appendTo('#ships-stats');
			$('<img src="/img/icons/ui/survival.png" style="width:26px; height:26px;"></br>').appendTo('#p_explorations');
			$('<strong class="li_title">' + Profile.Voyages.TxtExplor + '</strong>').appendTo('#p_explorations');
			$('<p style="padding-top: 3px;">max: ' + Profile.Voyages.maxExplo + '</p>').appendTo('#p_explorations');
			$('<p>med: <em>' + (Profile.Voyages.totalExplo/Profile.Voyages.number).toFixed(1) + '</em></p>').appendTo('#p_explorations');
// ------------------------------ CHARACTERS ------------------------------ //
	$('<ul id="char-stats"><h4 class="ul_title">' + Profile.Title2 + '</h4></ul>').appendTo('#ProfileData');
	for (var character in Profile.Voyages.allCharSorted) {
		var char = Profile.Voyages.allCharSorted[character][1].toLowerCase().replace(' ', '');
		$('<li class="charstat ' + char + '" style="font-size:100%; width:80px; font-variant:small-caps;">').appendTo('#char-stats');
			$('<img class="bodychar ' + Profile.Voyages.allCharSorted[character][1].toLowerCase().replace(' ', '_') + '" src="/img/design/pixel.gif" >')
				.appendTo('#char-stats > li.' + char);
			$('<br><strong class="li_title character">' + Profile.Voyages.allCharSorted[character][1] + '</strong>').appendTo('#char-stats > li.' + char);
			$('<p>' + Profile.Voyages.TxtVoyage + ': ' + Profile.Voyages.allCharSorted[character][0] + '</p>').appendTo('#char-stats > li.' + char);
			$('<p><em>' + (100 * Profile.Voyages.allCharSorted[character][0] / Profile.Voyages.number).toFixed(2) + '%</em></p>').appendTo('#char-stats > li.' + char);
		}
// ------------------------------ DEATHS ------------------------------ //
	$('<ul id="dies-stats"><h4 class="ul_title">' + Profile.Title3 + '</h4></ul>').appendTo('#ProfileData');
	for(var death in Profile.Voyages.allDeathSorted) {
		$('<li class="diestats ' + death + '">').appendTo('#dies-stats');
			$('<p class="stroke">' + Profile.Voyages.allDeathSorted[death][1] + '</p>').appendTo('#dies-stats > li.' + death);
//			if(Profile.Voyages.allDeathSorted[death][0].length > 14) {
//				$('<p class="li_title"><marquee scrolldelay="250" direction="up" style="height: 16px; text-align: center;"><strong>' + 
//					Profile.Voyages.allDeathSorted[death][0] + '</strong></marquee></p>').appendTo('#dies-stats > li.' + death);
//			}
//			else {
				$('<p class="li_title death_text"><strong>' + Profile.Voyages.allDeathSorted[death][0] + '</strong></p>').appendTo('#dies-stats > li.' + death);
//			}
//			$('<p><em>' + (100* Profile.Voyages.allDeathSorted[death][1] / Profile.Voyages.number).toFixed(2) + '%</em></p>')
//				.appendTo('#dies-stats > li.' + death);
	}
// ***************************************************************************************************************************
// ***************************************************************************************************************************
// ***************************************************************************************************************************
}	// END FUNCTION - Profile.DisplayData

Profile.Voyages.data = function() {
//	$('.bgtablesummar:first').css({display: "none"});
	Profile.Voyages.links = [];
    charac_in_ship = [];	// Added new array
    icon_char_ship = [];	// Added new array
	$('#cdTrips > table.summar > tbody > tr.cdTripEntry').each(function(index,elem) {
	// 0:character, 1:days, 2:explorations, 3:research, 4:projects, 5:scanned, 6:titles, 7:glory, 8:death, 9:ship
		Profile.Voyages.number++;
	// ------------------ 0: CHARACTER ------------------ //
		var character = $(this).children('td:eq(0)').children('span.charname').text();
		if(Profile.Voyages.allCharacters[character] > 0) {
			Profile.Voyages.allCharacters[character]++;
		}
		else {
			Profile.Voyages.allCharacters[character] = 1;
		}
	// ------------------ 1: DAYS ------------------ //
		var day = $(this).children('td:eq(1)').text();
		if (Profile.Voyages.maxDay < parseInt(day)) {
			Profile.Voyages.maxDay = parseInt(day);
		}
		Profile.Voyages.totalDay += parseInt(day);
	// ------------------ 2: EXPLORATIONS ------------------ //
		var explo = $(this).children('td:eq(2)').text();
		if (Profile.Voyages.maxExplo < parseInt(explo)) {
			Profile.Voyages.maxExplo = parseInt(explo);
		}
		Profile.Voyages.totalExplo += parseInt(explo);
	// ------------------ 3: RESEARCH ------------------ //
		var research = $(this).children('td:eq(3)').text();
		if (Profile.Voyages.maxResearch < parseInt(research)) {
			Profile.Voyages.maxResearch = parseInt(research);
		}
		Profile.Voyages.totalResearch += parseInt(research);
	// ------------------ 4: PROJECTS ------------------ //
		var projects = $(this).children('td:eq(4)').text();
		if (Profile.Voyages.maxProjects < parseInt(projects)) {
			Profile.Voyages.maxProjects = parseInt(projects);
		}
		Profile.Voyages.totalProjects += parseInt(projects);
	// ------------------ 5: SCANNED ------------------ //
		var scanned = $(this).children('td:eq(5)').text();
		if (Profile.Voyages.maxPlanets < parseInt(scanned)) {
			Profile.Voyages.maxPlanets = parseInt(scanned);
		}
		Profile.Voyages.totalPlanets += parseInt(scanned);
	// ------------------ 7: GLORY ------------------ //
		var glory = $(this).children('td:eq(7)').text();
		if (Profile.Voyages.maxGlory < parseInt(glory)) {
			Profile.Voyages.maxGlory = parseInt(glory);
		}
		Profile.Voyages.totalGlory += parseInt(glory);
	// ------------------ 8: DEATH ------------------ //
		var death = $(this).children('td:eq(8)').text();
		Profile.Voyages.quantity++;
		if (Profile.Voyages.allDeaths[death] > 0) {
			Profile.Voyages.allDeaths[death]++;
		}
		else {
			Profile.Voyages.allDeaths[death] = 1;
		}
	// ----------------------------------------------------- //
	});	// END EACH FUNCTION - Extracting voyages data
// ------------------ SORTING CHARACTERS ------------------ //
	Profile.Voyages.allCharSorted = [];
	var i = 0;
	for(var character in Profile.Voyages.allCharacters) {
		var char = "http://mush.twinoid.es/img/icons/ui/" + character.toLowerCase().replace(" ", "") + ".png";
		Profile.Voyages.allCharSorted[i] = [Profile.Voyages.allCharacters[character], character];		// [#voyages, character]
		i++;
	}
	Profile.Voyages.allCharSorted.sort(function(a,b){return b[0] - a[0];});
// ------------------ SORTING DEATHS ------------------ //
	Profile.Voyages.allDeathSorted = [];
	var j = 0;
	for(var death in Profile.Voyages.allDeaths) {
		Profile.Voyages.allDeathSorted[j] = [death, Profile.Voyages.allDeaths[death]];
		j++;
	}
	Profile.Voyages.allDeathSorted.sort(function(a,b){return b[1] - a[1];});
// ------------------------------------------------------- //
}	// END FUNCTION - Profile.Voyages.data

Profile.Links = function(dt, td_eq) {
	Profile.Voyages.links = [];
    charac_in_ship = [];	// Added new array
    icon_char_ship = [];	// Added new array
	$('#cdTrips > table.summar > tbody > tr.cdTripEntry').each(function(index,elem){
		var comparator = $(this).children('td:eq('+ td_eq +')').text();
        if (td_eq !== 8) { comparator = parseInt(comparator); }
		if ((index >= first) && (first+NShips > index || NShips === 0) && (comparator == dt)) {
			charac_in_ship[charac_in_ship.length] = $(this).children('td:eq(0)').text().trim();	// Added charac name array
			icon_char_ship[icon_char_ship.length] = $(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","");	// Added charac name array
			Profile.Voyages.links[Profile.Voyages.links.length] = $(this).children('td:eq(9)').find("a").attr('href').replace("/theEnd/", "");
		}
	});
}	// END FUNCTION - Profile.Links

Profile.init = function() {
	Profile.Voyages.data();
	Profile.css();
	Profile.DisplayData();
	$(document).ready(function() {
		Profile.Stats.data();	// Extract and display cycles when document is ready
	});
}	// END FUNCTION - Profile.init

Profile.css = function() {
	$("<style>").attr("type", "text/css").html("\
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
		#ProfileData ul li.charstat { \
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
			height : 85px; \
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
			padding : 0 9px 9px 9px; \
		} \
		#ProfileData ul li.diestats:hover, \
		#ProfileData ul li.stats:hover { \
			background-color : #ECFFA2; \
			border-color : #BCFFA2 #40E000 #49E000 #40E000; \
			-moz-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			-webkit-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
		} \
		.character + p, .character + p + p, .character + p + p + p { \
			position : relative; \
			bottom : 16px; \
		} \
		.character { \
			position : relative; \
			top : -28px; \
			z-index : 5; \
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
			//letter-spacing : 1px; \
			font-weight : 900; \
			font-size : 13px; \
		} \
		.death_text { \
			font-size : 12px; \
			width : 76px; \
			padding : 0 1px; \
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
			padding-top : 5px; \
		}\
		#ProfileData ul li.diestats ul.shiplist, \
		#ProfileData ul li.stats ul.shiplist { \
			display : none; \
		}\
		#ProfileData ul li.diestats ul.shiplist a.ship, \
		#ProfileData ul li.stats ul.shiplist a.ship { \
			display : block; \
			width : 85px; \
			height : 18px; \
			font-size : 13px; \
			text-decoration : none! important; \
			font-variant : normal; \
			color : #090a61; \
			text-shadow : 1px 1px 5px #FFF; \
		}\
		#ProfileData ul li.diestats ul.shiplist a.ship img.icon_char_ship, \
		#ProfileData ul li.stats ul.shiplist a.ship img.icon_char_ship { \
		//	vertical-align : initial; \
			padding-bottom : 5px; \
		}\
		#ProfileData ul li.diestats ul.shiplist a.ship:hover, \
		#ProfileData ul li.stats ul.shiplist a.ship:hover { \
			color : #ff4059; \
			text-shadow : 1px 1px 0px #000; \
		}\
		#ProfileData ul li.diestats:hover > ul.shiplist, \
		#ProfileData ul li.stats:hover > ul.shiplist { \
			display : block; \
			position : relative; \
			width : 100px; \
		//	left : -10px; \
		//	bottom : -125px; \
			left : 85px; \
			top : 0px; \
			text-align : right; \
			z-index : 50; \
			height : 0px; \
			padding : 0px; \
			border : 0px; \
		}\
		#ProfileData ul li.diestats ul.shiplist li, \
		#ProfileData ul li.stats ul.shiplist li{ \
			text-align : left; \
			margin : 0px; \
			display : block! important; \
			width : 85px; \
			height : auto; \
			padding : 0px 5px 0 5px! important; \
			border-width : 1px; \
		}\
		#ProfileData ul li.diestats ul.shiplist li {\
			border-color : #FBA6B0 #DF011C #DF0125 #DF011C; \
			-moz-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			-webkit-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			background-color : #FCC2C9; \
		}\
		#ProfileData ul li.stats ul.shiplist li {\
			border-color : yellow orange orange orange; \
			-moz-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			-webkit-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			background-color : #FCF5C2; \
		}\
		#ProfileData ul li.diestats ul.shiplist li:hover, \
		#ProfileData ul li.stats ul.shiplist li:hover{ \
			background-color : #ECFFA2; \
			border-color : #BCFFA2 #40E000 #49E000 #40E000; \
			-moz-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			-webkit-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
		}\
	").appendTo("head");
}	// END FUNCTION - Profile.css
/*
first = 0;	NShips = 0;
Profile.Analyse = {};
Profile.Analyse.init = function(n) {
	if(isNaN(n) || n === null) { n = 0; }
	$('#ProfileData').remove();
	Profile.AddTable(n);
}
*/
Profile.init();

// <div id="tid_simpleTip" style="opacity: 1; top: 979px; left: 117.046875px;"><img class="tid_arrow" alt=""
//src="//data.twinoid.com/img/design/simpleTipArrow.png" style="margin-left: 101px; margin-top: 35px;">
//<div class="tid_inner">¡Has sobrevivido hasta el final, eres parte de la historia!</div></div>
