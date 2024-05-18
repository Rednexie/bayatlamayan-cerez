const Fastify = require('fastify')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs');


const crypto = require('crypto');
const logger = require('./logger')
const STATIC_KEY = process.env.KEY || "13d60426-d8c7-46c4-a8b5-2cabe467";



function encrypt(plaintext) {
  const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(STATIC_KEY), null);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}


function decrypt(encryptedText) {
    const decipher = require('crypto').createDecipheriv('aes-256-ecb', Buffer.from(STATIC_KEY), null);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}




const libSQL = new (require('libsql'))('cerez.sqlite')
const port = process.env.PORT || 3199;

const app = Fastify({
    trustProxy: true,
    bodyLimit: 10000,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
    logger: false
})
app.setErrorHandler((error, req, res) => {
    logger(error.message, error.stack)
})



app.register(require('@fastify/formbody'));
app.register(require('@fastify/view'), {
    engine: { ejs },
    root: path.join(__dirname, './views')
})
app.register(require('@fastify/static'), {
    root: path.join(__dirname, 'git'),
    prefix: "/.git",
    decorateReply: false,
})
app.register(require('@fastify/static'), {
    root: path.join(__dirname, 'static'),
})

app.register(require('@fastify/cookie'), {
    hook: "onRequest",
    secret: require('crypto').randomUUID(),
})


app.addHook('onSend', (request, reply, payload, done) => {
    // Set custom headers here
    reply.header('server', 'nginx/1.22.1');
    done();
  });

 
  app.get('/.git', async (req, res) => {

    const items = await fs.promises.readdir('./git');
    const files = await Promise.all(items.map(async item => {
        const stats = await fs.promises.stat(path.join(__dirname, './git', item));
        return {
            name: item,
            last: stats.mtime.toLocaleString()
        }
    }))
    return res.view('list', { files })
})

app.get('/err', (req, res) => {
    return err
})
app.get('/login', (req, res) => {
    res.view('login', { show: false, text: 'metin', title: "başık", icon: 'error', confirmButtonText: "conf" })
})
app.get('/signup', (req, res) => {
    res.view('signup', { show: false, text: 'metin', title: "başık", icon: 'error', confirmButtonText: "conf" })
})
app.get('/admin', (req, res) => {
    if(typeof req.cookies.leblebi !== "string") return res.status(401).send('Lütfen önce giriş yaptığınızdan emin olun')
    if(req.cookies.leblebi === "ZWY0ZTFlZDAtYzRmNi00YTRiLTk2ZTEtMGRhMjY3ZjRkM2Ex"){
        logger(req.ip + "flag")
        return res.send("bayrakbende{382dj82f9784ubnldasd3bayatlamayancerezibuldun3221qdqwtbagriyanik}");
    }
    else{
        const cookie = encrypt(req.cookies.leblebi)
        const row = libSQL.prepare('SELECT * FROM leblebi WHERE cerez = ?').get(cookie);
        if(row && row.cerez){
            return res.status(403).send('Lütfen yönetici kısmına erişiminiz olduğundan emin olun')
        }
        else{
            return res.status(400).send('Geçerli bir oturuma sahip olduğunuzdan emin olun')
        }
    }
})


app.get('/chat', (req, res) => {
    return res.view('chat')
})



app.get('/logout', (req, res) => {
    res.clearCookie('leblebi');
    return res.send('Başarıyla çıkış yaptınız.')
})




app.post('/login', (req, res) => {
    const { kullanici, parola } = req.body;
    if(typeof kullanici !== "string" || typeof parola !== "string") return res.view('login', { show: true, title: "Tüh!", icon: "error", text: "Kullanıcı adı ve parola alanları gereklidir. ", confirmButtonText: "tamam!"})
    
    try{
        const row = libSQL.prepare('SELECT * FROM leblebi WHERE kullanici_adi = ? AND parola = ?').get(kullanici, parola)
        if(!row) return res.view('login', { show: true, title: "Yok!", icon: "error", text: "Kullanıcı adı ve parola kombinasyonu eşleşmedi. ", confirmButtonText: "tamam!"})
        else {
            if(row.rol === 0) res.view('login', { show: true, title: "2FA", icon: "success", text: "yeni bir IP adresinden giriş yapmaktasınız, lütfen e-postanızı kontrol edin ", confirmButtonText: "tamam!"});
            if(row.rol === 1) return res.view('chat')
        }
    }catch(err){
        console.error(err)

        return res.view('login', { show: true, title: "Başarı", icon: 'success', text: "tüh", confirmButtonText: "tmm" })
    }
})  

app.post('/signup', (req, res) => {
    const { kullanici, parola, eposta } = req.body;

  if(typeof kullanici !== "string" || typeof parola !== "string" || typeof eposta !== "string") return res.view('login', { show: true, title: "Tüh!", icon: "error", text: "Kullanıcı adı ve parola alanları gereklidir. ", confirmButtonText: "tamam!"})
  const cerez = encrypt(btoa(require('crypto').randomUUID()));
  try{
    libSQL.prepare('INSERT INTO leblebi (kullanici_adi, parola, eposta, cerez, rol) VALUES (?, ?, ?, ?, ?)').run(kullanici, parola, eposta, cerez, 1)
  }
  catch(err){
    console.error(err);
    return res.view('login', { show: true, title: "Tüh!", icon: "error", text: "Girilen bilgilerde bir kullanıcı zaten var.", confirmButtonText: "tamam!"})
  }
  
  return res.view('login', { show: true, title: "Başarı!", icon: "success", text: "Kullanıcı başarıyla oluşturuldu!", confirmButtonText: "tamam!"})
      

})


app.listen({ host: "0.0.0.0", port }, (err, addr) => {
    if(err){
        console.error(err)
        app.close();
    }
})
