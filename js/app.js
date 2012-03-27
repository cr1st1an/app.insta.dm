var session_id = UTIL_cookie_read('session_id');
var session_access_token = UTIL_cookie_read('access_token');

var session_page = UTIL_cookie_read('page');

function indexController(){
    
    var go = UTIL_get_url_vars()["go"];
    var id_user_b;
    var message_id;
    switch(go){
        case 'auth':
            UTIL_cookie_create('page', 'auth', 365);

            access_token = UTIL_get_url_vars()["access_token"];
            UTIL_cookie_create('access_token', access_token, 365);

            window.location.href = '/';
        case 'inbox':
            UTIL_cookie_create('page', 'inbox', 365);
            window.location.href = '/';
            break;
        case 'conversation':
            UTIL_cookie_create('page', 'conversation', 365);

            id_user_b = UTIL_get_url_vars()["id_user_b"];
            message_id = UTIL_get_url_vars()["message_id"];

            if(message_id == undefined)
                message_id = 0;

            UTIL_cookie_create('id_user_b', id_user_b, 365);
            UTIL_cookie_create('message_id', message_id, 365);
            window.location.href = '/';
            break;
        case 'logout':
            UTIL_cookie_create('page', 'logout', 365);
            window.location.href = '/';
            break;
        default:
            var hash_access_token = window.location.href.replace(instagram_callback_url+'#access_token=', ''); // stands for handleOpenUrl
            if(hash_access_token != window.location.href)
                window.location.href = '/?go=auth&access_token='+hash_access_token; //BECAUSE HASH BREAKS PAGE
            
            switch(session_page){
                case 'auth':
                    access_token = UTIL_cookie_read('access_token');
                    REQ_auth(access_token);
                    break;
                case 'inbox':
                    REQ_inbox();
                    break;
                case 'conversation':
                    id_user_b = UTIL_cookie_read('id_user_b');
                    message_id = UTIL_cookie_read('message_id');
                    L_conversation(id_user_b,message_id);
                    break;
                case 'logout':
                    L_logout();
                    break;
                default:
                    L_index();
                    break;
            }
            break;
    }
}

// LINK
function L_index(){
    UI_index();
}
function L_mail(){
}
function L_inbox(){
    REQ_inbox();
}
function L_inbox_r(response){
    

    responseController(response, 'L_inbox');
    REQ_inbox();
}
function L_friends(){
    REQ_friends();
}
function L_search(text){
    REQ_search(text);
}
function L_conversation(id_user_b, message_id){
    REQ_conversation(id_user_b, message_id);
}
function L_add_message(id_user_b, message){
    REQ_add_message(id_user_b, message);
}
function L_delete(id_user_b){
    REQ_delete(id_user_b);
}
function L_logout(){
    REQ_logout();
}
function L_push(){
    REQ_email();
}
function L_push_r(response){
    

    responseController(response, 'L_push');
    REQ_email();
}
function L_boxcar(email){
    REQ_boxcar(email);
}
// END LINK

// REQ
function REQ_auth(access_token){
    $.mobile.showPageLoadingMsg();
    UTIL_cookie_create('access_token', access_token, 365);
    session_access_token = access_token;
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': '_auth',
            'access_token': access_token
        },
        jsonpCallback: "instaCallback",
        success: DO_auth,
        error: errorController
    });
}
function REQ_inbox(){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': 'get_conversations'
        },
        jsonpCallback: "instaCallback",
        success: UI_inbox,
        error: errorController
    });
}
function REQ_friends(){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': 'get_friends'
        },
        jsonpCallback: "instaCallback",
        success: UI_friends,
        error: errorController
    });
}
function REQ_search(text){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': '_search',
            'text' : text
        },
        jsonpCallback: "instaCallback",
        success: UI_search,
        error: errorController
    });
}
function REQ_conversation(id_user_b, message_id){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': 'get_conversation',
            'id_user_b' : id_user_b,
            'message_id' : message_id
        },
        jsonpCallback: "instaCallback",
        success: UI_conversation,
        error: errorController
    });
}
function REQ_add_message(id_user_b, message){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': 'add_message',
            'id_user_b' : id_user_b,
            'message' : message
        },
        jsonpCallback: "instaCallback",
        success: UI_conversation,
        error: errorController
    });
}
function REQ_delete(id_user_b){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': 'delete_conversation',
            'id_user_b' : id_user_b
        },
        jsonpCallback: "instaCallback",
        success: L_inbox_r,
        error: errorController
    });
}
function REQ_email(){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': 'email'
        },
        jsonpCallback: "instaCallback",
        success: UI_push,
        error: errorController
    });
}
function REQ_boxcar(email){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': 'boxcar',
            'email' : email
        },
        jsonpCallback: "instaCallback",
        success: L_push_r,
        error: errorController
    });
}
function REQ_logout(){
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: app_backend_url,
        dataType: "jsonp",
        data: {
            'type' : 'callback',
            'do': '_logout'
        },
        jsonpCallback: "instaCallback",
        success: DO_logout,
        error: errorController
    });
}
// END REQ

