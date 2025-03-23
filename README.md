//Project for CS 602 Server Side Web Development by Zully Maya

---- Project Overview -----

This project is an Online Shopping System developed for Boston University’s CS602 course. The application allows customers to browse products, add items to a cart, and place orders. An admin can manage products and view customer orders.

*** The backend is built using: ***

Node.js & Express.js (Server) 
MongoDB (Database) 
Apollo GraphQL (API) 
Passport.js (Authentication)

*** The frontend is built using: ***

Handlebars

---- Features -----

*** Customer Features *** 
User registration and login with Passport.js (local strategy). 
Browse product catalog. 
Add products to cart. 
Submit orders. 
View order history.

*** Admin Features *** 
Login with admin credentials. 
Add, update, and delete products. 
View all customer orders. 
Manage individual orders (update, delete, etc.).

----- Some Notes -----

There are initial JSON data for the Customer and Orders. There is only one admin role under zmaya so to use admin capability you should login with those credential. Any other Customer created will be automatically given customer role.

All _id's for the documents in each collection are manually set when adding a new document. That being said duplicate key errors can occur in special circumstances.
