const inquirer = require("inquirer");
const mysql2 = require("./config/connection");
const cTable = require("console.table");


function previewOptions() {
    return inquirer.prompt([{
        type: "list",
        name: "preview",
        message: "What would you like to do?",
        choices: [
            "View all departments", "View all roles", "quit", "View all employees",
            "Add a department", "Add a role", "Add an employee",
            "Update an employee role", "Update employee managers",
            "View employees by manager", "View employees by department",
            "Delete departments, roles, and employees",
            "View the total utilized budget of a department"
        ]
    }])
        .then((response) => {
            let sql = "";
            let answer = response.preview;
            switch (answer) {
                case "View all departments":
                    sql = 'SELECT * FROM `department`';
                    mysql2.execute(sql, function (err, results) {
                        if (err)
                            throw err;
                        else
                            console.table(results);
                            previewOptions();
                    });
                    break;
                case "View all roles":
                    sql = 'SELECT * FROM `employeerole`';
                    mysql2.execute(sql, function (err, results) {
                        if (err)
                            throw err;
                        else
                            console.table(results);
                            previewOptions();
                    });
                    break;
                case "View all employees":
                    sql = 'SELECT * FROM `employee`';
                    mysql2.execute(sql, function (err, results) {
                        if (err)
                            throw err;
                        else
                            console.table(results);
                            previewOptions();
                    });
                    break;
                case "Add a department":
                case "Add a role":
                case "Add an employee":
                case "Update an employee role":
                case "Update employee managers":
                case "View employees by manager":
                case "View employees by department":
                case "Delete departments, roles, and employees":
                case "View the total utilized budget of a department":


                default:
                    console.log("CMS exited. Bye");

            }
        });
}





const init = () => {
    previewOptions()
};

init();