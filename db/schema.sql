DROP DATABASE IF EXISTS emptracker_db;
CREATE DATABASE emptracker_db;

USE emptracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE employeerole (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary INT,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30),
    role_id INT,
    FOREIGN KEY (role_id)
    REFERENCES employeerole(id)
    ON DELETE SET NULL,
    manager_id INT,
    FOREIGN KEY (manager_id)
    REFERENCES employeerole(id)
    ON DELETE SET NULL
);