function errorController(jxhr, status, err){
    alert("Error, status = " + status + ", err = " + err);
}
function responseController(response, call){
    if(!response['success']){
        if(response['session']){
            alert(response['message']);
        } else {
            if(session_access_token != null){
                REQ_auth(session_access_token);
            } else {
                window.location.href = '/?go=logout';
            }
        }
    }
}

// DO
function DO_auth(response){
    if(response['success']){
        UTIL_cookie_create('session_id', response['id'], 365);
        session_id = response['id'];
        REQ_inbox();
    } else {
        L_logout();
    }
}
function DO_logout(){
    UTIL_cookie_erase('access_token');
    UTIL_cookie_erase('session_id');
    UTIL_cookie_erase('page');

    session_id = null;
    session_access_token = null;
    session_page = null;

    UI_index();
    UI_logout();
    $.mobile.hidePageLoadingMsg();
}
// END DO

// UI
function UI_index(){
    $( "div[data-role=page]" ).page();
    $('html, body').animate({
        scrollTop: 0
    }, 0);

    $('#indexHeader').empty();
    $('#indexHeader').append(UI_button('mail us', 'mailto:mail@insta.dm', 'd', 'check', null, null));
    $('#indexHeader').append(UI_h1('&nbsp;'));
    if(session_id != null){
        $('#indexHeader').append(UI_button('logout', 'javascript:L_logout();', null, 'delete', true, 'position:absolute;top:0;right:0;margin:5px;'));
        $('#indexHeader').append(UI_button('push', 'javascript:L_push();', null, 'gear', null, 'position:absolute;top:0;right:85px;margin:5px;'));
    }

    $('#indexContent').empty();
    $('#indexContent').scrollTop();

    $('#indexContent').append('<img src="http://app.insta.dm/img/home.jpg" width="300" height="270" border="0" alt="instaDM" style="margin-left:-10px;margin-top:-10px;" />');
    if(session_id == null)
        $('#indexContent').append('<a href="https://api.instagram.com/oauth/authorize/?client_id='+instagram_client_id+'&redirect_uri='+instagram_callback_url+'&response_type=token&display=touch&scope=relationships"><img src="http://app.insta.dm/img/login.jpg" width="300" height="80" border="0" alt="inbox" style="margin-left:-10px;" /></a>');
    else
        $('#indexContent').append('<a href="javascript:L_inbox();"><img src="http://app.insta.dm/img/read.jpg" width="300" height="80" border="0" alt="inbox" style="margin-left:-10px;" /></a>');

    $( "div[data-role=page]" ).page( "destroy" ).page();
}
function UI_inbox(response){

    responseController(response, 'UI_inbox');

    if(response['success']){
        $( "div[data-role=page]" ).page();
        $('html, body').animate({
            scrollTop: 0
        }, 0);
    
        $('#indexHeader').empty();
        $('#indexHeader').append(UI_button('back', 'javascript:L_index();', null, 'arrow-l', null, null));
        $('#indexHeader').append(UI_h1('Inbox'));
        $('#indexHeader').append(UI_button('new', 'javascript:L_friends();', 'b', 'plus', null, null));

        $('#indexContent').empty();
        $('#indexContent').scrollTop();

        if(response['success']){
            $('#indexContent').append('<ul id="conversationsList" data-role="listview" data-theme="d" style="margin-top:3px;overflow:hidden;">');
            $('#conversationsList').append(UI_li_promoted());
            conversations = response['conversations_data'];
            $.each(conversations, function(index, conversation) {
                $('#conversationsList').append('<li><a href="javascript:L_conversation('+conversation['id_user_b']+',0);" >' +
                    '<img src="' + conversation['profile_picture'] + '"/>' +
                    '<h4>' + conversation['username'] + '</h4>' +
                    '<p><img style="margin-bottom:-4px;" src="http://app.insta.dm/img/status_' + conversation['status'] + '.png" alt="1" />' + (( conversation['status'] == 5)?  '<strong>' : '') + conversation['message'] + (( conversation['status'] == 5)?  '</strong>' : '') + '</p>' +
                    '</a></li>');
            });
            $('#conversationsList').listview();
            $('#indexContent').append('</ul>');
            $('#indexContent').append('<div style="padding-top:30px;"><a href="#indexContent" onclick="javascript:L_friends();" type="submit" data-theme="b">New conversation</a></div>');
        } else {
            $('#indexContent').append('<div style="padding-top:30px;"><a href="#indexContent" onclick="javascript:L_friends();" type="submit" data-theme="b">New conversation</a></div>');
        }

        $( "div[data-role=page]" ).page( "destroy" ).page();
        $.mobile.hidePageLoadingMsg();
    }
}
function UI_friends(response){
    

    responseController(response, 'UI_friends');

    if(response['success']){
        $( "div[data-role=page]" ).page();
        $('html, body').animate({
            scrollTop: 0
        }, 0);

        $('#indexHeader').empty();
        $('#indexHeader').append(UI_button('back', 'javascript:L_inbox();', null, 'arrow-l', null, null));
        $('#indexHeader').append(UI_h1('Select recipient'));

        $('#indexContent').empty();
        $('#indexContent').scrollTop();

        if(response['success']){
            $('#indexContent').append('<ul id="friendsList" data-role="listview" data-theme="d" style="margin-top:3px;overflow:hidden;">');
            $('#friendsList').append(UI_li_promoted());
            friends = response['friends_data'];
            $.each(friends, function(index, friend) {
                $('#friendsList').append('<li><a href="javascript:L_conversation('+friend['id']+',0);" >' +
                    '<strong>@' + friend['username'] + '</strong><span style="font-size:14px;font-weight:normal;">' + (( friend['full_name'] != '')?  ', ' + friend['full_name'] +'' : '') + '</span>' +
                    '</a></li>');
            });
            $('#friendsList').append('<li data-role="list-divider"> Not here?</li>');
            $('#friendsList').listview();
            $('#indexContent').append('</ul>');

            $('#indexContent').append('<form name="search" action="#" method="post" style="width:90%;margin:30px auto;">'+
                '<input type="text" name="text" placeholder="...search" id="text" />'+
                '<a href="javascript:void(0);" onclick="javascript:($(\'#text\').val() != \'\')? (L_search($(\'#text\').val())) : alert(\'Please insert your search.\');" type="submit" data-theme="b">Search</a>'+
                '</form>');
        }

        $( "div[data-role=page]" ).page( "destroy" ).page();
        $.mobile.hidePageLoadingMsg();
    }
}
function UI_search(response){
    

    responseController(response, 'UI_search');

    if(response['success']){
        $( "div[data-role=page]" ).page();
        $('html, body').animate({
            scrollTop: 0
        }, 0);

        $('#indexHeader').empty();
        $('#indexHeader').append(UI_button('back', 'javascript:L_friends();', null, 'arrow-l', null, null));
        $('#indexHeader').append(UI_h1('Select recipient'));

        $('#indexContent').empty();
        $('#indexContent').scrollTop();

        if(response['success']){
            $('#indexContent').append('<ul id="usersList" data-role="listview" data-theme="d" style="margin-top:3px;overflow:hidden;">');
            $('#usersList').append(UI_li_promoted());
            users = response['users_data'];
            $.each(users, function(index, user) {
                $('#usersList').append('<li><a href="javascript:L_conversation('+user['id']+',0);" >' +
                    '<strong>@' + user['username'] + '</strong><span style="font-size:14px;font-weight:normal;">' + (( user['full_name'] != '')?  ', ' + user['full_name'] +'' : '') + '</span>' +
                    '</a></li>');
            });
            $('#usersList').append('<li data-role="list-divider"> Not here?</li>');
            $('#usersList').listview();
            $('#indexContent').append('</ul>');

            $('#indexContent').append('<form name="search" action="#" method="post" style="width:90%;margin:30px auto;">'+
                '<input type="text" name="text" placeholder="...search" id="text" />'+
                '<a href="#indexContent" onclick="javascript:($(\'#text\').val() != \'\')? (L_search($(\'#text\').val())) : alert(\'Please insert your search.\');" type="submit" data-theme="b">Search</a>'+
                '</form>');


        }

        $( "div[data-role=page]" ).page( "destroy" ).page();
        $.mobile.hidePageLoadingMsg();
    }
}
function UI_conversation(response){
    

    responseController(response, 'UI_conversation');

    if(response['success']){
        var last_message_id = 0;
        var go_to_message = 0;
        $( "div[data-role=page]" ).page();
        $('html, body').animate({
            scrollTop: 0
        }, 0);

        $('#indexHeader').empty();
        $('#indexHeader').append(UI_button('back', 'javascript:L_inbox();', null, 'arrow-l', null, null));
        if(response['success']){
            user_b = response['user_b_data'];
            $('#indexHeader').append(UI_h1('@'+user_b['username']));
        }

        $('#indexContent').empty();
        if(response['success']){
            $('#indexContent').append('<ul id="messagesList" data-role="listview" data-theme="d" style="margin-top:3px;overflow:hidden;">');
            messages = response['messages_data'];
            $.each(messages, function(index, message) {
                $('#messagesList').append('<li id="'+message['id']+'" data-theme="' + (( message['status'] == 1)?  'd' : 'b') + '">' +
                    '<p>' +
                    '<strong>' + (( message['status'] == 1)?  'you' : user_b['username']) + ':</strong>' +
                    '<span style="float:right;">'+ message['date'] +'</span>' +
                    ' </p>' +
                    '<div style="font-weight:normal;">' + message['message'] + '</div>' +
                    '</li>');
                last_message_id = message['id'];
            });
            $('#messagesList').listview();
            $('#indexContent').append('</ul>');
        
            $('#indexContent').append('<form name="newMessage" action="#" method="post" style="width:90%;margin:30px auto;">'+
                '<textarea name="message" placeholder="Type your message" id="message"></textarea>'+
                '<a href="#indexContent" onclick="javascript:($(\'#message\').val() != \'\')? (L_add_message('+user_b['id']+',$(\'#message\').val())) : alert(\'Please add your message.\');" type="submit" data-theme="b">Send</a>'+
                '</form>');
            $('#indexContent').append('<br/><br/><br/><br/>'+
                '<a href="javascript:UI_delete('+user_b['id']+');" type="submit" data-theme="d">[delete conversation]</a>');

            if(response['message_id'] != 0)
                go_to_message = response['message_id'];
        }
        if(go_to_message != 0)
            $('#indexContent').scrollTop($('#'+go_to_message).offset().top);
        else if(last_message_id != 0)
            $('#indexContent').scrollTop($('#'+last_message_id).offset().top);

        $( "div[data-role=page]" ).page( "destroy" ).page();
        $.mobile.hidePageLoadingMsg();
    }
}
function UI_delete(id_user_b){
    $( "div[data-role=page]" ).page();
    $('html, body').animate({
        scrollTop: 0
    }, 0);

    $('#indexHeader').empty();
    $('#indexHeader').append(UI_button('back', 'javascript:L_conversation('+id_user_b+',0);', null, 'arrow-l', null, null));
    $('#indexHeader').append(UI_h1('Confirm'));

    $('#indexContent').empty();
    $('#indexContent').scrollTop();
    $('#indexContent').append(UI_p('Are you sure you want to delete the conversation and all of it\'s messages?'));
    $('#indexContent').append(UI_button('Yes I\'m sure', 'javascript:L_delete('+id_user_b+');', 'a', null, null, null));

    $( "div[data-role=page]" ).page( "destroy" ).page();
}
function UI_push(response){
    

    responseController(response, 'UI_push');

    if(response['success']){
        $( "div[data-role=page]" ).page();
        $('html, body').animate({
            scrollTop: 0
        }, 0);

        $('#indexHeader').empty();
        $('#indexHeader').append(UI_button('back', 'javascript:L_index();', null, 'arrow-l', null, null));
        $('#indexHeader').append(UI_h1('Activate push'));
        $('#indexHeader').append(UI_button('inbox', 'javascript:L_inbox();', 'e', 'star', null, null));

        $('#indexContent').empty();
        $('#indexContent').scrollTop();
        $('#indexContent').append(UI_p('Setup boxcar to receive push notifications, and avoid being mentioned by @instadm on instagr.am. It\'s really easy.'));
        $('#indexContent').append(UI_h2('[Step 1]'));
        $('#indexContent').append(UI_p('<a href="http://phobos.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=321493542&mt=8&ign-mpt=uo%3D6" data-role="button">Install Boxcar</a>'));
        $('#indexContent').append(UI_h2('[Step 2]'));
        $('#indexContent').append('<form name="activate" action="#" method="post" style="width:90%;margin:30px auto;">'+
            '<input type="text" name="email" placeholder="Enter you email" id="email" value="'+(( response['email'] != null)?  response['email'] : '')+'" />'+
            '<a href="#indexContent" onclick="javascript:L_boxcar($(\'#email\').val());" type="submit" data-theme="b">Activate</a>'+
            '</form>');
        
        $( "div[data-role=page]" ).page( "destroy" ).page();
        $.mobile.hidePageLoadingMsg();
    }
}
function UI_logout(){
    $('#indexContent').append('<iframe src="https://instagram.com/accounts/logout/" width="0" height="0" frameborder="0" scrolling="no"></iframe>');
}
function UI_h1(title){
    return '<h1>'+title+'</h1>';
}
function UI_h2(title){
    return '<h2>'+title+'</h2>';
}
function UI_p(paragraph){
    return '<p>'+paragraph+'</p>';
}
function UI_button(text, href, theme, icon, external, style){
    attributes = '';
    attributes += 'data-role="button" ';
    attributes += 'href="'+href+'" ';
    if(theme != null)
        attributes += 'data-theme="'+theme+'" ';
    if(icon != null)
        attributes += 'data-icon="'+icon+'" ';
    if(external != null)
        attributes += 'rel="external" ';
    if(external != style)
        attributes += 'style="'+style+'" ';

    return '<a '+attributes+'>'+text+'</a>';
}
function UI_li_promoted(){
    var li = '';
    li += '<li><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4D869HB9PDLTQ" >' +
    '<strong>Help me!</strong><span style="font-size:14px;font-weight:normal;"> Donate now.</span>' +
    '</a></li>'
    return '';
}
function UI_adsense(){
    var html = '';
    html += '<script type="text/javascript"><!--'+ "\n" +
    '// XHTML should not attempt to parse these strings, declare them CDATA.'+ "\n" +
    '/* <![CDATA[ */'+ "\n" +
    'window.googleAfmcRequest = {'+ "\n" +
    'client: \'ca-mb-pub-9668906758484557\','+ "\n" +
    'format: \'320x50_mb\','+ "\n" +
    'output: \'HTML\','+ "\n" +
    'slotname: \'6846118977\','+ "\n" +
    '};'+ "\n" +
    '/* ]]> */'+ "\n" +
    '//--></script>'+ "\n" +
    '<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_afmc_ads.js"></script>';
    return html;
}
// END UI

// UTIL
function UTIL_get_url_vars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function UTIL_dump_object(obj){
    for (var item in obj)
        alert('response['+item+'] = '+ obj[item]);
}
function UTIL_cookie_create(name,value,days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    else expires = "";
    document.cookie = name+"="+value+expires+"; path=/;";
}
function UTIL_cookie_read(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function UTIL_cookie_erase(name) {
    UTIL_cookie_create(name,"",-1);
}
/// END UTIL