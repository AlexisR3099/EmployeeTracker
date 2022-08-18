const inquirer = require('inquirer');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const ctable = require('console.table');
const query = require('express/lib/middleware/query');
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

db.connect(err => {
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

function viewAllEmployees() {
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        console.table(results);
        begin();
    });
}

function addEmployee() {
    db.query('SELECT * FROM employee, role', (err, results) => {
        if(err) throw err;

        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'First name?',
                validate: (value) => {
                    if(value) {
                        return true;
                    } else {
                        console.log('Please enter the first name');
                    }
                }
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Last name?',
                validate: (value) => {
                    if(value) {
                        return true;
                    } else {
                        console.log('Please enter the last name');
                    }
                }
            },
            {
                name: 'role',
                type: 'rawlist',
                choices: () => {
                    let choiceArr = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArr.push(results[i].title);
                    }
                    let cleanArray = [...new Set(choiceArr)];
                    return cleanArray;
                },
                message: 'What role?',
            }
        ]).then(answer => {
            let rolePicked;

            for (let i = 0; i < results.length; i++) {
                if(results[i].title === answer.role) {
                    rolePicked = results[i];
                }
            }
            db.query(`INSERT INTO employee SET ?`,
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: rolePicked.id
            },
            (err) => {
                if(err) throw err;
                console.log(`${answer.firstName} ${answer.lastName} was added as a ${answer.role}.`);
                begin();
            });
        })
    })
}

function updateEmployeeRole() {
    db.query('SELECT * FROM employee, role', (err, results) => {
        if(err) throw err;

        inquirer.prompt([
            {
                name: 'employee',
                type: 'rawlist',
                choices: () => {
                    let choiceArr = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArr.push(results[i].last_name);
                    }
                    let cleanArray = [...new Set(choiceArr)];
                    return cleanArray;
                },
                message: 'Update which employee?'
            },
            {
                name: "role",
                type: "rawlist",
                choices: () => {
                    let choiceArr = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArr.push(results[i].title);
                    }
                    let cleanArray = [...new Set(choiceArr)];
                    return cleanArray;
                },
                message: "What is the employee's new role?"
            }
        ]).then(answer => {
            let employeePicked;
            let rolePicked;

            for (let i = 0; i < results.length; i++) {
                if(results[i].last_name === answer.employee) {
                    employeePicked = results[i];
                }
            }

            for (let i = 0; i < results.length; i++) {
                if(results[i].title === answer.role) {
                    rolePicked = results[i];
                }
            }
            db.query(`UPDATE employee SET ? WHERE ?`,
            [
                {
                    role_id: rolePicked,
                },
                {
                    last_name: employeePicked
                }
            ],
            (err) => {
                if (err) throw err;
                console.log(`${answer.employee}'s role was updated to ${answer.role}`);
                begin();
            });
        })
    })
}

function viewAllRoles() {
    db.query('SELECT * FROM role', (err, results) => {
        if(err) throw err;
        console.table(results);
        begin();
    });
}

function addRole() {
    db.query('SELECT * FROM department', (err, results) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: "What is the title for the new role?",
                validate: (value) => {
                    if(value) {
                        return true;
                    } else {
                        console.log('Please enter the title');
                    }
                }
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Salary for the role?',
                validate: (value) => {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    console.log('Enter the salary for the role');
                }
            },
            {
                name: 'department',
                type: 'rawlist',
                choices: () => {
                    let choiceArr = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArr.push(results[i].name);
                    }
                    return choiceArr;
                },
                message: 'What department is this role for?',
            }
        ]).then(answer => {
            let departmentPicked;
            for (let i = 0; i < results.length; i++) {
                if(results[i].name === answer.department) {
                    departmentPicked = results[i];
                }
            }
            db.query('INSERT INTO role SET ?',
            {
                title: answer.title,
                salary: answer.salary,
                department_id: departmentPicked.id
            },
            (err) => {
                if(err) throw err;
                console.log(`${answer.title} was added as a role`);
                begin();
            });
        });
    });
}

function viewAllDepartments() {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        console.table("Display departments", results);
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'Name of new department?',
            validate: (value) => {
                if (value) {
                    return true;
                } else {
                    console.log('Enter a name');
                }
            }
        }
    ]).then(answer => {
        db.query('INSERT INTO department SET ?',
        {
            name: answer.department
        },
        (err) => {
            if(err) throw err;
            console.log(`${answer.department} was added to departments`);
            begin();
        });
    });
}

function quit() {
    console.log('Goodbye!', (err, data) => {
        if(err) throw err;
        console.log(data);
    });
    process.exit();
}