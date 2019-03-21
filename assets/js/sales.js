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

//define some sample data
var tabledata = [
    { id: 1, name: "Classic Poutine", sales: 12, price: 7.50, total: 0 },
    { id: 2, name: "Southwest", sales: 4, price: 9.00 },
    { id: 3, name: "Tikka Masala", sales: 9, price: 8.50 },
    { id: 4, name: "Chicken Pot Pie", sales: 1, price: 8.00 },
    { id: 5, name: "Pulled Pork", sales: 4, price: 9.50 },
];

$(document).ready(function () {
    menuList();
    menuItemList();
});

//load menu item list
function menuItemList() {
    //clear current list for refresh
    $("#menuItems").empty();

    //load existing values
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

            $("#table").append('<h2>' + name + '</h2><h2>' + price + '</h2><h2>' + sales + '</h2><h2>' + total + '</h2>');
            $("#table").append("<br>");
        }
    });
};



//Add employee modal function
function addMenuItem() {
    //prevent empty form input
    if ($("#itemInput").val() == "" || $("#priceInput").val() == "") {
        alert("Please input a name/price");
        return false;
    } else {
        // Get inputs
        newMenuItem = $("#itemInput").val().trim();
        newItemPrice = $("#priceInput").val().trim();

        $("#table").append('<h2>' + newMenuItem + '</h2><h2>' + newItemPrice + '</h2><h2>' + 0 + '</h2><h2>' + 0.00 + '</h2>');

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