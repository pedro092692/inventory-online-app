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

# 📦 Products
###  GET /api/products
Returns a `200 OK` status with a message indicating that the ***products*** routes are working properly.
**Response:**
```json
{
  "status": 200,
  "message": "Product routes"
}
``` 
###  GET /api/products/all
Returns an array with objects of all products
**Response:**
```json
{
  "status": 200,
[
	{
		"id":  4,
		"barcode":  "7592710003707",
		"name":  "ADELGASEN CAP X30 HERB",
		"purchase_price":  "8.25",
		"selling_price":  "10.31",
		"stock":  1
	}
]
}
``` 
###  GET /api/products/:id
***/api/products/4***
Retrieves an object with ***product*** data of based on product ***ID*** if the product is not found throw and 404 error.
**Response:**
```json
{
  "status": 200,
	{
		"id":  4,
		"barcode":  "7592710003707",
		"name":  "ADELGASEN CAP X30 HERB",
		"purchase_price":  "8.25",
		"selling_price":  "10.31",
		"stock":  1,
		"reference_selling_price":  "1204.31"
	}	
}
``` 
###  POST /api/products/
Create new product
📥 Request Body (`application/json`)
- ***barcode*** type: String, ***optional*** -> Barcode of product
- ***name*** type: String, ***required*** -> Product Name
- ***purchase_price*** type: Float(2), ***required*** -> Product cost
- ***selling_price*** type: Float(2), ***required*** -> Product selling price
- ***stock*** type: integer, ***required*** -> Product stock
Create a new product a returns a status 201 with new product Data 
```json
{
	"barcode":  "0000000000001",
	"id":  1,
	"name":  "ADIX 750MG 5 TAB LEVOFLOXACINA LEGRAND",
	"purchase_price":  "8.25",
	"selling_price":  "11.78",
	"stock":  40
}
``` 
###  PATCH /api/products/:id
***/api/products/1***

Update a product with new data
📥 Request Body (`application/json`)
- ***barcode*** type: String, ***optional*** -> Barcode of product
- ***name*** type: String, ***optional*** -> Product Name
- ***purchase_price*** type: Float(2), ***optional*** -> Product cost
- ***selling_price*** type: Float(2), ***optional*** -> Product selling price
- ***stock*** type: integer, ***optional*** -> Product stock
returns a status 200 with new product data:
```json
{
	"id":  1,
	"barcode":  "7704039117922",
	"name":  "ADIX 750MG 5 TAB LEVOFLOXACINA LEGRAND",
	"purchase_price":  "8.25",
	"selling_price":  "11.78",
	"stock":  40
}

``` 
###  DELETE /api/products/
Delete a product if this has not been sold 
📥 Request Body (`application/json`)
- ***productId*** type: Integer, ***required*** -> Barcode of product

throw an error if product if not found.
return ***status 204*** with a empty object 