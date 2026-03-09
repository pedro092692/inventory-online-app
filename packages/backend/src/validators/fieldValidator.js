import {check, validationResult} from 'express-validator'

function validateFields(rule) {
    const validationRule = {
        createCustomer: [
            check('id_number').isLength({ min: 6}).withMessage('El número de cédula debe tener al menos 6 dígitos'),
            check('name').isLength({ min: 3}).withMessage('El nombre debe tener al menos 3 caracteres'),
            check('phone').isLength({ min: 13}).withMessage('El teléfono debe tener al menos 10 dígitos'),
        ],

        deleteCustomer: [
            check('customerId').isInt().withMessage('El id del cliente debe ser un número entero')
        ],

        createProduct: [
            check('barcode').isLength({ min: 3}).withMessage('El código de barras debe tener al menos 3 dígitos'),
            check('name').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres').isString().withMessage('El nombre debe ser una cadena de texto'),
            check('purchase_price').isNumeric().withMessage('El precio de compra debe ser un número'),
            check('selling_price').isNumeric().withMessage('El precio de venta debe ser un número'),
            check('stock').isNumeric().withMessage('El stock debe ser un número')
        ]
    }

    return [...validationRule[rule],
        (req, res, next) => {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                let dataErrors = {}
                errors.array().map((error) => {
                    return dataErrors[error.path] = error.msg
                    
                })
                return res.status(400).json({errors: dataErrors})
            }
            next()
        }]
}

export { validateFields }