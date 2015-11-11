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
// @version		1.3
// ==/UserScript==

Profile = function() {}
Profile.version = GM_info.script.version;
Profile.init = function() {
	Profile.css();
	Profile.Analyse.init(0);
}

Profile.css = function() {
	$("<style>").attr("type", "text/css").html("\
		.nshipinput	{ width: 35px; height: 16px; padding-right: 3px; text-align: right; background: transparent; cursor: pointer; \
					border: 1px inset; border-color: #4e5162; font-size: 15px; color: #FEB500; } \
		.nshipinput:hover { border: 1px inset; border-color: white; color: white; } \
		.nshipinput:focus { background-color: #FE7D00; border: 1px inset; border-color: #FEB500; color: white; } \
		.bodychar { \
			position: relative;\
			opacity: 1;\
			width: 28px;\
			height: 44px;\
			background: url('http://mush.twinoid.es/img/art/char.png') no-repeat;\
			z-index: 4;\
		}\
		#profile #AnalyseProfile_Result > ul, ul.tabletitle { \
			padding: 0px 0px 15px 0px \
		} \
		#AnalyseProfile_Result ul li.stats { \
			border-width : 1px; \
			border-color : yellow orange orange orange; \
			-moz-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			-webkit-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			background-color: #FCF5C2; \
			color : #090a61; \
			font-size:100%; \
			width:80px; \
			padding: 4px 0px 15px 0px \
			margin:4px 4px 4px 4px; \
			font-variant:small-caps; \
		} \
		#AnalyseProfile_Result ul li.charstat { \
			border-width : 1px; \
			border-color : #A6EEFB #01c3df #01c3df #01c3df; \
			-moz-box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			-webkit-box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			box-shadow : inset 0px 0px 4px #3965fb, 0px 0px 4px #3965fb, 0px 2px 4px #3965fb; \
			background-color : #c2f3fc; \
			color : #090a61; \
			font-size:100%; \
			width:80px; \
			margin:4px 4px 4px 4px; \
			font-variant:small-caps; \
			padding: 6px 9px 9px 9px \
		} \
		#profile #AnalyseProfile_Result #dies-stats > li { \
			height:75px; \
			vertical-align: bottom; \
		} \
		#AnalyseProfile_Result ul li.diestats { \
			border-width : 1px; \
			border-color : #FBA6B0 #DF011C #DF0125 #DF011C; \
			-moz-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			-webkit-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			background-color: #FCC2C9; \
			color : #090a61; \
			font-size:100%; \
			width:80px; \
			margin:4px 4px 4px 4px; \
			font-variant:small-caps; \
			padding: 0 9px 9px 9px \
		} \
		#AnalyseProfile_Result ul li.diestats:hover, \
		#AnalyseProfile_Result ul li.stats:hover { \
			background-color: #ECFFA2; \
			border-color : #BCFFA2 #40E000 #49E000 #40E000; \
			-moz-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			-webkit-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
		}\
		.stroke { \
			color: #ff4059; \
			text-shadow: \
				-1px -1px 0 blue, \
				1px -1px 0 blue, \
				-1px 1px 0 blue, \
				1px 1px 0 blue; \
			font-weight: 900; \
			font-size:26px; \
		}\
		#AnalyseProfile_Result ul li.diestats ul.shiplist, \
		#AnalyseProfile_Result ul li.stats ul.shiplist { \
			display: none; \
		}\
		#AnalyseProfile_Result ul li.diestats ul.shiplist a.ship, \
		#AnalyseProfile_Result ul li.stats ul.shiplist a.ship { \
			display: block; \
			width: 85px; \
			height: 18px; \
			font-size: 13px; \
			text-decoration: none! important;\
			font-variant: normal; \
			color : #090a61; \
			text-shadow: 1px 1px 5px #FFF;\
		}\
		#AnalyseProfile_Result ul li.diestats ul.shiplist a.ship img.icon_char_ship, \
		#AnalyseProfile_Result ul li.stats ul.shiplist a.ship img.icon_char_ship { \
		//	vertical-align: initial;\
			padding-bottom: 5px;\
		}\
		#AnalyseProfile_Result ul li.diestats ul.shiplist a.ship:hover, \
		#AnalyseProfile_Result ul li.stats ul.shiplist a.ship:hover { \
			color: #ff4059; \
			text-shadow: 1px 1px 0px #000;\
		}\
		#AnalyseProfile_Result ul li.diestats:hover > ul.shiplist, \
		#AnalyseProfile_Result ul li.stats:hover > ul.shiplist {\
			display: block;\
			position: relative;\
			width: 100px;\
		//	left: -10px;\
		//	bottom: -125px;\
			left: 85px;\
			top: 0px;\
			text-align: right;\
			z-index: 50;\
			height: 0px;\
			padding: 0px;\
			border: 0px;\
		}\
		#AnalyseProfile_Result ul li.diestats ul.shiplist li, \
		#AnalyseProfile_Result ul li.stats ul.shiplist li{\
			text-align: left;\
			margin: 0px;\
			display: block! important;\
			width: 85px;\
			height: auto;\
			padding: 0px 5px 0 5px! important;\
			border-width : 1px; \
		}\
		#AnalyseProfile_Result ul li.diestats ul.shiplist li {\
			border-color : #FBA6B0 #DF011C #DF0125 #DF011C; \
			-moz-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			-webkit-box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			box-shadow : inset 0px 0px 4px #FB3939, 0px 0px 4px #FB3939, 0px 2px 4px #FB3939; \
			background-color: #FCC2C9; \
		}\
		#AnalyseProfile_Result ul li.stats ul.shiplist li {\
			border-color : yellow orange orange orange; \
			-moz-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			-webkit-box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			box-shadow : inset 0px 0px 4px goldenrod, 0px 0px 4px goldenrod, 0px 2px 4px goldenrod; \
			background-color: #FCF5C2; \
		}\
		#AnalyseProfile_Result ul li.diestats ul.shiplist li:hover, \
		#AnalyseProfile_Result ul li.stats ul.shiplist li:hover{\
			background-color: #ECFFA2; \
			border-color : #BCFFA2 #40E000 #49E000 #40E000; \
			-moz-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			-webkit-box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
			box-shadow : inset 0px 0px 4px #56FF35, 0px 0px 4px #56FF35, 0px 2px 4px #56FF35; \
		}\
	").appendTo("head");
}

