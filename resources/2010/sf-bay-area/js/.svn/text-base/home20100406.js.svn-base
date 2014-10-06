jQuery(function($){
  $("#intro li.photo")
    .wrapInner("<div class='slices'></div>")
    .append("<div class='frame'></div>")
    .find("img:not(:first-child)").hide();
  
  $.fn.nivoConfig = function(options){
    return this.nivoSlider($.extend({},{
        effect:'sliceUpDown',
        slices:10,
        animSpeed:500,
        pauseTime:10000,
        directionNav:false, //Next & Prev
        directionNavHide:false, //Only show on hover
        controlNav:false, //1,2,3...
        pauseOnHover:false //Stop animation while hovering
    },options));
  };
  var delay = 1, i_map = { "0":0, "1":2, "2":1 }, slices = $("#intro li div.slices");
  slices.each(function(i,el){
    window.setTimeout(function(){
      $(slices[i_map[i]]).nivoConfig();
    }, delay);
    delay += 600;
  });
  
});