// this hooks up history.js transitions to the site
(function(){

    var History = window.History;
    if (!History || !History.enabled) return false;

    History.Adapter.bind(window,'statechange',function(){

        var State = History.getState(),
            data = State.data;

        if (!data.content) document.location = State.url;

        // update content
        document.querySelector('#content').innerHTML = data.content;
        document.querySelector('title').innerHTML = data.title;

        // update menu
        [].forEach.call(document.querySelectorAll('.pushstate a'), function(el){
            var className = el.parentNode.className.replace(/(^| )active($| )/ig, ' ').replace(/^ +| +$/g, '');
            if (el.href === data.href) className = className + ' active';
            el.parentNode.className = className;
        });

        // update the animation classes
        document.querySelector('.wonderland').setAttribute("class", data.animation_classes);
        _gaq.push(['trackPageview', '/'+data.href]);
    });

    // So we don't cross links
    var targetHref;

    // Pulls out state data from an element
    var getStateData = function(href, element) {

        var classes = element.querySelector('.wonderland').getAttribute('class');

        return {
            href: href.match(/\/$/) ? href + 'index.html' : href,
            content: element.querySelector('#content').innerHTML,
            title: element.querySelector('title').innerHTML,
            animation_classes: classes || 'wonderland'
        };
    };

    // intercept clicks
    [].forEach.call(document.querySelectorAll('.pushstate a'), function(el){

        if(el.parentNode.className.indexOf('buy-tickets') != -1) return;

        el.addEventListener("click", function(e){

            e.preventDefault();

            var href = targetHref = el.href,
                fallback = function(){
                    document.location = href;
                };
            var request = new XMLHttpRequest();
            request.open('GET', href, false);
            request.send();

            var responseText = request.responseText;
            // another url has started loading
            if(href !== targetHref){return;}

            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = responseText;

            if(content){
                History.pushState(getStateData(href, tempDiv), null, href);
            } else {
                fallback();
            }
        });
    });

    // Adds state data for the current page
    var state = History.getState();
    state.data = getStateData(state.url, document);
    History.replaceState(state.data);

})();
