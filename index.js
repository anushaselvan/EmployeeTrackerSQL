const inquirer = require("inquirer");
const mysql2 = require("./config/connection");
const cTable = require("console.table");
let sql = "";

function previewOptions() {
    return inquirer.prompt([{
        type: "list",
        name: "preview",
        message: "What would you like to do?",
        choices: [
            "View all departments", "View all roles", "View all employees",
            "Add a department", "Add a role", "Add an employee",
            "Update an employee role", "Update employee managers",
            "Delete departments, roles, and employees",
            "View the total utilized budget of a department", "quit"
        ]
    }])
    .then((response) => {
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
                 return updateEmpManagers();
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
        sql = "SELECT * FROM department";
        mysql2.query(sql, function (err, results) {
            if (err)
                throw err;
            else
                console.table(results);
                previewOptions();
            });
    }

function viewRole(){
        sql = 'SELECT employeerole.id,employeerole.title, employeerole.salary, department.department_name FROM employeerole INNER JOIN department ON employeerole.department_id= department.id ORDER BY id';
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
            previewOptions();
            });
            });
    }
function addRole() {
        mysql2.query('SELECT * FROM department', function (err, results) {
            let resArray = [];
            if (err)
                throw err;
            else
        inquirer.prompt([{
            type: "input",
            name: "title",
            message: "What is the name of the role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?",
        },
        {        
            type: "list",
            name: "dept",
            message: "What department does the role belong to?",
            choices: function() {
                        for (let i = 0; i < results.length; i++) {
                        resArray.push(results[i].department_name);
                        }
                return resArray;
                },
            },
        ]) 

        .then((answer) => {
            let deptName = answer.dept;
            let deptId = resArray.indexOf(deptName) + 1;

            sql = 'INSERT INTO employeerole (title, salary, department_id) VALUES (?,?,?)';
            mysql2.query(sql, [answer.title,answer.salary,deptId], function (err, results) {
                if (err)
                throw err;  
            else
            console.log("\n Added role to the database");
            previewOptions();
             });
        });
        });
    }

function addEmployee(){
    let roleArray = [];
    let empArray = [];
        mysql2.query('SELECT * FROM employeerole', function (err, roleResults) {
            if (err)
                throw err;
        mysql2.query('SELECT * FROM employee', function (err, managerResults) {
            if (err)
                throw err;

        inquirer.prompt([{
            type: "input",
            name: "firstname",
            message: "What is the first name of the employee?",
        },
        {
            type: "input",
            name: "lastname",
            message: "What is the last name of the employee?",
        },
        {        
            type: "list",
            name: "roleid",
            message: "What is the role of the employee?",
            choices: function() {
                    for (let i = 0; i < roleResults.length; i++) {
                    roleArray.push(roleResults[i].title);
                    }
                return roleArray;
                },
        },
        {
            type: "list",
            name: "managerid",
            message: "Who is the manager of this employee?",
            choices: function(){
                    for (let k = 0; k < managerResults.length; k++) {
                    empArray.push(managerResults[k].first_name+ " " +managerResults[k].last_name);

                    }
            return empArray;
            },
            },
        ]) 
        .then((answer) => {
            let roleId = roleArray.indexOf(answer.roleid) + 1;
            let managerId = empArray.indexOf(answer.managerid) + 1;

            sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
            mysql2.query(sql, [answer.firstname, answer.lastname, roleId, managerId], function (err, results) {
            if (err)
                throw err;  
            else
            console.log("\n Added employee to the database");
            previewOptions();
                
            });
            });
        });
        });
    }
function updateEmployeeRole() {
    let roleArray = [];
        mysql2.query('SELECT * FROM employeerole', function (err, results) {
            if (err) throw err;
        inquirer.prompt([{
                type: "input",
                name: "firstname",
                message: "What is the first name of the employee whose role you would like to update?",
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the last name of the employee?",
            },
            {
                type: "list",
                name: "newrole",
                message: "What is the new role of the employee?",
                choices: function() {
                    for (let i = 0; i < results.length; i++) {
                    roleArray.push(results[i].title);
                    }
                return roleArray;
            },
            }])

            .then((answer) => {
                let roleId = roleArray.indexOf(answer.newrole) + 1;
                sql = 'Update employee SET role_id = ? WHERE first_name = ?';
                mysql2.query(sql, [roleId, answer.firstname], function (err, results) {
                if (err)
                    throw err;  
                else
                console.log("\n Updated employee role to the database");
                previewOptions();
                });
                });
            });
        }
