INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Marketing"),
       ("IT"),
       ("Human Resources"),
       ("Customer Service");

INSERT INTO employeerole (title, salary, department_id)
VALUES ("HR Coordinator", 70000, 4),
       ("IT Manager", 100000, 3), 
       ("Sales Associate", 65000, 1),
       ("Customer Service Agent", 60000, 5),
       ("Network Technician", 70000, 3),
       ("Marketing Specialist", 80000, 2),
       ("Data Engineer", 80000, 3);


INSERT INTO employee (first_name, last_name, role_id,manager_id)
VALUES ("Tim", "Geller", 4),
       ("Raymond", "Holt",3),
       ("Jim", "Taylor", 2),
       ("Channelle", "Jenkins", 1),
       ("Jake", "Peralta",5),
       ("Amy", "Santiago", 7),
       ("Roza", "Diaz", 6);


       