first = 0;	NShips = 0;
Profile.AddTable = function(n) {
	var infos = Profile.Analyse(n);
	var iconday = 'slow_cycle';
	var daytoicon = parseInt(infos.maxDay/5)*5;
	if (daytoicon == 25) { daytoicon = 20; }		// Corrección de ausencia del icono de 25 días.
	if (daytoicon !== 0) { iconday = 'day'+ daytoicon; }
	var tabHtml = '<div id="AnalyseProfile_Result" class="awards twinstyle"> \
			<h3><div class="cornerright"> \
				Mush Analyse Profile Plus v' + Profile.version + ' - \
				Quitar <input id="firstShip" class="nshipinput" type="text" tabindex="1" \
				maxlength="4" value='+ first +'> nave(s) reciente(s) - \
				Analizar : <input onfocus="this.select();" id="nShip" class="nshipinput" type="text" tabindex="1" \
				maxlength="4" value='+ (infos.nbrGames) +'> (0 para todas)\
				</div></h3>';
	tabHtml	+=	'<ul id="ships-stats">';
	// Ship Days
	tabHtml +=	'<li class="stats">';
	tabHtml += '<ul class= shiplist>';
	Profile.ShipLinks(infos.maxDay, 1);
	for(var link in shipsnumbers) {
		tabHtml += '<li><a class="ship" href="/theEnd/'+shipsnumbers[link]+'"><img class="icon_char_ship" src="/img/icons/ui/'+ icon_char_ship[link] +'.png"> : #'+ shipsnumbers[link] +'</a></li>';		// Added charac icon
	}
	tabHtml += '</ul>';
	tabHtml	+= '<img src="/img/icons/ui/'+iconday+'.png" style="width:26px; height:26px;"><strong><br>Días Nave</strong> \
				<p style="width:80px;">Max: ' + infos.maxDay + '</p> \
				<p style="width:80px;">Med: <em>' + (infos.totalDay/infos.nbrGames).toFixed(1) + '</em></p> \
				<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos.totalDay + '</p> \
			</li>';
	// Triumph
	tabHtml +=	'<li class="stats">';
	tabHtml += '<ul class= shiplist>';
	Profile.ShipLinks(infos.maxTriumph, 7);
	for(var link in shipsnumbers) {
		tabHtml += '<li><a class="ship" href="/theEnd/'+shipsnumbers[link]+'"><img class="icon_char_ship" src="/img/icons/ui/'+ icon_char_ship[link] +'.png"> : #'+ shipsnumbers[link] +'</a></li>';		// Added charac icon
	}
	tabHtml += '</ul>';
	tabHtml	+= '<img src="/img/icons/ui/triumph.png" style="width:26px; height:26px;"><strong><br>Gloria</strong> \
				<p style="width:80px;">Max: ' + infos.maxTriumph + '</p> \
				<p style="width:80px;">Med: <em>' + (infos.totalTriumph/infos.nbrGames).toFixed(1) + '</em></p> \
				<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos.totalTriumph + '</p> \
			</li>';
	// Researches
	tabHtml +=	'<li class="stats">';
	tabHtml += '<ul class= shiplist>';
	Profile.ShipLinks(infos.maxSearch, 3);
	for(var link in shipsnumbers) {
		tabHtml += '<li><a class="ship" href="/theEnd/'+shipsnumbers[link]+'"><img class="icon_char_ship" src="/img/icons/ui/'+ icon_char_ship[link] +'.png"> : #'+ shipsnumbers[link] +'</a></li>';		// Added charac icon
	}
	tabHtml += '</ul>';
	tabHtml	+= '<img src="/img/icons/ui/microsc.png" style="width:26px; height:26px;"><strong><br>Investigaciones</strong> \
				<p style="width:80px;">Max: ' + infos.maxSearch + '</p> \
				<p style="width:80px;">Med: <em>' + (infos.totalSearch/infos.nbrGames).toFixed(1) + '</em></p> \
				<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos.totalSearch + '</p> \
			</li>';
	// Projects
	tabHtml +=	'<li class="stats">';
	tabHtml += '<ul class= shiplist>';
	Profile.ShipLinks(infos.maxProjects, 4);
	for(var link in shipsnumbers) {
		tabHtml += '<li><a class="ship" href="/theEnd/'+shipsnumbers[link]+'"><img class="icon_char_ship" src="/img/icons/ui/'+ icon_char_ship[link] +'.png"> : #'+ shipsnumbers[link] +'</a></li>';		// Added charac icon
	}
	tabHtml += '</ul>';
	tabHtml += '<img src="/img/icons/ui/conceptor.png" style="width:26px; height:26px;"><strong><br>Proyectos</strong> \
				<p style="width:80px;">Max: ' + infos.maxProjects + '</p> \
				<p style="width:80px;">Med: <em>' + (infos.totalProjects/infos.nbrGames).toFixed(1) + '</em></p> \
				<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos.totalProjects + '</p> \
			</li>';
	// Planets
	tabHtml +=	'<li class="stats">';
	tabHtml += '<ul class= shiplist>';
	Profile.ShipLinks(infos.maxPlanetsScan, 5);
	for(var link in shipsnumbers) {
		tabHtml += '<li><a class="ship" href="/theEnd/'+shipsnumbers[link]+'"><img class="icon_char_ship" src="/img/icons/ui/'+ icon_char_ship[link] +'.png"> : #'+ shipsnumbers[link] +'</a></li>';		// Added charac icon
	}
	tabHtml += '</ul>';
	tabHtml	+= '<img src="/img/icons/ui/planet.png" style="width:26px; height:26px;"><strong><br>Planetas</strong> \
				<p style="width:80px;">Max: ' + infos.maxPlanetsScan + '</p> \
				<p style="width:80px;">Med: <em>' + (infos.totalPlanetsScan/infos.nbrGames).toFixed(1) + '</em></p> \
				<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos.totalPlanetsScan + '</p> \
			</li>';
	// Expeditions
	tabHtml +=	'<li class="stats">';
	tabHtml += '<ul class= shiplist>';
	Profile.ShipLinks(infos.maxExplo, 2);
	for(var link in shipsnumbers) {
		tabHtml += '<li><a class="ship" href="/theEnd/'+shipsnumbers[link]+'"><img class="icon_char_ship" src="/img/icons/ui/'+ icon_char_ship[link] +'.png"> : #'+ shipsnumbers[link] +'</a></li>';		// Added charac icon
	}
	tabHtml += '</ul>';
	tabHtml	+= '<img src="/img/icons/ui/survival.png" style="width:26px; height:26px;"><strong><br>Exploraciones</strong> \
				<p style="width:80px;">Max: ' + infos.maxExplo + '</p> \
				<p style="width:80px;">Med: <em>' + (infos.totalExplo/infos.nbrGames).toFixed(1) + '</em></p> \
				<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos.totalExplo + '</p> \
			</li>';

	// Stats notice
	tabHtml +=	'<p style="font-size: 80%;">¹ Valores referentes a la nave; \
				salvo la <strong>Gloria</strong>, que pertenece al jugador.</p>';
	tabHtml +=	'</ul>';

	// CHARACTER STATS
	tabHtml +=	'<ul id="char-stats"><ul class="tabletitle">ESTADÍSTICAS DE PERSONAJES</ul>';
	for(var character in infos.charVoyages) {
		tabHtml += '<li class="charstat" style="font-size:100%; width:80px; font-variant:small-caps;"> \
				<img class="bodychar ' + character.toLowerCase().replace(' ', '_') + '" src="/img/design/pixel.gif" > \
				<strong><br>' + character + '</strong> \
				<p style="width:80px;">' + infos.voyage + ': ' + infos.charVoyages[character][0] + '</p> \
				<p style="width:80px;"><em>' + (100*infos.charVoyages[character][0]/infos.nbrGames).toFixed(2) + ' %</em></p> \
			</li>';
	}
	tabHtml +=	'</ul>';
	// End Character Stats

	// DIES STATS
	tabHtml +=	'<ul id="dies-stats"><ul class="tabletitle">ESTADÍSTICAS DE MUERTES</ul>';
	for(var death in infos.deathSorted) {
		tabHtml += '<li class="diestats">';
		tabHtml += '<ul class= shiplist>';
		Profile.ShipLinks(infos.deathSorted[death][0], 8);
		for(var link in shipsnumbers) {
            tabHtml += '<li><a class="ship" href="/theEnd/'+shipsnumbers[link]+'"><img class="icon_char_ship" src="/img/icons/ui/'+ icon_char_ship[link] +'.png"> : #'+ shipsnumbers[link] +'</a></li>';		// Added charac icon
		}
		tabHtml += '</ul>';

		tabHtml += '<p class="stroke">' + infos.deathSorted[death][1] + '</p>';
		if(infos.deathSorted[death][0].length > 14) {
			tabHtml += '<p><marquee scrolldelay="500" direction="up" style="height: 16px; text-align: center;"><strong>' + infos.deathSorted[death][0] + '</strong></marquee></p>';
		}
		else {
			tabHtml += '<p style="height:19px;"><strong>' + infos.deathSorted[death][0] + '</strong></p>';
		}
		tabHtml += '<p style="width:80px;"><em>' + (100*infos.deathSorted[death][1]/infos.nbrGames).toFixed(2) + ' %</em></p>';
		tabHtml += '</li>';
	}
	tabHtml +=	'</ul>';
	// End Dies Stats

	tabHtml += '</div>';

	$('#profile > div.column2 > div.data > .bgtablesummar:last').after(tabHtml);

	$('#firstShip').keyup(function( event ) {
        if (event.which == 13 || event.keyCode == 13) {
			first = document.getElementById('firstShip').value;		//console.log(first);
			document.getElementById('nShip').focus();
        }
        return false;
	});
	
	$('#nShip').keyup(function( event ) {
        if (event.which == 13 || event.keyCode == 13) {
			first = document.getElementById('firstShip').value;		//console.log(first);
			NShips = document.getElementById('nShip').value;		//console.log(n);
			Profile.Analyse.init(NShips);
        }
        return false;
	});
}

