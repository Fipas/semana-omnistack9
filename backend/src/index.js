const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes')
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(routes);

server.listen(3333);

connection_url = 'mongodb+srv://omnistack:mTqD3ygLSyDWKHTa@cluster0-93rpj.mongodb.net/week10?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});