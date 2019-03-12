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


//real time clock
function startTime() {
    timestamp = moment().format("hh:mm:ss a");
    document.getElementById("time").innerHTML = timestamp;

    var t = setTimeout(startTime, 500);
}


function todaysDate() {
    date = moment().format("dddd MMM Do");;
    document.getElementById("date").innerHTML = date;

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
    var timeTable = firebase.database().ref('employees/');
    timeTable.on('value', function (snapshot) {
        var table = snapshot.val();
        console.log("snapshot value", table);
        for (var timeclock in table) {
            console.log(timeclock);
        }

        for (var name in table) {


            $("#table").append("<tr><td>" + name + "</td><td>" + name.timeclock + "</td><td> </td></tr>")
        }
        for (var punchOUT in table) {
            $("#table").append("<tr><td></td><td></td><td>" + punchOUT + "</td></tr>")
        }
    });
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
        timestampIn = timestamp;
        alert(selectedEmployee + " Clocked in at " + timestampIn)
        $("#table").append("<tr><td>" + selectedEmployee + "</td><td>" + timestampIn + "</td><td> </td></tr>")

        // Change what is saved in firebase
        database.ref("employees/" + selectedEmployee + "/timeclock/IN/").set({
            punchIN: timestampIn,
            date: datestamp,
        });

    }
}


//Clock Out Function
function punchOut() {
    if (selectedEmployee === undefined) {
        alert("Please Select An Employee")
    } else {
        timestampOut = timestamp;
        alert(selectedEmployee + " Clocked in at " + timestampOut)
        $("#table").append("<tr><td>" + selectedEmployee + "</td><td></td><td> " + timestampOut + "</td></tr>")

        // Change what is saved in firebase
        database.ref("employees/" + selectedEmployee).push({
            punchOUT: timestampOut,
            date: datestamp,
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
        // Get inputs
        newEmployeeName = $("#nameInput").val().trim();

        $("#employeeList").append("<option value=" + newEmployeeName + ">" + newEmployeeName + "</option>");
        $("#employees").append("<option value=" + newEmployeeName + ">" + newEmployeeName + "</option>");

        // Change what is saved in firebase
        database.ref("employees/" + newEmployeeName).set({
            name: newEmployeeName,
        });
        alert(newEmployeeName + " added!");
        // $("#add-modal-content").html("Success!");
        employeeList();
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
};