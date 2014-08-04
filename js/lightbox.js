(function($) {

    $.fn.sunsetsGallery = function(options) {

    // Plugin starts

    // Gallery default settings:
    var S = $.sunsetsGallery = function(){};
    var settings = {

        version : '1.0.0',

        thumbW        : 200,
        thumbH        : 150,
        thumbA        : "center top",
        textColor     : "#555555",
        overlayBg     : "rgba(0,0,0,0.7)",
        fontSize      : "1em",
        delay         : "slow",
        showCaption   : true,
        showDuration  : 500,
        nextText      : "next",
        prevText      : "previous",

        keys : {
            next : {
                13 : 'left', // enter
                34 : 'up',   // page down
                39 : 'left', // right arrow
                40 : 'up'    // down arrow
            },
            prev : {
                8  : 'right',  // backspace
                33 : 'down',   // page up
                37 : 'right',  // left arrow
                38 : 'down'    // up arrow
            },
            close  : [27] // escape
        },

        tpl : {
            overlay   : '<div id="overlay"></div>',
            container : '<div class="lightbox-container"></div>',
            contents  : '<div class="row content"></div>',
            captions  : '<div class="row caption"></div>', 
            imgwrap   : '<span class="svgal-image-wrap"></span>',
            controls  : {
                closebtn : '<div id="lightbox-close" type="button" class="controls "><span class="glyphicon glyphicon-remove"></span></div>',
                prevbtn  : '<div id="lightbox-prev" type="button" class="controls "><span class="glyphicon glyphicon-chevron-left"></span></div>',
                nextbtn  : '<div id="lightbox-next" type="button" class="controls "><span class="glyphicon glyphicon-chevron-right"></span></div>'
            }
        }
    };
 
    var Source, Body, Container, Navi, Content, Overlay, CurrentItem, PrevItem, NextItem, ImageLink, ImageCaption, SelectedItem, CloseBtn, PrevBtn, NextBtn;

    $.extend(S, settings, options, {

        init: function() {
            
            Source = $(this);

            // Wraps and crops images inside list to customizable size
            Source.find("img").each(function(){
                var $image = $(this);

                // Add class to image parrent for css
                $image.parent().addClass("img-thumbnail svgal-thumbnail");            
                var imageURL = $image.attr("src");

                // Set image wrap template 
                var $imageWrap = $(settings.tpl.imgwrap);
                $imageWrap.css({
                    "background-image": "url('" + imageURL + "')",
                    "width"     : settings.thumbW.toString()+"px",
                    "height"    : settings.thumbH.toString()+"px",
                    "background-position" : settings.thumbA
                }); 

                // Hide the image to use background centering
                $image.hide();

                // Wrap the image with the wrapper
                $image.wrap($imageWrap);                
            });

            // Bind keyboard actions
            $(document).keyup(function(event) {
                
                // console.log(event.keyCode);
                
                if (event.keyCode === 27) {
                    event.preventDefault();
                    S.close(event);        
                }
 
                if ( (event.keyCode === 37) && (S.prevAvailable()) ) {
                    event.preventDefault;
                    S.prev(event, PrevItem);      
                }
 
                if ((event.keyCode === 39) && (S.nextAvailable()) ) {
                    event.preventDefault;
                    S.next(event, NextItem);      
                }
            });

            // Bind click event for all gallery image links
            Source.find("a").each(function(){
                $(this).click(function(e){
                    
                    // Prevent default browser actions
                    e.preventDefault();

                    SelectedItem = $(this)
                    S.open(SelectedItem);

                });
            });

        },

        open: function(item) {

            // Set Current image and promerties
            CurrentItem = item;
            PrevItem = CurrentItem.parent().prev("li").find("a");
            NextItem = CurrentItem.parent().next("li").find("a");            
            ImageLink = CurrentItem.attr("href");

            // Create and append lightbox overlay
            Overlay = $(settings.tpl.overlay);
            $("body").append(Overlay);           

            S.updateContent();

            // Display overlay and fill it with controlls and content
            Overlay.fadeIn("slow", function(){

                Overlay.append(settings.tpl.controls.closebtn);
                if (S.prevAvailable()) {
                    Overlay.append(settings.tpl.controls.prevbtn);
                }
                if (S.nextAvailable()) {
                    Overlay.append(settings.tpl.controls.nextbtn);
                }

                Overlay.append(Container);

                // Bind click events on controls
                S.setControls();

            });

            // Close lightbox when click on the overlay
            // Overlay.click(function(e){
            //     e.preventDefault;
            //     S.close(e);
            // });

        },

        close: function(event) {
            if((event.target.localName !== "img")) {
                Overlay.find(".lightbox-container").fadeOut("fast", function(){
                    $("#overlay .controls").remove();    
                    Overlay.fadeOut("slow", function(){
                        Overlay.remove();
                    });
                });
            }
        },

        // Lightbox will have a navigation through the gallery items (prev/next image)
        next: function(e, item) {

            // Set Current image and promerties
            CurrentItem = item;
            PrevItem = CurrentItem.parent().prev("li").find("a");
            NextItem = CurrentItem.parent().next("li").find("a");            
            ImageLink = CurrentItem.attr("href");

            S.updateContent();
            S.updateOverlay();

        },

        prev: function(e, item) {

            // Set Current image and promerties
            CurrentItem = item;
            PrevItem = CurrentItem.parent().prev("li").find("a");
            NextItem = CurrentItem.parent().next("li").find("a");            
            ImageLink = CurrentItem.attr("href");

            S.updateContent();
            S.updateOverlay();            

        },

        updateContent: function() {
            // Prepare lightbox content body
            Container = $(settings.tpl.container);
            Content = $(settings.tpl.contents);
            var theImage = $('<img src="" alt="">');
            theImage.attr("src", ImageLink).addClass("img-thumbnail");
            Content.append(theImage);

            // If image caption
            if (settings.showCaption) {
                var ImageCaptionString = CurrentItem.find("img").attr("alt");
                ImageCaption = $(settings.tpl.captions);
                ImageCaption.text(ImageCaptionString);
                ImageCaption.css({"color":settings.textColor}); 
            }

            // fill lightbox continer with content
            Container.fadeOut("fast",function(){
                Container.append(Content);
                if (settings.showCaption) {
                    Container.append(ImageCaption); 
                }
            });            
            Container.fadeIn("fast");

        },

        updateOverlay: function() {

            Overlay.empty();

            Overlay.append(settings.tpl.controls.closebtn);
            if (S.prevAvailable()) {
                Overlay.append(settings.tpl.controls.prevbtn);
            }
            if (S.nextAvailable()) {
                Overlay.append(settings.tpl.controls.nextbtn);
            }

            Overlay.append(Container);

            // Bind click events on controls
            S.setControls();

        },

        setControls: function(){
            // Bind click events on controls
            $("#lightbox-close").click(function(e){
                e.preventDefault;
                S.close(e);
            });

            $("#lightbox-prev").click(function(e){
                e.preventDefault;
                S.prev(e, PrevItem);
            });
            
            $("#lightbox-next").click(function(e){
                e.preventDefault;
                S.next(e, NextItem);
            });

        },

        prevAvailable: function(){
            if (PrevItem.length > 0){
                return true
            } else {
                return false
            }
        },

        nextAvailable: function(){
            if (NextItem.length > 0){
                return true
            } else {
                return false
            }             
        }


    });

    S.init();

    // Plugin ends

    }

}(jQuery));

 

$(document).ready(function(){

    // use the plugin
    $("#gallery").sunsetsGallery();

});



