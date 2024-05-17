const Fastify = require('fastify')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs');


const libSQL = new (require('libsql'))('cerez.sqlite')
const port = process.env.PORT || 3199;

const app = Fastify({
    trustProxy: true,
    bodyLimit: 10000,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
    logger: true
})


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


app.addHook('onSend', (request, reply, payload, done) => {
    // Set custom headers here
    reply.header('server', 'nginx/1.22.1');
    done();
  });

 
  app.get('/.git', async (req, res) => {

    const items = await fs.promises.readdir('./git');
    const files = await Promise.all(items.map(async item => {
        const stats = await fs.promises.stat(path.join(__dirname, './.git', item));
        return {
            name: item,
            last: stats.mtime.toLocaleString()
        }
    }))
    console.log(files)
    return res.view('list', { files })
})


app.get('/login', (req, res) => {
    res.view('login', { show: true, text: 'metin', title: "başık", icon: 'error', confirmButtonText: "conf" })
})
app.get('/signup', (req, res) => {
    res.view('login', { show: false, text: 'metin', title: "başık", icon: 'error', confirmButtonText: "conf" })
})


app.post('/login', (req, res) => {
    const { kullanici, parola } = req.body;
    if(typeof kullanici !== "string" || typeof parola !== "string") return res.render('login', { show: true, title: "Tüh!", icon: "error", text: "Kullanıcı adı ve parola alanları gereklidir. ", confirmButtonText: "tamam!"})
    
    try{
        libSQL.prepare
    }
})  


app.listen({ host: "0.0.0.0", port }, (err, addr) => {
    if(err){
        console.error(err)
        app.close();
    }
})
