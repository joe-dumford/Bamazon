//Setup Required Variables
//var Table = require('products');
require('console.table');
var mysql = require('mysql');
var inquirer = require('inquirer');

//Connect to SQL database
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});


function startPrompt() {

    inquirer.prompt([{

        type: "list",
        name: "actionList",
        message: "Welcome. What would you like to review?",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]

    }]).then(function(user) {
        if (user.actionList === "View Products For Sale") {
            inventoryView();
        } else if (user.actionList === "View Low Inventory") {
            lowInventory();
        } else if (user.actionList === "Add To Inventory") {
            addInventory();
        } else {
            addProduct();
        }
    });
}

//View Inventory

function inventoryView() {
    // var table = new Table({
    //     head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
    //     colWidths: [10, 30, 30, 30, 30]
    // });

    listInventory();

    function listInventory() {
        let table = [];

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].item_id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

                table.push({
                    itemId,
                    productName,
                    departmentName,
                    price,
                    stockQuantity
                });
            }
            console.log("");
            console.log("Current Inventory:");
            console.log("");
            //console.log(table.toString());
            console.table(table);
            console.log("");
            startPrompt();
        });
    }
}

//Showing any inventory with less than 5 in stock 

function lowInventory() {
   
    listLowInventory();

    function listLowInventory() {
        let table;
        connection.query("SELECT * FROM products", function(err, res) {
            table = res;

            console.log("");
            console.log("Your inventory is low.");
            console.log("");
            console.table(table);
            console.log("");
            startPrompt();
        });
    }
}

//Add to Inventory

function addInventory() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Enter the ID number of the item you would like to add inventory to.",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many units of this item would you like to have in stock?",

        }
    ]).then(function(managerAdd) {

              connection.query("UPDATE products SET ? WHERE ?", [{

                  stock_quantity: managerAdd.inputNumber
              }, {
                  item_id: managerAdd.inputId
              }], function(err, res) {
              });
          startPrompt();
        });
      }


//Add New Product

function addProduct() {

//Code for manager to input inventory info

    inquirer.prompt([{

            type: "input",
            name: "inputName",
            message: "Enter the item name of the new product.",
        },
        {
            type: "input",
            name: "inputDepartment",
            message: "Enter which department for the product.",
        },
        {
            type: "input",
            name: "inputPrice",
            message: "Enter the price of the product.",
        },
        {
            type: "input",
            name: "inputStock",
            message: "Enter the stock quantity.",
        }

    ]).then(function(managerNew) {

      //Insert column data from user input

      connection.query("INSERT INTO products SET ?", {
        product_name: managerNew.inputName,
        department_name: managerNew.inputDepartment,
        price: managerNew.inputPrice,
        stock_quantity: managerNew.inputStock
      }, function(err, res) {});
      startPrompt();
    });
  }