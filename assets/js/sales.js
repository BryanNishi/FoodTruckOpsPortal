
//define some sample data
var tabledata = [
    {id:1, name:"Classic Poutine", sales:"12", price:"7.50"},
    {id:2, name:"Southwest", sales:"4", price:"9.00"},
    {id:3, name:"Tikka Masala", sales:"9", price:"8.50"},
    {id:4, name:"Chicken Pot Pie", sales:"1", price:"8.00"},
    {id:5, name:"Pulled Pork", sales:"4", price:"9.50"},
   ];

//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#example-table", {
    height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data:tabledata, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
        {title:"Menu Item", field:"name", width:150},
        {title:"Sales", field:"sales", align:"left", formatter:"progress"},
        {title:"Price", field:"price"},
          ],
    rowClick:function(e, row){ //trigger an alert message when the row is clicked
        alert("Row " + row.getData().id + " Clicked!!!!");
    },
});