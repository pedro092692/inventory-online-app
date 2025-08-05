import { DataTypes, Model } from 'sequelize'

class Seller extends Model {
    // model relations 

    /**
     * Creates an association between Seller model and the Invoice model.
     * @param {{Invoice: typeof Model}} model - An object containing the Invoice model.
     * @return {void} This method does not return a value. 
     */
    static associationSales(model) {
        this.hasMany(model.Invoice, {
            foreignKey: 'seller_id',
            as: 'sales'
        })
    }
}

/**
 * Initialize Seller model with its schema definiton and configuration.
 * This function set up Seller model with fields such as: `id`, `id_number`, `name`, `last_name`, and `address`
 * and Configure Sequelize options like model name, table name, schema and timestamps.
 * @param {import('sequelize').Sequelize} sequelize -An Sequelize instance used to initialize the Seller model. 
 * @returns {void} This function does not return a value.
 */
function initializeSeller(sequelize) {
    Seller.init(
        {
            id: {
                 type: DataTypes.INTEGER, 
                 autoIncrement: true,
                 primaryKey: true,
             },
            
            id_number: {
                 type: DataTypes.INTEGER, 
                 allowNull: false,
                 validate: {
                     notEmpty: {
                         msg: 'A valid id number is required.'
                     }
                 }
             },

            name: {
                 type: DataTypes.STRING, 
                 allowNull: false,
                 validate: {
                     notEmpty: {
                         msg: 'A valid name is required.'
                     }
                 }
             },

            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'A valid last name is required.'
                    }
                }
            },

            address: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Venezuela', // default value for Venezuelan users.
                validate: {
                    notEmpty:{
                        msg: 'A valid address is required.'
                    }
                }
            },
        },
        {
            sequelize,
            modelName: 'Seller',
            tableName: 'sellers',
            timestamps: false,
            schema: 'test_schema' // only for test purposes
        }
    )
}

export { initializeSeller, Seller }