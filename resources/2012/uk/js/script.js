$(function(){

    // Main Header
    
    function resizeHeader(top) {
        if(top < 0) top = 0;
        var percent = 50;
        var paddingBottomH2 = 22;
        var marginTopH2 = 16;
        var marginTopH1 = 30;
        var marginBottomH1 = 10;
        if(top < 90){
            percent = parseInt((((90-top)/90)*50)+50,10);
        }

        paddingBottomH2 = paddingBottomH2*(percent/100);
        marginTopH2 = marginTopH2*(percent/100);

        marginTopH1 = marginTopH1*(percent/100);
        marginBottomH1 = marginBottomH1*(percent/100);
        var height = 83 * (percent/100);
        var width = 308 * (percent/100);
        var $h1 = $('header h1');
        var $h2 = $('header h2');
        $h1.width(width);
        $h1.height(height);
        $h1.css('marginTop', marginTopH1);
        $h1.css('marginBottom', marginBottomH1);

        $h2.css('font-size', percent + '%').height(percent);
        $h2.css('paddingBottom', paddingBottomH2);
        $h2.css('marginTop', marginTopH2);
    }


    var previousScroll = 0;
    var $window = $(window);

    var $speaker = $("#speakers");
    var $venue = $("#venue");
    var $sponsors = $("#sponsors");
    var $workshops = $("#workshops");
    var navOffset = 170;

    var navPositions = {
        "#speakers": $speaker,
        "#venue": $venue,
        "#sponsors": $sponsors,
        "#workshops": $workshops
    };

    resizeHeader($window.scrollTop());

    $window.scroll(function (e) {
        var top = $window.scrollTop();
        resizeHeader(top);
        animateBirds();

        function animateBirds() {
            var $birds = $('.birds');
            var frameWidth = parseInt($birds.outerWidth());
            var currentPos = parseInt($birds.css('background-position').split(" ")[0]);

            var offset = currentPos-frameWidth;
            $birds.css('background-position', (offset + 'px 0px'));
        }

        previousScroll = top;
    });


    //Move the mini
    var previousMousePosition = 0;
    var moveMiniByMouse = true;
    var mouseCount = 0;
    $window.mousemove(function(e){
        var currentMousePosition = e.pageY;

        moveMini();
        moveGargoyles();
        previousMousePosition = currentMousePosition;
        /**
         * Put the tongue of the gargoyle in and out with mouse move
         */
        function moveGargoyles() {
            if (mouseCount > 10 && currentMousePosition > previousMousePosition){
                //Down
                var $gargoyle = $('.gargoyles');
                var frameWidth = parseInt($gargoyle.outerWidth());
                var currentPos = parseInt($gargoyle.css('background-position').split(" ")[0]);

                var offset = currentPos-frameWidth;
                $gargoyle.css('background-position', (offset + 'px 0px'));

                mouseCount = 0;
            } else if(mouseCount > 10) {
                //Up
                var $gargoyle = $('.gargoyles');
                var frameWidth = parseInt($gargoyle.outerWidth());
                var currentPos = parseInt($gargoyle.css('background-position').split(" ")[0]);

                var offset = currentPos+frameWidth;
                $gargoyle.css('background-position', (offset + 'px 0px'));

                mouseCount = 0;
            } else {
                mouseCount++;
            }
        }

        /**
         * Wiggle the mini with the mouse
         */
        function moveMini() {
            if (moveMiniByMouse && currentMousePosition > previousMousePosition){
                //Down
                var $mini = $('.mini');
                var deg = parseInt($mini.css('transform').rotate * (180/Math.PI));
                if(deg < 12) {
                    var newDeg = deg+1;
                    $mini.css('transform', "rotate("+newDeg+"deg)");
                }
            } else if(moveMiniByMouse) {
                //Up
                var $mini = $('.mini');
                var deg = parseInt($mini.css('transform').rotate * (180/Math.PI));
                if(deg > -2) {
                    var newDeg = deg-1;
                    $mini.css('transform', "rotate("+newDeg+"deg)");
                }
            }
        }
    });



    var tiltMini = true;
    var balancePoint = null;
    if('DeviceOrientationEvent' in window) {
        //Move the mini using the inbuild direction sensor..
        window.addEventListener('deviceorientation', function(eventData) {
            //Turn off mouse moving
            moveMiniByMouse = false;
            // gamma is the left-to-right tilt in degrees, where right is positive
            var tiltLR = eventData.gamma;
            // beta is the front-to-back tilt in degrees, where front is positive
            var tiltFB = eventData.beta;
            //The first time this event is called set the devices 0 point
            if(!balancePoint) balancePoint = eventData.beta;

            tiltFB = tiltFB - balancePoint;
            var $mini = null;
            if(tiltMini && tiltFB > -3 && tiltFB < 30) {
                $mini = $('#mini');
                $mini.css("transform", "rotate("+ tiltFB +"deg)")
            }
            if(tiltMini && tiltFB > 30) {
                //Turn off mini tilting
                tiltMini = false;
                var $footer = $("footer");
                if(!$mini) $mini = $('#mini');
                var fallDuration = 4000;
                jQuery.scrollTo.window().queue([]).stop();
                //Lets scroll to the bottom
                $window.scrollTo($footer,fallDuration,{easing:'linear'});

                var newYPos = parseInt($footer.offset().top) - parseInt($mini.offset().top) - $mini.outerHeight();
                //Lets move the mini to the bottom, and flip it on its roof as it happens.
                $mini.animate({"transform":"rotate("+ 180 +"deg) translateY("+newYPos+"px)"},{easing:'linear', duration: fallDuration, complete:function(){
                    //Crash!
                    $(this).addClass("crashed");
                }});
            }
        }, false);
    }

    var $primaryNav = $('nav.primary');
    var $primaryButtons = {
      sponsors: $primaryNav.children('a.sponsors'),
      speakers: $primaryNav.children('a.speakers'),
      venue: $primaryNav.children('a.venue'),
      workshops: $primaryNav.children('a.workshops')
    };
    // Navigation Click/Selected
    $window.bind("scroll", function(){
        var top = $window.scrollTop()+100;
        if(top > (navPositions["#sponsors"].offset().top-navOffset)) {
            $primaryNav.children('a.selected').removeClass('selected');
            $primaryButtons.sponsors.addClass('selected');
        } else if(top > (navPositions["#workshops"].offset().top-navOffset)) {
            $primaryNav.children('a.selected').removeClass('selected');
            $primaryButtons.workshops.addClass('selected');
        } else if(top > (navPositions["#venue"].offset().top-navOffset)) {
            $primaryNav.children('a.selected').removeClass('selected');
            $primaryButtons.venue.addClass('selected');
        } else if(top > (navPositions["#speakers"].offset().top-navOffset)) {
            $primaryNav.children('a.selected').removeClass('selected');
            $primaryButtons.speakers.addClass('selected');
        } else if(top < 410) {
            $primaryNav.children('a.selected').removeClass('selected');
        }
    });

    $('nav.primary a').click(function() {
        var $activate = $(this);
        jQuery.scrollTo.window().queue([]).stop();
        $window.scrollTo(navPositions[this.hash].offset().top-navOffset,1400, {"easing": "swing", "onAfter": function(){
        }});
        return false;
    });
    
    $('footer nav.sections a').click(function() {
        var loc = $(this.hash).offset().top-140;
        scrollToLocation(loc);
        return false;
    });

    $('.scroll').click(function() {
        var loc = $(this.hash).offset().top-140;
        scrollToLocation(loc);
        return false;
    });

    function scrollToLocation(loc){
        jQuery.scrollTo.window().queue([]).stop();
        $window.scrollTo(loc,1400);
    }
    $('header h1 a').click(function() {
        jQuery.scrollTo.window().queue([]).stop();
        $window.scrollTo(0,1400);
        return false;
    });
    //Preload
    $([
        "/resources/2012/uk/img/speakers/136/paul.jpg",
        "/resources/2012/uk/img/speakers/136/joern.jpg",
        "/resources/2012/uk/img/speakers/136/addy.jpg",
        "/resources/2012/uk/img/speakers/136/ralph.jpg",
        "/resources/2012/uk/img/speakers/136/doug.jpg",
        "/resources/2012/uk/img/speakers/136/dionben.jpg",
        "/resources/2012/uk/img/speakers/136/haymo.jpg",
        "/resources/2012/uk/img/speakers/136/christian.jpg"
    ]).preloadImages(function(){});

    $('#speakers ul.list li').click(function(){

        var newSpeaker = $(this);
        if(!newSpeaker.hasClass("selected")) {
            var newSpeakerA = newSpeaker.find("a.pic");
            var newSpeakerSpan = newSpeaker.find("span.name");
            var newSpeakerBlock = newSpeaker.find(".selected-speaker");
            var oldSpeaker = newSpeaker.siblings('.selected');
            var oldSpeakerA = oldSpeaker.find("a.pic");
            var oldSpeakerSpan = oldSpeaker.find("span.name");
            var oldSpeakerBlock = oldSpeaker.find(".selected-speaker");
            oldSpeakerBlock.addClass("animating");

            //Make old speaker smaller
            oldSpeaker.animate({height: 110, width: 84}, 250, 'linear', function(){
                oldSpeaker.removeClass("selected").removeAttr('style');
            });
            //Make old speaker span smaller
            oldSpeakerSpan.animate({minHeight: 16, width: 74, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, fontSize: "1em"}, 250, 'linear', function(){
                newSpeakerSpan.removeAttr( "style" )
            });
            //Make old a smaller
            oldSpeakerA.animate({height: 26, width: 84, marginTop: 84 }, 250, "linear", function(){
                oldSpeakerA.removeAttr('style');
            });

            //Make new speaker bigger
            newSpeakerSpan.css("textAlign", "center");
            newSpeakerSpan.css("backgroundColor", '#db493c');
            newSpeakerSpan.css("color", '#ffffff');
            newSpeakerSpan.animate({height: 40, width: 136, paddingTop: 10, paddingBottom: 29, paddingLeft: 0, paddingRight: 0, fontSize: "1.25em"}, 250, 'linear', function(){
                newSpeakerSpan.removeAttr( "style" )
            });
            //Make A bigger
            newSpeakerA.animate({height: 79, width: 136, marginTop: 136 }, 250, "linear", function(){
                newSpeakerA.removeAttr('style');
            });
            //Make this bigger
            newSpeaker.animate({height: 210, width: 136}, 250, 'linear', function(){
                newSpeaker.addClass("selected").removeAttr( "style" );
                newSpeakerBlock.removeClass("animating");
            });

            return false;
        }
    });


    $(".more").one('inview', function(){
        $(this).simpleAnimation({framerate:4});
    });

    $(".radiohead").one('inview', function(){
        $(this).simpleAnimation({framerate:3});
    });

    $(".heads").one('inview', function(){
        $(this).simpleAnimation({framerate:6});
    });

    $(".caterpillar").one('inview', function(){
        $(this).simpleAnimation({framerate:3.5, pauseTime: "1500"});
    });

    $(".shark").one('inview', function(){
        $(this).simpleAnimation({framerate:4})
    });

    $('.no-touch #container').scrollParallax({
        'speed': -0.2,
        'axis': 'y'
    });

    $('.no-touch #foreground').scrollParallax({
        'speed': -0.4,
        'axis': 'y'
    });
    if ($.browser.msie  && parseInt($.browser.version) < 9) {
        
    } else {
        var animatingBike = false;
        var animatingBannister = false;
        $window.bind("scroll", function(){
            var top = $window.scrollTop();
            var cutOff = 190;
            var bannister = $(".bannister");
            if(bannister.offset()) {
                var bannisterCutOff = parseInt(bannister.offset().top- 220);
                if(animatingBannister === false && top > bannisterCutOff) {
                    animatingBannister = true;

                    var bannisterFrame = 1;
                    var bannisterCount = 0;

                    bannister.animate({"transform":"translateX(750px)"}, {duration: 3000, easing: 'linear', step: function(now, fx){
                      if(bannisterCount>3)
                      {
                          if(bannisterFrame == 6) {
                              bannisterFrame = 1;
                          } else {
                              bannisterFrame++;
                          }
                          bannisterCount =0;
                      } else {
                          bannisterCount++;
                      }
                      var pos = 0;
                      switch (bannisterFrame){
                        case 1:
                          pos = 0;
                          break;
                        case 2:
                          pos = 200;
                          break;
                        case 3:
                          pos = 400;
                          break;
                        case 4:
                          pos = 600;
                          break;
                        case 5:
                          pos = 800;
                          break;
                        case 6:
                          pos = 1000;
                          break;
                      }
                      $(fx.elem).css("background-position","-"+pos+"px 0px");
                    }});
                }
            }

            if(animatingBike === false && top > cutOff) {

                var bike = $(".bike");
                if(bike.offset()){
                    animatingBike = true;

                    //Move bike left a %
                    var frame = 1;
                    var count = 0;
                    bike.animate({"transform":"translateX(550px)"}, {duration: 3000, easing: 'linear', step: function(now, fx){
                        if(count>6) {
                            if(frame == 3) {
                                frame = 1;
                            } else {
                                frame++;
                            }
                            count =0;
                        } else {
                            count++;
                        }
                        var pos = 0;
                        switch (frame){
                            case 1:
                                pos = 0;
                                break;
                            case 2:
                                pos = 230;
                                break;
                            case 3:
                                pos = 460;
                                break;
                        }
                        $(fx.elem).css("background-position","-"+pos+"px 0px");
                    }});
                }
            }

        });
    }
	
	
    $('a.more').qtip({
        content: {
            title: {
                text: 'Did you know??',
                button: 'Close'
            }
        },
      position: {
           adjust: {
                screen: true
            }
      },

      show: {
         when: 'mouseenter click', // Show it on click
         solo: true // And hide all other tooltips
      },

      hide: false,
      style: {
         width: { max: 320 },
         padding: '10px',
         border: {
            width: 1,
            radius: 2,
            color: '#edf6f8'
         },
         name: 'light'
      },
      api: {
         beforeShow: function()
         {
            // Fade in the modal "blanket" using the defined show speed
            $('#qtip-blanket').fadeIn(this.options.show.effect.length);
         },
         beforeHide: function()
         {
            // Fade out the modal "blanket" using the defined hide speed
            $('#qtip-blanket').fadeOut(this.options.hide.effect.length);
         }
      }
   });

   // Create the modal backdrop on document load so all modal tooltips can use it
   $('<div id="qtip-blanket">')
      .css({
         position: 'relative',
         width: '50%', // ...and full width

         opacity: 0, // Make it slightly transparent
         zIndex: 5000  // Make sure the zIndex is below 6000 to keep it below tooltips!
      })
      .appendTo(document.body) // Append to the document body
      .hide(); // Hide it initially
	
});


