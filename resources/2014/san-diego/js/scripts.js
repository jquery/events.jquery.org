$(function() {
  
  $(".name").click(function () { // hover over
    $(this).closest('.info').find(".bio").toggle();
  });
  
  // Animated Scroll
  $(document).ready(function() {
    function filterPath(string) {
    return string
      .replace(/^\//,'')
      .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
      .replace(/\/$/,'');
    }
    var locationPath = filterPath(location.pathname);
    $('a[href*=#]').each(function() {
      var thisPath = filterPath(this.pathname) || locationPath;
      if (  locationPath == thisPath
      && (location.hostname == this.hostname || !this.hostname)
      && this.hash.replace(/#/,'') ) {
        var $target = $(this.hash), target = this.hash;
        if (target) {
          var targetOffset = $target.offset().top;
          $(this).click(function(event) {
            event.preventDefault();
            $('html, body').animate({scrollTop: targetOffset}, 400, function() {
              location.hash = target;
            });
          });
        }
      }
    });
  });

  // Cache selectors
  var lastId,
      topMenu = $("#menu"),
      topMenuHeight = topMenu.outerHeight()+15,
      // All list items
      menuItems = topMenu.find("a"),
      // Anchors corresponding to menu items
      scrollItems = menuItems.map(function(){
        var item = $($(this).attr("href"));
        if (item.length) { return item; }
  });

  // Bind to scroll
  $(window).scroll(function(){
     // Get container scroll position
     var fromTop = $(this).scrollTop()+topMenuHeight;
     
     // Get id of current scroll item
     var cur = scrollItems.map(function(){
       if ($(this).offset().top < fromTop)
         return this;
     });
     // Get the id of the current element
     cur = cur[cur.length-1];
     var id = cur && cur.length ? cur[0].id : "";
     
     if (lastId !== id) {
        lastId = id;
        // Set/remove active class
        menuItems
          .parent().removeClass("active")
          .end().filter("[href=#"+id+"]").parent().addClass("active");
     }                   
  });

  $(".nav-btn").click(function () {
    $('#menu .container > input[type=checkbox]').removeAttr('checked');
  });

  var exp = "expanded";

  $(document).on("click", "button.expand", function(e) {
    var $container = $(this).closest(".speaker_entity"),
    isExpanded = $container.hasClass( exp );

    $container.toggleClass( exp, !isExpanded );

    $(this).text( isExpanded ? "Read more" : "Close" );
    e.stopPropagation();
  });

});