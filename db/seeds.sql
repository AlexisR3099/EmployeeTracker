INSERT INTO department (name)
VALUES
('Development'),
('Legal'),
('Management');

INSERT INTO role (title, salary, department_id)
VALUES
('Engineer', 90000, 1),
('Lawyer', 100000, 2),
('Manager', 120000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Jackie', 'Chan', 3, 1),
('Jake', 'Statefarm', 2, NULL),
('Mike', 'Tyson', 1, NULL);