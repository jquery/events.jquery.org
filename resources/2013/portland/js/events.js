$(document).ready(function() {

    /* track where user is on the page */
    var sectionTops = $(".container.breathing-room").map(function() {
            var id = $(this).attr("id"),
                top = $(this).offset().top - 50,
                bottom = top + $(this).outerHeight();
            return {id: id, top: top, bottom: bottom};
        }),
        half = $(window).height() / 2,
        body = $("html,body"),
        section;
    $(document).scroll(function(event) {
        var middle = $(this).scrollTop() + half,
            animated = body.is(":animated");
        $.each(sectionTops, function(i, s) {
            if (s.bottom > middle 
                && middle > s.top
                && s.id !== section) {
                section = s.id;
                sp.track('Navigate Section', {
                    section: section,
                    animated: animated
                });
            }
        });
    });

    /* track program/speech clicks */
    $("#program h5:has(.expand)").click(function() {
        var expand = !$(this).parents("td").hasClass("expanded"),
            speaker = $(this).siblings("h4").text(),
            title = $(this).text().replace("+", "").replace("-", "");
        sp.track('Click Program Description', {
            expand: expand,
            speaker: speaker,
            title: title
        });
    });

    /* track speakers clicks */
    $("#speakers .expand").click(function() {
        var expand = !$(this).parents(".speaker").hasClass("expanded"),
            speaker = $(this).siblings("h4").text(),
            image = $(this).siblings("img").attr("src");

        sp.track('Click Speaker Description', {
            expand: expand,
            speaker: speaker,
            image: image
        });
    });


    /* track 'buy ticket' clicks */
    $(".anchorLink[href='#tickets']").click(function() {
        var location;
        if ($(this).hasClass('huge')) {
            location = "header";
        } else if ($(this).hasClass('buy-btn')) {
            location = "navi";
        } else if ($(this).hasClass('orange')) {
            location = "footer";
        }
        sp.track('Click Buy', {
            location: location,
            href: $(this).attr('href'),
            text: $(this).text()
        });
    });

	/* track all anchor clicks */
	sp.trackLink($('a'), 'Click Link');
});

