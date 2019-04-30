DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(100) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gibson SG", "Music", 850.00, 5),
("Pearl Export EXX", "Music", 1,267.00, 2),
("Fender Deluxe Jazz Bass V", "Music", 635.31, 4),
("PS4", "Electronics", 300.00, 10),
("4-Device Universal Remote", "Electronics", 16.74, 20),
("Tower Garden", "Home and Garden", 1,500.00, 3),
("Couch", "Home and Garden", 393.00, 1),
("Flower Pot", "Home and Garden", 34.99, 25),
("Maxlife 5W-30 Motor Oil", "Automotive", 47.62, 75),
("Firestone All Season Tire", "Automotive", 124.84, 120);

SELECT * FROM products;
