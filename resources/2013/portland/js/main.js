$(document).ready(function(){
	/*$('.gmap,.gmap2').mobileGmap();*/

	var map = L.map('map').setView([45.528379, -122.663138], 15);
	L.TileLayer.provider('Stamen.Watercolor').addTo(map);

	var marker = L.marker([45.528379, -122.663138]).addTo(map);
	var map2 = L.map('map2').setView([45.530772, -122.655575], 15);
	L.TileLayer.provider('Stamen.Watercolor').addTo(map2);
	var marker = L.marker([45.530772, -122.655575]).addTo(map2);

	var pull = $('#pull');
	menu = $('#nav ul');
	menuHeight = menu.height();

	$(pull).on('click', function(e) {
		e.preventDefault();
		menu.slideToggle();
	});

	$("#nav").sticky({topSpacing:0});

	var exp = "expanded";

	$(document).on("click", "button.expand", function(e) {
		var $container = $(this).closest("td,div"),
		isExpanded = $container.hasClass( exp );

		$container.toggleClass( exp, !isExpanded );

		$(this).text( isExpanded ? "+" : "-" );
		e.stopPropagation();
	});

	$("#program h5 a").on("click", function(e) {
		e.stopPropagation();
	});

	$("#program").on("click", "h5, aside", function(e) {
		var $container = $(this).closest("td"),
		isExpanded = $container.hasClass( exp );

		$container.toggleClass( exp, !isExpanded ).find("button.expand").text( isExpanded ? "+" : "-" );
		e.stopPropagation();
	});
});

$(window).resize(function(){
	var w = $(window).width();
	if(w > 320 && menu.is(':hidden')) {
		menu.removeAttr('style');
	}
});
