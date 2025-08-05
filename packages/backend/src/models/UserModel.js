import { DataTypes, Model } from 'sequelize'

class User extends Model {
    // relations model 
}

function initializeUser(sequelize) {
    User.init(
        {
            // model attributes
            id: {
                type: DataTypes.INTEGER, 
                autoIncrement: true,
                primaryKey: true
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: {
                        msg: 'A valid email is required.'
                    }
                },
                unique:{
                    msg: 'This email already has been taken'
                }
            },

            password: {
                type: DataTypes.STRING, 
                allowNull: false, 
                validate: {
                    len: {
                        args: [8],
                        msg: 'The password at least must be 8 character long.'
                    }
                }
            },

            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: false,
            schema: 'public'
        }
    )
}

export { initializeUser, User }