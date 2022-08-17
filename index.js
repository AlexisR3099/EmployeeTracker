const inquirer = require('inquirer');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const { init } = require('express/lib/application');
dotenv.config();

console.log("Welcome to Employee Tracker!!!");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log(`Connected to the ${process.env.DB_NAME} database`)
);

dn.connect(err => {
    if(err) throw err;
    //starts inquirer prompts
    begin();
})

function begin() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                "View all employees",
                "Add Employee",
                "Update employee role",
                "View roles",
                "Add Role",
                "View all departments",
                "Add department",
                "Quit"
            ]
        }).then(answer => {
            switch (answer.menu) {
                case "View all employees":
                viewAllEmployees();
                break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update employee role":
                    updateEmployeeRole();
                    break;
                case "View roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "Add department":
                    addDepartment();
                    break;
                case "Quit":
                    quit();
                    break;
            }
        });
}