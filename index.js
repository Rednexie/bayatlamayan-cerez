const Fastify = require('fastify')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs');


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

//app.use('/.git', express.static('.git'))


app.addHook('onSend', (request, reply, payload, done) => {
    // Set custom headers here
    reply.header('server', 'nginx/1.22.1');
    done();
  });

 
  app.get('/.git', async (req, res) => {

    const items = await fs.promises.readdir('git');
    const files = await Promise.all(items.map(async item => {
        const stats = await fs.promises.stat(path.join(__dirname, './.git', item));
        return {
            name: item,
            last: stats.mtime.toLocaleString()
        }
    }))
    console.log(files)
    return res.render('list', { files })
})

app.listen({ host: "0.0.0.0", port: 3000 }, (err, addr) => {
    if(err){
        console.error(err)
        app.close();
    }
})
