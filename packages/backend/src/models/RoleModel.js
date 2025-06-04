import { DataTypes, Model } from 'sequelize'

class Role extends Model {
    // ralations model 
}

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
                        msg: "Role name cannot be empty."
                    }
                }
            }
        },
        {
            sequelize, 
            modelName: "Role",
            tableName: 'roles',
            timestamps: false,
            schema: "public"
        }
    )
}

export { initializeRole, Role }