$(function(){
    var saidBus = new google.maps.LatLng(51.75308, -1.26814);
    var lmh = new google.maps.LatLng(51.76440, -1.25515);
    var oxford = new google.maps.LatLng(51.75735, -1.2600);
    var myOptions = {
      zoom: 14,
      center: oxford,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

    var saidInfowindow = new google.maps.InfoWindow({
        content: '<div class="infowindow"><h3>Sa&iuml;d Business School</h3><div class="content">The conference venue</div></div>'
    });

    var lmhInfowindow = new google.maps.InfoWindow({
        content: '<div class="infowindow"><h3>Lady Margaret Hall</h3><div class="content">The workshop venue</div></div>'
    });

    var image = '/resources/2012/uk/img/map_pin_venue_shadow.png';

    var saidMarker = new google.maps.Marker({
      position: saidBus,
      map: map,
      icon: image
    });

    var lmhMarker = new google.maps.Marker({
      position: lmh,
      map: map,
      icon: image
    });

    google.maps.event.addListener(saidMarker, 'click', function() {
        saidInfowindow.open(map,saidMarker);
    });

    google.maps.event.addListener(lmhMarker, 'click', function() {
        lmhInfowindow.open(map,lmhMarker);
    });

    var markers = {
        '#venue': [saidMarker, lmhMarker],
        '#restaurants': [],
        '#accommodation': [],
        '#tour': getAltTourLocs(map)
    };
    var request = {
        location: oxford,
        radius: '1000',
        types: ['restaurant','lodging']
    };

    service = new google.maps.places.PlacesService(map);

    service.search(request, function(results, status){
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                if(jQuery.inArray("lodging", results[i].types)!=-1) {
                    createLodgingMarker(results[i]);
                } else if(jQuery.inArray("restaurant", results[i]["types"])!=-1) {
                    createRestaurantMarker(results[i]);
                }
            }
        }
    });

    function createRestaurantMarker(place) {
        var image = '/resources/2012/uk/img/map_pin_restaurants_shadow.png';
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: image
        });

        var request = {
            reference: place.reference
        };

        var infowindow = new google.maps.InfoWindow();

        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, function(place, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var content = '<div class="infowindow"><h3>'+place.name+'</h3><div class="content">'+place.formatted_address+'</div></div>';
                infowindow.setContent(content);
            }
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, this);
        });

        markers["#restaurants"].push(marker);
    }

    function createLodgingMarker(place) {
        var image = '/resources/2012/uk/img/map_pin_accommodation_shadow.png';
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: image
        });

        var request = {
            reference: place.reference
        };

        var infowindow = new google.maps.InfoWindow();

        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, function(place, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var content = '<div class="infowindow"><h3>'+place.name+'</h3><div class="content">'+place.formatted_address+'</div></div>';
                infowindow.setContent(content);
            }
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, this);
        });

        markers["#accommodation"].push(marker);
    }

    function getAltTourLocs(map) {
        var image = '/resources/2012/uk/img/map_pin_alternativetour_shadow.png';

        var alt = [
            //Pitt rivers
            new google.maps.Marker({
                position: new google.maps.LatLng(51.759553, -1.255109),
                info: new google.maps.InfoWindow({
                    content: '<div class="infowindow"><h3>Pitt Rivers Museum</h3></div>'
                }),
                map: map,
                icon: image
            }),
            //Headington Shark
            new google.maps.Marker({
                position: new google.maps.LatLng(51.757680, -1.212791),
                info: new google.maps.InfoWindow({
                    content: '<div class="infowindow"><h3>Headington Shark</h3></div>'
                }),
                map: map,
                icon: image
            }),
            //Mini Factory Tour
            new google.maps.Marker({
                position: new google.maps.LatLng(51.736118, -1.195807),
                info: new google.maps.InfoWindow({
                    content: '<div class="infowindow"><h3>Mini Factory Tour</h3></div>'
                }),
                map: map,
                icon: image
            }),
            //Alice in Wonderland shop
            new google.maps.Marker({
                position: new google.maps.LatLng(51.749391, -1.256908),
                info: new google.maps.InfoWindow({
                    content: '<div class="infowindow"><h3>Alice in Wonderland shop</h3></div>'
                }),
                map: map,
                icon: image
            }),
            //Jericho Tavern
            new google.maps.Marker({
                position: new google.maps.LatLng(51.760589, -1.266521),
                info: new google.maps.InfoWindow({
                    content: '<div class="infowindow"><h3>Jericho Tavern</h3></div>'
                }),
                map: map,
                icon: image
            })
                
        ];


        for (var i=0; i < alt.length; i++) {

            google.maps.event.addListener(alt[i], 'click', function() {
                this.info.open(map,this);
            });
        }
        return alt;
    }

    $('#map ul a').click(function() {
        jQuery.scrollTo.window().queue([]).stop();
        var $this = $(this);
        var status = $this.hasClass("off");
        if(markers[this.hash]) {
            for(var i =0; i < markers[this.hash].length; i++) {
                markers[this.hash][i].setVisible(status);
            }
        }
        $this.toggleClass("off");
        return false;
    });
})