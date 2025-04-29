const http = require('http')
const PORT = process.env.PORT || 8000
const app = require('./shop/app')

const server = http.createServer(app)

server.listen(PORT)