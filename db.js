const faker = require('@faker-js/faker')

const crypto = require('crypto');

const STATIC_KEY = "13d60426-d8c7-46c4-a8b5-2cabe467";


function encrypt(plaintext) {
  const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(STATIC_KEY), null);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

const adam = faker.fakerTR.person;
const username = adam.fullName().replace(' ', '_').toLowerCase()
const email = faker.fakerTR.internet.email()
const password = (faker.fakerTR.internet.password())
const cookie = encrypt(btoa(require('crypto').randomUUID()))
console.dir({
    username,
    email,
    password,
    cookie
})

