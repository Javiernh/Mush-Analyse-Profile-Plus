// ==UserScript==
// @name        Mush Analyse Profile Plus
// @namespace   Mush Analyse Profile Plus
// @description Player profile Analyser (based on Mush Analyse Profile by Scipion)
// @include     http://mush.twinoid.es/u/profile/*
// @include     http://mush.twinoid.com/u/profile/*
// @include     http://mush.vg/u/profile/*
// @include     http://mush.twinoid.es/me*
// @include     http://mush.twinoid.com/me*
// @include     http://mush.vg/me*
// @version     1.0
// ==/UserScript==

var $ = unsafeWindow.jQuery;

var scriptVersion = GM_info.script.version;

function addGlobalStyle(string){
        if(/microsoft/i.test(navigator.appName) && 
!/opera/i.test(navigator.userAgent)){
            document.createStyleSheet().cssText=string;
        }
        else {
            var ele=document.createElement('link');
            ele.rel='stylesheet';
            ele.type='text/css';
            ele.href='data:text/css;charset=utf-8,'+escape(string);
            document.getElementsByTagName('head')[0].appendChild(ele);
        }
}

addGlobalStyle('\
.nshipinput	{ width: 35px; height: 16px; padding-right: 3px; text-align: right; background: transparent; cursor: pointer; \
			border: 1px inset; border-color: #4e5162; font-size: 15px; } \
.nshipinput:hover { border: 1px inset; border-color: white; color: lime; } \
.nshipinput:focus { background-color: #17195B; border: 1px inset; border-color: cyan; } \
.tabletitle { font-size: 15px; border: cyan solid 1px; border-radius: 5px; color: silver; margin-top: 12px; margin-bottom: 7px; }\
');

function charaToClassChar(str)
{
	str = str.toLowerCase();
	str = str.replace(' ', '_');
	
	return str;
}

