$(function(){
    var saidBus = new google.maps.LatLng(51.75308, -1.26814);
    var oxford = new google.maps.LatLng(51.75353, -1.26470);
    var myOptions = {
      zoom: 15,
      center: oxford,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

    var saidInfowindow = new google.maps.InfoWindow({
        content: '<div class="infowindow"><h3>Säid Business School</h3><div class="content">The venue</div></div>'
    });

    var image = 'img/map_pin_venue_shadow.png';

    var saidMarker = new google.maps.Marker({
      position: saidBus,
      map: map,
      icon: image
    });
    
    google.maps.event.addListener(saidMarker, 'click', function() {
        saidInfowindow.open(map,saidMarker);
    });

    var markers = {
        '#venue': [saidMarker],
        '#restaurants': [],
        '#accommodation': []
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
        var image = 'img/map_pin_restaurants_shadow.png';
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
        var image = 'img/map_pin_accommodation_shadow.png';
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