Profile.ShipLinks = function(dt, td_eq) {
	shipsnumbers = [];
    charac_in_ship = [];	// Added new array
    icon_char_ship = [];	// Added new array
	$('#cdTrips > table.summar > tbody > tr.cdTripEntry').each(function(index,elem){
		var comparator = $(this).children('td:eq('+ td_eq +')').text();
        if (td_eq !== 8) { comparator = parseInt(comparator); }
		if ((index >= first) && (first+NShips > index || NShips === 0) && (comparator == dt)) {
			charac_in_ship[charac_in_ship.length] = $(this).children('td:eq(0)').text().trim();	// Added charac name array
			icon_char_ship[icon_char_ship.length] = $(this).children('td:eq(0)').text().trim().toLowerCase().replace(" ","");	// Added charac name array
			shipsnumbers[shipsnumbers.length] = $(this).children('td:eq(9)').find("a").attr('href').replace("/theEnd/", "");
		}
	});
}

//	********** HoverScroll **********

// Override default parameters onload
//	$.fn.hoverscroll.params = $.extend($.fn.hoverscroll.params, {
//		vertical : true,
//		width: 85,
//		height: 86,
//		arrows: false
//	});
// Generate hoverscroll with overridden default parameters
//	$('#dies-stats li ul.shiplist').hoverscroll();

