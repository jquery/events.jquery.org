(function ($) {
    $(function () {
        var speakers = $("#speakers"),
            current = $.cookie('speakers-display') || "photos",
            cookie_settings = { expires: 30, path: '/', domain: 'events.jquery.org' };
            
        if (current !== "photos")  {
            speakers.addClass("list").removeClass('thumbs');
            $("#buttons")
                .find('input:radio:last').attr('checked', true).end()
                .find('input:radio:first').removeAttr('checked');
        }
            
        $("#buttons")
            .buttonset()
            .find('input:radio:first')
                .button('option', 'icons', { primary: 'ui-icon-person'})
                .end()
            .find('input:radio:last')
                .button('option', 'icons', { primary: 'ui-icon-contact'})
                .end()
            .delegate("label", "click", function (e) {

                var type = $(this).attr('for').replace('display-','');
                if (current !== type ) {
                    if (type == "photos") {
                       speakers.removeClass("list").addClass("thumbs");
                    } else {
                       speakers.removeClass("thumbs").addClass("list");
                    }
                    current = type;
                    $.cookie('speakers-display', current, cookie_settings);
                }
            });
            

        
        var dialog = $("<div />", { id: "speaker-details", html: "content" }).hide().appendTo("body")
                        .dialog({ 
                            width: 700,
                            autoOpen: false ,
                            modal: true,
                            resizable: false,
                            buttons: {
                                "Close": function () {
                                    $(this).dialog('close');
                                }
                            }
                        }),
            bio    = $("<div />", { className: "speaker-bio" }).appendTo(dialog.empty());
    
        
        $("#speakers.thumbs li").live("click", function (e) {
            e.preventDefault();
            bio.html( $(this).find(".speaker-bio").html()).prepend($(this).find('img').clone());
            dialog
                .dialog('option', 'title', $(this).find('h4').html())
                .dialog('open');
        });
        
    });
}(jQuery));