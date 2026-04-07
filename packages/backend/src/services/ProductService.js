import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'
import { FileError, InvalidFileTypeError, EmptyRowsError } from '../errors/FileError.js'
import DollarValueService from './DollarValueService.js'
import { Op, ValidationError} from 'sequelize'
import XLSX from 'xlsx'

class ProductService{
    // instance of error handler
    #error = new ServiceErrorHandler()

    constructor(model, dollarValueModel=null) {
        this.Product = model
        this.dollarValue = new DollarValueService(dollarValueModel)
        this.#error
    }

    /**
     * Creates a new product.
     * @param {Srting} barcode - barcode of the product
     * @param {String} name - name of the product
     * @param {Number} purchase_price - purchase price of the product
     * @param {Number} selling_price - selling price of the product
     * @param {Number} stock - stock of the product 
     * @returns {Promise<Object>} - returns the created product
     * @throws {ServiceError} - throws an error if the product could not be created
     */
    createProduct(barcode, name, purchase_price, selling_price, stock) {
        return this.#error.handler(['Create Product'], async() => {
            const newProduct = await this.Product.create({
                barcode: barcode,
                name: name, 
                purchase_price: purchase_price, 
                selling_price: selling_price,
                stock
            })
            return newProduct
        })
    }

    /**
     * Handles the bulk creation of products from an uploaded file (Excel/CSV).
     * This method validates the file structure, extracts data from the first sheet,
     * Normalizes headers and product information, and performs a bulk insertion 
     * into the database.
     * @param {File|Blob|Buffer} file - The raw file object containing product data.
     * @returns {Promise<boolean>} Resolves to true if the bulk creation is successful.
     * @throws {Error} Throws if the file is missing or null.
     * @throws {ValidationError} Throws if headers do not match requirements or data is malformed.
     * @throws {DatabaseError} Throws if the Sequelize `bulkCreate` operation fails.
     */
    createProductsBulk(file) {
        return this.#error.handler(['Create Products Bulk'], async() => {
            if (!file) {
                throw new Error('File is required')
            }

            // validate file 
            const workbook = await this.validateFile(file)

            // get sheet 
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            
            // get rows 
            const rows = XLSX.utils.sheet_to_json(sheet, {header: 1})
            const [headers, ...data] = rows

            // validate headers
            this.validateHeaders(headers)

            const productData = this.productData(data)

            // validate products data 
            this.validateProductData(productData)

            // check for duplicate barcodes in the file
            this.findDuplicateBarcodes(productData)

            // create products in bulk

            //upsert products in bulk
            const {newProducts, productsToUpdate, ignoredProducts} = await this.upsertProductsBulk(productData)
            

            return {newProducts, productsToUpdate, ignoredProducts}

        })

    }

    /**
     * Retrieves all products with pagination.
     * @param {Number} limit - limit of products to return
     * @param {Number} offset - offset of products to return
     * @returns {Promise<Array>} - returns an array of products
     * @throws {ServiceError} - throws an error if the products could not be retrieved
     */
    getAllProducts(limit = 10, page = 1, includePurchasePrice = false) {
        const offset = (page - 1) * limit
        let attributes  = ['id', 'barcode', 'name', 'selling_price','stock']
        if (includePurchasePrice) {
            attributes.push('purchase_price')
        }

        return this.#error.handler(['Read All Products'], async () => {
            const products = await this.Product.findAll({
                attributes: attributes,
                order: [['name', 'ASC']],
                limit: limit,
                offset: offset
            })
            
            const productsSellingPriceBs = await this.setSellingPriceBs(products)
            
            return {
                products: productsSellingPriceBs,
            }
        })    
    }
    
    /**
     * Retrieves a product by its ID.
     * @param {Number} id - id of the product to retrieve
     * @returns {Promise<Object>} - returns the product with the given id
     * @throws {ServiceError} - throws an error if the product could not be retrieved
     */
    getProduct(id, priceReference=true) {
        return this.#error.handler(['Read Product', id, 'Product'], async () => {
            const product = await this.Product.findByPk(id)

            if(!product) {
                throw new NotFoundError()
            }
            
            // add reference selling price to product 
            if(priceReference){
                // get the last dollar value
                const dollarValue = await this.dollarValue.getLastValue()

                // set reference selling price to the product
                product.dataValues.reference_selling_price = (parseFloat(product.selling_price) * parseFloat(dollarValue.value)).toFixed(2)
                
                // if dollar value is not found, set reference selling price to message 
                if(!dollarValue) {
                    product.dataValues.reference_selling_price = 'No dollar value found'
                }
            }
            
            return product
        })
    }

    /**
     * Searches for product by name and barcode.
     * @param {string} query - The name or barcode to search for.
     * @param {number} [limit=10] - The maximum number of results to return.
     * @param {number} [offset=0] - The number of results to skip.
     * @return {Promise<Object>} - A promise that resolves to an object containing search results and pagination info.
     * @throws {ServiceError} - If an error occurs during the search.
     */
    searchProducts(query, page = 1, limit = 10, includePurchasePrice = true) {
        const offset = (page - 1) * limit
        let attributes  = ['id', 'barcode', 'name', 'selling_price','stock']
        if (includePurchasePrice) {
            attributes.push('purchase_price')
        }
        return this.#error.handler(['Search Products', query, 'Product'], async () => {
            const results = await this.Product.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: {[Op.substring]: query.toLowerCase()} },
                        { barcode: {[Op.substring]: query.toLowerCase()} }
                    ]
                },
                attributes: attributes,
                order: [['id', 'DESC']],
                limit: limit,
                offset: offset
            })

            // add selleing bs price
            const productsSellingPriceBs = await this.setSellingPriceBs(results.rows)
            return {
                products: productsSellingPriceBs,
            }
        })
    }

    /**
     * Calculates the total number of pages for products results based on a search query and limit.
     * * @param {string} [query=''] - The search term to filter products by name or barcode.
     * @param {number} [limit=10] - The number of records to display per page.
     * @returns {Promise<number>} A promise that resolves to the total number of calculated pages.
     * @throws Will be handled by the internal error handler.
     */
    totalPages(query = '',  limit = 10) {
        return this.#error.handler(['Total pages', query, 'Product'], async () => {
            if (!query) {
                const count = await this.Product.count()
                return Math.ceil(count / limit)
            }

            const results = await this.Product.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: {[Op.substring]: query.toLowerCase()} },
                        { barcode: {[Op.substring]: query.toLowerCase()} }
                    ]
                }
            })
            
            return Math.ceil(results.count / limit)

        })
    }

    /**
     * Updates a product by its ID.
     * @param {Number} productId - id of the product to update
     * @param {Object} updates - object containing the updates to be made
     * @param {String} updates.barcode - barcode of the product
     * @param {String} updates.name - name of the product
     * @param {Number} updates.purchase_price - purchase price of the product
     * @param {Number} updates.selling_price - selling price of the product
     * @param {Number} updates.stock - stock of the product
     * @returns {Promise<Object>} - returns the updated product
     */
    updateProduct(productId, updates) {
        return this.#error.handler(['Update Product', productId, 'Product'], async() => {
            const product = await this.getProduct(productId, false)
            const updatedProduct = await product.update(updates)
            return updatedProduct
        })
    }

    /**
     * Deletes a product by its ID.
     * @param {Number} productId - id of the product to delete
     * @returns {Promise<Number>} - returns 1 if the product was deleted successfully
     * @throws {ServiceError} - throws an error if the product could not be deleted
     */
    deleteProduct(productId) {
        return this.#error.handler(['Delete Product', productId, 'Product'], async() => {
            const product = await this.getProduct(productId, false)
            const productInvoices = await product.getInvoices()
            if (productInvoices.length > 0) {
                throw new ValidationError('No se puede eliminar un producto con facturas asociadas')
            }
            // delete product
            await product.destroy()
            return 1
        })
    }

    /**
     * Retrieves stock for multiple products based on their IDs.
     * @param {Array} details - array of objects containing product_id and quantity
     * @param {Number} details.product_id - id of the product
     * @returns {Promise<Array>} - returns an array of products with their stock
     * @throws {ServiceError} - throws an error if the stock could not be retrieved
     */
    getProductStock(details) {
        return this.#error.handler(['Read Stock Product'], async() => {
            const products = await this.Product.findAll({
                where: { id: details.map(detail => detail.product_id) },
                attributes: ['id', 'stock']
            })
            return products
        })
    }

    /**
     * Retrieves the unit price for multiple products based on their IDs.   
     * @param {Array} details - array of objects containing product_id and quantity
     * @param {Number} details.product_id - id of the product
     * @returns {Promise<Array>} - returns an array of products with their unit price
     * @throws {ServiceError} - throws an error if the unit price could not be retrieved
     */
    getProductUnitPrice(details) {
        return this.#error.handler(['Read Unit Price Product'], async() => {
            const products = await this.Product.findAll({
                where: { id: details.map(detail => detail.product_id)},
                attributes: ['id', 'selling_price']
            })
            return products
        })
    }

    /**
     * Updates stock for multiple products by decrementing their stock quantity.
     * @param {Array} details - array of objects containing product_id and quantity
     * @param {Number} details.product_id - id of the product
     * @param {Number} details.quantity - quantity of the product to be updated
     * @returns {Promise<void>} - returns nothing
     * @throws {ServiceError} - throws an error if the stock could not be updated
     */
    updateStock(details) {
        return this.#error.handler(['Update Stock'], async() => {
            await Promise.all(
                details.map(detail => this.Product.increment(
                    {
                      stock: - detail.quantity
                    },
                    {
                        where: {
                            id: detail.product_id
                        }
                    }
                ))
            )
        })
    }

    /**
     * Restores stock for a product by incrementing its stock quantity.
     * @param {Number} product_id - id of the product to restore stock
     * @param {Number} quantity - quantity of the product to be restored
     * @returns {Promise<void>} - returns nothing
     * @throws {ServiceError} - throws an error if the stock could not be restored
     */
    restoreStock(product_id, quantity) {
         return this.#error.handler(['Update Stock'], async() => {
            await this.Product.increment(
                {
                    stock: + quantity
                },
                {
                    where: { id: product_id }
                }
            )
            
        })
    }

    /**
     * Calculates and sets the reference selling price in Bolivars (Bs) for a list of products
     * based on the most recent dollar exchange rate.
     *
     * @param {Array<Object>|null} [products=null] - An array of product objects to process. 
     * Expected to have 'selling_price' and a 'dataValues' property.
     * @returns {Promise<Array<Object>|null>} The updated array of products with 'reference_selling_price' added.
     */
    async setSellingPriceBs(products = null) {
        //add reference price to products 
        const dollarValue = await this.dollarValue.getLastValue()
        products.forEach((product) => {
            product.dataValues.reference_selling_price = 
                (parseFloat(product.selling_price) * parseFloat(dollarValue.value ? dollarValue.value : 1)).toFixed(2)
        })

        return products
    }

    /**
     * Validates the uploaded file's format and reads it into a workbook object.
     * This method checks both the MIME type and the file extension against a whitelist 
     * of allowed spreadsheet formats (XLSX, XLS, CSV, ODS). If valid, it parses the 
     * file buffer using the XLSX library.
     * @param {Object} file - The file object (typically from Multer or a similar middleware).
     * @param {string} file.originalname - The original name of the file including extension.
     * @param {string} file.mimetype - The MIME type of the file.
     * @param {Buffer} file.buffer - The raw data buffer of the file.
     * @returns {Promise<Object>} A promise that resolves to an XLSX Workbook object.
     * @throws {Error} Throws "Not allwed file type" if the extension or MIME type is invalid.
     * @throws {Error} Throws if the XLSX library fails to parse the file buffer.
     */
    validateFile(file) {
        return this.#error.handler(['Validate File'], async () => {
            const allowdMimeType = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv',
                'application/vnd.oasis.opendocument.spreadsheet' 
            ]

            const allowedExtensions = ['xlsx', 'xls', 'csv', 'ods']
            const fileExtension = file.originalname.split('.').pop().toLowerCase()

            if (!allowdMimeType.includes(file.mimetype) || !allowedExtensions.includes(fileExtension)) {
                throw new InvalidFileTypeError('Solo se permiten archivos .xlsx, .xls, .csv y .ods')
            }
            
            const workbook = XLSX.read(file.buffer, {type: 'buffer'})

            return workbook
        })
    }


    /**
     * Validates that the spreadsheet contains all required columns.
     * This method normalizes the provided headers by:
     * 1. Trimming whitespace.
     * 2. Converting to lowercase.
     * 3. Removing accents/diacritics (Unicode NFD normalization).
     * 4. Collapsing multiple internal spaces into a single space.
     * It then checks if every required header in `expectedHeaders` exists 
     * within the normalized list.
     * @param {string[]} headers - The raw header row extracted from the spreadsheet.
     * @returns {void} Returns nothing if validation passes.
     * @throws {Error} Throws "Invalid file headers." if one or more required 
     * columns are missing after normalization.
     */ 
    validateHeaders(headers) {
        const errorMsg = 
            'Columnas inválidas. Asegúrate de que el archivo contenga las columnas: Nombre, \
            Código de Barras, Precio de Compra, Precio de Venta y Stock'
        
        const expectedHeaders = [
            'nombre',
            'codigo de barras',
            'precio de compra',
            'precio de venta',
            'stock'
        ]
        // cheveck if headers are valids 
        const checkHeaders = headers.map(header => {
            if (typeof header !== 'string' || header.trim() === '') {
                throw new FileError(errorMsg)
            }
        })
        
        const normalizedHeaders = headers.map(header => header
                                                            .trim()
                                                            .toLowerCase()
                                                            .normalize("NFD")
                                                            .replace(/[\u0300-\u036f]/g, "")
                                                            .replace(/\s+/g, ' '))
        
        const isValid = expectedHeaders.every(expectedHeader => normalizedHeaders.includes(expectedHeader))

        if (!isValid) {
            throw new FileError(errorMsg)
        }
    }
    

    /**
     * Transforms raw spreadsheet rows into structured product objects.
     * This method maps an array of arrays (representing spreadsheet rows) into 
     * an array of objects with keys corresponding to the database model fields.
     * It also performs basic data normalization on the product name.
     * @param {Array<Array<any>>} rows - The raw data rows extracted from the sheet (excluding headers).
     * @returns {Array<Object>} An array of formatted product objects for bulk insertion.
     * @property {string} name - Normalized product name (lowercase and trimmed).
     * @property {string|number} barcode - The product's unique identifier.
     * @property {number} purchase_price - The cost price.
     * @property {number} selling_price - The retail price.
     * @property {number} stock - The initial inventory quantity.
     * @throws {Error} Throws "Row is required" if the rows argument is null or undefined.
     */
    productData(rows) {
        if (!rows) {
            throw new Error('Row is required')
        }

        const productData = rows.map(row => {
            return {
                name: row[0].toLowerCase().trim(),
                barcode: row[1],
                purchase_price: row[2],
                selling_price: row[3],
                stock: row[4]
            }
        })
        return productData
    }

    /**
     * Validates the integrity and data types of the processed product list.
     * Iterates through the product objects to ensure all required fields are present
     * and that numeric fields (prices and stock) contain valid numbers. 
     * Error messages include the specific row number (index + 2) to help the user 
     * locate the error in their spreadsheet.
     * @param {Object[]} products - An array of product objects to validate.
     * @param {string} products[].name - The name of the product.
     * @param {string|number} products[].barcode - The unique barcode identifier.
     * @param {number} products[].purchase_price - The cost price of the product.
     * @param {number} products[].selling_price - The retail price of the product.
     * @param {number} products[].stock - The current inventory level.
     * @returns {void} Returns nothing if all products pass validation.
     * @throws {Error} Throws "Products are required" if the input is null/undefined.
     * @throws {Error} Throws a specific error indicating the missing field and the 
     */
    validateProductData(products) {
        if (!products) {
            throw new Error('Products are required')
        }

        products.forEach((product, index) => {
            if (!product.name) throw new EmptyRowsError(`El nombre del producto es requerido en la fila ${index + 2}`)
            if (!product.barcode) throw new EmptyRowsError(`El código de barras del producto es requerido en la fila ${index + 2}`)
            if (!product.purchase_price || isNaN(product.purchase_price)) throw new EmptyRowsError(`El precio de compra del producto es requerido en la fila ${index + 2}`)
            if (!product.selling_price || isNaN(product.selling_price)) throw new EmptyRowsError(`El precio de venta del producto es requerido en la fila ${index + 2}`)
            if (!product.stock || isNaN(product.stock)) throw new EmptyRowsError(`El stock del producto es requerido en la fila ${index + 2}`)
        })

    }

    /**
    * Identifies duplicate barcodes within a list of products and throws a ValidationError 
    * if any are found. It reports the first three duplicate instances found, including 
    * their associated spreadsheet row numbers (assuming a header row exists).
    *
    * @param {Object[]} products - The array of product objects to validate.
    * @param {string} products[].barcode - The unique identifier/barcode for the product.
    * @throws {ValidationError} Throws an error containing a formatted string of 
    * duplicate barcodes and their corresponding row locations.
    * @returns {void}
    */
    findDuplicateBarcodes(products) {
        const seen = new Set()
        const duplicates = new Map()
    
        products.forEach((product, index) => {
            const barcode = product.barcode
            const row = index + 2 

            if (seen.has(barcode)) {
                if(!duplicates.has(barcode)) {
                    duplicates.set(barcode, [row])
                } else {
                    duplicates.get(barcode).push(row)
                }

            } else {
                seen.add(barcode)
            }
        })
        
        if (duplicates.size > 0) {
            const message = Array.from(duplicates.entries()).slice(0, 3).map(([barcode, rows]) => {
                return `Código: "${barcode}" en filas: ${rows.slice(0, 3).join(', ')}`
            }).join(' | ')

            const extraInfo = duplicates.size > 3
                ? ` y ${duplicates.size - 3} más...`
                : ''
           

            throw new ValidationError(`Se encontraron códigos de barras duplicados: ${message}${extraInfo}`)
        }
    }


    /**
    * Performs a bulk upsert (Update or Insert) operation on a list of products.
    * * The logic splits the incoming products into two groups:
    * 1. **New products**: Those not found in the database are created via `bulkCreate`.
    * 2. **Existing products**: Those found in the database are checked for differences. 
    * If changes are detected, they are updated; otherwise, they are ignored.
    *
    * @param {Object[]} products - The list of product objects to process.
    * @param {string|number} products[].barcode - The unique barcode identifier.
    * @param {string} products[].name - The name of the product.
    * @param {number} products[].purchase_price - The purchase price.
    * @param {number} products[].selling_price - The selling price.
    * @param {number} products[].stock - The current stock level.
    * @returns {Promise<{
    * newProducts: number, 
    * productsToUpdate: number, 
    * ignoredProducts: number
    * }>} An object containing counts of the operation results.
    * * @throws {Error} Re-throws errors handled by the internal error handler.
    */
    upsertProductsBulk(products){
         return this.#error.handler(['Upsert Products Bulk'], async() => {
            const barcodes = products.map(product => `${product.barcode}`)
            const productsInDb = await this.getProductByBarcodes(barcodes)
            const productsToCheckUpdate = new Map()
            const productsToCreate = []
            let updatedProducts = 0
            let ignored = 0

            products.forEach((product) => {
                if(productsInDb.has(`${product.barcode}`)) {
                   productsToCheckUpdate.set(product.barcode, product)

                } else {
                    productsToCreate.push(
                        product
                    )
                }
            })

          
            if (productsToCreate.length > 0) {
                await this.Product.bulkCreate(productsToCreate)
            }

            if (productsToCheckUpdate.size > 0) {
                const {productsToUpdate, ignoredProducts} = this.checkProductForUpdate(productsToCheckUpdate, productsInDb)
                
                if (productsToUpdate.length > 0) {
                    await this.Product.bulkCreate(productsToUpdate, {
                        updateOnDuplicate: ['name', 'purchase_price', 'selling_price', 'stock']
                    })
                }
                
                ignored = ignoredProducts
                updatedProducts = productsToUpdate.length
        
            }
            
            return {
                newProducts: productsToCreate ? productsToCreate.length : 0,
                productsToUpdate: updatedProducts,
                ignoredProducts: ignored
            }
        
         })

    }

    getProductByBarcodes(barcodes) {
        return this.#error.handler(['Get Product By Barcodes'], async() => {
            const productDb = new Map()
            const products = await this.Product.findAll({
                where: {
                    barcode: {
                        [Op.in]: barcodes
                    }
                }
                })
            
                products.forEach(product => {
                productDb.set(product.barcode, product)
            })
            return productDb
        })

    }

    checkProductForUpdate(products, productsInDb) {
        const productsToUpdate = new Map()
        let ignoredProducts = 0
      
        products.forEach((product) => {
            const existing = productsInDb.get(`${product.barcode}`)
            let updateObject = productsToUpdate.get(`${product.barcode}`)
            let hasChanges = false

            if (!updateObject) {
                updateObject = {
                    id: existing.id,
                    barcode: existing.barcode,
                    name: existing.name,
                    purchase_price: existing.purchase_price,
                    selling_price: existing.selling_price,
                    stock: existing.stock
                }
                
            }

            if(product.name !== productsInDb.get(`${product.barcode}`).name) {
                updateObject.name = product.name
                hasChanges = true
            
            }

            if(parseFloat(product.purchase_price) !== parseFloat(productsInDb.get(`${product.barcode}`).purchase_price)) {
                  updateObject.purchase_price = product.purchase_price
                  hasChanges = true
            }

            if(parseFloat(product.selling_price) !== parseFloat(productsInDb.get(`${product.barcode}`).selling_price)) {
                updateObject.selling_price = product.selling_price
                hasChanges = true
            }

            if(parseFloat(product.stock) !== parseFloat(productsInDb.get(`${product.barcode}`).stock)) {
                updateObject.stock = product.stock
                hasChanges = true
            }

            if(hasChanges) {
                productsToUpdate.set(`${product.barcode}`, updateObject)
            }else{
                ignoredProducts++
            
            }

        })
        
        return {
            productsToUpdate: Array.from(productsToUpdate.values()),
            ignoredProducts: ignoredProducts
        }
        
    }





}

export default ProductService