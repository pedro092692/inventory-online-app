# Online invetory API for Venezuela
This API let you manage your inventory for your store where you can create customers, workers, payment methods and products then when you made a sale the API manage all inventory and give you a resume of your sales and most popular products. 
# 🧑‍🦳Customers 
###  GET /api/customers
Returns a `200 OK` status with a message indicating that the customer routes are working properly.
**Response:**
```json
{
  "status": 200,
  "message": "Customers Routes"
}
``` 
###  GET /api/customers/all
Returns an array with objects of all customers 
**Response:**
```json
{
  "status": 200,
  [
	{
		"id":  3,
		"id_number":  3000000,
		"name":  "Carlos Perez",
		"phone":  "+58424000002",
	}	
  ]
}
``` 
###  GET /api/customers/:id
***api/customers/1***
Retrieves an object with customer data of based on customer ID if customer is not found thrown and 404 error.
**Response:**
```json
{
  "status": 200,
	{
		"id":  3,
		"id_number":  3000000,
		"name":  "Carlos Perez",
		"phone":  "+58424000002",
	}	
}
``` 
###  POST /api/customers/
Create new customer 
📥 Request Body (`application/json`)
field: ***id_number***, type: integer, required, -> A id number of customer
field: ***name***, type: string, required -> A name of customer
field: ***phone*** type: string, required -> A phone of customer 

Create a new customer a returns a status 201 with new client Data 
```json
{
"newCustomer":  {
	"phone":  "+584240000000",
	"id":  4,
	"id_number":  21259867,
	"name":  "beltran"
	}
}
``` 
###  PATCH /api/customers/:id
***/api/customers/4***

Update a customer with new data
📥 Request Body (`application/json`)
field: ***id_number***, type: integer, optional, -> A id number of customer
field: ***name***, type: string, optional -> A name of customer
field: ***phone*** type: string, optional -> A phone of customer 
returns a status 200 with new customer data:
```json
{
	"id":  4,
	"id_number":  21259867,
	"name":  "Daniel beltran",
	"phone":  "+584243067310"
}
``` 
###  DELETE /api/customers/
Delete a customer if this has not invoices
📥 Request Body (`application/json`)
field: ***customerId*** type: integer, required -> Customer id 
return ***status 204*** with a empty object 