//	********** HoverScroll **********
	
Profile.Analyse = function(n) {
	var infos = [];
	infos.totalDay = 0;
	infos.maxDay = 0;
	infos.minDay = -1;
	infos.totalSearch = 0;
	infos.maxSearch = 0;
	infos.minSearch = -1;
	infos.totalProjects = 0;
	infos.maxProjects = 0;
	infos.minProjects = -1;
	infos.totalPlanetsScan = 0;
	infos.maxPlanetsScan = 0;
	infos.minPlanetsScan = -1;
	infos.totalExplo = 0;
	infos.maxExplo = 0;
	infos.minExplo = -1;
	infos.totalTriumph = 0;
	infos.maxTriumph = 0;
	infos.minTriumph = -1;
	infos.allDeaths = [];
	infos.allCharacters = [];

	infos.nbrGames = 0 ; // Ships number
	infos.nbrGamesBeta = 0; // Beta ship number
	infos.voyage = $('#cdTrips h3 .cornerright').text();

	TotalShip = 0;
	
	$('#cdTrips > table.summar > tbody > tr.cdTripEntry').each(function(index,elem){
		// character, day, explo, search, projets, scan, titles, triumph, death, ship
		var death = $(this).children('td:eq(8)').text();

		TotalShip++;

		if((index >= first && infos.nbrGames < n) || (index >= first && n === 0))
		{
			if(death !== 'No hay ayuda disponible')
			{
				infos.nbrGames++;
				
				if(infos.allDeaths[death] > 0)
				{
					infos.allDeaths[death]++;
				}
				else
				{
					infos.allDeaths[death] = 1;
				}

				var character = $(this).children('td:eq(0)').children('span.charname').text();

				if(infos.allCharacters[character] > 0)
				{
					infos.allCharacters[character]++;
				}
				else
				{
					infos.allCharacters[character] = 1;
				}

//				if (infos.max < parseInt()) {
//					infos.max = parseInt();
//				}
//				if ((infos.min > parseInt()) || (infos.min == -1)) {
//					infos.min = parseInt();
//				}

				var day = $(this).children('td:eq(1)').text();
				if (infos.maxDay < parseInt(day)) {
					infos.maxDay = parseInt(day);
				}
				if ((infos.minDay > parseInt(day))||(infos.minDay == -1)) {
					infos.minDay = parseInt(day);
				}
				infos.totalDay += parseInt(day);
				
				var explo = $(this).children('td:eq(2)').text();
				if (infos.maxExplo < parseInt(explo)) {
					infos.maxExplo = parseInt(explo);
				}
				if ((infos.minExplo > parseInt(explo)) || (infos.minExplo == -1)) {
					infos.minExplo = parseInt(explo);
				}
				infos.totalExplo += parseInt(explo);

				var search = $(this).children('td:eq(3)').text();
				if (infos.maxSearch < parseInt(search)) {
					infos.maxSearch = parseInt(search);
				}
				if ((infos.minSearch > parseInt(search)) || (infos.minSearch == -1)) {
					infos.minSearch = parseInt(search);
				}
				infos.totalSearch += parseInt(search);

				var projets = $(this).children('td:eq(4)').text();
				if (infos.maxProjects < parseInt(projets)) {
					infos.maxProjects = parseInt(projets);
				}
				if ((infos.minProjects > parseInt(projets)) || (infos.minProjects == -1)) {
					infos.minProjects = parseInt(projets);
				}
				infos.totalProjects += parseInt(projets);

				var scan = $(this).children('td:eq(5)').text();
				if (infos.maxPlanetsScan < parseInt(scan)) {
					infos.maxPlanetsScan = parseInt(scan);
				}
				if ((infos.minPlanetsScan > parseInt(scan)) || (infos.minPlanetsScan == -1)) {
					infos.minPlanetsScan = parseInt(scan);
				}
				infos.totalPlanetsScan += parseInt(scan);

				var triumph = $(this).children('td:eq(7)').text();
				if (infos.maxTriumph < parseInt(triumph)) {
					infos.maxTriumph = parseInt(triumph);
				}
				if ((infos.minTriumph > parseInt(triumph)) || (infos.minTriumph == -1)) {
					infos.minTriumph = parseInt(triumph);
				}
				infos.totalTriumph += parseInt(triumph);
			}
			else
			{
				infos.nbrGamesBeta++;
			}
		}

	});

	// Sort characters & deaths
	infos.charVoyages = [];
	var i = 0;
	for(var character in infos.allCharacters) {
		infos.charVoyages[i] = [infos.allCharacters[character], character];
		i++;
	}

	infos.charVoyages.sort(function(a,b){return b[0] - a[0]});

	infos.deathSorted = [];
	var i = 0;
	for(var death in infos.allDeaths) {
		infos.deathSorted[i] = [death, infos.allDeaths[death]];
		i++;		// console.log(infos.deathSorted[death]);
	}
	infos.deathSorted.sort(function(a,b){return b[1] - a[1]});

	return infos;
}

Profile.Analyse.init = function(n) {
	if(isNaN(n) || n === null) { n = 0; }
	$('#AnalyseProfile_Result').remove();
	Profile.AddTable(n);
}

Profile.init();
