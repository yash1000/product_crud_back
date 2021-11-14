require("dotenv").config();

module.exports = {
  "development": {
    "username": process.env.,
    "password": "admin",
    "database": "product_crud",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "product_crud",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "product_crud",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
