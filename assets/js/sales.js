
//define some sample data
var tabledata = [
    { id: 1, name: "Classic Poutine", sales: 12, price: 7.50, total: 0 },
    { id: 2, name: "Southwest", sales: 4, price: 9.00 },
    { id: 3, name: "Tikka Masala", sales: 9, price: 8.50 },
    { id: 4, name: "Chicken Pot Pie", sales: 1, price: 8.00 },
    { id: 5, name: "Pulled Pork", sales: 4, price: 9.50 },
];

//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#example-table", {
    height: 205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data: tabledata, //assign data to table
    responsiveLayout: true,
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "Menu Item", field: "name" },
        { title: "+", formatter: "buttonTick", width: 50 },
        { title: "-", formatter: "buttonCross", width: 50 },
        { title: "Sales", field: "sales" },
        { title: "Price", field: "price", formatter: "money", formatterParams: { symbol: "$" } },
        { title: "Total", field: "total" }
    ],

});

$(document).ready(function () {
    menuList();

});

function menuList() {
    //clear current schedule for refresh
    $("#table").empty();

    //load existing values
    var menuList = firebase.database().ref('menu/');
    menuList.on('value', function (snapshot) {
        var list = snapshot.val();
        $("#items").empty();
        $("#items").html("<option selected='selected'>Choose Employee </option>");
        for (var name in list) {
            $("#items").append("<option value=" + name + ">" + name + "</option>");
        }
    });
}