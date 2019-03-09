$(document).ready(function () {

    startTime();

    todaysDate();

    employeeList();
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
var datestamp;
var h;
var m;
var s;


//real time clock
function startTime() {
    var today = new Date();
    h = today.getHours();
    m = today.getMinutes();
    s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById("time").innerHTML =
        h + ":" + m + ":" + s;
    datestamp = h + ":" + m;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function todaysDate() {
    var date = new Date();
    document.getElementById("date").innerHTML = date.toLocaleDateString();
}

function employeeList() {
    //clear current schedule and employee list for refresh
    $("#table").empty();
    $("#employeeList").html("<option selected='selected'>Choose Employee </option>");


    //on database update
    database.ref().on("child_added", function (childSnapshot) {

        $("#employeeList").append("<option value=" + childSnapshot.val().EmployeeName + ">" + childSnapshot.val().EmployeeName + "</option>");
        $("#employees").append("<option value=" + childSnapshot.val().EmployeeName + ">" + childSnapshot.val().EmployeeName + "</option>");
    });
}

/************************************************************Timesheet functions **********************************************/



//Clock In Function
function punchIn() {
    if (selectedEmployee == null) {
        alert("Please Select An Employee")
    } else {
        datestampIn = datestamp;
        alert(selectedEmployee + " Clocked in at " + datestampIn)
        $("#table").append("<tr><td>" + selectedEmployee + "</td><td>" + datestampIn + "</td><td> </td></tr>")
    }
}

//Clock Out Function
function punchOut() {
    if (selectedEmployee == null) {
        alert("Please Select An Employee")
    } else {
        datestampOut = datestamp;
        alert(selectedEmployee + " Clocked out at " + datestampOut)
        $("#table").append("<tr><td>" + selectedEmployee + "</td><td>  </td><td>" + datestampOut + "</td></tr>")
    }
}

// Employee Dropdown list selection change handler
function employeeHandler() {
    selectedEmployee = $('#employeeList').val().trim();

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

        // Change what is saved in firebase
        database.ref().push({
            EmployeeName: newEmployeeName,
        });
        alert(newEmployeeName + " added!");
        $("#employeeList").append("<option value=" + newEmployeeName + ">" + newEmployeeName + "</option>");
    }
};

function employeeRemoveHandler() {
    employeeToRemove = $("#employees").val().trim();
    console.log("remove Select", employeeToRemove);
}

//remove employee modal function
function removeEmployee() {
    console.log("employee to remove", employeeToRemove);

    // Change what is saved in firebase
    database.ref().child(employeeToRemove).remove({

    });
    alert(employeeToRemove + " Removed!");
};