function Analyse_AddTable(n)
{	
	var infos = Analyse_Analyse(n);
	var iconday = 'slow_cycle';
	var daytoicon = parseInt(infos['maxDay']/5)*5;
    if (daytoicon != 0) { iconday = 'day'+daytoicon; }
	var tabHtml = '<div id="AnalyseProfile_Result" class="awards twinstyle"> \
			<h3><div class="cornerright"> \
				Mush Analyse Profile Plus v' + scriptVersion + ' - \
				Naves analizadas : <input id="nShip" class="nshipinput" type="text" tabindex="1" \
				maxlength="4" value='+infos['nbrGames']+'> (0 para todas)</div></h3>';
	tabHtml	+=	'<ul>';
	// Ship Days
	tabHtml +=	'<li class="nova" style="font-size:100%; width:80px; font-variant:small-caps;"> \
					<img src="/img/icons/ui/'+iconday+'.png" style="width:26px; height:26px;"><strong><br>Días Nave</strong> \
					<p style="width:80px;">Max: ' + infos['maxDay'] + '</p> \
					<p style="width:80px;">Med: <em>' + (infos['totalDay']/infos['nbrGames']).toFixed(1) + '</em></p> \
					<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos['totalDay'] + '</p> \
				</li>';
	// Triumph
	tabHtml +=	'<li class="nova" style="font-size:100%; width:80px; font-variant:small-caps;"> \
					<img src="/img/icons/ui/triumph.png" style="width:26px; height:26px;"><strong><br>Gloria</strong> \
					<p style="width:80px;">Max: ' + infos['maxTriumph'] + '</p> \
					<p style="width:80px;">Med: <em>' + (infos['totalTriumph']/infos['nbrGames']).toFixed(1) + '</em></p> \
					<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos['totalTriumph'] + '</p> \
				</li>';
	// Researches
	tabHtml +=	'<li class="nova" style="font-size:100%; width:80px; font-variant:small-caps;"> \
					<img src="/img/icons/ui/microsc.png" style="width:26px; height:26px;"><strong><br>Investigaciones</strong> \
					<p style="width:80px;">Max: ' + infos['maxSearch'] + '</p> \
					<p style="width:80px;">Med: <em>' + (infos['totalSearch']/infos['nbrGames']).toFixed(1) + '</em></p> \
					<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos['totalSearch'] + '</p> \
				</li>';
	// Projects
	tabHtml +=	'<li class="nova" style="font-size:100%; width:80px; font-variant:small-caps;"> \
					<img src="/img/icons/ui/conceptor.png" style="width:26px; height:26px;"><strong><br>Proyectos</strong> \
					<p style="width:80px;">Max: ' + infos['maxProjects'] + '</p> \
					<p style="width:80px;">Med: <em>' + (infos['totalProjects']/infos['nbrGames']).toFixed(1) + '</em></p> \
					<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos['totalProjects'] + '</p> \
				</li>';
	// Planets
	tabHtml +=	'<li class="nova" style="font-size:100%; width:80px; font-variant:small-caps;"> \
					<img src="/img/icons/ui/planet.png" style="width:26px; height:26px;"><strong><br>Planetas</strong> \
					<p style="width:80px;">Max: ' + infos['maxPlanetsScan'] + '</p> \
					<p style="width:80px;">Med: <em>' + (infos['totalPlanetsScan']/infos['nbrGames']).toFixed(1) + '</em></p> \
					<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos['totalPlanetsScan'] + '</p> \
				</li>';
	// Expeditions
	tabHtml +=	'<li class="nova" style="font-size:100%; width:80px; font-variant:small-caps;"> \
					<img src="/img/icons/ui/survival.png" style="width:26px; height:26px;"><strong><br>Exploraciones</strong> \
					<p style="width:80px;">Max: ' + infos['maxExplo'] + '</p> \
					<p style="width:80px;">Med: <em>' + (infos['totalExplo']/infos['nbrGames']).toFixed(1) + '</em></p> \
					<p style="width:80px; color:#17195B; font-weight:bold;">Tot: ' + infos['totalExplo'] + '</p> \
				</li>';

	tabHtml +=	'</ul>';
    tabHtml +=	'<ul>';

	// Characters stats
	tabHtml +=	'<li class="score" style="margin-left: 10px;"><table class="summar" style="display: inline-block;"> \
				<caption>Personajes</caption> \
				<tbody> \
					<tr>\
						<th>Personaje</th> \
						<th>Naves jugadas</th> \
					</tr> ';
			for(var c in infos['charaSorted'])
			{
				var l = infos['charaSorted'][c].length;
				for(var k =0; k < l; k++)
				{
					tabHtml += '<tr> \
						<td><img class="char ' + charaToClassChar(infos['charaSorted'][c][k][1]) + '" src="/img/design/pixel.gif" > \
						<span class="charname">' + infos['charaSorted'][c][k][1] + '</span></td> \
						<td>' + infos['charaSorted'][c][k][0] + ' (<em>' + (100*infos['charaSorted'][c][k][0]/infos['nbrGames']).toFixed(2) + ' %</em>)</td> \
					</tr>';
				}
			} 
			tabHtml += '</tbody></table></li>';
	// Dies stats
    tabHtml +=	'<li class="score scoremush" style="float: right; margin-right: 45px;"><table style="display: inline-block;" class="summar"> \
				<caption>Muertes</caption> \
				<tbody> \
					<tr>\
						<th>Causa de muerte</th> \
						<th>Número de decesos</th> \
					</tr> \
				';
			for(var d in infos['deathSorted'])
			{
				var l = infos['deathSorted'][d].length;
				for(var k =0; k < l; k++)
				{
					tabHtml += '\
					<tr> \
						<td>' + infos['deathSorted'][d][k][1] + '</td> \
						<td>' + infos['deathSorted'][d][k][0] + ' (<em>' + (100*infos['deathSorted'][d][k][0]/infos['nbrGames']).toFixed(2) + ' %</em>)</td> \
					</tr>';
				}
			}
		tabHtml += '\
				</tbody> \
			</table></li> \
			</ul> \
		</div>';

	$('#profile > div.column2 > div.data > .bgtablesummar:last').after(tabHtml);
	
	$('#nShip').keyup(function( event ) {
        if (event.which == 13 || event.keyCode == 13) {
			var n = document.getElementById('nShip').value; //alert(n);
			Analyse_Init(n);
        }
        return false;
	});
}

