import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'
import { InvalidPinError } from '../errors/supervisorPinError.js'
import pkg from '../config/config.js'
import { Op, ValidationError } from 'sequelize'
import bcrypt from 'bcrypt'

const currentEnv = process.env.NODE_ENV || 'development'
const saltRounds = pkg[currentEnv].saltRounds

class SellerService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor(model, invoiceModel = null) {
        this.Seller = model
        this.Invoice = invoiceModel
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
    getAllSellers(limit = 10, page = 1, includeInvoices = false, user_id, only_deleted = false) {
        const offset = (page - 1) * limit
        const salesAssociation = {}
        const whereClause = {
            user_id: { [Op.ne]: user_id },
            ...(only_deleted
                ? { deletedAt: { [Op.ne]: null } }
                : { deletedAt: null }
            )
        }
        
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
                where: whereClause,
                limit: limit,
                offset: offset,
                paranoid: false,
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
    getSeller(id, pageInvoices=1, limitInvoices=8) {
        const offsetInvoices = (pageInvoices - 1) * limitInvoices
        return this.#error.handler(['Read Seller', id, 'Seller'], async () => {
            const seller = await this.Seller.findByPk(id, {
                include: [{
                    association: 'sales',
                    attributes: ['id', 'date', 'total', 'status'],
                    separate: true,
                    limit: limitInvoices,
                    offset: offsetInvoices,
                    order: [['id', 'DESC']]
                },
                {
                    association: 'user',
                    attributes: ['id', 'email', 'role_id', 'deletedAt'],
                    paranoid: false
                }   
                ],
                paranoid: false,
            })
            
            if(!seller) {
                throw new NotFoundError()
            }

            return {
                seller: seller
            }
        })
    }

    /**
     * Retrieves the total count of invoices associated with a specific seller.
     * @param {string|number} id - The unique identifier of the seller.
     * @returns {Promise<number>} A promise that resolves to the total number of invoices.
     * @throws {Error} If the database query fails, handled by the internal error handler.
     */
    getTotalSellerInvoices(id, limit = 8) {
        return this.#error.handler(['Read Seller Total Invoices', id, 'Seller'], async () => {
            const totalInvoices = await this.Invoice.count({
                where: { seller_id: id }
            })
            return Math.ceil(totalInvoices / limit)
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
            const { restore } = updates
            const {name, last_name, id_number, address, is_supervisor, pin} = updates
            const staff_updates = {name, last_name, id_number, address, 
                is_supervisor: is_supervisor ? is_supervisor : false,
                pin: pin ? pin : null}
            
            const {email, password, role_id} = updates
            const user_updates = {email, role_id, ...(password ? {password} : {})}
            
            const data = await this.getSeller(sellerId)
            if (!data) throw new NotFoundError('Personal no encontrado')
            
            if (restore === 'true') {
                if( data.seller.deletedAt) {
                    await data.seller.restore()
                }

                if (data.seller.user.deletedAt) {
                    await data.seller.user.restore()
                }
            }

            await data.seller.update(staff_updates)
            
            if (user_updates) {
                if(user_updates.password) {
                    user_updates.password = await bcrypt.hash(password, saltRounds)
                }
                await data.seller.user.update(user_updates)
            }
            
            const updatedUser = await this.getSeller(sellerId)
            
            return updatedUser.seller
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
            const data = await this.getSeller(sellerId)
            // delete seller 
            
            await Promise.all([
                data.seller.destroy(),
                data.seller.user.destroy()
            ])

            return 1
        })
    }
     
}

export default SellerService