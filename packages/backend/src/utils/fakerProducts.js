import { faker } from '@faker-js/faker';

function fakerProduct(count = 500) {
    return Array.from({ length: count }, () => {
        const purchase_price = parseFloat(faker.commerce.price({ min: 0.5, max: 20 }))
        const selling_price = parseFloat((purchase_price * 1.3).toFixed(2))

        return {
            barcode: faker.string.numeric({ length: 13 }),
            name: faker.commerce.productName(),
            purchase_price,
            selling_price,
            stock: faker.number.int({ min: 5, max: 450 })
        }
    })

    
}
const products = fakerProduct()
export { fakerProduct, products } 