function Analyse_Analyse(n)
{
	var infos = new Array();
	infos['totalDay'] = 0;
	infos['maxDay'] = 0;
	infos['minDay'] = -1;
	infos['totalSearch'] = 0;
	infos['maxSearch'] = 0;
	infos['minSearch'] = -1;
	infos['totalProjects'] = 0;
	infos['maxProjects'] = 0;
	infos['minProjects'] = -1;
	infos['totalPlanetsScan'] = 0;
	infos['maxPlanetsScan'] = 0;
	infos['minPlanetsScan'] = -1;
	infos['totalExplo'] = 0;
	infos['maxExplo'] = 0;
	infos['minExplo'] = -1;
	infos['totalTriumph'] = 0;
	infos['maxTriumph'] = 0;
	infos['minTriumph'] = -1;
	infos['allDeaths'] = new Array();
	infos['allCharacters'] = new Array();
	
	infos['nbrGames'] = 0 ; //Nbr de parties
	infos['nbrGamesBeta'] = 0; //Parties en Beta
	
	$('#cdTrips > table.summar > tbody > tr.cdTripEntry').each(function(index,elem){
		//Character, Day, Explo, search, projets, scan, titres, triomphe, mort, vaisseau
		var death = $(this).children('td:eq(8)').text();
		
		if(n == 0 || infos['nbrGames'] < n)
		{
			if(death != 'No hay ayuda disponible')
			{
				infos['nbrGames']++;
				
				if(infos['allDeaths'][death] > 0)
				{
					infos['allDeaths'][death]++;
				}
				else
				{
					infos['allDeaths'][death] = 1;
				}
				
				var character = $(this).children('td:eq(0)').children('span.charname').text();
				
				if(infos['allCharacters'][character] > 0)
				{
					infos['allCharacters'][character]++;
				}
				else
				{
					infos['allCharacters'][character] = 1;
				}
/*
                if (infos['max'] < parseInt()) {
					infos['max'] = parseInt();
                }
                if ((infos['min'] > parseInt()) || (infos['min'] == -1)) {
					infos['min'] = parseInt();
                }
*/
				var d = $(this).children('td:eq(1)').text();
                if (infos['maxDay'] < parseInt(d)) {
					infos['maxDay'] = parseInt(d);
                }
                if ((infos['minDay'] > parseInt(d))||(infos['minDay'] == -1)) {
					infos['minDay'] = parseInt(d);
                }
				infos['totalDay'] += parseInt(d);
				
				var e = $(this).children('td:eq(2)').text();
                if (infos['maxExplo'] < parseInt(e)) {
					infos['maxExplo'] = parseInt(e);
                }
                if ((infos['minExplo'] > parseInt(e)) || (infos['minExplo'] == -1)) {
					infos['minExplo'] = parseInt(e);
                }
				infos['totalExplo'] += parseInt(e);
				
				var s = $(this).children('td:eq(3)').text();
                if (infos['maxSearch'] < parseInt(s)) {
					infos['maxSearch'] = parseInt(s);
                }
                if ((infos['minSearch'] > parseInt(s)) || (infos['minSearch'] == -1)) {
					infos['minSearch'] = parseInt(s);
                }
				infos['totalSearch'] += parseInt(s);
				
				var p = $(this).children('td:eq(4)').text();
                if (infos['maxProjects'] < parseInt(p)) {
					infos['maxProjects'] = parseInt(p);
                }
                if ((infos['minProjects'] > parseInt(p)) || (infos['minProjects'] == -1)) {
					infos['minProjects'] = parseInt(p);
                }
				infos['totalProjects'] += parseInt(p);
				
				var sc = $(this).children('td:eq(5)').text();
                if (infos['maxPlanetsScan'] < parseInt(sc)) {
					infos['maxPlanetsScan'] = parseInt(sc);
                }
                if ((infos['minPlanetsScan'] > parseInt(sc)) || (infos['minPlanetsScan'] == -1)) {
					infos['minPlanetsScan'] = parseInt(sc);
                }
				infos['totalPlanetsScan'] += parseInt(sc);
				
				var t = $(this).children('td:eq(7)').text();
                if (infos['maxTriumph'] < parseInt(t)) {
					infos['maxTriumph'] = parseInt(t);
                }
                if ((infos['minTriumph'] > parseInt(t)) || (infos['minTriumph'] == -1)) {
					infos['minTriumph'] = parseInt(t);
                }
				infos['totalTriumph'] += parseInt(t);
			}
			else
			{
				infos['nbrGamesBeta']++;
			}
		}
			
	}); 
	
	//Trie morts/persos
	infos['charaSorted'] = new Array();
	for(var c in infos['allCharacters'])
	{
		infos['charaSorted'][infos['allCharacters'][c]] = new Array();
	}
	
	for(var c in infos['allCharacters'])
	{
		infos['charaSorted'][infos['allCharacters'][c]].push(new Array(infos['allCharacters'][c], c));
	}
	
	infos['charaSorted'].sort(function(a,b){return a - b});
	
	infos['deathSorted'] = new Array();
	for(var d in infos['allDeaths'])
	{
		infos['deathSorted'][infos['allDeaths'][d]] = new Array();
	}
	
	for(var d in infos['allDeaths'])
	{
		infos['deathSorted'][infos['allDeaths'][d]].push(new Array(infos['allDeaths'][d], d));
	}
	
	infos['deathSorted'].sort(function(a,b){return a - b});
	
	
	return infos;
}

function Analyse_Init(n)
{
	if(isNaN(n) || n === null) { n = 0; }
	
	$('#AnalyseProfile_Result').remove();
	
	Analyse_AddTable(n);
	//alert('Test');
}

Analyse_Init(0);
