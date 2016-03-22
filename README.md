Oxygen - A ZF2/Webix application for creating quotes
====================================================

Work in progress
----------------

The concept is to have a ZF2 backend using the Doctrine ORM to serve up resources stored in a MySQL database. With a Webix front end user interface, possibly making use of AngularJS.

The database will contain the following entities;

* Suppliers
* Customers
* Products/Services
* Quotes
* Quote Items
* Quote Status

The workflow would be;

Populate the system with suppliers, customers and products/services.

Initially products/services will have a single suppliers (maybe later there can be many suppliers for each product).

Quotes can be raised for a customers. Initial quote status would be 'being entered'.
Once the quote is ready it can be emailed or printed. The status would be changed to 'sent'.
At a later date a quote status can be changed to 'won' or 'lost'.