function updateEmpManagers() {
    let resArray = [];
        mysql2.query('SELECT * from employee', function (err, results) {
            if (err) throw err;
        inquirer.prompt([{
                type: "input",
                name: "firstname",
                message: "What is the first name of the employee whose manager you would like to update?",
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the last name of the employee?",
            },
            {
                type: "list",
                name: "newmanager",
                message: "What is the name of the new manager?",
                choices: function() {
                    for (let i = 0; i < results.length; i++) {
                    resArray.push(results[i].first_name+ " " +results[i].last_name);
                    }
                return resArray;
            },
            }])

            .then((answer) => {
                let managerId = resArray.indexOf(answer.newmanager) + 1;
                sql = 'Update employee SET manager_id = ? WHERE first_name = ?';
                mysql2.query(sql, [managerId, answer.firstname], function (err, results) {
                    if (err)
                        throw err;  
                    else
                console.log("\n Updated employee role to the database");
                previewOptions();
                });
                });
            });
        }
function deleteDeptRoleEmp() {
    let resArray = [];
    inquirer.prompt([{
        type: "list",
        name: "delete",
        message: "What do you want to delete?",
        choices: ["Department","Role","Employee"],
    
    }])
    .then((response) => {
        let answer = response.delete;
        switch (answer) {
            case "Department":
                mysql2.query('SELECT * FROM department', function (err, results) {
                if (err) throw err;
                inquirer.prompt({
                type: "list",
                name: "dept",
                message: "What is the name of the department you want to delete?",
                choices: function() {
                    for (let i = 0; i < results.length; i++) {
                    resArray.push(results[i].department_name);
                    }
                return resArray;
                },
                })
                .then((answer) => { 
                    sql = 'DELETE from department WHERE department_name=?';
                    mysql2.query(sql, answer.dept, function (err, results) {
                        if (err)
                            throw err;  
                        else
                    console.log("\n Department deleted from the database");
                    previewOptions();
                    });
                    });
                });
                break;
            
        case "Role":
                mysql2.query('SELECT * FROM employeerole', function (err, results) {
                if (err) throw err;
                let resArray = [];
                inquirer.prompt({
                type: "list",
                name: "role",
                message: "What is the name of the role you want to delete?",
                choices: function() {
                    for (let i = 0; i < results.length; i++) {
                    resArray.push(results[i].title);
                    }
                return resArray;
                },
                })
            .then((answer) => { 
                    sql = 'DELETE from employeerole WHERE title=?';
                    mysql2.query(sql, answer.role, function (err, results) {
                        if (err)
                            throw err;  
                        else
                    console.log("\n Role deleted from the database");
                    previewOptions();
                    });
                    });
            });
            break;
        
        case "Employee":
                mysql2.query('SELECT * FROM employee', function (err, results) {
                if (err) throw err;
                let resArray = [];
                inquirer.prompt({
                type: "list",
                name: "empl",
                message: "What is the name of the employee you want to delete?",
                choices: function() {
                    for (let i = 0; i < results.length; i++) {
                    resArray.push(results[i].first_name+" "+results[i].last_name);
                    }
                return resArray;
                },
                })
            .then((answer) => { 
                let fName = answer.empl.split(" ");
                    sql = 'DELETE from employee WHERE first_name=?';
                    mysql2.query(sql, fName[0], function (err, results) {
                        if (err)
                            throw err;  
                        else
                    console.log("\n Employee deleted from the database");
                    previewOptions();
                    });
                    });
                });
             } 
        });
    }

function viewBudgetByDept() {
        mysql2.query('SELECT * FROM department', function (err, results) {
            let resArray = [];
        if (err) throw err;
        inquirer.prompt({
            type: "list",
            name: "dept",
            message: "What is the name of the department you want to view the budget?",
            choices: function() {
                for (let i = 0; i < results.length; i++) {
                resArray.push(results[i].department_name);
                }
            return resArray;
        },
        })
        .then((answer) => {
            let deptId = resArray.indexOf(answer.dept) + 1;
            sql = 'SELECT SUM(salary) AS Budget FROM employeerole WHERE department_id=?'
            mysql2.query(sql, deptId, function (err, results) {
                if (err)
                    throw err;  
                else
                console.table(results);
            previewOptions();
            });
        });
        });
    }

function init() {
        previewOptions();
    }
init();