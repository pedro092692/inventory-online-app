import { details  } from './fakerPayments.js'
import { invoices } from './fakerInvoice.js'

class FakerCashMovements {
    constructor() {
        this.details = details
        this.invoices = invoices
    }


    generateCashMovements() {
        const cashMovements = []

        for (let invoice of this.invoices) {   
            for (let transaction of this.details) {
                if(transaction.invoice_id == invoice.invoice_id) {
                    cashMovements.push(
                        {
                            invoice_id: transaction.invoice_id,
                            payment_method_id: transaction.payment_id,
                            type: 'in',
                            amount: transaction.amount,
                            applied_to_invoice_amount: transaction.reference_amount,
                            exchange_rate: invoice.total_reference / invoice.total,
                            description: 'Pago de factura #' + transaction.invoice_id,
                            created_at: invoice.date,
                            user_id: invoice.seller_id,
                            movement_category: 'invoice_payment',
                            converted_amount: transaction.reference_amount
                        }
                    )
                }
            }
        }

        return cashMovements
    }
}

const faker =new FakerCashMovements()
const cashMovements = faker.generateCashMovements()
export { cashMovements }
