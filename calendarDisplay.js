 (function(){Date.prototype.deltaDays=function(c){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+c)};Date.prototype.getSunday=function(){return this.deltaDays(-1*this.getDay())}})();
        function Week(c){this.sunday=c.getSunday();this.nextWeek=function(){return new Week(this.sunday.deltaDays(7))};this.prevWeek=function(){return new Week(this.sunday.deltaDays(-7))};this.contains=function(b){return this.sunday.valueOf()===b.getSunday().valueOf()};this.getDates=function(){for(var b=[],a=0;7>a;a++)b.push(this.sunday.deltaDays(a));return b}}
        function Month(c,b){this.year=c;this.month=b;this.nextMonth=function(){return new Month(c+Math.floor((b+1)/12),(b+1)%12)};this.prevMonth=function(){return new Month(c+Math.floor((b-1)/12),(b+11)%12)};this.getDateObject=function(a){return new Date(this.year,this.month,a)};this.getWeeks=function(){var a=this.getDateObject(1),b=this.nextMonth().getDateObject(0),c=[],a=new Week(a);for(c.push(a);!a.contains(b);)a=a.nextWeek(),c.push(a);return c}};

    //create array for months
        const monthMap = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysOfMonth = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
        var currentMonth = new Month(2018, 9); // October 2017
    // Change the month when the "next" button is pressed -->
        document.addEventListener("DOMContentLoaded", updateCalendar, false);

    //displays sundays of the next month
        document.getElementById("next_month_btn").addEventListener("click", function(event){
            currentMonth = currentMonth.nextMonth();
            // Previous month would be currentMonth.prevMonth()
            updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
            }, false);

    //displays sundays of the previous month
        document.getElementById("prevs_month_btn").addEventListener("click", function(event){
            currentMonth = currentMonth.prevMonth();// Previous month would be currentMonth.prevMonth()
            updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
            }, false);

    // This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
    // it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.



       //Update calendar function also updates the events for the month via a fetch to findEvents_ajax.php
        async function updateCalendar() {
         //clearing calendar
            clearCalendar();
            //updating month
            const dictIndex = {};
            const dateIndex = {};
            document.getElementById("currMonth").textContent = monthMap[currentMonth.month];
            let x = currentMonth.year;
            document.getElementById("currMonth").textContent += " " + x;
            var weeks = currentMonth.getWeeks();
            let i = 1;
            let q = 1;
            for(var w in weeks){
                var days = weeks[w].getDates();
            // days contains normal JavaScript Date objects.
                for(var d in days){
                    let string = String(q);
                    //console.log("string = 'String(q)'.");
                    //console.log("q = " + q);
                    //console.log("variable: 'string' = " + string);
                    let date = days[d].getDate();
                    //console.log(date);
                    let dateMonth = days[d].getMonth();
                    // if (dateMonth === "December"){console.log("DECEMBER!");} // this line exists only for debugging. delete once debugged.
                    //console.log("this is the month" + dateMonth);
                    document.getElementById(string).textContent = date;
                    //check the month of the days[d].getDate(), if the months are equal, then add the index + date to the dictionary
                    if (dateMonth == currentMonth.month) {
                       //console.log("comparing" + dateMonth, currentMonth.month);
                       dictIndex[date] = i;
                       dateIndex[i] = date;
                    }
                  q++;
                  i++;
                }
            //
            }
            console.log(dictIndex);
            //console.log(dateIndex);
//Fetching response of all events for a specific user and setting their variables
            //const data = {'monthYear': monthYear};
            let response = await fetch("findEvents_ajax.php", {
                method: 'POST',
                headers: {'content-type': 'application/json'}
            });
            let newResponse = await response.json();
            //.catch(error => console.error('Error:', error));
            let dateTimes = newResponse[0];
            console.log(dateTimes);
            let eventID = newResponse[1];
            console.log(eventID);
            let eventNames = newResponse[2];
            console.log(eventNames);

//For loop to split the dateTimes into two separate columns
            let z;
            let dateTimeSplit = [];
            for (z =0; z < dateTimes.length - 1; z++) {
                dateTimeSplit[z] = dateTimes[z].split(" ");
            }
           //console.log(dateTimeSplit);

//For loop iteration through each grid item, declaring a new array for only events occurring on that specific day for dates, times, event names, and event ids
            let gridItem;
            let gridId;
            let day;
            let dateTimeFormat;
            const year = currentMonth.year;
            let month = currentMonth.month + 1;
            console.log("this is the " + month);

            if (month < 10) {
            month = "0" + month;
            }
            const monthYear = year + "-" + month;

            //new arrays for events occurring on that specific day
            let newDates = [];
            let newTimes = [];
            let newEventID = [];
            let newEventNames = [];

            for (gridItem = 1; gridItem < 43; gridItem ++) {
                // first if day is less than 10, create a different dateTimeFormat
                gridId = "list" + gridItem;
                day = dateIndex[gridItem];
                // console.log("This will show the date for a given index" + day);
              if (day != undefined){
                if (day < 10) {
                    dateTimeFormat = monthYear + "-0" + day;
                }
                else {
                    dateTimeFormat = monthYear + "-" + day;
                }
                let iterate;
                for(iterate = 0; iterate < dateTimeSplit.length; iterate++) {
                    if (dateTimeFormat === dateTimeSplit[iterate][0]) {
                        newDates.push(day);
                        newTimes.push(dateTimeSplit[iterate][1]);
                        newEventID.push(eventID[iterate]);
                        newEventNames.push(eventNames[iterate]);
                    }
                }
              }
            }
            //Now append to the document and to the correct grid number
            //console.log(newDates);
            //console.log(dateIndex);
            let finalDate;
            let index;
            let finalEventName;
            let finalIndex;
            for (finalDate = 0; finalDate < newDates.length; finalDate++) {
              index = "list" + dictIndex[newDates[finalDate]];
              console.log(index + "this is what I want to console log");
              finalIndex = String(index);
              //console.log(index);
              let newLi = document.createElement("li");
              finalEventName = String((newEventNames[finalDate]) + " @ " + newTimes[finalDate]);
              newLi.appendChild(document.createTextNode(finalEventName));
              let newRa = makeRadioButton(newEventID[finalDate]);
              newLi.appendChild(newRa);
              document.getElementById(finalIndex).appendChild(newLi);
            }
        }

      //clears the calendar
       function clearCalendar() {
        let listItem;
        let i;
        for (i = 1; i < 43; i++) {
            listItem = "list" + i;
            document.getElementById(listItem).innerHTML = "";
          }
         //
       }

       //to create the radio button for each event
       function makeRadioButton(value) {
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.value = value;
        radio.name = "delete";
        return radio;
        }
