import { DataTypes, Model } from 'sequelize'

class AuditLog extends Model {
    // model relations

    /**
     * Creates an association between User model and the AuditLog model.
     * @param {{User: typeof Model}} model - An object containing the User model.
     * @return {void} This method does not return a value.
     */
    static associationUser(model) {
        this.belongsTo(model.User, {
            foreignKey: 'user_id',
            as: 'user',
            constraints: false,
        })
    }

    /**
     * Creates an association between Seller model and the AuditLog model.
     * @param {{Seller: typeof Model}} model - An object containing the Seller model.
     * @return {void} This method does not return a value.
     */
    static associationSupervisorSeller(model) {
        this.belongsTo(model.Seller, {
            foreignKey: 'supervisor_seller_id',
            as: 'supervisorSeller',
            constraints: false,
        }) 
    }

  
}


/**
 * Initialize AuditLog model with its schema definiton and configuration.
 * This function set up AuditLog model with fields such as: `id`, `action`, `table_name`, `record_id`, `old_value`, `new_value`, `user_id`, and `supervisor_seller_id`
 * and Configure Sequelize options like model name, table name, schema and timestamps.
 * @param {import('sequelize').Sequelize} sequelize -An Sequelize instance used to initialize the AuditLog model. 
 * @param {string} schema - The schame used to register the model.
 * @return {AuditLog: typeof model} returns AuditLog model.
 */
function initializeAuditLog(sequelize, schema) {
    AuditLog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            
            action: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Action is required.'
                    }
                }
            },
            
            table_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Table name is required.'
                    }
                }
            },

            record_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: 'Record ID must be a valid integer.'
                    }
                }
            },

            old_value: {
                type: DataTypes.JSONB,
                allowNull: true,
            }, 

            new_value: {
                type: DataTypes.JSONB,
                allowNull: true,
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: 'User ID must be a valid integer.'
                    }
                }
            },

            supervisor_seller_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            modelName: 'AuditLog',
            tableName: 'audit_logs',
            timestamps: true,
            updatedAt: false,
            createdAt: 'created_at',
            schema: schema
        }
    )

    return AuditLog
}

export { initializeAuditLog, AuditLog } 