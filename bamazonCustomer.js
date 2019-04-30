//Setup Required Variables
//var Table = require('products');
require('console.table');
var mysql = require('mysql');
var inquirer = require('inquirer');

//Connect to SQL database
var connection = mysql.createConnection({
    host: "Localhost",
    port: 8889,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

//Inquirer introduction
function startPrompt() {
    inquirer.prompt([{
        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to continue to shopping?",
        default: true

    }]).then(function (user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log("Thank you!");
        }
    });
}

//Inventory
function inventory() {

    

    listInventory();

    // var table = new Table({
    //         head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
    //         colWidths: [10, 30, 30, 30, 30]
    //     });

    function listInventory() {
        let table;
        connection.query("SELECT * FROM products", function (err, res) {
            table = res;
            
            console.log("");
            console.log("Current Inventory:");
            console.log("");
            console.table(table);
            console.log("");
            continuePrompt();
        });
    }
}

//Inquirer user purchase

function continuePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to make a purchase?",
        default: true

    }]).then(function (user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log("Thank you!");
        }
    });
}

//Item selection and Quantity desired

function selectionPrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to purchase.",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "Enter the quantity of your purchase?",

        }
    ]).then(function (userPurchase) {

        //Finding stock_quantity. If user quantity is too high, decline purchase and apologize.

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function (err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {
                    console.log("I'm sorry looks like we don't have enough for you.");

                    startPrompt();

                } else {
                    //list item info for user confirm prompt
                    console.log("Thank you!");

                    console.log("You've selected:");
                    console.log("Item: " + res[i].product_name);
                    console.log("Department: " + res[i].department_name);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + userPurchase.inputNumber);
                    console.log("----------------");
                    console.log("Total: " + res[i].price * userPurchase.inputNumber);


                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    //console.log(newStock);
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });
}

//Confirm Purchase
function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Would you like to continue with your purchase?",
        default: true

    }]).then(function (userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            //User confirms purchase, database is updated with new inventory count.

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function (err, res) {});

            console.log("Transaction complete. Thank you!");

            startPrompt();
        } else {
            console.log("No worries. Maybe next time!");

            startPrompt();
        }
    });
}