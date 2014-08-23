$(function () {
	"use strict";

	// sticky logo
	var stickies = $('*[data-sticky]');
	var waypoints = [];
	var maxWaypoint = 0;
	var waypointsSet = 0;
	var sessionScrolling = false;

	var Waypoint = function(el, position) {
		this.el = el;
		this.position = position;
		this.stuck = false;
	};

	Waypoint.prototype = {
		check: function(scroll) {
			if (scroll >= this.position && !this.stuck) {
			    console.log('sticking');
				this.stick();
				return 1;
			} 
			if (scroll < this.position && this.stuck) {
			    console.log('unsticking');
				this.unstick();
				return -1;
			}
			return 0;
		},
		stick: function() {
			this.el.addClass('sticky');
			this.stuck = true;
		},
		unstick: function() {
			this.el.removeClass('sticky');
			this.stuck = false;
		}
	};

	stickies.each(function() {
		var el = $(this);
		var sticky = parseInt(el.attr('data-sticky'), 10);
		var position = el.offset().top;
		if (!isNaN(sticky)) {
			position += sticky;
		}
		var waypoint = new Waypoint(el, position);
		maxWaypoint = Math.max(maxWaypoint, position);
		waypoints.push(waypoint);
	});


        var last = Date.now();
	$(window).on('scroll', function(e) {
		var now = Date.now();
		if (sessionScrolling || (now-last) < 10) {
		return;
		}
		last = now;

	        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		if (document.body.scrollTop > maxWaypoint) {
			if(waypointsSet >=  waypoints.length) {
				return;
			} 
			// set all of the waypoints 
			$.each(waypoints, function(i, waypoint) {
			  waypoint.stick();
			});
			waypointsSet = waypoints.length;
		} else {
		  $.each(waypoints, function(i, waypoint) {
		    var stick = waypoint.check(scrollTop);
		    waypointsSet += stick;
		  });
		}
	});


	var e, t, n, r, i, s;
	n = $(window);
	t = $(".page-nav");
	r = t.offset().top;
	e = $("a", t);
	s = 1;
	(i = function () {
		return setTimeout(function () {
			s = n.scrollTop();
			t.toggleClass("sticky", s > r);
			return n.one("scroll", i)
		}, 300);
	})();

	var body = $("body"),
	navHeight = $("nav").height();

	if ( window.location.hash ) {
		body.scrollTop( body.scrollTop() - navHeight );
	}
	$("nav, .page-header").on("click", "a", function (e) {
		e.preventDefault();

		var href = $(this).attr("href"),
		target = $( href ),
		topOffset = target.offset().top;

		body.animate({
			scrollTop: topOffset - navHeight
		},function() {
			if ( Modernizr.history ) {
				history.pushState({}, "", href);
			} else {
				window.location.hash = href;
			}
		});
	});


	function scrollToCurrentSession() {
		function extractSession(i, el) {
			var $el = $(el),
			time = $el.find(".time").text().split(" – "),
			start = time[0].split(":"),
			end = time[1].split(":"),
			whichDay = $el.closest("div.program-day")[0],
			t = whichDay === dayOne[0] ? new Date(2013, 8, 10) : new Date(2013, 8, 11),
			s = new Date(+t),
			e = new Date(+t),
			h1 = +start[0],
			h2 = +end[0];

			h1 = h1 <= 7 ? h1 + 12 : h1;
			h2 = h2 <= 7 ? h2 + 12 : h2;

			s.setHours(h1);
			s.setMinutes(+start[1]);
			e.setHours(h2);
			e.setMinutes(+end[1]);

			return {
				index: i,
				title: $el.find("h3").text(),
				start: s,
				end: e,
				$el: $el
			};
		}

		function findSession( sessions ) {
			var i = 0,
			l = sessions.length,
			c = +current,
			s,
			e;
			for (i = 0; i < l; i++) {
				s = +sessions[i].start;
				e = +sessions[i].end;
				// currently in a session
				if (c >= s && c <= e) {
					return sessions[i];
				}
				//during a break
				if ( sessions[i+1] ) {
					if ( c >= e && c <= +sessions[i+1].start ) {
						return sessions[i+1];
					}
				}
			}
			return false;
		
		}
		var fake = window.location.search,
		current = fake ? new Date(+fake.slice(1)) : new Date(),
		midnight = fake ? new Date(+fake.slice(1)) : new Date(),
		days = $("div.program-day"),
		dayOne = days.eq(0),
		dayTwo = days.eq(1),
		dayOneSessions = dayOne.find("article.session").map(extractSession).get(),
		dayTwoSessions = dayTwo.find("article.session").map(extractSession).get(),
		tuesday = new Date(2013, 8, 10),
		wednesday = new Date(2013, 8, 11),
		session;

		days.find(".now,.ondeck").removeClass("now ondeck")

		midnight.setHours(0);
		midnight.setMinutes(0);
		midnight.setSeconds(0);
		midnight.setMilliseconds(0);

		if ( +midnight === +tuesday ) {
			session = findSession( dayOneSessions );
		} else if ( +midnight === +wednesday ) {
			session = findSession( dayTwoSessions );
		}

		if ( session ) {
			sessionScrolling = true;
			window.scrollTo(0, session.$el.offset().top - 120);
			session.$el.addClass('now');
			session.$el.next().addClass('ondeck');
			sessionScrolling = false;
		}
	}

	scrollToCurrentSession();
	window.setInterval( scrollToCurrentSession, 60 * 25 * 1000 ); /*check every 30 minutes*/
	
});
