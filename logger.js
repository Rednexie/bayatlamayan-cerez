module.exports = (message, stack) => {
    console.log(stack)
    fetch(process.env.WHURL, {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
            content: message,
            color: 0xFF0000,       
            embeds: [
                {
                    fields: [
                        { name: "time", value: new Date().toLocaleString('tr-TR').replaceAll(':', '.') },
                        { name: "stack", value: stack.slice(0, 1024).replaceAll(':', ';') }
                    ]
                }
            ]
        })
    })
}