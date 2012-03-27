// VARS DEVELOPMENT
//instagram_client_id = '08b89296c1944392b9b2138c98a830e2';
//instagram_callback_url = 'http://web.insta.dm/';
//app_backend_url = 'http://live.insta.dm/';
// VARS PRODUCTION
instagram_client_id = 'b0a577d6c09849efa95fb45cbe099b6f';
instagram_callback_url = 'http://app.insta.dm/';
app_backend_url = 'http://api.insta.dm/v1/';

// CONFIG
$(document).bind("mobileinit", function(){
    $.support.cors = true;
    $.mobile.touchOverflowEnabled = true;
    $.mobile.fixedToolbars.setTouchToggleEnabled(false);
    $.mobile.allowCrossDomainPages = true;
});


$("ul li").unbind('mouseenter mouseleave');

if (typeof(PhoneGap) != 'undefined') {
    $('body > *').css({
        minHeight: '460px !important'
    });
}