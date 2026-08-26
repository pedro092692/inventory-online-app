import { DataTypes, Model } from 'sequelize'

class PlatFormExchangeRate extends Model {
    // no relations
}

function initializePlatformExchangeRate(sequelize) {
    PlatFormExchangeRate.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            value: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: { isNumeric: { msg: 'A valid number is required.' } }
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
                validate: { isDate: { msg: 'A valid date is required' } }
            }
        },
        {
            sequelize,
            modelName: 'PlatformExchangeRate',
            tableName: 'platform_exchange_rates',
            timestamps: false,
            schema: 'public'
        }
    )
}

export { initializePlatformExchangeRate, PlatFormExchangeRate }