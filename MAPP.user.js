// ==UserScript==
// @name Mush Analyse Profile
// @description Script Mush para los Perfiles (updated by Javiernh)
// @downloadURL https://raw.github.com/Javiernh/Mush-Analyse-Profile/master/MAP.user.js
// @include http://mush.twinoid.*/u/profile/*
// @include http://mush.vg/u/profile/*
// @include http://mush.twinoid.*/me*
// @include http://mush.vg/me*
// @connect self
// @require http://code.jquery.com/jquery-latest.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require https://raw.github.com/Javiernh/MESH/master/lib/i18next.js
// @grant GM_xmlhttpRequest
// @grant GM_getResourceText
// @resource css https://raw.github.com/Javiernh/Mush-Analyse-Profile-Plus/beta/MAPP.css
// @resource translation:es https://raw.github.com/Javiernh/Mush-Analyse-Profile-Plus/beta/locales/es/translation.json
// @resource translation:en https://raw.github.com/Javiernh/Mush-Analyse-Profile-Plus/beta/locales/en/translation.json
// @resource translation:fr https://raw.github.com/Javiernh/Mush-Analyse-Profile-Plus/beta/locales/fr/translation.json
// @version	1.3.1b
// ==/UserScript==
/* jshint multistr: true */

( function() {
    'use strict';

	String.prototype.capitalize = function() {
		return this.replace( "_", " " ).replace( /(?:^|\s)\S/g, function( a ) {
			return a.toUpperCase();
		});
	};

	$.prototype.addtip = function() {
		// console.debug( "Entering 'addtip' function." );
		var args = arguments[ 0 ];
		var html = "'<div class=\\'tiptop\\'><div class=\\'tipbottom\\'><div class=\\'tipbg\\'><div class=\\'tipcontent\\'><h1>" +
					( args.tiptitle ? args.tiptitle : "" ) + "</h1>" + ( args.tipdesc ? args.tipdesc : "" ) +
					"</div></div></div></div>'";
		return this.attr( "onmouseout", "Main.hideTip();" ).attr( "onmouseover", "Main.showTip(this, " + html + ")" );
	};

	var wait;
	var MAP = {
		title: GM_info.script.name.match( /\b(\w)/g ).join( "" ) + " v" + GM_info.script.version,
		URL: "http://" + document.domain,
		Path: location.pathname,
		selectors: {},

		data: { // TODO
			keys: { days: "slow_cycle", explo: "survival", rsrch: "microsc", proj: "conceptor", scann: "planet", glory: "triumph", HD: "hunter", SG: "spore", NM: "triple_play", RB: "comm", title: "title_02", nomush: "no_mush_bar", chars: "politician", death: "dead", ship: "gold" },

			heroes: { jinsu: "jin_su", frieda: "frieda", kuanti: "kuan_ti", janice: "janice", roland: "roland", hua: "hua", paola: "paola", chao: "chao", finola: "finola", stephen: "stephen", ian: "ian", chun: "chun", raluca: "raluca", gioele: "gioele", eleesha: "eleesha", terrence: "terrence", andie: "andie", derek: "derek" },

			/* To cycles extraction purposes */
			heroLog: { jinsu: "KIM_JIN_SU", frieda: "FRIEDA_BERGMANN", kuanti: "LAI_KUAN_TI", janice: "JANICE_KENT", roland: "ROLAND_ZUCCALI", hua: "JIANG_HUA", paola: "PAOLA_RINALDO", chao: "WANG_CHAO", finola: "FINOLA_KEEGAN", stephen: "STEPHEN_SEAGULL", ian: "IAN_SOULTON", chun: "ZHONG_CHUN", raluca: "RALUCA_TOMESCU", gioele: "GIOELE_RINALDO", eleesha: "ELEESHA_WILLIAMS", terrence: "TERRENCE_ARCHER", andie: "ANDIE_GRAHAM", derek: "DEREK_HOGAN" },

			parameters: {}, voyages: {},

			analysis: { heroes: { jinsu: {}, frieda: {}, kuanti: {}, janice: {}, roland: {}, hua: {}, paola: {}, chao: {}, finola: {}, stephen: {}, ian: {}, chun: {}, raluca: {}, gioele: {}, eleesha: {}, terrence: {}, andie: {}, derek: {} }, days: 0, tot_days: 0, explo: 0, tot_explo: 0, rsrch: 0, tot_rsrch: 0, proj: 0, tot_proj: 0, scann: 0, tot_scann: 0, glory: 0, tot_glory: 0, HD: 0, tot_HD: 0, NM: 0, tot_NM: 0, RB: 0, tot_RB: 0, SG: 0, tot_SG: 0, death: {}, Qty: 0 },

			reset: function() {
				// console.debug( "Entering data 'reset' function." );
				for ( var key in this ) {
					if ( typeof this[ key ] == "number" ) this[ key ] = 0;
					else if ( typeof this[ key ] == "object" ) {
						for ( var key2 in this[ key ] ) {
							this[ key ][ key2 ] = typeof this[ key ][ key2 ] == "object" ? {} : 0;
						}
					}
				}
			}
		},

		getResource: function( resourceName ) {
			// console.debug( "Entering 'getResource' function." );
			try {
				var resourceText = GM_getResourceText( resourceName );
				if ( resourceText === null ) throw "The resource '" + resourceName + "' does not exists or the file is empty.";
				return resourceText;
			} catch( err ) {
				console.error( "ERROR:", err );
			}
		},

		language: function() {
			// console.debug( "Entering 'language' function." );
			switch ( document.domain ) {
				/* Spanish */
				case "mush.twinoid.es":
					return "es";
				/* English */
				case "mush.twinoid.com":
					return "en";
				/* French */
				case "mush.twinoid.fr":
				case "mush.vg":
					return "fr";
			}
		},

		translate: function( translateText, language ) {
			// console.debug( "Entering 'translate' function." );
			var translateData = JSON.parse( translateText );
			i18next.init( translateData );
			i18next.changeLanguage( language );
		},

		css: function() {
			// console.debug( "Entering 'css' function." );
			for ( var i in arguments ) {
				if ( typeof( arguments[ i ] ) == "object" ) {
					$( "<style>" ).attr({ "id": arguments[ i ].id, "type": "text/css" }).html( arguments[ i ].text ).appendTo( "head" );
				} else if ( typeof( arguments[ i ] ) == "string" ) {
					$( "<style>" ).attr({ "type": "text/css" }).html( arguments[ i ] ).appendTo( "head" );
				} else console.error( "Type of 'text/css' style not valid." );
			}
		},

		tab: function() {
			// console.debug( "Entering 'tab' function." );
			var tabAttr = [];
			for ( var i in arguments ) {
				tabAttr.push( " $(\'.cdTabTgt\').hide(); $(\'#" + arguments[ i ].id + "\').show(); $(this).addClass(\'active\'); $(this).siblings().removeClass(\'active\'); _tid.onLoad(); return false" );

				/* Create <li> for each tab needed */
				$( "<li>" ).text( arguments[ i ].title )
				.attr( { "id": arguments[ i ].id + "tab", "onclick": tabAttr[ i ] } )
				.addClass( function() {
					if ( arguments.length > 1 && i === 0 ) return "cdTab active";
					else return "cdTab";
				})
				.appendTo( "ul.mtabs" );
			}
		},

		createBox: function() {
			// console.debug( "Entering 'createBox' function." );
			var args = arguments;
			try {
				if ( args.length > 1 ) throw "Only 1 argument is accepted.";
				if ( typeof( args[ 0 ] ) !== "object" ) throw "Argument type is not an object.";
				if ( args[ 0 ].addTo === undefined ) throw "Cannot read property 'addTo' in argument.";
				var box = $( "<div>" ).addClass( "bgtablesummar" ).appendTo( args[ 0 ].addTo ),
					inbox = $( "<div>" ).addClass( "twinstyle" ).appendTo( box ),
					header = $( "<h3>" ).appendTo( inbox ),
					boxContent = $( "<div>" ).addClass( "boxContent" ).appendTo( inbox );
				$( "<div>" ).addClass( "cornerright" ).text( args[ 0 ].title ).appendTo( header );
				if ( args[ 0 ].visibility ) boxContent = $( "<ul>" ).appendTo( boxContent );
				box = ( args[ 0 ].visibility == "hide" ) ? box.hide() : box;
				return boxContent;
			} catch( err ) {
				console.error( "ERROR: Execution of 'createBox' function failed! " + err );
			}
		},

/* 		addtip: function() {
			// console.debug( "Entering 'addtip' function." );
			var args = arguments[ 0 ];
			var html = "'<div class=\\'tiptop\\'><div class=\\'tipbottom\\'><div class=\\'tipbg\\'><div class=\\'tipcontent\\'><h1>" +
						( args.tiptitle ? args.tiptitle : "" ) + "</h1>" + ( args.tipdesc ? args.tipdesc : "" ) +
						"</div></div></div></div>'";
			this.attr( "onmouseout", "Main.hideTip();" ).attr( "onmouseover", "Main.showTip(this, " + html + ")" );
		},
 */
		slider: function() {
			// console.debug( "Entering 'slider' function." );
			var args = arguments[ 0 ], __method = this,
				sliderbar = $( "<div>" ).appendTo( args.addTo ),
				amountL = $( "<input readonly>" ).attr( "type", "text" ).css( "text-align", "right" ).appendTo( sliderbar ),
				compframe = $( "<div>" ).addClass( "compframe" ).appendTo( sliderbar ),
				amountR = $( "<input readonly>" ).attr( "type", "text" ).css( "text-align", "left" ).appendTo( sliderbar );

			/* Create a range slider to select the ships to be analyzed */
			var div = $( "<div>" ).addClass( args.slideClass )//.css( { "display": "inline-block", "width": "90%" } )
				.appendTo( compframe );
			$( "<div>" ).addClass( "map-handle-left ui-slider-handle" ).appendTo( div );
			$( "<div>" ).addClass( "map-handle-right ui-slider-handle" ).appendTo( div );
			var handleL = $( ".map-handle-left" ),
				handleR = $( ".map-handle-right" );
			div.slider({
				range: true,
				min: 0,
				max: args.max,
				values: [ 0, ( args.max < 10 ) ? args.max : 10 ],
				create: function() {
					// handleL.text( $( this ).slider( "values", 0 ) );
					// handleR.text( $( this ).slider( "values", 1 ) );
					amountL.val( $( this ).slider( "values", 0 ) );
					amountR.val( $( this ).slider( "values", 1 ) );
				},
				slide: function( event, ui ) {
					var minAnalysis = 1;
					if ( ui.values[ 1 ] - ui.values[ 0 ] < minAnalysis ) return false;
					// handleL.text( ui.values[ 0 ] );
					// handleR.text( ui.values[ 1 ] );
					amountL.val( ui.values[ 0 ] );
					amountR.val( ui.values[ 1 ] );
				},
			});
			// $( ".map-handle-left" ).val( div.slider( "values", 0 ));
			// $( ".map-handle-right" ).val( div.slider( "values", 1 ));
			amountL.val( div.slider( "values", 0 ));
			amountR.val( div.slider( "values", 1 ));
			return div;
		},

		button: function() {
			// console.debug( "Entering 'button' function." );
			var __method = this, args = arguments;
			var but = $( "<div>" ).addClass( "action but" );
			var butbr = $( "<div>" ).addClass( "butright" ).appendTo( but );
			var butbg = $( "<div>" ).addClass( "butbg" ).appendTo( butbr );

			var buta = $( "<a>" ).attr( "href", args[ 0 ].href ? args[ 0 ].href : "#" ).html( args[ 0 ].content ).appendTo( butbg )
			.on( "click", args[ 0 ].onclick ? args[ 0 ].onclick : args[ 0 ].href ? null : function() { return false; });

	/*		if ( args[ 0 ].href !== null && args[ 0 ].href.indexOf( document.domain ) ){
				buta.attr( "target", "_blank" );
			}
	*/
			return but;
		},

		confLine: function() { // TODO
			// console.debug( "Entering 'confLine' function." );
			/* Selector same as casting selecting options */
			var __method = this, args = arguments[ 0 ];

			var param = __method.data.parameters[ args.parameter ] = args.value;
			var div = $( "<div>" )
					.addClass( "confLine" )
					.appendTo( args.addTo );
			$( "<img>" )
				.attr( "src", args.img )
				.appendTo( div );
			var yesnoblock = $( "<div>" )
					.addClass( "yesnoblock" )
					.on( "click", function() {
						$( this ).children( "img:last" ).toggleClass( "opt_act" );
						param = __method.data.parameters[ args.parameter ] = $( this ).children( "img:last" ).is( ".opt_act" );
					})
					.on( "click", args.onclick ? args.onclick : function() { return false; })
					.appendTo( div );
			$( "<img>" )
				.attr( "src", "/img/design/switch_bg.gif" )
				.addClass( "inl-blck" )
				.appendTo( yesnoblock );
			$( "<img>" )
				.attr( "src", "/img/design/switch.png" )
				.addClass( "mask inl-blck" )
				.addClass( function() {
					if ( args.value ) return "opt_act";
				})
				.appendTo( yesnoblock );
			return div;
		},

		analysis: function( cdTripEntry, shipID ) {
			// console.debug( "Entering 'analysis' function." );
			var __method = this, __voyages = this.data.voyages, __analysis = this.data.analysis, __heroes = __analysis.heroes,
				__param = this.data.parameters, heroID = cdTripEntry.children[ 0 ].textContent.trim().toLowerCase().replace( " ", "" );

			/* Load voyages from local data */
			__voyages[ shipID ] = JSON.parse( localStorage.getItem( "MAP_" + shipID ) );

			statements: {
				if ( __param.human === false ) {
					if ( __voyages[ shipID ][ heroID ].MC === 0 ) break statements;
				}
				if ( __param.mush === false ) {
					if ( __voyages[ shipID ][ heroID ].MC > 0 ) break statements;
				}
				if ( __param.casting === false ) {
					if ( __voyages[ shipID ].ST == "casting" ) break statements;
				}
				if ( __param.random === false ) {
					if ( __voyages[ shipID ].ST == "random" ) break statements;
				}

				/* Heroes' used list */
				if ( __analysis.heroName ) {
					if ( __analysis.heroName[ heroID] > 0 ) __analysis.heroName[ heroID ]++;
					else __analysis.heroName[ heroID ] = 1;
				} else __analysis.heroName = {};

				/* Human Cycles (HC) */
				__heroes[ heroID ].HC = ( __heroes[ heroID ].HC > 0 ) ? __heroes[ heroID ].HC + ( +__voyages[ shipID ][ heroID ].HC ) : +__voyages[ shipID ][ heroID ].HC;

				/* Mush Cycles (MC) */
				__heroes[ heroID ].MC = ( __heroes[ heroID ].MC > 0 ) ? __heroes[ heroID ].MC + ( +__voyages[ shipID ][ heroID ].MC ) : +__voyages[ shipID ][ heroID ].MC;

				/* Hunters defeated (HD) */
				if ( __analysis.HD < __voyages[ shipID ].HD ) __analysis.HD = __voyages[ shipID ].HD;
				__analysis.tot_HD += __voyages[ shipID ].HD;

				/* Spores generated (SG) */
				if ( __analysis.SG < __voyages[ shipID ].SG ) __analysis.SG = __voyages[ shipID ].SG;
				__analysis.tot_SG += __voyages[ shipID ].SG;

				/* Number of Mush (NM) */
				if ( __analysis.NM < __voyages[ shipID ].NM ) __analysis.NM = __voyages[ shipID ].NM;
				__analysis.tot_NM += __voyages[ shipID ].NM;

				/* Rebel bases contacted (RB) */
				if ( __analysis.RB < __voyages[ shipID ].RB ) __analysis.RB = __voyages[ shipID ].RB;
				__analysis.tot_RB += __voyages[ shipID ].RB;

				/* Get character name */
				__voyages[ shipID ].heroName = cdTripEntry.children[ 0 ].textContent.trim();

				/* Heroes' voyages number (VN) */
				__heroes[ heroID ].VN = ( __heroes[ heroID ].VN > 0 ) ? __heroes[ heroID ].VN + 1 : 1;

				/* Get ship max and total days */
				// __voyages[ shipID ].days = + cdTripEntry.children[ 1 ].textContent;
				// __analysis.tot_days += __voyages[ shipID ].days;
				var n = __voyages[ shipID ].days = ( __voyages[ shipID ][ heroID ].HC + __voyages[ shipID ][ heroID ].MC ) / 8;
				if ( __analysis.days < n ) __analysis.days = parseFloat( Math.floor( n ) + "." + (( n * 8 ) % 8 ));
				__analysis.tot_days += ( __voyages[ shipID ][ heroID ].HC + __voyages[ shipID ][ heroID ].MC ) / 8;

				/* Get explorations number and total */
				__voyages[ shipID ].explo = + cdTripEntry.children[ 2 ].textContent;
				if ( __analysis.explo < __voyages[ shipID ].explo ) __analysis.explo = __voyages[ shipID ].explo;
				__analysis.tot_explo += __voyages[ shipID ].explo;

				/* Get researches number and total */
				__voyages[ shipID ].rsrch = + cdTripEntry.children[ 3 ].textContent;
				if ( __analysis.rsrch < __voyages[ shipID ].rsrch ) __analysis.rsrch = __voyages[ shipID ].rsrch;
				__analysis.tot_rsrch += __voyages[ shipID ].rsrch;

				/* Get Neron projects number and total */
				__voyages[ shipID ].proj = + cdTripEntry.children[ 4 ].textContent;
				if ( __analysis.proj < __voyages[ shipID ].proj ) __analysis.proj = __voyages[ shipID ].proj;
				__analysis.tot_proj += __voyages[ shipID ].proj;

				/* Get planets scanned number and total */
				__voyages[ shipID ].scann = + cdTripEntry.children[ 5 ].textContent;
				if ( __analysis.scann < __voyages[ shipID ].scann ) __analysis.scann = __voyages[ shipID ].scann;
				__analysis.tot_scann += __voyages[ shipID ].scann;

				/* Get titles at the end of the ship:
				 * title_01 (Commander), title_02 (Neron Admin), title_03 (COM Officer) */
				__voyages[ shipID ].title = cdTripEntry.children[ 6 ].innerHTML.match( /title_\d\d/g );

				/* Get glory quantity at the end of the ship and total */
				__voyages[ shipID ].glory = parseInt( cdTripEntry.children[ 7 ].textContent );
				if ( __analysis.glory < __voyages[ shipID ].glory ) __analysis.glory = __voyages[ shipID ].glory;
				__analysis.tot_glory += __voyages[ shipID ].glory;

				/* Get cause of death */
				var cod = __voyages[ shipID ].death = cdTripEntry.children[ 8 ].textContent;
				__analysis.death[ cod ] = ( __analysis.death[ cod ] > 0 ) ? __analysis.death[ cod ] + 1 : 1;
			}

			// localStorage.removeItem("MAP_" + shipID);
			// console.group( "- localStorage " + shipID );
			// console.debug( "Voyages: %O", __voyages[ shipID ] );
			// console.debug( "Analyse: %O", __analysis );
			// console.groupEnd();

			++__analysis.Qty;
			var check = __analysis.Qty + __analysis.skip;
			if ( __voyages.Qty == check ) {
				clearTimeout( wait );
				$( "#start img" ).attr( "src", "/img/icons/ui/pa_comp.png" );
				__method.display.call( __method );
				__analysis.Qty = 0;
				__analysis.skip = 0;
			}
		},

		setup: function( cdTripEntry, index ) {
			// console.debug( "Entering 'setup' function." );
			var __method = this,
				__data = this.data,
				obj = {};
			/* Get ship ID */
			var shipID = cdTripEntry.children[ 9 ].firstElementChild.getAttribute( "href" ).replace( "/theEnd/", "" );
			
			// localStorage.removeItem("MAP_" + shipID); // TODO: Make button to remove localStorage
			
			/* Checking if there is localStorage for ship number */
			if ( localStorage.getItem( "MAP_" + shipID ) === null ) {
				GM_xmlhttpRequest({
					method: "GET",
					url: "http://" + document.domain + "/theEnd/" + shipID,
					onload: function( response ) {
						console.group( "- GM_xmlhttpRequest " + shipID );
						var $content = $( response.responseText.replace( /^[\s\S]*<body.*?>|<\/body>[\s\S]*$|\s{2,}/g, "" ) ),
							$destroyed = $content.find( "#destroyed" ).find( "tbody:first > tr:eq(1)" );
						/* Ship Type (ST): casting or random */
						obj.ST = ( $content.find( "#producer" ).length > 0 ) ? "casting" : "random";
						/* Hunters Defeated (HD) */
						obj.HD = + $destroyed.find( "td:eq(2)" ).text();
						/* Spores Generated (SG) */
						obj.SG = + $destroyed.find( "td:eq(3)" ).text();
						/* Number of Mush (NM) */
						obj.NM = + $destroyed.find( "td:eq(4)" ).text();
						/* Rebel Bases contacted (RB) */
						obj.RB = + $destroyed.find( "td:eq(5)" ).text();
						/* Number of cycles being human or mush */
						$.each( __data.heroLog, function( heroID, charDialogID ) {
							var hc = 0, mc = 0,
								mushuman = $content.find( "#myDialog_" + charDialogID ).find( "tr:eq(1) td:eq(1) li" );
							$( mushuman ).each( function( ind, elem ) {
								var humain = elem.textContent.search( /(Ciclo Humano|Human Cycle|Cycle Humain)/i ),
									mush = elem.textContent.search( /(Ciclo Mush|Mush Cycle|Cycle Mush)/i );
								/* Get Human Cycles (hc) from all heroes Dialog */
								if ( humain != -1 ) hc += parseInt( elem.textContent.trim().replace( /\sx[\s\S]*$|\s{2,}/g, "" ) );
								/* Get Mush Cycles (mc) from all heroes Dialog */
								if ( mush != -1 ) mc += parseInt( elem.textContent.trim().replace( /\sx[\s\S]*$|\s{2,}/g, "" ) );
							});
							obj[ heroID ] = {};
							obj[ heroID ].HC = hc;
							obj[ heroID ].MC = mc;
						});
						console.debug( JSON.stringify( obj ) );
						/* Store voyages data locally */
						localStorage.setItem( "MAP_" + shipID, JSON.stringify( obj ) );
						__method.analysis( cdTripEntry, shipID );
						console.groupEnd();
					}
				}); // END - GM_xmlhttpRequest
			} else __method.analysis( cdTripEntry, shipID );
		},

		createMedal: function( medal, img, key ) {
			// console.debug( "Entering 'createMedal' function." );
			var __data =  this.data, __voyages = this.data.voyages, __analysis = this.data.analysis, __heroes = __analysis.heroes,
				div = $( "<li>" );
				//div = $( "<div>" ).appendTo( li );
			switch ( medal ) {
				case "goldmedal":
					$( "<img>" ).attr( "src", "/img/icons/ui/" + img + ".png" ).appendTo( div );
					$( "</br>" ).appendTo( div );
					$( "<strong>" ).addClass( "li_title" ).text( i18next.t( key ) ).appendTo( div );
					$( "<p>" ).css( "padding-top", "3px" ).text( "max: " +  __analysis[ key ] ).appendTo( div );
					var gAvg = $( "<p>" ).text( i18next.t( "average" ) ).appendTo( div );
					if ( key == "days" ) {
						var n = __analysis.tot_days / +__analysis.Qty;
						__analysis.tot_days = parseFloat( Math.floor( n ) + "." + (( n * 8 ) % 8 ));
						$( "<em>" ).text( ( __analysis[ "tot_" + key ] ).toFixed( 1 ) ).appendTo( gAvg );
					} else $( "<em>" ).text( ( __analysis[ "tot_" + key ] / +__analysis.Qty ).toFixed( 1 ) ).appendTo( gAvg );
					break;
				case "bluemedal": case "rubymedal":
					var character = img,
						heroID = key,
						bodychar = $( "<div>" ).addClass( "bodychar " + character ).appendTo( div ),
						hero = $( "<div>" ).appendTo( div );
					$( "<strong>" ).addClass( "li_title" ).text( character.capitalize() ).appendTo( hero );
					var stats = $( "<div>" ).appendTo( div );
					/* Number of Cycles ( Human / Mush ) */
					if ( __data.parameters.mush && !__data.parameters.human ) {
						$( "<p>" ).text( i18next.t( "cycles" ) + ( __heroes[ heroID ].MC ) ).appendTo( stats );
					} else if ( __data.parameters.mush && __data.parameters.human ) {
						medal = ( __heroes[ heroID ].MC > __heroes[ heroID ].HC ) ? "rubymedal" : medal;
						$( "<p>" ).text( i18next.t( "cycles" ) + ( __heroes[ heroID ].HC + __heroes[ heroID ].MC ) ).appendTo( stats );
					} else {
						$( "<p>" ).text( i18next.t( "cycles" ) + ( __heroes[ heroID ].HC /* + __heroes[ heroID ].MC */ ) ).appendTo( stats );
					}
					/* Number of voyages */
					$( "<p>" ).text( i18next.t( "voyages" ) + __heroes[ heroID ].VN ).appendTo( stats );
					var bAvg = $( "<p>" ).appendTo( stats );
					$( "<em>" ).text( (( __heroes[ heroID ].VN / __analysis.Qty ) * 100 ).toFixed( 2 ) + "%" ).appendTo( bAvg );
					break;
				case "deathmedal":
					var death = img;
					$( "<p>" ).addClass( "stroke" ).text( __analysis.death[ death ] ).appendTo( div );
					var dead = $( "<p>" ).addClass( "li_title" ).appendTo( div );
					$( "<strong>" ).text( death ).appendTo( dead );
			}
			// return li;
			return div.addClass( medal );
		},

		keysSortedBy: function( order, sortedBy ) {
			var __method = this;
			if ( __method[ sortedBy ] === undefined ) {
				return Object.keys( __method ).sort( function( a, b ) {
					return ( order.toLowerCase().startsWith( "asc" ) ) ?
						__method[ a ][ sortedBy ] - __method[ b ][ sortedBy ] : ( order.toLowerCase().startsWith( "desc" ) ) ?
						__method[ b ][ sortedBy ] - __method[ a ][ sortedBy ] : console.warn( "Order not selected." );
				});
			} else {
				return Object.keys( __method[ sortedBy ] ).sort( function( a, b ) {
					return ( order.toLowerCase().startsWith( "asc" ) ) ?
						__method[ sortedBy ][ a ] - __method[ sortedBy ][ b ] : ( order.toLowerCase().startsWith( "desc" ) ) ?
						__method[ sortedBy ][ b ] - __method[ sortedBy ][ a ] : console.warn( "Order not selected." );
				});
			}
		},

		display: function() {
			var __method = this, __data = this.data, __sels = this.selectors, __analysis = this.data.analysis;
			if ( __analysis.Qty === 0 ) return false;
			/* Create gold medals */
			for ( var key in __data.keys ) {
				var imgsrc = { days: "slow_cycle", explo: "survival", rsrch: "microsc", proj: "conceptor", scann: "planet", glory: "triumph" };
				if ( key === "title" ) break;
				if ( key == "days" ) {
					var daytoicon = parseInt( __data.analysis.days / 5 ) * 5;
					__data.keys.days = ( daytoicon == 25 ) ? "day20" : ( daytoicon !== 0 ) ? "day" + daytoicon : __data.keys.days;
				}
				// var goldmedal = __method.createMedal( "goldmedal", imgsrc[ key ], key );
				var goldmedal = __method.createMedal( "goldmedal", __data.keys[ key ], key );
				goldmedal.appendTo( __sels.ships );
			}

			/* Create blue medals */
			var arr_heroName = __method.keysSortedBy.call( __analysis.heroes, "desc", "VN" );
			for ( var hero in arr_heroName ) {
				if ( __analysis.heroes[ arr_heroName[ hero ] ].VN === undefined ) continue;
				var charmedal = ( __data.parameters.mush && !__data.parameters.human ) ?
				__method.createMedal( "rubymedal", __data.heroes[ arr_heroName[ hero ]], arr_heroName[ hero ] ):
				__method.createMedal( "bluemedal", __data.heroes[ arr_heroName[ hero ]], arr_heroName[ hero ] );
				// var bluemedal = __method.createMedal( "bluemedal", __data.heroes[ arr_heroName[ hero ]], arr_heroName[ hero ] );
				charmedal.appendTo( __sels.charac );
			}

			/* Create ruby medals */
			var arr_death = __method.keysSortedBy.call( __analysis, "desc", "death" );
			for ( var dead in arr_death ) {
				if ( __analysis.death[ arr_death[ dead ] ] === 0 ) continue;
				var rubymedal = __method.createMedal( "deathmedal", arr_death[ dead ] , null );
				rubymedal.appendTo( __sels.deaths );
			}
		},

		init: function() {
			// console.debug( "Entering 'init' function." );
			var __method = this, __data = this.data, __sels = this.selectors;

			/* Initialize language */
			var lang = __method.language(),
				dict = __method.getResource( "translation:" + lang );
			__method.translate( dict, lang );

			/* Initialize styleSheets */
			var cssText = __method.getResource( "css" );
			__method.css( { id: "map-style", text: cssText } );

			/* Check if there are tabs to create if necessary */
			var mtabs = document.getElementsByClassName( "mtabs" );
			if ( mtabs.length === 0 ) {
				$( "#maincontainer" ).attr( "style", "margin: 70px auto 0px;" );
				$( "<ul>" ).addClass( "mtabs" ).insertBefore( ".cdTabTgt" );
				__method.tab({
					title: i18next.t( "profile" ),
					id: "profile"
				}, {
					title: i18next.t( "map" ),
					id: "map"
				});
			} else __method.tab({
				title: i18next.t( "map" ),
				id: "map"
			});
			$( "#maptab" ).text( __method.title ).on( "click", function() {
				if ( $( "#map .empty_tid" ).length === 0 ) {
					$( "#profile .empty_tid" ).clone().prependTo( "#map .column" );
					$( "#map div, #map span" ).removeClass( "tid_editable" ).removeAttr( "onedit ondblclick title" );
					$( "#map img.tid_editIcon, #map .tid_headerRight > div:first" ).remove();
				}
				// __method.analysis();
			})
			.removeClass( "cdTab" ).addClass( "gold_tab" );

			/* Creating HTML structure */
			var cdTripEntry = document.getElementsByClassName( "cdTripEntry" ),
				mapbox = $( "<div>" ).attr( "id", "map" ).addClass( "cdTabTgt" ).hide().insertAfter( "#mush_content > div:last" ),
				column = $( "<div>" ).addClass( "column" ).appendTo( mapbox ),
				column2 = $( "<div>" ).addClass( "column2" ).appendTo( mapbox ),
				databox = $( "<div>" ).addClass( "data" ).appendTo( column2 );

			/* Creating Boxes */
			var setfilt = __method.createBox({
					title: i18next.t( "setfiltr" ),
					addTo: "#map .column2 .data",
				});

			__sels.ships = __method.createBox({
				title: i18next.t( "shipstat" ),
				addTo: "#map .column2 .data",
				visibility: "hide"
			});
			__sels.charac = __method.createBox({
				title: i18next.t( "charstat" ),
				addTo: "#map .column2 .data",
				visibility: "hide"
			});
			__sels.deaths = __method.createBox({
				title: i18next.t( "deadstat" ),
				addTo: "#map .column2 .data",
				visibility: "hide"
			});

			/* Creating trip filter */
			__method.slider({
				addTo: setfilt,
				slideClass: "map-slider",
				max: cdTripEntry.length,
			}).addtip({
				tiptitle: i18next.t( "slider" ),
				tipdesc: i18next.t( "slider_desc" )
			});
			/* Creating human filter */
			var ch = __method.confLine({
				addTo: setfilt,
				parameter: "human",
				value: true,
				// img: "/img/icons/ui/whos_ugly.png",
				img: "/img/icons/skills/optimistic.png",
				onclick: function() {
					var a = $( this ).children( "img:last" ), b = cm.children( ".yesnoblock" ).children( "img:last" );
					if ( !a.is( ".opt_act" ) && !b.is( ".opt_act" ) ) {
						b.toggleClass( "opt_act" );
						__method.data.parameters.mush = b.is( ".opt_act" );
					}
				}
			}).addtip({
				tiptitle: i18next.t( "human" ),
				tipdesc: i18next.t( "human_desc" ),
			});
			/* Creating mush filter */
			var cm = __method.confLine({
				addTo: setfilt,
				parameter: "mush",
				value: true,
				// img: "/img/icons/ui/no_mush_bar.png",
				img: "/img/icons/skills/anonymous.png",
				onclick: function() {
					var a = $( this ).children( "img:last" ), b = ch.children( ".yesnoblock" ).children( "img:last" );
					if ( !a.is( ".opt_act" ) && !b.is( ".opt_act" ) ) {
						b.toggleClass( "opt_act" );
						__method.data.parameters.human = b.is( ".opt_act" );
					}
				}
			}).addtip({
				tiptitle: i18next.t( "mush" ),
				tipdesc: i18next.t( "mush_desc" ),
			});
			/* Creating random filter */
			var cr = __method.confLine({
				addTo: setfilt,
				parameter: "random",
				value: true,
				img: "/img/icons/ui/freeticket.png",
				onclick: function() {
					var a = $( this ).children( "img:last" ), b = cc.children( ".yesnoblock" ).children( "img:last" );
					if ( !a.is( ".opt_act" ) && !b.is( ".opt_act" ) ) {
						b.toggleClass( "opt_act" );
						__method.data.parameters.casting = b.is( ".opt_act" );
					}
				}
			}).addtip({
				tiptitle: i18next.t( "random" ),
				tipdesc: i18next.t( "random_desc" ),
			});
			/* Creating casting filter */
			var cc = __method.confLine({
				addTo: setfilt,
				parameter: "casting",
				value: true,
				// img: "/img/icons/ui/ticket_any.png",
				img: "/img/icons/ui/ticket.png",
				onclick: function() {
					var a = $( this ).children( "img:last" ), b = cr.children( ".yesnoblock" ).children( "img:last" );
					if ( !a.is( ".opt_act" ) && !b.is( ".opt_act" ) ) {
						b.toggleClass( "opt_act" );
						__method.data.parameters.random = b.is( ".opt_act" );
					}
				}
			}).addtip({
				tiptitle: i18next.t( "casting" ),
				tipdesc: i18next.t( "casting_desc" ),
			});
			/* Creating ship stat option */
			__method.confLine({
				addTo: setfilt,
				parameter: "shipstat",
				value: false,
				img: "/img/icons/ui/" + __data.keys.ship + ".png",
				onclick: function() { __sels.ships.closest( ".bgtablesummar" ).toggle( "blind", 500 ); }
			}).addtip({
				tiptitle: i18next.t( "shipstat" ),
				tipdesc: i18next.t( "shipstat_desc" ),
			});
			/* Creating char stat option */
			__method.confLine({
				addTo: setfilt,
				parameter: "charstat",
				value: false,
				img: "/img/icons/ui/" + __data.keys.chars + ".png",
				onclick: function() { __sels.charac.closest( ".bgtablesummar" ).toggle( "blind", 500 ); }
			}).addtip({
				tiptitle: i18next.t( "charstat" ),
				tipdesc: i18next.t( "charstat_desc" ),
			});
			/* Creating death stat option */
			__method.confLine({
				addTo: setfilt,
				parameter: "deadstat",
				value: false,
				img: "/img/icons/ui/" + __data.keys.death + ".png",
				onclick: function() { __sels.deaths.closest( ".bgtablesummar" ).toggle( "blind", 500 ); }
			}).addtip({
				tiptitle: i18next.t( "deadstat" ),
				tipdesc: i18next.t( "deadstat_desc" ),
			});

			__data.voyages.Qty = cdTripEntry.length;
			// __data.analysis.skip = 0;

			/* Creating start analysis button */
			__method.button({
				content: "<img src=\"/img/icons/ui/pa_comp.png\" style=\"height: 16px\"> " + i18next.t( "analyze" ),
				onclick: function() {
					var min = $( ".map-slider" ).slider( "values", 0 ),
						max = $( ".map-slider" ).slider( "values", 1 );
					__data.reset.call( __data.analysis );
					$( "#start img" ).attr( "src", "/img/icons/ui/loading1.gif" );
					$( "#map .column2 .data .boxContent > ul" ).empty();
					__data.analysis.skip = __data.voyages.Qty - ( max - min );
					for ( var i = min; i < max; i++ ) {
						/* Skip "min" first ships */
//						if ( i < min ) continue;
						/* Skip "max" last ships */
//						else if ( i > max ) break;
						__method.setup( cdTripEntry[ i ] );
					}
				},
			}).addtip({
				tiptitle: i18next.t( "analyze" ),
				tipdesc: i18next.t( "analyze_desc" )
			}).attr("id", "start").appendTo( setfilt );

			wait = setTimeout( function() {
				__method.display.call( __method );
				$( "#start img" ).attr( "src", "/img/icons/ui/pa_comp.png" );
				throw "ERROR: Time limit exceeded.";
			}, 20000 );
		}
	};

	MAP.init();
})();
