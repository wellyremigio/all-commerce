const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001; // Usa a porta do Render ou 3001

server.use(middlewares);
server.use(router);

server.listen(port);