function decrypt(encryptedText) {
    const decipher = require('crypto').createDecipheriv('aes-256-ecb', Buffer.from("13d60426-d8c7-46c4-a8b5-2cabe467"), null);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }


  console.log(decrypt(process.argv[2]))
