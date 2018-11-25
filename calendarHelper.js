//Registers User
function registerAjax(event) {
    const username = document.getElementById("regUsername").value; // Get the username from the form
    const password = document.getElementById("regPassword").value; // Get the password from the form
    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("register_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
            })
        .then(response => response.json())
        .then(data => document.getElementById("regOutput").textContent = (data.success ? "You've been registered!" : `${data.message}`));
        document.getElementById("regOutput").textContent = "You have been registered!";
        //displaying the add page
        document.getElementById("addEventForm").style.display = 'block';
}
document.getElementById("register_btn").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click

//Logs in user
function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
    .then(response => response.json())
    .then(data => document.getElementById("regOutput").textContent = (data.success ? "You've been logged in!" : `${data.message}`));
     document.getElementById("regOutput").textContent = "You have been logged in!";
     document.getElementById("addEventForm").style.display = 'block';
     updateCalendar();
}

document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click

//Called when user clicks on add event button
function addEvent() {
    let hour = document.getElementById("addEventForm").getElementsByClassName("hour")[0].value;
    let minutes = String(document.getElementById("addEventForm").getElementsByClassName("minutes")[0].value);
    let AMPM = String(document.getElementById("addEventForm").getElementsByClassName("AMPM")[0].value);
    let month = String(document.getElementById("addEventForm").getElementsByClassName("month")[0].value);
    let day = String(document.getElementById("addEventForm").getElementsByClassName("date")[0].value);
    let year = String(document.getElementById("addEventForm").getElementsByClassName("year")[0].value);
    let eventName = String(document.getElementById("addEventForm").getElementsByClassName("eventName")[0].value);

    //checking whether time is AM or PM then converting to military time if required
    if (AMPM === "pm") {
        //checking if the value of hour is noon
        if(hour === "12") {
        hour = 12;
        }
        else {
        hour = +hour + +12;
        }
    }
    else {
        if(hour === "12") {
            hour = "00";
        }
        else {
            hour = hour;
        }
    }
    //setting dateTime variable to be passed to addEvent.php
    const dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":00";
    const data = {'eventName' : eventName, 'dateTime' : dateTime};
    console.log(data);
    fetch("addEvents_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
    .then(response => response.json())
    .then(data => console.log(data.success ? "The event has been added to mysql!" : `The event was not added to mysql: ${data.message}`));
     document.getElementById("addEventForm").style.display = 'block';
     updateCalendar();
}

document.getElementById("addEvent").addEventListener("click", addEvent, false); // Bind the AJAX call to button click

//called when delete button is clicked and a radio event is checked
function deleteEvent() {
    let which_event;
    //to obtain event id of one that was clicked
    function getCheckedRadio(){
        let event_operation = document.getElementsByName("delete");
        for (let i = 0; i < event_operation.length; i++) {
            if (event_operation[i].checked) {
                which_event = event_operation[i].value;
            }
        }
    }
    getCheckedRadio();
    const data = {'eventId' : which_event};
    fetch("deleteEvents_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
    document.getElementById("addEventForm").style.display = 'block';
    updateCalendar();
}
document.getElementById("addEventForm").getElementsByClassName("deleteEvent")[0].addEventListener("click", deleteEvent, false);

//called when update button is clicked and a radio event is checked
function updateEvent(){
    let hour = document.getElementById("addEventForm").getElementsByClassName("hour")[0].value;
    let minutes = String(document.getElementById("addEventForm").getElementsByClassName("minutes")[0].value);
    let AMPM = String(document.getElementById("addEventForm").getElementsByClassName("AMPM")[0].value);
    let month = String(document.getElementById("addEventForm").getElementsByClassName("month")[0].value);
    let day = String(document.getElementById("addEventForm").getElementsByClassName("date")[0].value);
    let year = String(document.getElementById("addEventForm").getElementsByClassName("year")[0].value);
    let eventName = String(document.getElementById("addEventForm").getElementsByClassName("eventName")[0].value);
        //checking whether time is AM or PM then converting to military time if required
    if (AMPM === "pm") {
        //checking if the value of hour is noon
        if(hour === "12") {
        hour = 12;
        }
        else {
        hour = +hour + +12;
        }
    }
    else {
        if(hour === "12") {
            hour = "00";
        }
        else {
            hour = hour;
        }
    }
    //setting dateTime variable to be passed to addEvent.php
    const dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":00";
    let which_event;
    function getCheckedRadio(){
        let event_operation = document.getElementsByName("delete");
        for (let i = 0; i < event_operation.length; i++) {
            if (event_operation[i].checked) {
                which_event = event_operation[i].value;
            }
        }
    }
    getCheckedRadio();
    const data = {'eventId': which_event, 'eventName' : eventName, 'dateTime' : dateTime};
    console.log(data);
    fetch("updateEvent.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
    document.getElementById("addEventForm").style.display = 'block';
    updateCalendar();
}

document.getElementById("addEventForm").getElementsByClassName("updateEvent")[0].addEventListener("click", updateEvent, false);

 function logout() {
   fetch("logout.php"), {
     method: 'POST',
     headers: {'content-type': 'application/json'}
   }
   clearCalendar(); 
 }
 document.getElementById("logout").addEventListener("click", logout, false);
