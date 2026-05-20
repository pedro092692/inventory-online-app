import { DataTypes, Model } from 'sequelize'

class AuditLog extends Model {
    // model relations
    static associationUser(model) {
        this.belongsTo(model.User, {
            foreignKey: 'user_id',
            as: 'user',
            constraints: false,
        })
    }

    static associationSupervisorSeller(model) {
        this.belongsTo(model.Seller, {
            foreignKey: 'supervisor_seller_id',
            as: 'supervisorSeller',
            constraints: false,
        }) 
    }

  
}

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