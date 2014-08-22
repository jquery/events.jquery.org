$( function(){
	if ($.browser.msie && parseInt($.browser.version, 10) <= 7) {
		alert('I guess the jQuery conference is nothing for you... Check out this.');
		window.location.replace('http://www.ecdl.com/');
	}

	$('#plane, #planeclick').click(function(e){
		$('#bookflight').toggle();
	});


	$('#sessionmenu .friday').click(function(e){
		$('#sessiondate').removeClass('saturday').addClass('friday');
		$('#sessionmenu .friday').addClass('active');
		$('#sessionmenu .saturday').removeClass('active');
		$('#friday').show();
		$('#saturday').hide();
		e.preventDefault();
		return false;
	});
	$('#sessionmenu .saturday').click(function(e){
		$('#sessiondate').removeClass('friday').addClass('saturday');
		$('#sessionmenu .saturday').addClass('active');
		$('#sessionmenu .friday').removeClass('active');
		$('#saturday').show();
		$('#friday').hide();
		e.preventDefault();
		return false;
	});

	$('.speakermain').click(function(e) {

		var speaker = $(this).closest('.speaker');

		if(speaker.attr('data-active') == "true") {
			closeSpeakerBio(speaker);
			return;
		}

		if($('.speaker[data-active=true]').length > 0) {
			return;
		}

		openSpeakerBio(speaker);
		var bioWrapper = speaker.find('.biowrapper');

		bioWrapper.find('.close').click( function(e) {
			e.preventDefault();
			closeSpeakerBio($(this).closest('.speaker'));
		});

	});
	$('.sessionmain').click(function(e) {

		var session = $(this).closest('.subevent');

		if(session.attr('data-active') == "true") {
			closeSessionDesc(session);
			return;
		}

		if($('.subevent[data-active=true]').length > 0) {
			return;
		}

		openSessionDesc(session);
		var sessionWrapper = session.find('.sessiondescription');

		sessionWrapper.find('.close').click( function(e) {
			e.preventDefault();
			closeSessionDesc($(this).closest('.subevent'));
		});

	});
	if ( 1==2 || Modernizr.touch || $.browser.msie  && parseInt($.browser.version, 10) <= 9) {
		// bind to touchstart, touchmove, etc and watch `event.streamId`
		$('body').addClass('nofixed');
		if ($.browser.msie) {
			$('body').addClass('msie');
		}

		$('#palais span').toggle(function(){
			showPalais();
		}, function(){
			hidePalais();
		});
		$('#venuemenu a').click(function(event){
			event.preventDefault();
			$.scrollTo($(this).attr('href'), 500);
			$('#palais span').click();
		});
	} else {
		$('body').addClass('fixed');
		// parallax scrolling does not work properly on touch devices
		$('#head').parallax("50%", 0.1, true);
		$('#scull').parallax("50%", 0.3, true);
		$('#intro').parallax("50%", 0.3, true);
		$('#paper').parallax("50%", 0.3, true);
		$('#steffl').parallax("50%", 0.6, true);
		$('#speakers').parallax("50%", 0.2, true);
		$('#cloud1').parallax("50%", 1.0, true);
		$('#cloud2').parallax("50%", 1.0, true);
		$('#planecontainer').parallax("50%", 0.2, true);
		// weired workaround for safari !?
		setTimeout( function () {
			$('#cinema').css('height', '10800px');
		}, 100);

		$('#locationwaypointstart').waypoint(function() {
			$('#palaisclick').toggle();
			$('#palaisclick2').toggle();
		});
		$('#locationwaypointend').waypoint(function() {
			$('#palaisclick').toggle();
			$('#palaisclick2').toggle();
		});

		$('#venuemenu a').click(function(event){
			event.preventDefault();
			$.scrollTo($(this).attr('href'), 500);
			$('#palaisclick2').click();
		});
	}
	$('ul#navigation li a.jump').hover(function(){
		$(this).animate({top:'5px'},{queue:false,duration:210});
	}, function(){
		$(this).animate({top:'14px'},{queue:false,duration:210});
	});
	$('li a').click(function(event){
		var href = $(this).attr('href');
		if(href.charAt(0) === '#' && $(href).length > 0){
			event.preventDefault();
			$.scrollTo(href, 500);
		}
	});
	$('#palaisclick').click(function (){
		window.open($('#palais a').attr('href'));
	});
	$('#palaisclick2').toggle(function(){
		showPalais();
	}, function(){
		hidePalais();
	});
	function showPalais(){
		$('#palaislayertop').animate({
		   height: '184px'
		}, 300, 'linear');
		$('#palaislayerbottom').animate({
		   height: '276px'
		}, 260, 'linear', function() {
			$('.palais').show();
			});
	}
	function hidePalais(){
		$('.palais').hide();
		$('#palaislayertop').animate({
		   height: '0px'
		}, 300, 'linear');
		$('#palaislayerbottom').animate({
		   height: '0px'
		}, 260, 'linear');
	}

	var plane = $('#planecontainer');

	var closeSpeakerBio = function(speakerElement) {

		speakerElement.attr('data-active', false);
		var bioWrapper = speakerElement.find('.biowrapper');

		bioWrapper.fadeOut(200);
		speakerElement.css('z-index', parseInt(speakerElement.css('z-index')) -100);

		$.each( $('.speaker'), function() {
			if($(this).attr('data-active') == "true") {
				return;
			}

			$(this).animate({
				opacity: 1
				});
		});
	}

	var openSpeakerBio = function(speakerElement) {

		speakerElement.attr('data-active', true);
		speakerElement.css('z-index', parseInt(speakerElement.css('z-index')) +100);

		$.each( $('.speaker'), function() {
			if($(this).attr('data-active') == "true") {
				return;
			}

			$(this).animate({
				opacity: 0.50
			});
		});

		var bioWrapper = speakerElement.find('.biowrapper');
		bioWrapper.fadeIn(200);
	}
	var closeSessionDesc = function(sessionElement) {

		plane.css('z-index', 20);

		sessionElement.attr('data-active', false);
		var sessionWrapper = sessionElement.find('.sessiondescription');

		sessionWrapper.fadeOut(200);
		sessionElement.css('z-index', parseInt(sessionElement.css('z-index')) -100);
	}

	var openSessionDesc = function(sessionElement) {

		plane.css('z-index', 8);

		sessionElement.attr('data-active', true);
		sessionElement.css('z-index', parseInt(sessionElement.css('z-index')) +100);

		var sessionWrapper = sessionElement.find('.sessiondescription');
		sessionWrapper.fadeIn(200);
	}
})

function maxWidth() {
	var w=0;
	if (window.document.innerWidth>w)
		w=window.document.innerWidth;
	if (window.document.documentElement.clientWidth>w)
		w=window.document.documentElement.clientWidth;
	if (window.document.body.clientWidth>w)
		w=window.document.body.clientWidth;
	return w;
}
