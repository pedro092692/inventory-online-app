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

throw an error if product is not found.
return ***status 204*** with a empty object 

# 🧑‍🦰 Sellers
###  GET /api/sellers
Returns a `200 OK` status with a message indicating that the ***sellers*** routes are working properly.
**Response:**
```json
{
  "status": 200,
  "message": "Seller routes"
}
``` 
###  GET /api/sellers/all
Returns an array with objects of all sellers and their respectives sales
**Response:**
```json
{
  "status": 200,
[
	{
	"id":  2,
	"id_number":  6000000,
	"name":  "Andrea",
	"last_name":  "Gonzalez",
	"address":  "456 Elm St, Maracaibo, Venezuela",
	"sales":  
		[
			{
			"id":  21,
			"date":  "2025-07-16T19:34:15.182Z",
			"total":  "8.94"
			}
		]
	}
]
}
``` 
###  GET /api/sellers/:id
***/api/sellers/1***
Retrieves an object with ***seller*** data of based on seller ***ID*** if the seller is not found thrown and 404 error.
**Response:**
```json
{
  "status": 200,
	{
		"id":  1,
		"id_number":  5000000,
		"name":  "Pedro",
		"last_name":  "Bastidas",
		"address":  "123 Main St, Caracas, Venezuela",
		"sales":  [
			{
				"id":  1,
				"date":  "2023-05-01T10:00:00.000Z",
				"total":  "6.39"
			}
		]
	}	
}
``` 
###  POST /api/sellers/
Create new seller
📥 Request Body (`application/json`)
- ***id_number*** type: Integer, ***required*** -> ID number of seller
- ***name*** type: String, ***required*** -> Seller Name
- ***last_name*** type: String, ***required*** -> Seller Last Name
- ***address*** type: String, ***optional*** -> Seller Addresss
Create a new seller a returns a status 201 with new Seller Data 
```json
{
	"id":  4,
	"id_number":  21222333,
	"name":  "John",
	"last_name":  "Doe",
	"address":  "Fake Street 1234"
}
``` 
###  PATCH /api/sellers/:id
***/api/sellers/4***

Update a seller with new data
📥 Request Body (`application/json`)
- ***id_number*** type: Integer, ***optional*** -> ID number of seller
- ***name*** type: String, ***optional*** -> Seller Name
- ***last_name*** type: String, ***optional*** -> Seller Last Name
- ***address*** type: String, ***optional*** -> Seller Addresss
returns a status 200 with the updated seller data:
```json
{
	"id":  4,
	"id_number":  21222333,
	"name":  "Johnny",
	"last_name":  "Doe",
	"address":  "Fake Street 1234"
}


``` 
###  DELETE /api/sellers/
Delete a seller ⚠️ ***destructive action***  if the seller has sales it will delete the seller sales. 
📥 Request Body (`application/json`)
- ***sellerId*** type: Integer, ***required*** -> ID number of seller

throw an 404 error if seller is not found.
return ***status 204*** with a empty object 

# 💳 Payment-methods
###  GET /api/payment-methods
Returns a `200 OK` status with a message indicating that the ***Payment Methods*** routes are working properly.
**Response:**
```json
{
  "status": 200,
  "message": "Payment Methods"
}
``` 
###  GET /api/payment-methods/all
Returns an array with objects of all Payment Methods.
**Response:**
```json
{
  "status": 200,
[
	{
		"id":  1,
		"name":  "Punto de venta",
		"currency":  "Bolivar Digital"
	}
]
}
``` 
###  GET /api/payment-methods/:id
***/api/payment-methods/5***
Retrieves an object with ***payment-methods*** data of based on payment-methods ***ID*** if the payment-methods is not found throw and 404 error.
**Response:**
```json
{
  "status": 200,
	{
		"id":  5,
		"name":  "Efectivo Dolares",
		"currency":  "Dolares"
	}
}
``` 
###  POST /api/payment-methods/
Create new payment-method
📥 Request Body (`application/json`)
- ***name*** type: String, ***required*** -> Name of payment-method
- ***currency*** type: String, ***required*** -> Currency of payment method
Create a new payment-method a returns a status 201 with new payment-method Data 
```json
{
	"id":  9,
	"name":  "Zelle",
	"currency":  "Dollar"
}
``` 
###  PATCH /api/payment-methods/:id
***/api/payment-methods/9***

Update a payment method with new data
📥 Request Body (`application/json`)
- ***name*** type: String, ***Optional*** -> Name of payment-method
- ***currency*** type: String, ***Optional*** -> Currency of payment method
returns a status 200 with the updated payment method data:
```json
{
	"id":  10,
	"name":  "Bitcoin",
	"currency":  "BTC"
}
``` 
###  DELETE /api/payment-methods/
Delete a payment method ⚠️ ***destructive action***  if the payment method has sales (invoice payment detail) it will delete the invoice payment info. 
📥 Request Body (`application/json`)
- ***paymentMethodId*** type: Integer, ***required*** -> ID number of payment method

throw an 404 error if payment method is not found.
return ***status 204*** with a empty object 

# 💸 Dollar Value

### GET /api/dollar-value

Returns a `200 OK` status with a message indicating that the ***dollar-value*** routes are working properly.

**Response:**
```json
{
"status": 200,
"message": "Dollar Value Routes"
}
```

### POST /payment-methods/

Create new dollar value data

📥 Request Body (`application/json`)

-  ***value*** type: Float(2), ***required*** -> The current value of dollar in Bolivars

Create a new dollar value and returns a status 201 with new dollar value Data

```json
"newValue":  
{
	"date":  "2025-07-17T15:08:43.980Z",
	"id":  2,
	"value":  "117.40"
}

```

### GET /api/dollar-value/latest
Retrieves the latest value of dollar data

returns a status 200 with the latest dollar value data:

```json
{
	"id":  2,
	"value":  "117.40",
	"date":  "2025-07-17T15:08:43.980Z"
}
```
### PATCH /dollar-value/
📥 Request Body (`application/json`)
-  ***value*** type: Float(2), ***optional*** -> The current value of dollar in Bolivars
- ***id*** type: Integer ***Required*** -> The id of dollar value to updated
return a status 200 with the updated data of dollar value
```json
{
	"id":  2,
	"value":  "118.00",
	"date":  "2025-07-17T15:37:34.416Z"
}
```

### DELETE /api/dollar-value/

Delete a dollar value ⚠️ ***destructive action*** if there are products with reference price (price in bolivars) with this value this will be recalculated with the last one dollar value if ***there is not dollar value*** price in bolivars show and error "no dollar value found."

📥 Request Body (`application/json`)

-  ***id*** type: Integer, ***required*** -> dollar value ID to delete

throw an 404 error if dollar value is not found.

return ***status 204*** with a empty object