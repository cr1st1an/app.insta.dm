instagram_client_id = '5550778360ba4044ae9a69b1eb5e9840';
instagram_callback_url = 'http://ios.insta.dm/';
instagram_link = 'https://api.instagram.com/oauth/authorize/?client_id='+instagram_client_id+'&redirect_uri='+instagram_callback_url+'&response_type=token&display=touch&scope=relationships+likes+comments';
app_backend_url = 'http://api.insta.dm/v1/';
app_env = 'production';
app_name = 'web';

if('production' === app_env){
    apps_url = 'http://app.insta.dm/';
} else {
    apps_url = 'http://dev.apps.insta.dm/';
}


$("ul li").unbind('mouseenter mouseleave');

if (typeof(PhoneGap) != 'undefined') {
    $('body > *').css({
        minHeight: '460px !important'
    });
}