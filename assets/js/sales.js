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


$(document).ready(function () {
    menuList();
    menuItemList();
    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

var sale = 0;

//load menu item list
function menuItemList() {
    //clear current list for refresh
    $("#menuItems").empty();

    //load existing values from DB
    var menuList = firebase.database().ref('menu/');
    menuList.on('value', function (snapshot) {
        var list = snapshot.val();
        $("#menuItems").empty();
        $("#menuItems").html("<option selected='selected'>Choose Menu Item </option>");
        for (var name in list) {
            $("#menuItems").append("<option value=" + name + ">" + name + "</option>");

        }
    });
}
//load menu
function menuList() {
    //clear current schedule for refresh
    $("#table").empty();
    $("#table").html('<tr><th>Name:</th><th>Price:</th><th>Sales:</th><th>Total:</th><th>Add/Sub Sales</th></tr>');

    //load existing values
    var menuList = firebase.database().ref('menu/');
    menuList.on('value', function (snapshot) {
        var table = snapshot.val();
        var key = Object.keys(snapshot.val());

        var i;
        for (i = 0; i < key.length; i++) {
            menuItem = key[i].valueOf();
            name = table[menuItem].name.valueOf();
            price = table[menuItem].price.valueOf();
            sales = table[menuItem].sales.valueOf();
            total = table[menuItem].total.valueOf();
            classname = name.replace(" ", "_");
            classtotal = classname + "Total";
            priceName = classname + "Price";
            $("#table").append('<tr><td>' + name + '</td><td id=' + priceName + '>' + price + '</td><td  id=' + classname + '>' + sales + '</td><td id=' + classtotal + '>' + total + '</td><td><button class="btn btn-success" value="' + classname + '">+</button><button class="btn btn-danger" value="' + classname + '">-</button></td></tr>');
        }
    });
};

// ************************************* add/subtract sales*****************************
$(document).on("click", ".btn-success", function () {
    itemName = this.value;
    classname = '#' + itemName;
    salesNum = $(classname).html();
    salesNum++;


    priceName = '#' + itemName + 'Price';
    priceNum = $(priceName).html();

    totalName = '#' + itemName + 'Total';
    totalNum = $(totalName).html();
    newTotal = priceNum * salesNum;


    $("#table").empty();
    $("#table").html('<tr><th>Name:</th><th>Price:</th><th>Sales:</th><th>Total:</th><th>Add/Sub Sales</th></tr>');
    // Change what is saved in firebase
    database.ref("menu/" + itemName).update({

        sales: salesNum,
        total: newTotal,
    });
});

$(document).on("click", ".btn-danger", function () {
    itemName = this.value;
    classname = '#' + itemName;
    salesNum = $(classname).html();
    salesNum--;


    priceName = '#' + itemName + 'Price';
    priceNum = $(priceName).html();

    totalName = '#' + itemName + 'Total';
    totalNum = $(totalName).html();
    newTotal = priceNum * salesNum;


    $("#table").empty();
    $("#table").html('<tr><th>Name:</th><th>Price:</th><th>Sales:</th><th>Total:</th><th>Add/Sub Sales</th></tr>');
    // Change what is saved in firebase
    database.ref("menu/" + itemName).update({

        sales: salesNum,
        total: newTotal,
    });
});


//Add employee modal function
function addMenuItem() {
    //prevent empty form input
    if ($("#itemInput").val() == "" || $("#priceInput").val() == "") {
        alert("Please input a name/price");
        return false;
    } else {
        // Get inputs
        newName = $("#itemInput").val().trim();
        newMenuItem = newName.replace(" ", "_");
        newItemPrice = $("#priceInput").val().trim();

        $("#table").append('<h2>' + newMenuItem + '</h2><h2>' + newItemPrice + '</h2><h2>' + 0 + '<button class="btn btn-success">+</button><button class="btn btn-danger">-</button></h2><h2>' + 0.00 + '</h2>');

        // Change what is saved in firebase
        database.ref("menu/" + newMenuItem).set({
            name: newMenuItem,
            price: newItemPrice,
            sales: 0,
            total: 0,
        });
        alert(newMenuItem + " added!");
        menuList();
    }
};

function itemRemoveHandler() {
    itemToRemove = $("#menuItems").val().trim();
}

//remove employee modal function
function removeMenuItem() {
    console.log("item to remove", itemToRemove);

    // Change what is saved in firebase
    database.ref("menu/" + itemToRemove).remove();
    alert(itemToRemove + " Removed!");

    menuItemList();
    menuList();
};

function closePeriod() {
    dateStamp = moment().format("MM/DD/YY");
    console.log(dateStamp);
}



//******************************************************************chart.js*********************************** */
var ctx = document.getElementById('chart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{}]
    },

    // Configuration options go here
    options: {}
});
function closePeriod() {
    dateStamp = moment().format("MM/DD/YY");
    console.log(dateStamp);
    newData = {
        label: 'Test',
        borderColor: 'rgb(0, 0, 132)',
        data: [10, 10, 10]
    }

    chart.data.labels.push(dateStamp);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}