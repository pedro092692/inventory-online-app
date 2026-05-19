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
            as: 'sales',
        })
    }

    static associationUser(model) {
        this.belongsTo(model.User, {
            foreignKey: 'user_id',
            as: 'user',
            constraints: false,
        })
    }
}

/**
 * Initialize Seller model with its schema definiton and configuration.
 * This function set up Seller model with fields such as: `id`, `id_number`, `is_supervisor`, `pin`, `name`, `last_name`, and `address`
 * and Configure Sequelize options like model name, table name, schema and timestamps.
 * @param {import('sequelize').Sequelize} sequelize -An Sequelize instance used to initialize the Seller model. 
 * @param {string} schema - The schame used to register the model.
 * @return {Seller: typeof model} returns Seller model.
 */
function initializeSeller(sequelize, schema) {
    Seller.init(
        {
            id: {
                 type: DataTypes.INTEGER, 
                 autoIncrement: true,
                 primaryKey: true,
             },
            
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            is_supervisor: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            pin: {
                type: DataTypes.STRING,
                allowNull: true,
                unique:{
                    name: 'sellers_pin_unique_idx',
                    msg: 'This pin is invalid, please choose another one.'
                },
                validate: {
                    allowNull: true,
                    notEmpty: {
                        msg: 'A valid pin is required.'
                    }
                }
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
            schema: schema
        }
    )
    return Seller
}

export { initializeSeller, Seller }