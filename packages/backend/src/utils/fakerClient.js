import { faker } from '@faker-js/faker';

function fakerCustomer() {
    const customers = Array.from({ length: 70 }, () => ({
        id_number: Math.floor(Math.random() * (30000000 - 3000000 + 1)) + 3000000,
        name: faker.person.fullName(),
        phone: faker.phone.number()

    }));

    return customers
}

export default fakerCustomer