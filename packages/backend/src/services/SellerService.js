import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'
import { InvalidPinError } from '../errors/supervisorPinError.js'
import { Op, ValidationError } from 'sequelize'

class SellerService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.Seller = model
        this.#error
        this.maxSellerAllowed = 6
    }
    /**
     * Creates a new seller.
     * @param {Number} id_number - id number of the seller
     * @param {String} name - name of the seller
     * @param {String} last_name - last name of the seller
     * @param {Strind} address - address of the seller
     * @throws {ServiceError} - throws an error if the seller could not be created
     * @returns {Promise<Object>} - returns the created seller
     */
    createSeller(id_number, name, last_name, address, user_id, is_supervisor, pin, options={}) {
        return this.#error.handler(['Create Seller'], async() => {
            // 1 verify if user is supervisor and pin 
            if (is_supervisor && !pin) {
                throw new ValidationError('Para supervisores el PIN es requerido.')
            }

            // 2 check if pin is not taken 
            if (pin) {
                const isPinTaken = await this.Seller.findOne({
                    where: {
                        pin: pin
                    }
                })

                if (isPinTaken) {
                    throw new ValidationError('Este PIN es inválido; por favor, elige otro PIN.')
                }
            }

            // check is current user has max allowed seller created
            const sellersCount = await this.Seller.count()
            if (sellersCount >= this.maxSellerAllowed) {
                throw new ValidationError(`El número máximo de personal (${this.maxSellerAllowed - 1}) alcanzado; elimina un usuario para agregar uno nuevo.`)
            }

            const newSeller = await this.Seller.create({
                user_id: user_id,
                pin: pin,
                is_supervisor: is_supervisor,
                id_number: id_number,
                name: name,
                last_name: last_name,
                address: address,
            },
            {
                transaction: options?.transaction
            }
            )
            return newSeller
        })
    }

    /**
     * Get all sellers with pagination.
     * @description Retrieves all sellers with their sales, limited by the specified limit and offset.
     * @param {Number} limit - limit of sellers to return
     * @param {Number} offset - offset of sellers to return
     * @throws {ServiceError} - throws an error if the sellers could not be retrieved
     * @returns {Promise<Array>} - returns an array of sellers with their sales
     */
    getAllSellers(limit = 10, page = 1, includeInvoices = false, user_id) {
        const offset = (page - 1) * limit
        const salesAssociation = {}
        if (includeInvoices) {
            association.association = 'sales',
            association.attributes = ['id', 'date', 'total']
            association.order = [['id', 'DESC'], ['sales', 'id', 'DESC']]
        }
        return this.#error.handler(['Read All Sellers'], async() => {
            const sellers = await this.Seller.findAll({
                include: includeInvoices ? [salesAssociation] : [],
                order: includeInvoices ? salesAssociation.order : [['id', 'DESC']],
                attributes: ['id', 'is_supervisor', 'id_number', 'name', 'last_name', 'address'],
                where: {
                    user_id: {
                        [Op.ne]: user_id
                    }
                },
                limit: limit,
                offset: offset
            })
            return {
                sellers: sellers
            }
        })
    }

    /**
     * Retrieves a seller by their ID.
     * @description Retrieves a seller with their sales by the given ID.
     * @param {Number} id - ID of the seller to retrieve
     * @throws {ServiceError} - throws an error if the seller could not be found
     * @returns {Promise<Object>} - returns the seller with their sales
     */ 
    getSeller(id) {
        return this.#error.handler(['Read Seller', id, 'Seller'], async () => {
            const seller = await this.Seller.findByPk(id, {
                include: [{
                    association: 'sales',
                    attributes: ['id', 'date', 'total']
                },
                {
                    association: 'user',
                    attributes: ['id', 'email']
                }   
                ],
                paranoid: false,
                order: [['sales', 'id', 'DESC']],
            })
            // await seller.user.update({email: 'pedro0926@hotmail.com'})
            if(!seller) {
                throw new NotFoundError()
            }

            return {
                seller: seller
            }
        })
    }

    /**
     * Authorizes a seller by their PIN.
     * @description Checks if the provided PIN belongs to a supervisor seller and returns the authorized seller's information.
     * @param {String} pin - The PIN of the supervisor seller for authorization.
     * @param {Object} options - Options for the database transaction.
     * @throws {ServiceError} - throws an error if the seller could not be found
     * @returns {Promise<Object>} - returns the authorized seller's information
     */
    authorizeSeller(pin, options = {}) {
        return this.#error.handler(['Authorize Seller', pin, 'Seller'], async() => {
            const authoriZedSeller = await this.Seller.findOne({
                where: {
                    pin: pin,
                    is_supervisor: true
                },
                attributes: ['id', 'user_id', 'name', 'last_name']
            },
            {
                transaction: options.transaction || null
            })
            
            if(!authoriZedSeller) {
                throw new InvalidPinError('Pin incorrecto o el vendedor no tiene permisos de supervisor')
            }

 
            return {
                authorizedBy: authoriZedSeller
            }
        })
    }

    /**
     * Updates a seller by their ID.
     * @description Updates the seller with the given ID using the provided updates.
     * @param {Number} sellerId - ID of the seller to update
     * @param {Object} updates - object containing the updates to apply
     * @param {String} updates.id_number - id number of the seller
     * @param {String} updates.name - name of the seller
     * @param {String} updates.last_name - last name of the seller
     * @param {String} updates.address - address of the seller
     * @throws {NotFoundError} - throws an error if the seller with the given ID does not exist
     * @throws {ServiceError} - throws an error if the seller could not be updated
     * @returns {Promise<Object>} - returns the updated seller
     */
    updateSeller(sellerId, updates) {
        return this.#error.handler(['Update Seller', sellerId, 'Seller'], async() => {
            const seller = await this.getSeller(sellerId)
            const updatedSeller = await seller.update(updates)
            return updatedSeller
        })
    }

    /**
     * Deletes a seller by their ID.
     * @description Deletes the seller with the given ID.
     * @param {Number} sellerId - ID of the seller to delete
     * @throws {NotFoundError} - throws an error if the seller with the given ID does not exist
     * @throws {ServiceError} - throws an error if the seller could not be deleted
     * @returns {Promise<Number>} - returns 1 if the seller was deleted successfully
     */
    deleteSeller(sellerId) {
        return this.#error.handler(['Delete Seller', sellerId, 'Seller'], async() => {
            const seller = await this.getSeller(sellerId)
            // delete seller 
            await seller.destroy()
            return 1
        })
    }
     
}

export default SellerService