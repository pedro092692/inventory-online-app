import { DataTypes, Model } from 'sequelize'

class Role extends Model {
    // ralations model 

    static association(model) {
        this.hasMany(model.User, {
            foreignKey: 'role_id',
            as: 'users'
        })
    }
}

/**
 * Initializes RoleModel with its schema definition and configuration.
 * This function set up RoleModel with fields such as: `id` and `name`
 * and configure Sequelize options like model name, table name, schema and timestamps.
 * @param {import('sequelize').Sequelize} sequelize -An Sequelize instance used to initialize the model.
 * @returns {void} This function does not return a value. 
 */
function initializeRole(sequelize) {
    Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true, 
                primaryKey: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Role name cannot be empty.'
                    }
                }
            }
        },
        {
            sequelize, 
            modelName: 'Role',
            tableName: 'roles',
            timestamps: false,
            schema: 'public'
        }
    )
}

export { initializeRole, Role }
