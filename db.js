const faker = require('@faker-js/faker')

const crypto = require('crypto');

const STATIC_KEY = "13d60426-d8c7-46c4-a8b5-2cabe467";


const LibSQL = require('libsql')
const libsql = new LibSQL('cerez.sqlite')



libsql.exec(`
    CREATE TABLE IF NOT EXISTS leblebi(
        id INTEGER PRIMARY KEY,
        kullanici_adi TEXT NOT NULL UNIQUE,
        parola TEXT,
        cerez TEXT,
        eposta TEXT,
        rol INTEGER DEFAULT 0
    )
`)


function encrypt(plaintext) {
  const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(STATIC_KEY), null);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}


for (let i = 0; i < 500; i++) {
  const adam = faker.fakerTR.person;
  if(adam.fullName().toLowerCase().includes('dr') || adam.fullName().toLowerCase().includes('prof') || adam.fullName().toLowerCase().includes('bay')){

  }
  else{
    const username = faker.fakerTR.internet.userName().toLowerCase()
    const email = faker.fakerTR.internet.email().toLowerCase()
    const password = (faker.fakerTR.internet.password())
    const cookie = encrypt(btoa(require('crypto').randomUUID()))
    console.dir({
        username,
        email,
        password,
        cookie
    })

    libsql.prepare(`
    INSERT INTO leblebi (
      kullanici_adi,
      parola,
      cerez,
      eposta,
      rol
    )
    VALUES(
      ?, ?, ?, ?, ?
    )
    `).run(username, password, cookie, email, 0)
  }
  
}

