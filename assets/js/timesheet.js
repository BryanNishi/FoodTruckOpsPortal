$(document).ready(function () {

    startTime();

    todaysDate();

    employeeList();

    timesheet();

});


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCx0NTAl-KShguYzZijjJcykeh-Y6nTF2Q",
    authDomain: "foodtruckops.firebaseapp.com",
    databaseURL: "https://foodtruckops.firebaseio.com",
    projectId: "foodtruckops",
    storageBucket: "",
    messagingSenderId: "2538457866"
};
firebase.initializeApp(config);

var database = firebase.database();
var selectedEmployee;
var newEmployeeName;
var employeeToRemove;
var timestamp;
var datestamp;
var timestampIn = "00:00";
var timestampOut = "00:00";
var selectedDate;
var yesterday = 0;
var tomorrow = 0;
var dateChange = 0;


//real time clock
function startTime() {
    timestamp = moment().format("hh:mm:ss a");
    document.getElementById("time").innerHTML = timestamp;
    var t = setTimeout(startTime, 250);
}


function todaysDate() {
    date = moment().format("ddd MMM Do");
    document.getElementById("date").innerHTML = date;

    databaseDate = moment().format("MMM Do");
}

//load employee list
function employeeList() {
    //clear current schedule for refresh
    $("#table").empty();

    //load existing values
    var employeeList = firebase.database().ref('employees/');
    employeeList.on('value', function (snapshot) {
        var list = snapshot.val();
        $("#employeeList").empty();
        $("#employeeList").html("<option selected='selected'>Choose Employee </option>");
        for (var name in list) {
            $("#employeeList").append("<option value=" + name + ">" + name + "</option>");
            $("#employees").append("<option value=" + name + ">" + name + "</option>");
        }
    });
}
//load time sheet table
function timesheet() {
    var employeeIN;
    var employeeOUT;
    $("#table").empty();
    var timeTable = firebase.database().ref('employees/');
    timeTable.on('value', function (snapshot) {
        var table = snapshot.val();
        var key = Object.keys(snapshot.val());
        selectedDate = databaseDate;

        var i;
        for (i = 0; i < key.length; i++) {
            name = key[i].valueOf();
            console.log("this", table[name][selectedDate].IN.punchIN.valueOf())
            if (table[name][selectedDate].IN !== "undefined") {
                employeeIN = table[name][selectedDate].IN.punchIN.valueOf();
                console.log(employeeIN);
            } else {
                employeeIN = "00:00";
            }

            if (table[name][selectedDate].OUT !== "undefined") {
                employeeOUT = table[name][selectedDate].OUT.punchOUT.valueOf();
            } else {
                employeeOUT = "00:00";
            }
            $("#table").append("<tr><td>" + name + "</td><td>" + employeeIN + "</td><td>" + employeeOUT + "</td></tr>");

        }
    });
}

function dateBack() {
    yesterday++;
    date = moment().subtract(yesterday, 'days').format("ddd MMM Do");
    document.getElementById("date").innerHTML = date;
    databaseDate = moment().subtract(yesterday, 'days').format("MMM Do");
    timesheet();
}

function dateForward() {
    tomorrow++;
    date = moment().add(tomorrow, 'days').format("ddd MMM Do");
    document.getElementById("date").innerHTML = date;
    databaseDate = date;
    timesheet();
}

/************************************************************Timesheet functions **********************************************/

// Employee Dropdown list selection change handler
function employeeHandler() {
    selectedEmployee = $('#employeeList').val().trim();
}

//Clock In Function
function punchIn() {
    if (selectedEmployee === undefined) {
        alert("Please Select An Employee")
    } else {
        $("#table").empty();
        timestampIn = timestamp;
        alert(selectedEmployee + " Clocked in at " + timestampIn)
        // $("#table").append("<tr><td>" + selectedEmployee + "</td><td>" + timestampIn + "</td><td> </td></tr>")

        // Change what is saved in firebase
        database.ref("employees/" + selectedEmployee + "/" + databaseDate + "/IN").set({
            punchIN: timestampIn,
            punchOUT: timestampOut,
        });

    }
}


//Clock Out Function
function punchOut() {
    if (selectedEmployee === undefined) {
        alert("Please Select An Employee")
    } else {
        $("#table").empty();
        timestampOut = timestamp;
        alert(selectedEmployee + " Clocked in at " + timestampOut)
        // $("#table").append("<tr><td>" + selectedEmployee + "</td><td></td><td> " + timestampOut + "</td></tr>")

        // Change what is saved in firebase
        database.ref("employees/" + selectedEmployee + "/" + databaseDate + "/OUT").set({
            punchIN: timestampIn,
            punchOUT: timestampOut,
        });
    }
}

//Add employee modal function
function addEmployee() {
    //prevent empty form input
    if ($("#nameInput").val() === "") {
        alert("Please input a name");
        return false;
    } else {
        $("#table").empty();
        // Get inputs
        newEmployeeName = $("#nameInput").val().trim();

        $("#employeeList").append("<option value=" + newEmployeeName + ">" + newEmployeeName + "</option>");
        $("#employees").append("<option value=" + newEmployeeName + ">" + newEmployeeName + "</option>");

        // Change what is saved in firebase
        database.ref("employees/" + newEmployeeName).set({
            name: newEmployeeName,
        });
        database.ref("employees/" + newEmployeeName + "/" + databaseDate + "/OUT").set({
            punchOUT: "00:00",
        });
        database.ref("employees/" + newEmployeeName + "/" + databaseDate + "/IN").set({
            punchIN: "00:00",
        });
        alert(newEmployeeName + " added!");
        // $("#add-modal-content").html("Success!");
        employeeList();
        timesheet()
    }
};

function employeeRemoveHandler() {
    employeeToRemove = $("#employees").val().trim();
}

//remove employee modal function
function removeEmployee() {
    console.log("employee to remove", employeeToRemove);

    // Change what is saved in firebase
    database.ref("employees/" + employeeToRemove).remove();
    alert(employeeToRemove + " Removed!");
    // $("#remove-modal-content").html(employeeToRemove + " Removed!");
    employeeList();
    timesheet();
};