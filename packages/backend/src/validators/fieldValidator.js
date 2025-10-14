import {check, validationResult} from 'express-validator'

function validateFields(rule) {
    const validationRule = {
        createCustomer: [
            check('id_number').isLength({ min: 6}).withMessage('El número de cédula debe tener al menos 6 dígitos'),
            check('name').isLength({ min: 3}).withMessage('El nombre debe tener al menos 3 caracteres'),
            check('phone').isLength({ min: 7}).withMessage('El teléfono debe tener al menos 7 dígitos'),
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