(function($) {

    $.fn.sunsetsGallery = function(options) {

    // Plugin starts

    // Gallery default settings:
    var F = $.sunsetsGallery = function(){};
    var settings = {

        version : '1.0.0',

        thumbW        : 200,
        thumbH        : 150,
        thumbA        : "center top",
        textColor     : "white",
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
                closebtn : '<button id="lightbox-close" type="button" class="controls btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>',
                prevbtn  : '<button id="lightbox-prev" type="button" class="controls btn btn-default"><span class="glyphicon glyphicon-chevron-left"></span></button>',
                nextbtn  : '<button id="lightbox-next" type="button" class="controls btn btn-default"><span class="glyphicon glyphicon-chevron-right"></span></button>'
            }
        }
    };
 
    var Source, Body, Container, Content, Overlay, CurrentItem, PrevItem, NextItem, ImageLink, ImageCaption, SelectedItem, CloseBtn, PrevBtn, NextBtn;

    $.extend(F, settings, options, {

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

            // Bind click event for all gallery image links
            Source.find("a").each(function(){
                $(this).click(function(e){
                    
                    // Prevent default browser actions
                    e.preventDefault();

                    SelectedItem = $(this)
                    F.open(SelectedItem);

                });
            });

        },

        open: function(item) {

            // Set Current image and promerties
            CurrentItem = item;
            ImageLink = CurrentItem.attr("href");

            // Create and append lightbox overlay
            Overlay = $(settings.tpl.overlay);
            $("body").append(Overlay);           

            // Prepare lightbox content body
            Container = $(settings.tpl.container);
            Content = $(settings.tpl.contents);
            var theImage = $('<img src="" alt="">')
            theImage.attr("src", ImageLink).addClass("img-thumbnail");

            // console.log(theImage);

            Content.append(theImage);

            // If image caption
            if (settings.showCaption) {
                var ImageCaptionString = CurrentItem.find("img").attr("alt");
                ImageCaption = $(settings.tpl.captions);
                ImageCaption.text(ImageCaptionString);
                ImageCaption.css({"color":settings.textColor}); 
                Content.append(ImageCaption); 
            }

            // fill lightbox continer with content
            Container.append(Content);
    
            // Display overlay and fill it with controlls and content
            Overlay.fadeIn("slow", function(){
                Overlay.append(settings.tpl.controls.closebtn).append(settings.tpl.controls.prevbtn).append(settings.tpl.controls.nextbtn);
                Overlay.append(Container);

                // Bind click events on controls
                $("#lightbox-close").click(function(e){
                    e.preventDefault;
                    F.close(e);
                });

                $("#lightbox-prev").click(function(e){
                    e.preventDefault;
                    F.prev(e);
                });
                
                $("#lightbox-next").click(function(e){
                    e.preventDefault;
                    F.next(e);
                });

            });

            // Close lightbox when click on the overlay
            Overlay.click(function(e){
                e.preventDefault;
                F.close(e);
            });

        },

        close: function(event) {
            console.log("close click");
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
        next: function(e) {

        },

        prev: function(e) {

        }

    });

    F.init();

    // Plugin ends

    }

}(jQuery));

 

$(document).ready(function(){

    // initialize the plugin
    $("#gallery").sunsetsGallery();

});



