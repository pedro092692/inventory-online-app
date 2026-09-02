import {check, validationResult} from 'express-validator'

function validateFields(rule) {
    const check_pin =  check('pin').isLength({ min: 4 }).withMessage('El pin al menos debe tener 4 caracteres').isString().withMessage('El pin tiene debe ser una cadena de texto.')
    const check_id_number = check('id_number').isLength({ min: 6}).withMessage('El número de cédula debe tener al menos 6 dígitos')
    const check_name = check('name').isLength({ min: 3}).withMessage('El nombre debe tener al menos 3 caracteres')
    const check_isLen = (field, len, field_display=null) => check(field).isLength({ min: len}).withMessage(`${field_display ? field_display : field} debe tener al menos ${len} caracteres.`)
    const check_isLen_optional = (field, len, field_display=null) => check(field).optional().isLength({ min: len}).withMessage(`${field_display ? field_display : field} debe tener al menos ${len} caracteres.`)
    
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
            check('stock').isNumeric().withMessage('El stock debe ser un número'),
            // Optional: left empty, the product falls back to the model's default (5).
            check('min_stock').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('El stock mínimo debe ser un número entero mayor o igual a 0.')
        ],

        cancelItemDetail: [
            check('itemsToReturn').isArray({ min: 1 }).withMessage('Debe haber al menos un ítem para devolver.'),
            check('itemsToReturn.*.itemId').isInt().withMessage('El id del detalle de la factura debe ser un número entero.'),
            check('itemsToReturn.*.returnedQuantity').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor que cero.')
        ],

        authorizedSeller: [
            check('pin').isLength({ min: 4 }).withMessage('El pin al menos debe tener 4 caracteres').isString().withMessage('El pin tiene debe ser una cadena de texto.')
        ],

        createUser: [
            check_id_number,
            check_name,
            check_isLen('last_name', 3),
            check_isLen('password', 8)
        ],

        createAdmin: [
            check('email').isEmail().withMessage('El email tiene que ser válido'),
            check_isLen('password', 8, 'La contraseña'),
        ],

        createStore: [
            check_id_number,
            check_isLen('given_name', 3, 'Nombre'),
            check_isLen('last_name', 3),
            check_isLen('password', 8, 'Contraseña'),
            check('email').isEmail().withMessage('El email tiene que ser valido'),
            check_isLen('address', 3, 'Dirección'),
            check_pin,
        ],

        updateStoreOwner: [
            check('id').isInt().withMessage('El id del usuario debe ser un número entero'),
            check('email').optional().isEmail().withMessage('El email tiene que ser válido'),
            check('password').optional({ checkFalsy: true }).isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
            check_isLen_optional('name', 3, 'El nombre'),
            check_isLen_optional('last_name', 3, 'El apellido'),
            check_isLen_optional('id_number', 6, 'El número de cédula'),
            check_isLen_optional('address', 3, 'La dirección'),
        ],

        blockStore: [
            check_isLen('reason', 10, 'El motivo del bloqueo'),
        ],

        submitPayment: [
            check('amount').isNumeric().withMessage('El monto debe ser un número.').isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0.'),
        ],

        rejectPayment: [
            check_isLen('reason', 5, 'El motivo del rechazo'),
        ],

        setExchangeRate: [
            check('value').isNumeric().withMessage('La tasa debe ser un número.').isFloat({ min: 0.01 }).withMessage('La tasa debe ser mayor a 0.'),
        ],
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