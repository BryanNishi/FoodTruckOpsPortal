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

    database.ref().on("value", function () {
        console.log("data" + snapshot.val());

    });
    //on database update
    database.ref().on("child_added", function (childSnapshot) {
        //console.log("database ", childSnapshot);

        $("#employeeList").append("<option value=" + childSnapshot.val().EmployeeName + ">" + childSnapshot.val().EmployeeName + "</option>");
        $("#employees").append("<option value=" + childSnapshot.val().EmployeeName + ">" + childSnapshot.val().EmployeeName + "</option>");
        $("#table").append("<tr><td>" + childSnapshot.val().EmployeeName + "</td><td>" + childSnapshot.val().punchIN + "</td><td>" + childSnapshot.val().punchOUT + "</td></tr>")
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

        // Change what is saved in firebase
        database.ref().push({
            selectedEmployee: selectedEmployee,
            punchIN: datestampIn,
            date: date,
        });
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

        // Change what is saved in firebase
        database.ref().push({
            selectedEmployee: selectedEmployee,
            punchOUT: datestampOUT,
            date: date,
        });
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
        database.ref().child().push({
            EmployeeName: newEmployeeName,
        });
        alert(newEmployeeName + " added!");
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
    database.ref().remove({
        EmployeeName: employeeToRemove,
    });
    alert(employeeToRemove + " Removed!");

};