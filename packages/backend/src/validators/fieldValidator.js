import {check, validationResult} from 'express-validator'

function validateFields(rule) {
    const validationRule = {
        createCustomer: [
            check('id_number').isLength({ min: 6}).withMessage('El número de cédula debe tener al menos 6 dígitos')
        ]
    }

    return [...validationRule[rule],
        (req, res, next) => {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                const messages = errors.array().map((error) => {
                    return {
                        [error.path]: error.msg
                    }
                })
                return res.status(400).json({errors: messages})
            }
            next()
        }]
}

export { validateFields }