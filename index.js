const inquirer = require("inquirer");
const mysql2 = require("./config/connection");
const cTable = require("console.table");

const viewDepartment = () => {
    console.log("Here");
let sql = 'SELECT * FROM `employee`';
   mysql2.execute(sql, function(err, results){
       if (err) throw err;
       else
       return console.table(results);
   });       
};

const previewOptions = () => {
    return inquirer.prompt([{
        type: "list",
        name: "preview",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles","quit", "View all employees", "Add a department", "Add a role",
         "Add an employee", "Update an employee role", "Update employee managers", "View employees by manager", 
         "View employees by department", "Delete departments, roles, and employees",
         "View the total utilized budget of a department"]
    }])
    .then((answer) => {
        var answer = answer.preview;
        if(answer === "View all departments"){
            viewDepartment();
        }
        else{
            return console.log("CMS exited. Bye");
            
        }
    });
};





const init = () => {
    previewOptions()
};

init();