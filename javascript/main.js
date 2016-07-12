// hide main logo & nav on scroll

$(window).scroll(function() {
    if ($(this).scrollTop() > 600) {
        $('.hideonscroll').fadeOut();
    }

    if ($(this).scrollTop() < 600) {
        $('.hideonscroll').fadeIn();
    }
});


// smooth scrolling to anchors

$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});

/*-------------------REST-API------------------------*/
var restUrl = "http://127.0.0.1:3002";

//cookie-getter
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

//cookie löschen
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


//get all events
var queryEvents = function() {
    console.log("REST: queryEvents()");
    var xhttp = new XMLHttpRequest();
    var reqPath = restUrl + "/queryEvents";

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var events = JSON.parse(xhttp.responseText);
            //dynamically add event objects to event section when events are planned
            if (events.length > 0) {
              var tableContent = "<tr><th><h4>Was?</h4></th><th><h4>Wann?</h4></th><th><h4>Wie?</h4></th></tr>";

              //iterate through event array and add events to tableContent
              for(var i = 0; i<events.length; i++) {
                var newContent = "<tr><td>"+events[i].name+"</td><td>"+new Date(events[i].time)+"</td><td>"+events[i].description+"</td></tr>";
                tableContent += newContent;
              }
              //update event table
                $("#eventtable").html(tableContent);
            }
        }
    };
    xhttp.open("GET", reqPath, true);
    xhttp.setRequestHeader('content-type', 'application/json');
    xhttp.send();
}

//signup for event
var signup = function() {
    //get name and email from userinput, eventid from clicked event
    var name = "";
    var email = "";
    var eventid = "";

    //put user credentials in a string
    var body = JSON.stringify({
        'name': name,
        'email': email,
        'eventid': eventid
    });

    console.log("REST: signup()");
    var xhttp = new XMLHttpRequest();
    var reqPath = restUrl + "/signup";

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("POST", reqPath, true);
    xhttp.setRequestHeader('content-type', 'application/json');
    xhttp.send(body);
}

//create event
var createEvent = function(name, creator, description, time, maxParticipants) {

    //put event details and admin credentials in a string
    var body = JSON.stringify({
        'name': name,
        'creator': creator,
        'description': description,
        'time': time,
        'maxParticipants': maxParticipants,
        'id': getCookie("id")
    });

    console.log("REST: createEvent()");
    console.log(body);
    var xhttp = new XMLHttpRequest();
    var reqPath = restUrl + "/createEvent";

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
        }
    };
    xhttp.open("POST", reqPath, true);
    xhttp.setRequestHeader('content-type', 'application/json');
    xhttp.send(body);
}
//signin as admin
//signup for event
var adminSignin = function() {
    //get name and email from userinput, eventid from clicked event
    var name = $("#loginName").val();
    var password = $("#loginPassword").val();

    //put admin credentials in a string
    var body = JSON.stringify({
        'name': name,
        'password': password
    });

    console.log("REST: adminSignin()");
    var xhttp = new XMLHttpRequest();
    var reqPath = restUrl + "/adminSignin";

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) { //login successful
            console.log("Logged in as Admin");
            //open admin page
            document.body.innerHTML = xhttp.responseText;
        } else if (xhttp.status == 404) { //login failed
            console.log("Login failed!");
        }
    };

    xhttp.open("POST", reqPath, true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader('content-type', 'application/json');
    //xhttp.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    xhttp.send(body);
}

//Listener
  $("body").on("submit", "#createeventform", function(data) {
     createEvent(data.target[0].value, data.target[4].value, data.target[1].value, data.target[2].value, data.target[3].value);
     return false;
  });


/*-----------------------ON LOAD-----------------------*/
//loginlistener
$("#login").on("click", function() {
  //open adminlogin
  $("#login-form").css("display", "block");
});
queryEvents();
