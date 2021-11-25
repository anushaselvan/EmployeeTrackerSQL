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
                 return viewDepartment(); 
            case "View all roles":
                 return viewRole();
            case "View all employees":
                 return viewEmployee();
            case "Add a department":
                 return addDepartment();
            case "Add a role":
                 return addRole();
            case "Add an employee":
                 return addEmployee();
            case "Update an employee role":
                 return updateEmployeeRole();
            case "Update employee managers":
                 return updateEmpByManagers();
            case "View employees by manager":
                 return viewEmpByManagers();
            case "View employees by department":
                 return viewEmpByDept();
            case "Delete departments, roles, and employees":
                 return deleteDeptRoleEmp();
            case "View the total utilized budget of a department":
                 return viewBudgetByDept();
            default:
                    console.log("CMS exited. Bye");
                    mysql2.end();

        }
        });
}
function viewDepartment(){
        sql = 'SELECT * FROM department';
        mysql2.query(sql, function (err, results) {
            if (err)
                throw err;
            else
                console.table(results);
                previewOptions();
            });
    }

function viewRole(){
        sql = 'SELECT employeerole.id,employeerole.title, employeerole.salary, department.department_name FROM employeerole INNER JOIN department ON employeerole.department_id= department.id';
        mysql2.query(sql, function (err, results) {
            if (err)
                throw err;
            else
                console.table(results);
                previewOptions();
        });
    }

function viewEmployee(){
        sql = `SELECT employee.id, employee.first_name, employee.last_name, employeerole.title, department.department_name AS department, employeerole.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT JOIN employeerole ON employee.role_id=employeerole.id LEFT JOIN department ON employeerole.department_id=department.id LEFT JOIN employee manager on manager.id=employee.manager_id `;
        mysql2.query(sql, function (err, results) {
            if (err)
                throw err;
            else
                console.table(results);
                previewOptions();
        });
    }

function addDepartment() {
        inquirer.prompt({
            type: "input",
            name: "deptname",
            message: "What is the name of the department?",
        })
        .then((answer) => {
            sql = 'INSERT INTO department (department_name) VALUES (?)';

            mysql2.query(sql, answer.deptname, function (err, results) {
                if (err)
                throw err;
            else
            console.log("\n Added department to the database");
            console.table(results);
            previewOptions();
            
            });
            });
    }

function init() {
    previewOptions();
}

init();