import { invoices } from './fakerInvoice.js'
/**
 * @classdesc A class to generate fake payment details for invoices.
 */
class FakerPayment {
    /**
     * Initializes a new instance of the FakerPayment class.
     */
    constructor() {
        this.invoices = invoices
        this.bolivarsTransactions = [1,2,3,4]
    }
    /**
     * Creates a random number of transaction payment method IDs.
     * @private
     * @returns {number[]} An array of payment method IDs.
     */
    _createTransactions() {
        const transactions_ids = []
        // determine number of transactions
        const numberOfTransactions = this._randomNumber(4)
        // set a payment methods id for each transactioins
        for(let i = 0; i<numberOfTransactions; i++) {
            transactions_ids.push(
                this._randomPaymentMethod()
            )
        }

        return transactions_ids
    }

    /**
     * Generates detailed payment transactions for all invoices.
     * It can create single or multiple payment details per invoice,
     * handling different currencies (Bolivars vs. others) and splitting
     * the total amount accordingly.
     * @returns {Array<Object>} An array of payment detail objects ready for the database.
     */
    generateDetail() {
        const details = []

        // 1. ireate over all invoices
        for(let invoice of this.invoices) {
            // 2. determine number of transaction for current invoices 
            const transactions = this._createTransactions()
            // set total paid for a invoice 
            let paid_percent = 0
            let i = 0
            // 3. iterate over transaction 
            for(let transaction of transactions) {
                if(transactions.length == 1) {
                    
                    // 1. get type of transaction

                    // if transaction is in bs set amount in bs 
                    if(this._checkBolivarTransaction(transaction)) {
                       details.push(
                        {
                            invoice_id: invoice.invoice_id,
                            payment_id: transaction,
                            amount: invoice.total_reference,
                            reference_amount: invoice.total
                        }
                       )
                    }else {
                        details.push(
                        {
                            invoice_id: invoice.invoice_id,
                            payment_id: transaction,
                            amount: invoice.total,
                            reference_amount: invoice.total
                        }
                       )
                    }
                }else {
                    // determine percent to pay
                    let percent_to_paid = Math.floor(Math.random() * (25 - 10)) + 10
                    if(i == transactions.length - 1){
                        percent_to_paid = 100 - paid_percent
                        paid_percent += percent_to_paid
                    }else{
                        paid_percent += percent_to_paid
                    }

                    // dertermine type of transaction 
                    if(this._checkBolivarTransaction(transaction)) {
                        const amount = invoice.total_reference * (percent_to_paid / 100)
                        const dollarValue = invoice.total_reference /  invoice.total 
                        details.push(
                            {
                                invoice_id: invoice.invoice_id,
                                payment_id: transaction,
                                amount: amount,
                                reference_amount: amount / dollarValue
                            }
                        )
                    }else{
                        const amount = invoice.total * (percent_to_paid / 100)
                        details.push(
                            {
                                invoice_id: invoice.invoice_id,
                                payment_id: transaction,
                                amount: amount,
                                reference_amount: amount
                            }
                        )
                    }
                    
                    i++
                }
            }
            
            
           
        }
        return details
    }

    /**
     * Generates a random integer between 1 and a given maximum.
     * @private
     * @param {number} max - The maximum value (inclusive).
     * @returns {number} A random integer.
     */
    _randomNumber(max) {
        return Math.floor(Math.random() * max) + 1
    }

    /**
     * Selects a random payment method ID, with a higher probability for method 1.
     * @private
     * @returns {number} A payment method ID.
     */
    _randomPaymentMethod() {
        if(Math.random() < 0.63) {
            return 1
        }else{
            const otherNumber = [2,3,4,5,6,7]
            const index = Math.floor(Math.random() * otherNumber.length)
            return otherNumber[index]
        }
    }

    /**
     * Checks if a given transaction ID corresponds to a payment in Bolivars.
     * @private
     * @param {number} transaction - The payment method ID.
     * @returns {boolean} True if the transaction is in Bolivars, false otherwise.
     */
    _checkBolivarTransaction(transaction) {
        return this.bolivarsTransactions.includes(transaction)
    }
}

const faker = new FakerPayment()
const details = faker.generateDetail()

export { details }