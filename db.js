const faker = require('@faker-js/faker')



const adam = faker.fakerTR.person;
const username = adam.fullName().replace(' ', '_').toLowerCase()
const email = faker.internet.email()
const password = faker.fakerTR.internet.password()
