(function ($, undefined) {
  
  $(function () {
    var $wrapper = $("#frame_wrapper"),
        $show    = $("#show_speaker_form"),
        $tagSuccess = $("<div />", {className: 'tag tag-success', text: 'Success!'}).hide().appendTo("#emailsignup"),
        $tagError   = $("<div />", {className: 'tag tag-error',   text: 'Error'}).hide().appendTo("#emailsignup"),
        $tagLoading = $("<div />", {className: 'tag tag-loading', html: 'Loading&hellip;'}).hide().appendTo("#emailsignup"),
        $tags       = $("#emailsignup .tag");
    
    $("form").submit(function (e) {
      e.preventDefault();
      
      var email = $.trim($("#email").val());
      
      $tags.hide();
      
      if (email === "") {
        $tagError.show();
        return;
      } else {
        $tagLoading.show();
      }
      
      $.post( $(this).attr('action'), {
        email: email
      }, function (data) {
        if (data.success) {
          $tags.hide();
          $tagSuccess.show();
        } else {
          $tags.hide();
          $tagError.show();
        }
      }, 'json');
    })
    
    // Allow the link tag to submit
    // the form
    $(".submit").click(function (e) {
      e.preventDefault();
      $(this).closest('form').submit();
    }).show();
    
    $("input:submit").hide();
    
    // First time through, add the iframe
    // and initialize the wrapper
    $show.one('click', function (e) {
              
      $("<iframe />", {
        frameborder: 0,
        allowtransparency: 'true',
        width: 900,
        height: 1500,
        text: "Loading...",
        frameborder: 0,
        marginheight: 0,
        marginwidth: 0,
        src: 'http://spreadsheets.google.com/embeddedform?formkey=dDI5UkdZZE1hZWNDSU5kWG1nZkJfN0E6MA'
      }).appendTo($wrapper);
      
      $wrapper
        .css({height: 0, paddingTop: 0, paddingBottom: 0})
        .show();
      
    }).toggle(function () {
      // Show the form
      $(this).addClass('active');
      $wrapper
        .stop(true,false)
        .show()
        .animate({paddingTop: 15, paddingBottom: 15}, 50)
        .animate({height: 1500}, 400);
    }, function () {
      // Hide the form
      $(this).removeClass('active');
      $wrapper
        .stop(true,false)
        .animate({height: 0}, 300)
        .animate({paddingTop: 0, paddingBottom: 0}, 50, function () {
          $wrapper.hide();
        });
    });
  });  
}(jQuery));