import { faker } from '@faker-js/faker';

/**
 * Generates a list of fake customers with the following fields: id_number, name, and phone.
 * @param {Number} count Number of fake customers to generate.
 * @returns {Array<{ id_number: number, name: string, phone: string }>} Array of fake customer objects.
 */
function fakerCustomer(count = 150) {
    const max = 30000000
    const min = 3000000
    const customers = Array.from({ length: count }, () => ({
        id_number: Math.floor(Math.random() * (max - min + 1)) + min,
        name: faker.person.fullName().toLowerCase(),
        phone: faker.phone.number()

    }));

    return customers
}
export default fakerCustomer 